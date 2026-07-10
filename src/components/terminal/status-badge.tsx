import { cn } from "@/lib/utils";

type Tone = "primary" | "destructive" | "warning" | "info" | "success";

const toneCls: Record<Tone, string> = {
  primary: "border-primary/40 bg-primary/5 text-primary",
  destructive: "border-destructive/40 bg-destructive/5 text-destructive",
  warning: "border-warning/40 bg-warning/5 text-warning",
  info: "border-info/40 bg-info/5 text-info",
  success: "border-success/40 bg-success/5 text-success",
};

/**
 * Small bracketed status pill, e.g. `[ VISIBLE ]`, `PENDING`, `[ NEW ]`.
 * Matches the `text-[9px] font-bold px-1.5 py-0.5 border` style used across
 * the admin tables and contribution rows.
 */
export function StatusBadge({
  tone,
  children,
  className,
}: {
  tone: Tone;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "text-[9px] font-bold px-1.5 py-0.5 border rounded-none",
        toneCls[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
