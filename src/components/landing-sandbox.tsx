"use client";

import { useState } from "react";
import { Copy, Check, Zap, Info } from "lucide-react";
import { useTerminalTheme } from "./theme-provider";
import { toast } from "sonner";

interface AlgoTemplate {
  name: string;
  timeComplexity: string;
  spaceComplexity: string;
  description: string;
  code: string;
}

const TEMPLATES: Record<string, AlgoTemplate> = {
  segtree: {
    name: "Segment Tree",
    timeComplexity: "O(log N)",
    spaceComplexity: "O(N)",
    description: "Point update and range query tree structure. Fully customizable merge operations.",
    code: `template <typename T>
struct SegTree {
  int n;
  vector<T> tree;
  T neutral;
  function<T(T, T)> merge_func;

  SegTree(int n, T neutral, function<T(T, T)> merge_func)
      : n(n), tree(4 * n, neutral), neutral(neutral), merge_func(merge_func) {}

  void update(int node, int start, int end, int idx, T val) {
    if (start == end) {
      tree[node] = val;
      return;
    }
    int mid = (start + end) / 2;
    if (idx <= mid) update(2 * node, start, mid, idx, val);
    else update(2 * node + 1, mid + 1, end, idx, val);
    tree[node] = merge_func(tree[2 * node], tree[2 * node + 1]);
  }

  T query(int node, int start, int end, int l, int r) {
    if (r < start || end < l) return neutral;
    if (l <= start && end <= r) return tree[node];
    int mid = (start + end) / 2;
    return merge_func(query(2 * node, start, mid, l, r),
                      query(2 * node + 1, mid + 1, end, l, r));
  }
};`,
  },
  dsu: {
    name: "Disjoint Set Union",
    timeComplexity: "O(α(N))",
    spaceComplexity: "O(N)",
    description: "Highly optimized disjoint-set structure with path compression and union-by-size.",
    code: `struct DSU {
  vector<int> parent, size;
  DSU(int n) {
    parent.resize(n);
    size.assign(n, 1);
    iota(parent.begin(), parent.end(), 0);
  }

  int find(int i) {
    if (parent[i] == i) return i;
    return parent[i] = find(parent[i]); // Path compression
  }

  bool unite(int i, int j) {
    int root_i = find(i);
    int root_j = find(j);
    if (root_i != root_j) {
      if (size[root_i] < size[root_j])
        swap(root_i, root_j);
      parent[root_j] = root_i;
      size[root_i] += size[root_j];
      return true;
    }
    return false;
  }
};`,
  },
  fenwick: {
    name: "Fenwick Tree (BIT)",
    timeComplexity: "O(log N)",
    spaceComplexity: "O(N)",
    description: "Space-efficient binary indexed tree for point addition and prefix sum query operations.",
    code: `template <typename T>
struct Fenwick {
  int n;
  vector<T> tree;
  Fenwick(int n) : n(n), tree(n + 1, 0) {}

  void add(int idx, T delta) {
    for (; idx <= n; idx += idx & -idx)
      tree[idx] += delta;
  }

  T query(int idx) {
    T sum = 0;
    for (; idx > 0; idx -= idx & -idx)
      sum += tree[idx];
    return sum;
  }

  T query(int l, int r) {
    return query(r) - query(l - 1);
  }
};`,
  },
};

export function LandingSandbox() {
  const [activeTab, setActiveTab] = useState<string>("segtree");
  const [copied, setCopied] = useState(false);
  const { playClick, playSuccess } = useTerminalTheme();

  const handleCopy = () => {
    navigator.clipboard.writeText(TEMPLATES[activeTab].code);
    playSuccess();
    setCopied(true);
    toast.success("Template copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const selected = TEMPLATES[activeTab];

  return (
    <div className="border border-border/80 bg-card/35 backdrop-blur-md shadow-2xl overflow-hidden font-mono relative">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between border-b border-border/40 px-3.5 py-2.5 bg-muted/15 text-[10px] text-muted-foreground/35 select-none">
        <div className="flex items-center gap-1.5">
          <div className="flex gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-destructive/60" />
            <span className="h-1.5 w-1.5 rounded-full bg-warning/60" />
            <span className="h-1.5 w-1.5 rounded-full bg-success/60" />
          </div>
          <span className="ml-2 tracking-wider text-primary/75">TEMPLATE_PLAYGROUND.cpp</span>
        </div>
        <span className="text-[9px] uppercase tracking-widest text-primary/50 flex items-center gap-1">
          <Zap className="h-3 w-3 animate-pulse" />
          <span>Interactive</span>
        </span>
      </div>

      <div className="flex flex-col lg:flex-row min-h-[420px]">
        {/* Left Side: Select tabs & stats */}
        <div className="w-full lg:w-64 border-b lg:border-b-0 lg:border-r border-border/40 bg-muted/5 flex flex-col p-4">
          <div className="text-[10px] text-muted-foreground/30 uppercase tracking-widest font-bold mb-3 select-none">
            Select Algorithm
          </div>
          <div className="space-y-2 flex-1">
            {Object.entries(TEMPLATES).map(([key, value]) => {
              const isActive = activeTab === key;
              return (
                <button
                  key={key}
                  onClick={() => {
                    playClick();
                    setActiveTab(key);
                  }}
                  className={`w-full text-left px-3 py-2 border text-[11px] font-bold uppercase transition-all flex items-center justify-between ${
                    isActive
                      ? "border-primary/50 bg-primary/5 text-primary shadow-[0_0_12px_rgba(var(--primary-rgb),0.1)]"
                      : "border-border/50 bg-card/25 text-muted-foreground/50 hover:text-foreground hover:border-border"
                  }`}
                >
                  <span>{value.name}</span>
                  {isActive && <span className="h-1.5 w-1.5 bg-primary rounded-full animate-ping" />}
                </button>
              );
            })}
          </div>

          {/* Complexity analysis details */}
          <div className="border border-border/30 bg-muted/15 p-3 space-y-2.5 mt-4 select-none">
            <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground/40 font-bold uppercase tracking-wider">
              <Info className="h-3.5 w-3.5 text-primary" />
              <span>Complexity Analysis</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-muted-foreground/45">Time Complexity:</span>
              <span className="font-bold text-success/80">{selected.timeComplexity}</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-muted-foreground/45">Space Complexity:</span>
              <span className="font-bold text-info">{selected.spaceComplexity}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Code Viewer & Description */}
        <div className="flex-1 flex flex-col bg-black/15">
          <div className="p-4 border-b border-border/40 flex items-center justify-between bg-muted/5 shrink-0 select-none">
            <div>
              <h4 className="text-xs font-bold text-foreground mb-0.5">{selected.name}</h4>
              <p className="text-[10px] text-muted-foreground/60 leading-relaxed max-w-md">
                {selected.description}
              </p>
            </div>
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-3 py-1.5 border transition-all text-[10px] uppercase font-bold cursor-pointer ${
                copied
                  ? "border-success bg-success/10 text-success"
                  : "border-primary/30 hover:border-primary bg-primary/5 text-primary hover:shadow-[0_0_12px_var(--primary-glow-weak)]"
              }`}
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          {/* Actual Code Pre block */}
          <div className="p-4 flex-1 overflow-auto max-h-[300px] lg:max-h-[340px] scrollbar-thin">
            <pre className="text-[10px] leading-relaxed text-muted-foreground/90 select-all font-mono">
              <code>{selected.code}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
