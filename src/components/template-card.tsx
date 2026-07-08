"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { InferSelectModel } from "drizzle-orm";
import type { templates as templatesTable, categories as categoriesTable } from "@/db/schema";
import { useTerminalTheme } from "./theme-provider";

type Template = InferSelectModel<typeof templatesTable>;
type Category = InferSelectModel<typeof categoriesTable>;
type TemplateWithCategory = Template & { category?: Pick<Category, "name" | "slug"> };

export function TemplateCard({ template }: { template: TemplateWithCategory }) {
  const { playClick } = useTerminalTheme();

  return (
    <Link href={`/template/${template.slug}`} onClick={playClick} className="block h-full">
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
              template_{template.slug}.cpp
            </span>
          </div>
        </div>

        <div className="p-4 flex flex-col flex-1">
          {/* Main Title Row */}
          <div className="flex items-start justify-between mb-1.5">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-xs text-foreground group-hover:text-primary transition-colors truncate">
                {template.title}
              </h3>
            </div>
            <ArrowUpRight className="h-3 w-3 text-muted-foreground/0 group-hover:text-primary transition-all shrink-0 ml-2 mt-0.5" />
          </div>

          {/* Category */}
          <div className="flex items-center gap-2 mb-2 text-[10px]">
            {template.category && (
              <span className="text-info font-bold">
                [{template.category.name}]
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-[11px] text-muted-foreground/45 line-clamp-2 leading-relaxed mb-3 flex-1">
            {template.description}
          </p>

          {/* Tags / Actions Row */}
          <div className="flex items-center justify-between mt-auto pt-2.5 border-t border-border/30">
            {/* Tags */}
            <div className="flex flex-wrap gap-1 max-w-[150px]">
              {template.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-[9px] text-muted-foreground/35 border border-border/50 px-1 py-0 select-none">
                  #{tag}
                </span>
              ))}
              {template.tags.length > 3 && (
                <span className="text-[9px] text-muted-foreground/25 font-bold">
                  +{template.tags.length - 3}
                </span>
              )}
            </div>

            {/* Hover visual prompt */}
            <span className="text-[9px] text-muted-foreground/30 group-hover:text-primary transition-all duration-300 flex items-center gap-0.5 select-none shrink-0">
              <span className="text-primary/50">$</span> cat {template.slug.slice(0, 10)}{template.slug.length > 10 ? '..' : ''}
              <span className="inline-block h-2.5 w-1 bg-primary animate-blink opacity-0 group-hover:opacity-100" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
