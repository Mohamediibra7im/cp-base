"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import { Terminal, Search, X, Braces, Library } from "lucide-react";

function NavSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") || "");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>(null);
  const lastPushed = useRef(searchParams.get("q") || "");

  const pushSearch = useCallback(
    (q: string) => {
      if (q === lastPushed.current) return;
      lastPushed.current = q;
      const params = new URLSearchParams();
      if (q.trim()) {
        params.set("q", q.trim());
      }
      const qs = params.toString();
      router.push(`/templates${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [router]
  );

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      pushSearch(value);
    }, 400);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [value, pushSearch]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape") {
        inputRef.current?.blur();
        setFocused(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="relative flex items-center">
      <div
        className={`flex items-center gap-2 border transition-all duration-200 ${
          focused
            ? "border-primary/50 bg-card w-64 sm:w-80"
            : "border-border bg-card/30 w-48 sm:w-64"
        }`}
      >
        <div className="flex items-center gap-1.5 pl-2.5 py-1.5">
          <span className="text-primary/60 text-xs">$</span>
          <Search className="h-3 w-3 text-muted-foreground/40" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="grep templates..."
          className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/30 outline-none py-1.5 pr-2"
        />
        {!value && !focused && (
          <div className="flex items-center gap-0.5 pr-2.5 shrink-0">
            <kbd className="text-[9px] text-muted-foreground/25 border border-border/50 px-1 py-0.5 font-mono">⌘K</kbd>
          </div>
        )}
        {value && (
          <button
            type="button"
            onClick={() => {
              setValue("");
              lastPushed.current = "";
              router.push("/templates", { scroll: false });
            }}
            className="pr-2.5 text-muted-foreground/30 hover:text-primary transition-colors shrink-0"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  );
}

export function NavBar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md transition-all duration-300 ${
        scrolled ? "border-border/50 bg-background/95" : ""
      }`}
    >
      <div className="container flex h-11 items-center justify-between px-4 mx-auto max-w-7xl">
        {/* Left: Logo + Nav links */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="relative flex items-center justify-center h-5 w-5 border border-primary/30 bg-primary/5">
              <Terminal className="h-3 w-3 text-primary" />
            </div>
            <span className="text-xs font-bold tracking-[0.2em] text-primary uppercase">
              CP-Base
            </span>
          </Link>

          {/* Nav links */}
          <nav className="hidden sm:flex items-center gap-1">
            <Link
              href="/#categories"
              className={`relative flex items-center gap-1.5 px-3 py-1.5 text-[11px] tracking-wide uppercase transition-colors ${
                pathname === "/"
                  ? "text-primary"
                  : "text-muted-foreground/40 hover:text-foreground"
              }`}
            >
              <Braces className="h-3 w-3" />
              <span>categories</span>
              {pathname === "/" && (
                <span className="absolute bottom-0 left-3 right-3 h-px bg-primary" />
              )}
            </Link>
            <Link
              href="/templates"
              className={`relative flex items-center gap-1.5 px-3 py-1.5 text-[11px] tracking-wide uppercase transition-colors ${
                isActive("/templates")
                  ? "text-primary"
                  : "text-muted-foreground/40 hover:text-foreground"
              }`}
            >
              <Library className="h-3 w-3" />
              <span>templates</span>
              {isActive("/templates") && (
                <span className="absolute bottom-0 left-3 right-3 h-px bg-primary" />
              )}
            </Link>
          </nav>
        </div>

        {/* Center: Search */}
        <div className="hidden md:flex">
          <NavSearch />
        </div>

        {/* Right: Status indicator */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/25">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            <span className="hidden sm:inline font-mono">online</span>
          </div>
        </div>
      </div>
    </header>
  );
}
