import { cn } from "@/lib/utils";

/**
 * The three red/yellow/green "traffic light" window dots used on terminal-style
 * card headers throughout the app.
 *
 * size: "sm" (h-1.5, default) | "md" (h-2)
 * tone: "dim" (/40, default) | "bright" (/60)
 */
export function TrafficLights({
  size = "sm",
  tone = "dim",
  className,
}: {
  size?: "sm" | "md";
  tone?: "dim" | "bright";
  className?: string;
}) {
  const dot = size === "md" ? "h-2 w-2" : "h-1.5 w-1.5";
  const gap = size === "md" ? "gap-1.5" : "gap-1";
  const dots =
    tone === "bright"
      ? ["bg-destructive/60", "bg-warning/60", "bg-success/60"]
      : ["bg-destructive/40", "bg-warning/40", "bg-success/40"];
  return (
    <div className={cn("flex shrink-0", gap, className)}>
      {dots.map((c, i) => (
        <span key={i} className={cn("rounded-full", dot, c)} />
      ))}
    </div>
  );
}
