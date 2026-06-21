import { NextResponse } from "next/server";
import { getDb, schema } from "@/db";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function GET(request: Request) {
  const db = getDb();
  if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get("categoryId");

  const where = categoryId ? eq(schema.templates.categoryId, Number(categoryId)) : undefined;

  const rows = await db.query.templates.findMany({
    where,
    with: { category: true, codes: true },
    orderBy: (t, { desc }) => [desc(t.createdAt)],
  });

  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const db = getDb();
  if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

  const body = await request.json();

  const [template] = await db.insert(schema.templates).values({
    title: body.title,
    slug: body.slug,
    description: body.description || "",
    categoryId: body.categoryId,
    tags: body.tags || [],
    complexity: body.complexity || "",
    notes: body.notes || "",
  }).returning();

  if (body.codes && template) {
    await db.insert(schema.templateCodes).values(
      body.codes.map((c: { language: string; code: string }) => ({
        templateId: template.id,
        language: c.language,
        code: c.code,
      }))
    );
  }

  revalidatePath("/");
  revalidatePath("/category/[slug]");
  revalidatePath("/template/[slug]");

  return NextResponse.json(template, { status: 201 });
}

export async function PUT(request: Request) {
  const db = getDb();
  if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

  const body = await request.json();

  await db.update(schema.templates)
    .set({
      title: body.title,
      slug: body.slug,
      description: body.description,
      categoryId: body.categoryId,
      tags: body.tags,
      complexity: body.complexity,
      notes: body.notes,
      updatedAt: new Date(),
    })
    .where(eq(schema.templates.id, body.id));

  if (body.codes) {
    await db.delete(schema.templateCodes).where(eq(schema.templateCodes.templateId, body.id));
    await db.insert(schema.templateCodes).values(
      body.codes.map((c: { language: string; code: string }) => ({
        templateId: body.id,
        language: c.language,
        code: c.code,
      }))
    );
  }

  revalidatePath("/");
  revalidatePath("/category/[slug]");
  revalidatePath("/template/[slug]");

  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const db = getDb();
  if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await db.delete(schema.templates).where(eq(schema.templates.id, Number(id)));

  revalidatePath("/");
  revalidatePath("/category/[slug]");

  return NextResponse.json({ success: true });
}
