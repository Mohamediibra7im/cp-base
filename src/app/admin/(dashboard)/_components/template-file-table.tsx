"use client";

import Link from "next/link";
import { FileCode } from "lucide-react";

export interface AdminTemplateRow {
  id: number;
  title: string;
  slug: string;
  tags: string[];
  hidden: boolean;
}

/**
 * The admin file-listing table for a folder of templates. Rendered once per
 * category and once for the "unassigned" bucket, so it lives here to avoid
 * duplicating ~90 lines of markup + row logic.
 *
 * Generic over the row type so callers can pass their full template object
 * (with extra fields) straight through to the visibility/delete callbacks.
 */
export function TemplateFileTable<T extends AdminTemplateRow>({
  list,
  selectedIds,
  onToggleSelectAll,
  onToggleSelect,
  onToggleVisibility,
  onDelete,
  onRowClickSound,
}: {
  list: T[];
  selectedIds: Record<number, boolean>;
  onToggleSelectAll: (checked: boolean) => void;
  onToggleSelect: (id: number, checked: boolean) => void;
  onToggleVisibility: (t: T) => void;
  onDelete: (t: T) => void;
  onRowClickSound: () => void;
}) {
  return (
    <table className="w-full text-[11px] text-left border-collapse min-w-[650px] font-mono">
      <thead>
        <tr className="border-b border-primary/20 text-primary/50 font-bold uppercase tracking-wider text-[9px] select-none">
          <th className="py-2 px-3 w-8">
            <input
              type="checkbox"
              checked={list.length > 0 && list.every((t) => selectedIds[t.id])}
              onChange={(e) => {
                onRowClickSound();
                onToggleSelectAll(e.target.checked);
              }}
              className="cursor-pointer accent-primary h-3 w-3 bg-background border border-border/80 rounded-none focus:ring-0"
            />
          </th>
          <th className="py-2 px-3">Permissions</th>
          <th className="py-2 px-3">Filename</th>
          <th className="py-2 px-3">Tags</th>
          <th className="py-2 px-3 select-none">Status</th>
          <th className="py-2 px-3 text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border/20">
        {list.map((t) => (
          <tr key={t.id} className="hover:bg-primary/[0.01] transition-colors leading-relaxed select-text">
            <td className="py-2 px-3 w-8 select-none">
              <input
                type="checkbox"
                checked={!!selectedIds[t.id]}
                onChange={(e) => {
                  onRowClickSound();
                  onToggleSelect(t.id, e.target.checked);
                }}
                className="cursor-pointer accent-primary h-3 w-3 bg-background border border-border/80 rounded-none focus:ring-0"
              />
            </td>
            <td className="py-2 px-3 text-muted-foreground/35 select-none">-rwxr-xr-x</td>
            <td className="py-2 px-3 font-semibold">
              <Link href={`/admin/templates/${t.id}/edit`} className="text-foreground hover:text-primary transition-colors flex items-center gap-1.5">
                <FileCode className="h-3.5 w-3.5 text-primary/60 shrink-0" />
                <span>{t.slug}.cpp</span>
              </Link>
            </td>
            <td className="py-2 px-3">
              <div className="flex flex-wrap gap-1 max-w-[250px]">
                {t.tags.map((tag) => (
                  <span key={tag} className="text-[8px] text-muted-foreground/40 border border-border/30 px-1 py-0 select-none">
                    #{tag}
                  </span>
                ))}
              </div>
            </td>
            <td className="py-2 px-3">
              <button
                onClick={() => onToggleVisibility(t)}
                className={`text-[9px] font-bold px-1.5 py-0.5 border rounded-none cursor-pointer transition-all ${
                  t.hidden
                    ? "border-destructive/40 bg-destructive/5 text-destructive/80 hover:bg-destructive/15"
                    : "border-primary/40 bg-primary/5 text-primary/80 hover:bg-primary/15"
                }`}
              >
                {t.hidden ? "[ HIDDEN ]" : "[ VISIBLE ]"}
              </button>
            </td>
            <td className="py-2 px-3 text-right">
              <div className="flex items-center justify-end gap-2.5 select-none font-mono">
                <Link
                  href={`/admin/templates/${t.id}/edit`}
                  className="text-[10px] text-muted-foreground/50 hover:text-primary transition-colors cursor-pointer border border-transparent hover:border-primary/20 px-1.5 py-0.5 inline-block font-mono"
                >
                  [edit]
                </Link>
                <button
                  onClick={() => onDelete(t)}
                  className="text-[10px] text-muted-foreground/45 hover:text-destructive transition-colors cursor-pointer border border-transparent hover:border-destructive/20 px-1.5 py-0.5"
                >
                  [delete]
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
