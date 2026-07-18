import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { userCollections } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { getSessionFromCookie } from "@/lib/auth";

export async function GET() {
  const session = await getSessionFromCookie();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getDb();
  if (!db) return NextResponse.json({ error: "Database unavailable" }, { status: 500 });

  const collections = await db
    .select({
      id: userCollections.id,
      name: userCollections.name,
      description: userCollections.description,
      createdAt: userCollections.createdAt,
      itemCount: sql<number>`(SELECT COUNT(*) FROM user_collection_items WHERE collection_id = ${userCollections.id})`,
    })
    .from(userCollections)
    .where(eq(userCollections.userId, session.userId));

  return NextResponse.json({ collections });
}

export async function POST(request: Request) {
  const session = await getSessionFromCookie();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, description } = await request.json();
  if (!name?.trim()) {
    return NextResponse.json({ error: "Collection name is required" }, { status: 400 });
  }

  const db = getDb();
  if (!db) return NextResponse.json({ error: "Database unavailable" }, { status: 500 });

  const [collection] = await db
    .insert(userCollections)
    .values({
      userId: session.userId,
      name: name.trim(),
      description: description?.trim() || null,
    })
    .returning();

  return NextResponse.json({ success: true, collection });
}

export async function DELETE(request: Request) {
  const session = await getSessionFromCookie();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: "Collection id is required" }, { status: 400 });

  const db = getDb();
  if (!db) return NextResponse.json({ error: "Database unavailable" }, { status: 500 });

  await db
    .delete(userCollections)
    .where(and(eq(userCollections.id, id), eq(userCollections.userId, session.userId)));

  return NextResponse.json({ success: true });
}
