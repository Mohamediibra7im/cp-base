"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Terminal, Plus, X, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { useTerminalTheme } from "@/components/theme-provider";

interface CodeBlock {
  language: string;
  code: string;
}

const LANGUAGES = ["cpp", "python", "java", "rust", "go", "javascript", "kotlin"];

export default function ContributeNewPage() {
  const router = useRouter();
  const { playClick, playBeep, playSuccess } = useTerminalTheme();

  const [categories, setCategories] = useState<{ id: number; name: string; slug: string }[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [contributorName, setContributorName] = useState("");
  const [contributorEmail, setContributorEmail] = useState("");
  const [contributorCfHandle, setContributorCfHandle] = useState("");

  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [complexity, setComplexity] = useState("");
  const [notes, setNotes] = useState("");
  const [codes, setCodes] = useState<CodeBlock[]>([{ language: "cpp", code: "" }]);

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((r) => (r.ok ? r.json() : []))
      .then(setCategories)
      .catch(() => {});
  }, []);

  const addCodeBlock = () => {
    playClick();
    setCodes((prev) => [...prev, { language: "cpp", code: "" }]);
  };

  const removeCodeBlock = (index: number) => {
    playClick();
    setCodes((prev) => prev.filter((_, i) => i !== index));
  };

  const updateCode = (index: number, field: keyof CodeBlock, value: string) => {
    setCodes((prev) => prev.map((c, i) => (i === index ? { ...c, [field]: value } : c)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    playClick();

    if (!contributorName.trim() || !contributorEmail.trim()) {
      playBeep(440, 0.15);
      toast.error("Name and email are required");
      return;
    }
    if (!title.trim()) {
      playBeep(440, 0.15);
      toast.error("Template title is required");
      return;
    }
    if (codes.every((c) => !c.code.trim())) {
      playBeep(440, 0.15);
      toast.error("At least one code block is required");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/contributions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "new",
          contributorName: contributorName.trim(),
          contributorEmail: contributorEmail.trim(),
          contributorCfHandle: contributorCfHandle.trim() || undefined,
          title: title.trim(),
          categoryId: categoryId || undefined,
          description: description.trim(),
          tags: tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          complexity: complexity.trim() || undefined,
          notes: notes.trim() || undefined,
          codes: codes.filter((c) => c.code.trim()),
        }),
      });

      if (res.ok) {
        playSuccess();
        setSubmitted(true);
      } else {
        const data = await res.json().catch(() => ({}));
        playBeep(440, 0.15);
        toast.error(data.error || "Submission failed");
      }
    } catch {
      playBeep(440, 0.15);
      toast.error("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="relative z-10 mx-auto max-w-3xl w-full px-4 py-12 font-mono">
        <div className="border border-primary bg-card/45 backdrop-blur-md p-8 text-center">
          <div className="text-primary text-lg font-bold mb-3 glow-text-strong">Submission Received</div>
          <p className="text-xs text-muted-foreground/65 mb-6 leading-relaxed">
            Your template has been queued for review. You will receive an email notification when it is approved.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              href="/contribute"
              className="text-[10px] px-4 py-2 border border-primary bg-primary/10 text-primary hover:bg-primary/20 transition-colors uppercase font-bold tracking-wider"
            >
              [ submit another ]
            </Link>
            <Link
              href="/"
              className="text-[10px] px-4 py-2 border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors uppercase tracking-wider"
            >
              [ return home ]
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10 mx-auto max-w-3xl w-full px-4 py-12 font-mono">
      {/* Breadcrumb */}
      <div className="flex flex-wrap items-center gap-1 mb-8 text-xs select-none">
        <span className="text-primary font-bold">guest@cp-base:</span>
        <span className="text-muted-foreground/40">~</span>
        <span className="text-muted-foreground/40">/</span>
        <Link href="/" className="text-muted-foreground hover:text-primary hover:underline transition-colors underline-offset-4">home</Link>
        <span className="text-muted-foreground/40">/</span>
        <Link href="/contribute" className="text-muted-foreground hover:text-primary hover:underline transition-colors underline-offset-4">contribute</Link>
        <span className="text-muted-foreground/40">/</span>
        <span className="text-foreground font-bold">new</span>
        <span className="text-primary/60 ml-1 font-bold">$</span>
        <span className="inline-block h-3.5 w-1.5 bg-primary/70 animate-blink ml-1 align-middle" />
      </div>

      {/* Header */}
      <div className="border border-border/80 bg-card/45 backdrop-blur-md p-6 mb-8 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-primary/5 blur-2xl" />
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground/50 mb-2">
          <span className="text-primary font-bold">$</span>
          <span>./submit_new_template.sh</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-primary glow-text-strong mb-2">Submit New Template</h1>
        <p className="text-[11px] text-muted-foreground/50">Fill in the details below. All submissions are reviewed before publishing.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contributor Info */}
        <fieldset className="border border-border/80 bg-card/25 p-5 space-y-4">
          <legend className="text-[10px] text-primary/60 uppercase tracking-widest font-bold px-2">Contributor Info</legend>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] text-muted-foreground/50 uppercase tracking-widest font-bold block">Name *</label>
              <input
                type="text"
                value={contributorName}
                onChange={(e) => setContributorName(e.target.value)}
                placeholder="Your name"
                className="w-full bg-background/40 border border-border focus:border-primary/50 text-xs font-mono h-8 px-2.5 outline-none transition-colors"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] text-muted-foreground/50 uppercase tracking-widest font-bold block">Email *</label>
              <input
                type="email"
                value={contributorEmail}
                onChange={(e) => setContributorEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full bg-background/40 border border-border focus:border-primary/50 text-xs font-mono h-8 px-2.5 outline-none transition-colors"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] text-muted-foreground/50 uppercase tracking-widest font-bold block">Codeforces Handle (optional)</label>
            <input
              type="text"
              value={contributorCfHandle}
              onChange={(e) => setContributorCfHandle(e.target.value)}
              placeholder="tourist"
              className="w-full sm:w-1/2 bg-background/40 border border-border focus:border-primary/50 text-xs font-mono h-8 px-2.5 outline-none transition-colors"
            />
          </div>
        </fieldset>

        {/* Template Details */}
        <fieldset className="border border-border/80 bg-card/25 p-5 space-y-4">
          <legend className="text-[10px] text-primary/60 uppercase tracking-widest font-bold px-2">Template Details</legend>

          <div className="space-y-1.5">
            <label className="text-[10px] text-muted-foreground/50 uppercase tracking-widest font-bold block">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Segment Tree with Lazy Propagation"
              className="w-full bg-background/40 border border-border focus:border-primary/50 text-xs font-mono h-8 px-2.5 outline-none transition-colors"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] text-muted-foreground/50 uppercase tracking-widest font-bold block">Category</label>
              <div className="relative">
                <select
                  value={categoryId}
                  onChange={(e) => { playClick(); setCategoryId(e.target.value ? Number(e.target.value) : ""); }}
                  className="w-full bg-background/40 border border-border focus:border-primary/50 text-xs font-mono h-8 px-2.5 outline-none transition-colors appearance-none cursor-pointer"
                >
                  <option value="">Select category...</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground/30 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] text-muted-foreground/50 uppercase tracking-widest font-bold block">Complexity</label>
              <input
                type="text"
                value={complexity}
                onChange={(e) => setComplexity(e.target.value)}
                placeholder="O(n log n)"
                className="w-full bg-background/40 border border-border focus:border-primary/50 text-xs font-mono h-8 px-2.5 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] text-muted-foreground/50 uppercase tracking-widest font-bold block">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of what this template does..."
              rows={3}
              className="w-full bg-background/40 border border-border focus:border-primary/50 text-xs font-mono px-2.5 py-2 outline-none transition-colors resize-y"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] text-muted-foreground/50 uppercase tracking-widest font-bold block">Tags (comma-separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="segment tree, lazy propagation, range query"
              className="w-full bg-background/40 border border-border focus:border-primary/50 text-xs font-mono h-8 px-2.5 outline-none transition-colors"
            />
          </div>
        </fieldset>

        {/* Code Blocks */}
        <fieldset className="border border-border/80 bg-card/25 p-5 space-y-4">
          <legend className="text-[10px] text-primary/60 uppercase tracking-widest font-bold px-2">Code Implementations</legend>

          {codes.map((block, index) => (
            <div key={index} className="border border-border/60 bg-background/30 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1 shrink-0">
                    <span className="h-1.5 w-1.5 rounded-full bg-destructive/40" />
                    <span className="h-1.5 w-1.5 rounded-full bg-warning/40" />
                    <span className="h-1.5 w-1.5 rounded-full bg-success/40" />
                  </div>
                  <select
                    value={block.language}
                    onChange={(e) => { playClick(); updateCode(index, "language", e.target.value); }}
                    className="bg-background/40 border border-border text-xs font-mono h-7 px-2 outline-none cursor-pointer appearance-none"
                  >
                    {LANGUAGES.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
                {codes.length > 1 && (
                  <button type="button" onClick={() => removeCodeBlock(index)} className="text-muted-foreground/40 hover:text-destructive transition-colors">
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              <textarea
                value={block.code}
                onChange={(e) => updateCode(index, "code", e.target.value)}
                placeholder="Paste your code here..."
                rows={12}
                className="w-full bg-black/30 border border-border/40 text-xs font-mono px-3 py-2.5 outline-none transition-colors resize-y text-foreground/90 leading-relaxed"
                spellCheck={false}
              />
            </div>
          ))}

          <button
            type="button"
            onClick={addCodeBlock}
            className="text-[10px] px-3 py-1.5 border border-border hover:border-primary/40 text-muted-foreground hover:text-primary transition-colors uppercase font-bold tracking-wider cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="h-3 w-3" />
            add language
          </button>
        </fieldset>

        {/* Notes */}
        <fieldset className="border border-border/80 bg-card/25 p-5 space-y-3">
          <legend className="text-[10px] text-primary/60 uppercase tracking-widest font-bold px-2">Notes (optional, markdown)</legend>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Explanation, complexity analysis, usage examples... (Markdown + KaTeX supported)"
            rows={6}
            className="w-full bg-background/40 border border-border focus:border-primary/50 text-xs font-mono px-2.5 py-2 outline-none transition-colors resize-y"
          />
        </fieldset>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <Link
            href="/contribute"
            className="text-[10px] px-4 py-2 border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors uppercase tracking-wider"
          >
            [ cancel ]
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="text-[10px] px-5 py-2 border border-primary bg-primary/10 text-primary hover:bg-primary/20 transition-colors uppercase font-bold tracking-wider cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            <Terminal className="h-3 w-3" />
            {submitting ? "submitting..." : "[ submit template ]"}
          </button>
        </div>
      </form>
    </div>
  );
}
