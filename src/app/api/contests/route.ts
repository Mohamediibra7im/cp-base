import { NextResponse } from "next/server";
import {
  fetchContests,
  fetchCodeforces,
  fetchAtCoder,
  fetchLeetCode,
  fetchCodeChef,
  type Contest,
} from "@/lib/contests";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const platform = searchParams.get("platform");

  try {
    let contests: Contest[] = [];

    if (!platform || platform === "all") {
      contests = await fetchContests(["codeforces", "atcoder", "leetcode", "codechef"]);
    } else {
      switch (platform) {
        case "codeforces":
          contests = await fetchCodeforces();
          break;
        case "atcoder":
          contests = await fetchAtCoder();
          break;
        case "leetcode":
          contests = await fetchLeetCode();
          break;
        case "codechef":
          contests = await fetchCodeChef();
          break;
      }
    }

    return NextResponse.json(contests, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60" },
    });
  } catch (err) {
    console.error("Contests fetch error:", err);
    return NextResponse.json([]);
  }
}
