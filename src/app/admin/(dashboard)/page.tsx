"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit, Trash2, LogOut, Terminal, FileCode, FolderOpen } from "lucide-react";
import { toast } from "sonner";
import { useTerminalTheme } from "@/components/theme-provider";

interface Template {
  id: number;
  title: string;
  slug: string;
  tags: string[];
  category?: { name: string; slug: string };
  createdAt: string;
}

export default function AdminDashboard() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const { playClick, playBeep, playSuccess } = useTerminalTheme();

  const [deleteTarget, setDeleteTarget] = useState<Template | null>(null);

  const fetchTemplates = async () => {
    const res = await fetch("/api/admin/templates");
    if (res.ok) setTemplates(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const triggerDelete = (template: Template) => {
    playBeep(330, 0.25);
    setDeleteTarget(template);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    playClick();
    const id = deleteTarget.id;
    setDeleteTarget(null);
    const res = await fetch(`/api/admin/templates?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      playSuccess();
      toast.success("Template file purged successfully");
      fetchTemplates();
    } else {
      playBeep(440, 0.15);
      toast.error("Failed to delete template file");
    }
  };

  const confirmDeleteRef = useRef(confirmDelete);
  useEffect(() => {
    confirmDeleteRef.current = confirmDelete;
  });

  useEffect(() => {
    if (!deleteTarget) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        playClick();
        setDeleteTarget(null);
      }
      if (e.key === "Enter") {
        e.preventDefault();
        confirmDeleteRef.current();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [deleteTarget, playClick]);

  const logout = async () => {
    playClick();
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/";
  };

  const filtered = templates.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 font-mono">
      {/* Control panel buttons & find prompt */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-primary/10 pb-4">
        {/* Terminal find prompt */}
        <div className="relative w-full sm:max-w-sm flex items-center border border-border bg-card/50 focus-within:border-primary/50 transition-colors px-2.5 py-1">
          <span className="text-[10px] text-primary/60 shrink-0 mr-1.5 select-none font-bold">$ find . -name</span>
          <Input
            placeholder="&quot;*query*&quot;"
            className="border-none bg-transparent h-7 p-0 text-xs focus-visible:ring-0 placeholder:text-muted-foreground/20 text-foreground"
            value={search}
            onChange={(e) => {
              playClick();
              setSearch(e.target.value);
            }}
          />
          <Search className="h-3.5 w-3.5 text-muted-foreground/30 shrink-0 ml-1.5" />
        </div>

        {/* Action Triggers */}
        <div className="flex gap-3 w-full sm:w-auto justify-end">
          <Link href="/admin/templates/new">
            <Button className="font-mono text-xs h-9 px-4 rounded-none tracking-wider uppercase border border-primary bg-primary/10 text-primary hover:bg-primary/20">
              <Plus className="h-4 w-4 mr-1.5" />
              <span>[ new_template.sh ]</span>
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={logout}
            className="font-mono text-xs h-9 px-4 rounded-none tracking-wider uppercase border-border hover:border-destructive/40 hover:text-destructive"
          >
            <LogOut className="h-4 w-4 mr-1.5" />
            <span>[ logout ]</span>
          </Button>
        </div>
      </div>

      {/* Templates lists directory */}
      {loading ? (
        <div className="text-center py-16 text-muted-foreground/40 font-mono text-xs animate-pulse">
          $ read_directory --status
          <br />
          [LOAD] Loading templates files...
        </div>
      ) : filtered.length === 0 ? (
        <div className="border border-dashed border-border p-12 text-center text-muted-foreground/50 text-xs">
          $ ls -la templates/
          <br />
          {search ? "No matches found for query." : "total 0 (no files found)."}
        </div>
      ) : (
        <div className="space-y-4">
          {/* CLI Prompt header */}
          <div className="flex items-center justify-between text-xs text-muted-foreground/40">
            <div className="flex items-center gap-1.5">
              <span className="text-primary font-bold">$</span>
              <span>ls -la --sort=time templates/</span>
              <span className="inline-block h-3 w-1.5 bg-primary/40 animate-blink" />
            </div>
            <span>total {filtered.length} files</span>
          </div>

          {/* Styled ls directory file table */}
          <div className="border border-border bg-card/25 overflow-x-auto select-text scrollbar-thin">
            <table className="w-full text-[11px] text-left border-collapse min-w-[650px]">
              <thead>
                <tr className="border-b border-primary/20 bg-primary/5 text-primary/60 font-bold uppercase tracking-wider select-none text-[10px]">
                  <th className="py-2.5 px-3">Permissions</th>
                  <th className="py-2.5 px-3">Links</th>
                  <th className="py-2.5 px-3">Owner</th>
                  <th className="py-2.5 px-3 text-right">Size</th>
                  <th className="py-2.5 px-3">Modified Date</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Filename</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filtered.map((t, idx) => {
                  const size = Math.floor(124 + t.slug.length * 18);
                  const modified = new Date(t.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  const categoryName = t.category?.name || "unassigned";

                  return (
                    <tr key={t.id} className="hover:bg-primary/[0.02] transition-colors leading-relaxed">
                      <td className="py-3 px-3 text-muted-foreground/35 font-mono select-none">-rwxr-xr-x</td>
                      <td className="py-3 px-3 text-muted-foreground/30 text-right select-none">1</td>
                      <td className="py-3 px-3 text-muted-foreground/45 font-bold select-none">root</td>
                      <td className="py-3 px-3 text-right font-mono text-muted-foreground/50">{size} B</td>
                      <td className="py-3 px-3 text-muted-foreground/45">{modified}</td>
                      <td className="py-3 px-3 select-none">
                        <span className="text-info font-bold flex items-center gap-1">
                          <FolderOpen className="h-3 w-3" />
                          {categoryName}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-semibold">
                        <Link href={`/admin/templates/${t.id}/edit`} className="text-foreground hover:text-primary transition-colors flex items-center gap-1.5">
                          <FileCode className="h-3.5 w-3.5 text-primary/60 shrink-0" />
                          <span>{t.slug}.cpp</span>
                        </Link>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-2.5 select-none">
                          <Link href={`/admin/templates/${t.id}/edit`}>
                            <button className="text-[10px] text-muted-foreground/50 hover:text-primary transition-colors cursor-pointer border border-transparent hover:border-primary/20 px-1.5 py-0.5">
                              [edit]
                            </button>
                          </Link>
                          <button
                            onClick={() => triggerDelete(t)}
                            className="text-[10px] text-muted-foreground/40 hover:text-destructive transition-colors cursor-pointer border border-transparent hover:border-destructive/20 px-1.5 py-0.5"
                          >
                            [delete]
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Retro Delete warning modal overlay */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-background/85 backdrop-blur-xs flex items-center justify-center p-4 select-none">
          <div className="w-full max-w-md border border-destructive bg-card/95 shadow-[0_0_40px_rgba(239,68,68,0.25)] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-destructive/30 bg-destructive/10 text-destructive text-[10px] font-bold uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-destructive animate-ping" />
                <span>⚠️ [ CAUTION: DESTRUCTIVE ACTION ]</span>
              </div>
              <span>WARN_LEVEL_3</span>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <div className="text-[9px] text-muted-foreground/50 uppercase tracking-widest">command target</div>
                <div className="text-xs font-bold text-foreground bg-muted/20 p-2 border border-border flex items-center gap-2">
                  <span className="text-destructive font-bold">$ rm -rf</span>
                  <span>templates/{deleteTarget.slug}.cpp</span>
                </div>
              </div>

              <div className="text-xs text-muted-foreground/85 leading-relaxed font-mono">
                WARNING: You are about to permanently delete the template file <span className="text-foreground font-semibold">"{deleteTarget.title}"</span>. 
                This action is irreversible and will purge the file record from the repository index.
              </div>
            </div>

            {/* Modal Buttons */}
            <div className="border-t border-border/45 px-6 py-4 bg-muted/5 flex justify-end gap-3 text-[10px]">
              <button
                type="button"
                onClick={() => { playClick(); setDeleteTarget(null); }}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-border hover:border-primary/40 hover:text-primary transition-colors uppercase font-mono"
              >
                <span>[ ESC ]</span>
                <span>Abort Command</span>
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-destructive bg-destructive/15 hover:bg-destructive/35 text-destructive transition-colors uppercase font-mono font-bold"
              >
                <span>[ ENTER ]</span>
                <span>Force Purge File</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
