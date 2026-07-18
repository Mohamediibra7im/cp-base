import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { contributions, templates } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { getSessionFromCookie } from "@/lib/auth";

// The submissions belonging to the signed-in user, newest first. Includes the
// live template slug for approved ones so the UI can link to the published page.
export async function GET() {
  const session = await getSessionFromCookie();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getDb();
  if (!db) return NextResponse.json({ error: "Database unavailable" }, { status: 500 });

  const rows = await db
    .select({
      id: contributions.id,
      type: contributions.type,
      status: contributions.status,
      title: contributions.title,
      adminNote: contributions.adminNote,
      createdAt: contributions.createdAt,
      reviewedAt: contributions.reviewedAt,
      templateId: contributions.templateId,
      templateTitle: templates.title,
      templateSlug: templates.slug,
    })
    .from(contributions)
    .leftJoin(templates, eq(contributions.templateId, templates.id))
    .where(eq(contributions.userId, session.userId))
    .orderBy(desc(contributions.createdAt));

  return NextResponse.json({ contributions: rows });
}
