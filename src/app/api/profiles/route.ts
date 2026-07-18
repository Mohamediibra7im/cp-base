import { NextResponse } from "next/server";
import { createHash } from "crypto";

export const dynamic = "force-dynamic";

// Simple in-memory cache to prevent hitting external API rate limits on every page load
let cachedData: unknown = null;
let cacheTime = 0;
const CACHE_DURATION = 1000 * 60 * 5; // 5 minutes cache

export async function GET() {
  const now = Date.now();
  if (cachedData && now - cacheTime < CACHE_DURATION) {
    return NextResponse.json(cachedData);
  }

  const cfHandle = process.env.CODEFORCES_HANDLE || "MIDORIYA_";
  const acHandle = process.env.ATCODER_HANDLE || "Midoriya_Izuku";
  const lcHandle = process.env.LEETCODE_HANDLE || "Mohamediibra7im";

  // Codeforces API auth (optional but avoids rate limits)
  const cfKey = process.env.CF_KEY || "";
  const cfSecret = process.env.CF_SECRET || "";

  interface ProfileResult {
    handle: string;
    rating: number | null;
    rank: string | null;
    solved: number | null;
    active: boolean;
  }

  const results: {
    codeforces: ProfileResult;
    atcoder: ProfileResult;
    leetcode: ProfileResult;
  } = {
    codeforces: { handle: cfHandle, rating: null, rank: null, solved: null, active: false },
    atcoder: { handle: acHandle, rating: null, rank: null, solved: null, active: false },
    leetcode: { handle: lcHandle, rating: null, rank: null, solved: null, active: false },
  };

  // ── 1. Codeforces (official API: https://codeforces.com/apiHelp) ──
  try {
    // Build authenticated URL if keys are available
    function buildCfUrl(method: string, params: Record<string, string>) {
      const base = `https://codeforces.com/api/${method}`;
      const url = new URL(base);
      for (const [k, v] of Object.entries(params)) {
        url.searchParams.set(k, v);
      }

      if (cfKey && cfSecret) {
        const time = Math.floor(Date.now() / 1000).toString();
        url.searchParams.set("apiKey", cfKey);
        url.searchParams.set("time", time);

        // Generate apiSig: rand/methodName?sortedParams#secret
        const rand = "123456";
        const sorted = Array.from(url.searchParams.entries())
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([k, v]) => `${k}=${v}`)
          .join("&");
        const sigStr = `${rand}/${method}?${sorted}#${cfSecret}`;

        // Compute the Codeforces apiSig using SHA-512 over the signature string.
        const hash = createHash("sha512").update(sigStr).digest("hex");
        url.searchParams.set("apiSig", `${rand}${hash}`);
      }

      return url.toString();
    }

    const infoUrl = buildCfUrl("user.info", { handles: cfHandle });
    const statusUrl = buildCfUrl("user.status", { handle: cfHandle });

    const [infoRes, statusRes] = await Promise.all([
      fetch(infoUrl, { signal: AbortSignal.timeout(8000) }),
      fetch(statusUrl, { signal: AbortSignal.timeout(8000) }),
    ]);

    const infoData = await infoRes.json();
    const statusData = await statusRes.json();

    if (infoData.status === "OK" && infoData.result?.[0]) {
      const user = infoData.result[0];
      results.codeforces.rating = user.rating ?? null;
      results.codeforces.rank = user.rank ?? null;
      results.codeforces.active = true;
    }

    if (statusData.status === "OK" && Array.isArray(statusData.result)) {
      const solvedProblems = new Set<string>();
      for (const sub of statusData.result) {
        if (sub.verdict === "OK" && sub.problem) {
          solvedProblems.add(`${sub.problem.contestId}_${sub.problem.index}`);
        }
      }
      results.codeforces.solved = solvedProblems.size;
    }
  } catch (err) {
    console.error("Error fetching Codeforces stats:", err);
  }

  // ── 2. AtCoder (kenkoooo API + HTML scrape for rating) ──
  try {
    const [infoRes, htmlRes] = await Promise.all([
      fetch(`https://kenkoooo.com/atcoder/atcoder-api/v3/user/info?user=${acHandle}`, {
        headers: { "User-Agent": "cp-templates-hub" },
        signal: AbortSignal.timeout(8000),
      }),
      fetch(`https://atcoder.jp/users/${acHandle}`, {
        signal: AbortSignal.timeout(8000),
      }),
    ]);

    const infoData = infoRes.ok ? await infoRes.json() : null;
    const htmlData = htmlRes.ok ? await htmlRes.text() : null;

    if (infoData && typeof infoData.accepted_count === "number") {
      results.atcoder.solved = infoData.accepted_count;
      results.atcoder.active = true;
    }

    if (htmlData) {
      const match = htmlData.match(/Rating<\/th>\s*<td>\s*<span[^>]*>(\d+)<\/span>/i);
      if (match?.[1]) {
        const rating = parseInt(match[1], 10);
        results.atcoder.rating = rating;
        results.atcoder.active = true;

        // AtCoder color-rank mapping
        if (rating < 400) results.atcoder.rank = "gray";
        else if (rating < 800) results.atcoder.rank = "brown";
        else if (rating < 1200) results.atcoder.rank = "green";
        else if (rating < 1600) results.atcoder.rank = "cyan";
        else if (rating < 2000) results.atcoder.rank = "blue";
        else if (rating < 2400) results.atcoder.rank = "yellow";
        else if (rating < 2800) results.atcoder.rank = "orange";
        else results.atcoder.rank = "red";
      }
    }
  } catch (err) {
    console.error("Error fetching AtCoder stats:", err);
  }

  // ── 3. LeetCode (alfa-leetcode-api: https://alfaarghya.github.io/alfa-leetcode-api/) ──
  try {
    const apiBase = "https://alfa-leetcode-api.onrender.com";

    const [solvedRes, contestRes] = await Promise.all([
      fetch(`${apiBase}/${lcHandle}/solved`, {
        signal: AbortSignal.timeout(10000),
      }),
      fetch(`${apiBase}/${lcHandle}/contest`, {
        signal: AbortSignal.timeout(10000),
      }),
    ]);

    if (solvedRes.ok) {
      const solvedData = await solvedRes.json();
      // Response: { solvedProblem, easySolved, mediumSolved, hardSolved, ... }
      if (typeof solvedData.solvedProblem === "number") {
        results.leetcode.solved = solvedData.solvedProblem;
        results.leetcode.active = true;
      }
    }

    if (contestRes.ok) {
      const contestData = await contestRes.json();
      // Response: { contestRating, contestGlobalRanking, contestTopPercentage, ... }
      if (typeof contestData.contestRating === "number") {
        results.leetcode.rating = Math.round(contestData.contestRating);
        results.leetcode.active = true;
      }
      if (typeof contestData.contestGlobalRanking === "number") {
        results.leetcode.rank = `Top ${contestData.contestTopPercentage?.toFixed(1) ?? "?"}%`;
      }
    }
  } catch (err) {
    console.error("Error fetching LeetCode stats:", err);
  }

  // Cache only if at least one service was successfully queried
  if (results.codeforces.active || results.atcoder.active || results.leetcode.active) {
    cachedData = results;
    cacheTime = now;
  }

  return NextResponse.json(results);
}
