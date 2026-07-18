import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { templateLikes, templates, categories } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { getSessionFromCookie } from "@/lib/auth";

// The templates the signed-in user has liked, newest first. Hidden templates
// are filtered out so the list only shows pages the user can actually open.
export async function GET() {
  const session = await getSessionFromCookie();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getDb();
  if (!db) return NextResponse.json({ error: "Database unavailable" }, { status: 500 });

  const rows = await db
    .select({
      id: templateLikes.id,
      templateId: templates.id,
      templateTitle: templates.title,
      templateSlug: templates.slug,
      categoryName: categories.name,
      likeCount: templates.likeCount,
      likedAt: templateLikes.createdAt,
    })
    .from(templateLikes)
    .innerJoin(templates, eq(templateLikes.templateId, templates.id))
    .leftJoin(categories, eq(templates.categoryId, categories.id))
    .where(and(eq(templateLikes.userId, session.userId), eq(templates.hidden, false)))
    .orderBy(desc(templateLikes.createdAt));

  return NextResponse.json({ liked: rows });
}
