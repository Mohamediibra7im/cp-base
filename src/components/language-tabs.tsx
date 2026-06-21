"use client";

import { useState } from "react";
import { CodeBlock } from "./code-block";

export function LanguageTabs({ codes }: { codes: { language: string; code: string }[] }) {
  const [active, setActive] = useState(codes[0]?.language || "cpp");
  const activeCode = codes.find((c) => c.language === active);

  if (!codes.length) {
    return (
      <div className="border border-border p-8 text-center">
        <p className="text-xs text-muted-foreground/40">[EMPTY] No code available</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Tabs */}
      <div className="flex gap-0 border border-border border-b-0 bg-background overflow-x-auto scrollbar-thin">
        {codes.map(({ language }) => {
          const isActive = active === language;
          return (
            <button
              key={language}
              onClick={() => setActive(language)}
              className={`
                px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all border-r border-border last:border-r-0 shrink-0
                ${isActive
                  ? "bg-primary/10 text-primary border-b-2 border-b-primary -mb-px"
                  : "text-muted-foreground/40 hover:text-muted-foreground hover:bg-secondary/50"
                }
              `}
            >
              {language}
            </button>
          );
        })}
      </div>

      {/* Code */}
      {activeCode && <CodeBlock code={activeCode.code} language={activeCode.language} />}
    </div>
  );
}
