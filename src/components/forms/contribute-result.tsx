import Link from "next/link";

/**
 * The post-submit confirmation screen shared by both contribute forms.
 */
export function ContributeResult({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <div className="relative z-10 mx-auto max-w-3xl w-full px-4 py-12 font-mono">
      <div className="border border-primary bg-card/45 backdrop-blur-md p-8 text-center">
        <div className="text-primary text-lg font-bold mb-3 glow-text-strong">{title}</div>
        <p className="text-xs text-muted-foreground/65 mb-6 leading-relaxed">{message}</p>
        <div className="flex justify-center gap-3">
          <Link
            href="/contribute"
            className="text-[10px] px-4 py-2 border border-primary bg-primary/10 text-primary hover:bg-primary/20 transition-colors uppercase font-bold tracking-wider"
          >
            [ submit another ]
          </Link>
          <Link
            href="/"
            className="text-[10px] px-4 py-2 border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors uppercase tracking-wider"
          >
            [ return home ]
          </Link>
        </div>
      </div>
    </div>
  );
}
