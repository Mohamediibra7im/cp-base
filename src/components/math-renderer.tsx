"use client";

import { useMemo } from "react";
import katex from "katex";

function renderMathBlock(latex: string): string {
  try {
    return katex.renderToString(latex.trim(), {
      displayMode: true,
      throwOnError: false,
      trust: true,
    });
  } catch {
    return `<span class="text-error">[math error]</span>`;
  }
}

function renderMathInline(latex: string): string {
  try {
    return katex.renderToString(latex.trim(), {
      displayMode: false,
      throwOnError: false,
      trust: true,
    });
  } catch {
    return `<span class="text-error">[math error]</span>`;
  }
}

function renderMarkdownWithMath(md: string): string {
  if (!md.trim()) return "";

  // Extract and replace math blocks first
  const mathBlocks: string[] = [];
  let processed = md.replace(/\$\$\n?([\s\S]*?)\n?\$\$/g, (_, latex) => {
    const placeholder = `%%MATH_BLOCK_${mathBlocks.length}%%`;
    mathBlocks.push(renderMathBlock(latex));
    return placeholder;
  });

  // Extract inline math
  const inlineMath: string[] = [];
  processed = processed.replace(/\$([^\$\n]+?)\$/g, (_, latex) => {
    const placeholder = `%%INLINE_MATH_${inlineMath.length}%%`;
    inlineMath.push(renderMathInline(latex));
    return placeholder;
  });

  // Markdown transforms
  let html = processed
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="bg-muted/50 border border-border p-3 my-2 text-xs overflow-x-auto"><code>$2</code></pre>')
    .replace(/^### (.+)$/gm, '<h3 class="text-sm font-bold mt-4 mb-2 text-foreground">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-base font-bold mt-5 mb-2 text-foreground">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-lg font-bold mt-6 mb-3 text-foreground">$1</h1>')
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code class="bg-muted/50 border border-border px-1 py-0.5 text-xs text-primary">$1</code>')
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-2 border-primary/40 pl-3 my-2 text-muted-foreground/70 italic">$1</blockquote>')
    .replace(/^---$/gm, '<hr class="border-border my-4" />')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary underline underline-offset-2 hover:text-primary/80">$1</a>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc text-sm">$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal text-sm">$1</li>')
    .replace(/\n\n/g, '</p><p class="my-2 text-sm">')
    .replace(/\n/g, '<br />');

  html = '<p class="my-2 text-sm">' + html + '</p>';

  // Restore math blocks
  mathBlocks.forEach((math, i) => {
    html = html.replace(`%%MATH_BLOCK_${i}%%`, `<div class="my-4 text-center overflow-x-auto">${math}</div>`);
  });

  // Restore inline math
  inlineMath.forEach((math, i) => {
    html = html.replace(`%%INLINE_MATH_${i}%%`, `<span class="inline-block align-middle">${math}</span>`);
  });

  return html;
}

export function MathRenderer({ content }: { content: string }) {
  const html = useMemo(() => renderMarkdownWithMath(content), [content]);

  return (
    <div
      className="text-sm text-muted-foreground whitespace-normal leading-relaxed prose prose-sm max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
