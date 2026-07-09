import { notFound } from "next/navigation";
import Link from "next/link";
import { getDb } from "@/db";
import { templates, categories, templateCodes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { LanguageTabs } from "@/components/language-tabs";
import { MathRenderer } from "@/components/math-renderer";
import { LikeButton } from "@/components/like-button";
import { ArrowLeft, Clock, Calendar, FileText } from "lucide-react";
import { readFile } from "fs/promises";
import { join } from "path";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const db = getDb();
  if (!db) {
    return {
      title: "Template | CP-Base",
      openGraph: { images: ["/opengraph-image"] },
      twitter: { card: "summary_large_image" },
    };
  }

  try {
    const [template] = await db.select().from(templates).where(eq(templates.slug, slug));
    if (!template || template.hidden) {
      return {
        title: "Template Not Found | CP-Base",
        openGraph: { images: ["/opengraph-image"] },
        twitter: { card: "summary_large_image" },
      };
    }

    const [category] = await db.select().from(categories).where(eq(categories.id, template.categoryId));
    if (!category || category.hidden) {
      return {
        title: "Template Not Found | CP-Base",
        openGraph: { images: ["/opengraph-image"] },
        twitter: { card: "summary_large_image" },
      };
    }

    const title = `${template.title} | CP-Base`;
    const description = template.description || `Optimized competitive programming template for ${template.title}.`;
    const keywords = [
      "competitive programming",
      "cp template",
      template.title.toLowerCase(),
      `${template.title.toLowerCase()} code`,
      ...(category ? [category.name.toLowerCase(), `${category.name.toLowerCase()} algorithms`] : []),
      ...template.tags,
    ];

    return {
      title,
      description,
      keywords,
      openGraph: {
        title: `${template.title} Template | CP-Base`,
        description,
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: `${template.title} Template | CP-Base`,
        description,
      },
    };
  } catch (err) {
    console.error("Error generating template metadata:", err);
    return {
      title: "Template | CP-Base",
      openGraph: { images: ["/opengraph-image"] },
      twitter: { card: "summary_large_image" },
    };
  }
}

