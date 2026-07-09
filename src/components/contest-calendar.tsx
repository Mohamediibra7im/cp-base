"use client";

import { useEffect, useState, useCallback } from "react";
import { useTerminalTheme } from "./theme-provider";
import { Terminal, ExternalLink } from "lucide-react";

interface Contest {
  name: string;
  url: string;
  start_time: string;
  duration: string;
  site: string;
  rated?: string;
  code?: string;
}

const PLATFORMS = [
  { key: "codeforces", label: "Codeforces", color: "blue" },
  { key: "atcoder", label: "AtCoder", color: "neutral" },
  { key: "leetcode", label: "LeetCode", color: "amber" },
  { key: "codechef", label: "CodeChef", color: "emerald" },
] as const;

type PlatformKey = (typeof PLATFORMS)[number]["key"];

const PLATFORM_STYLES: Record<PlatformKey, { tab: string; activeTab: string; badge: string }> = {
  codeforces: {
    tab: "text-blue-400/50 hover:text-blue-400 hover:bg-blue-500/5",
    activeTab: "text-blue-400 bg-blue-500/10 border-b-blue-400",
    badge: "border-blue-500/40 bg-blue-500/5 text-blue-400",
  },
  atcoder: {
    tab: "text-neutral-400/50 hover:text-neutral-300 hover:bg-neutral-500/5",
    activeTab: "text-neutral-300 bg-neutral-500/10 border-b-neutral-400",
    badge: "border-neutral-500/40 bg-neutral-500/5 text-neutral-400",
  },
  leetcode: {
    tab: "text-amber-400/50 hover:text-amber-400 hover:bg-amber-500/5",
    activeTab: "text-amber-400 bg-amber-500/10 border-b-amber-400",
    badge: "border-amber-500/40 bg-amber-500/5 text-amber-400",
  },
  codechef: {
    tab: "text-emerald-400/50 hover:text-emerald-400 hover:bg-emerald-500/5",
    activeTab: "text-emerald-400 bg-emerald-500/10 border-b-emerald-400",
    badge: "border-emerald-500/40 bg-emerald-500/5 text-emerald-400",
  },
};

