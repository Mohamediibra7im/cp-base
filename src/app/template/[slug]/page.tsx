import { notFound } from "next/navigation";
import Link from "next/link";
import { getDb } from "@/db";
import { templates, categories, templateCodes, contributions } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { LanguageTabs } from "@/components/language-tabs";
import { MathRenderer } from "@/components/math-renderer";
import { LikeButton } from "@/components/like-button";
import { ArrowLeft, Clock, Calendar, FileText, UserPlus, ArrowUpRight } from "lucide-react";
import { TerminalBreadcrumb } from "@/components/terminal";

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
  let contributors: { name: string; cfHandle: string | null; role: "creator" | "editor"; avatar: string }[] = [];

  try {
    [template] = await db.select().from(templates).where(eq(templates.slug, slug));
    if (!template || template.hidden) notFound();

    [category] = await db.select().from(categories).where(eq(categories.id, template.categoryId));
    if (!category || category.hidden) notFound();

    codes = await db.select().from(templateCodes).where(eq(templateCodes.templateId, template.id));

    // Notes are stored in the database
    notes = template.notes;

    // Build the full contributor list from approved contributions on this template
    // (oldest first: the "new" submission is the creator, "edit" approvals are editors)
    try {
      const rows = await db
        .select({
          name: contributions.contributorName,
          cfHandle: contributions.contributorCfHandle,
          type: contributions.type,
          createdAt: contributions.createdAt,
        })
        .from(contributions)
        .where(and(eq(contributions.templateId, template.id), eq(contributions.status, "approved")))
        .orderBy(contributions.createdAt);

      const seen = new Set<string>();
      const collected: { name: string; cfHandle: string | null; role: "creator" | "editor" }[] = [];
      for (const r of rows) {
        const key = `${r.name.toLowerCase()}::${(r.cfHandle || "").toLowerCase()}`;
        if (seen.has(key)) continue;
        seen.add(key);
        collected.push({
          name: r.name,
          cfHandle: r.cfHandle,
          role: r.type === "new" ? "creator" : "editor",
        });
      }

      // Fallback: legacy templates that only stored a single credit column
      if (collected.length === 0 && template.contributorName) {
        collected.push({
          name: template.contributorName,
          cfHandle: template.contributorCfHandle,
          role: "creator",
        });
      }

      // Resolve avatars: real Codeforces photo for handles (one batched call),
      // deterministic generated avatar otherwise.
      const cfAvatars = new Map<string, string>();
      const handles = collected.map((c) => c.cfHandle).filter(Boolean) as string[];
      if (handles.length > 0) {
        try {
          const res = await fetch(
            `https://codeforces.com/api/user.info?handles=${handles.map(encodeURIComponent).join(";")}`,
            { next: { revalidate: 86400 } }
          );
          if (res.ok) {
            const data = await res.json();
            if (data.status === "OK" && Array.isArray(data.result)) {
              for (const u of data.result) {
                let img: string | undefined = u.titlePhoto || u.avatar;
                if (img?.startsWith("//")) img = `https:${img}`;
                if (img && !/no-title\.jpg|no-avatar/i.test(img)) {
                  cfAvatars.set(u.handle.toLowerCase(), img);
                }
              }
            }
          }
        } catch {
          // CF unreachable — fall through to generated avatars
        }
      }

      contributors = collected.map((c) => {
        const cf = c.cfHandle ? cfAvatars.get(c.cfHandle.toLowerCase()) : undefined;
        const avatar =
          cf ||
          `https://api.dicebear.com/9.x/identicon/svg?seed=${encodeURIComponent(
            c.cfHandle || c.name
          )}&backgroundType=gradientLinear`;
        return { ...c, avatar };
      });
    } catch {
      // contributor list is non-critical; ignore failures
    }
  } catch {
    return (
      <div className="relative z-10 mx-auto max-w-4xl w-full px-4 py-8">
        <TerminalBreadcrumb className="mb-6" items={[{ label: "home", href: "/" }]} />
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
      <TerminalBreadcrumb
        className="mb-8"
        items={[
          { label: "home", href: "/" },
          ...(category ? [{ label: category.slug, href: `/category/${category.slug}`, className: "text-info font-bold" }] : []),
        ]}
      />

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
            {contributors.length > 0 && (
              <>
                <span className="text-border/30">|</span>
                <a href="#contributors" className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors">
                  <UserPlus className="h-3.5 w-3.5" />
                  <span>
                    {contributors.length} {contributors.length === 1 ? "contributor" : "contributors"}
                  </span>
                </a>
              </>
            )}
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

      {/* Contributors — GitHub-style credits */}
      {contributors.length > 0 && (
        <div id="contributors" className="scroll-mt-16 mb-8 font-mono text-xs">
          <div className="flex items-center gap-2 mb-4 font-bold">
            <span className="text-primary">$</span>
            <span className="text-foreground">git shortlog -sn</span>
            <span className="text-muted-foreground/40">// {contributors.length} {contributors.length === 1 ? "contributor" : "contributors"}</span>
          </div>

          <div className="border border-border/80 bg-card/45 backdrop-blur-md p-5 relative overflow-hidden">
            <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-primary/5 blur-2xl" />
            <div className="flex items-center justify-between pb-3 border-b border-border/30 mb-4 text-muted-foreground/45 text-[9px] uppercase tracking-wider select-none">
              <span>contributors --list</span>
              <span>credits</span>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {contributors.map((c, i) => {
                const inner = (
                  <>
                    <img
                      src={c.avatar}
                      alt={c.name}
                      loading="lazy"
                      className="h-5 w-5 rounded-full border border-primary/25 bg-primary/10 object-cover shrink-0"
                    />
                    <span className="font-bold">{c.name}</span>
                    {c.role === "creator" && (
                      <span className="text-[8px] uppercase tracking-wider text-primary/70 border border-primary/25 bg-primary/5 px-1 py-0.5 select-none">
                        creator
                      </span>
                    )}
                    {c.cfHandle && <ArrowUpRight className="h-3 w-3 opacity-60 shrink-0" />}
                  </>
                );
                return c.cfHandle ? (
                  <a
                    key={i}
                    href={`https://codeforces.com/profile/${c.cfHandle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`@${c.cfHandle} on Codeforces`}
                    className="flex items-center gap-1.5 border border-border/60 bg-card/30 px-2.5 py-1.5 text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
                  >
                    {inner}
                  </a>
                ) : (
                  <span
                    key={i}
                    className="flex items-center gap-1.5 border border-border/60 bg-card/30 px-2.5 py-1.5 text-muted-foreground"
                  >
                    {inner}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      )}

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
