import { templates, templateCodes } from "../schema";
import { stripMain, type Db, type CatMap } from "./helpers";

export async function seedDataStruct(db: Db, catMap: CatMap) {
  const categoryId = catMap["data-structures"];
  if (!categoryId) return;

  // 1. Binary Search Tree --------------------------------------------------------
  const [bst] = await db.insert(templates).values({
    title: "Binary Search Tree",
    slug: "binary-search-tree",
    description: "BST with insert, delete, search, and traversals",
    categoryId: categoryId,
    tags: ["bst", "binary-search-tree", "tree"],
    complexity: "O(log n) average, O(n) worst",
    notes: `# Binary Search Tree

## Usage Example
\`\`\`cpp
BST* root = nullptr;
BST bst;
root = bst.Insert(root, 5);
root = bst.Insert(root, 3);
root = bst.Insert(root, 7);
bst.Inorder(root);              // 3 5 7
cout << bst.Search(root, 3);    // 1
root = bst.Delete_Node(root, 5);
\`\`\`

## Methods
- \`Insert(root, val)\` → insert, return new root
- \`Search(root, val)\` → bool, check existence
- \`Delete_Node(root, key)\` → delete key, return new root
- \`Inorder\`, \`Preorder\`, \`Postorder\`, \`Level_Order\` → traversals
- \`minValueNode\`, \`maxValueNode\` → extremal nodes

## Complexity
Average O(log n), worst O(n) unbalanced
`,
  }).returning();
  if (bst) {
    await db.insert(templateCodes).values([{
      templateId: bst.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;
#define all(vec) vec.begin(), vec.end()
#define sz(x) int(x.size())
#define fi first
#define se second
#define ll long long

struct BST {
    int data;
    BST *left, *right;
    BST(int data = 0) {
        this->data = data;
        left = right = nullptr;
    }
    BST* Insert(BST* root, int val) {
        if (!root) return new BST(val);
        if (val > root->data) root->right = Insert(root->right, val);
        else root->left = Insert(root->left, val);
        return root;
    }
    void Inorder(BST* root) {
        if (!root) return;
        Inorder(root->left); cout << root->data << " "; Inorder(root->right);
    }
    void Preorder(BST* root) {
        if (!root) return;
        cout << root->data << " "; Preorder(root->left); Preorder(root->right);
    }
    void Postorder(BST* root) {
        if (!root) return;
        Postorder(root->left); Postorder(root->right); cout << root->data << " ";
    }
    void Level_Order(BST* root) {
        if (!root) return;
        queue<BST*> bfs; bfs.push(root);
        while (!bfs.empty()) {
            BST* cur = bfs.front(); bfs.pop();
            cout << cur->data << " ";
            if (cur->left) bfs.push(cur->left);
            if (cur->right) bfs.push(cur->right);
        }
    }
    bool Search(BST* root, int val) {
        if (!root) return false;
        if (root->data == val) return true;
        if (val > root->data) return Search(root->right, val);
        return Search(root->left, val);
    }
    BST* minValueNode(BST* node) {
        BST* cur = node;
        while (cur && cur->left) cur = cur->left;
        return cur;
    }
    BST* maxValueNode(BST* node) {
        BST* cur = node;
        while (cur && cur->right) cur = cur->right;
        return cur;
    }
    BST* Delete_Node(BST* root, int key) {
        if (!root) return root;
        if (key < root->data) root->left = Delete_Node(root->left, key);
        else if (key > root->data) root->right = Delete_Node(root->right, key);
        else {
            if (!root->left && !root->right) return nullptr;
            else if (!root->left) {
                BST* temp = root->right; delete root; return temp;
            } else if (!root->left) {
                BST* temp = root->left; delete root; return temp;
            }
            BST* temp = minValueNode(root->right);
            root->data = temp->data;
            root->right = Delete_Node(root->right, temp->data);
        }
        return root;
    }
};`)
    }]);
  }

  // 2. Segment Tree ---------------------------------------------------------------
  const [segTree] = await db.insert(templates).values({
    title: "Segment Tree",
    slug: "segment-tree",
    description: "Generic segment tree supporting range queries and point updates with custom operation",
    categoryId: categoryId,
    tags: ["segment-tree", "range-query", "point-update", "data-structure"],
    complexity: "O(log n) per query",
    notes: `# Segment Tree

## Usage Example
\`\`\`cpp
Segment_Tree<> seg(5, {1, 2, 3, 4, 5});
seg.update(3, 10);
cout << seg.query(1, 5);        // 22

auto maxOp = [](int a, int b) { return max(a, b); };
Segment_Tree<int, decltype(maxOp)> seg2(n, arr, maxOp, INT_MIN);
cout << seg2.query(1, n);
\`\`\`

## Methods
- \`build(nums)\`, \`update(index, value)\`, \`query(l, r)\`
- \`operator[](index)\`, \`size()\`, \`print()\`

## Complexity
O(log n) per query/update
`,
  }).returning();
  if (segTree) {
    await db.insert(templateCodes).values([{
      templateId: segTree.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;
#define all(vec) vec.begin(), vec.end()
#define sz(x) int(x.size())
#define fi first
#define se second
#define ll long long

template < typename T = int, typename Op = plus < T >, int Base = 0, typename numsType = T >
class Segment_Tree {
private:
    int n, max_level;
    T DEFAULT;
    vector < T > tree;
    Op operation;
    void build(const vector < numsType >& nums, int idx, int lx, int rx) {
        if (Base ? lx >= int(nums.size()) : lx > int(nums.size())) return;
        if (rx == lx) tree[idx] = T(nums[lx - !Base]);
        else {
            int mx = (rx + lx) / 2;
            build(nums, idx * 2, lx, mx);
            build(nums, idx * 2 + 1, mx + 1, rx);
            tree[idx] = operation(tree[idx * 2], tree[idx * 2 + 1]);
        }
    }
    void update(int index, numsType value, int idx, int lx, int rx) {
        if (rx == lx) tree[idx] = T(value);
        else {
            int mx = (rx + lx) / 2;
            if (index <= mx) update(index, value, idx * 2, lx, mx);
            else update(index, value, idx * 2 + 1, mx + 1, rx);
            tree[idx] = operation(tree[idx * 2], tree[idx * 2 + 1]);
        }
    }
    T query(int l, int r, int idx, int lx, int rx) const {
        if (lx > r || l > rx) return DEFAULT;
        if (lx >= l && rx <= r) return tree[idx];
        int mx = (lx + rx) / 2;
        return operation(query(l, r, idx * 2, lx, mx), query(l, r, idx * 2 + 1, mx + 1, rx));
    }
public:
    Segment_Tree(int n = 0, const vector < numsType >& nums = vector < numsType >(), Op op = Op{}, T def = T{})
        : n(n), max_level(1), DEFAULT(def), operation(op) {
        while ((1 << max_level) < n) max_level++;
        tree = vector < T >(4 * n, DEFAULT);
        if (!nums.empty()) build(nums, 1, 1, n);
    }
    void build(const vector < numsType >& nums) {
        fill(tree.begin(), tree.end(), DEFAULT);
        build(nums, 1, 1, n);
    }
    void update(int index, numsType value) { update(index, value, 1, 1, n); }
    T query(int l, int r) const { return query(l, r, 1, 1, n); }
    T operator[](int index) const { return query(index, index, 1, 1, n); }
    int size() const { return n; }
    void print() const {
        if (int(tree.size()) <= 1) return;
        int level = 0;
        queue < pair < int, int > > q; q.push({1, level});
        while (!q.empty()) {
            int nodes = q.size();
            int spaces = (1 << (max_level - level + 1)) - 1;
            int lead = (1 << (max_level - level)) - 1;
            cout << string(lead * 2, ' ');
            while (nodes--) {
                auto [idx, lvl] = q.front(); q.pop();
                cout << setw(2) << tree[idx];
                if (nodes) cout << string(spaces * 2, ' ');
                if (idx * 2 + 1 < int(tree.size())) { q.push({idx * 2, lvl + 1}); q.push({idx * 2 + 1, lvl + 1}); }
            }
            cout << "\n"; level++;
        }
    }
};`)
    }]);
  }

  // 3. Segment Tree — Lazy ---------------------------------------------------------
  const [lazySeg] = await db.insert(templates).values({
    title: "Segment Tree — Lazy Propagation",
    slug: "lazy-segment-tree",
    description: "Segment tree with lazy propagation for range updates and range queries",
    categoryId: categoryId,
    tags: ["segment-tree", "lazy-propagation", "range-update"],
    complexity: "O(log n) per range operation",
    notes: `# Lazy Propagation Segment Tree

## Usage Example
\`\`\`cpp
Lazy_Propagation seg(5, {1, 2, 3, 4, 5});
seg.update(2, 4, 10);         // add 10 to [2,4]
cout << seg.query(1, 5);      // 45
\`\`\`

## Customization
Edit CUSTOMIZE block. Default: range add + range sum.
- assign+min: \`combine=min(a,b)\` \`apply=lz\` \`compose=new_lz\`
- add+min:    \`combine=min(a,b)\` \`apply=val+lz\` \`compose=old+new\`

## Methods
- \`update(l, r, v)\` range update, \`update(i, v)\` point, \`query(l, r)\`

## Complexity
O(log n) per range operation
`,
  }).returning();
  if (lazySeg) {
    await db.insert(templateCodes).values([{
      templateId: lazySeg.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;
#define all(vec) vec.begin(), vec.end()
#define sz(x) int(x.size())
#define fi first
#define se second
#define ll long long

struct Lazy_Propagation {
    // ═══ CUSTOMIZE ════════════════════════════════════
    using T = ll;
    using Lazy = ll;
    T IDENTITY = 0;
    Lazy LAZY_ID = 0;
    T combine(T a, T b) { return a + b; }
    T apply(T val, Lazy lz, int len) { return val + lz * len; }
    Lazy compose(Lazy old_lz, Lazy new_lz) { return old_lz + new_lz; }
    // ═══════════════════════════════════════════════════
    struct Node { T val; Lazy lazy; };
    int n;
    vector < Node > tree;
    Lazy_Propagation(int n, const vector < T > &v = vector < T >())
        : n(n), tree(4 * n + 4, {IDENTITY, LAZY_ID}) { if (!v.empty()) build(v, 1, 1, n); }
private:
    void push_up(int idx) { tree[idx].val = combine(tree[idx * 2].val, tree[idx * 2 + 1].val); }
    void apply_node(int idx, int lx, int rx, Lazy lz) {
        tree[idx].val = apply(tree[idx].val, lz, rx - lx + 1);
        tree[idx].lazy = compose(tree[idx].lazy, lz);
    }
    void push_down(int idx, int lx, int rx) {
        if (tree[idx].lazy == LAZY_ID) return;
        int mid = (lx + rx) / 2;
        apply_node(idx * 2, lx, mid, tree[idx].lazy);
        apply_node(idx * 2 + 1, mid + 1, rx, tree[idx].lazy);
        tree[idx].lazy = LAZY_ID;
    }
    void build(const vector < T > &v, int idx, int lx, int rx) {
        if (lx == rx) { tree[idx] = {lx <= sz(v) ? v[lx - 1] : IDENTITY, LAZY_ID}; return; }
        int mid = (lx + rx) / 2;
        build(v, idx * 2, lx, mid); build(v, idx * 2 + 1, mid + 1, rx);
        push_up(idx);
    }
    void update(int l, int r, Lazy v, int idx, int lx, int rx) {
        if (lx >= l && rx <= r) { apply_node(idx, lx, rx, v); return; }
        if (lx > r || rx < l) return;
        push_down(idx, lx, rx);
        int mid = (lx + rx) / 2;
        update(l, r, v, idx * 2, lx, mid); update(l, r, v, idx * 2 + 1, mid + 1, rx);
        push_up(idx);
    }
    T query(int l, int r, int idx, int lx, int rx) {
        if (lx >= l && rx <= r) return tree[idx].val;
        if (lx > r || rx < l) return IDENTITY;
        push_down(idx, lx, rx);
        int mid = (lx + rx) / 2;
        return combine(query(l, r, idx * 2, lx, mid), query(l, r, idx * 2 + 1, mid + 1, rx));
    }
public:
    void update(int l, int r, Lazy v) { update(l, r, v, 1, 1, n); }
    void update(int i, Lazy v) { update(i, i, v, 1, 1, n); }
    T query(int l, int r) { return query(l, r, 1, 1, n); }
    T operator[](int i) { return query(i, i, 1, 1, n); }
};`)
    }]);
  }

  // 4. Persistent Segment Tree -----------------------------------------------------
  const [pst] = await db.insert(templates).values({
    title: "Persistent Segment Tree",
    slug: "persistent-segment-tree",
    description: "Immutable versioned segment tree for historical queries",
    categoryId: categoryId,
    tags: ["persistent", "segment-tree", "versioning", "immutable"],
    complexity: "O(log n) per operation, O(n log n) memory",
    notes: `# Persistent Segment Tree

## Usage Example
\`\`\`cpp
PST<ll> pst(q + 1, 1, n);
pst.build(arr);                    // version 0
pst.insert(5, 99, 1, 0);          // version 1 from version 0
cout << pst.query(1, 10, 1);      // max prefix sum at version 1
\`\`\`

## Methods
- \`build(nums)\` → version 0
- \`insert(idx, val, curr, prev)\` → new version from prev
- \`update(idx, val, curr)\` → update current version
- \`query(l, r, time)\` → query at version

## Complexity
O(log n) per op, O(n log n) memory
`,
  }).returning();
  if (pst) {
    await db.insert(templateCodes).values([{
      templateId: pst.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;
#define all(vec) vec.begin(), vec.end()
#define sz(x) int(x.size())
#define fi first
#define se second
#define ll long long

template < typename T = int, int Base = 0 > struct PST {
    struct Node {
        T val, prefix;
        Node *left, *right;
        Node(T _val = 0) {
            this->val = _val;
            this->prefix = max(0LL, _val);
            left = right = this;
        }
        Node(Node* node, Node* l, Node* r) {
            val = node->val; prefix = node->prefix; left = l; right = r;
        }
    };
    vector < Node* > roots;
    T N, Lx, Rx;
    PST(int n = 0, T lx = -1e9, T rx = 1e9) : N(n), Lx(lx), Rx(rx) {
        roots = vector < Node* >(n + 5, new Node);
    }
    Node* build(const vector < T >& nums, T l, T r) {
        if (l == r) return new Node(nums[l - !Base]);
        T mx = l + (r - l) / 2;
        Node* L = build(nums, l, mx);
        Node* R = build(nums, mx + 1, r);
        return new Node(operation(L, R), L, R);
    }
    void build(const vector < T >& nums) { roots[0] = build(nums, Lx, Rx); }
    Node* operation(Node* a, Node* b) {
        Node* m = new Node();
        m->val = a->val + b->val;
        m->prefix = max(a->prefix, a->val + b->prefix);
        return m;
    }
    Node* update(Node* root, int idx, T val, T lx, T rx) {
        if (idx < lx || idx > rx) return root;
        if (lx == rx) return new Node(val);
        T mx = lx + (rx - lx) / 2;
        Node* L = update(root->left, idx, val, lx, mx);
        Node* R = update(root->right, idx, val, mx + 1, rx);
        return new Node(operation(L, R), L, R);
    }
    void insert(int idx, T val, int curr_time, int prev_time) {
        roots[curr_time] = update(roots[prev_time], idx, val, Lx, Rx);
    }
    void update(int idx, T val, int curr_time) {
        roots[curr_time] = update(roots[curr_time], idx, val, Lx, Rx);
    }
    Node* query(Node* root, int l, int r, T lx, T rx) {
        if (root == nullptr) return new Node();
        if (lx > r || l > rx) return new Node();
        if (lx >= l && rx <= r) return root;
        int mx = (lx + rx) / 2;
        Node* L = query(root->left, l, r, lx, mx);
        Node* R = query(root->right, l, r, mx + 1, rx);
        return operation(L, R);
    }
    T query(int l, int r, int time) { return query(roots[time], l, r, Lx, Rx)->prefix; }
    T get(int time, int idx) { return query(idx, idx, time); }
};`)
    }]);
  }

  // 5. Segment Tree 2D -------------------------------------------------------------
  const [segTree2d] = await db.insert(templates).values({
    title: "Segment Tree 2D",
    slug: "segment-tree-2d",
    description: "2D segment tree for rectangle queries and point updates",
    categoryId: categoryId,
    tags: ["2d-segment-tree", "range-query", "point-update", "geometry"],
    complexity: "O(log\u00b2 n) per query/update",
    notes: `# Segment Tree 2D

## Usage Example
\`\`\`cpp
vector<vector<int>> grid = {{1,2},{3,4}};
SegmentTree2D<int> seg(2, 2, grid);
seg.update(1, 2, 7);
cout << seg.query(1, 2, 1, 2);
\`\`\`

## Methods
- \`build(grid)\`, \`update(x, y, val)\`, \`query(lx, rx, ly, ry)\`
- \`get(x, y)\`, \`rows_size()\`, \`cols_size()\`

## Complexity
O(log\u00b2 n) per query/update
`,
  }).returning();
  if (segTree2d) {
    await db.insert(templateCodes).values([{
      templateId: segTree2d.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;
#define all(vec) vec.begin(), vec.end()
#define sz(x) int(x.size())
#define fi first
#define se second
#define ll long long

template < typename T = int, typename Op = plus < T >, int Base = 0 >
struct SegmentTree2D {
    int n, m, rows, cols;
    T DEFAULT;
    vector < vector < T > > tree;
    Op operation;
    static constexpr int L(int i) { return i << 1; }
    static constexpr int R(int i) { return (i << 1) | 1; }
    void init(int n_, int m_) {
        n = n_; m = m_; rows = 4 * n; cols = 4 * m;
        tree.assign(rows, vector < T >(cols, DEFAULT));
    }
    SegmentTree2D(int n = 0, int m = 0, Op op = Op{}, T def = T{}) : DEFAULT(def), operation(op) { init(n, m); }
    SegmentTree2D(int n, int m, const vector < vector < T > >& nums, Op op = Op{}, T def = T{})
        : DEFAULT(def), operation(op) { init(n, m); build(nums); }
    void build_y(int vx, int lx, int rx, int vy, int ly, int ry, const vector < vector < T > >& vec) {
        if (Base ? lx >= sz(vec) : lx > sz(vec)) return;
        if (Base ? ly >= sz(vec[0]) : ly > sz(vec[0])) return;
        if (ly == ry) {
            if (lx == rx) tree[vx][vy] = vec[lx - !Base][ly - !Base];
            else tree[vx][vy] = operation(tree[L(vx)][vy], tree[R(vx)][vy]);
        } else {
            int my = (ly + ry) / 2;
            build_y(vx, lx, rx, L(vy), ly, my, vec);
            build_y(vx, lx, rx, R(vy), my + 1, ry, vec);
            tree[vx][vy] = operation(tree[vx][L(vy)], tree[vx][R(vy)]);
        }
    }
    void build_x(int vx, int lx, int rx, const vector < vector < T > >& vec) {
        if (lx != rx) { int mx = (lx + rx) / 2; build_x(L(vx), lx, mx, vec); build_x(R(vx), mx + 1, rx, vec); }
        build_y(vx, lx, rx, 1, 1, m, vec);
    }
    void build(const vector < vector < T > >& vec) {
        for (auto& row : tree) fill(row.begin(), row.end(), DEFAULT);
        build_x(1, 1, n, vec);
    }
    T query_y(int vx, int vy, int ly0, int ry0, int ly, int ry) const {
        if (ly > ry) return DEFAULT;
        if (ly == ly0 && ry0 == ry) return tree[vx][vy];
        int my = (ly0 + ry0) / 2;
        return operation(query_y(vx, L(vy), ly0, my, ly, min(ry, my)),
                         query_y(vx, R(vy), my + 1, ry0, max(ly, my + 1), ry));
    }
    T query_x(int vx, int lx0, int rx0, int lx, int rx, int ly, int ry) const {
        if (lx > rx) return DEFAULT;
        if (lx == lx0 && rx0 == rx) return query_y(vx, 1, 1, m, ly, ry);
        int mx = (lx0 + rx0) / 2;
        return operation(query_x(L(vx), lx0, mx, lx, min(rx, mx), ly, ry),
                         query_x(R(vx), mx + 1, rx0, max(lx, mx + 1), rx, ly, ry));
    }
    T query(int lx, int rx, int ly, int ry) const { return query_x(1, 1, n, lx, rx, ly, ry); }
    void update_y(int vx, int lx, int rx, int vy, int ly, int ry, int x, int y, T val) {
        if (ly == ry) {
            if (lx == rx) tree[vx][vy] = val;
            else tree[vx][vy] = operation(tree[L(vx)][vy], tree[R(vx)][vy]);
        } else {
            int my = (ly + ry) / 2;
            if (y <= my) update_y(vx, lx, rx, L(vy), ly, my, x, y, val);
            else update_y(vx, lx, rx, R(vy), my + 1, ry, x, y, val);
            tree[vx][vy] = operation(tree[vx][L(vy)], tree[vx][R(vy)]);
        }
    }
    void update_x(int vx, int lx, int rx, int x, int y, T val) {
        if (lx != rx) {
            int mx = (lx + rx) / 2;
            if (x <= mx) update_x(L(vx), lx, mx, x, y, val);
            else update_x(R(vx), mx + 1, rx, x, y, val);
        }
        update_y(vx, lx, rx, 1, 1, m, x, y, val);
    }
    void update(int x, int y, T val) { update_x(1, 1, n, x, y, val); }
    T get(int x, int y) const { return query(x, x, y, y); }
    int rows_size() const { return n; }
    int cols_size() const { return m; }
};`)
    }]);
  }

  // 6. Fenwick Tree (BIT 1D) -------------------------------------------------------
  const [fenwick] = await db.insert(templates).values({
    title: "Fenwick Tree (BIT)",
    slug: "fenwick-tree",
    description: "Binary Indexed Tree for prefix sum queries and point updates",
    categoryId: categoryId,
    tags: ["fenwick", "BIT", "range-query", "point-update"],
    complexity: "O(log n) per operation",
    notes: `# Fenwick Tree (BIT)

## Usage Example
\`\`\`cpp
Fenwick_Tree<int> ft(n);
ft.build(arr);
ft.add(3, 5);
cout << ft.query(1, 4);
\`\`\`

## Methods
- \`build(nums)\` O(n), \`add(idx, val)\`, \`query(l, r)\`, \`get(idx)\`, \`size()\`

## Note
Op must be invertible (sum, xor). NOT for min/max/gcd.

## Complexity
O(log n) per operation
`,
  }).returning();
  if (fenwick) {
    await db.insert(templateCodes).values([{
      templateId: fenwick.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;
#define all(vec) vec.begin(), vec.end()
#define sz(x) int(x.size())
#define fi first
#define se second
#define ll long long

template < typename T = int, typename Op = plus < T >, typename InvOp = minus < T > >
struct Fenwick_Tree {
    int n;
    T DEFAULT;
    Op op;
    InvOp inv_op;
    vector < T > tree;
    Fenwick_Tree(int sz = 0, Op op = Op{}, InvOp inv_op = InvOp{}, T def = T{})
        : n(sz), DEFAULT(def), op(op), inv_op(inv_op) { tree.assign(n + 1, DEFAULT); }
    void build(const vector < T >& nums) {
        for (int i = 0; i < sz(nums); i++) tree[i + 1] = nums[i];
        for (int i = 1; i <= n; i++) { int j = i + (i & -i); if (j <= n) tree[j] = op(tree[j], tree[i]); }
    }
    void add(int idx, T val) {
        for (++idx; idx <= n; idx += idx & -idx) tree[idx] = op(tree[idx], val);
    }
    T prefix(int idx) const {
        T ans = DEFAULT;
        for (++idx; idx > 0; idx -= idx & -idx) ans = op(ans, tree[idx]);
        return ans;
    }
    T query(int l, int r) const {
        if (l > r) return DEFAULT;
        return inv_op(prefix(r), l ? prefix(l - 1) : DEFAULT);
    }
    T get(int idx) const { return query(idx, idx); }
    int size() const { return n; }
};`)
    }]);
  }

  // 7. Fenwick Tree 2D -------------------------------------------------------------
  const [fenwick2d] = await db.insert(templates).values({
    title: "Fenwick Tree 2D",
    slug: "fenwick-tree-2d",
    description: "2D BIT for rectangle sum and point updates",
    categoryId: categoryId,
    tags: ["2d-fenwick", "BIT", "rectangle-sum"],
    complexity: "O(log\u00b2 n) per operation",
    notes: `# Fenwick Tree 2D

## Usage Example
\`\`\`cpp
Fenwick_Tree<ll> ft(n, m);
ft.build(grid);
ft.add(2, 3, 5);
cout << ft.query(1, 1, 2, 3);
\`\`\`

## Methods
- \`build(grid)\`, \`add(x, y, val)\`, \`query(x1, y1, x2, y2)\`

## Complexity
O(log\u00b2 n) per operation
`,
  }).returning();
  if (fenwick2d) {
    await db.insert(templateCodes).values([{
      templateId: fenwick2d.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;
#define all(vec) vec.begin(), vec.end()
#define sz(x) int(x.size())
#define fi first
#define se second
#define ll long long

template < typename T = int > struct Fenwick_Tree {
    int n, m;
    T DEFAULT;
    vector < vector < T > > tree;
    Fenwick_Tree(int rows = 0, int cols = 0) : n(rows), m(cols), DEFAULT(T{}) {
        tree.assign(n + 1, vector < T >(m + 1, DEFAULT));
    }
    void build(const vector < vector < T > >& nums) {
        for (int i = 0; i < sz(nums); i++)
            for (int j = 0; j < sz(nums[0]); j++)
                add(i + 1, j + 1, nums[i][j]);
    }
    void add(int x, int y, T val) {
        for (int i = x; i <= n; i += i & -i)
            for (int j = y; j <= m; j += j & -j)
                tree[i][j] += val;
    }
    T get_sum(int x, int y) const {
        T s = DEFAULT;
        for (int i = x; i > 0; i -= i & -i)
            for (int j = y; j > 0; j -= j & -j)
                s += tree[i][j];
        return s;
    }
    T query(int x1, int y1, int x2, int y2) const {
        if (x1 > x2) swap(x1, x2);
        if (y1 > y2) swap(y1, y2);
        return get_sum(x2, y2) - get_sum(x1 - 1, y2) - get_sum(x2, y1 - 1) + get_sum(x1 - 1, y1 - 1);
    }
};`)
    }]);
  }

  // 8. Fenwick Tree Range ----------------------------------------------------------
  const [fenwickRange] = await db.insert(templates).values({
    title: "Fenwick Tree — Range Updates",
    slug: "fenwick-tree-range",
    description: "BIT supporting both range updates and range sum queries",
    categoryId: categoryId,
    tags: ["fenwick", "BIT", "range-update", "range-query"],
    complexity: "O(log n) per operation",
    notes: `# Fenwick Tree — Range Updates

## Usage Example
\`\`\`cpp
Fenwick_Tree_Range<ll> ft(n);
ft.build(arr);
ft.add(2, 5, 3);
cout << ft.query(1, 6);
\`\`\`

## Methods
- \`build(nums)\`, \`add(l, r, val)\`, \`add(idx, val)\`, \`query(l, r)\`, \`size()\`

## Complexity
O(log n) per operation
`,
  }).returning();
  if (fenwickRange) {
    await db.insert(templateCodes).values([{
      templateId: fenwickRange.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;
#define all(vec) vec.begin(), vec.end()
#define sz(x) int(x.size())
#define fi first
#define se second
#define ll long long

template < typename T = int > struct Fenwick_Tree_Range {
    int N;
    T DEFAULT;
    vector < T > M, C;
    Fenwick_Tree_Range(int sz = 0) : N(sz + 1), DEFAULT(T{}) { M.assign(N + 1, DEFAULT); C.assign(N + 1, DEFAULT); }
    void build(const vector < T >& nums) { for (int i = 0; i < sz(nums); i++) add(i, i, nums[i]); }
    void add_range(int idx, T addM, T addC) {
        for (++idx; idx <= N; idx += idx & -idx) { M[idx] += addM; C[idx] += addC; }
    }
    void add(int l, int r, T val) {
        add_range(l, val, -val * (l - 1));
        add_range(r + 1, -val, val * r);
    }
    void add(int idx, T val) { add(idx, idx, val); }
    T get(int idx) const {
        T ans = DEFAULT; int pos = idx;
        for (++idx; idx > 0; idx -= idx & -idx) ans += pos * M[idx] + C[idx];
        return ans;
    }
    T query(int L, int R) const { if (L > R) return DEFAULT; return get(R) - get(L - 1); }
    int size() const { return N - 1; }
};`)
    }]);
  }

  // 9. Sparse Table ----------------------------------------------------------------
  const [sparseTable] = await db.insert(templates).values({
    title: "Sparse Table",
    slug: "sparse-table",
    description: "Static RMQ with O(1) queries and O(n log n) preprocessing",
    categoryId: categoryId,
    tags: ["sparse-table", "RMQ", "static-query"],
    complexity: "O(1) for idempotent ops, O(n log n) build",
    notes: `# Sparse Table

## Usage Example
\`\`\`cpp
Sparse_Table<int> st(n, arr);
cout << st.query(1, n);              // O(1) min

auto sumOp = [](ll a, ll b) { return a + b; };
Sparse_Table<ll, decltype(sumOp)> st2(n, arr, sumOp, 0LL);
cout << st2.query(0, n - 1, true);   // O(log n) sum
\`\`\`

## Methods
- \`query(L, R, is_overlap = false)\`
  - false: O(1) for idempotent ops (min/max/gcd)
  - true: O(log n) for any associative op

## Complexity
O(n log n) build, O(1) or O(log n) query
`,
  }).returning();
  if (sparseTable) {
    await db.insert(templateCodes).values([{
      templateId: sparseTable.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;
#define all(vec) vec.begin(), vec.end()
#define sz(x) int(x.size())
#define fi first
#define se second
#define ll long long

template < typename T >
struct MinOp {
    constexpr T operator()(const T& a, const T& b) const { return a < b ? a : b; }
};

template < typename T = int, typename Op = MinOp < T >, int Base = 0, typename numsType = T >
class Sparse_Table {
private:
    int n, LOG;
    vector < vector < T > > table;
    vector < int > Bin_Log;
    Op operation;
    T DEFAULT;
    void Build_Table() {
        for (int log = 1; log < LOG; log++)
            for (int i = 1; i + (1 << log) - 1 <= n; i++)
                table[i][log] = operation(table[i][log - 1], table[i + (1 << (log - 1))][log - 1]);
    }
    T query_1(int L, int R) {
        int log = Bin_Log[R - L + 1];
        return operation(table[L][log], table[R - (1 << log) + 1][log]);
    }
    T query_log_n(int L, int R) {
        T ans = DEFAULT;
        for (int log = LOG; log >= 0; log--) {
            if (L + (1 << log) - 1 <= R) { ans = operation(ans, table[L][log]); L += 1 << log; }
        }
        return ans;
    }
public:
    Sparse_Table(int N = 0, const vector < numsType >& vec = vector < numsType >(),
                 Op op = Op{}, T def = numeric_limits < T >::max())
        : n(N), LOG(__lg(n) + 1), operation(op), DEFAULT(def) {
        table = vector < vector < T > >(n + 10, vector < T >(LOG, DEFAULT));
        Bin_Log = vector < int >(n + 10);
        for (int i = 2; i <= n; i++) Bin_Log[i] = Bin_Log[i >> 1] + 1;
        for (int i = 1; i <= N; i++) table[i][0] = T(vec[i - !Base]);
        Build_Table();
    }
    T query(int L, int R, bool is_overlap = false) {
        return !is_overlap ? query_1(L, R) : query_log_n(L, R);
    }
};`)
    }]);
  }

  // 10. DSU / Union-Find -----------------------------------------------------------
  const [dsu] = await db.insert(templates).values({
    title: "DSU / Union-Find",
    slug: "dsu",
    description: "Disjoint Set Union with path compression, union by size, and component tracking",
    categoryId: categoryId,
    tags: ["dsu", "union-find", "disjoint-set", "connectivity"],
    complexity: "O(\u03b1(n)) amortized per operation",
    notes: `# DSU / Union-Find

## Usage Example
\`\`\`cpp
DSU<> dsu(5);
dsu.union_sets(1, 2);
dsu.union_sets(3, 4);
cout << dsu.is_same_sets(1, 3);     // 0
cout << dsu.get_size(1);            // 2
cout << dsu.get_components_number(); // 3
\`\`\`

## Methods
- \`find_leader(u)\`, \`is_same_sets(u,v)\`, \`union_sets(u,v)\`
- \`get_size(u)\`, \`get_components_number()\`, \`get_components()\`, \`print()\`

## Complexity
O(\u03b1(n)) amortized per operation
`,
  }).returning();
  if (dsu) {
    await db.insert(templateCodes).values([{
      templateId: dsu.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;
#define all(vec) vec.begin(), vec.end()
#define sz(x) int(x.size())
#define fi first
#define se second
#define ll long long

template < typename T = int, int Base = 1 > struct DSU {
    vector < T > parent, Gsize, nxt, tail, pos, roots;
    DSU(int MaxNodes) {
        parent = Gsize = roots = tail = pos = nxt = vector < T >(MaxNodes + Base);
        for (int i = Base; i < MaxNodes + Base; i++) {
            parent[i] = roots[i] = pos[i] = tail[i] = i;
            nxt[i] = -1, Gsize[i] = 1;
        }
    }
    T find_leader(int node) {
        return parent[node] = (parent[node] == node ? node : find_leader(parent[node]));
    }
    bool is_same_sets(int u, int v) { return find_leader(u) == find_leader(v); }
    void union_sets(int u, int v) {
        int leader_u = find_leader(u), leader_v = find_leader(v);
        if (leader_u == leader_v) return;
        if (Gsize[leader_u] < Gsize[leader_v]) swap(leader_u, leader_v);
        int p = pos[leader_v];
        Gsize[leader_u] += Gsize[leader_v];
        parent[leader_v] = leader_u;
        roots[p] = roots.back(); pos[roots[p]] = p; roots.pop_back();
        nxt[tail[leader_u]] = leader_v;
        tail[leader_u] = tail[leader_v];
    }
    void print() {
        for (int root = Base; root < sz(roots); root++) {
            for (int u = roots[root]; ~u; u = nxt[u])
                cout << u << " \\n"[!~nxt[u]];
        }
    }
    vector < vector < int > > get_components() {
        vector < vector < int > > components;
        for (int root = Base; root < sz(roots); root++) {
            vector < int > component;
            for (int u = roots[root]; ~u; u = nxt[u]) component.push_back(u);
            components.push_back(component);
        }
        return components;
    }
    int get_size(int u) { return Gsize[find_leader(u)]; }
    int get_components_number() { return sz(roots) - Base; }
};`)
    }]);
  }

  // 11. Ordered Set (pb_ds) ----------------------------------------------------
  const [orderedSet] = await db.insert(templates).values({
    title: "Ordered Set (pb_ds)",
    slug: "ordered-set",
    description: "Policy-based order statistics tree with find_by_order and order_of_key",
    categoryId: categoryId,
    tags: ["ordered-set", "order-statistics", "pb_ds", "tree"],
    complexity: "O(log n) per operation",
    notes: `# Ordered Set (pb_ds)

## Usage Example
\`\`\`cpp
Ordered_Multiset<int> ms;
ms.insert(3); ms.insert(1); ms.insert(3);
cout << ms[0];             // 1
cout << ms.count(3);       // 2
cout << ms.order_of_key(3); // 1
ms.erase(3);
\`\`\`

## Methods
- \`insert(val)\`, \`erase(val)\`, \`is_exist(val)\`, \`at(idx)\`, \`operator[](idx)\`
- \`first_idx(val)\`, \`last_idx(val)\`, \`count(val)\`, \`order_of_key(val)\`
- \`find_by_order(idx)\`, \`size()\`, \`clear()\`

## Complexity
O(log n) per operation
`,
  }).returning();
  if (orderedSet) {
    await db.insert(templateCodes).values([{
      templateId: orderedSet.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
#include <ext/pb_ds/assoc_container.hpp>
#include <ext/pb_ds/tree_policy.hpp>

using namespace std;
using namespace __gnu_pbds;

template <typename K, typename V, typename Comp = std::less<K>>
using ordered_map = tree<K, V, Comp, rb_tree_tag, tree_order_statistics_node_update>;
template <typename K, typename Comp = std::less<K>>
using ordered_set = ordered_map<K, null_type, Comp>;

template <typename K, typename V, typename Comp = std::less_equal<K>>
using ordered_multimap = tree<K, V, Comp, rb_tree_tag, tree_order_statistics_node_update>;
template <typename K, typename Comp = std::less_equal<K>>
using ordered_multiset = ordered_multimap<K, null_type, Comp>;

template < typename T = int , typename CompFunction = std::less_equal < T > > struct Ordered_Multiset {
    
    ordered_multiset < T, CompFunction > mst;
    int Mode;

    Ordered_Multiset(bool isSmaller = true) {
        mst.clear();
        Mode = !isSmaller ? 1 : -1;
    }
    
    Ordered_Multiset(vector < T > &vec, bool isSmaller = true) {
        mst.clear();
        for (auto &x : vec) 
            mst.insert(x);
        Mode = !isSmaller ? 1 : -1;
    }

    void insert(T val) { mst.insert(val); }

    bool is_exist(T val) { 
        if((mst.upper_bound(val)) == mst.end()) return false;
        return ((*mst.upper_bound(val)) == val);
    }

    void erase(T val) {
        if(is_exist(val)) mst.erase(mst.upper_bound(val));
    }
    
    T at(int idx) { return (*mst.find_by_order(idx)); }
    T operator [] (int idx) { return at(idx); }

    int first_idx(T val) { 
        if(!is_exist(val)) return -1;
        return (mst.order_of_key(val));
    }

    int last_idx(T val) {
        if(!is_exist(val)) return -1;
        if(at(sz(mst) - 1) == val) return sz(mst) - 1;
        return first_idx(*mst.lower_bound(val)) - 1;
    }

    T count(T val) { 
        if(!is_exist(val)) return 0;
        return last_idx(val) - first_idx(val) + 1;
    }

    void clear() { mst.clear(); }
    int size() { return sz(mst); }

    int order_of_key(T val) { return mst.order_of_key(val - Mode); }

    typename ordered_multiset < T, CompFunction >::iterator find_by_order(int idx) {
        return mst.find_by_order(idx);
    }

    friend ostream& operator << (ostream &out, const Ordered_Multiset < T, CompFunction > &mst) { 
        for (const T &x : mst.mst) out << x << ' '; 
        return out;
    }
};`)
    }]);
  }

  // 12. Trie (String) ----------------------------------------------------------
  const [trie] = await db.insert(templates).values({
    title: "Trie",
    slug: "trie",
    description: "Prefix tree for string insert, search, erase, and prefix queries",
    categoryId: categoryId,
    tags: ["trie", "prefix-tree", "string"],
    complexity: "O(|S|) per operation",
    notes: `# Trie

## Usage Example
\`\`\`cpp
Trie<TrieMode::Lowercase> t;
t.insert("hello");
t.insert("hell");
cout << t.search("hello");     // 1
cout << t.is_prefix("hel");    // 1
t.erase("hello");
cout << t.search("hello");     // 0
\`\`\`

## Modes
- \`TrieMode::Lowercase\` — 'a'-'z' (26 children)
- \`TrieMode::Uppercase\` — 'A'-'Z' (26 children)
- \`TrieMode::Digits\` — '0'-'9' (10 children)

## Methods
- \`insert(word)\`, \`search(word)\`, \`erase(word)\`, \`is_prefix(word)\`

## Complexity
O(|S|) per operation
`,
  }).returning();
  if (trie) {
    await db.insert(templateCodes).values([{
      templateId: trie.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>

using namespace std;

enum class TrieMode { Lowercase, Uppercase, Digits };

template < TrieMode Mode >
class Trie {
public:
    Trie() : root(new Node()) {}

    void insert(const string& word) {
        Node* curr = root;
        for (char c : word) {
            int index = charToIndex(c);
            if (!curr -> children[index]) 
                curr -> children[index] = new Node();
            curr = curr -> children[index];
            curr -> freq++;
        }
        curr -> is_word = true;
    }

    bool search(const string& word) const {
        const Node* curr = root;
        for (char c : word) {
            int index = charToIndex(c);
            if (!curr -> children[index]) return false;
            curr = curr -> children[index];
        }
        return curr -> is_word;
    }

    void erase(const string& word) { if (!search(word)) return; erase(word, 0, root); }

    bool is_prefix(const string& word) const {
        const Node* curr = root;
        for (char c : word) {
            int index = charToIndex(c);
            if (!curr -> children[index]) return false;
            curr = curr -> children[index];
        }
        return true;
    }
    
private:
    inline static constexpr int charSize() {
        switch (Mode) {
            case TrieMode::Lowercase: return 26;
            case TrieMode::Uppercase: return 26;
            case TrieMode::Digits:    return 10;
        }
        return 0;
    }

    inline static int charToIndex(char c) {
        switch (Mode) {
            case TrieMode::Lowercase: return c - 'a';
            case TrieMode::Uppercase: return c - 'A';
            case TrieMode::Digits:    return c - '0';
        }
        return -1;
    }

    struct Node {
        Node* children[charSize()] = {nullptr};
        bool is_word = false;
        int freq = 0;
    };

    Node* root;

    void erase(const std::string& word, size_t idx, Node* curr) {
        if (idx == word.size()) { curr -> is_word = false; return; }
        int index = charToIndex(word[idx]);
        if (curr -> children[index]) {
            erase(word, idx + 1, curr -> children[index]);
            curr -> children[index] -> freq--;
            if (curr -> children[index] -> freq == 0) {
                delete curr -> children[index];
                curr -> children[index] = nullptr;
            }
        }
    }
};`)
    }]);
  }

  // 13. Binary Trie ------------------------------------------------------------
  const [binaryTrie] = await db.insert(templates).values({
    title: "Binary Trie",
    slug: "binary-trie",
    description: "Bit-based trie for XOR maximum queries and integer insert/erase",
    categoryId: categoryId,
    tags: ["binary-trie", "bitwise", "xor", "trie"],
    complexity: "O(log MAX) per operation",
    notes: `# Binary Trie

## Usage Example
\`\`\`cpp
Trie t;
vector<int> arr = {3, 10, 5, 25, 2};
for(int x : arr) t.insert(x);
t.erase(3);
cout << t.search(10); // 1
\`\`\`

## Methods
- \`insert(x)\`, \`erase(x)\`, \`search(x)\`

## Common Use
Insert all elements, then for each x traverse choosing opposite bit to maximize XOR greedily.

## Complexity
O(log MAX) per operation (MAX = 2^30)
`,
  }).returning();
  if (binaryTrie) {
    await db.insert(templateCodes).values([{
      templateId: binaryTrie.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>

using namespace std;

class Trie {
public:
    struct Node {
        Node* child[2];
        int freq;
        
        Node() : freq(0) { child[0] = child[1] = nullptr; }
    };

    Node* root;
    static constexpr int LOG = 30;

    Trie() : root(new Node()) {}

    void insert(int x) {
        Node* curr = root;
        for(int bit = LOG; bit >= 0; --bit) {
            int bit_val = (x >> bit) & 1;
            if(!curr -> child[bit_val])
                curr -> child[bit_val] = new Node();
            curr = curr -> child[bit_val];
            ++curr -> freq;
        }
    }

    void erase(int x) {
        if (search(x)) erase(x, LOG, root);
    }

    bool search(int x) const {
        Node* curr = root;
        for(int bit = LOG; bit >= 0; --bit) {
            int bit_val = (x >> bit) & 1;
            if(!curr -> child[bit_val]) return false;
            curr = curr -> child[bit_val];
        }
        return true;
    }
    
private:
    void erase(int x, int bit, Node* curr) {
        if(bit < 0) return;
        int bit_val = (x >> bit) & 1;
        if (curr -> child[bit_val]) {
            erase(x, bit - 1, curr -> child[bit_val]);
            if (--curr -> child[bit_val] -> freq == 0) {
                delete curr -> child[bit_val];
                curr -> child[bit_val] = nullptr;
            }
        }
    }
};`)
    }]);
  }

  // 14. Heavy Light Decomposition ----------------------------------------------
  const [hld] = await db.insert(templates).values({
    title: "Heavy Light Decomposition",
    slug: "hld",
    description: "Path and subtree queries on trees via heavy-light decomposition",
    categoryId: categoryId,
    tags: ["hld", "heavy-light", "tree", "decomposition"],
    complexity: "O(log\u00b2 n) per path query",
    notes: `# Heavy Light Decomposition

## Usage Example
\`\`\`cpp
HLD<int> hld(n, adj, 1);
Segment_Tree<int,int,1> seg(n);
seg.update(hld.pos[u], node_val[u]);
auto res = hld.query(u, v,
    [](int a, int b){ return a + b; },
    [&](int l, int r){ return seg.query(l, r); }, 0);
\`\`\`

## Template Params
- \`T\` = value type (default int)
- \`VAL_ON_EDGE\` = false (node values) or true (edge values)

## Methods
- \`update(u, val, seg_update)\` point update on node
- \`update(u, v, val, seg_update)\` edge update
- \`query(u, v, combine, seg_query, default)\` path query

## Complexity
O(log\u00b2 n) per path query
`,
  }).returning();
  if (hld) {
    await db.insert(templateCodes).values([{
      templateId: hld.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>

using namespace std;

template < typename T = int, bool VAL_ON_EDGE = false >
class HLD {
private:
    const vector < vector < int > > & adj;
    vector < int > dep, par, root, pos, SubtreeSz, child;
    int nxtPos;

    void init(int u, int p = -1, int d = 0) {
        dep[u] = d, par[u] = p, SubtreeSz[u] = 1;
        for (auto& v : adj[u]) {
            if (v == p) continue;
            init(v, u, d + 1);
            SubtreeSz[u] += SubtreeSz[v];
            if (SubtreeSz[v] > SubtreeSz[child[u]]) 
                child[u] = v;
        }
    }

    void build(int u, bool newChain = true) {
        root[u] = newChain ? u : root[par[u]];
        pos[u] = nxtPos++;
        if (child[u]) build(child[u], false);
        for (auto& v : adj[u]) {
            if (v == par[u] || v == child[u]) continue;
            build(v, true);
        }
    }

    void makeULower(int& u, int& v) {
        if (dep[root[u]] < dep[root[v]] || (root[u] == root[v] && dep[u] < dep[v]))
            swap(u, v);
    }

    pair < int, int > moveUp(int& u) {
        pair < int, int > ret = {pos[root[u]], pos[u]};
        u = par[root[u]];
        return ret;
    }

    vector < pair < int, int > > queryPath(int u, int v) {
        vector < pair < int, int > > ret;
        while (root[u] != root[v]) {
            makeULower(u, v);
            ret.push_back(moveUp(u));
        }
        makeULower(u, v);
        if (!VAL_ON_EDGE) 
            ret.push_back({pos[v], pos[u]});
        else if (u != v) 
            ret.push_back({pos[v] + 1, pos[u]});
        return ret;
    }

    int getChild(int u, int v) {
        if (par[u] == v) return u;
        return v;
    }

public:
    HLD(int n, const vector < vector < int > > & G, int treeRoot = 1)
        : adj(G), dep(n + 5), par(n + 5), root(n + 5), pos(n + 5), SubtreeSz(n + 5), child(n + 5), nxtPos(1) {
        init(treeRoot);
        build(treeRoot);
    }

    void update(int u, T val, const function < void(T, T) > & update) {
        update(pos[u], val);
    }

    void update(int u, int v, T val, const function < void(T, T) > & update) {
        u = getChild(u, v);
        update(pos[u], val);
    }

    T query(int u_q, int v_q, 
            const function < T(T, T) > & operation, 
            const function < T(T, T) > & query,
            const T default_value) {
        T ret = default_value;
        for (auto& [u, v] : queryPath(u_q, v_q))
            ret = operation(ret, query(u, v));
        return ret;
    }
};`)
    }]);
  }

  // 15. Monotonic Stack --------------------------------------------------------
  const [monotonicStack] = await db.insert(templates).values({
    title: "Monotonic Stack",
    slug: "monotonic-stack",
    description: "Next/prev greater/smaller element index queries in O(n)",
    categoryId: categoryId,
    tags: ["monotonic-stack", "stack", "next-greater", "next-smaller"],
    complexity: "O(n) for all four queries",
    notes: `# Monotonic Stack

## Usage Example
\`\`\`cpp
vector<int> a = {2, 1, 5, 3, 4};
auto nge = next_greater(a);  // {2, 2, 5, 4, 5}
auto pse = prev_smaller(a);  // {-1, -1, 1, 1, 3}
\`\`\`

## Functions (all return 0-indexed indices)
- \`next_greater(nums, strict=true)\` — next j > i where nums[j] > nums[i]
- \`prev_greater(nums, strict=true)\` — prev j < i where nums[j] > nums[i]
- \`next_smaller(nums, strict=true)\` — next j > i where nums[j] < nums[i]
- \`prev_smaller(nums, strict=true)\` — prev j < i where nums[j] < nums[i]
- strict=false for >= / <= variants

## Complexity
O(n) each
`,
  }).returning();
  if (monotonicStack) {
    await db.insert(templateCodes).values([{
      templateId: monotonicStack.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>

using namespace std;

template < typename T >
vector < int > next_greater(const vector < T >& nums, bool strict = true) {
    int n = nums.size();
    vector < int > res(n, n);
    stack < int > st;
    for (int i = n - 1; i >= 0; i--) {
        while (!st.empty() && (strict ? nums[st.top()] <= nums[i] : nums[st.top()] < nums[i]))
            st.pop();
        res[i] = st.empty() ? n : st.top();
        st.push(i);
    }
    return res;
}

template < typename T >
vector < int > prev_greater(const vector < T >& nums, bool strict = true) {
    int n = nums.size();
    vector < int > res(n, -1);
    stack < int > st;
    for (int i = 0; i < n; i++) {
        while (!st.empty() && (strict ? nums[st.top()] <= nums[i] : nums[st.top()] < nums[i]))
            st.pop();
        res[i] = st.empty() ? -1 : st.top();
        st.push(i);
    }
    return res;
}

template < typename T >
vector < int > next_smaller(const vector < T >& nums, bool strict = true) {
    int n = nums.size();
    vector < int > res(n, n);
    stack < int > st;
    for (int i = n - 1; i >= 0; i--) {
        while (!st.empty() && (strict ? nums[st.top()] >= nums[i] : nums[st.top()] > nums[i]))
            st.pop();
        res[i] = st.empty() ? n : st.top();
        st.push(i);
    }
    return res;
}

template < typename T >
vector < int > prev_smaller(const vector < T >& nums, bool strict = true) {
    int n = nums.size();
    vector < int > res(n, -1);
    stack < int > st;
    for (int i = 0; i < n; i++) {
        while (!st.empty() && (strict ? nums[st.top()] >= nums[i] : nums[st.top()] > nums[i]))
            st.pop();
        res[i] = st.empty() ? -1 : st.top();
        st.push(i);
    }
    return res;
}`)
    }]);
  }

  // 16. Monotonic Queue --------------------------------------------------------
  const [monotonicQueue] = await db.insert(templates).values({
    title: "Monotonic Queue",
    slug: "monotonic-queue",
    description: "Sliding window min/max with O(1) aggregate queries using two monotonic stacks",
    categoryId: categoryId,
    tags: ["monotonic-queue", "queue", "sliding-window"],
    complexity: "O(1) amortized per operation",
    notes: `# Monotonic Queue

## Usage Example
\`\`\`cpp
Monotonic_Queue<int> mq;
for (int i = 0; i < n; i++) {
    mq.push(arr[i]);
    if (i >= k) mq.pop();
    if (i >= k - 1) cout << mq.monotonic_val() << "\\n";
}

auto minOp = [](int a, int b){ return min(a, b); };
Monotonic_Queue<int, decltype(minOp)> mq2(minOp, INT_MAX);
\`\`\`

## Methods
- \`Monotonic_Stack\`: \`push(x)\`, \`pop()\`, \`top()\`, \`monotonic_val()\`, \`empty()\`, \`size()\`
- \`Monotonic_Queue\`: \`push(x)\`, \`pop()\`, \`front()\`, \`monotonic_val()\`, \`empty()\`, \`size()\`

## Complexity
O(1) amortized per operation
`,
  }).returning();
  if (monotonicQueue) {
    await db.insert(templateCodes).values([{
      templateId: monotonicQueue.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>

using namespace std;

template < typename T >
struct MaxOp {
    constexpr T operator()(const T& a, const T& b) const { return a > b ? a : b; }
};

template < typename T = int, typename Op = MaxOp < T > >
struct Monotonic_Stack {
    vector < T > st, mono;
    Op operation;
    T DEFAULT;

    Monotonic_Stack(Op op = Op{}, T default_val = T{})
        : operation(op), DEFAULT(default_val) { mono.push_back(DEFAULT); }

    void push(T x) {
        st.push_back(x);
        mono.push_back(operation(mono.back(), x));
    }

    T pop() {
        T res = st.back();
        st.pop_back();
        mono.pop_back();
        return res;
    }

    T top() const { return st.back(); }
    T monotonic_val() const { return mono.back(); }
    bool empty() const { return st.empty(); }
    int size() const { return st.size(); }
};

template < typename T = int, typename Op = MaxOp < T > >
struct Monotonic_Queue {
    Monotonic_Stack < T, Op > s1, s2;
    Op operation;
    T DEFAULT;

    Monotonic_Queue(Op op = Op{}, T default_val = T{})
        : s1(op, default_val), s2(op, default_val), operation(op), DEFAULT(default_val) {}

    void push(T x) { s2.push(x); }

    void pop() {
        if (s1.empty()) {
            while (!s2.empty()) s1.push(s2.pop());
        }
        s1.pop();
    }

    T front() {
        if (s1.empty()) {
            while (!s2.empty()) s1.push(s2.pop());
        }
        return s1.top();
    }

    T monotonic_val() const {
        if (s1.empty()) return s2.monotonic_val();
        if (s2.empty()) return s1.monotonic_val();
        return operation(s1.monotonic_val(), s2.monotonic_val());
    }

    bool empty() const { return s1.empty() && s2.empty(); }
    int size() const { return s1.size() + s2.size(); }
};`)
    }]);
  }

  // 17. Splay Tree (Value-based) -----------------------------------------------
  const [splayTree] = await db.insert(templates).values({
    title: "Splay Tree",
    slug: "splay-tree",
    description: "Self-adjusting BST with amortized O(log n) operations, duplicates supported",
    categoryId: categoryId,
    tags: ["splay-tree", "bst", "self-balancing"],
    complexity: "O(log n) amortized per operation",
    notes: `# Splay Tree

## Usage Example
\`\`\`cpp
SplayTree<int> st;
st.insert(3); st.insert(1); st.insert(5); st.insert(3);
cout << st.kth(0);         // 1 (0-indexed)
cout << st.count_less(4);  // 3
cout << st.get_size();     // 4
\`\`\`

## Methods
- \`insert(val)\`, \`erase(val)\`, \`search(val)\`, \`kth(k)\`
- \`count_less(val)\`, \`get_size()\`, \`print()\`

## Complexity
O(log n) amortized per operation
`,
  }).returning();
  if (splayTree) {
    await db.insert(templateCodes).values([{
      templateId: splayTree.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>

using namespace std;

template < typename T = int > struct SplayTree {

    struct Node {
        Node *ch[2], *par;
        T val;
        int subSz, freq;

        Node() : subSz(0), freq(0) {
            par = ch[0] = ch[1] = this;
            val = numeric_limits < T > :: min();
        }
        
        Node(T V) : val(V), subSz(1), freq(1) {
            par = ch[0] = ch[1] = EMPTY;
        }
        
        void update() { subSz = freq + ch[0] -> subSz + ch[1] -> subSz; }
    };

    static Node* EMPTY;
    Node *root;
    enum dir {LEFT, RIGHT};

    SplayTree() { root = EMPTY; }

    void link(Node *p, Node *c, int d) {
        if(p != EMPTY) p -> ch[d] = c, p -> update();
        if(c != EMPTY) c -> par = p;
    }

    int get_dir(Node *p, Node *c) { return p -> ch[RIGHT] == c; }

    void rotate(Node *p, int d) {
        Node *q = p -> ch[d];
        Node *gp = p -> par;
        int gd = get_dir(gp, p);
        link(p, q -> ch[!d], d);
        link(q, p, !d);
        link(gp, q, gd);
    }

    void splay(Node *q) {
        while(q -> par != EMPTY) {
            Node *p = q -> par;
            Node *gp = p -> par;
            int d1 = get_dir(p, q);
            int d2 = get_dir(gp, p);
            if(gp == EMPTY) { rotate(p, d1); }
            else if(d1 == d2) { rotate(gp, d2); rotate(p, d1); }
            else { rotate(p, d1); rotate(gp, d2); }
        }
        root = q;
    }

    Node* find(Node *p, T val) {
        if(p == EMPTY) return EMPTY;
        Node *ch = p -> ch[val > p -> val];
        if(p -> val == val || ch == EMPTY) return p;
        return find(ch, val);
    }

    Node* splay_by_value(Node *p, T val) {
        p = find(p, val);
        splay(p);
        return p;
    }

    Node* insert(Node *p, T val) {
        if(p == EMPTY) return new Node(val);
        p = splay_by_value(p, val);
        if(p -> val == val) { p -> freq++; p -> subSz++; return p; }
        Node *q = new Node(val);
        if(p -> ch[val > p -> val] != EMPTY) {
            auto ch = p -> ch[val > p -> val];
            link(p, EMPTY, val > p -> val);
            link(q, ch, q -> val < ch -> val);
            link(q, p, q -> val < p -> val);
            p = q;
        } else 
            link(p, q, val > p -> val);
        return p;
    }

    void insert(T val) { root = insert(root, val); }

    void split(Node *p, T val, Node* &ls, Node * &ge) {
        p = splay_by_value(p, val);
        if(p -> val < val) {
            ls = p; ge = p -> ch[RIGHT];
            link(ls, EMPTY, RIGHT);
            link(EMPTY, ge, LEFT);
        } else {
            ls = p -> ch[LEFT]; ge = p;
            link(ge, EMPTY, LEFT);
            link(EMPTY, ls, RIGHT);
        }
    }

    Node* merge(Node *ls, Node *ge) {
        if(ls == EMPTY) return ge;
        if(ge == EMPTY) return ls;
        ge = splay_by_value(ge, numeric_limits < T > :: min());
        link(ge, ls, LEFT);
        return ge;
    }

    Node* erase(Node *p, T val) {
        p = splay_by_value(p, val);
        if(p -> val != val) return p;
        if(p -> freq > 1) { p -> freq--; p -> subSz--; return p; }
        Node *ls = p -> ch[LEFT];
        Node *ge = p -> ch[RIGHT];
        delete p;
        link(EMPTY, ls, LEFT);
        link(EMPTY, ge, RIGHT);
        return merge(ls, ge);
    }

    void erase(T val) { root = erase(root, val); }

    Node* kth(Node *p, T k) {
        if(p == EMPTY) return EMPTY;
        if(k > p -> subSz) return EMPTY;
        int sz = p -> ch[LEFT] -> subSz;
        if(sz > k) return kth(p -> ch[LEFT], k);
        if(sz + p -> freq <= k) return kth(p -> ch[RIGHT], k - sz - p -> freq);
        return p;
    }

    T kth(T k) {
        auto p = kth(root, k);
        splay(p); root = p;
        return p -> val;
    }

    int count_less(T val) {
        root = splay_by_value(root, val);
        return root -> ch[LEFT] -> subSz + (root -> val < val ? root -> freq : 0);
    }

    int get_size() { return root -> subSz; }

    void print(Node* p, int depth) {
        if(p == EMPTY) return;
        print(p -> ch[LEFT], depth + 1);
        cout << string(2 * depth, ' ') << setw(2) << p -> val << "\\n";
        print(p -> ch[RIGHT], depth + 1);
    }

    void print() { print(root, 0); cout << "-----------------------------------\\n"; }

    bool search(T val) {
        root = splay_by_value(root, val);
        return root -> val == val;
    }
};
template < typename T > typename SplayTree < T > :: Node* SplayTree < T > :: EMPTY = new typename SplayTree < T > :: Node();`)
    }]);
  }

  // 18. Implicit Splay Tree ----------------------------------------------------
  const [implicitSplay] = await db.insert(templates).values({
    title: "Implicit Splay Tree",
    slug: "implicit-splay-tree",
    description: "Implicit key splay tree for sequence split/merge and range queries with lazy propagation",
    categoryId: categoryId,
    tags: ["splay-tree", "implicit", "sequence", "range-query", "lazy"],
    complexity: "O(log n) amortized per operation",
    notes: `# Implicit Splay Tree

## Usage Example
\`\`\`cpp
SplayTree<Data> st;
st.insert(0, 3);
st.insert(1, -1);
st.insert(2, 5);
cout << st.query(0, 2);   // max subarray sum = 7
\`\`\`

## Methods
- \`insert(idx, val)\`, \`erase(idx)\`, \`replace(idx, val)\`
- \`at(k)\`, \`query(s, e)\`, \`get_size()\`, \`print()\`

## Default Query
Max subarray sum. Edit \`Data\` struct and \`combine()\` for custom queries.

## Complexity
O(log n) amortized per operation
`,
  }).returning();
  if (implicitSplay) {
    await db.insert(templateCodes).values([{
      templateId: implicitSplay.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>

using namespace std;

struct Data {
    ll val, sum, pref, suff, max_seg;
    Data() : val(0), sum(0), pref(-LINF), suff(-LINF), max_seg(-LINF) {}
    Data(ll v) : val(v), sum(val), pref(val), suff(val), max_seg(val) {}
};

Data combine(const Data& a, const Data& b) {
    Data res;
    res.sum = a.sum + b.sum;
    res.pref = max(a.pref, a.sum + b.pref);
    res.suff = max(b.suff, b.sum + a.suff);
    res.max_seg = max({a.max_seg, b.max_seg, a.suff + b.pref});
    return res;
}

template < typename T = int > struct SplayTree {

    struct Node {
        Node *ch[2], *par;
        T val, update;
        int subSz;
        bool is_lazy;

        Node() : subSz(0), update(0), is_lazy(false) {
            par = ch[0] = ch[1] = this;
        }
        
        Node(T V) : val(V), subSz(1), update(0), is_lazy(false) {
            par = ch[0] = ch[1] = EMPTY;
        }

        void update() {
            subSz = ch[0] -> subSz + ch[1] -> subSz + 1;
            auto v = val.val;
            val = combine(ch[0] -> val, combine(Data(v), ch[1] -> val));
            val.val = v;
        }

        void push_down() {
            if(this == EMPTY || !is_lazy) return;
            val = Data(update * subSz);
            ch[0] -> lazy_update(update);
            ch[1] -> lazy_update(update);
            is_lazy = false;
        }

        void lazy_update(ll c) {
            if(this == EMPTY) return;
            update = c;
            is_lazy = true;
        }
    };

    static Node* EMPTY;
    Node *root;
    enum dir {LEFT, RIGHT};

    SplayTree() { root = EMPTY; }

    void link(Node *p, Node *c, int d) {
        if(p != EMPTY) p -> ch[d] = c, p -> update();
        if(c != EMPTY) c -> par = p;
    }

    int get_dir(Node *p, Node *c) { return p -> ch[RIGHT] == c; }

    void rotate(Node *p, int d) {
        Node *q = p -> ch[d];
        Node *gp = p -> par;
        int gd = get_dir(gp, p);
        link(p, q -> ch[!d], d);
        link(q, p, !d);
        link(gp, q, gd);
    }

    void splay(Node *q) {
        while(q -> par != EMPTY) {
            Node *p = q -> par;
            Node *gp = p -> par;
            int d1 = get_dir(p, q);
            int d2 = get_dir(gp, p);
            if(gp == EMPTY) { rotate(p, d1); }
            else if(d1 == d2) { rotate(gp, d2); rotate(p, d1); }
            else { rotate(p, d1); rotate(gp, d2); }
        }
        root = q;
    }

    void split(Node *p, int idx, Node* &ls, Node * &ge) {
        if(idx >= p -> subSz) { ls = p; ge = EMPTY; return; }
        p = splay_by_idx(p, idx);
        ls = p -> ch[LEFT];
        ge = p;
        link(ge, EMPTY, LEFT);
        link(EMPTY, ls, RIGHT);
    }

    Node* splay_by_idx(Node* p, int idx) {
        p = at(p, idx);
        splay(p);
        return p;
    }

    Node* merge(Node *ls, Node *ge) {
        if(ls == EMPTY) return ge;
        if(ge == EMPTY) return ls;
        ge = splay_by_idx(ge, 0);
        link(ge, ls, LEFT);
        return ge;
    }

    void merge(Node* p) { root = merge(root, p); }

    Node* at(Node *p, int k) {
        if(p == EMPTY) return EMPTY;
        p -> push_down();
        if(k > p -> subSz) return EMPTY;
        int sz = p -> ch[LEFT] -> subSz;
        if(sz > k) return at(p -> ch[LEFT], k);
        if(sz + 1 <= k) return at(p -> ch[RIGHT], k - sz - 1);
        return p;
    }

    void insert(int idx, int val) {
        Node *before, *after;
        split(root, idx, before, after);
        Node* between = new Node(val);
        root = merge(merge(before, between), after);
    }

    void erase(int idx) {
        Node *before, *after, *between;
        split(root, idx + 1, before, after);
        split(before, idx, before, between);
        delete between;
        root = merge(before, after);
    }

    void replace(int idx, int val) {
        Node *before, *after, *between;
        split(root, idx + 1, before, after);
        split(before, idx, before, between);
        between -> val = val;
        root = merge(merge(before, between), after);
    }

    ll query(int s, int e) {
        Node *before, *after, *between;
        split(root, e + 1, before, after);
        split(before, s, before, between);
        ll ans = between -> val.max_seg;
        root = merge(merge(before, between), after);
        return ans;
    }

    int get_size() { return root -> subSz; }
};
template < typename T > typename SplayTree < T > :: Node* SplayTree < T > :: EMPTY = new typename SplayTree < T > :: Node();`)
    }]);
  }

  // 19. Heap ------------------------------------------------------------------
  const [heap] = await db.insert(templates).values({
    title: "Heap",
    slug: "heap",
    description: "Custom binary heap supporting min or max priority queue operations",
    categoryId: categoryId,
    tags: ["heap", "priority-queue", "binary-heap"],
    complexity: "O(log n) insert/pop, O(1) top",
    notes: `# Heap

## Usage Example
\`\`\`cpp
Heap<int> maxH;                    // max-heap (default)
maxH.insert(3); maxH.insert(7);
cout << maxH.top();                // 7

Heap<int, less_equal<int>> minH;   // min-heap
\`\`\`

## Template Params
- \`T\` = element type (default int)
- \`CompFunction\` = comparison (default \`greater_equal\` → max-heap)
  Use \`less_equal\` for min-heap

## Methods
- \`insert(x)\`, \`pop()\`, \`top()\`, \`empty()\`, \`size()\`

## Complexity
O(log n) insert/pop, O(1) top
`,
  }).returning();
  if (heap) {
    await db.insert(templateCodes).values([{
      templateId: heap.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>

using namespace std;

template < typename T = int , typename CompFunction = std::greater_equal < T > > struct Heap {
    
    vector < T > heap;

    Heap() { }

    Heap(const vector < T > &v) {
        for(auto& x : v) insert(x);
    }

    bool comp(const T &a, const T &b) { return CompFunction()(a, b); }

    void push_down(int idx) {
        int n = sz(heap);
        while(idx < n) {
            int l = 2 * idx + 1, r = 2 * idx + 2;
            if(l >= n) break;
            if(r >= n) r = l;
            T mx = comp(heap[l], heap[r]) ? l : r;
            if(comp(heap[mx], heap[idx]))
                swap(heap[mx], heap[idx]), idx = mx;
            else
                break;
        }
    }

    void push_up(int idx) {
        while(idx > 0) {
            int p = (idx - 1) / 2;
            if(!comp(heap[p], heap[idx]))
                swap(heap[p], heap[idx]), idx = p;
            else
                break;
        }
    }

    void insert(const T x) {
        heap.push_back(x);
        push_up(sz(heap) - 1);
    }

    void pop() {
        swap(heap.back(), heap.front());
        heap.pop_back();
        push_down(0);
    }

    T top() { return heap.front(); }
    bool empty() { return sz(heap) == 0; }
    int size() { return sz(heap); }
};`)
    }]);
  }
  // =================== COORDINATE COMPRESSION ===================
  const [coordCompress] = await db.insert(templates).values({
    title: "Coordinate Compression",
    slug: "coordinate-compression",
    description: "Map arbitrary values to dense 1-indexed ranks",
    categoryId: categoryId,
    tags: ["coordinate-compression", "compression", "discretization"],
    complexity: "O(n log n) build, O(log n) per query",
    notes: `# Coordinate Compression

Maps arbitrary values to dense 1-indexed ranks. Useful when values are large but count is small (e.g., Fenwick/segment tree on compressed values).

## Example
\`\`\`cpp
vector<int> a = {10, 5, 30, 5, 20};
Coordinate_Compression<int> cc(a);
cout << cc.get(5);            // 1
cout << cc.get(30);           // 4
auto comp = cc.get_compressed(a);  // {2, 1, 4, 1, 3}
\`\`\`

## Methods
| Method | Description |
|--------|-------------|
| add(x) | Add value (lazy rebuild) |
| build() | Sort + deduplicate |
| get(x) | 1-indexed rank of x |
| get_compressed(vec) | Rank for each element |
| get_mapping(vec) | Inverse: rank \u2192 original value |
| size() | Number of distinct values |`,
  }).returning();
  if (coordCompress) {
    await db.insert(templateCodes).values([{
      templateId: coordCompress.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;
#define all(vec) vec.begin(), vec.end()
#define sz(x) int(x.size())
#define ll long long

template < typename T = int > struct Coordinate_Compression {

    vector < T > compressed;
    bool is_build = true;

    Coordinate_Compression(){}

    Coordinate_Compression(vector < T > &vec) {
        compressed = vec;
        build();
    }

    void add(T x) {
        compressed.push_back(x);
        is_build = false;
    }

    void build() {
        sort(all(compressed));
        compressed.resize(unique(all(compressed)) - compressed.begin());
        is_build = true;
    }

    T get(T x) {
        if(!is_build) build();
        return upper_bound(all(compressed), x) - compressed.begin();
    }

    vector < T > get_compressed(vector < T > &vec) {
        if(!is_build) build();
        vector < T > ret;
        for (auto &x : vec)
            ret.push_back(get(x));
        return ret;
    }

    vector < T > get_mapping(vector < T > &vec) {
        if(!is_build) build();
        vector < T > ret(sz(compressed) + 5);
        for (auto &x : vec)
            ret[get(x)] = x;
        return ret;
    }

    int size(){
        if(!is_build) build();
        return sz(compressed);
    }
};`)
    }]);
  }
}