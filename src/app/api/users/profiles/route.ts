import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { userProfiles, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSessionFromCookie, getVerificationToken } from "@/lib/auth";

export async function GET() {
  const session = await getSessionFromCookie();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getDb();
  if (!db) return NextResponse.json({ error: "Database unavailable" }, { status: 500 });

  const [profile] = await db
    .select({
      id: userProfiles.id,
      userId: userProfiles.userId,
      codeforcesHandle: userProfiles.codeforcesHandle,
      atcoderHandle: userProfiles.atcoderHandle,
      leetcodeHandle: userProfiles.leetcodeHandle,
      codechefHandle: userProfiles.codechefHandle,
      ratingGoal: userProfiles.ratingGoal,
      updatedAt: userProfiles.updatedAt,
      calendarToken: users.calendarToken,
    })
    .from(userProfiles)
    .innerJoin(users, eq(userProfiles.userId, users.id))
    .where(eq(userProfiles.userId, session.userId))
    .limit(1);

  return NextResponse.json({
    profile: profile
      ? { ...profile, verificationToken: await getVerificationToken(session.userId) }
      : null,
  });
}

export async function PUT(request: Request) {
  const session = await getSessionFromCookie();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const db = getDb();
  if (!db) return NextResponse.json({ error: "Database unavailable" }, { status: 500 });

  await db
    .update(userProfiles)
    .set({
      codeforcesHandle: body.codeforcesHandle?.trim() || null,
      atcoderHandle: body.atcoderHandle?.trim() || null,
      leetcodeHandle: body.leetcodeHandle?.trim() || null,
      codechefHandle: body.codechefHandle?.trim() || null,
      ratingGoal: body.ratingGoal?.trim() || null,
      updatedAt: new Date(),
    })
    .where(eq(userProfiles.userId, session.userId));

  return NextResponse.json({ success: true });
}
