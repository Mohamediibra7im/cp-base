"use client";

import { Terminal } from "lucide-react";
import { toast } from "sonner";

interface StatsTemplate {
  id: number;
  title: string;
  slug: string;
  hidden: boolean;
  category?: { name: string };
  copyCount: number;
  likeCount: number;
}

interface StatsCategory {
  id: number;
}

interface StatsTabProps {
  templates: StatsTemplate[];
  categories: StatsCategory[];
  totalUsers: number;
  playClick: () => void;
  playSuccess: () => void;
}

export function StatsTab({ templates, categories, totalUsers, playClick, playSuccess }: StatsTabProps) {
  return (
    <div className="space-y-6 font-mono text-xs animate-in fade-in duration-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-primary/10 pb-4">
        <div className="text-xs text-muted-foreground/45 flex items-center gap-2">
          <span className="text-primary font-bold">$</span>
          <span>sys-stats --verbose</span>
          <span className="inline-block h-3 w-1.5 bg-primary/40 animate-blink" />
        </div>
        <button
          onClick={() => {
            playClick();
            const report = {
              generatedAt: new Date().toISOString(),
              summary: {
                totalUsers,
                totalTemplates: templates.length,
                totalCategories: categories.length,
                totalCopies: templates.reduce((acc, t) => acc + (t.copyCount || 0), 0),
                totalLikes: templates.reduce((acc, t) => acc + (t.likeCount || 0), 0),
              },
              templates: templates.map((t) => ({
                title: t.title,
                slug: t.slug,
                category: t.category?.name || "unassigned",
                copies: t.copyCount || 0,
                likes: t.likeCount || 0,
              })),
            };
            const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "cp_park_system_metrics.json";
            a.click();
            playSuccess();
            toast.success("Metrics report downloaded!");
          }}
          className="font-mono text-[10px] h-7 px-3 border border-primary bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer"
        >
          [ export_metrics.json ]
        </button>
      </div>

      {/* Cards Grid */}
      {(() => {
        const totalTemplates = templates.length;
        const totalCategories = categories.length;
        const totalCopies = templates.reduce((acc, t) => acc + (t.copyCount || 0), 0);
        const totalLikes = templates.reduce((acc, t) => acc + (t.likeCount || 0), 0);
        const avgCopies = totalTemplates ? (totalCopies / totalTemplates).toFixed(1) : "0.0";

        return (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 select-none">
              <div className="border border-border bg-card/15 p-4 flex flex-col justify-between shadow-[0_0_15px_rgba(34,197,94,0.03)]">
                <span className="text-[10px] text-muted-foreground/40 uppercase">Total Users</span>
                <span className="text-xl font-bold text-success mt-2">{totalUsers}</span>
              </div>
              <div className="border border-border bg-card/15 p-4 flex flex-col justify-between">
                <span className="text-[10px] text-muted-foreground/40 uppercase">Total Files</span>
                <span className="text-xl font-bold text-foreground mt-2">{totalTemplates}</span>
              </div>
              <div className="border border-border bg-card/15 p-4 flex flex-col justify-between">
                <span className="text-[10px] text-muted-foreground/40 uppercase">Total Folders</span>
                <span className="text-xl font-bold text-foreground mt-2">{totalCategories}</span>
              </div>
              <div className="border border-border bg-card/15 p-4 flex flex-col justify-between shadow-[0_0_15px_rgba(59,130,246,0.05)]">
                <span className="text-[10px] text-muted-foreground/40 uppercase">Copy Actions</span>
                <span className="text-xl font-bold text-primary mt-2">{totalCopies}</span>
              </div>
              <div className="border border-border bg-card/15 p-4 flex flex-col justify-between shadow-[0_0_15px_rgba(239,68,68,0.05)]">
                <span className="text-[10px] text-muted-foreground/40 uppercase">Likes (Total)</span>
                <span className="text-xl font-bold text-destructive mt-2">{totalLikes}</span>
              </div>
              <div className="border border-border bg-card/15 p-4 flex flex-col justify-between">
                <span className="text-[10px] text-muted-foreground/40 uppercase">Avg Copies / File</span>
                <span className="text-xl font-bold text-info mt-2">{avgCopies}</span>
              </div>
            </div>

            {/* Popular Templates Chart */}
            <div className="border border-border bg-card/15 p-5 space-y-4">
              <div className="text-[10px] text-primary/60 font-bold uppercase select-none flex items-center gap-2">
                <Terminal className="h-3.5 w-3.5" />
                <span>$ chart --sort=popularity --limit=5</span>
              </div>
              <div className="space-y-3.5">
                {(() => {
                  const sorted = [...templates]
                    .sort((a, b) => (b.copyCount || 0) - (a.copyCount || 0))
                    .slice(0, 5);

                  const maxCopies = sorted[0]?.copyCount || 1;

                  if (totalCopies === 0) {
                    return (
                      <div className="text-center py-6 text-muted-foreground/40 italic">
                        No copy logs recorded yet. Visit templates page and copy snippets to trigger metrics.
                      </div>
                    );
                  }

                  return sorted.map((t) => {
                    const copies = t.copyCount || 0;
                    const percentage = maxCopies > 0 ? Math.floor((copies / maxCopies) * 100) : 0;
                    const barWidth = Math.max(1, Math.floor(percentage / 4)); // max 25 chars
                    const bar = "█".repeat(barWidth);

                    return (
                      <div key={t.id} className="space-y-1">
                        <div className="flex justify-between font-mono text-[11px]">
                          <span className="font-semibold text-foreground">{t.slug}.cpp</span>
                          <span className="text-muted-foreground/50">{copies} copies</span>
                        </div>
                        <div className="flex items-center gap-2 font-mono text-primary select-none">
                          <span className="text-primary/75 tracking-tighter">{bar || "▏"}</span>
                          <span className="text-[9px] text-muted-foreground/30">{percentage}%</span>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

            {/* Detailed Breakdown List */}
            <div className="space-y-2 select-text">
              <div className="text-[10px] text-muted-foreground/40 font-bold uppercase select-none flex items-center gap-1.5 font-mono">
                <span className="text-primary">$</span>
                <span>cat metrics_breakdown.log</span>
              </div>
              <div className="border border-border bg-card/25 overflow-x-auto scrollbar-thin select-text">
                <table className="w-full text-[11px] text-left border-collapse min-w-[600px] font-mono">
                  <thead>
                    <tr className="border-b border-primary/20 bg-primary/5 text-primary/60 font-bold uppercase select-none text-[9px]">
                      <th className="py-2 px-3">Filename</th>
                      <th className="py-2 px-3">Folder</th>
                      <th className="py-2.5 px-3 text-right">Copies</th>
                      <th className="py-2.5 px-3 text-right">Likes</th>
                      <th className="py-2 px-3 text-right pr-6">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20">
                    {[...templates]
                      .sort((a, b) => (b.copyCount || 0) - (a.copyCount || 0))
                      .map((t) => (
                        <tr key={t.id} className="hover:bg-primary/[0.01] transition-colors leading-relaxed select-text">
                          <td className="py-2 px-3 font-semibold text-foreground">
                            {t.slug}.cpp
                          </td>
                          <td className="py-2 px-3 text-info font-bold">
                            {t.category?.name || "unassigned"}
                          </td>
                          <td className="py-2 px-3 text-right font-bold text-foreground">
                            {t.copyCount || 0}
                          </td>
                          <td className="py-2 px-3 text-right font-bold text-destructive">
                            {t.likeCount || 0}
                          </td>
                          <td className="py-2 px-3 text-right pr-6 select-none">
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.5 border rounded-none ${
                                t.hidden
                                  ? "border-destructive/40 bg-destructive/5 text-destructive"
                                  : "border-primary/40 bg-primary/5 text-primary"
                              }`}
                            >
                              {t.hidden ? "HIDDEN" : "VISIBLE"}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        );
      })()}
    </div>
  );
}
