"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { InferSelectModel } from "drizzle-orm";
import type { templates as templatesTable, categories as categoriesTable } from "@/db/schema";

type Template = InferSelectModel<typeof templatesTable>;
type Category = InferSelectModel<typeof categoriesTable>;
type TemplateWithCategory = Template & { category?: Pick<Category, "name" | "slug"> };

export function TemplateCard({ template }: { template: TemplateWithCategory }) {
  return (
    <Link href={`/template/${template.slug}`}>
      <div className="group relative flex flex-col border border-border bg-card hover:border-primary/30 transition-all duration-300 overflow-hidden min-h-[160px]">
        <div className="p-5 flex flex-col flex-1">
          {/* Header */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors truncate">
                {template.title}
              </h3>
            </div>
            <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground/0 group-hover:text-primary transition-all shrink-0 ml-2 mt-0.5" />
          </div>

          {/* Category + Complexity */}
          <div className="flex items-center gap-2 mb-2 text-xs">
            {template.category && (
              <span className="text-info">
                {template.category.name}
              </span>
            )}
            {template.complexity && (
              <>
                <span className="text-border">/</span>
                <span className="text-muted-foreground/50 font-mono">{template.complexity}</span>
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-xs text-muted-foreground/45 line-clamp-2 leading-relaxed mb-3 flex-1">
            {template.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mt-auto">
            {template.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="text-[10px] text-muted-foreground/35 border border-border/50 px-1.5 py-0">
                #{tag}
              </span>
            ))}
            {template.tags.length > 4 && (
              <span className="text-[10px] text-muted-foreground/25">
                +{template.tags.length - 4}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
