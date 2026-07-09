"use client";

import { useEffect, useState } from "react";
import { useTerminalTheme } from "./theme-provider";
import { Terminal, ExternalLink } from "lucide-react";

interface Contest {
  name: string;
  url: string;
  start_time: string;
  duration: string;
  site: string;
}

export function ContestCalendar() {
  const { playClick } = useTerminalTheme();
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [now, setNow] = useState<number>(Date.now());

  useEffect(() => {
    fetch("/api/contests")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setContests(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const formatDuration = (secondsStr: string) => {
    const secs = parseFloat(secondsStr);
    if (isNaN(secs)) return secondsStr;
    const hours = secs / 3600;
    if (hours % 1 === 0) return `${hours} hrs`;
    return `${hours.toFixed(1)} hrs`;
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

  const getSiteBadgeStyles = (site: string) => {
    const s = site.toLowerCase();
    if (s.includes("codeforces")) return "border-blue-500/40 bg-blue-500/5 text-blue-400";
    if (s.includes("atcoder")) return "border-neutral-500/40 bg-neutral-500/5 text-neutral-400";
    if (s.includes("leetcode")) return "border-amber-500/40 bg-amber-500/5 text-amber-400";
    if (s.includes("codechef")) return "border-emerald-500/40 bg-emerald-500/5 text-emerald-400";
    return "border-primary/40 bg-primary/5 text-primary";
  };

  if (loading) {
    return (
      <div className="border border-border/85 bg-card/25 p-8 text-center font-mono shadow-md">
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground/50 animate-pulse">
          <Terminal className="h-4 w-4 animate-spin text-primary/70" />
          <span>QUERYING_CONTESTS_DAEMON...</span>
        </div>
      </div>
    );
  }

  if (error || contests.length === 0) {
    return (
      <div className="border border-border bg-card/25 p-8 text-center font-mono">
        <div className="text-xs text-error/60 mb-2">[WARN] CONTESTS_DAEMON_OFFLINE</div>
        <p className="text-xs text-muted-foreground/45">Failed to query active database schedules. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="border border-border bg-card/20 backdrop-blur-sm shadow-xl font-mono relative overflow-hidden">
      {/* Terminal Titlebar Header */}
      <div className="flex items-center justify-between border-b border-border/40 px-3 py-2 bg-muted/15 text-[10px] text-muted-foreground/35 select-none">
        <div className="flex items-center gap-1.5">
          <div className="flex gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-destructive/60" />
            <span className="h-1.5 w-1.5 rounded-full bg-warning/60" />
            <span className="h-1.5 w-1.5 rounded-full bg-success/60" />
          </div>
          <span className="ml-2 tracking-wider text-primary/75">CONTESTS_MONITOR v1.2</span>
        </div>
        <span className="text-[9px] uppercase tracking-widest text-success flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 bg-success rounded-full animate-ping" />
          <span>synced</span>
        </span>
      </div>

      {/* Main Contests Table Grid */}
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-left text-[11px] border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-border/40 bg-muted/5 text-muted-foreground/40 font-bold uppercase select-none text-[9px]">
              <th className="py-2.5 px-4 w-[120px]">Platform</th>
              <th className="py-2.5 px-3">Contest Title</th>
              <th className="py-2.5 px-3 w-[150px]">Start Time</th>
              <th className="py-2.5 px-3 w-[100px]">Duration</th>
              <th className="py-2.5 px-3 w-[120px] text-right">Starts In</th>
              <th className="py-2.5 px-4 w-[110px] text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/25">
            {contests.map((c, idx) => {
              const countdown = getCountdown(c.start_time);
              const isLive = countdown === "LIVE";

              return (
                <tr key={idx} className="hover:bg-primary/[0.01] transition-colors leading-relaxed">
                  {/* Platform Badge */}
                  <td className="py-3 px-4 select-none">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 border uppercase ${getSiteBadgeStyles(c.site)}`}>
                      {c.site}
                    </span>
                  </td>
                  {/* Contest Title */}
                  <td className="py-3 px-3 font-semibold text-foreground max-w-xs truncate">
                    {c.name}
                  </td>
                  {/* Start Time */}
                  <td className="py-3 px-3 text-muted-foreground/50">
                    {new Date(c.start_time).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </td>
                  {/* Duration */}
                  <td className="py-3 px-3 text-muted-foreground/50">
                    {formatDuration(c.duration)}
                  </td>
                  {/* Countdown Timer */}
                  <td className="py-3 px-3 text-right font-bold">
                    <span className={isLive ? "text-success animate-pulse glow-text-strong" : "text-primary/80"}>
                      {isLive ? "[ LIVE ]" : countdown}
                    </span>
                  </td>
                  {/* Link Register */}
                  <td className="py-3 px-4 text-right">
                    <a
                      href={c.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={playClick}
                      className="inline-flex items-center gap-1.5 px-2 py-0.5 border border-primary/40 bg-primary/5 hover:bg-primary/10 text-primary transition-all text-[10px] uppercase font-bold"
                    >
                      <span>register</span>
                      <ExternalLink className="h-2.5 w-2.5" />
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
