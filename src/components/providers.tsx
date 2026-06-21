"use client";

import { ThemeProvider } from "./theme-provider";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      {children}
      <Toaster richColors position="top-center" />
    </ThemeProvider>
  );
}
