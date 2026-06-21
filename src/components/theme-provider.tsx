"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface ThemeContextValue {
  resolvedTheme: "dark";
}

const ThemeCtx = createContext<ThemeContextValue>({
  resolvedTheme: "dark",
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light");
    root.classList.add("dark");
    root.style.colorScheme = "dark";
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeCtx value={{ resolvedTheme: "dark" }}>
      {children}
    </ThemeCtx>
  );
}

export function useTheme() {
  return useContext(ThemeCtx);
}
