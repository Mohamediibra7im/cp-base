import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createSession, setSessionCookie, safeEqual } from "@/lib/auth";

const MAX_VERIFICATION_ATTEMPTS = 5;

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();

    if (!email?.trim() || !code?.trim()) {
      return NextResponse.json(
        { error: "Email and verification code are required" },
        { status: 400 }
      );
    }

    const db = getDb();
    if (!db) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 500 });
    }

    const emailLower = email.trim().toLowerCase();

    // Fetch user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, emailLower))
      .limit(1);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.emailVerified) {
      return NextResponse.json({ error: "Email is already verified" }, { status: 400 });
    }

    if (user.verificationAttempts >= MAX_VERIFICATION_ATTEMPTS) {
      return NextResponse.json(
        { error: "Too many attempts. Please request a new verification code." },
        { status: 429 }
      );
    }

    if (user.verificationExpires && new Date() > user.verificationExpires) {
      return NextResponse.json({ error: "Verification code has expired" }, { status: 400 });
    }

    if (!user.verificationCode || !safeEqual(user.verificationCode, code.trim())) {
      await db
        .update(users)
        .set({ verificationAttempts: user.verificationAttempts + 1 })
        .where(eq(users.id, user.id));
      return NextResponse.json({ error: "Invalid verification code" }, { status: 400 });
    }

    // Verify user in db
    await db
      .update(users)
      .set({
        emailVerified: true,
        verificationCode: null,
        verificationExpires: null,
        verificationAttempts: 0,
      })
      .where(eq(users.id, user.id));

    // Sign session and set cookie
    const token = await createSession({
      userId: user.id,
      username: user.username,
      email: user.email,
    });

    await setSessionCookie(token);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
