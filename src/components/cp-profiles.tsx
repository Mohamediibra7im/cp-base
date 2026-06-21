"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { SiCodeforces, SiLeetcode } from "react-icons/si";
import { Award, ExternalLink } from "lucide-react";
import { useTerminalTheme } from "./theme-provider";

interface ProfileData {
  handle: string;
  rating: number | null;
  rank: string | null;
  solved: number | null;
  active: boolean;
}

interface ApiResponse {
  codeforces: ProfileData;
  atcoder: ProfileData;
  leetcode: ProfileData;
}

const FALLBACK_DATA: ApiResponse = {
  codeforces: {
    handle: "MIDORIYA_",
    rating: 1448,
    rank: "specialist",
    solved: 890,
    active: false,
  },
  atcoder: {
    handle: "Midoriya_Izuku",
    rating: 41,
    rank: "gray",
    solved: 50,
    active: false,
  },
  leetcode: {
    handle: "Mohamediibra7im",
    rating: 1665,
    rank: "Top 16.5%",
    solved: 85,
    active: false,
  },
};

interface ProfileCard {
  name: string;
  handle: string;
  url: string;
  icon: "codeforces" | "atcoder" | "leetcode";
  color: string;
  solved: number;
  rating: number | null;
  rank: string;
  active: boolean | undefined;
  cli: string;
  ratingLabel: string;
  rankLabel: string;
}

function ProfileIcon({ type, color }: { type: ProfileCard["icon"]; color: string }) {
  if (type === "codeforces") {
    return <SiCodeforces className="h-4.5 w-4.5" style={{ color }} />;
  }
  if (type === "leetcode") {
    return <SiLeetcode className="h-4.5 w-4.5" style={{ color }} />;
  }
  return (
    <Image
      src="/logos/atcoder2.png"
      alt="AtCoder"
      width={20}
      height={20}
      className="h-5 w-5 object-contain opacity-80 group-hover:opacity-100 transition-opacity"
      unoptimized
    />
  );
}

