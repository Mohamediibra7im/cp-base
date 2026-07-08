"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit, Trash2, LogOut, Terminal, FileCode, FolderOpen, Folder } from "lucide-react";
import { toast } from "sonner";
import { useTerminalTheme } from "@/components/theme-provider";

interface Template {
  id: number;
  title: string;
  slug: string;
  tags: string[];
  hidden: boolean;
  category?: { name: string; slug: string };
  createdAt: string;
}

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

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"templates" | "categories" | "sections">("templates");
  
  // Templates State
  const [templates, setTemplates] = useState<Template[]>([]);
  const [search, setSearch] = useState("");
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Template | null>(null);

  // Categories State
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [deleteCategoryTarget, setDeleteCategoryTarget] = useState<Category | null>(null);
  
  // Category Modal State
  const [categoryModal, setCategoryModal] = useState<{
    open: boolean;
    isEdit: boolean;
    id?: number;
    name: string;
    slug: string;
    description: string;
    icon: string;
    color: string;
    order: number;
    hidden: boolean;
  } | null>(null);

  // Homepage Sections State
  const [sections, setSections] = useState({
    show_hero_section: true,
    show_profiles_section: true,
    show_categories_section: true,
  });
  const [loadingSettings, setLoadingSettings] = useState(true);

  const { playClick, playBeep, playSuccess } = useTerminalTheme();

  // Fetch functions
  const fetchTemplates = async () => {
    const res = await fetch("/api/admin/templates");
    if (res.ok) setTemplates(await res.json());
    setLoadingTemplates(false);
  };

  const fetchCategories = async () => {
    const res = await fetch("/api/admin/categories");
    if (res.ok) setCategories(await res.json());
    setLoadingCategories(false);
  };

  const fetchSettings = async () => {
    const res = await fetch("/api/admin/settings");
    if (res.ok) {
      const data = await res.json();
      setSections({
        show_hero_section: data.show_hero_section !== "false",
        show_profiles_section: data.show_profiles_section !== "false",
        show_categories_section: data.show_categories_section !== "false",
      });
    }
    setLoadingSettings(false);
  };

  useEffect(() => {
    fetchTemplates();
    fetchCategories();
    fetchSettings();
  }, []);

  // Templates action handlers
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

  const toggleTemplateVisibility = async (tpl: Template) => {
    playClick();
    const newHidden = !tpl.hidden;
    const res = await fetch("/api/admin/templates", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...tpl,
        hidden: newHidden,
      }),
    });
    if (res.ok) {
      playSuccess();
      toast.success(`Template ${newHidden ? "hidden" : "visible"}`);
      fetchTemplates();
    } else {
      playBeep(440, 0.15);
      toast.error("Failed to update visibility");
    }
  };

  // Categories action handlers
  const confirmDeleteCategory = async () => {
    if (!deleteCategoryTarget) return;
    playClick();
    const id = deleteCategoryTarget.id;
    setDeleteCategoryTarget(null);
    const res = await fetch(`/api/admin/categories?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      playSuccess();
      toast.success("Category deleted successfully");
      fetchCategories();
      fetchTemplates(); // since cascading delete might delete templates
    } else {
      playBeep(440, 0.15);
      toast.error("Failed to delete category");
    }
  };

  const toggleCategoryVisibility = async (cat: Category) => {
    playClick();
    const newHidden = !cat.hidden;
    const res = await fetch("/api/admin/categories", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...cat,
        hidden: newHidden,
      }),
    });
    if (res.ok) {
      playSuccess();
      toast.success(`Category ${newHidden ? "hidden" : "visible"}`);
      fetchCategories();
    } else {
      playBeep(440, 0.15);
      toast.error("Failed to update visibility");
    }
  };

  const editCategory = (cat: Category) => {
    playClick();
    setCategoryModal({
      open: true,
      isEdit: true,
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
      icon: cat.icon,
      color: cat.color,
      order: cat.order,
      hidden: cat.hidden,
    });
  };

  const newCategory = () => {
    playClick();
    setCategoryModal({
      open: true,
      isEdit: false,
      name: "",
      slug: "",
      description: "",
      icon: "Code",
      color: "#3b82f6",
      order: 0,
      hidden: false,
    });
  };

  const handleSaveCategory = async () => {
    if (!categoryModal || !categoryModal.name.trim()) return;
    playClick();
    const method = categoryModal.isEdit ? "PUT" : "POST";
    const bodyPayload = {
      id: categoryModal.id,
      name: categoryModal.name.trim(),
      slug: categoryModal.slug.trim() || categoryModal.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      description: categoryModal.description.trim(),
      icon: categoryModal.icon || "Code",
      color: categoryModal.color || "#3b82f6",
      order: Number(categoryModal.order) || 0,
      hidden: categoryModal.hidden,
    };

    const res = await fetch("/api/admin/categories", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyPayload),
    });

    if (res.ok) {
      playSuccess();
      toast.success(`Category ${categoryModal.isEdit ? "updated" : "created"}`);
      setCategoryModal(null);
      fetchCategories();
    } else {
      playBeep(440, 0.15);
      toast.error("Failed to save category");
    }
  };

  // Settings action handlers
  const toggleSection = async (key: keyof typeof sections) => {
    playClick();
    const newValue = !sections[key];
    const res = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [key]: newValue }),
    });
    if (res.ok) {
      playSuccess();
      setSections((prev) => ({ ...prev, [key]: newValue }));
      toast.success("Home section visibility updated");
    } else {
      playBeep(440, 0.15);
      toast.error("Failed to update settings");
    }
  };

  const logout = async () => {
    playClick();
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/";
  };

  const filteredTemplates = templates.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 font-mono">
      {/* Tab switch navigation */}
      <div className="flex flex-wrap gap-2 border-b border-primary/20 pb-4">
        <button
          onClick={() => { playClick(); setActiveTab("templates"); }}
          className={`px-3 py-1.5 border text-[11px] font-mono font-bold uppercase tracking-wider transition-all rounded-none cursor-pointer ${
            activeTab === "templates"
              ? "border-primary bg-primary/10 text-primary shadow-[0_0_10px_var(--primary-glow-weak)]"
              : "border-border text-muted-foreground/45 hover:text-foreground"
          }`}
        >
          $ ls templates/
        </button>
        <button
          onClick={() => { playClick(); setActiveTab("categories"); }}
          className={`px-3 py-1.5 border text-[11px] font-mono font-bold uppercase tracking-wider transition-all rounded-none cursor-pointer ${
            activeTab === "categories"
              ? "border-primary bg-primary/10 text-primary shadow-[0_0_10px_var(--primary-glow-weak)]"
              : "border-border text-muted-foreground/45 hover:text-foreground"
          }`}
        >
          $ ls categories/
        </button>
        <button
          onClick={() => { playClick(); setActiveTab("sections"); }}
          className={`px-3 py-1.5 border text-[11px] font-mono font-bold uppercase tracking-wider transition-all rounded-none cursor-pointer ${
            activeTab === "sections"
              ? "border-primary bg-primary/10 text-primary shadow-[0_0_10px_var(--primary-glow-weak)]"
              : "border-border text-muted-foreground/45 hover:text-foreground"
          }`}
        >
          $ config site-sections/
        </button>
      </div>

      {/* VIEW: Templates */}
      {activeTab === "templates" && (
        <div className="space-y-4">
          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-primary/10 pb-4">
            <div className="relative w-full sm:max-w-sm flex items-center border border-border bg-card/50 focus-within:border-primary/50 transition-colors px-2.5 py-1">
              <span className="text-[10px] text-primary/60 shrink-0 mr-1.5 select-none font-bold">$ find . -name</span>
              <Input
                placeholder="&quot;*query*&quot;"
                className="border-none bg-transparent h-7 p-0 text-xs focus-visible:ring-0 placeholder:text-muted-foreground/25 text-foreground"
                value={search}
                onChange={(e) => {
                  playClick();
                  setSearch(e.target.value);
                }}
              />
              <Search className="h-3.5 w-3.5 text-muted-foreground/30 shrink-0 ml-1.5" />
            </div>

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

          {loadingTemplates ? (
            <div className="text-center py-16 text-muted-foreground/45 font-mono text-xs animate-pulse">
              $ read_directory --status
              <br />
              [LOAD] Loading templates files...
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="border border-dashed border-border p-12 text-center text-muted-foreground/50 text-xs">
              $ ls -la templates/
              <br />
              {search ? "No matches found for query." : "total 0 (no files found)."}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground/40">
                <div className="flex items-center gap-1.5">
                  <span className="text-primary font-bold">$</span>
                  <span>ls -la --sort=time templates/</span>
                  <span className="inline-block h-3 w-1.5 bg-primary/40 animate-blink" />
                </div>
                <span>total {filteredTemplates.length} files</span>
              </div>

              <div className="border border-border bg-card/25 overflow-x-auto select-text scrollbar-thin">
                <table className="w-full text-[11px] text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-primary/20 bg-primary/5 text-primary/60 font-bold uppercase tracking-wider select-none text-[10px]">
                      <th className="py-2.5 px-3">Permissions</th>
                      <th className="py-2.5 px-3 text-right">Size</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3">Filename</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {filteredTemplates.map((t) => {
                      const size = Math.floor(124 + t.slug.length * 18);
                      const categoryName = t.category?.name || "unassigned";

                      return (
                        <tr key={t.id} className="hover:bg-primary/[0.02] transition-colors leading-relaxed">
                          <td className="py-3 px-3 text-muted-foreground/35 font-mono select-none">-rwxr-xr-x</td>
                          <td className="py-3 px-3 text-right font-mono text-muted-foreground/55">{size} B</td>
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
                          <td className="py-3 px-3 select-none">
                            <button
                              onClick={() => toggleTemplateVisibility(t)}
                              className={`text-[9px] font-bold px-1.5 py-0.5 border rounded-none cursor-pointer transition-all ${
                                t.hidden
                                  ? "border-destructive/40 bg-destructive/5 text-destructive/80 hover:bg-destructive/15"
                                  : "border-primary/40 bg-primary/5 text-primary/80 hover:bg-primary/15"
                              }`}
                            >
                              {t.hidden ? "[ HIDDEN ]" : "[ VISIBLE ]"}
                            </button>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <div className="flex items-center justify-end gap-2.5 select-none">
                              <Link href={`/admin/templates/${t.id}/edit`}>
                                <button className="text-[10px] text-muted-foreground/50 hover:text-primary transition-colors cursor-pointer border border-transparent hover:border-primary/20 px-1.5 py-0.5">
                                  [edit]
                                </button>
                              </Link>
                              <button
                                onClick={() => { playBeep(330, 0.25); setDeleteTarget(t); }}
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
      )}

      {/* VIEW: Categories */}
      {activeTab === "categories" && (
        <div className="space-y-4">
          {/* Header Action Bar */}
          <div className="flex justify-between items-center border-b border-primary/10 pb-4">
            <div className="text-xs text-muted-foreground/45 flex items-center gap-2">
              <span className="text-primary font-bold">$</span>
              <span>categories --configure</span>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={newCategory}
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
                              onClick={() => toggleCategoryVisibility(c)}
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
                                onClick={() => editCategory(c)}
                                className="text-[10px] text-muted-foreground/50 hover:text-primary transition-colors cursor-pointer border border-transparent hover:border-primary/20 px-1.5 py-0.5"
                              >
                                [edit]
                              </button>
                              <button
                                onClick={() => { playBeep(330, 0.25); setDeleteCategoryTarget(c); }}
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
      )}

      {/* VIEW: Homepage Sections */}
      {activeTab === "sections" && (
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
                          onClick={() => toggleSection("show_hero_section")}
                          className="text-[10px] text-muted-foreground/50 hover:text-primary transition-colors cursor-pointer border border-transparent hover:border-primary/20 px-1.5 py-0.5"
                        >
                          [toggle_visibility]
                        </button>
                      </td>
                    </tr>

                    {/* Profiles Section */}
                    <tr className="hover:bg-primary/[0.02] transition-colors leading-relaxed">
                      <td className="py-3 px-3 text-muted-foreground/35 font-mono select-none">-rwxr-xr-x</td>
                      <td className="py-3 px-3 text-muted-foreground/45 font-mono select-none">/ (home)</td>
                      <td className="py-3 px-3 font-semibold text-foreground">profiles_section</td>
                      <td className="py-3 px-3 text-muted-foreground/60">Competitive programming profiles and ratings widget</td>
                      <td className="py-3 px-3 select-none">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 border ${
                          sections.show_profiles_section ? "border-primary bg-primary/5 text-primary" : "border-destructive bg-destructive/5 text-destructive"
                        }`}>
                          {sections.show_profiles_section ? "ACTIVE" : "HIDDEN"}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right select-none">
                        <button
                          onClick={() => toggleSection("show_profiles_section")}
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
                          onClick={() => toggleSection("show_categories_section")}
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
      )}

      {/* Retro Delete warning modal overlay (Templates) */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-background/85 backdrop-blur-xs flex items-center justify-center p-4 select-none">
          <div className="w-full max-w-md border border-destructive bg-card/95 shadow-[0_0_40px_rgba(239,68,68,0.25)] overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 border-b border-destructive/30 bg-destructive/10 text-destructive text-[10px] font-bold uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-destructive animate-ping" />
                <span>⚠️ [ CAUTION: DESTRUCTIVE ACTION ]</span>
              </div>
              <span>WARN_LEVEL_3</span>
            </div>
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
            <div className="border-t border-border/45 px-6 py-4 bg-muted/5 flex justify-end gap-3 text-[10px]">
              <button
                type="button"
                onClick={() => { playClick(); setDeleteTarget(null); }}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-border hover:border-primary/40 hover:text-primary transition-colors uppercase font-mono cursor-pointer"
              >
                <span>[ ESC ]</span>
                <span>Abort Command</span>
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-destructive bg-destructive/15 hover:bg-destructive/35 text-destructive transition-colors uppercase font-mono font-bold cursor-pointer"
              >
                <span>[ ENTER ]</span>
                <span>Force Purge File</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Retro Delete warning modal overlay (Categories) */}
      {deleteCategoryTarget && (
        <div className="fixed inset-0 z-50 bg-background/85 backdrop-blur-xs flex items-center justify-center p-4 select-none">
          <div className="w-full max-w-md border border-destructive bg-card/95 shadow-[0_0_40px_rgba(239,68,68,0.25)] overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 border-b border-destructive/30 bg-destructive/10 text-destructive text-[10px] font-bold uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-destructive animate-ping" />
                <span>⚠️ [ CAUTION: DESTRUCTIVE ACTION ]</span>
              </div>
              <span>WARN_LEVEL_3</span>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <div className="text-[9px] text-muted-foreground/50 uppercase tracking-widest">command target</div>
                <div className="text-xs font-bold text-foreground bg-muted/20 p-2 border border-border flex items-center gap-2">
                  <span className="text-destructive font-bold">$ rm -rf</span>
                  <span>categories/{deleteCategoryTarget.slug}/</span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground/85 leading-relaxed font-mono">
                WARNING: You are about to permanently delete the category folder <span className="text-foreground font-semibold">"{deleteCategoryTarget.name}"</span>. 
                This action is irreversible and will purge all templates directly linked to this category!
              </div>
            </div>
            <div className="border-t border-border/45 px-6 py-4 bg-muted/5 flex justify-end gap-3 text-[10px]">
              <button
                type="button"
                onClick={() => { playClick(); setDeleteCategoryTarget(null); }}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-border hover:border-primary/40 hover:text-primary transition-colors uppercase font-mono cursor-pointer"
              >
                <span>[ ESC ]</span>
                <span>Abort Command</span>
              </button>
              <button
                type="button"
                onClick={confirmDeleteCategory}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-destructive bg-destructive/15 hover:bg-destructive/35 text-destructive transition-colors uppercase font-mono font-bold cursor-pointer"
              >
                <span>[ ENTER ]</span>
                <span>Force Purge Folder</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Create/Edit retro modal dialog overlay */}
      {categoryModal && categoryModal.open && (
        <div className="fixed inset-0 z-50 bg-background/85 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg border border-primary bg-card/95 shadow-[0_0_40px_rgba(34,197,94,0.15)] overflow-hidden font-mono">
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-primary/30 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider select-none">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span>📂 [ {categoryModal.isEdit ? "EDIT_CATEGORY.SH" : "NEW_CATEGORY.SH"} ]</span>
              </div>
              <span>SETUP_SYS_V1</span>
            </div>

            {/* Form Content */}
            <div className="p-6 space-y-4 text-xs select-text">
              {/* Category Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-muted-foreground/50 uppercase tracking-widest font-bold block">
                  Folder Name
                </label>
                <Input
                  value={categoryModal.name}
                  onChange={(e) => {
                    const val = e.target.value;
                    const generatedSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
                    setCategoryModal((prev: any) => ({ ...prev, name: val, slug: generatedSlug }));
                  }}
                  placeholder="Graphs"
                  className="bg-background/40 border-border focus:border-primary/50 text-xs font-mono h-8 rounded-none w-full"
                />
              </div>

              {/* Slug */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-muted-foreground/50 uppercase tracking-widest font-bold block">
                  Slug
                </label>
                <Input
                  value={categoryModal.slug}
                  onChange={(e) => setCategoryModal((prev: any) => ({ ...prev, slug: e.target.value }))}
                  placeholder="graphs"
                  className="bg-background/40 border-border focus:border-primary/50 text-xs font-mono h-8 rounded-none w-full"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-[10px] text-muted-foreground/50 uppercase tracking-widest font-bold block">
                  Description
                </label>
                <Input
                  value={categoryModal.description}
                  onChange={(e) => setCategoryModal((prev: any) => ({ ...prev, description: e.target.value }))}
                  placeholder="Graph algorithms and utilities"
                  className="bg-background/40 border-border focus:border-primary/50 text-xs font-mono h-8 rounded-none w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Icon option */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-muted-foreground/50 uppercase tracking-widest font-bold block">
                    Lucide Icon Name
                  </label>
                  <Input
                    value={categoryModal.icon}
                    onChange={(e) => setCategoryModal((prev: any) => ({ ...prev, icon: e.target.value }))}
                    placeholder="GitBranch"
                    className="bg-background/40 border-border focus:border-primary/50 text-xs font-mono h-8 rounded-none w-full"
                  />
                </div>

                {/* Color option */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-muted-foreground/50 uppercase tracking-widest font-bold block">
                    Tailwind HEX Color
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={categoryModal.color}
                      onChange={(e) => setCategoryModal((prev: any) => ({ ...prev, color: e.target.value }))}
                      placeholder="#ef4444"
                      className="bg-background/40 border-border focus:border-primary/50 text-xs font-mono h-8 rounded-none flex-1"
                    />
                    <div className="relative h-8 w-8 border border-border bg-card overflow-hidden">
                      <input
                        type="color"
                        value={categoryModal.color.startsWith("#") ? categoryModal.color : "#3b82f6"}
                        onChange={(e) => setCategoryModal((prev: any) => ({ ...prev, color: e.target.value }))}
                        className="w-full h-full cursor-pointer absolute inset-0 opacity-0 z-10"
                      />
                      <div
                        className="w-full h-full pointer-events-none"
                        style={{ backgroundColor: categoryModal.color }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Sort Order */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-muted-foreground/50 uppercase tracking-widest font-bold block">
                    Order Index
                  </label>
                  <Input
                    type="number"
                    value={categoryModal.order}
                    onChange={(e) => setCategoryModal((prev: any) => ({ ...prev, order: Number(e.target.value) }))}
                    placeholder="10"
                    className="bg-background/40 border-border focus:border-primary/50 text-xs font-mono h-8 rounded-none w-full"
                  />
                </div>

                {/* Hidden Flag */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-muted-foreground/50 uppercase tracking-widest font-bold block select-none">
                    Visibility
                  </label>
                  <button
                    onClick={() => setCategoryModal((prev: any) => ({ ...prev, hidden: !prev.hidden }))}
                    className={`h-8 w-full border text-xs font-mono font-bold uppercase transition-all rounded-none cursor-pointer ${
                      categoryModal.hidden
                        ? "border-destructive bg-destructive/10 text-destructive"
                        : "border-primary bg-primary/10 text-primary"
                    }`}
                  >
                    {categoryModal.hidden ? "[ HIDDEN ]" : "[ VISIBLE ]"}
                  </button>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="border-t border-border/45 px-6 py-4 bg-muted/5 flex justify-end gap-3 text-[10px] select-none">
              <button
                type="button"
                onClick={() => { playClick(); setCategoryModal(null); }}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-border hover:border-primary/40 hover:text-primary transition-colors uppercase font-mono cursor-pointer"
              >
                <span>[ ESC ]</span>
                <span>Cancel</span>
              </button>
              <button
                type="button"
                onClick={handleSaveCategory}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-primary bg-primary/15 hover:bg-primary/35 text-primary transition-colors uppercase font-mono font-bold cursor-pointer"
              >
                <span>[ ENTER ]</span>
                <span>Save Configuration</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
