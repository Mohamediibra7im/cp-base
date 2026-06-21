"use client";

import { useMemo } from "react";
import Fuse from "fuse.js";
import { TemplateCard } from "@/components/template-card";
import type { InferSelectModel } from "drizzle-orm";
import type { templates as templatesTable, categories as categoriesTable } from "@/db/schema";

type Template = InferSelectModel<typeof templatesTable>;
type Category = InferSelectModel<typeof categoriesTable>;
type TemplateWithCategory = Template & { category?: Pick<Category, "name" | "slug"> };

const fuseOptions = {
  keys: [
    { name: "title" as const, weight: 0.4 },
    { name: "description" as const, weight: 0.3 },
    { name: "tags" as const, weight: 0.2 },
    { name: "category.name" as const, weight: 0.1 },
  ],
  threshold: 0.4,
  includeScore: true,
  minMatchCharLength: 2,
};

export function TemplatesList({ templates, query }: { templates: TemplateWithCategory[]; query?: string }) {
  const fuse = useMemo(() => new Fuse(templates, fuseOptions), [templates]);

  const results = useMemo(() => {
    if (!query?.trim()) return templates;
    return fuse.search(query).map((r) => r.item);
  }, [fuse, query, templates]);

  if (results.length === 0) {
    return (
      <div className="border border-border bg-card p-8 text-center">
        <div className="text-xs text-muted-foreground mb-2">
          {query ? `No templates matching "${query}"` : "No templates found"}
        </div>
        <p className="text-xs text-muted-foreground/60">
          {query ? "Try a different search term" : "No templates available yet."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {results.map((t, i) => (
        <div key={t.id} className={`animate-slide-up stagger-${Math.min(i + 1, 8)}`}>
          <TemplateCard template={t} />
        </div>
      ))}
    </div>
  );
}
