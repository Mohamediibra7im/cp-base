// Shared upcoming-contest fetchers for the four supported platforms.
// Used by the public /api/contests route and the per-user ICS calendar feed.

export interface Contest {
  name: string;
  url: string;
  start_time: string;
  duration: string;
  site: string;
  rated?: string;
  code?: string;
}

export type ContestPlatform = "codeforces" | "atcoder" | "leetcode" | "codechef";

export async function fetchCodeforces(): Promise<Contest[]> {
  const res = await fetch("https://codeforces.com/api/contest.list", {
    next: { revalidate: 300 },
  });
  if (!res.ok) return [];
  const data = await res.json();
  if (data.status !== "OK" || !Array.isArray(data.result)) return [];

  return data.result
    .filter((c: { phase: string }) => c.phase === "BEFORE")
    .map((c: { id: number; name: string; startTimeSeconds: number; durationSeconds: number }) => ({
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

export async function fetchAtCoder(): Promise<Contest[]> {
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

export async function fetchLeetCode(): Promise<Contest[]> {
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
    .filter((c: { startTime: number }) => c.startTime * 1000 > now)
    .sort((a: { startTime: number }, b: { startTime: number }) => a.startTime - b.startTime)
    .map((c: { title: string; startTime: number; duration: number; titleSlug: string }) => ({
      name: c.title,
      url: `https://leetcode.com/contest/${c.titleSlug}`,
      start_time: new Date(c.startTime * 1000).toISOString(),
      duration: String(c.duration),
      site: "LeetCode",
    }));
}

export async function fetchCodeChef(): Promise<Contest[]> {
  const res = await fetch(
    "https://www.codechef.com/api/list/contests/all?sort_by=START&sorting_order=asc&offset=0&mode=all",
    { next: { revalidate: 300 } }
  );
  if (!res.ok) return [];
  const data = await res.json();

  const contests: Contest[] = [];
  const mapCC = (c: {
    contest_name: string;
    contest_code: string;
    contest_start_date_iso?: string;
    contest_start_date: string;
    contest_duration: string;
  }) => ({
    name: c.contest_name,
    url: `https://www.codechef.com/${c.contest_code}`,
    start_time: new Date(c.contest_start_date_iso || c.contest_start_date).toISOString(),
    duration: String(Number(c.contest_duration) * 60),
    site: "CodeChef",
    code: c.contest_code,
  });
  for (const c of data.future_contests || []) contests.push(mapCC(c));
  for (const c of data.present_contests || []) contests.push(mapCC(c));
  return contests;
}

const FETCHERS: Record<ContestPlatform, () => Promise<Contest[]>> = {
  codeforces: fetchCodeforces,
  atcoder: fetchAtCoder,
  leetcode: fetchLeetCode,
  codechef: fetchCodeChef,
};

// Fetches contests for the given platforms in parallel, tolerating
// individual platform failures.
export async function fetchContests(platforms: ContestPlatform[]): Promise<Contest[]> {
  const results = await Promise.all(
    platforms.map((p) => FETCHERS[p]().catch(() => [] as Contest[]))
  );
  return results.flat();
}
