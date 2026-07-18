import { NextResponse } from "next/server";
import { getDb, schema } from "@/db";
import { getSessionFromCookie } from "@/lib/auth";

export async function POST(request: Request) {
  const db = getDb();
  if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

  // Contributions are tied to an account: identity comes from the session, not
  // from client-supplied name/email, so credit can't be spoofed.
  const session = await getSessionFromCookie();
  if (!session) {
    return NextResponse.json({ error: "Sign in to contribute" }, { status: 401 });
  }

  const body = await request.json();

  const { type, contributorCfHandle } = body;
  const contributorName = session.username;
  const contributorEmail = session.email;

  if (!type || !["new", "edit"].includes(type)) {
    return NextResponse.json({ error: "Invalid contribution type" }, { status: 400 });
  }

  if (type === "new") {
    if (!body.title?.trim()) {
      return NextResponse.json({ error: "Template title is required" }, { status: 400 });
    }
    if (!body.codes || !Array.isArray(body.codes) || body.codes.length === 0) {
      return NextResponse.json({ error: "At least one code block is required" }, { status: 400 });
    }

    const slug = body.slug?.trim() || body.title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    const [row] = await db
      .insert(schema.contributions)
      .values({
        type: "new",
        userId: session.userId,
        contributorName,
        contributorEmail,
        contributorCfHandle: contributorCfHandle?.trim() || null,
        title: body.title.trim(),
        slug,
        description: body.description?.trim() || "",
        categoryId: body.categoryId ? Number(body.categoryId) : null,
        tags: Array.isArray(body.tags) ? body.tags : [],
        complexity: body.complexity?.trim() || null,
        notes: body.notes?.trim() || null,
        codes: body.codes,
      })
      .returning();

    return NextResponse.json({ id: row.id, message: "Submission received" }, { status: 201 });
  }

  if (type === "edit") {
    if (!body.templateId) {
      return NextResponse.json({ error: "Template ID is required for edit requests" }, { status: 400 });
    }
    if (!body.editReason?.trim()) {
      return NextResponse.json({ error: "Edit reason is required" }, { status: 400 });
    }

    const [row] = await db
      .insert(schema.contributions)
      .values({
        type: "edit",
        userId: session.userId,
        contributorName,
        contributorEmail,
        contributorCfHandle: contributorCfHandle?.trim() || null,
        templateId: Number(body.templateId),
        editReason: body.editReason.trim(),
        editCodes: body.editCodes || null,
        editNotes: body.editNotes?.trim() || null,
      })
      .returning();

    return NextResponse.json({ id: row.id, message: "Edit request received" }, { status: 201 });
  }

  return NextResponse.json({ error: "Unknown type" }, { status: 400 });
}