export function ContestCalendar() {
  const { playClick } = useTerminalTheme();
  const [activeTab, setActiveTab] = useState<PlatformKey>("codeforces");
  const [contestsByPlatform, setContestsByPlatform] = useState<Record<PlatformKey, Contest[]>>({
    codeforces: [],
    atcoder: [],
    leetcode: [],
    codechef: [],
  });
  const [loading, setLoading] = useState<Record<PlatformKey, boolean>>({
    codeforces: true,
    atcoder: true,
    leetcode: true,
    codechef: true,
  });
  const [now, setNow] = useState<number>(Date.now());

  const fetchPlatform = useCallback((platform: PlatformKey) => {
    fetch(`/api/contests?platform=${platform}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setContestsByPlatform((prev) => ({ ...prev, [platform]: data }));
        setLoading((prev) => ({ ...prev, [platform]: false }));
      })
      .catch(() => {
        setLoading((prev) => ({ ...prev, [platform]: false }));
      });
  }, []);

  useEffect(() => {
    PLATFORMS.forEach((p) => fetchPlatform(p.key));
  }, [fetchPlatform]);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);

  const formatDuration = (secondsStr: string) => {
    const secs = parseFloat(secondsStr);
    if (isNaN(secs)) return secondsStr;
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    if (m === 0) return `${h}h`;
    if (h === 0) return `${m}m`;
    return `${h}h ${m}m`;
  };

  const getCountdown = (startTimeStr: string) => {
    const start = new Date(startTimeStr).getTime();
    const diff = start - now;
    if (diff <= 0) return "LIVE";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0 || days > 0) parts.push(`${hours}h`);
    parts.push(`${mins}m`);
    return parts.join(" ");
  };

  const contests = contestsByPlatform[activeTab];
  const isLoading = loading[activeTab];
  const styles = PLATFORM_STYLES[activeTab];

  return (
    <div className="border border-border bg-card/20 backdrop-blur-sm shadow-xl font-mono relative overflow-hidden">
      {/* Terminal Titlebar */}
      <div className="flex items-center justify-between border-b border-border/40 px-3 py-2 bg-muted/15 text-[10px] text-muted-foreground/35 select-none">
        <div className="flex items-center gap-1.5">
          <div className="flex gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-destructive/60" />
            <span className="h-1.5 w-1.5 rounded-full bg-warning/60" />
            <span className="h-1.5 w-1.5 rounded-full bg-success/60" />
          </div>
          <span className="ml-2 tracking-wider text-primary/75">CONTESTS_MONITOR v2.0</span>
        </div>
        <span className="text-[9px] uppercase tracking-widest text-success flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 bg-success rounded-full animate-ping" />
          <span>synced</span>
        </span>
      </div>

      {/* Platform Tabs */}
      <div className="flex border-b border-border/40 bg-muted/5 overflow-x-auto scrollbar-thin select-none">
        {PLATFORMS.map((p) => {
          const isActive = activeTab === p.key;
          const pStyles = PLATFORM_STYLES[p.key];
          const count = contestsByPlatform[p.key].length;
          const pLoading = loading[p.key];

          return (
            <button
              key={p.key}
              onClick={() => {
                playClick();
                setActiveTab(p.key);
              }}
              className={`px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider transition-all border-b-2 shrink-0 flex items-center gap-2 ${
                isActive
                  ? `${pStyles.activeTab}`
                  : `border-b-transparent ${pStyles.tab}`
              }`}
            >
              <span>{p.label}</span>
              {!pLoading && (
                <span className={`text-[8px] px-1 py-0 border ${pStyles.badge} font-mono`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="p-8 text-center">
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground/50 animate-pulse">
            <Terminal className="h-4 w-4 animate-spin text-primary/70" />
            <span>QUERYING_{activeTab.toUpperCase()}_API...</span>
          </div>
        </div>
      ) : contests.length === 0 ? (
        <div className="p-8 text-center">
          <div className="text-xs text-muted-foreground/40">[INFO] No upcoming contests found for {PLATFORMS.find((p) => p.key === activeTab)?.label}</div>
        </div>
      ) : (
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-[11px] border-collapse min-w-[650px]">
            <thead>
              <tr className="border-b border-border/40 bg-muted/5 text-muted-foreground/40 font-bold uppercase select-none text-[9px]">
                <th className="py-2.5 px-4">Contest</th>
                <th className="py-2.5 px-3 w-[150px]">Start</th>
                <th className="py-2.5 px-3 w-[80px]">Duration</th>
                {activeTab === "atcoder" && <th className="py-2.5 px-3 w-[100px]">Rated</th>}
                {activeTab === "codechef" && <th className="py-2.5 px-3 w-[100px]">Code</th>}
                <th className="py-2.5 px-3 w-[110px] text-right">Starts In</th>
                <th className="py-2.5 px-4 w-[80px] text-right">Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/25">
              {contests.map((c, idx) => {
                const countdown = getCountdown(c.start_time);
                const isLive = countdown === "LIVE";

                return (
                  <tr key={idx} className="hover:bg-primary/[0.01] transition-colors leading-relaxed">
                    <td className="py-3 px-4 font-semibold text-foreground max-w-xs truncate">
                      {c.name}
                    </td>
                    <td className="py-3 px-3 text-muted-foreground/50">
                      {new Date(c.start_time).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        weekday: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}
                    </td>
                    <td className="py-3 px-3 text-muted-foreground/50">
                      {formatDuration(c.duration)}
                    </td>
                    {activeTab === "atcoder" && (
                      <td className="py-3 px-3 text-muted-foreground/50 text-[10px]">
                        {c.rated || "-"}
                      </td>
                    )}
                    {activeTab === "codechef" && (
                      <td className="py-3 px-3 text-muted-foreground/50 text-[10px] font-mono">
                        {c.code || "-"}
                      </td>
                    )}
                    <td className="py-3 px-3 text-right font-bold">
                      <span className={isLive ? "text-success animate-pulse glow-text-strong" : "text-primary/80"}>
                        {isLive ? "[ LIVE ]" : countdown}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <a
                        href={c.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={playClick}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 border ${styles.badge} hover:brightness-125 transition-all text-[10px] uppercase font-bold`}
                      >
                        <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
