import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Fallback contests in case of API failure or offline environments
const FALLBACK_CONTESTS = [
  {
    name: "Codeforces Round (Div. 2)",
    url: "https://codeforces.com/contests",
    start_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    duration: "7200",
    site: "Codeforces",
  },
  {
    name: "AtCoder Beginner Contest",
    url: "https://atcoder.jp/contests",
    start_time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    duration: "6000",
    site: "AtCoder",
  },
  {
    name: "LeetCode Weekly Contest",
    url: "https://leetcode.com/contest",
    start_time: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    duration: "5400",
    site: "LeetCode",
  },
  {
    name: "CodeChef Starters",
    url: "https://www.codechef.com/contests",
    start_time: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    duration: "10800",
    site: "CodeChef",
  }
];

export async function GET() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3500);

  try {
    const res = await fetch("https://kontests.net/api/v1/all", {
      signal: controller.signal,
      next: { revalidate: 300 }
    });

    clearTimeout(timeoutId);

    if (!res.ok) throw new Error("API returned non-200 status");

    const data = await res.json();
    if (!Array.isArray(data)) throw new Error("Invalid API response format");

    const filtered = data
      .filter((c: any) => {
        const site = (c.site || "").toLowerCase();
        return (
          site.includes("codeforces") ||
          site.includes("atcoder") ||
          site.includes("leetcode") ||
          site.includes("codechef")
        );
      })
      .map((c: any) => {
        let siteName = "Other";
        const site = (c.site || "").toLowerCase();
        if (site.includes("codeforces")) siteName = "Codeforces";
        else if (site.includes("atcoder")) siteName = "AtCoder";
        else if (site.includes("leetcode")) siteName = "LeetCode";
        else if (site.includes("codechef")) siteName = "CodeChef";

        return {
          name: c.name,
          url: c.url,
          start_time: c.start_time,
          duration: c.duration,
          site: siteName,
        };
      })
      .filter((c: any) => new Date(c.start_time).getTime() > Date.now())
      .sort((a: any, b: any) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
      .slice(0, 6);

    if (filtered.length === 0) {
      return NextResponse.json(FALLBACK_CONTESTS);
    }

    return NextResponse.json(filtered);
  } catch (err) {
    console.error("Contests fetch error, returning fallback data:", err);
    clearTimeout(timeoutId);
    return NextResponse.json(FALLBACK_CONTESTS);
  }
}
