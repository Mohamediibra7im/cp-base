"use client";

import Link from "next/link";
import * as LucideIcons from "lucide-react";
import type { InferSelectModel } from "drizzle-orm";
import type { categories as categoriesTable } from "@/db/schema";

type Category = InferSelectModel<typeof categoriesTable>;

export function CategoryCard({ category, count }: { category: Category; count: number }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComponent = (LucideIcons as any)[category.icon] ?? LucideIcons.Code;

  return (
    <Link href={`/category/${category.slug}`}>
      <div className="group relative flex flex-col border border-border bg-card hover:border-primary/30 transition-all duration-300 overflow-hidden min-h-[160px]">
        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-px opacity-40"
          style={{ background: `linear-gradient(90deg, transparent, ${category.color}, transparent)` }}
        />

        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-start gap-3 flex-1">
            {/* Icon */}
            <div
              className="flex h-9 w-9 items-center justify-center shrink-0 border transition-colors duration-300"
              style={{
                borderColor: `${category.color}33`,
                color: category.color,
                backgroundColor: `${category.color}08`,
              }}
            >
              <IconComponent className="h-4 w-4" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1.5">
                <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors truncate">
                  {category.name}
                </h3>
                <span className="text-[10px] text-muted-foreground/40 font-mono shrink-0 ml-2">
                  [{count}]
                </span>
              </div>
              {category.description && (
                <p className="text-xs text-muted-foreground/50 line-clamp-2 leading-relaxed">
                  {category.description}
                </p>
              )}
            </div>
          </div>

          {/* Bottom action hint */}
          <div className="flex items-center justify-end mt-3 pt-3 border-t border-border/50 mt-auto">
            <span className="text-[10px] text-muted-foreground/0 group-hover:text-primary/60 transition-all duration-300 flex items-center gap-1">
              <span className="text-primary/40">$</span> cd {category.slug}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
