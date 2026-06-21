"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X } from "lucide-react";
import { useTerminalTheme } from "./theme-provider";

interface SearchInputProps {
  placeholder?: string;
  defaultValue?: string;
}

export function SearchInput({ placeholder = "search templates...", defaultValue = "" }: SearchInputProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { playClick } = useTerminalTheme();
  const [value, setValue] = useState(defaultValue);
  const timeoutRef = useRef<NodeJS.Timeout>(null);
  const lastPushed = useRef(defaultValue);

  const pushSearch = useCallback((q: string) => {
    if (q === lastPushed.current) return;
    lastPushed.current = q;

    const params = new URLSearchParams(searchParams.toString());
    if (q.trim()) {
      params.set("q", q.trim());
    } else {
      params.delete("q");
    }
    router.push(`?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      pushSearch(value);
    }, 300);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [value, pushSearch]);

  const clearSearch = () => {
    playClick();
    setValue("");
    pushSearch("");
  };

  return (
    <div className="relative flex items-center w-full sm:w-auto font-mono">
      <Search className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground/50 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => {
          playClick();
          setValue(e.target.value);
        }}
        placeholder={placeholder}
        className="h-8 w-full sm:w-56 pl-8 pr-7 text-xs border border-border bg-card text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 transition-colors"
      />
      {value && (
        <button
          type="button"
          onClick={clearSearch}
          className="absolute right-2 h-3.5 w-3.5 text-muted-foreground/50 hover:text-primary transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
