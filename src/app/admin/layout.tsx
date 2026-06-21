import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[80vh] mx-auto max-w-7xl w-full px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <span className="text-primary font-mono text-lg">$</span>
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Admin</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="outline" size="sm" className="font-mono text-xs">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Site
            </Button>
          </Link>
        </div>
      </div>
      {children}
    </div>
  );
}
