import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface Contest {
  name: string;
  url: string;
  start_time: string;
  duration: string;
  site: string;
  rated?: string;
  code?: string;
}

async function fetchCodeforces(): Promise<Contest[]> {
  const res = await fetch("https://codeforces.com/api/contest.list", {
    next: { revalidate: 300 },
  });
  if (!res.ok) return [];
  const data = await res.json();
  if (data.status !== "OK" || !Array.isArray(data.result)) return [];

  return data.result
    .filter((c: any) => c.phase === "BEFORE")
    .map((c: any) => ({
      name: c.name,
      url: `https://codeforces.com/contest/${c.id}`,
      start_time: new Date(c.startTimeSeconds * 1000).toISOString(),
      duration: String(c.durationSeconds),
      site: "Codeforces",
    }))
    .sort(
      (a: Contest, b: Contest) =>
        new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
    );
}

async function fetchAtCoder(): Promise<Contest[]> {
  const res = await fetch("https://atcoder.jp/contests/?lang=en", {
    next: { revalidate: 300 },
  });
  if (!res.ok) return [];
  const html = await res.text();

  const upcomingMatch = html.match(
    /Upcoming Contests[\s\S]*?<tbody>([\s\S]*?)<\/tbody>/i
  );
  if (!upcomingMatch) return [];

  const rows = upcomingMatch[1].match(/<tr[\s\S]*?<\/tr>/gi) || [];
  return rows.map((row) => {
    const tds = row.match(/<td[^>]*>([\s\S]*?)<\/td>/g) || [];
    const timeStr = (tds[0]?.match(/<time[^>]*>(.*?)<\/time>/) || [])[1] || "";
    const nameMatch = tds[1]?.match(
      /<a href="(\/contests\/[^"]+)"[^>]*>(.*?)<\/a>/
    );
    const href = nameMatch?.[1] || "";
    const name = (nameMatch?.[2] || "").replace(/^[Ⓐ-Ⓩ◉◎\s]+/, "").trim();
    const durationText = tds[2]?.replace(/<[^>]+>/g, "").trim() || "";
    const rated = tds[3]?.replace(/<[^>]+>/g, "").trim() || "";

    const [dH, dM] = durationText.split(":").map(Number);
    const durationSecs = ((dH || 0) * 3600 + (dM || 0) * 60).toString();

    return {
      name,
      url: `https://atcoder.jp${href}`,
      start_time: new Date(timeStr).toISOString(),
      duration: durationSecs,
      site: "AtCoder",
      rated,
    };
  });
}

async function fetchLeetCode(): Promise<Contest[]> {
  const res = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: "{ allContests { title startTime duration titleSlug } }",
    }),
    next: { revalidate: 300 },
  });
  if (!res.ok) return [];
  const data = await res.json();
  if (!data?.data?.allContests) return [];

  const now = Date.now();
  return data.data.allContests
    .filter((c: any) => c.startTime * 1000 > now)
    .sort((a: any, b: any) => a.startTime - b.startTime)
    .map((c: any) => ({
      name: c.title,
      url: `https://leetcode.com/contest/${c.titleSlug}`,
      start_time: new Date(c.startTime * 1000).toISOString(),
      duration: String(c.duration),
      site: "LeetCode",
    }));
}

async function fetchCodeChef(): Promise<Contest[]> {
  const res = await fetch(
    "https://www.codechef.com/api/list/contests/all?sort_by=START&sorting_order=asc&offset=0&mode=all",
    { next: { revalidate: 300 } }
  );
  if (!res.ok) return [];
  const data = await res.json();

  const contests: Contest[] = [];
  for (const c of data.future_contests || []) {
    contests.push({
      name: c.contest_name,
      url: `https://www.codechef.com/${c.contest_code}`,
      start_time: new Date(c.contest_start_date_iso || c.contest_start_date).toISOString(),
      duration: String(Number(c.contest_duration) * 60),
      site: "CodeChef",
      code: c.contest_code,
    });
  }
  for (const c of data.present_contests || []) {
    contests.push({
      name: c.contest_name,
      url: `https://www.codechef.com/${c.contest_code}`,
      start_time: new Date(c.contest_start_date_iso || c.contest_start_date).toISOString(),
      duration: String(Number(c.contest_duration) * 60),
      site: "CodeChef",
      code: c.contest_code,
    });
  }
  return contests;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const platform = searchParams.get("platform");

  try {
    let contests: Contest[] = [];

    if (!platform || platform === "all") {
      const [cf, at, lc, cc] = await Promise.all([
        fetchCodeforces().catch(() => []),
        fetchAtCoder().catch(() => []),
        fetchLeetCode().catch(() => []),
        fetchCodeChef().catch(() => []),
      ]);
      contests = [...cf, ...at, ...lc, ...cc];
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
