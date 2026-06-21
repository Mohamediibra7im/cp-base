import "dotenv/config";
import { getDb } from "./index";
import { categories, templates, templateCodes } from "./schema";

const seedCategories = [
  { name: "Graphs", slug: "graphs", description: "Graph algorithms and traversals", icon: "GitBranch", color: "#22c55e", order: 1 },
  { name: "Data Structures", slug: "data-structures", description: "Essential data structures for CP", icon: "Layers", color: "#3b82f6", order: 2 },
  { name: "Dynamic Programming", slug: "dp", description: "DP patterns and optimizations", icon: "Zap", color: "#f59e0b", order: 3 },
  { name: "Math & Number Theory", slug: "math", description: "Math utilities for competitive programming", icon: "Sigma", color: "#a855f7", order: 4 },
  { name: "Strings", slug: "strings", description: "String processing algorithms", icon: "Text", color: "#ec4899", order: 5 },
];

async function seed() {
  const db = getDb();
  if (!db) {
    console.error("DATABASE_URL not set");
    process.exit(1);
  }

  console.log("Seeding categories...");
  for (const cat of seedCategories) {
    await db.insert(categories).values(cat).onConflictDoNothing();
  }

  const catRows = await db.select().from(categories);
  const catMap = Object.fromEntries(catRows.map((c) => [c.slug, c.id]));

  const dataStructuresId = catMap["data-structures"];
  const mathId = catMap["math"];
  const stringsId = catMap["strings"];
  const graphsId = catMap["graphs"];

  console.log("Seeding templates...");

  if (dataStructuresId) {
    const [dsu] = await db.insert(templates).values({
      title: "Disjoint Set Union (DSU)",
      slug: "dsu",
      description: "Union-Find data structure with path compression and union by size",
      categoryId: dataStructuresId,
      tags: ["dsu", "union-find", "graph"],
      complexity: "O(α(n))",
      notes: "Also known as Union-Find. Use for connected components, Kruskal's MST, dynamic connectivity.",
    }).returning();

    if (dsu) {
      await db.insert(templateCodes).values([
        { templateId: dsu.id, language: "cpp", code: `class DSU {\n  vector<int> parent, sz;\npublic:\n  DSU(int n) {\n    parent.resize(n);\n    sz.resize(n, 1);\n    for (int i = 0; i < n; i++) parent[i] = i;\n  }\n  int find(int x) {\n    return parent[x] == x ? x : parent[x] = find(parent[x]);\n  }\n  void unite(int a, int b) {\n    a = find(a), b = find(b);\n    if (a == b) return;\n    if (sz[a] < sz[b]) swap(a, b);\n    parent[b] = a;\n    sz[a] += sz[b];\n  }\n  bool same(int a, int b) { return find(a) == find(b); }\n  int size(int x) { return sz[find(x)]; }\n};` },
        { templateId: dsu.id, language: "python", code: `class DSU:\n    def __init__(self, n: int):\n        self.parent = list(range(n))\n        self.sz = [1] * n\n\n    def find(self, x: int) -> int:\n        while self.parent[x] != x:\n            self.parent[x] = self.parent[self.parent[x]]\n            x = self.parent[x]\n        return x\n\n    def unite(self, a: int, b: int) -> None:\n        a, b = self.find(a), self.find(b)\n        if a == b: return\n        if self.sz[a] < self.sz[b]: a, b = b, a\n        self.parent[b] = a\n        self.sz[a] += self.sz[b]\n\n    def same(self, a: int, b: int) -> bool:\n        return self.find(a) == self.find(b)` },
        { templateId: dsu.id, language: "java", code: `class DSU {\n    int[] parent, sz;\n    DSU(int n) {\n        parent = new int[n];\n        sz = new int[n];\n        for (int i = 0; i < n; i++) {\n            parent[i] = i;\n            sz[i] = 1;\n        }\n    }\n    int find(int x) {\n        return parent[x] == x ? x : (parent[x] = find(parent[x]));\n    }\n    void unite(int a, int b) {\n        a = find(a); b = find(b);\n        if (a == b) return;\n        if (sz[a] < sz[b]) { int t = a; a = b; b = t; }\n        parent[b] = a;\n        sz[a] += sz[b];\n    }\n    boolean same(int a, int b) { return find(a) == find(b); }\n}` },
      ]);
    }

    const [segTree] = await db.insert(templates).values({
      title: "Segment Tree",
      slug: "segment-tree",
      description: "Point update, range query segment tree",
      categoryId: dataStructuresId,
      tags: ["seg-tree", "range-query", "point-update"],
      complexity: "O(log n)",
      notes: "Can be adapted for sum, min, max, gcd. Use iterative (bottom-up) for speed.",
    }).returning();

    if (segTree) {
      await db.insert(templateCodes).values([
        { templateId: segTree.id, language: "cpp", code: `template<typename T>\nstruct SegTree {\n    int n;\n    vector<T> tree;\n    T (*op)(T, T);\n    T neutral;\n    SegTree(int _n, T (*_op)(T, T), T _neutral) : n(_n), op(_op), neutral(_neutral) {\n        tree.assign(2 * n, neutral);\n    }\n    void update(int idx, T val) {\n        for (tree[idx += n] = val; idx > 1; idx >>= 1)\n            tree[idx >> 1] = op(tree[idx], tree[idx ^ 1]);\n    }\n    T query(int l, int r) {\n        T resL = neutral, resR = neutral;\n        for (l += n, r += n + 1; l < r; l >>= 1, r >>= 1) {\n            if (l & 1) resL = op(resL, tree[l++]);\n            if (r & 1) resR = op(tree[--r], resR);\n        }\n        return op(resL, resR);\n    }\n};` },
      ]);
    }
  }

  if (mathId) {
    const [sieve] = await db.insert(templates).values({
      title: "Sieve of Eratosthenes",
      slug: "sieve",
      description: "Fast prime sieve up to N",
      categoryId: mathId,
      tags: ["prime", "sieve", "number-theory"],
      complexity: "O(n log log n)",
    }).returning();

    if (sieve) {
      await db.insert(templateCodes).values([
        { templateId: sieve.id, language: "cpp", code: `vector<bool> sieve(int n) {\n    vector<bool> is_prime(n + 1, true);\n    is_prime[0] = is_prime[1] = false;\n    for (int i = 2; i * i <= n; i++)\n        if (is_prime[i])\n            for (int j = i * i; j <= n; j += i)\n                is_prime[j] = false;\n    return is_prime;\n}` },
        { templateId: sieve.id, language: "python", code: `def sieve(n: int) -> list[bool]:\n    is_prime = [True] * (n + 1)\n    is_prime[0] = is_prime[1] = False\n    for i in range(2, int(n ** 0.5) + 1):\n        if is_prime[i]:\n            for j in range(i * i, n + 1, i):\n                is_prime[j] = False\n    return is_prime` },
      ]);
    }
  }

  if (stringsId) {
    const [kmp] = await db.insert(templates).values({
      title: "KMP Algorithm",
      slug: "kmp",
      description: "Knuth-Morris-Pratt pattern matching",
      categoryId: stringsId,
      tags: ["string", "pattern-matching", "kmp"],
      complexity: "O(n + m)",
      notes: "Computes LPS array then matches in linear time.",
    }).returning();

    if (kmp) {
      await db.insert(templateCodes).values([
        { templateId: kmp.id, language: "cpp", code: `vector<int> buildLPS(const string &p) {\n    int m = p.size();\n    vector<int> lps(m);\n    for (int i = 1, len = 0; i < m;) {\n        if (p[i] == p[len]) lps[i++] = ++len;\n        else if (len) len = lps[len - 1];\n        else lps[i++] = 0;\n    }\n    return lps;\n}\nvector<int> kmp(const string &s, const string &p) {\n    auto lps = buildLPS(p);\n    vector<int> matches;\n    for (int i = 0, j = 0; i < (int)s.size();) {\n        if (s[i] == p[j]) i++, j++;\n        if (j == p.size()) { matches.push_back(i - j); j = lps[j - 1]; }\n        else if (i < (int)s.size() && s[i] != p[j]) {\n            if (j) j = lps[j - 1];\n            else i++;\n        }\n    }\n    return matches;\n}` },
      ]);
    }
  }

  if (graphsId) {
    const [dijkstra] = await db.insert(templates).values({
      title: "Dijkstra's Algorithm",
      slug: "dijkstra",
      description: "Shortest path from single source (non-negative weights)",
      categoryId: graphsId,
      tags: ["shortest-path", "graph", "dijkstra"],
      complexity: "O((V + E) log V)",
      notes: "Use priority queue for O((V+E) log V). Does not work with negative weights.",
    }).returning();

    if (dijkstra) {
      await db.insert(templateCodes).values([
        { templateId: dijkstra.id, language: "cpp", code: `using ll = long long;\nusing pll = pair<ll, int>;\nconst ll INF = 1e18;\n\nvector<ll> dijkstra(int start, const vector<vector<pair<int, ll>>> &g) {\n    int n = g.size();\n    vector<ll> dist(n, INF);\n    priority_queue<pll, vector<pll>, greater<>> pq;\n    dist[start] = 0;\n    pq.emplace(0, start);\n    while (!pq.empty()) {\n        auto [d, u] = pq.top(); pq.pop();\n        if (d != dist[u]) continue;\n        for (auto &[v, w] : g[u])\n            if (dist[v] > dist[u] + w)\n                pq.emplace(dist[v] = dist[u] + w, v);\n    }\n    return dist;\n}` },
        { templateId: dijkstra.id, language: "python", code: `import heapq\n\ndef dijkstra(start: int, g: list[list[tuple[int, int]]]) -> list[int]:\n    n = len(g)\n    INF = 10 ** 18\n    dist = [INF] * n\n    dist[start] = 0\n    pq = [(0, start)]\n    while pq:\n        d, u = heapq.heappop(pq)\n        if d != dist[u]: continue\n        for v, w in g[u]:\n            if dist[v] > dist[u] + w:\n                dist[v] = dist[u] + w\n                heapq.heappush(pq, (dist[v], v))\n    return dist` },
      ]);
    }
  }

  console.log("Seed complete!");
}

seed().catch(console.error);
