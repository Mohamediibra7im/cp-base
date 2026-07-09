import { templates, templateCodes } from "../schema";
import { stripMain, type Db, type CatMap } from "./helpers";

export async function seedRangeQueries(db: Db, catMap: CatMap) {
  const categoryId = catMap["range-queries"];
  if (!categoryId) return;

  // ─── 1. SQRT Decomposition ─────────────────────────────────────────
  const [sqrtDecomp] = await db.insert(templates).values({
    title: "SQRT Decomposition",
    slug: "sqrt-decomposition",
    description: "Square root decomposition with sorted blocks for range queries and point updates",
    categoryId: categoryId,
    tags: ["sqrt-decomposition", "bucket", "range-query", "sorted-blocks"],
    complexity: "$O(sqrt(n))$ per query/update",
    notes: `# SQRT Decomposition

Partitions an array of $n$ elements into $B = \lceil \sqrt{n} \rceil$ blocks, each stored in sorted order. Enables range counting queries and point updates in $O(\sqrt{n})$.

## How It Works

### Building

Element at index $i$ goes into block $\lfloor i / B \rfloor$. Sort each block for binary search.

### Query: Count elements $\geq x$ in $[l, r]$

Three regions:

1. **Left boundary** — scan partial block: $O(B)$
2. **Full blocks** — binary search each for count $\geq x$: $O(\log B)$ per block
3. **Right boundary** — scan partial block: $O(B)$

### Point Update

Find the block, overwrite old value with new, re-sort: $O(B)$.

$$B = \lceil \sqrt{n} \rceil, \\quad \text{Query} = O(B) + O\\!\left(\frac{n}{B} \log B\right) = O(\sqrt{n})$$

## When to Use

- **Range counting** ("count elements $\geq k$ in $[l, r]$")
- Simple alternative to segment tree when $O(\sqrt{n})$ suffices
- Problems with point updates

## Complexity

| Operation | Time |
|-----------|------|
| Build | $O(n \log n)$ |
| Query | $O(\sqrt{n})$ |
| Point update | $O(\sqrt{n})$ |
| Space | $O(n)$ |`,
  }).returning();
  if (sqrtDecomp) {
    await db.insert(templateCodes).values([{
      templateId: sqrtDecomp.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;

using ll = long long;

template <typename T = int, int Base = 0>
struct SqrtDecomp {
    int n, len;
    vector<T> a;
    vector<vector<T>> b;
    T uDefault, qDefault;

    int calcBlockSize(int N) {
        int sq = sqrt(N);
        return sq * sq == N ? sq : sq + 1;
    }

    SqrtDecomp(int N = 0, const vector<T>& vec = vector<T>()) {
        n = N;
        len = calcBlockSize(n);
        uDefault = 0;
        qDefault = 0;
        a = vec.empty() ? vector<T>(n + 5, uDefault) : vec;
        b = vector<vector<T>>(len + 5);
        if (!vec.empty()) build();
    }

    void build() {
        for (int i = (Base ? 1 : 0); i < (Base ? n + 1 : n); i++)
            b[i / len].push_back(a[i]);
        for (int i = 0; i <= len; i++)
            sort(b[i].begin(), b[i].end());
    }

    void update(int idx, T val) {
        int blockIdx = idx / len;
        auto& blk = b[blockIdx];
        int pos = lower_bound(blk.begin(), blk.end(), a[idx - !Base]) - blk.begin();
        blk[pos] = a[idx - !Base] = val;
        sort(blk.begin(), blk.end());
    }

    void updateRange(int idx, T val) {
        int blockIdx = idx / len;
        a[idx - !Base] = val;
        b[blockIdx].clear();
        for (int i = blockIdx * len; i < min(n, (blockIdx + 1) * len); i++)
            b[blockIdx].push_back(a[i - !Base]);
        sort(b[blockIdx].begin(), b[blockIdx].end());
    }

    T query(int l, int r, T x) {
        T res = qDefault;

        while (l < r && l % len != 0)
            res += a[l++ - !Base] >= x;

        while (l + len <= r) {
            auto& blk = b[l / len];
            res += (int)blk.size() - (lower_bound(blk.begin(), blk.end(), x) - blk.begin());
            l += len;
        }

        while (l <= r)
            res += a[l++ - !Base] >= x;
        return res;
    }
};`)
    }]);
  }

  // ─── 2. Mo's Algorithm ──────────────────────────────────────────────
  const [mosAlgo] = await db.insert(templates).values({
    title: "Mo's Algorithm",
    slug: "mos-algorithm",
    description: "Offline range query processing with Hilbert curve ordering for optimal cache performance",
    categoryId: categoryId,
    tags: ["mo-algorithm", "offline", "range-query", "hilbert-curve", "two-pointers"],
    complexity: "$O((n + q) * sqrt(n))$",
    notes: `# Mo's Algorithm

Mo's algorithm processes $q$ offline range queries on an array of size $n$ by reordering them to minimize the movement of two pointers. Instead of answering queries in input order, we sort them so that consecutive queries share overlapping ranges, amortizing the cost of adding/removing elements.

## How It Works

### Two-Pointer Approach

Maintain two pointers \`currL\` and \`currR\` defining the current active range $[\text{currL}, \text{currR}]$. To answer a new query $[L, R]$:

1. **Expand/shrink left**: Move \`currL\` toward $L$, calling \`add()\` or \`remove()\` on each element crossed.
2. **Expand/shrink right**: Move \`currR\` toward $R$, calling \`add()\` or \`remove()\` on each element crossed.

Each element is added/removed at most $O(\sqrt{n})$ times across all queries when properly ordered.

### Query Ordering

**Classic Mo's ordering**: Sort queries by block of $L$ first, then by $R$ within each block:

$$\text{Block}(L) = \left\lfloor \frac{L}{B} \right\rfloor, \\quad B = \frac{n}{\sqrt{q}}$$

$$\text{Order} = (\text{Block}(L), \\; R)$$

This gives $O(n\sqrt{q})$ total complexity.

**Hilbert curve ordering** (used in this template): Maps each query's $(L, R)$ pair to a point on a Hilbert space-filling curve and sorts by that value. This achieves $O(n\sqrt{q})$ in theory but with much better cache locality and smaller constants in practice. The Hilbert curve avoids the pathological $O(nq)$ behavior that can occur with naive Mo's ordering when $R$ oscillates wildly between blocks.

### The \`add()\` / \`remove()\` Interface

You must implement two methods:

- \`add(idx)\` — incorporate \`arr[idx]\` into the current answer. Called when expanding the range.
- \`remove(idx)\` — exclude \`arr[idx]\` from the current answer. Called when shrinking the range.

The \`ans\` member variable holds the current aggregate. After setting the range, \`ans\` contains the answer for that query.

## When to Use

- **Offline range queries** where the answer can be incrementally maintained by adding/removing one element at a time.
- **No updates** (static array) — Mo's is offline and requires all queries upfront.
- **CP patterns**: "Count distinct elements in $[l, r]$", "Find mode in $[l, r]$", "XOR of elements in $[l, r]$ with certain properties."
- **When segment tree is overkill or impossible**: Some queries (e.g., mode) have no efficient online solution.

## Edge Cases

| Case | Behavior |
|------|----------|
| $q = 0$ | No queries processed, \`getAnswers()\` returns empty vector |
| All queries are $[1, 1]$ | Point queries — each processed in $O(1)$ amortized |
| All queries are $[1, n]$ | Full-array queries — first query pays $O(n)$, rest are $O(1)$ |
| $n = 1$ | Trivial — one element, one block |
| Overlapping queries | Pointer moves are amortized across the overlap |

## Complexity

| Operation | Time |
|-----------|------|
| Sorting queries (Hilbert) | $O(q \log q)$ |
| Processing all queries | $O((n + q) \cdot \sqrt{n})$ with Hilbert ordering |
| Total | $O((n + q) \cdot \sqrt{n})$ |
| Space | $O(n + q)$ |

## Template Parameters

- **T** — answer type (default \`int\`)
- **Base** — \`0\` for 0-indexed, \`1\` for 1-indexed queries

## Usage

\`\`\`cpp
int n = 5, q = 3;
vector<int> arr = {1, 2, 3, 4, 5};
MoAlgorithm<int, 0> mo(n, q);
mo.getData(arr);
// Implement add() and remove() inside the class
for (auto& a : mo.getAnswers())
    cout << a << "\\n";
\`\`\``,
  }).returning();
  if (mosAlgo) {
    await db.insert(templateCodes).values([{
      templateId: mosAlgo.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;

using ll = long long;

template <typename T = int, int Base = 0>
class MoAlgorithm {
public:

    struct Query {
        int l, r, queryIdx;
        int64_t ord;

        Query(int L = 0, int R = 0, int QueryIdx = 0, int hilbertPow = 0) {
            l = L - !Base;
            r = R - !Base;
            queryIdx = QueryIdx;
            calcOrder(hilbertPow);
        }

        void calcOrder(int hilbertPow) {
            ord = hilbertOrder(l, r, hilbertPow, 0);
        }

        bool operator<(const Query& rhs) const {
            return ord < rhs.ord;
        }
    };

    MoAlgorithm(int N = 0, int M = 0)
        : currL(1), currR(0), n(N), m(M),
          sqrtN(n / max((int)sqrt(m), 1) + 1),
          hilbertPow(calculateHilbertPow()),
          ans(0), answers(m), queries(m) {}

    void getData(const vector<T>& v = {}) {
        val = v;
        for (int i = 0, l, r; i < m && cin >> l >> r; i++)
            queries[i] = Query(l, r, i, hilbertPow);
        process();
    }

    void process() {
        sort(queries.begin(), queries.end());
        currL = queries[0].l;
        currR = queries[0].l - 1;
        for (auto& q : queries) {
            setRange(q);
            answers[q.queryIdx] = ans;
        }
    }

    vector<T> getAnswers() const {
        return answers;
    }

private:
    int currL, currR, n, m, sqrtN, hilbertPow;
    T ans;
    vector<T> answers, val;
    vector<Query> queries;

    static int64_t hilbertOrder(int x, int y, int pow, int rotate) {
        if (pow == 0) return 0;
        int hpow = 1 << (pow - 1);
        int seg = (x < hpow) ? ((y < hpow) ? 0 : 3) : ((y < hpow) ? 1 : 2);
        seg = (seg + rotate) & 3;
        const int rotateDelta[4] = {3, 0, 0, 1};
        int nx = x & (x ^ hpow);
        int ny = y & (y ^ hpow);
        int nrot = (rotate + rotateDelta[seg]) & 3;
        int64_t subSquareSize = int64_t(1) << (2 * pow - 2);
        int64_t result = seg * subSquareSize;
        int64_t add = hilbertOrder(nx, ny, pow - 1, nrot);
        result += (seg == 1 || seg == 2) ? add : (subSquareSize - add - 1);
        return result;
    }

    int calculateHilbertPow() const {
        int p = 1;
        while ((1 << p) < n) p++;
        return p;
    }

    void add(int idx) {

    }

    void remove(int idx) {

    }

    void setRange(const Query& q) {
        while (currL > q.l) currL--, add(currL);
        while (currR < q.r) currR++, add(currR);
        while (currL < q.l) remove(currL), currL++;
        while (currR > q.r) remove(currR), currR--;
    }
};`)
    }]);
  }

  // ─── 3. Mo's on Trees ───────────────────────────────────────────────
  const [mosTree] = await db.insert(templates).values({
    title: "Mo's on Trees",
    slug: "mos-on-trees",
    description: "Mo's algorithm adapted for tree path queries using Euler tour and LCA via binary lifting",
    categoryId: categoryId,
    tags: ["mo-algorithm", "tree", "path-query", "hilbert-curve", "euler-tour", "lca"],
    complexity: "$O((n + q) * sqrt(n))$",
    notes: `# Mo's Algorithm on Trees

Mo's algorithm on trees answers offline path queries on a tree by reducing them to linear range queries on an Euler tour sequence. Combined with LCA (lowest common ancestor) via binary lifting, this handles arbitrary node-to-node path queries.

## How It Works

### Euler Tour Encoding

Perform a DFS from the root, recording each node's entry time \`S[u]\` and exit time \`E[u]\` in an Euler tour array \`FT[]\`. For a path from $u$ to $v$:

1. Compute $\text{lca} = \text{LCA}(u, v)$.
2. If $\text{lca} = u$ (one node is ancestor of the other): the path maps to the range $[S[u], S[v]]$ in the Euler tour.
3. Otherwise: the path maps to $[E[u], S[v]] \cup \\{\text{lca}\\}$, i.e., the range $[E[u], S[v]]$ in the Euler tour plus the LCA node (which is not included in the range).

The key insight: a node $x$ appears in the Euler tour at positions $S[x]$ and $E[x]$. A node is "active" (counted) when it appears an odd number of times in the current range. Toggling a node's frequency between 1 and 0 when the pointer crosses $S[x]$ or $E[x]$ achieves this.

### Path Mapping

Given query $(u, v)$ with $\text{lca} = \text{LCA}(u, v)$:

- **Case 1** ($\text{lca} = u$): Path = nodes on simple path from $u$ to $v$.
  Map to Euler range $[S[u] + \text{VAL\_ON\_EDGE}, S[v]]$.
  The \`+ VAL_ON_EDGE\` offset skips the LCA's own entry when values are on edges.

- **Case 2** ($\text{lca} \neq u$): Path = nodes on $u \\to \text{lca} \\to v$.
  Map to Euler range $[E[u], S[v]]$, then manually add the LCA after processing.

### LCA via Binary Lifting

Precompute \`anc[u][k]\` = the $2^k$-th ancestor of $u$ using DP:

$$\text{anc}[u][0] = \text{parent}(u)$$
$$\text{anc}[u][k] = \text{anc}[\text{anc}[u][k-1]][k-1]$$

LCA query: lift the deeper node to the same depth, then lift both together.

### Node Toggling via \`operation()\`

When the Mo's pointer crosses position $\text{FT}[\text{idx}]$ (a node occurrence in the Euler tour), call \`operation(idx)\`:

1. Get the node $u = \text{FT}[\text{idx}]$.
2. Toggle its frequency: \`nodeFreq[u] ^= 1\`.
3. If $u$ is now active (freq = 1): call \`add(u)\`.
4. If $u$ is now inactive (freq = 0): call \`remove(u)\`.

This naturally handles the "each node appears twice in Euler tour" property.

## When to Use

- **Offline tree path queries**: "Find distinct node values on path $u \\to v$", "Count nodes with property $P$ on path."
- **When online processing is not required** — Mo's is offline, all queries known upfront.
- **CP patterns**: Node/edge values on paths, XOR queries on paths, mode on paths.

## Edge Cases

| Case | Behavior |
|------|----------|
| $u = v$ (self-path) | Maps to range $[S[u], S[u]]$ — single node toggled once |
| $u$ is ancestor of $v$ | Handled by Case 1 — no LCA addition needed |
| Root queries | LCA is root; \`add(root)\` called when root is in path |
| \`VAL_ON_EDGE = true\` | Node values come from edge weights; offset range start by 1 |
| Weighted graph | DFS populates \`val[v]\` from edge weight \`w\` |

## Complexity

| Operation | Time |
|-----------|------|
| DFS + LCA table build | $O(n \log n)$ |
| Query processing (Mo's) | $O((n + q) \cdot \sqrt{n})$ with Hilbert ordering |
| LCA query | $O(\log n)$ per query |
| Space | $O(n \log n)$ for ancestors + $O(n)$ for Euler tour |

## Template Parameters

- **T** — answer type (default \`int\`)
- **graphType** — adjacency element type (\`int\` for unweighted, \`pair<int,int>\` for weighted)
- **VAL_ON_EDGE** — \`false\` for node values, \`true\` for edge values

## Usage

\`\`\`cpp
int n = 5, q = 3;
vector<vector<int>> adj(n + 1);
// build adjacency list ...
MoTree<int, int, false> mo(n, q, adj, nodeVals, 1);
mo.getData();
for (auto& a : mo.getAnswers())
    cout << a << "\\n";
\`\`\``,
  }).returning();
  if (mosTree) {
    await db.insert(templateCodes).values([{
      templateId: mosTree.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;

using ll = long long;

template <typename T = int, typename graphType = int, bool VAL_ON_EDGE = false>
class MoTree {
public:

    struct Query {
        int l, r, lca, queryIdx;
        int64_t ord;

        Query(vector<int>& S, vector<int>& E, int L, int R, int QueryIdx,
              int LCA, int hilbertPow) {
            if (S[L] > S[R]) swap(L, R);
            if (LCA == L) {

                l = S[L] + VAL_ON_EDGE;
                r = S[R];
                lca = -1;
            } else {

                l = E[L];
                r = S[R];
                lca = LCA;
            }
            queryIdx = QueryIdx;
            calcOrder(hilbertPow);
        }

        void calcOrder(int hilbertPow) {
            ord = MoTree::hilbertOrder(l, r, hilbertPow, 0);
        }

        bool operator<(const Query& rhs) const {
            return ord < rhs.ord;
        }
    };

    MoTree(int N, int M, const vector<vector<graphType>>& G,
           const vector<T>& V = {}, int root = 1)
        : currL(1), currR(0), n(N), m(M),
          sqrtN(n / max((int)sqrt(m), 1) + 1),
          timer(1), ans(0), answers(M), val(V), adj(G) {
        LOG = calcLog(N);
        hilbertPow = calcHilbertPow(2 * N + 1);
        nodeFreq = S = E = dep = vector<int>(n + 5);
        FT = vector<int>(2 * n + 5);
        anc = vector<vector<int>>(n + 5, vector<int>(LOG));
        if (val.empty()) val = vector<T>(n + 5);
        dfs(root, adj);
    }

    static int64_t hilbertOrder(int x, int y, int pow, int rotate) {
        if (pow == 0) return 0;
        int hpow = 1 << (pow - 1);
        int seg = (x < hpow) ? ((y < hpow) ? 0 : 3) : ((y < hpow) ? 1 : 2);
        seg = (seg + rotate) & 3;
        const int rotateDelta[4] = {3, 0, 0, 1};
        int nx = x & (x ^ hpow);
        int ny = y & (y ^ hpow);
        int nrot = (rotate + rotateDelta[seg]) & 3;
        int64_t subSquareSize = int64_t(1) << (2 * pow - 2);
        int64_t result = seg * subSquareSize;
        int64_t add = hilbertOrder(nx, ny, pow - 1, nrot);
        result += (seg == 1 || seg == 2) ? add : (subSquareSize - add - 1);
        return result;
    }

    void getData() {
        for (int i = 0, u, v; i < m && cin >> u >> v; i++)
            queries.emplace_back(S, E, u, v, i, getLCA(u, v), hilbertPow);
        process();
    }

    void process() {
        sort(queries.begin(), queries.end());
        currL = queries[0].l;
        currR = queries[0].l - 1;
        for (auto& q : queries) {
            setRange(q);

            if (~q.lca && !VAL_ON_EDGE) add(q.lca);
            answers[q.queryIdx] = ans;
            if (~q.lca && !VAL_ON_EDGE) remove(q.lca);
        }
    }

    vector<T> getAnswers() const {
        return answers;
    }

private:
    int currL, currR, n, m, sqrtN, timer, LOG, hilbertPow;
    T ans;
    vector<T> answers, val;
    vector<int> dep, S, E, FT, nodeFreq;
    vector<vector<int>> anc;
    vector<Query> queries;
    const vector<vector<graphType>>& adj;

    void dfs(int u, const vector<vector<pair<int, int>>>& G, int p = -1) {
        S[u] = timer;
        FT[timer++] = u;
        for (auto& [v, w] : G[u]) {
            if (v == p) continue;
            dep[v] = dep[u] + 1;
            anc[v][0] = u;
            val[v] = w;
            for (int bit = 1; bit < LOG; bit++)
                anc[v][bit] = anc[anc[v][bit - 1]][bit - 1];
            dfs(v, G, u);
        }
        E[u] = timer;
        FT[timer++] = u;
    }

    void dfs(int u, const vector<vector<int>>& G, int p = -1) {
        S[u] = timer;
        FT[timer++] = u;
        for (auto& v : G[u]) {
            if (v == p) continue;
            dep[v] = dep[u] + 1;
            anc[v][0] = u;
            for (int bit = 1; bit < LOG; bit++)
                anc[v][bit] = anc[anc[v][bit - 1]][bit - 1];
            dfs(v, G, u);
        }
        E[u] = timer;
        FT[timer++] = u;
    }

    int kthAncestor(int u, int k) const {
        if (dep[u] < k) return -1;
        for (int bit = LOG - 1; bit >= 0; bit--)
            if (k & (1 << bit))
                u = anc[u][bit];
        return u;
    }

    int getLCA(int u, int v) const {
        if (dep[u] < dep[v]) swap(u, v);
        u = kthAncestor(u, dep[u] - dep[v]);
        if (u == v) return u;
        for (int bit = LOG - 1; bit >= 0; bit--)
            if (anc[u][bit] != anc[v][bit])
                u = anc[u][bit], v = anc[v][bit];
        return anc[u][0];
    }

    void setRange(Query& q) {
        while (currL > q.l) operation(--currL);
        while (currR < q.r) operation(++currR);
        while (currL < q.l) operation(currL++);
        while (currR > q.r) operation(currR--);
    }

    void add(int u) {

    }

    void remove(int u) {

    }

    void operation(int idx) {
        int u = FT[idx];
        nodeFreq[u] ^= 1;
        if (nodeFreq[u] == 1)
            add(u);
        else
            remove(u);
    }

    int calcLog(int maxN) const {
        int log = 0;
        while ((1 << log) <= maxN) log++;
        return log;
    }

    int calcHilbertPow(int maxN) const {
        int p = 0;
        while ((1 << p) < maxN) p++;
        return p;
    }
};`)
    }]);
  }

  // ─── 4. Prefix Sum 2D ───────────────────────────────────────────────
  const [pref2d] = await db.insert(templates).values({
    title: "Prefix Sum 2D",
    slug: "prefix-sum-2d",
    description: "2D prefix sum for O(1) rectangle sum queries on a static grid",
    categoryId: categoryId,
    tags: ["prefix-sum", "2d", "range-query", "static-grid", "inclusion-exclusion"],
    complexity: "$O(n*m)$ build, $O(1)$ per query",
    notes: `# Prefix Sum 2D

A 2D prefix sum enables $O(1)$ sum queries over any axis-aligned rectangle in a static grid. The grid is preprocessed once, after which any rectangle sum is computed via inclusion-exclusion of four precomputed values.

## How It Works

### Building the Prefix Sum Matrix

Given an $n \times m$ grid $A$ (0-indexed), construct a 1-indexed prefix sum matrix $P$ where:

$$P[i][j] = \sum_{x=0}^{i-1} \sum_{y=0}^{j-1} A[x][y]$$

Recurrence:

$$P[i][j] = A[i-1][j-1] + P[i][j-1] + P[i-1][j] - P[i-1][j-1]$$

This is computed by iterating $i$ from $1$ to $n$ and $j$ from $1$ to $m$.

### Query: Sum of rectangle $[x_1, y_1]$ to $[x_2, y_2]$

Using inclusion-exclusion (all coordinates 1-indexed):

$$\text{sum}([x_1..x_2] \times [y_1..y_2]) = P[x_2][y_2] - P[x_1-1][y_2] - P[x_2][y_1-1] + P[x_1-1][y_1-1]$$

**Why it works**: $P[x_2][y_2]$ is the sum of the entire rectangle from $(1,1)$ to $(x_2, y_2)$. Subtracting $P[x_1-1][y_2]$ removes everything above row $x_1$. Subtracting $P[x_2][y_1-1]$ removes everything left of column $y_1$. But the region above $x_1$ and left of $y_1$ was subtracted twice, so we add it back: $+ P[x_1-1][y_1-1]$.

\`\`\`
P[x2][y2]  = [=============]
             [  SUBTRACT    ]  <- P[x1-1][y2]
             [  ADD BACK    ]  <- P[x1-1][y1-1]
             [  SUBTRACT    ]  <- P[x2][y1-1]
             [=============]
\`\`\`

## When to Use

- **Static grid sum queries**: "What is the sum of values in sub-rectangle $[r_1, c_1]$ to $[r_2, c_2]$?"
- **2D range counting**: After converting values to 0/1, prefix sums count points in a rectangle.
- **CP patterns**: Sub-rectangle sums, sub-grid maximum (combine with other techniques), histogram problems.
- **Baseline for more complex structures**: Fenwick tree 2D, segment tree 2D are online extensions.

## Edge Cases

| Case | Behavior |
|------|----------|
| $n = 0$ or $m = 0$ | Empty grid, queries return 0 (matrix initialized to 0) |
| Single cell query | $x_1 = x_2, y_1 = y_2$: returns just $A[x_1][y_1]$ |
| $x_1 > x_2$ or $y_1 > y_2$ | \`getQuery()\` auto-swaps coordinates |
| Entire grid query | $P[n][m]$ directly |
| Negative values | Works correctly — no assumption of non-negativity |

## Complexity

| Operation | Time | Space |
|-----------|------|-------|
| Build prefix matrix | $O(n \cdot m)$ | $O(n \cdot m)$ |
| Rectangle sum query | $O(1)$ | $O(1)$ |
| Space total | — | $O(n \cdot m)$ |

## Template Parameters

- **T** — element type (default \`int\`); use \`ll\` for large sums

## Usage

\`\`\`cpp
vector<vector<int>> mat = {{1,2,3},{4,5,6},{7,8,9}};
PrefixSum2D<int> ps(3, 3);
ps.buildPrefix(mat);
cout << ps.getQuery(1, 1, 2, 2);  // 1+2+4+5 = 12
cout << ps.getQuery(0, 0, 2, 2);  // 1+2+3+4+5+6+7+8+9 = 45
\`\`\``,
  }).returning();
  if (pref2d) {
    await db.insert(templateCodes).values([{
      templateId: pref2d.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;

using ll = long long;

template <typename T = int>
struct PrefixSum2D {
    int n, m;
    vector<vector<T>> prefix;

    PrefixSum2D(int N = 0, int M = 0) {
        n = N;
        m = M;
        prefix.assign(n + 5, vector<T>(m + 5, 0));
    }

    T getQuery(int x1, int y1, int x2, int y2) {
        if (x1 > x2) swap(x1, x2);
        if (y1 > y2) swap(y1, y2);
        return prefix[x2][y2] - prefix[x1 - 1][y2]
             - prefix[x2][y1 - 1] + prefix[x1 - 1][y1 - 1];
    }

    void buildPrefix(vector<vector<T>>& matrix) {
        for (int i = 1; i <= n; i++)
            for (int j = 1; j <= m; j++)
                prefix[i][j] = matrix[i - 1][j - 1]
                    + prefix[i][j - 1] + prefix[i - 1][j] - prefix[i - 1][j - 1];
    }

    void printPrefix() {
        for (int i = 1; i <= n; i++, cout << '\\n')
            for (int j = 1; j <= m; j++)
                cout << prefix[i][j] << ' ';
    }
};`)
    }]);
  }

  // ─── 5. Partial Sum 2D (Difference Array) ──────────────────────────
  const [part2d] = await db.insert(templates).values({
    title: "Partial Sum 2D (Difference Array)",
    slug: "partial-sum-2d",
    description: "2D difference array for O(1) range updates and O(n*m) final propagation",
    categoryId: categoryId,
    tags: ["partial-sum", "difference-array", "2d", "range-update", "offline"],
    complexity: "$O(1)$ per update, $O(n*m)$ propagation, $O(1)$ per query",
    notes: `# Partial Sum 2D (Difference Array)

A 2D difference array for batch rectangle updates ($O(1)$ each) followed by full propagation to compute the final grid.

## How It Works

### 1D Review

Add $k$ to every element in $[l, r]$: set $d[l] += k, \\; d[r+1] -= k$, then prefix-sum.

### 2D Extension

Add $k$ to rectangle $[x_1, y_1]$ to $[x_2, y_2]$ — mark four corners:

$$d[x_2][y_2] += k, \\quad d[x_2][y_1 - 1] -= k$$
$$d[x_1 - 1][y_2] -= k, \\quad d[x_1 - 1][y_1 - 1] += k$$

### Propagation

After all updates, sweep right-to-left then bottom-to-top:

1. Row-wise: $d[i][j] += d[i][j+1]$
2. Column-wise: $d[i][j] += d[i+1][j]$

Each cell now holds the total accumulated value.

## When to Use

- **Batch rectangle additions** then read final grid
- "How many rectangles cover cell $(x, y)$?"
- Overlapping range problems (sweep line alternative)

## Complexity

| Operation | Time |
|-----------|------|
| Update | $O(1)$ |
| Propagate | $O(n \cdot m)$ |
| Query (after propagate) | $O(1)$ |
| Space | $O(n \cdot m)$ |`,
  }).returning();
  if (part2d) {
    await db.insert(templateCodes).values([{
      templateId: part2d.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;

using ll = long long;

template <typename T = int>
struct PartialSum2D {
    vector<vector<T>> diff;
    int n, m;

    PartialSum2D(int N, int M) {
        n = N;
        m = M;
        diff.assign(n + 5, vector<T>(m + 5, 0));
    }

    void applyUpdate(int x1, int y1, int x2, int y2, T k = 1) {
        if (x1 > x2) swap(x1, x2);
        if (y1 > y2) swap(y1, y2);
        diff[x2][y2]     += k;
        diff[x2][y1 - 1] -= k;
        diff[x1 - 1][y2] -= k;
        diff[x1 - 1][y1 - 1] += k;
    }

    void propagate() {

        for (int i = n; i >= 0; i--)
            for (int j = m; j >= 0; j--)
                diff[i][j] += diff[i][j + 1];

        for (int i = n; i >= 0; i--)
            for (int j = m; j >= 0; j--)
                diff[i][j] += diff[i + 1][j];
    }

    T get(int x, int y) {
        return diff[x][y];
    }

    void print() {
        for (int i = 1; i <= n; i++, cout << '\\n')
            for (int j = 1; j <= m; j++)
                cout << diff[i][j] << ' ';
    }
};`)
    }]);
  }
}
