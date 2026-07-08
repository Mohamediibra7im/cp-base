import { templates, templateCodes } from "../schema";
import { stripMain, type Db, type CatMap } from "./helpers";

export async function seedRangeQueries(db: Db, catMap: CatMap) {
  const categoryId = catMap["range-queries"];
  if (!categoryId) return;

  // 1. SQRT Decomposition ---------------------------------------------------------
  const [sqrtDecomp] = await db.insert(templates).values({
    title: "SQRT Decomposition",
    slug: "sqrt-decomposition",
    description: "Square root decomposition with sorted blocks for range queries and point updates",
    categoryId: categoryId,
    tags: ["sqrt-decomposition", "bucket", "range-query"],
    complexity: "O(\u221An) per query/update",
    notes: `# SQRT Decomposition

Square root decomposition with sorted blocks for range queries and point updates.

## Constructor
\`\`\`cpp
Sqrt_Decomp<T, Base> sq(int N, vector<T>& vec = {});
// If vec provided, build() called automatically
\`\`\`

## Methods
- **calc_sq(N)** \u2192 block size (called automatically)
- **build()** \u2192 sort each block
- **update(idx, val)** \u2192 O(\u221An) point update + re-sort block
- **update_range(idx, val)** \u2192 O(\u221An) rebuild entire block
- **query(l, r, x)** \u2192 count elements \u2265 x in [l, r]

## Default Query
Counts elements \u2265 x in range [l, r]. Modify \`query()\` body for sum/min/max.

## Example
\`\`\`cpp
int n = 10;
vector<int> arr = {3, 1, 4, 1, 5, 9, 2, 6, 5, 3};
Sqrt_Decomp<int> sq(n, arr);
cout << sq.query(1, n, 5);       // count elements >= 5
sq.update(3, 10);
cout << sq.query(1, n, 5);       // recount after update
\`\`\`

## Complexity
| Operation | Time |
|-----------|------|
| Build (initial sort) | O(n log n) |
| Update (point) | O(\u221An log \u221An) |
| Update (rebuild block) | O(\u221An) |
| Query | O(\u221An) |

## Template Parameters
- **T** = element type (default int)
- **Base** = 0 for 0-indexed, 1 for 1-indexed`,
  }).returning();
  if (sqrtDecomp) {
    await db.insert(templateCodes).values([{
      templateId: sqrtDecomp.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;
#define all(vec) vec.begin(), vec.end()
#define sz(x) int(x.size())
#define ll long long

template < typename T = int, int Base = 0 > struct Sqrt_Decomp {

    int n, len;
    vector < T > a; 
    vector < vector < T > > b;
    T U_Default, Q_Default;

    T calc_sq(int N){
        int sq = sqrt(N);
        return sq * sq == N ? sq : sq + 1;
    }

    Sqrt_Decomp(int N = 0, const vector < T >& vec = vector < T > ()){
        n = N, len = calc_sq(n), U_Default = 0, Q_Default = 0;
        a = (vec.empty() ? vector < T > (n + 5, U_Default) : vec);
        b = vector < vector < T > > (len + 5);
        if(!vec.empty()) build();
    }

    void build(){
        for(int i = (Base ? 1 : 0); i < (Base ? n + 1 : n); i++)
            b[i / len].push_back(a[i]);
        for(int i = 0; i <= len; i++)
            sort(all(b[i]));
    }

    void update(int idx, T val){
        int idx2 = lower_bound(all(b[idx / len]), a[idx - !Base]) - b[idx / len].begin();
        b[idx / len][idx2] = a[idx - !Base] = val;
        sort(all(b[idx / len]));
    }

    void update_range(int idx, T val){
        a[idx - !Base] = val;
        b[idx / len].clear();
        for(int i = idx / len * len; i < min(n, (idx / len + 1) * len); i++)
            b[idx / len].push_back(a[i - !Base]);
        sort(all(b[idx / len]));
    }

    T query(int l, int r, T x){
        T res = Q_Default;
        while(l < r && l % len != 0)
            res += a[l++ - !Base] >= x;
        while(l + len <= r){
            res += sz(b[l / len]) - (lower_bound(all(b[l / len]), x) - b[l / len].begin());
            l += len;
        }
        while(l <= r)
            res += a[l++ - !Base] >= x;
        return res;
    }
};

int main(){
    ios_base::sync_with_stdio(false), cin.tie(nullptr), cout.tie(nullptr);
    int test_cases = 1;
    for(int tc = 1; tc <= test_cases; tc++){
    }
    return 0;
}`)
    }]);
  }

  // 2. Mo's Algorithm -------------------------------------------------------------
  const [mosAlgo] = await db.insert(templates).values({
    title: "Mo's Algorithm",
    slug: "mos-algorithm",
    description: "Mo's algorithm for offline range queries with Hilbert curve ordering",
    categoryId: categoryId,
    tags: ["mo-algorithm", "offline", "range-query", "hilbert-curve"],
    complexity: "O((n+q)\u221An)",
    notes: `# Mo's Algorithm

Offline range query processing using Mo's ordering with Hilbert curve optimization.

## Usage
\`\`\`cpp
// Implement add() and remove() inside MoAlgorithm, updating ans:
// void add(int idx)    { ans += val[idx]; }     // add a[idx] to range
// void remove(int idx) { ans -= val[idx]; }     // remove a[idx] from range

MoAlgorithm<int> mo(n, q);
mo.getData(arr);
for(auto& a : mo.getAnswers()) cout << a << "\\n";
\`\`\`

## Query Struct
- **l**, **r**: query range
- **query_idx**: original query index
- **ord**: Hilbert curve ordering key

## Methods
- **getData(vector\<T\>& v = {})** \u2192 reads M queries "l r" from cin, processes them
- **getAnswers()** \u2192 vector\<T\>, answers in original query order

## Complexity
O((n + q)\u221An) with Hilbert curve ordering achieving O(n\u221Aq)

## Template Parameters
- **T** = answer type (default int)
- **Base** = 0 for 0-indexed, 1 for 1-indexed

## Important
Fill the \`add()\` and \`remove()\` private methods with problem-specific logic.
The \`ans\` member variable holds current range aggregate.`,
  }).returning();
  if (mosAlgo) {
    await db.insert(templateCodes).values([{
      templateId: mosAlgo.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;
#define ll long long

template < typename T = int, int Base = 0 >
class MoAlgorithm {
public:
    struct query {
        int l, r, query_idx;
        int64_t ord;

        query(int L = 0, int R = 0, int Query_idx = 0, int HilbertPow = 0) {
            l = L - !Base, r = R - !Base, query_idx = Query_idx;
            calcOrder(HilbertPow);
        }

        void calcOrder(int HilbertPow) {
            ord = gilbertOrder(l, r, HilbertPow, 0);
        }

        bool operator < (const query& rhs) const {
            return ord < rhs.ord;
        }
    };

    MoAlgorithm(int N = 0, int M = 0) : currL(1), currR(0), n(N), m(M), sqrtN(n / sqrt(m) + 1), hilbertPow(calculateHilbertPow()), ans(0), answers(m), queries(m) {}

    void getData(const vector < T >& v = {}){
        val = v;
        
        for (int i = 0, l, r; i < m && cin >> l >> r; i++)
            queries[i] = query(l, r, i, hilbertPow);
        
        process();
    }

    void process() {
        sort(queries.begin(), queries.end());
        currL = queries[0].l, currR = queries[0].l - 1;

        for (auto& q : queries) {
            setRange(q);
            answers[q.query_idx] = ans;
        }
    }

    vector < T > getAnswers() const {
        return answers;
    }

private:
    int currL, currR, n, m, sqrtN, hilbertPow;
    T ans;
    vector < T > answers, val;
    vector < query > queries;

    static int64_t gilbertOrder(int x, int y, int pow, int rotate) {
        if (pow == 0) return 0;
        int hpow = 1 << (pow - 1);
        int seg = (x < hpow) ? ((y < hpow) ? 0 : 3) : ((y < hpow) ? 1 : 2);
        seg = (seg + rotate) & 3;
        const int rotateDelta[4] = {3, 0, 0, 1};
        int nx = x & (x ^ hpow), ny = y & (y ^ hpow);
        int nrot = (rotate + rotateDelta[seg]) & 3;
        int64_t subSquareSize = int64_t(1) << (2 * pow - 2);
        int64_t ordd = seg * subSquareSize;
        int64_t add = gilbertOrder(nx, ny, pow - 1, nrot);
        ordd += (seg == 1 || seg == 2) ? add : (subSquareSize - add - 1);
        return ordd;
    }

    int calculateHilbertPow() const {
        int pow = 1;
        while ((1 << pow) < n) pow++;
        return pow;
    }

    void add(int idx) {
        // user implementation — add val[idx] to ans
    }

    void remove(int idx) {
        // user implementation — remove val[idx] from ans
    }

    void setRange(const query& q) {
        while (currL > q.l) currL--, add(currL);
        while (currR < q.r) currR++, add(currR);
        while (currL < q.l) remove(currL), currL++;
        while (currR > q.r) remove(currR), currR--;
    }
};

int main(){
    ios_base::sync_with_stdio(false), cin.tie(nullptr), cout.tie(nullptr);
    int t = 1;
    while(t--)
        ;
    return 0;
}`)
    }]);
  }

  // 3. Mo's on Trees --------------------------------------------------------------
  const [mosTree] = await db.insert(templates).values({
    title: "Mo's on Trees",
    slug: "mos-on-trees",
    description: "Mo's algorithm adapted for tree path queries using Euler tour and Hilbert ordering",
    categoryId: categoryId,
    tags: ["mo-algorithm", "tree", "path-query", "hilbert-curve"],
    complexity: "O((n+q)\u221An)",
    notes: `# Mo's Algorithm on Trees

Mo's algorithm adapted for tree path queries using Euler tour (tin/tout) and LCA via binary lifting.

## Usage
\`\`\`cpp
// Implement add(int u) and remove(int u) inside MoTree:
// void add(int u)    { /* toggle node u into active set */ }
// void remove(int u) { /* toggle node u out of active set */ }

vector<vector<int>> adj(n + 1);
// build adjacency ...
MoTree<int, int> mo(n, q, adj, node_vals, 1);
mo.getData();
for(auto& a : mo.getAnswers()) cout << a << "\\n";
\`\`\`

## Euler Tour
- **S[u]**: first occurrence of node u in Euler tour
- **E[u]**: second occurrence of node u in Euler tour
- **FT[timer]**: node at position timer in Euler tour

## LCA
Binary lifting for O(log n) LCA queries.
- **kthAncestor(u, k)** \u2192 k-th ancestor of u (-1 if none)
- **getLCA(u, v)** \u2192 lowest common ancestor

## Methods
- **getData()** \u2192 reads M queries "u v" from cin, processes them
- **getAnswers()** \u2192 vector\<T\>, answers in original query order

## Complexity
| Operation | Time |
|-----------|------|
| Build (DFS + LCA table) | O(n log n) |
| Per query (amortized) | O(\u221An) |

## Template Parameters
- **T** = answer type (default int)
- **graphType** = adjacency element type (int for unweighted, pair\<int,int\> for weighted)
- **VAL_ON_EDGE** = false for node values, true for edge values

## Important
Fill \`add(int u)\` and \`remove(int u)\` with problem-specific logic.
The \`operation()\` method toggles node inclusion via Euler tour indices.
For VAL_ON_EDGE = true, node values are populated from edge weights during DFS.`,
  }).returning();
  if (mosTree) {
    await db.insert(templateCodes).values([{
      templateId: mosTree.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;
#define ll long long

template < typename T = int , typename graphType = int , bool VAL_ON_EDGE = false >
class MoTree {
public:
    struct Query {
        int l, r, k, lca, queryIdx;
        int64_t ord;

        Query(vector < int >& S, vector < int >& E, int L = 0, int R = 0, int QueryIdx = 0, int LCA = 0, int HilbertPow = 0) {
            if (S[L] > S[R])
                swap(L, R);
            if (LCA == L)
                l = S[L] + VAL_ON_EDGE, r = S[R], lca = -1, queryIdx = QueryIdx;
            else
                l = E[L], r = S[R], lca = LCA, queryIdx = QueryIdx;
            calcOrder(HilbertPow);
        }

        void calcOrder(int hilbert_pow) {
            ord = MoTree::hilbertOrder(l, r, hilbert_pow, 0);
        }

        bool operator < (const Query& rhs) const {
            return ord < rhs.ord;
        }
    };

    MoTree(int N, int M, const vector < vector < graphType > >& G, const vector < T >& V = {}, int root = 1) 
        : curr_l(1), curr_r(0), n(N), m(M), SqrtN(n / sqrt(m) + 1), timer(1), ans(0), answers(M), val(V), adj(G) {
        LOG = calcLog(N);
        helbertPow = calcHilbertPow(2 * N + 1);
        nodeFreq = S = E = dep = vector < int > (n + 5);
        FT = vector < int > (2 * n + 5);
        anc = vector < vector < int > > (n + 5, vector < int > (LOG));
        if(val.empty()) val = vector < T > (n + 5);

        dfs(root, adj);
    }

    static inline int64_t hilbertOrder(int x, int y, int pow, int rotate) {
        if (pow == 0) return 0;
        int hpow = 1 << (pow - 1);
        int seg = (x < hpow) ? ((y < hpow) ? 0 : 3) : ((y < hpow) ? 1 : 2);
        seg = (seg + rotate) & 3;
        const int rotateDelta[4] = {3, 0, 0, 1};
        int nx = x & (x ^ hpow), ny = y & (y ^ hpow);
        int nrot = (rotate + rotateDelta[seg]) & 3;
        int64_t subSquareSize = int64_t(1) << (2 * pow - 2);
        int64_t ordd = seg * subSquareSize;
        int64_t add = hilbertOrder(nx, ny, pow - 1, nrot);
        ordd += (seg == 1 || seg == 2) ? add : (subSquareSize - add - 1);
        return ordd;
    }

    void getData() {
        for (int i = 0, u, v; i < m && cin >> u >> v; i++)
            queries.emplace_back(S, E, u, v, i, getLCA(u, v), helbertPow);
        process();
    }

    void process() {
        sort(queries.begin(), queries.end());

        curr_l = queries[0].l, curr_r = queries[0].l - 1;

        for (auto& q : queries) {
            setRange(q);

            if (~q.lca && !VAL_ON_EDGE) 
                add(q.lca);
            
            answers[q.queryIdx] = ans;
            
            if (~q.lca && !VAL_ON_EDGE) 
                remove(q.lca);
        }
    }

    vector < T > getAnswers() const {
        return answers;
    }

private:
    int curr_l, curr_r, n, m, SqrtN, timer, LOG, helbertPow;
    T ans;
    vector < T > answers, val;
    vector < int > dep, S, E, FT, nodeFreq;
    vector < vector < int > > anc;
    vector < Query > queries;
    const vector < vector < graphType > >& adj;
    
    void dfs(int u, const vector < vector < pair < int, int > > >& adj, int p = -1) {
        S[u] = timer;
        FT[timer++] = u;
        for (auto& [v, w] : adj[u]) {
            if (v == p) continue;
            dep[v] = dep[u] + 1, anc[v][0] = u, val[v] = w;
            for (int bit = 1; bit < LOG; bit++)
                anc[v][bit] = anc[anc[v][bit - 1]][bit - 1];
            dfs(v, adj, u);
        }
        E[u] = timer;
        FT[timer++] = u;
    }

    void dfs(int u, const vector < vector < int > >& adj, int p = -1) {
        S[u] = timer;
        FT[timer++] = u;
        for (auto& v : adj[u]) {
            if (v == p) continue;
            dep[v] = dep[u] + 1;
            anc[v][0] = u;
            for (int bit = 1; bit < LOG; bit++)
                anc[v][bit] = anc[anc[v][bit - 1]][bit - 1];
            dfs(v, adj, u);
        }
        E[u] = timer;
        FT[timer++] = u;
    }

    int kthAncestor(int u, int k) const {
        if (dep[u] < k)
            return -1;
        for (int bit = LOG - 1; bit >= 0; bit--)
            if (k & (1 << bit))
                u = anc[u][bit];
        return u;
    }

    int getLCA(int u, int v) const {
        if (dep[u] < dep[v])
            swap(u, v);
        u = kthAncestor(u, dep[u] - dep[v]);
        if (u == v)
            return u;
        for (int bit = LOG - 1; bit >= 0; bit--)
            if (anc[u][bit] != anc[v][bit])
                u = anc[u][bit], v = anc[v][bit];
        return anc[u][0];
    }

    void setRange(Query& q) {
        while (curr_l > q.l) operation(--curr_l);
        while (curr_r < q.r) operation(++curr_r);
        while (curr_l < q.l) operation(curr_l++);
        while (curr_r > q.r) operation(curr_r--);
    }

    inline void add(int u){
        // user implementation
    }

    inline void remove(int u){
        // user implementation
    }

    inline void operation(int idx) {
        int u = FT[idx];
        nodeFreq[u] ^= 1;
        if (nodeFreq[u] == 1) {
            add(u);
        } else {
            remove(u);
        }
    }

    int calcLog(int max_n) const {
        int log = 0;
        while ((1 << log) <= max_n) log++;
        return log;
    }

    int calcHilbertPow(int max_n) const {
        int pow = 0;
        while ((1 << pow) < max_n) pow++;
        return pow;
    }
};

int main(){
    ios_base::sync_with_stdio(false), cin.tie(nullptr), cout.tie(nullptr);
    int test_cases = 1;
    for(int tc = 1; tc <= test_cases; tc++){
    }
    return 0;
}`)
    }]);
  }
  // =================== PREFIX SUM 2D ===================
  const [pref2d] = await db.insert(templates).values({
    title: "Prefix Sum 2D",
    slug: "prefix-sum-2d",
    description: "2D prefix sum for O(1) rectangle sum queries on a static grid",
    categoryId: categoryId,
    tags: ["prefix-sum", "2d", "range-query", "static-grid"],
    complexity: "O(n\u00b7m) build, O(1) per query",
    notes: `# Prefix Sum 2D

Static 2D prefix sum for O(1) rectangle sum queries.

## Example
\`\`\`cpp
vector<vector<int>> mat = {{1,2,3},{4,5,6},{7,8,9}};
Prefix_2D<int> ps(3, 3);
ps.Build_Prefix(mat);
cout << ps.Get_Query(1, 1, 2, 2);  // 1+2+4+5 = 12
\`\`\`

## Formula
sum([x1..x2] \u00d7 [y1..y2]) = prefix[x2][y2] - prefix[x1-1][y2] - prefix[x2][y1-1] + prefix[x1-1][y1-1]

## Methods
- Build_Prefix(matrix) — build from 0-indexed input matrix
- Get_Query(x1, y1, x2, y2) — O(1) rectangle sum`,
  }).returning();
  if (pref2d) {
    await db.insert(templateCodes).values([{
      templateId: pref2d.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;
#define ll long long

template < typename T = int > struct Prefix_2D {

    int n, m;
    vector < vector < T > > prefix;

    Prefix_2D(int N = 0, int M = 0){
        n = N, m = M;
        prefix.assign(n + 5, vector < T > (m + 5));
    }

    T Get_Query(int x1, int y1, int x2, int y2){
        if(x1 > x2) swap(x1, x2);
        if(y1 > y2) swap(y1, y2);
        return prefix[x2][y2] - prefix[x1 - 1][y2] - prefix[x2][y1 - 1] + prefix[x1 - 1][y1 - 1];
    }

    void Build_Prefix(vector < vector < T > >& matrix){
        for(int i = 1; i <= n; i++)
            for(int j = 1; j <= m; j++)
                prefix[i][j] = matrix[i - 1][j - 1] + prefix[i][j - 1] + prefix[i - 1][j] - prefix[i - 1][j - 1];
    }

    void Print_Prefix(){
        for(int i = 1; i <= n; i++, cout << '\n')
            for(int j = 1; j <= m && cout << prefix[i][j] << ' '; j++);
    }
};`)
    }]);
  }

  // =================== PARTIAL SUM 2D ===================
  const [part2d] = await db.insert(templates).values({
    title: "Partial Sum 2D (Difference Array)",
    slug: "partial-sum-2d",
    description: "2D difference array for range updates (+1 to rectangle) then point queries",
    categoryId: categoryId,
    tags: ["partial-sum", "difference-array", "2d", "range-update"],
    complexity: "O(1) per update, O(n\u00b7m) propagation, O(1) per query",
    notes: `# Partial Sum 2D (Difference Array)

2D difference array for applying many rectangle additions (+1) then querying individual cell values.

## Example
\`\`\`cpp
Partial_2D<int> pd(5, 5);
// Apply +1 to rectangle [1,1]-[3,3]
pd.build_partial(1);  // reads 1 query "1 1 3 3" from cin
cout << pd.get(2, 2); // 1
cout << pd.get(4, 4); // 0
\`\`\`

## Methods
- build_partial(queries) — reads \`queries\` rectangles from cin, applies +1 each, propagates
- get(x, y) — final value at (x, y)
- print() — print final grid`,
  }).returning();
  if (part2d) {
    await db.insert(templateCodes).values([{
      templateId: part2d.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;
#define ll long long

template < typename T = int > struct Partial_2D {

    vector < vector < T > > partial;
    int n, m;

    Partial_2D(int N, int M){
        n = N, m = M;
        partial.assign(n + 5, vector < T > (m + 5));
    }

    void build_partial(int queries){
        while(queries--){
            int x1, y1, x2, y2, k = 1;
            cin >> x1 >> y1 >> x2 >> y2;
            if(x1 > x2) swap(x1, x2);
            if(y1 > y2) swap(y1, y2);
            partial[x2][y2] += k, partial[x2][y1 - 1] -= k;
            partial[x1 - 1][y2] -= k, partial[x1 - 1][y1 - 1] += k;
        }
        for(int i = n; i >= 0; i--)
            for(int j = m; j >= 0; j--)
                partial[i][j] += partial[i][j + 1];
        for(int i = n; i >= 0; i--)
            for(int j = m; j >= 0; j--)
                partial[i][j] += partial[i + 1][j];
    }

    T get(int x, int y){
        return partial[x][y];
    }

    void print(){
        for(int i = 1; i <= n; i++, cout << "\n")
            for(int j = 1; j <= m && cout << partial[i][j] << " "; j++);
    }
};`)
    }]);
  }
}