"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Terminal, Braces, Library, Heart, Globe, Cpu, Wifi, Code, Clock } from "lucide-react";
import { useTerminalTheme } from "./theme-provider";

export function Footer() {
  const year = new Date().getFullYear();
  const { playClick, theme } = useTerminalTheme();
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="border-t border-border bg-card/35 backdrop-blur-md font-mono select-none relative overflow-hidden">
      {/* Decorative background grid line */}
      <div className="absolute inset-0 bg-grid-line opacity-[0.03] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 relative z-10">
        {/* Main content grid */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          {/* Brand block */}
          <div className="md:col-span-5 space-y-4">
            <Link
              href="/"
              onClick={playClick}
              className="flex items-center gap-2 group w-fit"
            >
              <div className="flex items-center justify-center h-6 w-6 border border-primary/30 bg-primary/5 shadow-[0_0_8px_rgba(var(--primary-glow-weak))]">
                <Terminal className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="text-xs font-bold tracking-[0.25em] text-primary uppercase glow-text-strong">
                CP-Base
              </span>
            </Link>
            <p className="text-[11px] text-muted-foreground/35 leading-relaxed max-w-sm">
              An index of high-performance algorithms and data structure templates optimized for competitive programming contests. Copy, customize, and execute with lightning speed.
            </p>
          </div>

          {/* Navigation links block */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-[10px] text-primary/50 uppercase tracking-[0.2em] font-bold flex items-center gap-1.5">
              <span className="h-1 w-1 bg-primary rounded-full" />
              <span>Index Navigation</span>
            </h4>
            <nav className="flex flex-col gap-2.5">
              <Link
                href="/#categories"
                onClick={playClick}
                className="flex items-center gap-2 text-[11px] text-muted-foreground/45 hover:text-primary transition-all w-fit group"
              >
                <Braces className="h-3 w-3 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                <span>ls categories/</span>
              </Link>
              <Link
                href="/templates"
                onClick={playClick}
                className="flex items-center gap-2 text-[11px] text-muted-foreground/45 hover:text-primary transition-all w-fit group"
              >
                <Library className="h-3 w-3 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                <span>ls templates/</span>
              </Link>
            </nav>
          </div>

          {/* CLI Terminal client mockup */}
          <div className="md:col-span-4 space-y-3">
            <div className="w-full border border-border/85 bg-background/50 shadow-[inset_0_0_15px_rgba(0,0,0,0.6)]">
              {/* Terminal window header */}
              <div className="flex items-center justify-between border-b border-border/40 px-3 py-1 bg-muted/10 text-[9px] text-muted-foreground/35 uppercase select-none">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-destructive/60" />
                  <span className="h-1.5 w-1.5 rounded-full bg-warning/60" />
                  <span className="h-1.5 w-1.5 rounded-full bg-success/60" />
                  <span className="ml-1 text-[8px] tracking-wider">cp-base-cli.sh</span>
                </div>
                <span>v1.0.8</span>
              </div>
              {/* Terminal content */}
              <div className="p-3 text-[10px] space-y-1 font-mono text-muted-foreground/45">
                <div>
                  <span className="text-primary/60 mr-1.5">$</span>npm install -g cp-base
                </div>
                <div>
                  <span className="text-primary/60 mr-1.5">$</span>cp-base init --config
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-primary/60 mr-1.5">$</span>
                  <span className="inline-block h-3.5 w-1.5 bg-primary/40 animate-blink" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System telemetry bar */}
        <div className="border-t border-border/40 py-3 flex flex-wrap items-center justify-between gap-4 text-[9px] text-muted-foreground/25 tracking-wider uppercase">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Globe className="h-3 w-3 text-muted-foreground/20" />
              <span>host: cp-base.dev</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Cpu className="h-3 w-3 text-muted-foreground/20" />
              <span>system: online</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Wifi className="h-3 w-3 text-muted-foreground/20" />
              <span>latency: 14ms</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Code className="h-3 w-3 text-muted-foreground/20" />
              <span>theme: {theme}</span>
            </div>
            {time && (
              <div className="flex items-center gap-1.5 animate-pulse">
                <Clock className="h-3 w-3 text-muted-foreground/20" />
                <span>time: {time}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1">
            <span>secure connection established</span>
            <span className="h-1.5 w-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_8px_var(--primary-glow)]" />
          </div>
        </div>

        {/* Bottom credits line */}
        <div className="border-t border-border/20 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[9px] text-muted-foreground/20">
          <div className="flex items-center gap-1.5">
            <span>© {year} CP-BASE INDEX</span>
            <span className="text-border/40">·</span>
            <span>compiled with</span>
            <Heart className="h-2.5 w-2.5 text-destructive/40 fill-destructive/40" />
            <span>for active contestants</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>crafted by</span>
            <a
              href="https://mohamediibrahim.dev"
              target="_blank"
              rel="noopener noreferrer"
              onClick={playClick}
              className="text-primary/45 hover:text-primary hover:underline transition-all font-bold"
            >
              Mohamed Ibrahim
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
