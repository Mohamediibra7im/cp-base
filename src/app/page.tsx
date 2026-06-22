import { getDb, schema } from "@/db";
import { eq, sql } from "drizzle-orm";
import { CategoryCard } from "@/components/category-card";
import { HeroSection } from "@/components/hero-section";
import { Braces, Terminal } from "lucide-react";
import Link from "next/link";
import { CPProfiles } from "@/components/cp-profiles";
import { AnimateOnMount } from "@/components/animate-on-mount";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "CP-Base | Level Up Your Competitive Programming",
  description:
    "Explore a terminal-themed library of optimized competitive programming templates — graphs, data structures, math, strings, DP, and more. Search, copy, and paste into your next contest.",
  keywords: [
    "competitive programming home",
    "cp templates library",
    "algorithm templates",
    "contest prep",
    "cp-base",
    "programming contest tools",
  ],
  openGraph: {
    title: "CP-Base | Level Up Your Competitive Programming",
    description:
      "Explore a terminal-themed library of optimized competitive programming templates — graphs, data structures, math, strings, DP, and more. Search, copy, and paste into your next contest.",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default async function Home() {
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

  let cats: Awaited<ReturnType<typeof db.query.categories.findMany>> = [];
  let countMap: Record<number, number> = {};
  let totalTemplates = 0;

  try {
    cats = await db.query.categories.findMany({
      orderBy: (c, { asc }) => [asc(c.order)],
    });

    for (const cat of cats) {
      const [row] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(schema.templates)
        .where(eq(schema.templates.categoryId, cat.id));
      countMap[cat.id] = row?.count ?? 0;
    }

    totalTemplates = Object.values(countMap).reduce((a, b) => a + b, 0);
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
    <div className="relative z-10 flex flex-col">
      <HeroSection totalTemplates={totalTemplates} totalCategories={cats.length} />

      {/* Profiles Section */}
      <AnimateOnMount delay={400}>
        <section id="profiles" className="relative border-b border-border bg-muted/5">
          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:py-20">
            {/* Section header */}
            <div className="mb-10">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                <span className="text-primary">$</span>
                <span className="text-foreground font-bold">cat profiles.json</span>
                <span className="inline-block h-3 w-1.5 bg-primary animate-blink ml-1" />
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5 text-muted-foreground/50">
                  Competitive programming profiles & active contest ratings.
                </span>
              </div>
            </div>

            <CPProfiles />
          </div>
        </section>
      </AnimateOnMount>

      {/* Categories Section */}
      <AnimateOnMount delay={650}>
        <section id="categories" className="relative border-b border-border">
          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:py-20">
            {/* Section header */}
            <div className="mb-10">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                <span className="text-primary">$</span>
                <span className="text-foreground font-bold">ls categories/</span>
                <span className="inline-block h-3 w-1.5 bg-primary animate-blink ml-1" />
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Braces className="h-3 w-3" />
                  {cats.length} categories
                </span>
                <span className="text-border">|</span>
                <span className="flex items-center gap-1.5">
                  <Terminal className="h-3 w-3" />
                  {totalTemplates} templates
                </span>

              </div>
            </div>

            {/* Category grid */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {cats.map((cat, i) => (
                <div key={cat.id} className={`animate-slide-up stagger-${Math.min(i + 1, 8)} h-full`}>
                  <CategoryCard category={cat} count={countMap[cat.id] || 0} />
                </div>
              ))}
            </div>

            {/* Empty state */}
            {cats.length === 0 && (
              <div className="border border-border bg-card p-8 text-center">
                <div className="text-xs text-muted-foreground mb-2">[EMPTY] No categories found</div>
                <p className="text-xs text-muted-foreground/60">No categories yet. Check back later.</p>
              </div>
            )}

            {/* View all templates link */}
            <div className="mt-10 text-center">
              <Link
                href="/templates"
                className="inline-flex items-center gap-2 text-xs text-muted-foreground/50 hover:text-primary transition-colors"
              >
                <span className="text-primary">$</span>
                <span>view all templates</span>
                <span className="text-muted-foreground/30">→</span>
              </Link>
            </div>
          </div>
        </section>
      </AnimateOnMount>
    </div>
  );
}
