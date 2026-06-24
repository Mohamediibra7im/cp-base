"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Plus, Trash2, Wand2 } from "lucide-react";
import Link from "next/link";
import { MarkdownEditor } from "@/components/markdown-editor";
import { CategoryCreator } from "@/components/category-creator";
import { useTerminalTheme } from "@/components/theme-provider";
import { formatCode } from "@/lib/format-code";

const LANGUAGES = [
  { value: "cpp", label: "C++" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "rust", label: "Rust" },
  { value: "go", label: "Go" },
  { value: "javascript", label: "JavaScript" },
];

interface CodeEntry {
  language: string;
  code: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

const HELP_TEXTS: Record<string, { title: string; description: string }> = {
  title: {
    title: "Template Title",
    description: "Enter the formal name of the algorithm, template, or data structure. This is used for sorting and displaying in search queries."
  },
  slug: {
    title: "URL Slug",
    description: "A URL-friendly string identifier. Auto-generated from title, but can be manually changed. Use lowercase letters, numbers, and dashes."
  },
  description: {
    title: "Short Description",
    description: "Provide a brief, single-sentence summary of this code template. Used for previews in directories."
  },
  categoryId: {
    title: "Category Folder",
    description: "Choose the target group folder. Organization dictates search indexing and landing page layouts."
  },
  complexity: {
    title: "Complexity Metric",
    description: "Define the worst-case time complexity (e.g. O(V + E) or O(N log N)). Displayed in performance badges."
  },
  tags: {
    title: "Search Keywords",
    description: "Provide comma-separated keywords/tags. Used to boost query relevancy scores (e.g. 'graphs, sorting, templates')."
  },
  notes: {
    title: "Markdown Documentation",
    description: "Write details, explanations, sample uses, inputs/outputs, or notes in GitHub Flavored Markdown. Supports math equations with $$."
  },
  code: {
    title: "Source Code Blocks",
    description: "Enter source code implementation. You can create multiple language tabs for the same template by clicking 'Add Language'."
  },
  default: {
    title: "BIOS Setup Helper",
    description: "Use TAB or Mouse to navigate options. Select a field to view help documentation. Press [F10] to write files and save configurations."
  }
};

export default function EditTemplate({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [templateId, setTemplateId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"main" | "notes" | "code">("main");
  const [focusedField, setFocusedField] = useState<string>("default");

  const { playClick, playBeep, playSuccess } = useTerminalTheme();

  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    categoryId: "",
    complexity: "",
    notes: "",
    tags: "",
  });
  const [codes, setCodes] = useState<CodeEntry[]>([]);
  const [formattingIdx, setFormattingIdx] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const { id } = await params;
      if (cancelled) return;
      setTemplateId(Number(id));
      const [cats, tpl] = await Promise.all([
        fetch("/api/admin/categories").then((r) => r.json()),
        fetch("/api/admin/templates").then((r) => r.json()),
      ]);
      if (cancelled) return;
      setCategories(cats);
      interface TemplateResult { id: number; title: string; slug: string; description: string; categoryId: number; complexity: string; notes: string | null; tags: string[]; codes?: { language: string; code: string }[]; }
      const template = tpl.find((t: TemplateResult) => t.id === Number(id));
      if (template) {
        setForm({
          title: template.title,
          slug: template.slug,
          description: template.description,
          categoryId: String(template.categoryId),
          complexity: template.complexity,
          notes: template.notes || "",
          tags: (template.tags || []).join(", "),
        });
        setCodes(template.codes?.map((c: { language: string; code: string }) => ({ language: c.language, code: c.code })) || []);
      }
      setLoading(false);
    };
    load();
    return () => { cancelled = true; };
  }, [params]);

  const updateCode = (index: number, field: keyof CodeEntry, value: string) => {
    setCodes((prev) => prev.map((c, i) => (i === index ? { ...c, [field]: value } : c)));
  };

  const addCode = () => {
    playClick();
    setCodes((prev) => [...prev, { language: "cpp", code: "" }]);
  };

  const removeCode = (index: number) => {
    playClick();
    setCodes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFormat = async (index: number, code: string, language: string) => {
    playClick();
    setFormattingIdx(index);
    const formatted = await formatCode(code, language);
    setFormattingIdx(null);
    updateCode(index, "code", formatted);
  };

  const save = async () => {
    if (!form.title || !form.categoryId || !templateId) {
      playBeep(440, 0.15);
      toast.error("Title and category are required");
      return;
    }
    playClick();
    setSaving(true);
    const res = await fetch("/api/admin/templates", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: templateId,
        ...form,
        categoryId: Number(form.categoryId),
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        codes: codes.filter((c) => c.code.trim()),
      }),
    });
    setSaving(false);

    if (res.ok) {
      playSuccess();
      toast.success("Template updated");
      router.push("/admin");
      router.refresh();
    } else {
      playBeep(440, 0.15);
      toast.error("Failed to update template");
    }
  };

  // Setup Keyboard shortcuts
  const saveRef = useRef(save);
  const addCodeRef = useRef(addCode);

  useEffect(() => {
    saveRef.current = save;
    addCodeRef.current = addCode;
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F10") {
        e.preventDefault();
        saveRef.current();
      }
      if (e.key === "F1" && activeTab === "code") {
        e.preventDefault();
        addCodeRef.current();
      }
      if (e.key === "Escape") {
        const activeTag = document.activeElement?.tagName.toLowerCase();
        if (activeTag !== "input" && activeTag !== "textarea") {
          playClick();
          router.push("/admin");
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeTab, router, playClick]);

  if (loading) {
    return (
      <div className="text-center py-16 text-muted-foreground/45 font-mono text-xs animate-pulse">
        $ read_settings --id={templateId || "..."}
        <br />
        [LOAD] Loading current template configurations...
      </div>
    );
  }

  const help = HELP_TEXTS[focusedField] || HELP_TEXTS.default;

  return (
    <div className="space-y-6 font-mono">
      {/* BIOS Screen Top Header info */}
      <div className="flex justify-between items-center text-xs text-muted-foreground/45 border-b border-primary/25 pb-2">
        <div className="flex items-center gap-1">
          <span>UTILITY: MODIFY_TEMPLATE.EXE</span>
        </div>
        <div>ROM VERSION 6.22-A</div>
      </div>

      {/* Main BIOS border frame wrapper */}
      <div className="border border-primary/20 bg-card/40 shadow-sm overflow-hidden">
        {/* Tabs Bar */}
        <div className="flex border-b border-primary/20 bg-primary/5 select-none text-[11px]">
          <button
            type="button"
            onClick={() => { playClick(); setActiveTab("main"); setFocusedField("default"); }}
            className={`px-4 py-2.5 border-r border-primary/20 uppercase tracking-widest font-bold ${
              activeTab === "main" ? "bg-background text-primary border-b-2 border-b-primary" : "text-muted-foreground/60 hover:text-primary hover:bg-primary/5"
            }`}
          >
            [ Main Settings ]
          </button>
          <button
            type="button"
            onClick={() => { playClick(); setActiveTab("notes"); setFocusedField("notes"); }}
            className={`px-4 py-2.5 border-r border-primary/20 uppercase tracking-widest font-bold ${
              activeTab === "notes" ? "bg-background text-primary border-b-2 border-b-primary" : "text-muted-foreground/60 hover:text-primary hover:bg-primary/5"
            }`}
          >
            [ Notes / Docs ]
          </button>
          <button
            type="button"
            onClick={() => { playClick(); setActiveTab("code"); setFocusedField("code"); }}
            className={`px-4 py-2.5 border-r border-primary/20 uppercase tracking-widest font-bold ${
              activeTab === "code" ? "bg-background text-primary border-b-2 border-b-primary" : "text-muted-foreground/60 hover:text-primary hover:bg-primary/5"
            }`}
          >
            [ Source Code ]
          </button>
        </div>

        {/* Dynamic Dual-Pane Settings Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
          {/* Left Fields Pane */}
          <div className="lg:col-span-8 space-y-4">
            {activeTab === "main" && (
              <div className="space-y-1 divide-y divide-border/20">
                {/* Title */}
                <div
                  className={`py-3 px-2 border border-transparent transition-all ${
                    focusedField === "title" ? "bg-primary/[0.03] border-primary/10" : ""
                  }`}
                  onClick={() => { playClick(); setFocusedField("title"); }}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <Label htmlFor="title" className="text-xs font-bold tracking-wider text-foreground flex items-center gap-1.5 cursor-pointer select-none">
                      <span className={focusedField === "title" ? "text-primary animate-pulse" : "text-transparent"}>▶</span>
                      <span>Template Title</span>
                    </Label>
                    <Input
                      id="title"
                      value={form.title}
                      onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                      placeholder="Segment Tree"
                      className="bg-background/40 border-border focus:border-primary/50 text-xs font-mono h-8 rounded-none md:max-w-md w-full"
                      onFocus={() => { playClick(); setFocusedField("title"); }}
                    />
                  </div>
                </div>

                {/* Slug */}
                <div
                  className={`py-3 px-2 border border-transparent transition-all ${
                    focusedField === "slug" ? "bg-primary/[0.03] border-primary/10" : ""
                  }`}
                  onClick={() => { playClick(); setFocusedField("slug"); }}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <Label htmlFor="slug" className="text-xs font-bold tracking-wider text-foreground flex items-center gap-1.5 cursor-pointer select-none">
                      <span className={focusedField === "slug" ? "text-primary animate-pulse" : "text-transparent"}>▶</span>
                      <span>URL Slug</span>
                    </Label>
                    <Input
                      id="slug"
                      value={form.slug}
                      onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                      placeholder="segment-tree"
                      className="bg-background/40 border-border focus:border-primary/50 text-xs font-mono h-8 rounded-none md:max-w-md w-full"
                      onFocus={() => { playClick(); setFocusedField("slug"); }}
                    />
                  </div>
                </div>

                {/* Description */}
                <div
                  className={`py-3 px-2 border border-transparent transition-all ${
                    focusedField === "description" ? "bg-primary/[0.03] border-primary/10" : ""
                  }`}
                  onClick={() => { playClick(); setFocusedField("description"); }}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <Label htmlFor="desc" className="text-xs font-bold tracking-wider text-foreground flex items-center gap-1.5 cursor-pointer select-none pt-1">
                      <span className={focusedField === "description" ? "text-primary animate-pulse" : "text-transparent"}>▶</span>
                      <span>Short Description</span>
                    </Label>
                    <Textarea
                      id="desc"
                      value={form.description}
                      onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                      placeholder="Point update, range query segment tree implementation"
                      className="bg-background/40 border-border focus:border-primary/50 text-xs font-mono min-h-[60px] rounded-none md:max-w-md w-full resize-none"
                      onFocus={() => { playClick(); setFocusedField("description"); }}
                    />
                  </div>
                </div>

                {/* Category ID */}
                <div
                  className={`py-3 px-2 border border-transparent transition-all ${
                    focusedField === "categoryId" ? "bg-primary/[0.03] border-primary/10" : ""
                  }`}
                  onClick={() => { playClick(); setFocusedField("categoryId"); }}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <Label className="text-xs font-bold tracking-wider text-foreground flex items-center gap-1.5 cursor-pointer select-none pt-1">
                      <span className={focusedField === "categoryId" ? "text-primary animate-pulse" : "text-transparent"}>▶</span>
                      <span>Category Folder</span>
                    </Label>
                    <div className="flex flex-col md:max-w-md w-full gap-2">
                      <Select value={form.categoryId} onValueChange={(v) => { playClick(); v && setForm((f) => ({ ...f, categoryId: v })); }}>
                        <SelectTrigger className="bg-background/40 border-border focus:border-primary/50 text-xs font-mono h-8 rounded-none">
                          <SelectValue placeholder="Select Category..." />
                        </SelectTrigger>
                        <SelectContent className="font-mono text-xs">
                          {categories.map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <CategoryCreator onCreated={(cat) => {
                        playSuccess();
                        setCategories((prev) => [...prev, cat]);
                        setForm((f) => ({ ...f, categoryId: String(cat.id) }));
                      }} />
                    </div>
                  </div>
                </div>

                {/* Complexity */}
                <div
                  className={`py-3 px-2 border border-transparent transition-all ${
                    focusedField === "complexity" ? "bg-primary/[0.03] border-primary/10" : ""
                  }`}
                  onClick={() => { playClick(); setFocusedField("complexity"); }}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <Label htmlFor="comp" className="text-xs font-bold tracking-wider text-foreground flex items-center gap-1.5 cursor-pointer select-none">
                      <span className={focusedField === "complexity" ? "text-primary animate-pulse" : "text-transparent"}>▶</span>
                      <span>Complexity Badge</span>
                    </Label>
                    <Input
                      id="comp"
                      value={form.complexity}
                      onChange={(e) => setForm((f) => ({ ...f, complexity: e.target.value }))}
                      placeholder="O(log n)"
                      className="bg-background/40 border-border focus:border-primary/50 text-xs font-mono h-8 rounded-none md:max-w-md w-full"
                      onFocus={() => { playClick(); setFocusedField("complexity"); }}
                    />
                  </div>
                </div>

                {/* Tags */}
                <div
                  className={`py-3 px-2 border border-transparent transition-all ${
                    focusedField === "tags" ? "bg-primary/[0.03] border-primary/10" : ""
                  }`}
                  onClick={() => { playClick(); setFocusedField("tags"); }}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <Label htmlFor="tags" className="text-xs font-bold tracking-wider text-foreground flex items-center gap-1.5 cursor-pointer select-none">
                      <span className={focusedField === "tags" ? "text-primary animate-pulse" : "text-transparent"}>▶</span>
                      <span>Search Keywords</span>
                    </Label>
                    <Input
                      id="tags"
                      value={form.tags}
                      onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                      placeholder="segment-tree, range-query"
                      className="bg-background/40 border-border focus:border-primary/50 text-xs font-mono h-8 rounded-none md:max-w-md w-full"
                      onFocus={() => { playClick(); setFocusedField("tags"); }}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notes" && (
              <div
                className="space-y-4"
                onClick={() => setFocusedField("notes")}
              >
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold tracking-wider text-foreground flex items-center gap-1.5">
                    <span className="text-primary animate-pulse">▶</span>
                    <span>Documentation Notes File (Markdown supported)</span>
                  </Label>
                </div>
                <div className="border border-border bg-background/25">
                  <MarkdownEditor
                    value={form.notes}
                    onChange={(v) => setForm((f) => ({ ...f, notes: v }))}
                    placeholder="Optional notes, algorithm explanation, tips..."
                    minHeight="220px"
                  />
                </div>
              </div>
            )}

            {activeTab === "code" && (
              <div
                className="space-y-4"
                onClick={() => setFocusedField("code")}
              >
                <div className="flex items-center justify-between border-b border-primary/10 pb-2">
                  <Label className="text-xs font-bold tracking-wider text-foreground flex items-center gap-1.5">
                    <span className="text-primary animate-pulse">▶</span>
                    <span>Language Code Source Files</span>
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addCode}
                    className="font-mono text-[10px] h-7 border-primary/30 hover:border-primary hover:text-primary rounded-none bg-primary/5"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    <span>Add Language</span>
                  </Button>
                </div>

                <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
                  {codes.map((entry, i) => (
                    <div key={i} className="p-4 border border-primary/15 bg-primary/[0.01] space-y-3 rounded-none relative">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-muted-foreground/50 select-none">FILE_{i+1}:</span>
                          <Select value={entry.language} onValueChange={(v) => { playClick(); v && updateCode(i, "language", v); }}>
                            <SelectTrigger className="w-32 bg-background/50 border-border text-xs font-mono h-7 rounded-none">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="font-mono text-xs">
                              {LANGUAGES.map((l) => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={formattingIdx === i}
                            onClick={() => handleFormat(i, entry.code, entry.language)}
                            className="text-[10px] text-muted-foreground/35 hover:text-primary transition-colors border border-transparent hover:border-primary/20 px-1.5 py-0.5 disabled:opacity-30"
                          >
                            <Wand2 className={`h-3 w-3 inline mr-1 ${formattingIdx === i ? "animate-spin" : ""}`} />[Format]
                          </button>
                          {codes.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeCode(i)}
                              className="text-[10px] text-muted-foreground/35 hover:text-destructive transition-colors border border-transparent hover:border-destructive/20 px-1.5 py-0.5"
                            >
                              <Trash2 className="h-3 w-3 inline mr-1" />[Delete]
                            </button>
                          )}
                        </div>
                      </div>
                      <Textarea
                        value={entry.code}
                        onChange={(e) => updateCode(i, "code", e.target.value)}
                        placeholder={`// Paste your ${LANGUAGES.find(l => l.value === entry.language)?.label || entry.language} code here...`}
                        className="font-mono text-xs bg-background/30 border-border focus:border-primary/50 min-h-[150px] rounded-none resize-y"
                        onFocus={() => { playClick(); setFocusedField("code"); }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Help Pane (Visible only on large screens) */}
          <div className="lg:col-span-4 hidden lg:block">
            <div className="flex flex-col h-full justify-between min-h-[350px] border border-primary/15 p-4 bg-primary/[0.01]">
              <div>
                <div className="text-[9px] text-primary/40 uppercase tracking-widest font-mono mb-2 select-none">Item Specific Help</div>
                <h3 className="text-[11px] font-bold text-primary uppercase tracking-wider mb-2 font-mono select-none">
                  {help.title}
                </h3>
                <p className="text-[11px] text-muted-foreground/80 leading-relaxed font-mono">
                  {help.description}
                </p>
              </div>
              
              <div className="border-t border-primary/10 pt-4 mt-4 font-mono text-[9px] text-muted-foreground/40 space-y-1 uppercase select-none">
                <div className="flex justify-between"><span>TAB/CLICK</span> <span>SELECT FIELD</span></div>
                <div className="flex justify-between"><span>F10</span> <span>SAVE SETTINGS</span></div>
                <div className="flex justify-between"><span>ESC</span> <span>EXIT UTILITY</span></div>
                {activeTab === "code" && (
                  <div className="flex justify-between text-primary/70"><span>F1</span> <span>ADD CODE FILE</span></div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Button Controls Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-mono select-none border-t border-primary/15 pt-4 mt-6">
        <button
          type="button"
          onClick={() => { playClick(); router.push("/admin"); }}
          className="flex items-center gap-2 px-3 py-2 border border-primary/20 hover:border-primary/50 hover:bg-primary/5 text-left text-muted-foreground hover:text-primary transition-all rounded-none"
        >
          <span className="text-primary font-bold">[ESC]</span>
          <span>Exit Setup</span>
        </button>

        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 px-3 py-2 border border-primary bg-primary/10 hover:bg-primary/20 text-left text-primary transition-all font-semibold rounded-none"
        >
          <span className="text-primary font-bold">[F10]</span>
          <span>{saving ? "Writing..." : "Save Template"}</span>
        </button>

        {activeTab === "code" && (
          <button
            type="button"
            onClick={addCode}
            className="flex items-center gap-2 px-3 py-2 border border-primary/20 hover:border-primary/50 hover:bg-primary/5 text-left text-muted-foreground hover:text-primary transition-all rounded-none"
          >
            <span className="text-primary font-bold">[F1]</span>
            <span>Add Language</span>
          </button>
        )}
      </div>
    </div>
  );
}
