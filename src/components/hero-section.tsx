"use client";

import { useEffect, useState } from "react";
import { ArrowDown, Terminal, Code2, Braces, Zap } from "lucide-react";

export function HeroSection({ totalTemplates, totalCategories }: { totalTemplates: number; totalCategories: number }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative overflow-hidden border-b border-border">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient orbs */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:py-24 lg:py-32">
        <div className="max-w-3xl">
          {/* Terminal prompt line */}
          <div
            className={`flex items-center gap-2 text-xs text-muted-foreground mb-6 transition-all duration-700 ${mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`}
          >
            <span className="text-primary">$</span>
            <span>cat /etc/motd</span>
            <span className="inline-block h-3 w-1.5 bg-primary animate-blink ml-1" />
          </div>

          {/* Main title */}
          <h1
            className={`text-5xl sm:text-6xl lg:text-8xl font-bold tracking-tight text-primary mb-4 transition-all duration-700 delay-100 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <span className="glow-text-strong">CP</span>
            <span className="text-muted-foreground/30">-</span>
            <span className="glow-text-strong">BASE</span>
          </h1>

          {/* Subtitle */}
          <p
            className={`text-base sm:text-lg text-muted-foreground/70 mb-8 max-w-xl transition-all duration-700 delay-200 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            Competitive programming templates. Copy, paste, and
            <span className="text-primary font-bold"> ace your next contest</span>.
          </p>

          {/* Stats row */}
          <div
            className={`flex flex-wrap items-center gap-6 mb-10 transition-all duration-700 delay-300 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <div className="flex items-center gap-2 px-3 py-1.5 border border-border bg-card/50">
              <Terminal className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs text-muted-foreground">templates</span>
              <span className="text-sm font-bold text-primary">{totalTemplates}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 border border-border bg-card/50">
              <Braces className="h-3.5 w-3.5 text-info" />
              <span className="text-xs text-muted-foreground">categories</span>
              <span className="text-sm font-bold text-info">{totalCategories}</span>
            </div>
          </div>

          {/* CTA */}
          <div
            className={`flex flex-col sm:flex-row gap-3 transition-all duration-700 delay-[400ms] ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <a
              href="#categories"
              className="group inline-flex h-11 items-center gap-2 border border-primary bg-primary text-primary-foreground px-7 text-sm font-bold transition-all hover:opacity-90"
            >
              <Code2 className="h-4 w-4" />
              browse templates
              <ArrowDown className="h-3.5 w-3.5 transition-transform group-hover:translate-y-0.5" />
            </a>
            <div className="flex items-center gap-2 px-4 h-11 border border-border text-xs text-muted-foreground/50">
              <Zap className="h-3 w-3" />
              <span>ready to use</span>
              <span className="inline-block h-3 w-1.5 bg-success animate-blink" />
            </div>
          </div>
        </div>

        {/* Floating code snippet decoration (desktop only) */}
        <div
          className={`hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 transition-all duration-1000 delay-500 ${mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}
        >
          <div className="w-72 border border-border bg-card/80 backdrop-blur p-4 animate-float">
            <div className="flex items-center gap-1.5 mb-3">
              <div className="w-2 h-2 rounded-full bg-error/60" />
              <div className="w-2 h-2 rounded-full bg-warning/60" />
              <div className="w-2 h-2 rounded-full bg-success/60" />
            </div>
            <pre className="text-[11px] leading-relaxed">
              <code>
                <span className="text-muted-foreground/50">// segment tree</span>{"\n"}
                <span className="text-primary">template</span>{" "}
                <span className="text-info">{"<"}</span>
                <span className="text-foreground/70">typename T</span>
                <span className="text-info">{">"}</span>{"\n"}
                <span className="text-primary">struct</span>{" "}
                <span className="text-warning">SegTree</span>{" {\n"}
                {"  "}T tree[<span className="text-success">4</span>*N];{"\n"}
                {"  "}<span className="text-primary">void</span>{" "}
                <span className="text-info">update</span>(...) {"{\n"}
                {"    "}<span className="text-muted-foreground/50">...</span>{"\n"}
                {"  }\n"}
                {"}"};
              </code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
