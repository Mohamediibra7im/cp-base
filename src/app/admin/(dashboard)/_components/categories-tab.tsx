"use client";

import { Button } from "@/components/ui/button";
import { Plus, Folder } from "lucide-react";

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  icon: string;
  color: string;
  order: number;
  hidden: boolean;
}

interface CategoriesTabProps {
  categories: Category[];
  loadingCategories: boolean;
  onNew: () => void;
  onEdit: (cat: Category) => void;
  onToggleVisibility: (cat: Category) => void;
  onDelete: (cat: Category) => void;
}

export function CategoriesTab({
  categories,
  loadingCategories,
  onNew,
  onEdit,
  onToggleVisibility,
  onDelete,
}: CategoriesTabProps) {
  return (
    <div className="space-y-4">
      {/* Header Action Bar */}
      <div className="flex justify-between items-center border-b border-primary/10 pb-4">
        <div className="text-xs text-muted-foreground/45 flex items-center gap-2">
          <span className="text-primary font-bold">$</span>
          <span>categories --configure</span>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={onNew}
            className="font-mono text-xs h-9 px-4 rounded-none tracking-wider uppercase border border-primary bg-primary/10 text-primary hover:bg-primary/20"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            <span>[ new_category.sh ]</span>
          </Button>
        </div>
      </div>

      {loadingCategories ? (
        <div className="text-center py-16 text-muted-foreground/45 font-mono text-xs animate-pulse">
          $ read_categories --status
          <br />
          [LOAD] Loading category directories...
        </div>
      ) : categories.length === 0 ? (
        <div className="border border-dashed border-border p-12 text-center text-muted-foreground/50 text-xs">
          total 0 (no categories found).
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground/40">
            <div className="flex items-center gap-1.5">
              <span className="text-primary font-bold">$</span>
              <span>ls -la categories/</span>
              <span className="inline-block h-3 w-1.5 bg-primary/40 animate-blink" />
            </div>
            <span>total {categories.length} folders</span>
          </div>

          <div className="border border-border bg-card/25 overflow-x-auto select-text scrollbar-thin">
            <table className="w-full text-[11px] text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-primary/20 bg-primary/5 text-primary/60 font-bold uppercase tracking-wider select-none text-[10px]">
                  <th className="py-2.5 px-3">Permissions</th>
                  <th className="py-2.5 px-3 text-right">Order</th>
                  <th className="py-2.5 px-3">Color</th>
                  <th className="py-2.5 px-3">Icon</th>
                  <th className="py-2.5 px-3">Slug</th>
                  <th className="py-2.5 px-3">Folder Name</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {categories.map((c) => {
                  return (
                    <tr key={c.id} className="hover:bg-primary/[0.02] transition-colors leading-relaxed">
                      <td className="py-3 px-3 text-muted-foreground/35 font-mono select-none">drwxr-xr-x</td>
                      <td className="py-3 px-3 text-right font-mono text-muted-foreground/55">{c.order}</td>
                      <td className="py-3 px-3 select-none">
                        <span className="flex items-center gap-1">
                          <span className="h-2 w-2 border border-border" style={{ backgroundColor: c.color }} />
                          <span className="text-[10px] text-muted-foreground/45">{c.color}</span>
                        </span>
                      </td>
                      <td className="py-3 px-3 text-muted-foreground/75 font-mono">{c.icon}</td>
                      <td className="py-3 px-3 text-muted-foreground/50">{c.slug}/</td>
                      <td className="py-3 px-3 font-semibold text-foreground">
                        <span className="flex items-center gap-1.5">
                          <Folder className="h-3.5 w-3.5 text-info shrink-0" />
                          {c.name}
                        </span>
                      </td>
                      <td className="py-3 px-3 select-none">
                        <button
                          onClick={() => onToggleVisibility(c)}
                          className={`text-[9px] font-bold px-1.5 py-0.5 border rounded-none cursor-pointer transition-all ${
                            c.hidden
                              ? "border-destructive/40 bg-destructive/5 text-destructive/80 hover:bg-destructive/15"
                              : "border-primary/40 bg-primary/5 text-primary/80 hover:bg-primary/15"
                          }`}
                        >
                          {c.hidden ? "[ HIDDEN ]" : "[ VISIBLE ]"}
                        </button>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-2.5 select-none">
                          <button
                            onClick={() => onEdit(c)}
                            className="text-[10px] text-muted-foreground/50 hover:text-primary transition-colors cursor-pointer border border-transparent hover:border-primary/20 px-1.5 py-0.5"
                          >
                            [edit]
                          </button>
                          <button
                            onClick={() => onDelete(c)}
                            className="text-[10px] text-muted-foreground/45 hover:text-destructive transition-colors cursor-pointer border border-transparent hover:border-destructive/20 px-1.5 py-0.5"
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
    </div>
  );
}
