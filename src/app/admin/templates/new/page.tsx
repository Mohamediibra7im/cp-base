"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { MarkdownEditor } from "@/components/markdown-editor";
import { CategoryCreator } from "@/components/category-creator";

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

export default function NewTemplate() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    categoryId: "",
    complexity: "",
    notes: "",
    tags: "",
  });
  const [codes, setCodes] = useState<CodeEntry[]>([{ language: "cpp", code: "" }]);

  const fetchCategories = useCallback(() => {
    fetch("/api/admin/categories").then((r) => r.json()).then(setCategories);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const generateSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const onTitleChange = (title: string) => {
    setForm((f) => ({ ...f, title, slug: generateSlug(title) }));
  };

  const updateCode = (index: number, field: keyof CodeEntry, value: string) => {
    setCodes((prev) => prev.map((c, i) => (i === index ? { ...c, [field]: value } : c)));
  };

  const addCode = () => setCodes((prev) => [...prev, { language: "cpp", code: "" }]);

  const removeCode = (index: number) => {
    setCodes((prev) => prev.filter((_, i) => i !== index));
  };

  const save = async () => {
    if (!form.title || !form.categoryId) {
      toast.error("Title and category are required");
      return;
    }
    setSaving(true);
    const res = await fetch("/api/admin/templates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        categoryId: Number(form.categoryId),
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        codes: codes.filter((c) => c.code.trim()),
      }),
    });
    setSaving(false);

    if (res.ok) {
      toast.success("Template created");
      router.push("/admin");
      router.refresh();
    } else {
      toast.error("Failed to create template");
    }
  };

  return (
    <div className="space-y-6">
      <Link href="/admin">
        <Button variant="outline" size="sm" className="font-mono text-xs"><ArrowLeft className="h-4 w-4 mr-1" />Back</Button>
      </Link>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <span className="text-primary font-mono text-sm">$</span>
            <CardTitle>New Template</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title" className="font-mono text-xs text-muted-foreground">title</Label>
              <Input id="title" value={form.title} onChange={(e) => onTitleChange(e.target.value)} placeholder="Segment Tree" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug" className="font-mono text-xs text-muted-foreground">slug</Label>
              <Input id="slug" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} placeholder="segment-tree" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="desc" className="font-mono text-xs text-muted-foreground">description</Label>
            <Textarea id="desc" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Point update, range query segment tree" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="cat" className="font-mono text-xs text-muted-foreground">category</Label>
              <Select value={form.categoryId} onValueChange={(v) => v && setForm((f) => ({ ...f, categoryId: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category">
                    {categories.find((c) => String(c.id) === form.categoryId)?.name || "Select category"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <CategoryCreator onCreated={(cat) => {
                setCategories((prev) => [...prev, cat]);
                setForm((f) => ({ ...f, categoryId: String(cat.id) }));
              }} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="comp" className="font-mono text-xs text-muted-foreground">complexity</Label>
              <Input id="comp" value={form.complexity} onChange={(e) => setForm((f) => ({ ...f, complexity: e.target.value }))} placeholder="O(log n)" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags" className="font-mono text-xs text-muted-foreground">tags (comma separated)</Label>
            <Input id="tags" value={form.tags} onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))} placeholder="segment-tree, range-query" />
          </div>

          <div className="space-y-2">
            <Label className="font-mono text-xs text-muted-foreground">notes</Label>
            <MarkdownEditor
              value={form.notes}
              onChange={(v) => setForm((f) => ({ ...f, notes: v }))}
              placeholder="Optional notes, usage tips, algorithm explanation..."
              minHeight="200px"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-primary font-mono text-sm">$</span>
            <CardTitle>Code</CardTitle>
          </div>
          <Button variant="outline" size="sm" onClick={addCode} className="font-mono text-xs"><Plus className="h-4 w-4 mr-1" />Add Language</Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {codes.map((entry, i) => (
            <div key={i} className="space-y-2 p-4 border border-border rounded-lg">
              <div className="flex items-center justify-between">
                <Select value={entry.language} onValueChange={(v) => v && updateCode(i, "language", v)}>
                  <SelectTrigger className="w-32 font-mono text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((l) => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}
                  </SelectContent>
                </Select>
                {codes.length > 1 && (
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => removeCode(i)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <Textarea
                value={entry.code}
                onChange={(e) => updateCode(i, "code", e.target.value)}
                placeholder={`Paste your ${entry.language} code here...`}
                className="font-mono text-sm min-h-[150px]"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Link href="/admin"><Button variant="outline" className="font-mono text-xs">Cancel</Button></Link>
        <Button onClick={save} disabled={saving} className="font-mono">{saving ? "Saving..." : "Save Template"}</Button>
      </div>
    </div>
  );
}