export default async function TemplatePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const db = getDb();
  if (!db) notFound();

  let template;
  let category;
  let codes;
  let notes: string | null = null;

  try {
    [template] = await db.select().from(templates).where(eq(templates.slug, slug));
    if (!template || template.hidden) notFound();

    [category] = await db.select().from(categories).where(eq(categories.id, template.categoryId));
    if (!category || category.hidden) notFound();

    codes = await db.select().from(templateCodes).where(eq(templateCodes.templateId, template.id));
    
    // Load notes from .md file if exists, fallback to database
    try {
      const notesPath = join(process.cwd(), "templates_notes", `${slug}.md`);
      notes = await readFile(notesPath, "utf-8");
    } catch {
      // Fallback to database notes
      notes = template.notes;
    }
  } catch {
    return (
      <div className="relative z-10 mx-auto max-w-4xl w-full px-4 py-8">
        <div className="flex flex-wrap items-center gap-1 mb-6 font-mono text-xs select-none">
          <span className="text-primary font-bold">guest@cp-base:</span>
          <span className="text-muted-foreground/40">~</span>
          <span className="text-muted-foreground/40">/</span>
          <Link
            href="/"
            className="text-muted-foreground hover:text-primary hover:underline transition-colors underline-offset-4"
          >
            home
          </Link>
          <span className="text-primary/60 ml-1 font-bold">$</span>
          <span className="inline-block h-3.5 w-1.5 bg-primary/70 animate-blink ml-1 align-middle" />
        </div>
        <div className="text-center py-20 border border-border bg-card">
          <div className="text-xs text-error mb-2 animate-blink">[ERR] Something went wrong</div>
          <p className="text-xs text-muted-foreground">Try refreshing or try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10 mx-auto max-w-4xl w-full px-4 py-8">
      {/* Back nav */}
      <div className="flex flex-wrap items-center gap-1 mb-8 font-mono text-xs select-none">
        <span className="text-primary font-bold">guest@cp-base:</span>
        <span className="text-muted-foreground/40">~</span>
        <span className="text-muted-foreground/40">/</span>
        <Link
          href="/"
          className="text-muted-foreground hover:text-primary hover:underline transition-colors underline-offset-4"
        >
          home
        </Link>
        {category && (
          <>
            <span className="text-muted-foreground/40">/</span>
            <Link
              href={`/category/${category.slug}`}
              className="text-info hover:text-primary hover:underline transition-colors underline-offset-4 font-bold"
            >
              {category.slug}
            </Link>
          </>
        )}
        <span className="text-primary/60 ml-1 font-bold">$</span>
        <span className="inline-block h-3.5 w-1.5 bg-primary/70 animate-blink ml-1 align-middle" />
      </div>

      {/* Template Header Card */}
      <div className="border border-border/80 bg-card/45 backdrop-blur-md p-6 mb-8 relative shadow-xl overflow-hidden font-mono">
        {/* Glow decoration */}
        <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-primary/5 blur-2xl" />
        
        {/* Top titlebar */}
        <div className="flex items-center justify-between pb-4 border-b border-border/40 mb-5">
          <div className="flex items-center gap-2 text-xs">
            <div className="flex gap-1.5 shrink-0 select-none">
              <span className="h-2 w-2 rounded-full bg-destructive/60" />
              <span className="h-2 w-2 rounded-full bg-warning/60" />
              <span className="h-2 w-2 rounded-full bg-success/60" />
            </div>
            <span className="text-[10px] text-muted-foreground/35 select-none ml-2">
              templates/{template!.slug}.cpp
            </span>
          </div>
          <div className="text-[9px] text-muted-foreground/30 uppercase tracking-widest select-none flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            <span>compilable</span>
          </div>
        </div>

        {/* Title & Description */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1 text-[10px] text-muted-foreground/50">
            <span className="text-primary font-bold">$</span>
            <span>cat templates/{template!.slug}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-primary glow-text-strong mb-3">
            {template!.title}
          </h1>
          {template!.description && (
            <p className="text-xs sm:text-sm text-muted-foreground/75 leading-relaxed font-sans max-w-3xl">
              {template!.description}
            </p>
          )}
        </div>

        {/* Meta Row & Tags */}
        <div className="flex flex-col gap-3 pt-4 border-t border-border/30 text-xs">
          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-3">
            {category && (
              <Link
                href={`/category/${category.slug}`}
                className="text-info hover:text-primary hover:underline transition-colors font-bold"
              >
                [{category.name}]
              </Link>
            )}
            <span className="text-border/30">|</span>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span>
                {new Date(template!.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
            {notes && (
              <>
                <span className="text-border/30">|</span>
                <a
                  href="#notes-section"
                  className="inline-flex items-center gap-1.5 text-warning hover:text-primary transition-all duration-300"
                >
                  <span className="relative flex h-1.5 w-1.5 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-warning opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-warning"></span>
                  </span>
                  <FileText className="h-3 w-3" />
                  <span className="underline underline-offset-4 decoration-warning/20 hover:decoration-primary/40">
                    explanatory_notes.md
                  </span>
                </a>
              </>
            )}
            <span className="text-border/30">|</span>
            <div className="inline-block align-middle">
              <LikeButton templateId={template!.id} initialLikes={template!.likeCount || 0} />
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {template!.tags.map((tag: string) => (
              <span
                key={tag}
                className="text-[9px] text-muted-foreground/45 border border-border/40 bg-card/20 px-2 py-0.5 select-none"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Code */}
      <div className="mb-10 font-mono text-xs">
        <div className="flex items-center gap-2 mb-4 font-bold">
          <span className="text-primary">$</span>
          <span className="text-foreground">cat source_code/</span>
        </div>
        <LanguageTabs codes={codes!} templateId={template.id} />
      </div>

      {/* Notes */}
      {notes && (
        <div id="notes-section" className="scroll-mt-16 font-mono text-xs">
          <div className="flex items-center gap-2 mb-4 font-bold">
            <span className="text-primary">$</span>
            <span className="text-foreground">cat explanation_notes.md</span>
          </div>
          
          <div className="relative border border-border/80 bg-card/45 backdrop-blur-md p-5 shadow-xl overflow-hidden leading-relaxed">
            {/* Glow decoration */}
            <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-warning/3 blur-2xl" />
            
            {/* Notes top header bar */}
            <div className="flex items-center justify-between pb-3 border-b border-border/30 mb-4 text-muted-foreground/45 text-[9px] uppercase tracking-wider select-none">
              <span>notes_viewer --rendered</span>
              <span>markdown (math enabled)</span>
            </div>

            <div className="prose prose-invert max-w-none text-muted-foreground font-sans text-sm leading-relaxed">
              <MathRenderer content={notes} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
