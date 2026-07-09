import { NextResponse } from "next/server";
import { getDb, schema } from "@/db";
import { eq, sql } from "drizzle-orm";

export async function POST(request: Request) {
  const db = getDb();
  if (!db) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

  try {
    const body = await request.json();
    const { templateId, action } = body;

    if (!templateId) {
      return NextResponse.json({ error: "Missing templateId" }, { status: 400 });
    }

    const isUnlike = action === "unlike";

    await db
      .update(schema.templates)
      .set({
        likeCount: isUnlike
          ? sql`GREATEST(0, ${schema.templates.likeCount} - 1)`
          : sql`${schema.templates.likeCount} + 1`,
      })
      .where(eq(schema.templates.id, Number(templateId)));

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
