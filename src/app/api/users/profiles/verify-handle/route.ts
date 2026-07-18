import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { userProfiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSessionFromCookie, getVerificationToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getSessionFromCookie();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { platform, handle } = await request.json();

    if (!platform || !handle?.trim()) {
      return NextResponse.json({ error: "Platform and handle are required" }, { status: 400 });
    }

    const cleanHandle = handle.trim();

    const db = getDb();
    if (!db) return NextResponse.json({ error: "Database unavailable" }, { status: 500 });

    const token = await getVerificationToken(session.userId);
    if (!token) return NextResponse.json({ error: "Database unavailable" }, { status: 500 });

    let verified = false;
    let detailError = "";

    if (platform === "codeforces") {
      try {
        const res = await fetch(`https://codeforces.com/api/user.info?handles=${encodeURIComponent(cleanHandle)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.status === "OK" && data.result?.[0]) {
            const user = data.result[0];
            const nameMatch =
              user.firstName?.toUpperCase().includes(token) ||
              user.lastName?.toUpperCase().includes(token) ||
              user.organization?.toUpperCase().includes(token);
            if (nameMatch) {
              verified = true;
            } else {
              detailError = `Verification token not found on profile. Current Name: "${user.firstName || ""} ${user.lastName || ""}", Organization: "${user.organization || ""}".`;
            }
          } else {
            detailError = "Handle not found on Codeforces";
          }
        } else {
          detailError = "Codeforces API did not respond successfully";
        }
      } catch {
        detailError = "Network error connecting to Codeforces";
      }
    } else if (platform === "atcoder") {
      try {
        const res = await fetch(`https://atcoder.jp/users/${encodeURIComponent(cleanHandle)}`);
        if (res.ok) {
          const html = await res.text();
          if (html.toUpperCase().includes(token)) {
            verified = true;
          } else {
            detailError = `Verification token "${token}" was not found on your AtCoder profile page. Make sure you set it in your Affiliation or Bio.`;
          }
        } else {
          detailError = "AtCoder user profile not found or server error";
        }
      } catch {
        detailError = "Network error connecting to AtCoder";
      }
    } else if (platform === "leetcode") {
      try {
        const query = `
          query getUserProfile($username: String!) {
            matchedUser(username: $username) {
              username
              profile {
                aboutMe
              }
            }
          }
        `;
        const res = await fetch("https://leetcode.com/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
            "Referer": "https://leetcode.com",
          },
          body: JSON.stringify({
            query,
            variables: { username: cleanHandle },
          }),
        });

        if (res.ok) {
          const json = await res.json();
          const aboutMe = json?.data?.matchedUser?.profile?.aboutMe || "";
          if (aboutMe.toUpperCase().includes(token.toUpperCase())) {
            verified = true;
          } else {
            detailError = `Verification token "${token}" was not found in your LeetCode profile "ReadMe" or "About Me" section.`;
          }
        } else {
          detailError = "LeetCode user profile not found or GraphQL server error";
        }
      } catch {
        detailError = "Network error connecting to LeetCode";
      }
    } else if (platform === "codechef") {
      try {
        const res = await fetch(`https://www.codechef.com/users/${encodeURIComponent(cleanHandle)}`);
        if (res.ok) {
          const html = await res.text();
          if (html.toUpperCase().includes(token)) {
            verified = true;
          } else {
            detailError = `Verification token "${token}" was not found on your CodeChef profile page.`;
          }
        } else {
          detailError = "CodeChef profile page not found or server error";
        }
      } catch {
        detailError = "Network error connecting to CodeChef";
      }
    } else {
      return NextResponse.json({ error: "Unsupported platform" }, { status: 400 });
    }

    if (verified) {
      // Update database profile
      const [profile] = await db
        .select()
        .from(userProfiles)
        .where(eq(userProfiles.userId, session.userId))
        .limit(1);

      const updates: Partial<typeof userProfiles.$inferInsert> = { updatedAt: new Date() };
      if (platform === "codeforces") updates.codeforcesHandle = cleanHandle;
      if (platform === "atcoder") updates.atcoderHandle = cleanHandle;
      if (platform === "leetcode") updates.leetcodeHandle = cleanHandle;
      if (platform === "codechef") updates.codechefHandle = cleanHandle;

      if (profile) {
        await db.update(userProfiles).set(updates).where(eq(userProfiles.userId, session.userId));
      } else {
        await db.insert(userProfiles).values({ userId: session.userId, ...updates });
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: detailError });
  } catch (error) {
    console.error("Handle verification error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
