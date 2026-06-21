"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Shield } from "lucide-react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);

    if (res.ok) {
      const params = new URLSearchParams(window.location.search);
      router.push(params.get("redirect") || "/admin");
    } else {
      toast.error("Invalid password");
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-muted">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="font-mono tracking-tight">admin login</CardTitle>
          <CardDescription>Enter the admin password to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={login} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="font-mono text-xs text-muted-foreground">$ password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                autoFocus
                className="font-mono"
              />
            </div>
            <Button type="submit" className="w-full font-mono" disabled={loading}>
              {loading ? "Verifying..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
