import { templates, templateCodes } from "../schema";
import { stripMain, type Db, type CatMap } from "./helpers";

export async function seedGraph(db: Db, catMap: CatMap) {
  const categoryId = catMap["graph"];
  if (!categoryId) return;

  // --- Graph Representation ---
  const [graphRep] = await db.insert(templates).values({
    title: "Graph Representation",
    slug: "graph-representation",
    description: "Linked-list (head array) adjacency — cache-friendly graph representation for contests",
    categoryId: categoryId,
    tags: ["graph", "adjacency-list", "linked-list", "representation"],
    complexity: "O(n+m) build, O(degree(u)) per neighbor iteration",
    notes: `# Graph Representation

Linked-list adjacency using a **head array** — fastest graph representation for CP. Nodes point to edge lists in a flat array: O(1) insertion, cache-friendly traversal, low overhead.

## When to Use

- **CP contests**: build and traverse graphs faster than \`vector<vector<>>\`
- **Memory-constrained**: exactly 2m edge slots, no wasted capacity
- **Need edge indices**: referencing specific edges (flow, matching)

## Complexity

| Operation | Time |
|-----------|------|
| \`init(n, m)\` | \`O(n + m)\` |
| \`addEdge\` | \`O(1)\` |
| Iterate neighbors | \`O(degree(u))\` |`,
  }).returning();
  if (graphRep) {
    await db.insert(templateCodes).values([{
      templateId: graphRep.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;

#define adjLoop(u, v, e) for(int e = head[u], v; ~e && (v = edges[e].to, 1); e = edges[e].nxt)

struct Edge {
    int to, nxt, cost;
    Edge(int TO = 0, int NXT = 0, int COST = 0) : to(TO), nxt(NXT), cost(COST) {}
};

int edgeCount;
vector<Edge> edges;
vector<int> head;

void init(int n, int m) {
    edges = vector<Edge>(2 * m + 5);
    head = vector<int>(n + 5, -1);
    edgeCount = 1;
}

void addEdge(int u, int v, int c = 0) {
    edges[edgeCount] = {v, head[u], c};
    head[u] = edgeCount++;
}

void addBiEdge(int u, int v, int c = 0) {
    addEdge(u, v, c);
    addEdge(v, u, c);
}`)
    }]);
  }

  // --- Dijkstra ---
  const [dijkstra] = await db.insert(templates).values({
    title: "Dijkstra's Algorithm",
    slug: "dijkstra",
    description: "Shortest path in non-negative weighted graphs using priority queue relaxation",
    categoryId: categoryId,
    tags: ["dijkstra", "shortest-path", "graph", "priority-queue"],
    complexity: "O((V+E) log V) with binary heap",
    notes: `# Dijkstra's Algorithm

Finds shortest paths from a single source in graphs with **non-negative** edge weights. Uses a min-priority queue to greedily extract the closest unvisited node and relax its neighbors. Fails with negative weights — use Bellman-Ford instead.

## When to Use

- **Shortest path**: single-source with non-negative weights
- **Grid/pathfinding**: 0-1 BFS is a special case (weights 0 or 1 only)
- **State-space search**: minimum cost/moves on implicit graphs

## Complexity

- **Time**: \`O((V + E) log V)\` with binary heap — **Space**: \`O(V + E)\``,
  }).returning();
  if (dijkstra) {
    await db.insert(templateCodes).values([{
      templateId: dijkstra.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;

using ll = long long;

template <typename T = int>
struct Dijkstra {
    struct Edge {
        T v, w;
        Edge(T V = 0, T W = 0) : v(V), w(W) {}
        bool operator<(const Edge& e) const { return w > e.w; }
    };

    vector<vector<Edge>> adj;

    Dijkstra(int edges, bool undirected = true) {
        adj = vector<vector<Edge>>(edges);
        for (int i = 0, u, v, w; i < edges; i++) {
            cin >> u >> v >> w;
            adj[u].push_back(Edge(v, w));
            if (undirected) adj[v].push_back(Edge(u, w));
        }
    }

    T minCost(int src, int dest) {
        int n = adj.size();
        vector<T> dist(n, numeric_limits<T>::max() / 2);
        dist[src] = 0;
        priority_queue<Edge> pq;
        pq.push(Edge(src, 0));
        while (!pq.empty()) {
            auto [u, cost] = pq.top(); pq.pop();
            for (auto& [v, w] : adj[u]) {
                if (dist[v] > dist[u] + w) {
                    dist[v] = dist[u] + w;
                    pq.push(Edge(v, dist[v]));
                }
            }
        }
        return (dist[dest] >= numeric_limits<T>::max() / 2 ? -1 : dist[dest]);
    }

    vector<T> getDist(int src) {
        int n = adj.size();
        vector<T> dist(n, numeric_limits<T>::max() / 2);
        dist[src] = 0;
        priority_queue<Edge> pq;
        pq.push(Edge(src, 0));
        while (!pq.empty()) {
            auto [u, cost] = pq.top(); pq.pop();
            for (auto& [v, w] : adj[u]) {
                if (dist[v] > dist[u] + w) {
                    dist[v] = dist[u] + w;
                    pq.push(Edge(v, dist[v]));
                }
            }
        }
        return dist;
    }
};`)
    }]);
  }

  // --- Floyd-Warshall ---
  const [floyd] = await db.insert(templates).values({
    title: "Floyd-Warshall",
    slug: "floyd-warshall",
    description: "All-pairs shortest paths — O(V³) dynamic programming on graph",
    categoryId: categoryId,
    tags: ["floyd-warshall", "all-pairs", "shortest-path", "dp", "graph"],
    complexity: "O(V³)",
    notes: `# Floyd-Warshall

All-pairs shortest path via DP. Works with negative weights (but not negative cycles). Recurrence: dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]). When to Use: small graphs (n ≤ 500), need all-pairs distances. Complexity: O(V³).

All-pairs shortest paths via O(V³) DP. Recurrence: \`dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])\` for each intermediate node k. Handles negative weights and detects negative cycles when \`dist[i][i] < 0\` after the algorithm completes.

## When to Use

- **All-pairs shortest paths**: need distances between every pair of nodes
- **Small dense graphs**: V ≤ 500 where O(V³) is feasible
- **Transitive closure**: replace min with OR and + with AND

## Complexity

- **Time**: \`O(V³)\` — **Space**: \`O(V²)\``,
  }).returning();
  if (floyd) {
    await db.insert(templateCodes).values([{
      templateId: floyd.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;

using ll = long long;

template <typename T = int, int Base = 0>
struct Floyd {
    int n;
    vector<vector<T>> dist;
    const T INF = numeric_limits<T>::max() / 2;

    Floyd(int _n = 0) : n(_n), dist(n + 5, vector<T>(n + 5, INF)) {
        for (int i = 1; i <= n; i++) dist[i][i] = 0;
    }

    Floyd(int _n, const vector<vector<T>>& D) : n(_n), dist(n + 5, vector<T>(n + 5, INF)) {
        for (int i = 1; i <= n; i++)
            for (int j = 1; j <= n; j++)
                dist[i][j] = D[i - !Base][j - !Base];
    }

    T operation(T a, T b) { return min(a, b); }

    void addEdge(int u, int v, T w) { dist[u][v] = operation(dist[u][v], w); }

    void build() {
        for (int k = 1; k <= n; k++)
            for (int u = 1; u <= n; u++)
                for (int v = 1; v <= n; v++)
                    updateDist(u, v, k);
    }

    T getDist(int u, int v) { return dist[u][v]; }

    void updateDist(int u, int v, int a, int b) {
        dist[u][v] = operation(dist[u][v], dist[u][a] + dist[a][b] + dist[b][v]);
    }

    void updateDist(int u, int v, int k) {
        dist[u][v] = operation(dist[u][v], dist[u][k] + dist[k][v]);
    }
};`)
    }]);
  }

  // --- LCA ---
  const [lca] = await db.insert(templates).values({
    title: "LCA — Lowest Common Ancestor",
    slug: "lca",
    description: "Binary lifting for LCA, distance, and k-th ancestor queries on unweighted trees",
    categoryId: categoryId,
    tags: ["lca", "lowest-common-ancestor", "binary-lifting", "tree"],
    complexity: "O(n log n) build, O(log n) per query",
    notes: `# Lowest Common Ancestor (Binary Lifting)

Lowest Common Ancestor using binary lifting preprocessing. Answers LCA queries in O(log n) after O(n log n) preprocessing. When to Use: tree path queries, distance between nodes.

Finds the lowest common ancestor of two nodes in a tree using **binary lifting**. Also supports distance and k-th ancestor queries.

## How It Works

### Preprocessing

1. Run DFS from root to compute \`depth[u]\` and \`anc[u][0]\` (direct parent)
2. For each \`j = 1, 2, ..., LOG\`:

$$\\text{anc}[v][j] = \\text{anc}[\\text{anc}[v][j-1]][j-1]$$

This means: "the \`2^j\`-th ancestor of \`v\` is the \`2^{j-1}\`-th ancestor of the \`2^{j-1}\`-th ancestor of \`v\`."

### LCA Query

1. **Equalize depths**: lift the deeper node up by \`depth[u] - depth[v]\` steps using binary decomposition
2. **Binary search**: from highest bit to lowest, if \`anc[u][bit] ≠ anc[v][bit]\`, lift both
3. **Result**: \`anc[u][0]\` is the LCA

### K-th Ancestor

Decompose \`k\` into binary: for each set bit \`bit\`, jump \`u = anc[u][bit]\`.

## When to Use

- **Tree distance**: \`dist(u,v) = depth[u] + depth[v] - 2*depth[lca(u,v)]\`
- **Path queries**: combine with LCA Weighted for sum/max on paths
- **Ancestor checks**: \`isAncestor(u, v)\` via depth comparison
- **Tree problems**: any problem requiring path or ancestor information
- **K-th on path**: find k-th node on path u→v

## Edge Cases

- **Same node**: \`lca(u, u) = u\`, \`dist(u, u) = 0\`
- **Root queries**: \`lca(root, u) = root\`
- **Deep chains**: LOG = ⌈log₂(n)⌉ must be large enough
- **Single node tree**: no queries valid
- **Unrooted tree**: pick any node as root (typically node 1)

## Complexity

| Phase | Time |
|-------|------|
| DFS preprocessing | \`O(n)\` |
| Binary lifting table | \`O(n log n)\` |
| \`getLca\` query | \`O(log n)\` |
| \`getDist\` query | \`O(log n)\` |
| \`kthAncestor\` query | \`O(log n)\` |

Space: \`O(n log n)\`

## Usage

\`\`\`cpp
vector<vector<int>> adj(n + 1);
// build adjacency...
LCA lca(n, adj, 1);
cout << lca.getLca(3, 7);       // LCA of 3 and 7
cout << lca.getDist(3, 7);      // distance between 3 and 7
cout << lca.kthAncestor(5, 2);  // 2nd ancestor of node 5
\`\`\`

For **weighted trees** with path sum/max queries, use the \`LCA Weighted\` template.`,
  }).returning();
  if (lca) {
    await db.insert(templateCodes).values([{
      templateId: lca.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;

template <typename vecType = int>
class LCA {
public:

    LCA(int n = 0, const vector<vector<int>>& G = {}, int root = 1)
        : N(n), LOG(0), ROOT(root), adj(G) {
        while ((1 << LOG) <= N) LOG++;
        anc.assign(N + 5, vector<int>(LOG));
        depth.assign(N + 5, 0);
        dfs(ROOT);
    }

    int kthAncestor(int u, int k) const {
        if (depth[u] < k) return -1;
        for (int bit = 0; bit < LOG; bit++)
            if (k & (1 << bit)) u = anc[u][bit];
        return u;
    }

    int getLca(int u, int v) const {
        if (depth[u] < depth[v]) swap(u, v);
        u = kthAncestor(u, depth[u] - depth[v]);
        if (u == v) return u;
        for (int bit = LOG - 1; bit >= 0; bit--)
            if (anc[u][bit] != anc[v][bit])
                u = anc[u][bit], v = anc[v][bit];
        return anc[u][0];
    }

    int getDist(int u, int v) const {
        return depth[u] + depth[v] - 2 * depth[getLca(u, v)];
    }

private:
    int N, LOG, ROOT;
    const vector<vector<int>>& adj;
    vector<vector<int>> anc;
    vector<int> depth;

    void dfs(int u, int p = 0) {
        for (int v : adj[u]) {
            if (v == p) continue;
            depth[v] = depth[u] + 1;
            anc[v][0] = u;
            for (int bit = 1; bit < LOG; bit++)
                anc[v][bit] = anc[anc[v][bit - 1]][bit - 1];
            dfs(v, u);
        }
    }
};`)
    }]);
  }

  // --- Tarjan ---
  const [tarjan] = await db.insert(templates).values({
    title: "Tarjan's Algorithm",
    slug: "tarjan",
    description: "SCC decomposition, bridges, and articulation points in a single O(V+E) DFS pass",
    categoryId: categoryId,
    tags: ["tarjan", "scc", "bridges", "articulation-points", "graph", "strongly-connected"],
    complexity: "O(V+E)",
    notes: `# Tarjan's Algorithm (SCC, Bridges, Articulation Points)

Finds bridges and articulation points using DFS low-link values. Also works for SCCs. When to Use: bridge detection, articulation point identification, SCC computation. Complexity: O(V + E).

Finds **Strongly Connected Components**, **bridges**, and **articulation points** in a single DFS pass.

## How It Works

### Core Concepts

Every node \`u\` gets two values during DFS:

- **Discovery time** \`disc[u]\`: when \`u\` was first visited
- **Low-link value** \`low[u]\`: the smallest discovery time reachable from the subtree rooted at \`u\`, including back edges

### DFS Rules

For each neighbor \`v\` of \`u\`:

1. **Tree edge** (\`v\` unvisited): recurse into \`v\`, then update:

$$\\text{low}[u] = \\min(\\text{low}[u],\\; \\text{low}[v])$$

2. **Back edge** (\`v\` visited and in stack): update:

$$\\text{low}[u] = \\min(\\text{low}[u],\\; \\text{disc}[v])$$

### SCC Detection

When \`low[u] == disc[u]\`, node \`u\` is the root of an SCC. Pop the stack until \`u\` to get all nodes in the component.

### Bridge Detection

Edge \`(u, v)\` is a bridge if:

$$\\text{low}[v] > \\text{disc}[u]$$

This means \`v\`'s subtree cannot reach \`u\` or above without edge \`(u, v)\`.

### Articulation Point Detection

Node \`u\` is an articulation point if:

- **Root**: has ≥ 2 children in DFS tree
- **Non-root**: has a child \`v\` with \`low[v] ≥ disc[u]\`

## When to Use

- **SCC condensation**: compress SCCs into a DAG for 2-SAT, reachability
- **2-SAT**: Tarjan SCC on implication graph
- **Bridge finding**: critical edges whose removal disconnects the graph
- **Articulation points**: critical nodes whose removal disconnects the graph
- **Network reliability**: identify single points of failure

## Edge Cases

- **Disconnected graph**: run DFS from every unvisited node
- **Self-loops**: handled (back edge to self is ignored via parent check)
- **Multi-edges**: parallel edges are not bridges (back edge keeps low small)
- **Single node**: forms its own SCC, no bridges/articulation points
- **Complete graph**: one SCC, no bridges, no articulation points

## Complexity

| Operation | Time |
|-----------|------|
| SCC decomposition | \`O(V + E)\` |
| Bridge detection | \`O(V + E)\` |
| Articulation points | \`O(V + E)\` |
| **Total** | \`O(V + E)\` |

Space: \`O(V + E)\`

## Usage

\`\`\`cpp
Tarjan t(n);
for (int i = 0; i < m; i++) {
    int u, v; cin >> u >> v;
    t.addEdge(u, v, true);  // directed edge
}
t.run();
cout << t.getComponents().size();         // number of SCCs
for (auto& [u, v] : t.getBridges())
    cout << u << " " << v << "\\n";       // bridge edges
\`\`\``,
  }).returning();
  if (tarjan) {
    await db.insert(templateCodes).values([{
      templateId: tarjan.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;

class Tarjan {
public:

    Tarjan(int n) { init(n); }

    void addEdge(int u, int v, bool isDirected = false) {
        adj[u].push_back(v);
        if (!isDirected) adj[v].push_back(u);
    }

    void run() {
        for (int i = 0; i < (int)adj.size(); ++i)
            if (nodeIdx[i] == -1) dfs(i);
    }

    set<int> getArticulationPoints() { return artPoints; }

    vector<pair<int, int>> getBridges() { return bridges; }

    bool isArticulationPoint(int u) { return artPoints.find(u) != artPoints.end(); }

    bool isBridge(int u, int v) {
        return find(bridges.begin(), bridges.end(), make_pair(u, v)) != bridges.end()
            || find(bridges.begin(), bridges.end(), make_pair(v, u)) != bridges.end();
    }

    vector<vector<int>> getComponents() { return comps; }

private:
    int timer;
    vector<vector<int>> adj, comps;
    vector<int> lowLink, nodeIdx, compIdx;
    vector<bool> inStack;
    stack<int> stk;
    vector<pair<int, int>> bridges;
    set<int> artPoints;

    void init(int n) {
        timer = 0;
        adj.assign(n + 5, vector<int>());
        lowLink.assign(n + 5, -1);
        nodeIdx.assign(n + 5, -1);
        compIdx.assign(n + 5, -1);
        inStack.assign(n + 5, false);
        comps.clear();
        while (!stk.empty()) stk.pop();
    }

    void dfs(int u, int parent = -1) {
        lowLink[u] = nodeIdx[u] = timer++;
        inStack[u] = true;
        stk.push(u);
        int childCount = 0;
        for (int v : adj[u]) {
            if (v == parent) continue;
            if (nodeIdx[v] == -1) {
                dfs(v, u);
                lowLink[u] = min(lowLink[u], lowLink[v]);

                if (lowLink[v] == nodeIdx[v])
                    bridges.emplace_back(u, v);

                if (parent != -1 && lowLink[v] >= nodeIdx[u])
                    artPoints.insert(u);
                ++childCount;
            } else if (inStack[v]) {

                lowLink[u] = min(lowLink[u], nodeIdx[v]);
            }
        }

        if (parent == -1 && childCount > 1)
            artPoints.insert(u);

        if (lowLink[u] == nodeIdx[u]) {
            comps.emplace_back();
            int v;
            do {
                v = stk.top(); stk.pop();
                inStack[v] = false;
                comps.back().push_back(v);
                compIdx[v] = comps.size() - 1;
            } while (v != u);
        }
    }
};`)
    }]);
  }

  // --- Bellman-Ford ---
  const [bellman] = await db.insert(templates).values({
    title: "Bellman-Ford",
    slug: "bellman-ford",
    description: "Shortest path with negative edge weights + negative cycle detection in O(V·E)",
    categoryId: categoryId,
    tags: ["bellman-ford", "shortest-path", "negative-cycle", "graph"],
    complexity: "O(V·E)",
    notes: `# Bellman-Ford

Single-source shortest path supporting **negative edge weights**. Relaxes all edges V-1 times — each round guarantees correctness for paths with one more edge. Run one extra pass to detect negative cycles (any distance still improving indicates a cycle).

## When to Use

- **Negative weights**: currency exchange, arbitrage detection
- **Negative cycle detection**: identify profitable cycles in constraint graphs
- **Difference constraints**: systems of \`x_v - x_u ≤ w\` (SPFA queue variant is faster in practice)

## Complexity

- **Time**: \`O(V · E)\` — **Space**: \`O(V + E)\``,
  }).returning();
  if (bellman) {
    await db.insert(templateCodes).values([{
      templateId: bellman.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;

using ll = long long;

template <typename T = int>
struct BellmanFord {
    struct Edge {
        int u, v;
        T w;
        Edge(int _u = 0, int _v = 0, T _w = 0) : u(_u), v(_v), w(_w) {}
        friend istream& operator>>(istream& in, Edge& e) {
            in >> e.u >> e.v >> e.w;
            return in;
        }

        void inv() { w *= -1; }
    };

    int n, m, src, dest;
    vector<Edge> edges;
    T DEFAULT;
    vector<T> dist;

    BellmanFord(int _n = 0, int _m = 0, int _src = 1, int _dest = 1) {
        n = _n; m = _m; src = _src; dest = _dest;
        DEFAULT = numeric_limits<T>::max() / 2;
        dist.assign(n + 5, DEFAULT);
        edges.resize(m);
    }

    void readEdges() { cin >> edges; }

    void addEdge(int u, int v, T w) { edges.emplace_back(u, v, w); }

    void build() {
        dist[src] = 0;
        for (int i = 0; i < n; i++)
            for (auto& [u, v, w] : edges)
                if (dist[u] < DEFAULT)
                    dist[v] = min(dist[v], dist[u] + w);
    }

    bool hasNegativeCycle() {
        for (auto& [u, v, w] : edges)
            if (dist[u] < DEFAULT && dist[v] > dist[u] + w)
                return true;
        return false;
    }

    T getDist(int u) { return dist[u]; }

    T getMinDist() { return *min_element(dist.begin(), dist.end()); }
};`)
    }]);
  }

  // --- Graph Traversal (DFS & BFS) ---
  const [graphTraversal] = await db.insert(templates).values({
    title: "Graph Traversal",
    slug: "graph-traversal",
    description: "DFS & BFS on adjacency list graphs with bipartite check, cycle detection, and topological sort",
    categoryId: categoryId,
    tags: ["graph", "dfs", "bfs", "traversal", "bipartite", "cycle-detection"],
    complexity: "O(V+E)",
    notes: `# Graph Traversal (DFS & BFS)

BFS and DFS implementations with adjacency list. BFS for shortest paths in unweighted graphs, DFS for connectivity and cycle detection. When to Use: basic graph exploration. Complexity: O(V + E).

Fundamental graph data structure with **Depth-First Search** and **Breadth-First Search** traversals.

## How It Works

### DFS (Depth-First Search)

Explores each branch fully before backtracking (stack/recursion).

\`\`\`
DFS(u):
  mark u visited
  for each neighbor v of u:
    if v not visited: DFS(v)
\`\`\`

**DFS tree property**: edges form a spanning tree (or forest). Tree edges go to unvisited nodes; back edges go to ancestors.

### BFS (Breadth-First Search)

Explores nodes level by level using a queue. Guarantees shortest path in **unweighted** graphs.

\`\`\`
BFS(src):
  queue = {src}, dist[src] = 0
  while queue not empty:
    u = dequeue
    for each neighbor v of u:
      if v not visited: enqueue(v), dist[v] = dist[u] + 1
\`\`\`

### Bipartite Check (2-Coloring)

BFS/DFS coloring: assign alternating colors. If a neighbor has the same color, graph is **not** bipartite (contains odd cycle).

$$\\text{color}[v] = -\\text{color}[u] \\quad \\text{for tree edges } (u,v)$$

### Cycle Detection (Undirected)

DFS with parent tracking: if you visit a node that's already visited and isn't the parent, a cycle exists.

### Topological Sort (Kahn's Algorithm)

1. Compute in-degrees
2. Enqueue all nodes with in-degree 0
3. Process queue: dequeue \`u\`, add to order, decrement in-degrees of neighbors
4. If order size ≠ \`V\`, graph has a cycle

## When to Use

- **Connectivity**: DFS/BFS to check if graph is connected
- **Shortest path (unweighted)**: BFS gives minimum hops
- **Cycle detection**: DFS with parent or color tracking
- **Topological sort**: scheduling tasks with dependencies
- **Bipartite check**: 2-coloring via BFS/DFS
- **Connected components**: run DFS from each unvisited node

## Edge Cases

- **Disconnected graph**: loop over all nodes, start DFS/BFS from unvisited ones
- **Self-loops**: cycle detection finds them (neighbor == self, not parent)
- **Directed vs undirected**: cycle detection differs (need \`vis[]\` color states for directed)
- **Single node**: trivially connected, bipartite, acyclic
- **DAG**: topological sort succeeds; BFS/DFS traverse all nodes

## Complexity

| Operation | Time |
|-----------|------|
| DFS / BFS | \`O(V + E)\` |
| Bipartite check | \`O(V + E)\` |
| Cycle detection | \`O(V + E)\` |
| Topological sort | \`O(V + E)\` |

Space: \`O(V + E)\`

## Usage

\`\`\`cpp
Graph g(n, m);
g.buildAdj(false);  // undirected
g.dfs(1);           // DFS from node 1
int dist = g.bfs(1, n);  // shortest path 1→n
bool bip = g.isBipartite();
\`\`\``,
  }).returning();
  if (graphTraversal) {
    await db.insert(templateCodes).values([{
      templateId: graphTraversal.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;

using ll = long long;

struct Graph {
    int n, m;
    vector<vector<int>> adj;
    vector<bool> vis;
    vector<int> depth, parent, deg, colour;

    Graph(int N, int M) : n(N), m(M) {
        adj.assign(n + 10, vector<int>());
        vis.assign(n + 10, false);
        depth.assign(n + 10, 0);
        deg.assign(n + 10, 0);
        colour.assign(n + 10, 0);
        parent.assign(n + 10, -1);
    }

    void addEdge(int u, int v, bool isDirected = false) {
        adj[u].push_back(v); deg[u]++;
        if (!isDirected) { adj[v].push_back(u); deg[v]++; }
    }

    void buildAdj(bool isDirected = false) {
        for (int i = 0, u, v; i < m && cin >> u >> v; i++)
            addEdge(u, v, isDirected);
    }

    void dfs(int node, int dep = 0, int par = -1) {
        vis[node] = true;
        parent[node] = par;
        depth[node] = dep;
        for (auto& nxt : adj[node])
            if (!vis[nxt]) dfs(nxt, dep + 1, node);
    }

    int bfs(int from, int to) {
        if (from == to) return 0;
        queue<int> q;
        depth.assign(n + 10, 1e9);
        vis[from] = true;
        depth[from] = 0;
        q.push(from);
        while (!q.empty()) {
            int u = q.front(); q.pop();
            for (auto& v : adj[u]) {
                if (!vis[v]) {
                    q.push(v);
                    parent[v] = u;
                    depth[v] = depth[u] + 1;
                    vis[v] = true;
                }
            }
        }
        return depth[to] >= 1e9 ? -1 : depth[to];
    }

    bool isBipartite() {
        fill(colour.begin(), colour.end(), 0);
        for (int i = 1; i <= n; i++) {
            if (colour[i] == 0) {
                queue<int> q;
                q.push(i);
                colour[i] = 1;
                while (!q.empty()) {
                    int u = q.front(); q.pop();
                    for (auto& v : adj[u]) {
                        if (colour[v] == 0) {
                            colour[v] = -colour[u];
                            q.push(v);
                        } else if (colour[v] == colour[u]) {
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    }

    bool hasCycle(int node, int par = -1) {
        vis[node] = true;
        for (auto& nxt : adj[node]) {
            if (!vis[nxt]) {
                if (hasCycle(nxt, node)) return true;
            } else if (nxt != par) {
                return true;
            }
        }
        return false;
    }

    void getPath(int node) {
        if (parent[node] == -1) return;
        cout << node << " ";
        getPath(parent[node]);
    }

    void topologicalSort() {
        queue<int> topo;
        vector<int> order;
        vector<int> tmp = deg;
        for (int i = 1; i <= n; i++)
            if (tmp[i] == 0) topo.push(i);
        while (!topo.empty()) {
            int u = topo.front(); topo.pop();
            order.push_back(u);
            for (auto& v : adj[u]) {
                tmp[v]--;
                if (tmp[v] == 0) topo.push(v);
            }
        }
        for (auto& x : order) cout << x << ' ';
    }
};`)
    }]);
  }

  // --- Prim's MST ---
  const [prim] = await db.insert(templates).values({
    title: "Prim's MST",
    slug: "prim-mst",
    description: "Minimum spanning tree using priority queue — greedy cut-based approach",
    categoryId: categoryId,
    tags: ["prim", "mst", "minimum-spanning-tree", "graph", "priority-queue"],
    complexity: "O((V+E) log V) with binary heap",
    notes: `# Prim's Algorithm — Minimum Spanning Tree

Finds a **minimum spanning tree** (MST) for a weighted undirected graph using a priority queue.

## How It Works

### Algorithm (Greedy Cut Property)

1. Start from an arbitrary root node
2. Maintain a set of nodes in the MST (\`marked[]\`)
3. Use a min-priority queue of edges connecting tree to non-tree nodes
4. Pop the cheapest edge \`(u, v, w)\`:
   - If \`v\` is already marked, skip (already in MST)
   - Otherwise, add \`v\` to MST, add \`w\` to total cost
5. Push all edges from \`v\` to unmarked neighbors
6. Repeat until all nodes are in MST

### Cut Property (Why It Works)

For any cut (partition of vertices into two sets), the minimum weight edge crossing the cut is in some MST. Prim's greedily picks the cheapest crossing edge at each step.

$$\\text{cost}(T) = \\sum_{e \\in T} w(e) \\quad \\text{(minimum among all spanning trees)}$$

### Prim vs Kruskal

| | Prim | Kruskal |
|---|---|---|
| Approach | Grow from root | Sort edges, merge |
| Best for | Dense graphs | Sparse graphs |
| Time | \`O((V+E) log V)\` | \`O(E log E)\` |
| Data structure | Priority queue | Union-Find |

## When to Use

- **Network design**: minimal cost to connect all nodes
- **Clustering**: MST-based hierarchical clustering
- **TSP approximation**: MST gives 2-approximation for metric TSP
- **Dense graphs**: Prim is faster than Kruskal when \`E ≈ V²\`

## Edge Cases

- **Disconnected graph**: Prim builds MST of the component containing the root; some nodes unreachable
- **Equal weights**: multiple valid MSTs; Prim picks one arbitrarily
- **Single node**: MST cost = 0, no edges
- **Self-loops**: ignored (already marked)
- **Negative weights**: MST still valid (unlike shortest path algorithms)
- **No edges**: only single-node MSTs possible

## Complexity

| Phase | Time |
|-------|------|
| Build adjacency | \`O(E)\` |
| Main loop | \`O((V + E) log V)\` |
| **Total** | \`O((V + E) log V)\` |

Space: \`O(V + E)\`

## Usage

\`\`\`cpp
Prim<long long> prim(n);
prim.buildAdj(m);
long long cost = prim.getCost(1);  // MST cost from root 1
\`\`\``,
  }).returning();
  if (prim) {
    await db.insert(templateCodes).values([{
      templateId: prim.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;

using ll = long long;

template <typename T = int>
struct Prim {
    struct Edge {
        T v, w;
        Edge(T V = 0, T W = 0) : v(V), w(W) {}
        bool operator<(const Edge& e) const { return w > e.w; }
    };

    vector<vector<Edge>> adj;
    vector<bool> marked;

    Prim(int n = 0) {
        adj = vector<vector<Edge>>(n + 10);
        marked = vector<bool>(n + 10, false);
    }

    void addEdge(int u, int v, T w, bool isDirected = false) {
        adj[u].push_back(Edge(v, w));
        if (!isDirected) adj[v].push_back(Edge(u, w));
    }

    void buildAdj(int edges, bool isDirected = false) {
        for (int i = 0, u, v, w; i < edges && cin >> u >> v >> w; i++)
            addEdge(u, v, w, isDirected);
    }

    T getCost(int root) {
        T cost = 0;
        priority_queue<Edge> pq;
        pq.push(Edge(root, 0));
        while (!pq.empty()) {
            auto [u, currCost] = pq.top(); pq.pop();
            if (marked[u]) continue;
            marked[u] = true;
            cost += currCost;
            for (auto& [v, w] : adj[u])
                if (!marked[v]) pq.push(Edge(v, w));
        }
        return cost;
    }
};`)
    }]);
  }

  // --- Centroid Decomposition ---
  const [centroid] = await db.insert(templates).values({
    title: "Centroid Decomposition",
    slug: "centroid-decomposition",
    description: "Divide-and-conquer on trees via centroid selection — O(n log n) decomposition",
    categoryId: categoryId,
    tags: ["centroid", "decomposition", "tree", "divide-conquer"],
    complexity: "O(n log n)",
    notes: `# Centroid Decomposition

Divide-and-conquer on trees by recursively splitting at the **centroid** — a node whose largest subtree ≤ n/2. Process all paths through the centroid, then recurse on remaining components. Height is O(log n).

## When to Use

- **Path counting**: "paths with property P" — reduces O(n²) brute force to O(n log n)
- **Distance queries**: aggregate distances from centroid to subtree nodes
- **Tree problems**: any O(n²) tree problem → O(n log n) via decomposition

## Complexity

- **Time**: \`O(n log n)\` — O(n) per level × O(log n) levels — **Space**: \`O(n)\``,
  }).returning();
  if (centroid) {
    await db.insert(templateCodes).values([{
      templateId: centroid.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;

template <typename T = int>
struct CentroidDecomposition {
    int n, treeRoot;
    const vector<vector<T>>& adj;
    vector<T> subtreeSz, isCentroid;

    CentroidDecomposition(int N, const vector<vector<T>>& G, int Root = 1) : adj(G) {
        n = N;
        treeRoot = Root;
        subtreeSz = isCentroid = vector<T>(n + 5, 0);
    }

    int updateSize(int u, int p = -1) {
        subtreeSz[u] = 1;
        for (int v : adj[u])
            if (v != p && !isCentroid[v])
                subtreeSz[u] += updateSize(v, u);
        return subtreeSz[u];
    }

    int getCentroid(int u, int target, int p = -1) {
        for (auto& v : adj[u]) {
            if (v == p || isCentroid[v]) continue;
            if (subtreeSz[v] * 2 > target)
                return getCentroid(v, target, u);
        }
        return u;
    }

    void decompose(int u = -1) {
        if (u == -1) u = treeRoot;
        int centroid = getCentroid(u, updateSize(u));

        isCentroid[centroid] = true;
        for (auto& v : adj[centroid])
            if (!isCentroid[v]) decompose(v);
    }
};`)
    }]);
  }

  // --- LCA Weighted ---
  const [lcaWeighted] = await db.insert(templates).values({
    title: "LCA Weighted",
    slug: "lca-weighted",
    description: "LCA with path aggregate queries (sum/max/min) on weighted trees in O(log n)",
    categoryId: categoryId,
    tags: ["lca", "lowest-common-ancestor", "binary-lifting", "weighted-tree", "path-query"],
    complexity: "O(n log n) build, O(log n) per query",
    notes: `# LCA on Weighted Trees

Binary lifting for LCA with **path aggregates** (sum, max, min) on weighted trees. Each ancestor entry stores the 2^j-th ancestor and the aggregate of edge weights along that jump.

## When to Use

- **Path sum/max/min**: aggregate edge weights on path u→v in O(log n)
- **Bottleneck edges**: max/min edge on path (MST verification)
- **Custom aggregates**: any associative operation — GCD, XOR, etc.

## Complexity

- **Build**: \`O(n log n)\` — **Query**: \`O(log n)\` — **Space**: \`O(n log n)\``,
  }).returning();
  if (lcaWeighted) {
    await db.insert(templateCodes).values([{
      templateId: lcaWeighted.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;

using ll = long long;

template <typename treeType = int, typename graphType = int>
class LCAWeighted {
public:

    LCAWeighted(int n = 0,
        const vector<vector<pair<int, graphType>>>& G = {},
        function<treeType(treeType, treeType)> op = [](treeType a, treeType b){ return a + b; },
        treeType _neutral = treeType(), int root = 1)
        : N(n), LOG(0), ROOT(root), adj(G), operation(op), neutral(_neutral) {
        while ((1 << LOG) <= N) LOG++;
        anc.assign(N + 5, vector<int>(LOG));
        cost.assign(N + 5, vector<treeType>(LOG, neutral));
        depth.assign(N + 5, 0);
        dfs(ROOT);
    }

    int kthAncestor(int u, int k) const {
        if (depth[u] < k) return -1;
        for (int bit = 0; bit < LOG; bit++)
            if (k & (1 << bit)) u = anc[u][bit];
        return u;
    }

    int getLca(int u, int v) const {
        if (depth[u] < depth[v]) swap(u, v);
        u = kthAncestor(u, depth[u] - depth[v]);
        if (u == v) return u;
        for (int bit = LOG - 1; bit >= 0; bit--)
            if (anc[u][bit] != anc[v][bit])
                u = anc[u][bit], v = anc[v][bit];
        return anc[u][0];
    }

    treeType query(int u, int v) const {
        int l = getLca(u, v);
        return operation(getCost(u, depth[u] - depth[l]), getCost(v, depth[v] - depth[l]));
    }

    int getDist(int u, int v) const {
        int l = getLca(u, v);
        return depth[u] + depth[v] - 2 * depth[l];
    }

private:
    int N, LOG, ROOT;
    const vector<vector<pair<int, graphType>>>& adj;
    vector<vector<int>> anc;
    vector<vector<treeType>> cost;
    vector<int> depth;
    function<treeType(treeType, treeType)> operation;
    treeType neutral;

    void dfs(int u, int p = 0) {
        for (auto& [v, w] : adj[u]) {
            if (v == p) continue;
            depth[v] = depth[u] + 1;
            anc[v][0] = u;
            cost[v][0] = treeType(w);
            for (int bit = 1; bit < LOG; bit++) {
                anc[v][bit] = anc[anc[v][bit - 1]][bit - 1];
                cost[v][bit] = operation(cost[v][bit - 1], cost[anc[v][bit - 1]][bit - 1]);
            }
            dfs(v, u);
        }
    }

    treeType getCost(int u, int dist) const {
        treeType ret = neutral;
        for (int bit = 0; bit < LOG; bit++) {
            if (dist & (1 << bit)) {
                ret = operation(ret, cost[u][bit]);
                u = anc[u][bit];
            }
        }
        return ret;
    }
};`)
    }]);
  }

  // --- Kuhn's Matching ---
  const [kuhn] = await db.insert(templates).values({
    title: "Kuhn's Matching",
    slug: "kuhn-matching",
    description: "Maximum bipartite matching via augmenting paths in O(V·E)",
    categoryId: categoryId,
    tags: ["kuhn", "bipartite", "matching", "augmenting-path", "graph"],
    complexity: "O(V·E) worst-case, fast in practice",
    notes: `# Kuhn's Algorithm — Maximum Bipartite Matching

Finds maximum cardinality matching in a bipartite graph using **augmenting paths**.

## How It Works

### Definitions

- **Matching**: set of edges with no shared vertices
- **Augmenting path**: path from unmatched left to unmatched right, alternating between unmatched/matched edges
- **Maximum matching**: matching with the most edges

### Algorithm

For each left-side vertex \`u\`:

1. Try to find an augmenting path from \`u\` via DFS
2. For each neighbor \`v\`:
   - If \`v\` is unmatched → match \`u\` with \`v\`, success
   - If \`v\` is matched to \`u'\`, try to find alternative for \`u'\` recursively
3. If augmenting path found, **flip** matched/unmatched edges along the path

### Why It Works (Berger's Lemma / König's Theorem)

An augmenting path increases matching size by 1. By Berge's lemma, a matching is maximum iff no augmenting path exists.

**König's theorem**: In bipartite graphs, max matching = min vertex cover.

### Time Complexity

Each DFS attempt is \`O(E)\` in the worst case. We run it for each left vertex, giving \`O(V · E)\`.

## When to Use

- **Assignment problems**: assign workers to tasks minimally
- **Task scheduling**: maximum number of non-conflicting assignments
- **Minimum vertex cover**: via König's theorem, construct from unmatched left + reachable nodes
- **Maximum independent set**: complement of minimum vertex cover in bipartite graphs
- **Bipartite problems**: any problem reducible to maximum matching

## Edge Cases

- **Empty graph**: matching size = 0
- **Complete bipartite K(a,b)**: matching size = min(a, b)
- **Isolated nodes**: unmatched, don't affect result
- **Multi-edges**: handled (duplicate edges are redundant)
- **Self-loops**: invalid in bipartite graph; should not be added
- **Unbalanced sides**: left side may be smaller; algorithm handles this

## Complexity

| Phase | Time |
|-------|------|
| Per left vertex DFS | \`O(E)\` worst case |
| Total | \`O(V · E)\` worst case |
| **Practical** | Much faster due to early termination |

Space: \`O(V + E)\`

## Usage

\`\`\`cpp
vector<vector<int>> adj(n + 1);
adj[1] = {2, 3};
adj[2] = {3};
Kuhn<int, 1> kuhn(n, m, adj);
int maxMatch = kuhn.maxMatch();
\`\`\`

\`Base\` template parameter: 1 for 1-indexed input (default), 0 for 0-indexed.`,
  }).returning();
  if (kuhn) {
    await db.insert(templateCodes).values([{
      templateId: kuhn.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;

template <typename T = int, int Base = 1>
struct Kuhn {
    int n, m;
    vector<vector<T>> adj;
    vector<T> matching, vis;

    Kuhn(int N, int M, const vector<vector<T>>& G) : n(N), m(M), adj(G) {
        matching = vector<T>(m + 5, -1);
        vis = vector<T>(n + 5, 0);
    }

    bool match(int u, int& cur) {
        if (vis[u] == cur) return false;
        vis[u] = cur;
        for (auto& v : adj[u])
            if (matching[v] == -1 || match(matching[v], cur))
                return matching[v] = u, true;
        return false;
    }

    T maxMatch() {
        T cur = 1;
        for (int i = Base; i < n + Base; i++, cur++)
            match(i, cur);
        T ans = 0;
        for (int i = Base; i < m + Base; i++)
            ans += (matching[i] != -1);
        return ans;
    }
};`)
    }]);
  }

  // --- Link Cut Tree ---
  const [lct] = await db.insert(templates).values({
    title: "Link Cut Tree",
    slug: "link-cut-tree",
    description: "Dynamic tree connectivity with path queries — link, cut, and aggregate in O(log n) amortized",
    categoryId: categoryId,
    tags: ["lct", "link-cut", "dynamic-tree", "path-query", "splay"],
    complexity: "O(log n) amortized per operation",
    notes: `# Link-Cut Tree (LCT)

Dynamic tree data structure supporting **link**, **cut**, and **path aggregate** queries in O(log n) amortized time.

## How It Works

### Splay Tree + Preferred Paths

A Link-Cut Tree represents a forest using:

1. **Splay trees**: each splay tree represents a **preferred path** in the original tree
2. **Parent pointers**: connect splay trees (virtual edges between paths)
3. **Expose operation**: makes the path from root to a node a single splay tree

### Key Operations

#### \`expose(x)\`

Makes the path from root to \`x\` a single preferred path (single splay tree):

\`\`\`
for (p = 0; x; p = x, x = parent(x)) {
    splay(x);
    // detach right child, attach p as right child
    right(x) = p;
    update(x);
}
\`\`\`

After expose, \`x\` is the root of its splay tree, and the entire root→x path is in the splay tree.

#### \`makeRoot(x)\`

Makes \`x\` the root of its tree:

1. \`expose(x)\` — bring root→x path to splay tree
2. \`splay(x)\` — x becomes splay root
3. **Reverse** the path (swap left/right children, negate subtree aggregate)

#### \`link(x, y)\`

Add edge between \`x\` and \`y\`:

1. \`makeRoot(x)\) — make x the root
2. If \`x\` and \`y\` are already connected, this creates a cycle (check first!)
3. Set \`parent(x) = y\`

#### \`cut(x, y)\`

Remove edge between \`x\` and \`y\`:

1. \`makeRoot(x)\)
2. \`expose(y)\)
3. Now \`x\` should be \`y\`'s left child with no further children
4. Detach: \`left(y) = parent(x) = 0\`

### Amortized Analysis

Each operation involves \`O(log n)\) splay tree operations. By the potential method, splay operations are \`O(log n)\` amortized.

$$\\hat{\\Phi} = \\sum_{x} \\log(\\text{size of splay subtree of } x)$$

## When to Use

- **Dynamic connectivity**: check if two nodes are connected as edges are added/removed
- **Dynamic MST**: maintain minimum spanning tree with edge insertions/deletions
- **Path queries on changing trees**: sum/max/min on root-to-node paths
- **Euler tour trees**: LCT is an alternative to Euler tour trees
- **Network flow**: dynamic graph connectivity in flow networks

## Edge Cases

- **Already connected**: \`link\` would create a cycle — check \`connected(x, y)\` first
- **Self-link**: \`link(x, x)\` is invalid
- **Cut non-edge**: \`cut(x, y)\` where no edge exists — undefined behavior
- **Single node**: all operations trivially work
- **Empty tree**: operations on node 0 are no-ops

## Complexity

| Operation | Time (amortized) |
|-----------|-------------------|
| \`makeRoot(x)\` | \`O(log n)\` |
| \`link(x, y)\` | \`O(log n)\` |
| \`cut(x, y)\` | \`O(log n)\` |
| \`query(x, y)\` | \`O(log n)\` |
| \`connected(x, y)\` | \`O(log n)\` |
| \`getRoot(x)\` | \`O(log n)\` |

Space: \`O(n)\`

## Usage

\`\`\`cpp
LCT<int> lct(n);
lct.link(1, 2);
lct.link(2, 3);
cout << lct.query(1, 3);  // path aggregate from 1 to 3
lct.cut(2, 3);            // remove edge 2-3
\`\`\``,
  }).returning();
  if (lct) {
    await db.insert(templateCodes).values([{
      templateId: lct.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;

template <typename T = int, int Base = 0>
struct LCT {
    struct Node {
        T val, siz;
        int par, ch[2];
        Node() : val(0), siz(0), par(0), ch{0, 0} {}
    };

    vector<Node> nodes;

    #define par(x) nodes[x].par
    #define left(x) nodes[x].ch[0]
    #define right(x) nodes[x].ch[1]
    #define siz(x) nodes[x].siz
    #define val(x) nodes[x].val

    LCT(int _n = 0) : nodes(_n + 5) {
        for (int i = 1; i <= _n; i++) {
            par(i) = left(i) = right(i) = 0;
            siz(i) = val(i) = 1;
        }
    }

    LCT(int _n, vector<T>& v) : nodes(_n + 5) {
        for (int i = 1; i <= _n; i++) {
            par(i) = left(i) = right(i) = 0;
            val(i) = v[i - !Base];
            siz(i) = 1;
        }
    }

    bool isRoot(int x) { return par(x) == 0 || (left(par(x)) != x && right(par(x)) != x); }

    void update(int x) { siz(x) = siz(left(x)) + siz(right(x)) + val(x); }

    bool isRight(int x) { return right(par(x)) == x; }

    void rotate(int x) {
        int p = par(x), g = par(p), t = isRight(x);
        if (!isRoot(p)) nodes[g].ch[isRight(p)] = x;
        nodes[p].ch[t] = nodes[x].ch[!t];
        par(nodes[p].ch[t]) = p;
        nodes[x].ch[!t] = p;
        par(p) = x; par(x) = g;
        update(p); update(x);
    }

    void splay(int x) {
        while (!isRoot(x)) {
            int p = par(x);
            if (!isRoot(p)) rotate(isRight(p) == isRight(x) ? p : x);
            rotate(x);
        }
    }

    void expose(int x) {
        for (int p = 0; x; p = x, x = par(x)) {
            splay(x);
            if (right(x)) val(x) += siz(right(x));
            if (p) val(x) -= siz(p);
            right(x) = p;
            update(x);
        }
    }

    void makeRoot(int x) {
        expose(x); splay(x);
        val(x) = -val(x);
        swap(left(x), right(x));
    }

    bool connected(int x, int y) {
        return getRoot(x) == getRoot(y);
    }

    int getRoot(int x) {
        expose(x); splay(x);
        while (left(x)) x = left(x);
        splay(x); return x;
    }

    void link(int x, int y) {
        expose(x); splay(x);
        expose(y); splay(y);
        par(y) = x; val(x) += siz(y);
        update(x);
    }

    void cut(int x, int y) {
        expose(y); splay(x);
        right(x) = par(y) = 0;
        update(x);
    }

    T query(int x, int y) {
        makeRoot(x); expose(y);
        return siz(y);
    }

    T querySubtree(int x) {
        expose(x); return val(x);
    }

    void set(int x, T v) {
        val(x) = v; splay(x);
    }

    #undef par
    #undef left
    #undef right
    #undef val
    #undef siz
};`)
    }]);
  }
}
