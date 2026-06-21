"use client";

import Link from "next/link";
import * as LucideIcons from "lucide-react";
import type { InferSelectModel } from "drizzle-orm";
import type { categories as categoriesTable } from "@/db/schema";
import { useTerminalTheme } from "./theme-provider";

type Category = InferSelectModel<typeof categoriesTable>;

export function CategoryCard({ category, count }: { category: Category; count: number }) {
  const { playClick } = useTerminalTheme();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComponent = (LucideIcons as any)[category.icon] ?? LucideIcons.Code;

  return (
    <Link href={`/category/${category.slug}`} onClick={playClick} className="block h-full">
      <div className="group relative flex flex-col border border-border bg-card hover:border-primary/50 hover:shadow-[0_0_20px_var(--primary-glow-ultra-weak)] transition-all duration-300 overflow-hidden h-full min-h-[170px] font-mono">
        
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-3 py-1.5 border-b border-border/40 bg-muted/10 shrink-0">
          <div className="flex items-center gap-1.5">
            <div className="flex gap-1 shrink-0">
              <span className="h-1.5 w-1.5 rounded-full bg-destructive/40" />
              <span className="h-1.5 w-1.5 rounded-full bg-warning/40" />
              <span className="h-1.5 w-1.5 rounded-full bg-success/40" />
            </div>
            <span className="text-[9px] text-muted-foreground/30 truncate max-w-[140px]">
              cat_{category.slug}.sh
            </span>
          </div>
          <span className="text-[9px] text-muted-foreground/20">
            [EXE]
          </span>
        </div>

        {/* Dynamic Top accent line */}
        <div
          className="absolute top-[27px] left-0 right-0 h-[2px] opacity-40"
          style={{ background: `linear-gradient(90deg, transparent, ${category.color}, transparent)` }}
        />

        <div className="p-4 flex flex-col flex-1">
          <div className="flex items-start gap-3 flex-1 mt-1">
            {/* Icon */}
            <div
              className="flex h-9 w-9 items-center justify-center shrink-0 border transition-colors duration-300"
              style={{
                borderColor: `${category.color}33`,
                color: category.color,
                backgroundColor: `${category.color}08`,
              }}
            >
              <IconComponent className="h-4.5 w-4.5" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-xs text-foreground group-hover:text-primary transition-colors truncate">
                  {category.name}
                </h3>
                <span className="text-[10px] text-muted-foreground/40 shrink-0 ml-2">
                  [{count}]
                </span>
              </div>
              {category.description && (
                <p className="text-[11px] text-muted-foreground/50 line-clamp-2 leading-relaxed">
                  {category.description}
                </p>
              )}
            </div>
          </div>

          {/* Bottom action hint */}
          <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-border/40 mt-auto">
            <span className="text-[9px] text-muted-foreground/15">
              STATUS: READY
            </span>
            <span className="text-[9px] text-muted-foreground/30 group-hover:text-primary transition-all duration-300 flex items-center gap-0.5">
              <span className="text-primary/50">$</span> cd {category.slug}
              <span className="inline-block h-2.5 w-1 bg-primary animate-blink opacity-0 group-hover:opacity-100" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
