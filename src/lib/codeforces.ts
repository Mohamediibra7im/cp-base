import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileP = promisify(execFile);

const BROWSER_UA =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36";

// Codeforces serves its public pages behind Cloudflare's bot challenge.
// Node's built-in fetch (undici) is rejected with a 403 due to its TLS
// fingerprint, while curl clears the challenge. We therefore try fetch first
// (cheap, no subprocess) and fall back to curl when it's blocked.
async function fetchCfProfileHtml(handle: string): Promise<string | null> {
  const url = `https://codeforces.com/profile/${encodeURIComponent(handle)}`;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": BROWSER_UA,
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
      signal: AbortSignal.timeout(8000),
    });
    if (res.ok) {
      return await res.text();
    }
  } catch {
    // fall through to the curl fallback below
  }

  // Fallback: shell out to curl. The handle is passed as a discrete execFile
  // argument (no shell), so it can't be used for command injection.
  try {
    const { stdout } = await execFileP(
      "curl",
      ["-s", "--max-time", "10", "--compressed", "-A", BROWSER_UA, url],
      { maxBuffer: 16 * 1024 * 1024, timeout: 12000 },
    );
    return stdout || null;
  } catch {
    return null;
  }
}

// Returns the "solved for all time" count shown on a user's Codeforces profile
// page, or null if it can't be determined. This differs from the API's
// distinct-accepted count (which excludes acmsguru / deleted-contest problems)
// and matches what users see on codeforces.com.
export async function getCfSolvedForAllTime(handle: string): Promise<number | null> {
  const html = await fetchCfProfileHtml(handle);
  if (!html) return null;

  const match = html.match(/_UserActivityFrame_counterValue[^>]*>\s*([\d,]+)\s*problem/i);
  if (!match?.[1]) return null;

  const solved = parseInt(match[1].replace(/,/g, ""), 10);
  return Number.isFinite(solved) ? solved : null;
}
