import { notFound } from "next/navigation";
import Link from "next/link";
import { getDb } from "@/db";
import { templates, categories, templateCodes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { LanguageTabs } from "@/components/language-tabs";
import { MathRenderer } from "@/components/math-renderer";
import { ArrowLeft, Clock, Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const db = getDb();
  if (!db) {
    return {
      title: "Template | CP-Base",
    };
  }

  try {
    const [template] = await db.select().from(templates).where(eq(templates.slug, slug));
    if (!template) {
      return {
        title: "Template Not Found | CP-Base",
      };
    }

    const [category] = await db.select().from(categories).where(eq(categories.id, template.categoryId));

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
        images: ["/opengraph-image"],
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

  try {
    [template] = await db.select().from(templates).where(eq(templates.slug, slug));
    if (!template) notFound();

    [category] = await db.select().from(categories).where(eq(categories.id, template.categoryId));
    codes = await db.select().from(templateCodes).where(eq(templateCodes.templateId, template.id));
  } catch {
    return (
      <div className="relative z-10 mx-auto max-w-4xl w-full px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3 py-1.5 border border-border bg-card text-xs text-muted-foreground hover:text-primary hover:border-primary/30 transition-all mb-6"
        >
          <ArrowLeft className="h-3 w-3" />
          <span className="text-primary/60">$</span> cd home
        </Link>
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
      <div className="flex items-center gap-2 mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3 py-1.5 border border-border bg-card text-xs text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
        >
          <ArrowLeft className="h-3 w-3" />
          <span className="text-primary/60">$</span> cd home
        </Link>
        <span className="text-border">/</span>
        {category && (
          <Link
            href={`/category/${category.slug}`}
            className="inline-flex items-center gap-2 px-3 py-1.5 border border-border bg-card text-xs text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
          >
            <ArrowLeft className="h-3 w-3" />
            <span className="text-primary/60">$</span> cd {category.slug}
          </Link>
        )}
      </div>

      {/* Template header */}
      <div className="mb-8 border-b border-border pb-6">
        <div className="flex items-center gap-2 mb-1 text-xs text-muted-foreground">
          <span className="text-primary">$</span>
          <span>cat templates/{template!.slug}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-primary glow-text mt-3 mb-2">
          {template!.title}
        </h1>
        {template!.description && (
          <p className="text-sm text-muted-foreground leading-relaxed">{template!.description}</p>
        )}
      </div>

      {/* Meta info */}
      <div className="flex flex-wrap items-center gap-3 mb-6 text-xs">
        {template!.complexity && (
          <span className="text-muted-foreground border border-border px-2 py-0.5">{template!.complexity}</span>
        )}
        {category && (
          <Link
            href={`/category/${category.slug}`}
            className="text-info hover:text-primary transition-colors"
          >
            {category.name}
          </Link>
        )}
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Calendar className="h-3 w-3" />
          {new Date(template!.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-8">
        {template!.tags.map((tag: string) => (
          <span key={tag} className="text-[10px] text-muted-foreground border border-border px-2 py-0.5">
            #{tag}
          </span>
        ))}
      </div>

      {/* Code */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4 text-xs">
          <span className="text-primary">$</span>
          <span className="text-foreground font-bold">cat code/</span>
        </div>
        <LanguageTabs codes={codes!} />
      </div>

      {/* Notes */}
      {template!.notes && (
        <div>
          <div className="flex items-center gap-2 mb-4 text-xs">
            <span className="text-primary">$</span>
            <span className="text-foreground font-bold">cat notes.txt</span>
          </div>
          <div className="border border-border bg-card p-4">
            <MathRenderer content={template!.notes} />
          </div>
        </div>
      )}
    </div>
  );
}
