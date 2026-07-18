"use client";

interface SectionsState {
  show_hero_section: boolean;
  show_contests_section: boolean;
  show_categories_section: boolean;
}

interface SectionsTabProps {
  sections: SectionsState;
  loadingSettings: boolean;
  onToggle: (key: keyof SectionsState) => void;
}

export function SectionsTab({ sections, loadingSettings, onToggle }: SectionsTabProps) {
  return (
    <div className="space-y-4">
      <div className="text-xs text-muted-foreground/45 border-b border-primary/10 pb-4">
        <span className="text-primary font-bold">$</span>
        <span>homepage --configure --sections</span>
      </div>

      {loadingSettings ? (
        <div className="text-center py-16 text-muted-foreground/45 font-mono text-xs animate-pulse">
          $ get_settings --status
          <br />
          [LOAD] Loading site settings...
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground/40">
            <div className="flex items-center gap-1.5">
              <span className="text-primary font-bold">$</span>
              <span>ls -la /site-sections/</span>
              <span className="inline-block h-3 w-1.5 bg-primary/40 animate-blink" />
            </div>
          </div>

          <div className="border border-border bg-card/25 overflow-x-auto select-text scrollbar-thin">
            <table className="w-full text-[11px] text-left border-collapse min-w-[650px]">
              <thead>
                <tr className="border-b border-primary/20 bg-primary/5 text-primary/60 font-bold uppercase tracking-wider select-none text-[10px]">
                  <th className="py-2.5 px-3">Permissions</th>
                  <th className="py-2.5 px-3">Page</th>
                  <th className="py-2.5 px-3">Section ID</th>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {/* Hero Section */}
                <tr className="hover:bg-primary/[0.02] transition-colors leading-relaxed">
                  <td className="py-3 px-3 text-muted-foreground/35 font-mono select-none">-rwxr-xr-x</td>
                  <td className="py-3 px-3 text-muted-foreground/45 font-mono select-none">/ (home)</td>
                  <td className="py-3 px-3 font-semibold text-foreground">hero_section</td>
                  <td className="py-3 px-3 text-muted-foreground/60">Top title, search prompt and template counter</td>
                  <td className="py-3 px-3 select-none">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 border ${
                      sections.show_hero_section ? "border-primary bg-primary/5 text-primary" : "border-destructive bg-destructive/5 text-destructive"
                    }`}>
                      {sections.show_hero_section ? "ACTIVE" : "HIDDEN"}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right select-none">
                    <button
                      onClick={() => onToggle("show_hero_section")}
                      className="text-[10px] text-muted-foreground/50 hover:text-primary transition-colors cursor-pointer border border-transparent hover:border-primary/20 px-1.5 py-0.5"
                    >
                      [toggle_visibility]
                    </button>
                  </td>
                </tr>



                {/* Contests Section */}
                <tr className="hover:bg-primary/[0.02] transition-colors leading-relaxed">
                  <td className="py-3 px-3 text-muted-foreground/35 font-mono select-none">-rwxr-xr-x</td>
                  <td className="py-3 px-3 text-muted-foreground/45 font-mono select-none">/ (home)</td>
                  <td className="py-3 px-3 font-semibold text-foreground">contests_section</td>
                  <td className="py-3 px-3 text-muted-foreground/60">Live and upcoming competitive programming schedules widget</td>
                  <td className="py-3 px-3 select-none">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 border ${
                      sections.show_contests_section ? "border-primary bg-primary/5 text-primary" : "border-destructive bg-destructive/5 text-destructive"
                    }`}>
                      {sections.show_contests_section ? "ACTIVE" : "HIDDEN"}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right select-none">
                    <button
                      onClick={() => onToggle("show_contests_section")}
                      className="text-[10px] text-muted-foreground/50 hover:text-primary transition-colors cursor-pointer border border-transparent hover:border-primary/20 px-1.5 py-0.5"
                    >
                      [toggle_visibility]
                    </button>
                  </td>
                </tr>

                {/* Categories Section */}
                <tr className="hover:bg-primary/[0.02] transition-colors leading-relaxed">
                  <td className="py-3 px-3 text-muted-foreground/35 font-mono select-none">-rwxr-xr-x</td>
                  <td className="py-3 px-3 text-muted-foreground/45 font-mono select-none">/ (home)</td>
                  <td className="py-3 px-3 font-semibold text-foreground">categories_section</td>
                  <td className="py-3 px-3 text-muted-foreground/60">Category grid display linking to subfolders</td>
                  <td className="py-3 px-3 select-none">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 border ${
                      sections.show_categories_section ? "border-primary bg-primary/5 text-primary" : "border-destructive bg-destructive/5 text-destructive"
                    }`}>
                      {sections.show_categories_section ? "ACTIVE" : "HIDDEN"}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right select-none">
                    <button
                      onClick={() => onToggle("show_categories_section")}
                      className="text-[10px] text-muted-foreground/50 hover:text-primary transition-colors cursor-pointer border border-transparent hover:border-primary/20 px-1.5 py-0.5"
                    >
                      [toggle_visibility]
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
