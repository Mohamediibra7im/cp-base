import { cn } from "@/lib/utils";

const glowMap = {
  "top-right": "-top-24 -right-24",
  "bottom-left": "-bottom-24 -left-24",
  "bottom-right": "-bottom-24 -right-24",
} as const;

/**
 * Bordered, blurred terminal card with an optional soft glow blob in a corner.
 * The blob is the decorative `rounded-full blur-2xl` element repeated across
 * the template detail page and contribute pages.
 */
export function TerminalCard({
  children,
  className,
  glow,
  glowClassName = "bg-primary/5",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  glow?: keyof typeof glowMap;
  glowClassName?: string;
  as?: "div" | "section";
}) {
  return (
    <Tag className={cn("border border-border/80 bg-card/45 backdrop-blur-md relative overflow-hidden", className)}>
      {glow && (
        <div className={cn("absolute w-48 h-48 rounded-full blur-2xl", glowMap[glow], glowClassName)} />
      )}
      {children}
    </Tag>
  );
}
