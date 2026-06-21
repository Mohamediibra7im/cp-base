"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="max-w-md w-full">
        {/* Error output */}
        <div className="border border-border p-6 text-left mb-8">
          <div className="text-xs space-y-1.5">
            <div className="text-muted-foreground/40">$ curl /this-page</div>
            <div className="text-error">[ERR] 404: Page not found</div>
            <div className="text-muted-foreground/40">The requested resource does not exist.</div>
            <div className="text-muted-foreground/40">Check the URL and try again.</div>
            <div className="flex items-center gap-1 mt-3">
              <span className="text-primary">$</span>
              <span className="inline-block h-3 w-1.5 bg-primary animate-blink" />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center gap-2 border border-primary bg-primary/10 px-6 text-sm font-bold text-primary transition-all hover:bg-primary/20"
          >
            <span className="text-primary/60">$</span>
            cd ~
          </Link>
          <button
            onClick={() => router.back()}
            className="inline-flex h-10 items-center justify-center gap-2 border border-border px-6 text-sm text-muted-foreground transition-all hover:border-primary/40 hover:text-primary"
          >
            <span className="text-muted-foreground/40">$</span>
            cd -
          </button>
        </div>
      </div>
    </div>
  );
}
