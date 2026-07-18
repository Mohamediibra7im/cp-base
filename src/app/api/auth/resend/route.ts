import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email?.trim()) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const db = getDb();
    if (!db) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 500 });
    }

    const emailLower = email.trim().toLowerCase();

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

    // Generate new code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationExpires = new Date(Date.now() + 3600000); // 1 hour

    await db
      .update(users)
      .set({
        verificationCode,
        verificationExpires,
        verificationAttempts: 0,
      })
      .where(eq(users.id, user.id));

    try {
      await sendVerificationEmail(user.email, user.username, verificationCode);
    } catch (emailErr) {
      console.error("Failed to send verification email:", emailErr);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Resend error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
