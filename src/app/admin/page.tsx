"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, LogOut } from "lucide-react";
import { toast } from "sonner";

interface Template {
  id: number;
  title: string;
  slug: string;
  tags: string[];
  category?: { name: string };
  createdAt: string;
}

export default function AdminDashboard() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchTemplates = async () => {
    const res = await fetch("/api/admin/templates");
    if (res.ok) setTemplates(await res.json());
    setLoading(false);
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchTemplates(); }, []);

  const deleteTemplate = async (id: number) => {
    if (!confirm("Delete this template?")) return;
    const res = await fetch(`/api/admin/templates?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Template deleted");
      fetchTemplates();
    } else {
      toast.error("Failed to delete");
    }
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  const filtered = templates.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search templates..." className="pl-8" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          <Link href="/admin/templates/new">
            <Button className="font-mono"><Plus className="h-4 w-4 mr-1" />New Template</Button>
          </Link>
          <Button variant="outline" onClick={logout} className="font-mono"><LogOut className="h-4 w-4 mr-1" />Logout</Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground font-mono text-sm">Loading...</div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground font-mono text-sm">
            {search ? "No templates match your search." : "No templates yet. Create your first one!"}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-primary font-mono text-sm">$</span>
            <span className="text-muted-foreground font-mono text-xs">ls -la templates/ ({filtered.length})</span>
          </div>
          {filtered.map((t) => (
            <Card key={t.id} className="hover:border-primary/30 transition-colors">
              <CardContent className="flex items-center justify-between py-3 px-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium truncate">{t.title}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5 font-mono">
                    {t.category?.name && <span>{t.category.name}</span>}
                    <span>{new Date(t.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0 ml-3">
                  <Link href={`/admin/templates/${t.id}/edit`}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary"><Edit className="h-4 w-4" /></Button>
                  </Link>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => deleteTemplate(t.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
