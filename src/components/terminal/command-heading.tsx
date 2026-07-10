import { cn } from "@/lib/utils";

/**
 * A `$ command`-style section heading. Defaults match the bold headers used
 * before code/notes sections; pass `className` / `promptClassName` /
 * `textClassName` to match the smaller muted variants.
 */
export function CommandHeading({
  children,
  className,
  promptClassName = "text-primary",
  textClassName,
}: {
  children: React.ReactNode;
  className?: string;
  promptClassName?: string;
  textClassName?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className={cn("font-bold", promptClassName)}>$</span>
      <span className={textClassName}>{children}</span>
    </div>
  );
}
