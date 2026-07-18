import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { users, userProfiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword, generateCalendarToken } from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/email";

// Postgres unique_violation error code is 23505.
function isUniqueViolation(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code?: string }).code === "23505"
  );
}

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();

    if (!username?.trim() || !email?.trim() || !password?.trim()) {
      return NextResponse.json(
        { error: "Username, email, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const db = getDb();
    if (!db) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 500 });
    }

    // Check for existing user
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.username, username.trim().toLowerCase()))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json({ error: "Username already taken" }, { status: 409 });
    }

    const existingEmail = await db
      .select()
      .from(users)
      .where(eq(users.email, email.trim().toLowerCase()))
      .limit(1);

    if (existingEmail.length > 0) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    // Generate 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationExpires = new Date(Date.now() + 3600000); // 1 hour from now

    // Create user
    const passwordHash = hashPassword(password);
    const calendarToken = generateCalendarToken();

    let newUser;
    try {
      [newUser] = await db
        .insert(users)
        .values({
          username: username.trim().toLowerCase(),
          email: email.trim().toLowerCase(),
          passwordHash,
          calendarToken,
          emailVerified: false,
          verificationCode,
          verificationExpires,
        })
        .returning();
    } catch (insertErr) {
      // Unique constraint race: another request registered the same
      // username/email between our pre-check and this insert.
      if (isUniqueViolation(insertErr)) {
        return NextResponse.json(
          { error: "Username or email already registered" },
          { status: 409 }
        );
      }
      throw insertErr;
    }

    // Create default profile
    await db.insert(userProfiles).values({
      userId: newUser.id,
    });

    // Send verification email
    try {
      await sendVerificationEmail(newUser.email, newUser.username, verificationCode);
    } catch (emailErr) {
      console.error("Failed to send verification email:", emailErr);
      // We don't fail registration here, but inform they need verification
    }

    return NextResponse.json({
      success: true,
      needsVerification: true,
      email: newUser.email,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
