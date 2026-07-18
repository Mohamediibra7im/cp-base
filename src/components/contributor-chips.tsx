"use client";

import { useState } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { RetroModal } from "@/components/terminal/retro-modal";

export interface Contributor {
  name: string;
  cfHandle: string | null;
  role: "creator" | "editor";
  avatar: string;
  contributions: number;
  cfRating: number | null;
  cfRank: string | null;
}

/**
 * GitHub-style contributor credits. Each chip is clickable and opens a
 * terminal-styled dialog with the contributor's role, contribution count and
 * (when a Codeforces handle is linked) their rating/rank with a profile link.
 */
export function ContributorChips({ contributors }: { contributors: Contributor[] }) {
  const [active, setActive] = useState<Contributor | null>(null);

  return (
    <>
      <div className="flex flex-wrap gap-2.5">
        {contributors.map((c, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(c)}
            title={`View ${c.name}`}
            className="flex items-center gap-1.5 border border-border/60 bg-card/30 px-2.5 py-1.5 text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors cursor-pointer"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={c.avatar}
              alt={c.name}
              loading="lazy"
              className="h-5 w-5 rounded-full border border-primary/25 bg-primary/10 object-cover shrink-0"
            />
            <span className="font-bold">{c.name}</span>
            {c.role === "creator" && (
              <span className="text-[8px] uppercase tracking-wider text-primary/70 border border-primary/25 bg-primary/5 px-1 py-0.5 select-none">
                creator
              </span>
            )}
          </button>
        ))}
      </div>

      {active && <ContributorDialog contributor={active} onClose={() => setActive(null)} />}
    </>
  );
}

function ContributorDialog({ contributor, onClose }: { contributor: Contributor; onClose: () => void }) {
  const c = contributor;
  return (
    <RetroModal
      tone="primary"
      title={`[ CONTRIBUTOR: ${c.name.toUpperCase()} ]`}
      tag="whoami"
      onClose={onClose}
    >
      <div className="p-6 font-mono text-xs">
        {/* Identity row */}
        <div className="flex items-center gap-3 pb-4 border-b border-border/30 mb-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={c.avatar}
            alt={c.name}
            className="h-12 w-12 rounded-full border border-primary/25 bg-primary/10 object-cover shrink-0"
          />
          <div className="min-w-0">
            <div className="font-bold text-foreground truncate">{c.name}</div>
            <div className="text-[10px] uppercase tracking-wider text-primary/70">
              {c.role === "creator" ? "creator" : "editor"}
            </div>
          </div>
        </div>

        {/* Stats */}
        <dl className="space-y-2 text-muted-foreground/85">
          <div className="flex items-center justify-between gap-4">
            <dt className="text-muted-foreground/50">contributions</dt>
            <dd className="font-bold text-foreground">{c.contributions}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-muted-foreground/50">codeforces</dt>
            <dd className="font-bold text-foreground">
              {c.cfHandle ? (
                <a
                  href={`https://codeforces.com/profile/${c.cfHandle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-primary transition-colors"
                >
                  @{c.cfHandle}
                  <ArrowUpRight className="h-3 w-3 opacity-60" />
                </a>
              ) : (
                <span className="text-muted-foreground/40">not linked</span>
              )}
            </dd>
          </div>
          {c.cfHandle && (
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground/50">rating</dt>
              <dd className="font-bold text-foreground">
                {c.cfRating != null ? (
                  <>
                    {c.cfRating}
                    {c.cfRank && <span className="text-muted-foreground/50 font-normal"> ({c.cfRank})</span>}
                  </>
                ) : (
                  <span className="text-muted-foreground/40">unrated</span>
                )}
              </dd>
            </div>
          )}
        </dl>
      </div>

      <div className="border-t border-border/45 px-6 py-4 bg-muted/5 flex justify-end text-[10px]">
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-border hover:border-primary/40 hover:text-primary transition-colors uppercase font-mono cursor-pointer"
        >
          <X className="h-3 w-3" />
          <span>[ ESC ] Close</span>
        </button>
      </div>
    </RetroModal>
  );
}
