"use client";

import Link from "next/link";
import { Terminal, Braces, Library, Heart } from "lucide-react";
import { useTerminalTheme } from "./theme-provider";

export function Footer() {
  const year = new Date().getFullYear();
  const { playClick } = useTerminalTheme();

  return (
    <footer className="border-t border-border bg-background/50 font-mono">
      <div className="mx-auto max-w-7xl px-4">
        {/* Main footer content */}
        <div className="py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <Link
              href="/"
              onClick={playClick}
              className="flex items-center gap-2 group w-fit"
            >
              <div className="flex items-center justify-center h-5 w-5 border border-primary/30 bg-primary/5">
                <Terminal className="h-3 w-3 text-primary" />
              </div>
              <span className="text-xs font-bold tracking-[0.2em] text-primary uppercase">
                CP-Base
              </span>
            </Link>
            <p className="text-[11px] text-muted-foreground/35 leading-relaxed max-w-xs">
              Competitive programming templates. Copy, paste, and ace your next contest.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-3">
            <h4 className="text-[10px] text-muted-foreground/25 uppercase tracking-[0.15em] font-bold">
              Navigation
            </h4>
            <nav className="flex flex-col gap-2">
              <Link
                href="/#categories"
                onClick={playClick}
                className="flex items-center gap-2 text-[11px] text-muted-foreground/40 hover:text-primary transition-colors w-fit"
              >
                <Braces className="h-3 w-3" />
                <span>categories</span>
              </Link>
              <Link
                href="/templates"
                onClick={playClick}
                className="flex items-center gap-2 text-[11px] text-muted-foreground/40 hover:text-primary transition-colors w-fit"
              >
                <Library className="h-3 w-3" />
                <span>templates</span>
              </Link>
            </nav>
          </div>

          {/* Terminal */}
          <div className="space-y-3">
            <h4 className="text-[10px] text-muted-foreground/25 uppercase tracking-[0.15em] font-bold">
              Quick Start
            </h4>
            <div className="border border-border bg-card/30 p-3 text-[11px] space-y-1.5 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
              <div className="text-muted-foreground/30">
                <span className="text-primary/60">$</span> npm install -g cp-base
              </div>
              <div className="text-muted-foreground/30">
                <span className="text-primary/60">$</span> cp-base init
              </div>
              <div className="text-muted-foreground/30">
                <span className="text-primary/60">$</span> cp-base browse
              </div>
              <div className="flex items-center gap-1 mt-2">
                <span className="text-primary/60">$</span>
                <span className="inline-block h-2.5 w-1 bg-primary/40 animate-blink" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border/50 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/20">
            <span>© {year}</span>
            <span className="text-border">·</span>
            <span>Built with</span>
            <Heart className="h-2.5 w-2.5 text-destructive/40 fill-destructive/40" />
            <span>for CP</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/20">
            <span>by</span>
            <a
              href="https://mohamediibrahim.dev"
              target="_blank"
              rel="noopener noreferrer"
              onClick={playClick}
              className="text-primary/40 hover:text-primary transition-colors"
            >
              Mohamed Ibrahim
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
