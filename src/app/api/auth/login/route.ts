import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  verifyPassword,
  createSession,
  setSessionCookie,
} from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { login, password } = await request.json();

    if (!login?.trim() || !password?.trim()) {
      return NextResponse.json(
        { error: "Login and password are required" },
        { status: 400 }
      );
    }

    const db = getDb();
    if (!db) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 500 });
    }

    const loginLower = login.trim().toLowerCase();

    // Find user by username or email
    const [user] = await db
      .select()
      .from(users)
      .where(
        loginLower.includes("@")
          ? eq(users.email, loginLower)
          : eq(users.username, loginLower)
      )
      .limit(1);

    if (!user || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    if (!user.emailVerified) {
      return NextResponse.json(
        { error: "Email not verified. Please verify your email first.", needsVerification: true, email: user.email },
        { status: 403 }
      );
    }

    // Create session
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
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
