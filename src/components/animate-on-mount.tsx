"use client";

import { useEffect, useState } from "react";

interface AnimateOnMountProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function AnimateOnMount({ children, delay = 0, className = "" }: AnimateOnMountProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      className={`transition-all duration-700 ease-out ${
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
      } ${className}`}
    >
      {children}
    </div>
  );
}