export function CPProfiles() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const { playClick } = useTerminalTheme();

  useEffect(() => {
    let active = true;
    fetch("/api/profiles")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((json) => {
        if (active) {
          const merged: ApiResponse = {
            codeforces: json.codeforces?.active ? json.codeforces : { ...FALLBACK_DATA.codeforces, handle: json.codeforces?.handle || FALLBACK_DATA.codeforces.handle },
            atcoder: json.atcoder?.active ? json.atcoder : { ...FALLBACK_DATA.atcoder, handle: json.atcoder?.handle || FALLBACK_DATA.atcoder.handle },
            leetcode: json.leetcode?.active ? json.leetcode : { ...FALLBACK_DATA.leetcode, handle: json.leetcode?.handle || FALLBACK_DATA.leetcode.handle },
          };
          setData(merged);
        }
      })
      .catch(() => {
        if (active) setData(FALLBACK_DATA);
      });

    return () => { active = false; };
  }, []);

  // Show skeleton while fetching
  if (!data) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 font-mono">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="flex flex-col border border-border/40 bg-card/40 min-h-[200px] animate-pulse"
          >
            {/* Fake header */}
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-border/30 bg-muted/10">
              <div className="flex items-center gap-1.5">
                <div className="flex gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-border/40" />
                  <span className="h-1.5 w-1.5 rounded-full bg-border/40" />
                  <span className="h-1.5 w-1.5 rounded-full bg-border/40" />
                </div>
                <div className="h-2 w-24 bg-border/20 rounded" />
              </div>
            </div>
            {/* Fake body */}
            <div className="p-4 flex flex-col gap-3 flex-1">
              <div className="h-2 w-32 bg-border/20 rounded" />
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 bg-border/20 shrink-0" />
                <div className="flex flex-col gap-1.5">
                  <div className="h-2.5 w-20 bg-border/20 rounded" />
                  <div className="h-2 w-16 bg-border/10 rounded" />
                </div>
              </div>
              <div className="h-12 w-full bg-border/10 rounded" />
              <div className="mt-auto pt-2 border-t border-border/20 flex justify-between">
                <div className="h-2 w-16 bg-border/10 rounded" />
                <div className="h-2 w-16 bg-border/10 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const profiles: ProfileCard[] = [
    {
      name: "Codeforces",
      handle: data.codeforces.handle,
      url: `https://codeforces.com/profile/${data.codeforces.handle}`,
      icon: "codeforces",
      color: "#FF5656",
      solved: data.codeforces.solved ?? 0,
      rating: data.codeforces.rating,
      rank: data.codeforces.rank || "N/A",
      active: data.codeforces.active,
      cli: "cf",
      ratingLabel: "Rating",
      rankLabel: "Rank",
    },
    {
      name: "AtCoder",
      handle: data.atcoder.handle,
      url: `https://atcoder.jp/users/${data.atcoder.handle}`,
      icon: "atcoder",
      color: "#a1a1aa",
      solved: data.atcoder.solved ?? 0,
      rating: data.atcoder.rating,
      rank: data.atcoder.rank || "N/A",
      active: data.atcoder.active,
      cli: "atcoder",
      ratingLabel: "Rating",
      rankLabel: "Color",
    },
    {
      name: "LeetCode",
      handle: data.leetcode.handle,
      url: `https://leetcode.com/${data.leetcode.handle}`,
      icon: "leetcode",
      color: "#FFA116",
      solved: data.leetcode.solved ?? 0,
      rating: data.leetcode.rating,
      rank: data.leetcode.rank || "N/A",
      active: data.leetcode.active,
      cli: "leetcode",
      ratingLabel: "Rating",
      rankLabel: "Rank/Tier",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 font-mono">
      {profiles.map((p, i) => (
        <div
          key={p.name}
          style={{
            "--hover-color": p.color,
          } as React.CSSProperties}
          className={`group relative flex flex-col border border-border bg-card transition-all duration-300 min-h-[200px] hover:border-[var(--hover-color)]/50 hover:shadow-[0_0_20px_rgba(0,0,0,0.4),0_0_15px_var(--hover-color)]/[0.05] overflow-hidden animate-slide-up stagger-${i + 1}`}
        >
          {/* Terminal Window Header */}
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-border/40 bg-muted/10 shrink-0">
            <div className="flex items-center gap-1.5">
              <div className="flex gap-1 shrink-0">
                <span className="h-1.5 w-1.5 rounded-full bg-destructive/40" />
                <span className="h-1.5 w-1.5 rounded-full bg-warning/40" />
                <span className="h-1.5 w-1.5 rounded-full bg-success/40" />
              </div>
              <span className="text-[9px] text-muted-foreground/30 truncate max-w-[150px]">
                {p.cli}_diagnostics.exe
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[9px] font-bold">
              {p.active ? (
                <span className="h-1 w-1 bg-success rounded-full animate-ping" />
              ) : (
                <span className="h-1 w-1 bg-warning rounded-full" />
              )}
              <span className="text-muted-foreground/30 text-[8px]">
                {p.active ? "SYNC" : "CACHE"}
              </span>
            </div>
          </div>

          {/* Top accent line */}
          <div
            className="absolute top-[27px] left-0 right-0 h-px opacity-30"
            style={{
              background: `linear-gradient(90deg, transparent, ${p.color}, transparent)`,
            }}
          />

          <div className="p-4 flex flex-col flex-1 mt-1">
            {/* Command Header line */}
            <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground/45 border-b border-border/40 pb-2 mb-3">
              <span className="text-primary/60">$</span>
              <span>{p.cli} --info --user={p.handle}</span>
              <span className="h-2 w-1 bg-primary/40 animate-blink" />
            </div>

            {/* Identity Row */}
            <div className="flex items-center gap-3 mb-3">
              <div
                className="flex h-9 w-9 items-center justify-center border shrink-0 bg-background transition-colors"
                style={{
                  borderColor: `${p.color}33`,
                  color: p.color,
                  boxShadow: `0 0 10px ${p.color}11`,
                }}
              >
                <ProfileIcon type={p.icon} color={p.color} />
              </div>
              <div>
                <h3 className="font-bold text-xs text-foreground group-hover:text-primary transition-colors leading-none mb-1">
                  {p.name}
                </h3>
                <p className="text-[9px] text-muted-foreground/40 leading-none">
                  @{p.handle}
                </p>
              </div>
            </div>

            {/* Stats Block */}
            <div className="text-[11px] mb-3">
              <div className="border border-border/30 bg-muted/10 p-2.5">
                {p.icon === "leetcode" ? (
                  <>
                    <div className="text-[8px] text-muted-foreground/30 uppercase tracking-wider font-bold">Tier Rank</div>
                    <div className="font-bold text-sm text-foreground mt-0.5 flex items-center gap-1.5">
                      <Award className="h-3.5 w-3.5 shrink-0" style={{ color: p.color }} />
                      <span>{p.rank}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-[8px] text-muted-foreground/30 uppercase tracking-wider font-bold">Rating Value</div>
                    <div className="font-bold text-sm text-foreground mt-0.5 flex items-center gap-1.5">
                      <Award className="h-3.5 w-3.5 shrink-0" style={{ color: p.color }} />
                      <span>{p.rating ?? "N/A"}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Footer row */}
            <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/30">
              <span className="text-[8px] text-muted-foreground/20">
                SOLVED: {p.solved}
              </span>
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={playClick}
                className="text-[9px] text-muted-foreground/40 hover:text-primary transition-colors flex items-center gap-1"
              >
                view profile
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
