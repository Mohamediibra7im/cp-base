import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { userProgress, templates } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getSessionFromCookie } from "@/lib/auth";

const VALID_STATUSES = ["learning", "implemented", "mastered"];

export async function GET() {
  const session = await getSessionFromCookie();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getDb();
  if (!db) return NextResponse.json({ error: "Database unavailable" }, { status: 500 });

  const items = await db
    .select({
      id: userProgress.id,
      templateId: userProgress.templateId,
      templateTitle: templates.title,
      templateSlug: templates.slug,
      status: userProgress.status,
      updatedAt: userProgress.updatedAt,
    })
    .from(userProgress)
    .innerJoin(templates, eq(userProgress.templateId, templates.id))
    .where(eq(userProgress.userId, session.userId));

  return NextResponse.json({ progress: items });
}

export async function POST(request: Request) {
  const session = await getSessionFromCookie();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { templateId, status } = await request.json();
  if (!templateId || !status) {
    return NextResponse.json({ error: "templateId and status are required" }, { status: 400 });
  }
  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: `status must be one of: ${VALID_STATUSES.join(", ")}` }, { status: 400 });
  }

  const db = getDb();
  if (!db) return NextResponse.json({ error: "Database unavailable" }, { status: 500 });

  const existing = await db
    .select()
    .from(userProgress)
    .where(and(eq(userProgress.userId, session.userId), eq(userProgress.templateId, templateId)))
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(userProgress)
      .set({ status, updatedAt: new Date() })
      .where(eq(userProgress.id, existing[0].id));

    return NextResponse.json({ success: true, action: "updated" });
  }

  await db.insert(userProgress).values({
    userId: session.userId,
    templateId,
    status,
  });

  return NextResponse.json({ success: true, action: "created" });
}
