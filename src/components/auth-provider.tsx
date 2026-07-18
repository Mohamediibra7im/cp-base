"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (login: string, password: string) => Promise<{ success: boolean; error?: string; needsVerification?: boolean; email?: string }>;
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string; needsVerification?: boolean; email?: string }>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Load the current session on mount; setState inside refresh is intentional.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, [refresh]);

  const login = async (login: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login, password }),
    });
    const data = await res.json();
    if (res.ok) {
      setUser(data.user);
      return { success: true };
    }
    return {
      success: false,
      error: data.error,
      needsVerification: data.needsVerification,
      email: data.email,
    };
  };

  const register = async (username: string, email: string, password: string) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      if (data.needsVerification) {
        return { success: true, needsVerification: true, email: data.email };
      }
      setUser(data.user);
      return { success: true };
    }
    return {
      success: false,
      error: data.error,
      needsVerification: data.needsVerification,
      email: data.email,
    };
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
