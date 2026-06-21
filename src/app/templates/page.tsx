import { getDb, schema } from "@/db";
import { sql } from "drizzle-orm";
import { TemplatesList } from "@/components/templates-list";
import { Terminal, Code2 } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Templates",
  description: "Browse all competitive programming templates.",
};

export default async function TemplatesPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const db = getDb();

  if (!db) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <div className="border border-border bg-card p-8 max-w-md w-full">
          <div className="text-xs space-y-2 text-left">
            <div className="text-muted-foreground">$ cp-base --status</div>
            <div className="text-error animate-blink">[ERR] Something went wrong</div>
            <div className="text-muted-foreground">Please try again later.</div>
            <div className="flex items-center gap-1 mt-3">
              <span className="text-primary">$</span>
              <span className="inline-block h-3 w-1.5 bg-primary animate-blink" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  let templates: Awaited<ReturnType<typeof db.query.templates.findMany>> = [];
  let totalTemplates = 0;

  try {
    templates = await db.query.templates.findMany({
      with: { category: true },
      orderBy: (t, { desc }) => [desc(t.createdAt)],
    });

    const [countRow] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(schema.templates);
    totalTemplates = countRow?.count ?? 0;
  } catch {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <div className="border border-border bg-card p-8 max-w-md w-full">
          <div className="text-xs space-y-2 text-left">
            <div className="text-muted-foreground">$ cp-base --status</div>
            <div className="text-error animate-blink">[ERR] Something went wrong</div>
            <div className="text-muted-foreground">Please try again later.</div>
            <div className="flex items-center gap-1 mt-3">
              <span className="text-primary">$</span>
              <span className="inline-block h-3 w-1.5 bg-primary animate-blink" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10">
      <section className="relative mx-auto max-w-7xl px-4 py-12 sm:py-16">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
            <span className="text-primary">$</span>
            <span className="text-foreground font-bold">
              {q ? `grep "${q}" --all` : "ls templates/"}
            </span>
            {!q && <span className="inline-block h-3 w-1.5 bg-primary animate-blink ml-1" />}
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Terminal className="h-3 w-3" />
              {totalTemplates} templates
            </span>
            <span className="text-border">|</span>
            <span className="flex items-center gap-1.5">
              <Code2 className="h-3 w-3" />
              6 languages
            </span>
          </div>
        </div>

        {/* Fuzzy search results */}
        <TemplatesList templates={templates} query={q} />
      </section>
    </div>
  );
}
