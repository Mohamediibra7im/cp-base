import { cn } from "@/lib/utils";
import { TERMINAL_LEGEND_CLS } from "./field-styles";

/**
 * Legend-bordered fieldset used to group sections of the contribute forms.
 * Default spacing is `space-y-4`; pass `className` to override (e.g. space-y-3).
 */
export function RetroFieldset({
  legend,
  children,
  className,
}: {
  legend: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <fieldset className={cn("border border-border/80 bg-card/25 p-5 space-y-4", className)}>
      <legend className={TERMINAL_LEGEND_CLS}>{legend}</legend>
      {children}
    </fieldset>
  );
}
