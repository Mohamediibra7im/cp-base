import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { userTemplates, templates } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getSessionFromCookie } from "@/lib/auth";

export async function GET() {
  const session = await getSessionFromCookie();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getDb();
  if (!db) return NextResponse.json({ error: "Database unavailable" }, { status: 500 });

  const items = await db
    .select({
      id: userTemplates.id,
      templateId: userTemplates.templateId,
      templateTitle: templates.title,
      templateSlug: templates.slug,
      customCode: userTemplates.customCode,
      language: userTemplates.language,
      updatedAt: userTemplates.updatedAt,
    })
    .from(userTemplates)
    .innerJoin(templates, eq(userTemplates.templateId, templates.id))
    .where(eq(userTemplates.userId, session.userId));

  return NextResponse.json({ templates: items });
}

export async function POST(request: Request) {
  const session = await getSessionFromCookie();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { templateId, customCode, language } = await request.json();

  if (!templateId || !customCode?.trim()) {
    return NextResponse.json({ error: "templateId and customCode are required" }, { status: 400 });
  }

  const db = getDb();
  if (!db) return NextResponse.json({ error: "Database unavailable" }, { status: 500 });

  // Upsert: check if an entry already exists
  const existing = await db
    .select()
    .from(userTemplates)
    .where(and(eq(userTemplates.userId, session.userId), eq(userTemplates.templateId, templateId)))
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(userTemplates)
      .set({ customCode: customCode.trim(), language: language || "cpp", updatedAt: new Date() })
      .where(eq(userTemplates.id, existing[0].id));

    return NextResponse.json({ success: true, action: "updated" });
  }

  await db.insert(userTemplates).values({
    userId: session.userId,
    templateId,
    customCode: customCode.trim(),
    language: language || "cpp",
  });

  return NextResponse.json({ success: true, action: "created" });
}
