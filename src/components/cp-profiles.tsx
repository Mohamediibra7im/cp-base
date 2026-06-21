"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { SiCodeforces, SiLeetcode } from "react-icons/si";
import { Award, ExternalLink } from "lucide-react";

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

// Fallback values — cards render immediately with these, then update when API responds
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
    return <SiCodeforces className="h-4 w-4" style={{ color }} />;
  }
  if (type === "leetcode") {
    return <SiLeetcode className="h-4 w-4" style={{ color }} />;
  }
  // AtCoder — use the official white logo from public/logos
  return (
    <Image
      src="/logos/atcoder2.png"
      alt="AtCoder"
      width={20}
      height={20}
      className="h-5 w-5 object-contain"
      unoptimized
    />
  );
}

export function CPProfiles() {
  // Start with fallback data so cards render immediately — no loading spinner
  const [data, setData] = useState<ApiResponse>(FALLBACK_DATA);

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
      .catch((err) => {
        console.error("Failed to fetch profiles, keeping fallback:", err);
      });

    return () => { active = false; };
  }, []);

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
      color: "#ffffff",
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
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {profiles.map((p) => (
        <div
          key={p.name}
          style={{
            "--hover-color": p.color,
          } as any}
          className="group relative flex flex-col border border-border bg-card transition-all duration-300 min-h-[190px] hover:border-[var(--hover-color)]/30 hover:shadow-[0_0_20px_var(--hover-color)]/[0.03] overflow-hidden"
        >
          {/* Top accent line */}
          <div
            className="absolute top-0 left-0 right-0 h-px opacity-30"
            style={{
              background: `linear-gradient(90deg, transparent, ${p.color}, transparent)`,
            }}
          />

          <div className="p-5 flex flex-col flex-1">
            {/* Header: CLI style */}
            <div className="flex items-center justify-between mb-4 border-b border-border/50 pb-2">
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/40 font-mono">
                <span className="text-primary/60">$</span>
                <span>{p.cli} --info -u {p.handle}</span>
              </div>
              <div className="flex items-center gap-1">
                {p.active ? (
                  <span className="flex h-1.5 w-1.5 rounded-full bg-success" title="Live sync active" />
                ) : (
                  <span className="flex h-1.5 w-1.5 rounded-full bg-warning" title="Using offline/cached stats" />
                )}
                <span className="text-[9px] text-muted-foreground/20 font-mono">
                  {p.active ? "LIVE" : "CACHED"}
                </span>
              </div>
            </div>

            {/* Identity Row */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className="flex h-9 w-9 items-center justify-center border shrink-0 bg-background transition-colors"
                style={{
                  borderColor: `${p.color}33`,
                  color: p.color,
                }}
              >
                <ProfileIcon type={p.icon} color={p.color} />
              </div>
              <div>
                <h3 className="font-bold text-sm text-foreground font-mono leading-none mb-1 group-hover:text-primary transition-colors">
                  {p.name}
                </h3>
                <p className="text-[10px] text-muted-foreground/30 font-mono leading-none">
                  @{p.handle}
                </p>
              </div>
            </div>

            {/* Stats Block */}
            <div className="text-xs font-mono mb-4">
              <div className="border border-border/30 bg-muted/10 p-3">
                {p.icon === "leetcode" ? (
                  <>
                    <div className="text-[9px] text-muted-foreground/30 uppercase">Top %</div>
                    <div className="font-bold text-base text-foreground mt-1 flex items-center gap-2">
                      <Award className="h-4 w-4 shrink-0" style={{ color: p.color }} />
                      <span>{p.rank}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-[9px] text-muted-foreground/30 uppercase">Rating</div>
                    <div className="font-bold text-base text-foreground mt-1 flex items-center gap-2">
                      <Award className="h-4 w-4 shrink-0" style={{ color: p.color }} />
                      <span>{p.rating ?? "N/A"}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Footer row */}
            <div className="flex items-center justify-end mt-auto pt-2 border-t border-border/30">
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-muted-foreground/40 hover:text-primary transition-colors flex items-center gap-1 font-mono"
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
