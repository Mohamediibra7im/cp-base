import { sql } from "drizzle-orm";
import { templates, templateCodes } from "../schema";
import { stripMain, type Db, type CatMap } from "./helpers";

export async function seedGraph(db: Db, catMap: CatMap) {
  const categoryId = catMap["graph"];
  if (!categoryId) return;

  // --- Graph Representation ---
  const [graphRep] = await db.insert(templates).values({
    title: "Graph Representation",
    slug: "graph-representation",
    description: "Linked-list (head array) adjacency — cache-friendly graph representation",
    categoryId: categoryId,
    tags: ["graph", "adjacency-list", "linked-list", "representation"],
    complexity: "O(n+m) build",
    notes: `# Graph Representation

Fast adjacency storage using head array (linked-list edges). More cache-friendly than \`vector<vector<Edge>>\` for dense graphs.

## Setup
\`\`\`cpp
init(n, m);           // n nodes, m edges (allocates 2*m+5 edge slots)
AddBiEdge(u, v, w);   // undirected
addEdge(u, v, w);     // directed
\`\`\`

## Traversal
Use the \`adj_loop\` macro to iterate neighbors:
\`\`\`cpp
adj_loop(u, v, e) {
    // v = neighbor, edges[e].cost = edge weight
}
\`\`\`

## Example
\`\`\`cpp
init(n, m);
for(int i = 0; i < m; i++) {
    int u, v, w; cin >> u >> v >> w;
    AddBiEdge(u, v, w);
}
// Traverse neighbors of node 1:
adj_loop(1, v, e) {
    cout << v << " " << edges[e].cost << "\\n";
}
\`\`\``,
  }).returning();
  if (graphRep) {
    await db.insert(templateCodes).values([{
      templateId: graphRep.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;

// Linked-list adjacency (head array) — fast graph representation
#define adj_loop(u, v, e) for(int e = head[u], v; ~e && (v = edges[e].to, 1); e = edges[e].nxt)

struct Edge {
    int to, nxt, cost;
    Edge(int TO = 0, int NXT = 0, int COST = 0) : to(TO), nxt(NXT), cost(COST) {}
};

int edge_count;
vector < Edge > edges;
vector < int > head;

void init(int n, int m){
    edges = vector < Edge > (2 * m + 5);
    head = vector < int > (n + 5, -1);
    edge_count = 1;
}

void addEdge(int u, int v, int c = 0){
    edges[edge_count] = {v, head[u], c};
    head[u] = edge_count++;
}

void AddBiEdge(int u, int v, int c = 0){
    addEdge(u, v, c);
    addEdge(v, u, c);
}`)
    }]);
  }

  // --- Dijkstra ---
  const [dijkstra] = await db.insert(templates).values({
    title: "Dijkstra's Algorithm", slug: "dijkstra",
    description: "Shortest path in non-negative weighted graphs using priority queue",
    categoryId: categoryId,
    tags: ["dijkstra", "shortest-path", "graph", "priority-queue"],
    complexity: "O((V+E) log V)",
    notes: `# Dijkstra's Algorithm

Finds shortest paths from a single source in graphs with **non-negative** edge weights.

## Usage
\`\`\`cpp
int edges; cin >> edges;
Dijkstra<ll> dij(edges, true);  // reads edges from cin
cout << dij.Min_Cost(1, n);     // min cost 1→n
auto dist = dij.get_dist(1);    // distances from node 1
\`\`\`

## Constructor
- \`Dijkstra<T>(edges, indirected = true)\` — reads \`edges\` lines of \`u v w\` from stdin

## Methods
- \`Min_Cost(src, dest)\` → shortest path cost, -1 if unreachable
- \`get_dist(src)\` → vector of distances from src to all nodes

## Important
Does NOT work with negative edge weights (use Bellman-Ford instead).`,
  }).returning();
  if (dijkstra) {
    await db.insert(templateCodes).values([{
      templateId: dijkstra.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;
#define sz(x) int(x.size())
#define ll long long

template < typename T = int > struct Dijkstra {
    struct Edge {
        T v, w;
        Edge(T V = 0, T W = 0): v(V), w(W) {}
        bool operator < (const Edge& e) const { return w > e.w; }
    };
    vector < vector < Edge > > adj;

    Dijkstra(int edges, bool indirected = true){
        adj = vector < vector < Edge > > (edges);
        for(int i = 0, u, v, w; i < edges; i++){
            cin >> u >> v >> w;
            adj[u].push_back(Edge(v, w));
            if(indirected) adj[v].push_back(Edge(u, w));
        }
    }

    T Min_Cost(int src, int dest){
        int n = sz(adj);
        vector < T > dist(n, LLONG_MAX);
        dist[src] = 0;
        priority_queue < Edge > Dij;
        Dij.push(Edge(src, 0));
        while(!Dij.empty()){
            auto [u, cost] = Dij.top(); Dij.pop();
            for(auto& [v, w] : adj[u])
                if(dist[v] > dist[u] + w){
                    dist[v] = dist[u] + w;
                    Dij.push(Edge(v, dist[v]));
                }
        }
        return (dist[dest] == LLONG_MAX ? -1 : dist[dest]);
    }

    vector < T > get_dist(int src){
        int n = sz(adj);
        vector < T > dist(n, LLONG_MAX);
        dist[src] = 0;
        priority_queue < Edge > Dij;
        Dij.push(Edge(src, 0));
        while(!Dij.empty()){
            auto [u, cost] = Dij.top(); Dij.pop();
            for(auto& [v, w] : adj[u])
                if(dist[v] > dist[u] + w){
                    dist[v] = dist[u] + w;
                    Dij.push(Edge(v, dist[v]));
                }
        }
        return dist;
    }
};`)
    }]);
  }

  // --- Floyd-Warshall ---
  const [floyd] = await db.insert(templates).values({
    title: "Floyd-Warshall", slug: "floyd-warshall",
    description: "All-pairs shortest paths — O(V³) dynamic programming on graph",
    categoryId: categoryId,
    tags: ["floyd-warshall", "all-pairs", "shortest-path", "dp", "graph"],
    complexity: "O(V³)",
    notes: `# Floyd-Warshall Algorithm

Computes shortest paths between **all pairs** of vertices.

## Usage
\`\`\`cpp
Floyd<ll> f(n);
f.add_edge(1, 2, 5);
f.add_edge(2, 3, 3);
f.build();
cout << f.get_dist(1, 3);  // 8
\`\`\`

## Template Parameters
- \`T\` = weight type (int/ll)
- \`Base\` = 0 for 0-indexed, 1 for 1-indexed input

## Methods
- \`add_edge(u, v, w)\` — add directed edge (takes min if duplicate)
- \`build()\` — run O(V³) DP
- \`get_dist(u, v)\` — shortest path after build
- \`update_dist(u, v, k)\` — relax through node k

## Properties
- Handles negative edge weights
- Detects negative cycles (diagonal < 0 after build)
- Simple to implement, use for V ≤ 500`,
  }).returning();
  if (floyd) {
    await db.insert(templateCodes).values([{
      templateId: floyd.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;
#define all(vec) vec.begin(), vec.end()
#define rall(vec) vec.rbegin(), vec.rend()
#define sz(x) int(x.size())
#define fi first
#define se second
#define ll long long
template < typename T = int , int Base = 0 > struct Floyd {
    int n; vector < vector < T > > dist;
    const T DEF = numeric_limits < T > :: max() / 2;
    Floyd(int _n = 0) : n(_n), dist(n + 5, vector < T > (n + 5, DEF)) { for(int i = 1; i <= n; i++) dist[i][i] = 0; }
    Floyd(int _n, const vector < vector < T > > &D) : n(_n), dist(n + 5, vector < T > (n + 5, DEF)) {
        for(int i = 1; i <= n; i++) for(int j = 1; j <= n; j++) dist[i][j] = D[i - !Base][j - !Base];
    }
    T operation(T a, T b){ return min(a, b); }
    void add_edge(int u, int v, T w){ dist[u][v] = operation(dist[u][v], w); }
    void build(){ for(int i = 1; i <= n; i++) for(int u = 1; u <= n; u++) for(int v = 1; v <= n; v++) update_dist(u, v, i); }
    T get_dist(int u, int v){ return dist[u][v]; }
    void update_dist(int u, int v, int a, int b){ dist[u][v] = operation(dist[u][v], dist[u][a] + dist[a][b] + dist[b][v]); }
    void update_dist(int u, int v, int k){ dist[u][v] = operation(dist[u][v], dist[u][k] + dist[k][v]); }
};`)
    }]);
  }

  // --- LCA ---
  const [lca] = await db.insert(templates).values({
    title: "LCA — Lowest Common Ancestor", slug: "lca",
    description: "Binary lifting for LCA, distance, and k-th ancestor queries on unweighted trees",
    categoryId: categoryId,
    tags: ["lca", "lowest-common-ancestor", "binary-lifting", "tree"],
    complexity: "O(n log n) build, O(log n) per query",
    notes: `# LCA — Lowest Common Ancestor (Binary Lifting)

Finds the lowest common ancestor of two nodes in a tree using binary lifting. Also supports distance and k-th ancestor queries.

## Usage
\`\`\`cpp
vector<vector<int>> adj(n + 1);
// build adjacency
LCA<> lca(n, adj, 1);
cout << lca.get_lca(3, 7);     // 1
cout << lca.get_dist(3, 7);    // 4
cout << lca.kth_ancestor(5, 2); // 2nd ancestor of node 5
\`\`\`

## Methods
- \`get_lca(u, v)\` → LCA node
- \`get_dist(u, v)\` → number of edges between u and v
- \`kth_ancestor(u, k)\` → k-th ancestor of u, -1 if none

## Complexity
- Build: O(n log n)
- Each query: O(log n)

For **weighted trees** with path sum/max queries, use the LCA Weighted template.`,
  }).returning();
  if (lca) {
    await db.insert(templateCodes).values([{
      templateId: lca.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;
#define all(vec) vec.begin(), vec.end()
#define rall(vec) vec.rbegin(), vec.rend()
#define sz(x) int(x.size())
#define fi first
#define se second
#define ll long long
template < typename vecType = int > class LCA {
public:
    LCA(int n = 0, const vector < vector < int > > &G = {}, int root = 1) : N(n), LOG(0), ROOT(root), adj(G) {
        while((1 << LOG) <= N) LOG++;
        anc.assign(N + 5, vector < int > (LOG)); depth.assign(N + 5, 0); dfs(ROOT);
    }
    int kth_ancestor(int u, int k) const { if(depth[u] < k) return -1; for(int bit = 0; bit < LOG; bit++) if(k & (1 << bit)) u = anc[u][bit]; return u; }
    int get_lca(int u, int v) const {
        if(depth[u] < depth[v]) swap(u, v); u = kth_ancestor(u, depth[u] - depth[v]);
        if(u == v) return u;
        for(int bit = LOG - 1; bit >= 0; bit--) if(anc[u][bit] != anc[v][bit]) u = anc[u][bit], v = anc[v][bit];
        return anc[u][0];
    }
    int get_dist(int u, int v) const { return depth[u] + depth[v] - 2 * depth[get_lca(u, v)]; }
private:
    int N, LOG, ROOT; const vector < vector < int > > &adj;
    vector < vector < int > > anc; vector < int > depth;
    void dfs(int u, int p = 0){ for(int v : adj[u]){ if(v == p) continue; depth[v] = depth[u] + 1; anc[v][0] = u; for(int bit = 1; bit < LOG; bit++) anc[v][bit] = anc[anc[v][bit - 1]][bit - 1]; dfs(v, u); } }
};`)
    }]);
  }

  // --- Tarjan ---
  const [tarjan] = await db.insert(templates).values({
    title: "Tarjan's Algorithm", slug: "tarjan",
    description: "SCC decomposition, bridges, and articulation points in O(V+E)",
    categoryId: categoryId,
    tags: ["tarjan", "scc", "bridges", "articulation-points", "graph", "strongly-connected"],
    complexity: "O(V+E)",
    notes: `# Tarjan's Algorithm

Finds Strongly Connected Components (SCCs), bridges, and articulation points in a single DFS pass.

## Usage
\`\`\`cpp
Tarjan t(n);
for(int i = 0; i < m; i++){
    int u, v; cin >> u >> v;
    t.addEdge(u, v, true);  // directed edge
}
t.run();
cout << t.getComponents().size();       // number of SCCs
for(auto& [u,v] : t.getBridges())
    cout << u << " " << v << "\\n";     // bridge edges
\`\`\`

## Methods
- \`addEdge(u, v, is_directed = false)\` — add edge
- \`run()\` — must call before querying
- \`getComponents()\` → list of SCCs (each is vector of nodes)
- \`getBridges()\` → list of bridge edges
- \`getArticulationPoints()\` → set of articulation points
- \`isArticulationPoint(u)\` / \`isBridge(u, v)\` → check

## Applications
- SCC condensation (DAG of SCCs)
- 2-SAT problem
- Finding critical edges/nodes in a network`,
  }).returning();
  if (tarjan) {
    await db.insert(templateCodes).values([{
      templateId: tarjan.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;
#define all(vec) vec.begin(), vec.end()
#define rall(vec) vec.rbegin(), vec.rend()
#define sz(x) int(x.size())
#define fi first
#define se second
#define ll long long
class Tarjan {
public:
    Tarjan(int n) { init(n); }
    void addEdge(int u, int v, bool is_directed = false) { adj[u].push_back(v); if (!is_directed) adj[v].push_back(u); }
    void run() { for (int i = 0; i < (int)adj.size(); ++i) if (node_idx[i] == -1) dfs(i); }
    set < int > getArticulationPoints() { return art_points; }
    vector < pair < int, int > > getBridges() { return bridges; }
    bool isArticulationPoint(int u) { return art_points.find(u) != art_points.end(); }
    bool isBridge(int u, int v) { return find(bridges.begin(), bridges.end(), make_pair(u, v)) != bridges.end() || find(bridges.begin(), bridges.end(), make_pair(v, u)) != bridges.end(); }
    vector < vector < int > > getComponents() { return comps; }
private:
    int timer; vector < vector < int > > adj, comps;
    vector < int > low_link, node_idx, comp_idx; vector < bool > in_stack;
    stack < int > stk; vector < pair < int, int > > bridges; set < int > art_points;
    void init(int n) {
        timer = 0; adj.assign(n + 5, vector < int > ()); low_link.assign(n + 5, -1); node_idx.assign(n + 5, -1);
        comp_idx.assign(n + 5, -1); in_stack.assign(n + 5, false); comps.clear(); while (!stk.empty()) stk.pop();
    }
    void dfs(int u, int parent = -1) {
        low_link[u] = node_idx[u] = timer++; in_stack[u] = true; stk.push(u); int childs = 0;
        for (int v : adj[u]) {
            if (v == parent) continue;
            if (node_idx[v] == -1) { dfs(v, u); low_link[u] = min(low_link[u], low_link[v]); if (low_link[v] == node_idx[v]) bridges.emplace_back(u, v); if (parent != -1 && low_link[v] >= node_idx[u]) art_points.insert(u); ++childs; }
            else if (in_stack[v]) low_link[u] = min(low_link[u], node_idx[v]);
        }
        if (parent == -1 && childs > 1) art_points.insert(u);
        if (low_link[u] == node_idx[u]) { comps.emplace_back(); int v; do { v = stk.top(); stk.pop(); in_stack[v] = false; comps.back().push_back(v); comp_idx[v] = comps.size() - 1; } while (v != u); }
    }
};`)
    }]);
  }

  // --- Bellman-Ford ---
  const [bellman] = await db.insert(templates).values({
    title: "Bellman-Ford", slug: "bellman-ford",
    description: "Shortest path with negative edge weights + negative cycle detection",
    categoryId: categoryId,
    tags: ["bellman-ford", "shortest-path", "negative-cycle", "graph"],
    complexity: "O(V·E)",
    notes: `# Bellman-Ford Algorithm

Finds shortest paths from a single source. Supports **negative edge weights** and detects **negative cycles**.

## Usage
\`\`\`cpp
BellmanFord<ll> bf(n, m, 1, n);
bf.read_edges();
bf.build();
if(bf.has_negative_cycle())
    cout << "negative cycle\\n";
else
    cout << bf.get_dist(n);
\`\`\`

## Methods
- \`read_edges()\` — reads m edges "u v w" from cin
- \`add_edge(u, v, w)\` — manually add edge
- \`build()\` — run Bellman-Ford (n-1 relaxations)
- \`has_negative_cycle()\` → bool (call after build)
- \`get_dist(u)\` → distance from src to u

## Edge Helper
- \`e.inv()\` — negates edge weight (for max-path via negation trick)

## Complexity
O(V·E). Use Dijkstra for non-negative weights (faster).`,
  }).returning();
  if (bellman) {
    await db.insert(templateCodes).values([{
      templateId: bellman.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;
#define ll long long

template < typename T = int > struct BellmanFord {
    struct Edge {
        int u, v;
        T w;
        Edge(int _u = 0, int _v = 0, T _w = 0) : u(_u), v(_v), w(_w) {}
        friend istream& operator >> (istream &in, Edge &e) {
            in >> e.u >> e.v >> e.w;
            return in;
        }
        void inv(){ w *= -1; }
    };

    int n, m, src, dest;
    vector < Edge > edges;
    T DEFAULT;
    vector < T > dist;

    BellmanFord(int _n = 0, int _m = 0, int _src = 1, int _dest = 1){
        n = _n, m = _m, src = _src, dest = _dest;
        DEFAULT = numeric_limits < T > :: max() / 2;
        dist.assign(n + 5, DEFAULT);
        edges.resize(m);
    }

    void read_edges(){ cin >> edges; }
    void add_edge(int u, int v, T w){ edges.emplace_back(u, v, w); }

    void build(){
        dist[src] = 0;
        for(int i = 0; i < n; i++)
            for(auto& [u, v, w] : edges)
                if(dist[u] < DEFAULT)
                    dist[v] = min(dist[v], dist[u] + w);
    }

    bool has_negative_cycle(){
        for(auto& [u, v, w] : edges)
            if(dist[u] < DEFAULT && dist[v] > dist[u] + w)
                return true;
        return false;
    }

    T get_dist(int u){ return dist[u]; }
    T get_min_dist(){ return *min_element(dist.begin(), dist.end()); }
};`)
    }]);
  }

  // --- Graph Traversal (DFS & BFS) ---
  const [graphTraversal] = await db.insert(templates).values({
    title: "Graph Traversal",
    slug: "graph-traversal",
    description: "DFS & BFS on adjacency list graphs with bipartite check and cycle detection",
    categoryId: categoryId,
    tags: ["graph", "dfs", "bfs", "traversal", "bipartite", "cycle-detection"],
    complexity: "O(V+E)",
    notes: `# Graph Traversal (DFS & BFS)

Graph data structure with Depth-First Search (DFS) and Breadth-First Search (BFS) traversals.

## DFS
Explores each branch fully before backtracking.

**Use cases**: Connectivity, cycle detection, topological sorting, finding paths.

## BFS
Explores nodes level by level (shortest path in unweighted graphs).

**Use cases**: Shortest path in unweighted graphs, level-order traversal, bipartite check.

## Additional Methods
- **is_Bipartite()**: Tests if graph is 2-colorable (no odd cycles)
- **is_cycle()**: Detects cycles in undirected graphs
- **topology()**: Kahn's algorithm for topological ordering of DAGs`,
  }).returning();
  if (graphTraversal) {
    await db.insert(templateCodes).values([{
      templateId: graphTraversal.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;
#define all(vec) vec.begin(), vec.end()
#define rall(vec) vec.rbegin(), vec.rend()
#define sz(x) int(x.size())
#define fi first
#define se second
#define ll long long
template < typename T = int > using Pair = pair < T, T >;

struct Graph {
    int n, m;
    vector < vector < int > > adj;
    vector < bool > vis;
    vector < int > depth, parent, deg, colour;

    Graph(int N, int M) : n(N), m(M) {
        adj.assign(n + 10, vector < int > ());
        vis.assign(n + 10, false);
        depth.assign(n + 10, 0);
        deg.assign(n + 10, 0);
        colour.assign(n + 10, 0);
        parent.assign(n + 10, -1);
    }

    void add_edge(int u, int v, bool is_directed = false) {
        adj[u].push_back(v); deg[u]++;
        if (!is_directed) { adj[v].push_back(u); deg[v]++; }
    }

    void build_adj(bool is_directed = false) {
        for (int i = 0, u, v; i < m && cin >> u >> v; i++)
            add_edge(u, v, is_directed);
    }

    void dfs(int node, int dep = 0, int par = -1) {
        vis[node] = true; parent[node] = par; depth[node] = dep;
        for (auto& new_node : adj[node])
            if (!vis[new_node]) dfs(new_node, dep + 1, node);
    }

    int bfs(int from, int to) {
        if (from == to) return 0;
        queue < int > q;
        depth.assign(n + 10, 1e9);
        vis[from] = true; depth[from] = 0; q.push(from);
        while (!q.empty()) {
            int u = q.front(); q.pop();
            for (auto& v : adj[u]) {
                if (!vis[v]) {
                    q.push(v); parent[v] = u;
                    depth[v] = depth[u] + 1; vis[v] = true;
                }
            }
        }
        return depth[to] >= 1e9 ? -1 : depth[to];
    }

    bool is_Bipartite() {
        fill(all(colour), 0);
        for (int i = 1; i <= n; i++) {
            if (colour[i] == 0) {
                queue < int > q; q.push(i); colour[i] = 1;
                while (!q.empty()) {
                    int u = q.front(); q.pop();
                    for (auto& v : adj[u]) {
                        if (colour[v] == 0) { colour[v] = -colour[u]; q.push(v); }
                        else if (colour[v] == colour[u]) return false;
                    }
                }
            }
        }
        return true;
    }

    bool is_cycle(int node, int par = -1) {
        vis[node] = true;
        for (auto& new_node : adj[node]) {
            if (!vis[new_node]) { if (is_cycle(new_node, node)) return true; }
            else if (new_node != par) return true;
        }
        return false;
    }

    void get_path(int node) {
        if (parent[node] == -1) return;
        cout << node << " ";
        get_path(parent[node]);
    }

    void topology() {
        queue < int > topo;
        vector < int > order;
        vector < int > tmp = deg;
        for (int i = 1; i <= n; i++) if (tmp[i] == 0) topo.push(i);
        while (!topo.empty()) {
            int u = topo.front(); topo.pop();
            order.push_back(u);
            for (auto& v : adj[u]) { tmp[v]--; if (tmp[v] == 0) topo.push(v); }
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
    description: "Minimum spanning tree using priority queue (O((V+E) log V))",
    categoryId: categoryId,
    tags: ["prim", "mst", "minimum-spanning-tree", "graph", "priority-queue"],
    complexity: "O((V+E) log V)",
    notes: `# Prim's Algorithm — Minimum Spanning Tree

Finds a minimum spanning tree (MST) for a weighted undirected graph.

## Algorithm
1. Start from arbitrary root.
2. Grow tree by adding cheapest edge connecting a tree node to a non-tree node.
3. Repeat until all nodes included.

## Usage
\`\`\`cpp
Prim<ll> prim(n);
prim.build_adj(m);
ll cost = prim.get_cost(1);
\`\`\`

## Applications
- Network design (minimal cost to connect nodes)
- Approximation for TSP`,
  }).returning();
  if (prim) {
    await db.insert(templateCodes).values([{
      templateId: prim.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;
#define all(vec) vec.begin(), vec.end()
#define rall(vec) vec.rbegin(), vec.rend()
#define sz(x) int(x.size())
#define fi first
#define se second
#define ll long long

template < typename T = int > struct Prim {
    struct Edge {
        T v, w;
        Edge(T V = 0, T W = 0) : v(V), w(W) {}
        bool operator < (const Edge &e) const { return w > e.w; }
    };
    vector < vector < Edge > > adj;
    vector < bool > marked;

    Prim(int n = 0) {
        adj = vector < vector < Edge > > (n + 10);
        marked = vector < bool > (n + 10, false);
    }

    void add_edge(int u, int v, T w, bool is_directed = false) {
        adj[u].push_back(Edge(v, w));
        if (!is_directed) adj[v].push_back(Edge(u, w));
    }

    void build_adj(int edges, bool is_directed = false) {
        for (int i = 0, u, v, w; i < edges && cin >> u >> v >> w; i++)
            add_edge(u, v, w, is_directed);
    }

    T get_cost(int root) {
        T cost = 0;
        priority_queue < Edge > pq;
        pq.push(Edge(root, 0));
        while (!pq.empty()) {
            auto [u, curr_cost] = pq.top(); pq.pop();
            if (marked[u]) continue;
            marked[u] = true;
            cost += curr_cost;
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
    description: "Divide-and-conquer on trees via centroid (O(n log n))",
    categoryId: categoryId,
    tags: ["centroid", "decomposition", "tree", "divide-conquer"],
    complexity: "O(n log n)",
    notes: `# Centroid Decomposition

Divide-and-conquer on trees. Recursively splits tree at centroid — node whose largest subtree ≤ n/2.

## Algorithm
1. Find centroid of current component.
2. Process all paths passing through centroid.
3. Remove centroid, recurse on remaining components.

## Usage
\`\`\`cpp
Centroid_Decomposition<int> cd(n, adj, 1);
cd.Decompose();
\`\`\`

## Applications
- Counting paths with specific length/weight
- Distance queries on trees
- "Number of paths with sum = k" type problems`,
  }).returning();
  if (centroid) {
    await db.insert(templateCodes).values([{
      templateId: centroid.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;
#define all(vec) vec.begin(), vec.end()
#define rall(vec) vec.rbegin(), vec.rend()
#define sz(x) int(x.size())
#define fi first
#define se second
#define ll long long

template < typename T = int > struct Centroid_Decomposition {
    int n, treeRoot;
    const vector < vector < T > > &adj;
    vector < T > SubtreeSz, isCentroid;

    Centroid_Decomposition(int N, const vector < vector < T > > &G, int Root = 1) : adj(G) {
        n = N; treeRoot = Root;
        SubtreeSz = isCentroid = vector < T > (n + 5, 0);
    }

    int updateSize(int u, int p = -1) {
        SubtreeSz[u] = 1;
        for (int v : adj[u])
            if (v != p && !isCentroid[v])
                SubtreeSz[u] += updateSize(v, u);
        return SubtreeSz[u];
    }

    int getCentroid(int u, int target, int p = -1) {
        for (auto& v : adj[u]) {
            if (v == p || isCentroid[v]) continue;
            if (SubtreeSz[v] * 2 > target)
                return getCentroid(v, target, u);
        }
        return u;
    }

    void Decompose(int u = -1) {
        if (u == -1) u = treeRoot;
        int centroid = getCentroid(u, updateSize(u));
        // Add problem logic here — process paths through centroid
        isCentroid[centroid] = true;
        for (auto& v : adj[centroid])
            if (!isCentroid[v]) Decompose(v);
    }
};`)
    }]);
  }

  // --- LCA Weighted ---
  const [lcaWeighted] = await db.insert(templates).values({
    title: "LCA Weighted",
    slug: "lca-weighted",
    description: "LCA with path distance queries on weighted trees (O(log n) per query)",
    categoryId: categoryId,
    tags: ["lca", "lowest-common-ancestor", "binary-lifting", "weighted-tree", "path-query"],
    complexity: "O(n log n) build, O(log n) per query",
    notes: `# LCA — Lowest Common Ancestor (Weighted Tree)

Binary lifting for LCA queries with path aggregate on weighted trees.

## Capabilities
- **get_lca(u, v)**: Find LCA of two nodes
- **query(u, v)**: Aggregate (sum/max/min) edge weights on path u→v
- **kth_ancestor(u, k)**: Find k-th ancestor
- **get_dist(u, v)**: Number of edges between u and v (depth difference)

## Custom Operation
\`\`\`cpp
// Sum on path (default)
LCA_Weighted<ll, ll> lca(n, adj, [](ll a, ll b){ return a + b; }, 0LL, 1);

// Max edge weight on path
LCA_Weighted<int, int> lca(n, adj, [](int a, int b){ return max(a, b); }, 0, 1);
\`\`\`

## Applications
- Distance queries in weighted trees
- Maximum/minimum edge weight along a path`,
  }).returning();
  if (lcaWeighted) {
    await db.insert(templateCodes).values([{
      templateId: lcaWeighted.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;
#define all(vec) vec.begin(), vec.end()
#define rall(vec) vec.rbegin(), vec.rend()
#define sz(x) int(x.size())
#define fi first
#define se second
#define ll long long

template < typename treeType = int, typename graphType = int >
class LCA_Weighted {
public:
    LCA_Weighted(int n = 0,
        const vector < vector < pair < int, graphType > > > &G = {},
        function < treeType(treeType, treeType) > op = [](treeType a, treeType b){ return a + b; },
        treeType _neutral = treeType(), int root = 1)
        : N(n), LOG(0), ROOT(root), adj(G), operation(op), neutral(_neutral) {
        while ((1 << LOG) <= N) LOG++;
        anc.assign(N + 5, vector < int > (LOG));
        cost.assign(N + 5, vector < treeType > (LOG, neutral));
        depth.assign(N + 5, 0);
        dfs(ROOT);
    }

    int kth_ancestor(int u, int k) const {
        if (depth[u] < k) return -1;
        for (int bit = 0; bit < LOG; bit++)
            if (k & (1 << bit)) u = anc[u][bit];
        return u;
    }

    int get_lca(int u, int v) const {
        if (depth[u] < depth[v]) swap(u, v);
        u = kth_ancestor(u, depth[u] - depth[v]);
        if (u == v) return u;
        for (int bit = LOG - 1; bit >= 0; bit--)
            if (anc[u][bit] != anc[v][bit])
                u = anc[u][bit], v = anc[v][bit];
        return anc[u][0];
    }

    treeType query(int u, int v) const {
        int l = get_lca(u, v);
        return operation(get_cost(u, depth[u] - depth[l]), get_cost(v, depth[v] - depth[l]));
    }

    int get_dist(int u, int v) const {
        int l = get_lca(u, v);
        return depth[u] + depth[v] - 2 * depth[l];
    }

private:
    int N, LOG, ROOT;
    const vector < vector < pair < int, graphType > > > &adj;
    vector < vector < int > > anc;
    vector < vector < treeType > > cost;
    vector < int > depth;
    function < treeType(treeType, treeType) > operation;
    treeType neutral;

    void dfs(int u, int p = 0) {
        for (auto& [v, w] : adj[u]) {
            if (v == p) continue;
            depth[v] = depth[u] + 1;
            anc[v][0] = u; cost[v][0] = treeType(w);
            for (int bit = 1; bit < LOG; bit++) {
                anc[v][bit] = anc[anc[v][bit - 1]][bit - 1];
                cost[v][bit] = operation(cost[v][bit - 1], cost[anc[v][bit - 1]][bit - 1]);
            }
            dfs(v, u);
        }
    }

    treeType get_cost(int u, int dist) const {
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
    description: "Maximum bipartite matching via augmenting paths (O(V·E))",
    categoryId: categoryId,
    tags: ["kuhn", "bipartite", "matching", "augmenting-path", "graph"],
    complexity: "O(V·E) worst-case",
    notes: `# Kuhn's Algorithm — Maximum Bipartite Matching

Finds maximum cardinality matching in a bipartite graph using augmenting paths.

## Algorithm
For each left vertex, try to find augmenting path to an unmatched right vertex via DFS.

## Usage
\`\`\`cpp
vector<vector<int>> adj(n + 1);
adj[1] = {2, 3};
Kuhn<int, 1> kuhn(n, m, adj);
int maxMatch = kuhn.max_match();
\`\`\`

## Applications
- Assignment problems
- Task scheduling
- Minimum vertex cover (via König's theorem)`,
  }).returning();
  if (kuhn) {
    await db.insert(templateCodes).values([{
      templateId: kuhn.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;
#define all(vec) vec.begin(), vec.end()
#define rall(vec) vec.rbegin(), vec.rend()
#define sz(x) int(x.size())
#define fi first
#define se second
#define ll long long

template < typename T = int, int Base = 1 > struct Kuhn {
    int n, m;
    vector < vector < T > > adj;
    vector < T > matching, vis;

    Kuhn(int N, int M, const vector < vector < T > > &G) : n(N), m(M), adj(G) {
        matching = vector < T > (m + 5, -1);
        vis = vector < T > (n + 5, 0);
    }

    bool match(int u, int& cur) {
        if (vis[u] == cur) return false;
        vis[u] = cur;
        for (auto& v : adj[u])
            if (matching[v] == -1 || match(matching[v], cur))
                return matching[v] = u, true;
        return false;
    }

    T max_match() {
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
    description: "Dynamic tree connectivity with path queries in O(log n) amortized",
    categoryId: categoryId,
    tags: ["lct", "link-cut", "dynamic-tree", "path-query", "splay"],
    complexity: "O(log n) amortized per operation",
    notes: `# Link-Cut Tree (LCT)

Dynamic tree data structure supporting link, cut, and path aggregate queries.

## Operations
- **link(x, y)**: Add edge between x and y
- **cut(x, y)**: Remove edge between x and y
- **connected(x, y)**: Check if x and y are in same tree
- **query(x, y)**: Aggregate value on path x→y
- **query_subtree(x)**: Aggregate value in subtree of x
- **set(x, v)**: Update node x's value
- **get_root(x)**: Get root of x's tree
- **make_root(x)**: Make x the root

## Usage
\`\`\`cpp
LCT<int> lct(n);
lct.link(1, 2); lct.link(2, 3);
cout << lct.query(1, 3);
lct.cut(2, 3);
\`\`\`

## Applications
- Dynamic connectivity in forests
- Path queries on changing trees
- Subtree queries on dynamic trees`,
  }).returning();
  if (lct) {
    await db.insert(templateCodes).values([{
      templateId: lct.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;
#define all(vec) vec.begin(), vec.end()
#define rall(vec) vec.rbegin(), vec.rend()
#define sz(x) int(x.size())
#define fi first
#define se second
#define ll long long

template < typename T = int, int Base = 0 > struct LCT {
    struct Node {
        T val, siz;
        int par, ch[2];
        Node() : val(0), siz(0), par(0), ch{0, 0} {}
    };

    vector < Node > nodes;

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

    LCT(int _n, vector < T > &v) : nodes(_n + 5) {
        for (int i = 1; i <= _n; i++) {
            par(i) = left(i) = right(i) = 0;
            val(i) = v[i - !Base];
            siz(i) = 1;
        }
    }

    bool is_root(int x) { return par(x) == 0 || (left(par(x)) != x && right(par(x)) != x); }
    void update(int x) { siz(x) = siz(left(x)) + siz(right(x)) + val(x); }
    bool is_right(int x) { return right(par(x)) == x; }

    void rotate(int x) {
        int p = par(x), g = par(p), t = is_right(x);
        if (!is_root(p)) nodes[g].ch[is_right(p)] = x;
        nodes[p].ch[t] = nodes[x].ch[!t];
        par(nodes[p].ch[t]) = p;
        nodes[x].ch[!t] = p;
        par(p) = x; par(x) = g;
        update(p); update(x);
    }

    void splay(int x) {
        while (!is_root(x)) {
            int p = par(x);
            if (!is_root(p)) rotate(is_right(p) == is_right(x) ? p : x);
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

    void make_root(int x) {
        expose(x); splay(x);
        val(x) = -val(x);
        swap(left(x), right(x));
    }

    bool connected(int x, int y) {
        return get_root(x) == get_root(y);
    }

    int get_root(int x) {
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
        make_root(x); expose(y);
        return siz(y);
    }

    T query_subtree(int x) {
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
