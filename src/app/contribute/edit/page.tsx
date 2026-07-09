"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Terminal, X, ChevronDown, Search } from "lucide-react";
import { toast } from "sonner";
import { useTerminalTheme } from "@/components/theme-provider";

interface TemplateOption {
  id: number;
  title: string;
  slug: string;
  codes?: { language: string; code: string }[];
}

interface CodeBlock {
  language: string;
  code: string;
}

const LANGUAGES = ["cpp", "python", "java", "rust", "go", "javascript", "kotlin"];

export default function ContributeEditPage() {
  const { playClick, playBeep, playSuccess } = useTerminalTheme();

  const [templates, setTemplates] = useState<TemplateOption[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateOption | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [contributorName, setContributorName] = useState("");
  const [contributorEmail, setContributorEmail] = useState("");
  const [contributorCfHandle, setContributorCfHandle] = useState("");

  const [editReason, setEditReason] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editCodes, setEditCodes] = useState<CodeBlock[]>([]);

  useEffect(() => {
    fetch("/api/admin/templates?includeCodes=true")
      .then((r) => (r.ok ? r.json() : []))
      .then(setTemplates)
      .catch(() => {});
  }, []);

  const filteredTemplates = searchQuery.trim()
    ? templates.filter(
        (t) =>
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.slug.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : templates;

  const selectTemplate = (t: TemplateOption) => {
    playClick();
    setSelectedTemplate(t);
    setSearchQuery("");
    if (t.codes && t.codes.length > 0) {
      setEditCodes(t.codes.map((c) => ({ language: c.language, code: c.code })));
    } else {
      setEditCodes([{ language: "cpp", code: "" }]);
    }
  };

  const updateCode = (index: number, field: keyof CodeBlock, value: string) => {
    setEditCodes((prev) => prev.map((c, i) => (i === index ? { ...c, [field]: value } : c)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    playClick();

    if (!contributorName.trim() || !contributorEmail.trim()) {
      playBeep(440, 0.15);
      toast.error("Name and email are required");
      return;
    }
    if (!selectedTemplate) {
      playBeep(440, 0.15);
      toast.error("Select a template to edit");
      return;
    }
    if (!editReason.trim()) {
      playBeep(440, 0.15);
      toast.error("Edit reason is required");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/contributions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "edit",
          contributorName: contributorName.trim(),
          contributorEmail: contributorEmail.trim(),
          contributorCfHandle: contributorCfHandle.trim() || undefined,
          templateId: selectedTemplate.id,
          editReason: editReason.trim(),
          editCodes: editCodes.some((c) => c.code.trim()) ? editCodes.filter((c) => c.code.trim()) : undefined,
          editNotes: editNotes.trim() || undefined,
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
          <div className="text-primary text-lg font-bold mb-3 glow-text-strong">Edit Request Received</div>
          <p className="text-xs text-muted-foreground/65 mb-6 leading-relaxed">
            Your edit request has been queued for review. You will receive an email notification when it is processed.
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
        <span className="text-foreground font-bold">edit</span>
        <span className="text-primary/60 ml-1 font-bold">$</span>
        <span className="inline-block h-3.5 w-1.5 bg-primary/70 animate-blink ml-1 align-middle" />
      </div>

      {/* Header */}
      <div className="border border-border/80 bg-card/45 backdrop-blur-md p-6 mb-8 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-info/5 blur-2xl" />
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground/50 mb-2">
          <span className="text-primary font-bold">$</span>
          <span>./request_edit.sh</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-primary glow-text-strong mb-2">Request Template Edit</h1>
        <p className="text-[11px] text-muted-foreground/50">Suggest improvements or fixes to an existing template.</p>
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

        {/* Template Selection */}
        <fieldset className="border border-border/80 bg-card/25 p-5 space-y-4">
          <legend className="text-[10px] text-primary/60 uppercase tracking-widest font-bold px-2">Select Template</legend>

          {selectedTemplate ? (
            <div className="flex items-center justify-between border border-primary/30 bg-primary/5 p-3">
              <div>
                <div className="text-xs font-bold text-primary">{selectedTemplate.title}</div>
                <div className="text-[10px] text-muted-foreground/50">{selectedTemplate.slug}</div>
              </div>
              <button
                type="button"
                onClick={() => { playClick(); setSelectedTemplate(null); setEditCodes([]); }}
                className="text-muted-foreground/40 hover:text-destructive transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground/30" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search templates..."
                  className="w-full bg-background/40 border border-border focus:border-primary/50 text-xs font-mono h-8 pl-8 pr-2.5 outline-none transition-colors"
                />
              </div>
              <div className="max-h-48 overflow-y-auto border border-border/50 bg-background/30 scrollbar-thin">
                {filteredTemplates.length === 0 ? (
                  <div className="p-3 text-[10px] text-muted-foreground/40 text-center">No templates found</div>
                ) : (
                  filteredTemplates.slice(0, 20).map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => selectTemplate(t)}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-primary/5 transition-colors border-b border-border/20 last:border-0 cursor-pointer"
                    >
                      <span className="font-bold text-foreground">{t.title}</span>
                      <span className="text-muted-foreground/40 ml-2 text-[10px]">{t.slug}</span>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </fieldset>

        {/* Edit Details */}
        <fieldset className="border border-border/80 bg-card/25 p-5 space-y-4">
          <legend className="text-[10px] text-primary/60 uppercase tracking-widest font-bold px-2">Edit Details</legend>

          <div className="space-y-1.5">
            <label className="text-[10px] text-muted-foreground/50 uppercase tracking-widest font-bold block">Reason for Edit *</label>
            <textarea
              value={editReason}
              onChange={(e) => setEditReason(e.target.value)}
              placeholder="Describe what should be changed and why..."
              rows={3}
              className="w-full bg-background/40 border border-border focus:border-primary/50 text-xs font-mono px-2.5 py-2 outline-none transition-colors resize-y"
              required
            />
          </div>

          {editCodes.length > 0 && (
            <div className="space-y-3">
              <label className="text-[10px] text-muted-foreground/50 uppercase tracking-widest font-bold block">Modified Code (edit below)</label>
              {editCodes.map((block, index) => (
                <div key={index} className="border border-border/60 bg-background/30 p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1 shrink-0">
                      <span className="h-1.5 w-1.5 rounded-full bg-destructive/40" />
                      <span className="h-1.5 w-1.5 rounded-full bg-warning/40" />
                      <span className="h-1.5 w-1.5 rounded-full bg-success/40" />
                    </div>
                    <span className="text-[10px] text-muted-foreground/40">{block.language}</span>
                  </div>
                  <textarea
                    value={block.code}
                    onChange={(e) => updateCode(index, "code", e.target.value)}
                    rows={12}
                    className="w-full bg-black/30 border border-border/40 text-xs font-mono px-3 py-2.5 outline-none transition-colors resize-y text-foreground/90 leading-relaxed"
                    spellCheck={false}
                  />
                </div>
              ))}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] text-muted-foreground/50 uppercase tracking-widest font-bold block">Updated Notes (optional, markdown)</label>
            <textarea
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              placeholder="Updated explanation or notes..."
              rows={4}
              className="w-full bg-background/40 border border-border focus:border-primary/50 text-xs font-mono px-2.5 py-2 outline-none transition-colors resize-y"
            />
          </div>
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
            {submitting ? "submitting..." : "[ submit edit request ]"}
          </button>
        </div>
      </form>
    </div>
  );
}
