import { NextResponse } from "next/server";
import { getDb, schema } from "@/db";
import { desc, eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { snapshotTemplate } from "@/lib/template-history";

export const dynamic = "force-dynamic";

// GET /api/admin/templates/history?templateId=123  -> list snapshots (newest first)
export async function GET(request: Request) {
  const db = getDb();
  if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

  const { searchParams } = new URL(request.url);
  const templateId = searchParams.get("templateId");
  if (!templateId) return NextResponse.json({ error: "Missing templateId" }, { status: 400 });

  // Order by id (monotonic insertion order) — createdAt can tie between
  // snapshots captured within the same instant and reorder unpredictably.
  const rows = await db
    .select()
    .from(schema.templateHistory)
    .where(eq(schema.templateHistory.templateId, Number(templateId)))
    .orderBy(desc(schema.templateHistory.id));

  return NextResponse.json(rows, {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}

// POST /api/admin/templates/history  { historyId }  -> revert template to that snapshot
export async function POST(request: Request) {
  const db = getDb();
  if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

  const body = await request.json();
  const historyId = Number(body.historyId);
  if (!historyId) return NextResponse.json({ error: "Missing historyId" }, { status: 400 });

  const [snap] = await db
    .select()
    .from(schema.templateHistory)
    .where(eq(schema.templateHistory.id, historyId));

  if (!snap) return NextResponse.json({ error: "History entry not found" }, { status: 404 });

  const [current] = await db
    .select()
    .from(schema.templates)
    .where(eq(schema.templates.id, snap.templateId));

  if (!current) return NextResponse.json({ error: "Template no longer exists" }, { status: 404 });

  // Snapshot the current state first, so the revert itself is undoable.
  await snapshotTemplate(db, snap.templateId, "Before revert");

  try {
    await db
      .update(schema.templates)
      .set({
        title: snap.title,
        slug: snap.slug,
        description: snap.description,
        categoryId: snap.categoryId ?? current.categoryId,
        tags: snap.tags,
        complexity: snap.complexity,
        notes: snap.notes,
        hidden: snap.hidden,
        contributorName: snap.contributorName,
        contributorCfHandle: snap.contributorCfHandle,
        updatedAt: new Date(),
      })
      .where(eq(schema.templates.id, snap.templateId));
  } catch (e) {
    console.error("Failed to revert template:", e);
    return NextResponse.json(
      { error: "Failed to revert. The saved slug may now conflict with another template." },
      { status: 500 }
    );
  }

  // Restore code blocks
  const codes = (snap.codes as Array<{ language: string; code: string }> | null) || [];
  await db.delete(schema.templateCodes).where(eq(schema.templateCodes.templateId, snap.templateId));
  if (codes.length > 0) {
    await db.insert(schema.templateCodes).values(
      codes.map((c) => ({
        templateId: snap.templateId,
        language: c.language,
        code: c.code,
      }))
    );
  }

  revalidatePath("/");
  revalidatePath("/templates");
  revalidatePath(`/template/${snap.slug}`);
  if (current.slug !== snap.slug) revalidatePath(`/template/${current.slug}`);

  return NextResponse.json({ success: true, slug: snap.slug });
}

// DELETE /api/admin/templates/history  -> delete one or many history snapshots
//   ?id=5                          single
//   body { ids: [1,2,3] }          bulk
export async function DELETE(request: Request) {
  const db = getDb();
  if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

  const { searchParams } = new URL(request.url);
  const singleId = searchParams.get("id");

  let ids: number[] = [];
  if (singleId) {
    ids = [Number(singleId)];
  } else {
    const body = await request.json().catch(() => ({}));
    if (Array.isArray(body.ids)) ids = body.ids.map(Number).filter((n: number) => !Number.isNaN(n));
  }

  if (ids.length === 0) return NextResponse.json({ error: "No history ids provided" }, { status: 400 });

  const deleted = await db
    .delete(schema.templateHistory)
    .where(inArray(schema.templateHistory.id, ids))
    .returning({ id: schema.templateHistory.id });

  return NextResponse.json({ success: true, deleted: deleted.length });
}
