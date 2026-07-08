import { templates, templateCodes } from "../schema";
import { stripMain, type Db, type CatMap } from "./helpers";

export async function seedDataStruct(db: Db, catMap: CatMap) {
  const categoryId = catMap["data-structures"];
  if (!categoryId) return;

  // ─── 1. Binary Search Tree ─────────────────────────────────────────
  const [bst] = await db.insert(templates).values({
    title: "Binary Search Tree",
    slug: "binary-search-tree",
    description: "BST with insert, delete, search, and traversals",
    categoryId: categoryId,
    tags: ["bst", "binary-search-tree", "tree"],
    complexity: "O(log n) average, O(n) worst",
    notes: `# Binary Search Tree

A binary search tree (BST) maintains the invariant: for every node, all values in the left subtree are strictly less, and all values in the right subtree are strictly greater. This ordering enables $O(\log n)$ average-case search, insert, and delete.

Insertion compares the target to the current node and descends left or right. Deletion handles three cases: leaf (remove), single child (bypass), and two children (replace with in-order successor, then delete the successor).

\`\`\`cpp
BST* root = nullptr;
BST bst;
root = bst.insert(root, 5);
root = bst.insert(root, 3);
root = bst.insert(root, 7);
bst.inorder(root);              // 3 5 7
cout << bst.search(root, 3);    // 1
root = bst.deleteNode(root, 5);
\`\`\`

## When to Use

- Dynamically maintained sorted data (without balancing guarantees).
- Educational / interview contexts for tree traversal patterns.
- Building block for balanced BST variants (AVL, Red-Black, Splay).

## Edge Cases

| Case | Behavior |
|------|----------|
| Empty tree ($\text{root} = \texttt{nullptr}$) | Insert creates root; search/delete return immediately |
| Single node | Delete returns $\texttt{nullptr}$ |
| Deleting the root | New root is the in-order successor or left child |
| Duplicate insert | Duplicates go to the left subtree |

## Complexity

| Operation | Average | Worst (unbalanced) |
|-----------|---------|---------------------|
| Insert | $O(\log n)$ | $O(n)$ |
| Search | $O(\log n)$ | $O(n)$ |
| Delete | $O(\log n)$ | $O(n)$ |
| Traversal | $O(n)$ | $O(n)$ |`,
  }).returning();
  if (bst) {
    await db.insert(templateCodes).values([{
      templateId: bst.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;

struct BST {
    int data;
    BST *left, *right;

    BST(int data = 0) : data(data), left(nullptr), right(nullptr) {}

    BST* insert(BST* root, int val) {
        if (!root) return new BST(val);
        if (val > root->data)
            root->right = insert(root->right, val);
        else
            root->left = insert(root->left, val);
        return root;
    }

    void inorder(BST* root) {
        if (!root) return;
        inorder(root->left);
        cout << root->data << " ";
        inorder(root->right);
    }

    void preorder(BST* root) {
        if (!root) return;
        cout << root->data << " ";
        preorder(root->left);
        preorder(root->right);
    }

    void postorder(BST* root) {
        if (!root) return;
        postorder(root->left);
        postorder(root->right);
        cout << root->data << " ";
    }

    void levelOrder(BST* root) {
        if (!root) return;
        queue<BST*> bfs;
        bfs.push(root);
        while (!bfs.empty()) {
            BST* cur = bfs.front();
            bfs.pop();
            cout << cur->data << " ";
            if (cur->left) bfs.push(cur->left);
            if (cur->right) bfs.push(cur->right);
        }
    }

    bool search(BST* root, int val) {
        if (!root) return false;
        if (root->data == val) return true;
        if (val > root->data) return search(root->right, val);
        return search(root->left, val);
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

    BST* deleteNode(BST* root, int key) {
        if (!root) return root;
        if (key < root->data)
            root->left = deleteNode(root->left, key);
        else if (key > root->data)
            root->right = deleteNode(root->right, key);
        else {
            if (!root->left && !root->right) return nullptr;
            else if (!root->left) {
                BST* temp = root->right;
                delete root;
                return temp;
            } else if (!root->right) {
                BST* temp = root->left;
                delete root;
                return temp;
            }
            BST* temp = minValueNode(root->right);
            root->data = temp->data;
            root->right = deleteNode(root->right, temp->data);
        }
        return root;
    }
};`)
    }]);
  }

  // ─── 2. Segment Tree ───────────────────────────────────────────────
  const [segTree] = await db.insert(templates).values({
    title: "Segment Tree",
    slug: "segment-tree",
    description: "Generic segment tree supporting range queries and point updates with custom operation",
    categoryId: categoryId,
    tags: ["segment-tree", "range-query", "point-update", "data-structure"],
    complexity: "O(log n) per query",
    notes: `# Segment Tree

A segment tree is a binary tree where each internal node stores the result of a commutative, associative operation over a contiguous range. The root covers $[1, n]$, splitting at the midpoint.

**Indexing:** Node $i$ has children at $2i$ (left) and $2i+1$ (right). For an internal node covering $[l, r]$ with midpoint $m = \lfloor(l+r)/2\rfloor$:

$$\text{tree}[i] = \text{op}(\text{tree}[2i],\\; \text{tree}[2i+1])$$

**Build** constructs bottom-up in $O(n)$. **Point update** propagates changes up $O(\log n)$ levels. **Range query** decomposes $[l, r]$ into $O(\log n)$ disjoint segments.

\`\`\`cpp
SegmentTree<> seg(5, {1, 2, 3, 4, 5});
seg.update(3, 10);
cout << seg.query(1, 5);        // 22
\`\`\`

## When to Use

- Range min / max / sum / gcd queries with point updates.
- Any commutative, associative range operation.

## Edge Cases

| Case | Behavior |
|------|----------|
| Single element array | Tree is a single leaf node |
| Query out of bounds | Returns identity element |
| Update to same value | No change propagated |

## Complexity

| Operation | Complexity |
|-----------|------------|
| Build | $O(n)$ |
| Point update | $O(\log n)$ |
| Range query | $O(\log n)$ |
| Space | $O(n)$ |`,
  }).returning();
  if (segTree) {
    await db.insert(templateCodes).values([{
      templateId: segTree.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;

template <typename T = int, typename Op = plus<T>, int Base = 0, typename numsType = T>
class SegmentTree {
private:
    int n, maxLevel;
    T DEFAULT;
    vector<T> tree;
    Op operation;

    void build(const vector<numsType>& nums, int idx, int lx, int rx) {
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
        return operation(query(l, r, idx * 2, lx, mx),
                         query(l, r, idx * 2 + 1, mx + 1, rx));
    }

public:

    SegmentTree(int n = 0, const vector<numsType>& nums = vector<numsType>(),
                Op op = Op{}, T def = T{})
        : n(n), maxLevel(1), DEFAULT(def), operation(op) {
        while ((1 << maxLevel) < n) maxLevel++;
        tree = vector<T>(4 * n, DEFAULT);
        if (!nums.empty()) build(nums, 1, 1, n);
    }

    void build(const vector<numsType>& nums) {
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
        queue<pair<int, int>> q;
        q.push({1, level});
        while (!q.empty()) {
            int nodes = q.size();
            int spaces = (1 << (maxLevel - level + 1)) - 1;
            int lead = (1 << (maxLevel - level)) - 1;
            cout << string(lead * 2, ' ');
            while (nodes--) {
                auto [idx, lvl] = q.front();
                q.pop();
                cout << setw(2) << tree[idx];
                if (nodes) cout << string(spaces * 2, ' ');
                if (idx * 2 + 1 < int(tree.size())) {
                    q.push({idx * 2, lvl + 1});
                    q.push({idx * 2 + 1, lvl + 1});
                }
            }
            cout << "\\n";
            level++;
        }
    }
};`)
    }]);
  }

  // ─── 3. Segment Tree — Lazy Propagation ────────────────────────────
  const [lazySeg] = await db.insert(templates).values({
    title: "Segment Tree — Lazy Propagation",
    slug: "lazy-segment-tree",
    description: "Segment tree with lazy propagation for range updates and range queries",
    categoryId: categoryId,
    tags: ["segment-tree", "lazy-propagation", "range-update"],
    complexity: "O(log n) per range operation",
    notes: `# Lazy Propagation Segment Tree

A lazy propagation segment tree extends the standard segment tree to support **range updates** in $O(\log n)$ by deferring work. Each node stores both a value and a lazy tag. When a range update covers an entire node, the tag is stored and the node's value is updated immediately.

**Push-down:** Before accessing children, the lazy tag is propagated. The parent's lazy value is *composed* with the children's existing lazy values, and the children's values are updated via an *apply* function.

**CUSTOMIZE block variants:**

| Variant | combine | apply | compose |
|---------|---------|-------|---------|
| Range add + range sum | $a + b$ | $\text{val} + \text{lz} \cdot \text{len}$ | $\text{old} + \text{new}$ |
| Range assign + range min | $\min(a, b)$ | $\text{lz}$ | $\text{new}$ |

\`\`\`cpp
LazyPST seg(5, {1, 2, 3, 4, 5});
seg.update(2, 4, 10);         // add 10 to [2,4]
cout << seg.query(1, 5);      // 45
\`\`\`

## When to Use

- Range add / assign / flip with range sum / min / max queries.
- Batch updates over intervals.

## Edge Cases

| Case | Behavior |
|------|----------|
| Update covers entire range | Tag stored at root, no recursion |
| Query before any update | Returns initial values |
| Consecutive updates on same range | Tags are composed (not overwritten) |

## Complexity

| Operation | Complexity |
|-----------|------------|
| Build | $O(n)$ |
| Range update | $O(\log n)$ |
| Range query | $O(\log n)$ |
| Space | $O(n)$ |`,
  }).returning();
  if (lazySeg) {
    await db.insert(templateCodes).values([{
      templateId: lazySeg.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;

struct LazyPST {

    using T = long long;
    using Lazy = long long;
    T IDENTITY = 0;
    Lazy LAZY_ID = 0;
    T combine(T a, T b) { return a + b; }
    T apply(T val, Lazy lz, int len) { return val + lz * len; }
    Lazy compose(Lazy oldLz, Lazy newLz) { return oldLz + newLz; }

    struct Node { T val; Lazy lazy; };

    int n;
    vector<Node> tree;

    LazyPST(int n, const vector<T>& v = vector<T>())
        : n(n), tree(4 * n + 4, {IDENTITY, LAZY_ID}) {
        if (!v.empty()) build(v, 1, 1, n);
    }

private:

    void pushUp(int idx) {
        tree[idx].val = combine(tree[idx * 2].val, tree[idx * 2 + 1].val);
    }

    void applyNode(int idx, int lx, int rx, Lazy lz) {
        tree[idx].val = apply(tree[idx].val, lz, rx - lx + 1);
        tree[idx].lazy = compose(tree[idx].lazy, lz);
    }

    void pushDown(int idx, int lx, int rx) {
        if (tree[idx].lazy == LAZY_ID) return;
        int mid = (lx + rx) / 2;
        applyNode(idx * 2, lx, mid, tree[idx].lazy);
        applyNode(idx * 2 + 1, mid + 1, rx, tree[idx].lazy);
        tree[idx].lazy = LAZY_ID;
    }

    void build(const vector<T>& v, int idx, int lx, int rx) {
        if (lx == rx) {
            tree[idx] = {lx <= int(v.size()) ? v[lx - 1] : IDENTITY, LAZY_ID};
            return;
        }
        int mid = (lx + rx) / 2;
        build(v, idx * 2, lx, mid);
        build(v, idx * 2 + 1, mid + 1, rx);
        pushUp(idx);
    }

    void update(int l, int r, Lazy v, int idx, int lx, int rx) {
        if (lx >= l && rx <= r) { applyNode(idx, lx, rx, v); return; }
        if (lx > r || rx < l) return;
        pushDown(idx, lx, rx);
        int mid = (lx + rx) / 2;
        update(l, r, v, idx * 2, lx, mid);
        update(l, r, v, idx * 2 + 1, mid + 1, rx);
        pushUp(idx);
    }

    T query(int l, int r, int idx, int lx, int rx) {
        if (lx >= l && rx <= r) return tree[idx].val;
        if (lx > r || rx < l) return IDENTITY;
        pushDown(idx, lx, rx);
        int mid = (lx + rx) / 2;
        return combine(query(l, r, idx * 2, lx, mid),
                       query(l, r, idx * 2 + 1, mid + 1, rx));
    }

public:

    void update(int l, int r, Lazy v) { update(l, r, v, 1, 1, n); }

    void update(int i, Lazy v) { update(i, i, v, 1, 1, n); }

    T query(int l, int r) { return query(l, r, 1, 1, n); }

    T operator[](int i) { return query(i, i, 1, 1, n); }
};`)
    }]);
  }

  // ─── 4. Persistent Segment Tree ────────────────────────────────────
  const [pst] = await db.insert(templates).values({
    title: "Persistent Segment Tree",
    slug: "persistent-segment-tree",
    description: "Immutable versioned segment tree for historical queries",
    categoryId: categoryId,
    tags: ["persistent", "segment-tree", "versioning", "immutable"],
    complexity: "O(log n) per operation, O(n log n) memory",
    notes: `# Persistent Segment Tree

A persistent segment tree preserves all previous versions after each update via **path copying**. An update creates $O(\log n)$ new nodes along the root-to-leaf path, sharing all unchanged subtrees with the previous version.

Each version $t$ has its own root $\text{roots}[t]$. Creating version $t$ from $t-1$ costs $O(\log n)$ new nodes. Total memory for $q$ updates: $O(n + q \log n)$.

\`\`\`cpp
PersistentST<ll> pst(q + 1, 1, n);
pst.build(arr);                    // version 0
pst.insert(5, 99, 1, 0);          // version 1 from version 0
cout << pst.query(1, 10, 1);      // prefix sum at version 1
\`\`\`

## When to Use

- Historical range queries (state at any past version).
- Offline 2D queries (persistent BIT on one dimension).
- K-th smallest number in a range.
- Version-controlled data structures.

## Edge Cases

| Case | Behavior |
|------|----------|
| Query at version 0 | Returns initial array values |
| Insert with same src/tgt version | Overwrites current version |
| Query range outside all values | Returns identity (0 for sum) |

## Complexity

| Operation | Complexity |
|-----------|------------|
| Build (version 0) | $O(n)$ |
| Insert (new version) | $O(\log n)$ time, $O(\log n)$ nodes |
| Query at version $t$ | $O(\log n)$ |
| Total space for $q$ updates | $O(n + q \log n)$ |`,
  }).returning();
  if (pst) {
    await db.insert(templateCodes).values([{
      templateId: pst.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;

template <typename T = int, int Base = 0>
struct PersistentST {
    struct Node {
        T val, prefix;
        Node *left, *right;

        Node(T val = 0) : val(val), prefix(max(T(0), val)), left(this), right(this) {}

        Node(Node* node, Node* l, Node* r)
            : val(node->val), prefix(node->prefix), left(l), right(r) {}
    };

    vector<Node*> roots;
    T N, Lx, Rx;

    PersistentST(int n = 0, T lx = -1e9, T rx = 1e9)
        : N(n), Lx(lx), Rx(rx) {
        roots = vector<Node*>(n + 5, new Node());
    }

    Node* operation(Node* a, Node* b) {
        Node* m = new Node();
        m->val = a->val + b->val;
        m->prefix = max(a->prefix, a->val + b->prefix);
        return m;
    }

    Node* build(const vector<T>& nums, T l, T r) {
        if (l == r) return new Node(nums[l - !Base]);
        T mx = l + (r - l) / 2;
        Node* L = build(nums, l, mx);
        Node* R = build(nums, mx + 1, r);
        return new Node(operation(L, R), L, R);
    }

    void build(const vector<T>& nums) { roots[0] = build(nums, Lx, Rx); }

    Node* update(Node* root, int idx, T val, T lx, T rx) {
        if (idx < lx || idx > rx) return root;
        if (lx == rx) return new Node(val);
        T mx = lx + (rx - lx) / 2;
        Node* L = update(root->left, idx, val, lx, mx);
        Node* R = update(root->right, idx, val, mx + 1, rx);
        return new Node(operation(L, R), L, R);
    }

    void insert(int idx, T val, int currTime, int prevTime) {
        roots[currTime] = update(roots[prevTime], idx, val, Lx, Rx);
    }

    void update(int idx, T val, int currTime) {
        roots[currTime] = update(roots[currTime], idx, val, Lx, Rx);
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

  // ─── 5. Segment Tree 2D ────────────────────────────────────────────
  const [segTree2d] = await db.insert(templates).values({
    title: "Segment Tree 2D",
    slug: "segment-tree-2d",
    description: "2D segment tree for rectangle queries and point updates",
    categoryId: categoryId,
    tags: ["2d-segment-tree", "range-query", "point-update", "geometry"],
    complexity: "O(log² n) per query/update",
    notes: `# Segment Tree 2D

A 2D segment tree is a nested segment tree: the outer tree indexes rows, each outer node contains an inner segment tree over columns.

**Build:** Outer tree first. For each outer node covering rows $[r_1, r_2]$, its inner tree is built by combining children's inner trees pointwise.

**Query:** Decompose row range $[r_1, r_2]$ into $O(\log n)$ outer segments, query inner tree over $[c_1, c_2]$ in $O(\log m)$. Total: $O(\log n \cdot \log m)$.

\`\`\`cpp
vector<vector<int>> grid = {{1, 2}, {3, 4}};
SegmentTree2D<int> seg(2, 2, grid);
seg.update(1, 2, 7);
cout << seg.query(1, 2, 1, 2);
\`\`\`

## When to Use

- Rectangle sum / min / max queries with point updates.
- 2D range counting problems.

## Edge Cases

| Case | Behavior |
|------|----------|
| Single cell query | Returns the cell value |
| Full grid query | Returns root value |
| Update at boundary | Propagates through both trees |

## Complexity

| Operation | Complexity |
|-----------|------------|
| Build | $O(nm)$ |
| Point update | $O(\log n \cdot \log m)$ |
| Rectangle query | $O(\log n \cdot \log m)$ |
| Space | $O(nm)$ |`,
  }).returning();
  if (segTree2d) {
    await db.insert(templateCodes).values([{
      templateId: segTree2d.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;

template <typename T = int, typename Op = plus<T>, int Base = 0>
struct SegmentTree2D {
    int n, m, rows, cols;
    T DEFAULT;
    vector<vector<T>> tree;
    Op operation;

    static constexpr int L(int i) { return i << 1; }
    static constexpr int R(int i) { return (i << 1) | 1; }

    void init(int n_, int m_) {
        n = n_; m = m_;
        rows = 4 * n; cols = 4 * m;
        tree.assign(rows, vector<T>(cols, DEFAULT));
    }

    SegmentTree2D(int n = 0, int m = 0, Op op = Op{}, T def = T{})
        : DEFAULT(def), operation(op) { init(n, m); }

    SegmentTree2D(int n, int m, const vector<vector<T>>& nums,
                  Op op = Op{}, T def = T{})
        : DEFAULT(def), operation(op) { init(n, m); build(nums); }

    void buildY(int vx, int lx, int rx, int vy, int ly, int ry,
                const vector<vector<T>>& vec) {
        if (Base ? lx >= int(vec.size()) : lx > int(vec.size())) return;
        if (Base ? ly >= int(vec[0].size()) : ly > int(vec[0].size())) return;
        if (ly == ry) {
            if (lx == rx) tree[vx][vy] = vec[lx - !Base][ly - !Base];
            else tree[vx][vy] = operation(tree[L(vx)][vy], tree[R(vx)][vy]);
        } else {
            int my = (ly + ry) / 2;
            buildY(vx, lx, rx, L(vy), ly, my, vec);
            buildY(vx, lx, rx, R(vy), my + 1, ry, vec);
            tree[vx][vy] = operation(tree[vx][L(vy)], tree[vx][R(vy)]);
        }
    }

    void buildX(int vx, int lx, int rx, const vector<vector<T>>& vec) {
        if (lx != rx) {
            int mx = (lx + rx) / 2;
            buildX(L(vx), lx, mx, vec);
            buildX(R(vx), mx + 1, rx, vec);
        }
        buildY(vx, lx, rx, 1, 1, m, vec);
    }

    void build(const vector<vector<T>>& vec) {
        for (auto& row : tree) fill(row.begin(), row.end(), DEFAULT);
        buildX(1, 1, n, vec);
    }

    T queryY(int vx, int vy, int ly0, int ry0, int ly, int ry) const {
        if (ly > ry) return DEFAULT;
        if (ly == ly0 && ry0 == ry) return tree[vx][vy];
        int my = (ly0 + ry0) / 2;
        return operation(queryY(vx, L(vy), ly0, my, ly, min(ry, my)),
                         queryY(vx, R(vy), my + 1, ry0, max(ly, my + 1), ry));
    }

    T queryX(int vx, int lx0, int rx0, int lx, int rx, int ly, int ry) const {
        if (lx > rx) return DEFAULT;
        if (lx == lx0 && rx0 == rx) return queryY(vx, 1, 1, m, ly, ry);
        int mx = (lx0 + rx0) / 2;
        return operation(queryX(L(vx), lx0, mx, lx, min(rx, mx), ly, ry),
                         queryX(R(vx), mx + 1, rx0, max(lx, mx + 1), rx, ly, ry));
    }

    T query(int lx, int rx, int ly, int ry) const {
        return queryX(1, 1, n, lx, rx, ly, ry);
    }

    void updateY(int vx, int lx, int rx, int vy, int ly, int ry,
                 int x, int y, T val) {
        if (ly == ry) {
            if (lx == rx) tree[vx][vy] = val;
            else tree[vx][vy] = operation(tree[L(vx)][vy], tree[R(vx)][vy]);
        } else {
            int my = (ly + ry) / 2;
            if (y <= my) updateY(vx, lx, rx, L(vy), ly, my, x, y, val);
            else updateY(vx, lx, rx, R(vy), my + 1, ry, x, y, val);
            tree[vx][vy] = operation(tree[vx][L(vy)], tree[vx][R(vy)]);
        }
    }

    void updateX(int vx, int lx, int rx, int x, int y, T val) {
        if (lx != rx) {
            int mx = (lx + rx) / 2;
            if (x <= mx) updateX(L(vx), lx, mx, x, y, val);
            else updateX(R(vx), mx + 1, rx, x, y, val);
        }
        updateY(vx, lx, rx, 1, 1, m, x, y, val);
    }

    void update(int x, int y, T val) { updateX(1, 1, n, x, y, val); }

    T get(int x, int y) const { return query(x, x, y, y); }

    int rowsSize() const { return n; }

    int colsSize() const { return m; }
};`)
    }]);
  }

  // ─── 6. Fenwick Tree (BIT 1D) ─────────────────────────────────────
  const [fenwick] = await db.insert(templates).values({
    title: "Fenwick Tree (BIT)",
    slug: "fenwick-tree",
    description: "Binary Indexed Tree for prefix sum queries and point updates",
    categoryId: categoryId,
    tags: ["fenwick", "BIT", "range-query", "point-update"],
    complexity: "O(log n) per operation",
    notes: `# Fenwick Tree (BIT)

A Fenwick tree supports prefix sum queries and point updates in $O(\log n)$ using the **lowbit** operation: $\text{lowbit}(x) = x \\ \\& \\ (-x)$, isolating the lowest set bit.

Each index $i$ stores a partial sum of length $\text{lowbit}(i)$:

$$\text{tree}[i] = \sum_{j=i-\text{lowbit}(i)+1}^{i} a[j]$$

**Why it works:** Advancing $i \\mathrel{+}= \text{lowbit}(i)$ skips to the next non-overlapping range, covering all positions $\leq i$ in at most $\log n$ steps.

\`\`\`cpp
FenwickTree<int> ft(n);
ft.build(arr);
ft.add(3, 5);
cout << ft.query(1, 4);
\`\`\`

**Important:** The operation must be **invertible** (sum, XOR). Does NOT work for min/max/gcd.

## When to Use

- Prefix sum queries with point updates (simpler than segment tree).
- Counting inversions.

## Edge Cases

| Case | Behavior |
|------|----------|
| Query $l > r$ | Returns identity (0 for sum) |
| Update at index 0 | Increments tree[1] (1-indexed internally) |

## Complexity

| Operation | Complexity |
|-----------|------------|
| Build (from array) | $O(n)$ |
| Point update (add) | $O(\log n)$ |
| Prefix query | $O(\log n)$ |
| Range query $[l, r]$ | $O(\log n)$ |
| Space | $O(n)$ |`,
  }).returning();
  if (fenwick) {
    await db.insert(templateCodes).values([{
      templateId: fenwick.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;

template <typename T = int, typename Op = plus<T>, typename InvOp = minus<T>>
struct FenwickTree {
    int n;
    T DEFAULT;
    Op op;
    InvOp invOp;
    vector<T> tree;

    FenwickTree(int sz = 0, Op op = Op{}, InvOp invOp = InvOp{}, T def = T{})
        : n(sz), DEFAULT(def), op(op), invOp(invOp) {
        tree.assign(n + 1, DEFAULT);
    }

    void build(const vector<T>& nums) {
        for (int i = 0; i < int(nums.size()); i++) tree[i + 1] = nums[i];
        for (int i = 1; i <= n; i++) {
            int j = i + (i & -i);
            if (j <= n) tree[j] = op(tree[j], tree[i]);
        }
    }

    void add(int idx, T val) {
        for (++idx; idx <= n; idx += idx & -idx)
            tree[idx] = op(tree[idx], val);
    }

    T prefix(int idx) const {
        T ans = DEFAULT;
        for (++idx; idx > 0; idx -= idx & -idx)
            ans = op(ans, tree[idx]);
        return ans;
    }

    T query(int l, int r) const {
        if (l > r) return DEFAULT;
        return invOp(prefix(r), l ? prefix(l - 1) : DEFAULT);
    }

    T get(int idx) const { return query(idx, idx); }

    int size() const { return n; }
};`)
    }]);
  }

  // ─── 7. Fenwick Tree 2D ───────────────────────────────────────────
  const [fenwick2d] = await db.insert(templates).values({
    title: "Fenwick Tree 2D",
    slug: "fenwick-tree-2d",
    description: "2D BIT for rectangle sum and point updates",
    categoryId: categoryId,
    tags: ["2d-fenwick", "BIT", "rectangle-sum"],
    complexity: "O(log² n) per operation",
    notes: `# Fenwick Tree 2D

A 2D Fenwick tree (Binary Indexed Tree) extends the 1D BIT to two dimensions. **2D BIT for point updates + range sum queries on a matrix.** Uses inclusion-exclusion for prefix sums:

$$\\text{query}(x_1, y_1, x_2, y_2) = S(x_2, y_2) - S(x_1-1, y_2) - S(x_2, y_1-1) + S(x_1-1, y_1-1)$$

**When to Use**: Matrix prefix sums with updates. Simpler alternative to 2D segment tree for additive operations. Supports point update + rectangle sum in $O(\\log n \\cdot \\log m)$ per operation.

\`\`\`cpp
FenwickTree2D<ll> ft(n, m);
ft.build(grid);
ft.add(2, 3, 5);
cout << ft.query(1, 1, 2, 3);
\`\`\`

## When to Use

- Rectangle sum queries with point updates (invertible ops only).
- Simpler alternative to 2D segment tree for additive operations.
- Matrix prefix sum problems where values change over time.

## Complexity

| Operation | Complexity |
|-----------|------------|
| Point update | $O(\\log n \\cdot \\log m)$ |
| Rectangle query | $O(\\log n \\cdot \\log m)$ |
| Space | $O(nm)$ |`,
  }).returning();
  if (fenwick2d) {
    await db.insert(templateCodes).values([{
      templateId: fenwick2d.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;

template <typename T = int>
struct FenwickTree2D {
    int n, m;
    T DEFAULT;
    vector<vector<T>> tree;

    FenwickTree2D(int rows = 0, int cols = 0)
        : n(rows), m(cols), DEFAULT(T{}) {
        tree.assign(n + 1, vector<T>(m + 1, DEFAULT));
    }

    void build(const vector<vector<T>>& nums) {
        for (int i = 0; i < int(nums.size()); i++)
            for (int j = 0; j < int(nums[0].size()); j++)
                add(i + 1, j + 1, nums[i][j]);
    }

    void add(int x, int y, T val) {
        for (int i = x; i <= n; i += i & -i)
            for (int j = y; j <= m; j += j & -j)
                tree[i][j] += val;
    }

    T getSum(int x, int y) const {
        T s = DEFAULT;
        for (int i = x; i > 0; i -= i & -i)
            for (int j = y; j > 0; j -= j & -j)
                s += tree[i][j];
        return s;
    }

    T query(int x1, int y1, int x2, int y2) const {
        if (x1 > x2) swap(x1, x2);
        if (y1 > y2) swap(y1, y2);
        return getSum(x2, y2) - getSum(x1 - 1, y2)
             - getSum(x2, y1 - 1) + getSum(x1 - 1, y1 - 1);
    }
};`)
    }]);
  }

  // ─── 8. Fenwick Tree — Range Updates ───────────────────────────────
  const [fenwickRange] = await db.insert(templates).values({
    title: "Fenwick Tree — Range Updates",
    slug: "fenwick-tree-range",
    description: "BIT supporting both range updates and range sum queries",
    categoryId: categoryId,
    tags: ["fenwick", "BIT", "range-update", "range-query"],
    complexity: "O(log n) per operation",
    notes: `# Fenwick Tree — Range Updates

Supports **range add** and **range sum** simultaneously using two BITs based on the **difference array**: $d[i] = a[i] - a[i-1]$.

Range add $[l, r]$ by $v$: $d[l] \\mathrel{+}= v$, $d[r+1] \\mathrel{-}= v$.

Prefix sum decomposes as:

$$\sum_{i=1}^{k} a[i] = k \sum_{i=1}^{k} d[i] - \sum_{i=1}^{k} (i-1) \cdot d[i]$$

\`\`\`cpp
FenwickTreeRange<ll> ft(n);
ft.build(arr);
ft.add(2, 5, 3);    // add 3 to [2, 5]
cout << ft.query(1, 6);
\`\`\`

## When to Use

- Range add + range sum queries (simpler than lazy segment tree).

## Complexity

| Operation | Complexity |
|-----------|------------|
| Build (from array) | $O(n \log n)$ |
| Range add $[l, r]$ | $O(\log n)$ |
| Range sum $[l, r]$ | $O(\log n)$ |
| Space | $O(n)$ |`,
  }).returning();
  if (fenwickRange) {
    await db.insert(templateCodes).values([{
      templateId: fenwickRange.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;

template <typename T = int>
struct FenwickTreeRange {
    int N;
    T DEFAULT;
    vector<T> M, C;

    FenwickTreeRange(int sz = 0) : N(sz + 1), DEFAULT(T{}) {
        M.assign(N + 1, DEFAULT);
        C.assign(N + 1, DEFAULT);
    }

    void build(const vector<T>& nums) {
        for (int i = 0; i < int(nums.size()); i++) add(i, i, nums[i]);
    }

    void addRange(int idx, T addM, T addC) {
        for (++idx; idx <= N; idx += idx & -idx) {
            M[idx] += addM;
            C[idx] += addC;
        }
    }

    void add(int l, int r, T val) {
        addRange(l, val, -val * (l - 1));
        addRange(r + 1, -val, val * r);
    }

    void add(int idx, T val) { add(idx, idx, val); }

    T get(int idx) const {
        T ans = DEFAULT;
        int pos = idx;
        for (++idx; idx > 0; idx -= idx & -idx)
            ans += pos * M[idx] + C[idx];
        return ans;
    }

    T query(int l, int r) const {
        if (l > r) return DEFAULT;
        return get(r) - get(l - 1);
    }

    int size() const { return N - 1; }
};`)
    }]);
  }

  // ─── 9. Sparse Table ───────────────────────────────────────────────
  const [sparseTable] = await db.insert(templates).values({
    title: "Sparse Table",
    slug: "sparse-table",
    description: "Static RMQ with O(1) queries and O(n log n) preprocessing",
    categoryId: categoryId,
    tags: ["sparse-table", "RMQ", "static-query"],
    complexity: "O(1) for idempotent ops, O(n log n) build",
    notes: `# Sparse Table

A sparse table is a static data structure for range queries on arrays that do not change. Preprocess in $O(n \log n)$, answer each query in $O(1)$ for **idempotent** operations (where $\text{op}(x, x) = x$, e.g., min, max, gcd).

**Preprocessing:**

$$\text{table}[i][j] = \text{op}(\text{table}[i][j-1],\\; \text{table}[i + 2^{j-1}][j-1])$$

**Query:** For range $[L, R]$ of length $k = R - L + 1$, let $p = \lfloor \log_2 k \rfloor$:

$$\text{query}(L, R) = \text{op}(\text{table}[L][p],\\; \text{table}[R - 2^p + 1][p])$$

\`\`\`cpp
SparseTable<int> st(n, arr);
cout << st.query(1, n);              // O(1) min
\`\`\`

## When to Use

- Static array, idempotent range query (min, max, gcd).
- LCA via RMQ on Euler tour.

## Complexity

| Operation | Complexity |
|-----------|------------|
| Build | $O(n \log n)$ |
| Query (idempotent) | $O(1)$ |
| Query (non-idempotent) | $O(\log n)$ |
| Space | $O(n \log n)$ |`,
  }).returning();
  if (sparseTable) {
    await db.insert(templateCodes).values([{
      templateId: sparseTable.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;

template <typename T>
struct MinOp {
    constexpr T operator()(const T& a, const T& b) const { return a < b ? a : b; }
};

template <typename T = int, typename Op = MinOp<T>, int Base = 0, typename numsType = T>
class SparseTable {
private:
    int n, LOG;
    vector<vector<T>> table;
    vector<int> binLog;
    Op operation;
    T DEFAULT;

    void buildTable() {
        for (int log = 1; log < LOG; log++)
            for (int i = 1; i + (1 << log) - 1 <= n; i++)
                table[i][log] = operation(table[i][log - 1],
                                          table[i + (1 << (log - 1))][log - 1]);
    }

    T queryO1(int L, int R) {
        int log = binLog[R - L + 1];
        return operation(table[L][log], table[R - (1 << log) + 1][log]);
    }

    T queryLogN(int L, int R) {
        T ans = DEFAULT;
        for (int log = LOG; log >= 0; log--) {
            if (L + (1 << log) - 1 <= R) {
                ans = operation(ans, table[L][log]);
                L += 1 << log;
            }
        }
        return ans;
    }

public:

    SparseTable(int N = 0, const vector<numsType>& vec = vector<numsType>(),
                Op op = Op{}, T def = numeric_limits<T>::max())
        : n(N), LOG(__lg(n) + 1), operation(op), DEFAULT(def) {
        table = vector<vector<T>>(n + 10, vector<T>(LOG, DEFAULT));
        binLog = vector<int>(n + 10);
        for (int i = 2; i <= n; i++) binLog[i] = binLog[i >> 1] + 1;
        for (int i = 1; i <= N; i++) table[i][0] = T(vec[i - !Base]);
        buildTable();
    }

    T query(int L, int R, bool isOverlap = false) {
        return !isOverlap ? queryO1(L, R) : queryLogN(L, R);
    }
};`)
    }]);
  }

  // ─── 10. DSU / Union-Find ──────────────────────────────────────────
  const [dsu] = await db.insert(templates).values({
    title: "DSU / Union-Find",
    slug: "dsu",
    description: "Disjoint Set Union with path compression, union by size, and component tracking",
    categoryId: categoryId,
    tags: ["dsu", "union-find", "disjoint-set", "connectivity"],
    complexity: "O(α(n)) amortized per operation",
    notes: `# DSU / Union-Find

A Disjoint Set Union maintains disjoint sets, each identified by a **leader** (representative). Two key operations:

1. **Find:** Follow parent pointers to the root.
2. **Union:** Merge two sets by attaching one root to the other.

**Path compression** flattens the tree: every node on the path to the root points directly at the root. **Union by size** attaches the smaller tree under the larger one.

$$\text{amortized cost per operation} = O(\alpha(n))$$

where $\alpha$ is the inverse Ackermann function (effectively constant, $\leq 4$).

\`\`\`cpp
DSU<> dsu(5);
dsu.unionSets(1, 2);
dsu.unionSets(3, 4);
cout << dsu.isSameSets(1, 3);     // 0
cout << dsu.getSize(1);            // 2
cout << dsu.getComponentsNumber(); // 3
\`\`\`

## When to Use

- Connectivity queries in undirected graphs.
- Cycle detection (union same-set elements — cycle found).
- Kruskal's MST (union edges in weight order).
- Grouping / equivalence class problems.

## Edge Cases

| Case | Behavior |
|------|----------|
| Union of same set | No-op (leader check prevents self-union) |
| Find on single element | Returns itself |
| All elements unioned | $\text{getComponentsNumber}() = 0$ |

## Complexity

| Operation | Complexity |
|-----------|------------|
| Find (path compression) | $O(\alpha(n))$ amortized |
| Union (by size) | $O(\alpha(n))$ amortized |
| Get size | $O(\alpha(n))$ amortized |
| Space | $O(n)$ |`,
  }).returning();
  if (dsu) {
    await db.insert(templateCodes).values([{
      templateId: dsu.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;

template <typename T = int, int Base = 1>
struct DSU {
    vector<T> parent, Gsize, nxt, tail, pos, roots;

    DSU(int MaxNodes) {
        parent = Gsize = roots = tail = pos = nxt = vector<T>(MaxNodes + Base);
        for (int i = Base; i < MaxNodes + Base; i++) {
            parent[i] = roots[i] = pos[i] = tail[i] = i;
            nxt[i] = -1;
            Gsize[i] = 1;
        }
    }

    T findLeader(int node) {
        return parent[node] = (parent[node] == node ? node : findLeader(parent[node]));
    }

    bool isSameSets(int u, int v) { return findLeader(u) == findLeader(v); }

    void unionSets(int u, int v) {
        int leaderU = findLeader(u), leaderV = findLeader(v);
        if (leaderU == leaderV) return;
        if (Gsize[leaderU] < Gsize[leaderV]) swap(leaderU, leaderV);
        int p = pos[leaderV];
        Gsize[leaderU] += Gsize[leaderV];
        parent[leaderV] = leaderU;
        roots[p] = roots.back();
        pos[roots[p]] = p;
        roots.pop_back();
        nxt[tail[leaderU]] = leaderV;
        tail[leaderU] = tail[leaderV];
    }

    void print() {
        for (int root = Base; root < int(roots.size()); root++) {
            for (int u = roots[root]; ~u; u = nxt[u])
                cout << u << " \\n"[!~nxt[u]];
        }
    }

    vector<vector<int>> getComponents() {
        vector<vector<int>> components;
        for (int root = Base; root < int(roots.size()); root++) {
            vector<int> component;
            for (int u = roots[root]; ~u; u = nxt[u]) component.push_back(u);
            components.push_back(component);
        }
        return components;
    }

    int getSize(int u) { return Gsize[findLeader(u)]; }

    int getComponentsNumber() { return int(roots.size()) - Base; }
};`)
    }]);
  }

  // ─── 11. Ordered Set (pb_ds) ──────────────────────────────────────
  const [orderedSet] = await db.insert(templates).values({
    title: "Ordered Set (pb_ds)",
    slug: "ordered-set",
    description: "Policy-based order statistics tree with find_by_order and order_of_key",
    categoryId: categoryId,
    tags: ["ordered-set", "order-statistics", "pb_ds", "tree"],
    complexity: "O(log n) per operation",
    notes: `# Ordered Set (pb_ds)

Built on GNU's policy-based data structures ($\texttt{\\_\\_gnu\\_pbds::tree}$). Extends $\texttt{std::set}$ with **order statistics**: find the $k$-th element or count elements less than a value in $O(\log n)$.

Each node stores subtree size. $\texttt{find\\_by\\_order(k)}$ descends choosing left/right by subtree sizes. $\texttt{order\\_of\\_key(val)}$ counts nodes with keys $< $ \`val\`.

\`\`\`cpp
OrderedMultiset<int> ms;
ms.insert(3); ms.insert(1); ms.insert(3);
cout << ms[0];             // 1
cout << ms.count(3);       // 2
ms.erase(3);
\`\`\`

## When to Use

- Finding the $k$-th smallest/largest element dynamically.
- Counting elements less than a value.
-替代主席树 for offline K-th smallest queries.

## Complexity

| Operation | Complexity |
|-----------|------------|
| Insert | $O(\log n)$ |
| Erase | $O(\log n)$ |
| Find by order | $O(\log n)$ |
| Order of key | $O(\log n)$ |
| Space | $O(n)$ |`,
  }).returning();
  if (orderedSet) {
    await db.insert(templateCodes).values([{
      templateId: orderedSet.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;
using namespace __gnu_pbds;

template <typename K, typename V, typename Comp = std::less<K>>
using orderedMap = tree<K, V, Comp, rb_tree_tag, tree_order_statistics_node_update>;

template <typename K, typename Comp = std::less<K>>
using orderedSet = orderedMap<K, null_type, Comp>;

template <typename K, typename V, typename Comp = std::less_equal<K>>
using orderedMultimap = tree<K, V, Comp, rb_tree_tag, tree_order_statistics_node_update>;

template <typename K, typename Comp = std::less_equal<K>>
using orderedMultiset = orderedMultimap<K, null_type, Comp>;

template <typename T = int, typename CompFunction = std::less_equal<T>>
struct OrderedMultiset {
    orderedMultiset<T, CompFunction> mst;
    int Mode;

    OrderedMultiset(bool isSmaller = true) {
        mst.clear();
        Mode = !isSmaller ? 1 : -1;
    }

    OrderedMultiset(vector<T>& vec, bool isSmaller = true) {
        mst.clear();
        for (auto& x : vec) mst.insert(x);
        Mode = !isSmaller ? 1 : -1;
    }

    void insert(T val) { mst.insert(val); }

    bool isExist(T val) {
        if (mst.upper_bound(val) == mst.end()) return false;
        return (*mst.upper_bound(val) == val);
    }

    void erase(T val) {
        if (isExist(val)) mst.erase(mst.upper_bound(val));
    }

    T at(int idx) { return (*mst.find_by_order(idx)); }

    T operator[](int idx) { return at(idx); }

    int firstIdx(T val) {
        if (!isExist(val)) return -1;
        return mst.order_of_key(val);
    }

    int lastIdx(T val) {
        if (!isExist(val)) return -1;
        if (at(int(mst.size()) - 1) == val) return int(mst.size()) - 1;
        return firstIdx(*mst.lower_bound(val)) - 1;
    }

    T count(T val) {
        if (!isExist(val)) return 0;
        return lastIdx(val) - firstIdx(val) + 1;
    }

    void clear() { mst.clear(); }

    int size() { return int(mst.size()); }

    int orderOfKey(T val) { return mst.order_of_key(val - Mode); }

    typename orderedMultiset<T, CompFunction>::iterator findByOrder(int idx) {
        return mst.find_by_order(idx);
    }

    friend ostream& operator<<(ostream& out, const OrderedMultiset<T, CompFunction>& ms) {
        for (const T& x : ms.mst) out << x << ' ';
        return out;
    }
};`)
    }]);
  }

  // ─── 12. Trie (String) ────────────────────────────────────────────
  const [trie] = await db.insert(templates).values({
    title: "Trie",
    slug: "trie",
    description: "Prefix tree for string insert, search, erase, and prefix queries",
    categoryId: categoryId,
    tags: ["trie", "prefix-tree", "string"],
    complexity: "O(|S|) per operation",
    notes: `# Trie

A trie (prefix tree) stores strings character by character. Each node has $|\\Sigma|$ child pointers and a word-end flag.

**Insertion:** Follow (or create) child pointers for each character. Mark the final node.\n\n**Search:** Follow child pointers; return true only if the final node is a word endpoint.\n\n**Prefix check:** Same as search, without requiring the word-end flag.\n\n**Erasure:** Recursively traverse, decrement frequency, delete nodes with zero frequency.\n\n\`\`\`cpp
Trie<TrieMode::Lowercase> t;
t.insert("hello");
t.insert("hell");
cout << t.search("hello");     // 1
cout << t.isPrefix("hel");    // 1
t.erase("hello");
cout << t.search("hello");     // 0
\`\`\`

## When to Use

- String prefix queries, autocomplete, spell check.
- Dictionary problems, word games.

## Complexity

| Operation | Complexity |
|-----------|------------|
| Insert | $O(|S|)$ |
| Search | $O(|S|)$ |
| Erase | $O(|S|)$ |
| Is prefix | $O(|S|)$ |
| Space | $O(\text{total chars} \times |\\Sigma|)$ |`,
  }).returning();
  if (trie) {
    await db.insert(templateCodes).values([{
      templateId: trie.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;

enum class TrieMode { Lowercase, Uppercase, Digits };

template <TrieMode Mode>
class Trie {
public:

    Trie() : root(new Node()) {}

    void insert(const string& word) {
        Node* curr = root;
        for (char c : word) {
            int index = charToIndex(c);
            if (!curr->children[index])
                curr->children[index] = new Node();
            curr = curr->children[index];
            curr->freq++;
        }
        curr->isWord = true;
    }

    bool search(const string& word) const {
        const Node* curr = root;
        for (char c : word) {
            int index = charToIndex(c);
            if (!curr->children[index]) return false;
            curr = curr->children[index];
        }
        return curr->isWord;
    }

    void erase(const string& word) {
        if (!search(word)) return;
        erase(word, 0, root);
    }

    bool isPrefix(const string& word) const {
        const Node* curr = root;
        for (char c : word) {
            int index = charToIndex(c);
            if (!curr->children[index]) return false;
            curr = curr->children[index];
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
        bool isWord = false;
        int freq = 0;
    };

    Node* root;

    void erase(const string& word, size_t idx, Node* curr) {
        if (idx == word.size()) { curr->isWord = false; return; }
        int index = charToIndex(word[idx]);
        if (curr->children[index]) {
            erase(word, idx + 1, curr->children[index]);
            curr->children[index]->freq--;
            if (curr->children[index]->freq == 0) {
                delete curr->children[index];
                curr->children[index] = nullptr;
            }
        }
    }
};`)
    }]);
  }

  // ─── 13. Binary Trie ──────────────────────────────────────────────
  const [binaryTrie] = await db.insert(templates).values({
    title: "Binary Trie",
    slug: "binary-trie",
    description: "Bit-based trie for XOR maximum queries and integer insert/erase",
    categoryId: categoryId,
    tags: ["binary-trie", "bitwise", "xor", "trie"],
    complexity: "O(log MAX) per operation",
    notes: `# Binary Trie

A binary trie stores integers as bit strings of fixed length $B = 30$ (for $\text{int}$). Each node has two children (bit 0 and bit 1). Insertion and deletion traverse from MSB to LSB.

**XOR maximization:** To find the element maximizing $x \\oplus \text{val}$, traverse from MSB to LSB, greedily choosing the **opposite** bit if available.

\`\`\`cpp
BinaryTrie bt;
vector<int> arr = {3, 10, 5, 25, 2};
for (int x : arr) bt.insert(x);
bt.erase(3);
cout << bt.search(10);  // 1
\`\`\`

## When to Use

- Maximum XOR subarray / subset queries.
- Finding the element closest to a value under XOR metric.

## Complexity

| Operation | Complexity |
|-----------|------------|
| Insert | $O(B)$ where $B = 30$ |
| Search | $O(B)$ |
| Erase | $O(B)$ |
| Max XOR query | $O(B)$ |
| Space | $O(n \cdot B)$ |`,
  }).returning();
  if (binaryTrie) {
    await db.insert(templateCodes).values([{
      templateId: binaryTrie.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;

class BinaryTrie {
public:
    struct Node {
        Node* child[2];
        int freq;

        Node() : freq(0) { child[0] = child[1] = nullptr; }
    };

    Node* root;

    static constexpr int LOG = 30;

    BinaryTrie() : root(new Node()) {}

    void insert(int x) {
        Node* curr = root;
        for (int bit = LOG; bit >= 0; --bit) {
            int bitVal = (x >> bit) & 1;
            if (!curr->child[bitVal])
                curr->child[bitVal] = new Node();
            curr = curr->child[bitVal];
            ++curr->freq;
        }
    }

    void erase(int x) {
        if (search(x)) erase(x, LOG, root);
    }

    bool search(int x) const {
        Node* curr = root;
        for (int bit = LOG; bit >= 0; --bit) {
            int bitVal = (x >> bit) & 1;
            if (!curr->child[bitVal]) return false;
            curr = curr->child[bitVal];
        }
        return true;
    }

private:

    void erase(int x, int bit, Node* curr) {
        if (bit < 0) return;
        int bitVal = (x >> bit) & 1;
        if (curr->child[bitVal]) {
            erase(x, bit - 1, curr->child[bitVal]);
            if (--curr->child[bitVal]->freq == 0) {
                delete curr->child[bitVal];
                curr->child[bitVal] = nullptr;
            }
        }
    }
};`)
    }]);
  }

  // ─── 14. Heavy Light Decomposition ─────────────────────────────────
  const [hld] = await db.insert(templates).values({
    title: "Heavy Light Decomposition",
    slug: "hld",
    description: "Path and subtree queries on trees via heavy-light decomposition",
    categoryId: categoryId,
    tags: ["hld", "heavy-light", "tree", "decomposition"],
    complexity: "O(log² n) per path query",
    notes: `# Heavy Light Decomposition

HLD decomposes a tree into **chains** so that any root-to-leaf path crosses at most $O(\log n)$ light edges. This allows path queries to be answered by decomposing into $O(\log n)$ contiguous segments, each queryable with a segment tree.

**Decomposition:**\n1. DFS computes subtree sizes and identifies the **heavy child** (largest subtree).\n2. DFS assigns positions: heavy children continue the chain; light children start new chains.\n\n**Heavy edge:** Connects a node to its largest subtree child. At most one per node.\n\n**Light edge:** All other edges. Crossing one at least doubles subtree size, so $O(\log n)$ light edges per path.\n\n\`\`\`cpp
HLD<int> hld(n, adj, 1);
SegmentTree<int, int, 1> seg(n);
seg.update(hld.pos[u], nodeVal[u]);
auto res = hld.query(u, v,
    [](int a, int b) { return a + b; },
    [&](int l, int r) { return seg.query(l, r); }, 0);
\`\`\`

## When to Use

- Path queries on trees (sum, max, min along a path).
- Subtree queries.
- Edge-weighted trees (set \`VAL_ON_EDGE = true\`).

## Complexity

| Operation | Complexity |
|-----------|------------|
| Decomposition | $O(n)$ |
| Path query | $O(\log^2 n)$ |
| Point update | $O(\log n)$ |
| Space | $O(n)$ |`,
  }).returning();
  if (hld) {
    await db.insert(templateCodes).values([{
      templateId: hld.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;

template <typename T = int, bool VAL_ON_EDGE = false>
class HLD {
private:
    const vector<vector<int>>& adj;
    vector<int> dep, par, root, pos, SubtreeSz, child;
    int nxtPos;

    void init(int u, int p = -1, int d = 0) {
        dep[u] = d;
        par[u] = p;
        SubtreeSz[u] = 1;
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

    pair<int, int> moveUp(int& u) {
        pair<int, int> ret = {pos[root[u]], pos[u]};
        u = par[root[u]];
        return ret;
    }

    vector<pair<int, int>> queryPath(int u, int v) {
        vector<pair<int, int>> ret;
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

    HLD(int n, const vector<vector<int>>& G, int treeRoot = 1)
        : adj(G), dep(n + 5), par(n + 5), root(n + 5), pos(n + 5),
          SubtreeSz(n + 5), child(n + 5), nxtPos(1) {
        init(treeRoot);
        build(treeRoot);
    }

    void update(int u, T val, const function<void(T, T)>& segUpdate) {
        segUpdate(pos[u], val);
    }

    void update(int u, int v, T val, const function<void(T, T)>& segUpdate) {
        u = getChild(u, v);
        segUpdate(pos[u], val);
    }

    T query(int u_q, int v_q,
            const function<T(T, T)>& operation,
            const function<T(T, T)>& segQuery,
            const T defaultValue) {
        T ret = defaultValue;
        for (auto& [u, v] : queryPath(u_q, v_q))
            ret = operation(ret, segQuery(u, v));
        return ret;
    }
};`)
    }]);
  }

  // ─── 15. Monotonic Stack ───────────────────────────────────────────
  const [monotonicStack] = await db.insert(templates).values({
    title: "Monotonic Stack",
    slug: "monotonic-stack",
    description: "Next/prev greater/smaller element index queries in O(n)",
    categoryId: categoryId,
    tags: ["monotonic-stack", "stack", "next-greater", "next-smaller"],
    complexity: "O(n) for all four queries",
    notes: `# Monotonic Stack

A monotonic stack maintains elements in sorted order. The key insight: when a new element arrives, pop all stack elements that violate the monotonic property — they are blocked and will never be the answer for future elements.

**Invariant:** Elements in the stack are always monotonic. Processing from right to left, pop elements $\geq a[i]$ (for next-greater) — they are blocked by $a[i]$.

\`\`\`cpp
vector<int> a = {2, 1, 5, 3, 4};
auto nge = nextGreater(a);  // {2, 2, 5, 4, 5}
auto pse = prevSmaller(a);  // {-1, -1, 1, 1, 3}
\`\`\`

## When to Use

- Next / previous greater or smaller element.
- Largest rectangle in histogram.
- Trapping rain water.

## Complexity

| Operation | Complexity |
|-----------|------------|
| nextGreater | $O(n)$ |
| prevGreater | $O(n)$ |
| nextSmaller | $O(n)$ |
| prevSmaller | $O(n)$ |
| Space | $O(n)$ |`,
  }).returning();
  if (monotonicStack) {
    await db.insert(templateCodes).values([{
      templateId: monotonicStack.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;

template <typename T>
vector<int> nextGreater(const vector<T>& nums, bool strict = true) {
    int n = nums.size();
    vector<int> res(n, n);
    stack<int> st;
    for (int i = n - 1; i >= 0; i--) {
        while (!st.empty() && (strict ? nums[st.top()] <= nums[i] : nums[st.top()] < nums[i]))
            st.pop();
        res[i] = st.empty() ? n : st.top();
        st.push(i);
    }
    return res;
}

template <typename T>
vector<int> prevGreater(const vector<T>& nums, bool strict = true) {
    int n = nums.size();
    vector<int> res(n, -1);
    stack<int> st;
    for (int i = 0; i < n; i++) {
        while (!st.empty() && (strict ? nums[st.top()] <= nums[i] : nums[st.top()] < nums[i]))
            st.pop();
        res[i] = st.empty() ? -1 : st.top();
        st.push(i);
    }
    return res;
}

template <typename T>
vector<int> nextSmaller(const vector<T>& nums, bool strict = true) {
    int n = nums.size();
    vector<int> res(n, n);
    stack<int> st;
    for (int i = n - 1; i >= 0; i--) {
        while (!st.empty() && (strict ? nums[st.top()] >= nums[i] : nums[st.top()] > nums[i]))
            st.pop();
        res[i] = st.empty() ? n : st.top();
        st.push(i);
    }
    return res;
}

template <typename T>
vector<int> prevSmaller(const vector<T>& nums, bool strict = true) {
    int n = nums.size();
    vector<int> res(n, -1);
    stack<int> st;
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

  // ─── 16. Monotonic Queue ───────────────────────────────────────────
  const [monotonicQueue] = await db.insert(templates).values({
    title: "Monotonic Queue",
    slug: "monotonic-queue",
    description: "Sliding window min/max with O(1) aggregate queries using two monotonic stacks",
    categoryId: categoryId,
    tags: ["monotonic-queue", "queue", "sliding-window"],
    complexity: "O(1) amortized per operation",
    notes: `# Monotonic Queue

A monotonic queue maintains the aggregate of a sliding window in $O(1)$ amortized using the **two-stack queue** pattern. Two monotonic stacks $S_1$ (output) and $S_2$ (input) simulate a queue.

**Push** adds to $S_2$, maintaining the monotonic invariant. **Pop** removes from $S_1$; when $S_1$ is empty, elements transfer from $S_2$ to $S_1$ (reversing order, preserving monotonicity).

**Invariant:** Each stack maintains its own aggregate. Overall: $\text{op}(S_1.\text{mono}, S_2.\text{mono})$.

\`\`\`cpp
MonotonicQueue<int> mq;
for (int i = 0; i < n; i++) {
    mq.push(arr[i]);
    if (i >= k) mq.pop();
    if (i >= k - 1) cout << mq.monotonicVal() << "\\n";
}
\`\`\`

## When to Use

- Sliding window minimum / maximum.
- Alternative to multiset for sliding window problems.

## Complexity

| Operation | Complexity |
|-----------|------------|
| Push | $O(1)$ amortized |
| Pop | $O(1)$ amortized |
| Monotonic value | $O(1)$ |
| Space | $O(n)$ |`,
  }).returning();
  if (monotonicQueue) {
    await db.insert(templateCodes).values([{
      templateId: monotonicQueue.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;

template <typename T>
struct MaxOp {
    constexpr T operator()(const T& a, const T& b) const { return a > b ? a : b; }
};

template <typename T = int, typename Op = MaxOp<T>>
struct MonotonicStack {
    vector<T> st, mono;
    Op operation;
    T DEFAULT;

    MonotonicStack(Op op = Op{}, T defaultVal = T{})
        : operation(op), DEFAULT(defaultVal) {
        mono.push_back(DEFAULT);
    }

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

    T monotonicVal() const { return mono.back(); }

    bool empty() const { return st.empty(); }

    int size() const { return st.size(); }
};

template <typename T = int, typename Op = MaxOp<T>>
struct MonotonicQueue {
    MonotonicStack<T, Op> s1, s2;
    Op operation;
    T DEFAULT;

    MonotonicQueue(Op op = Op{}, T defaultVal = T{})
        : s1(op, defaultVal), s2(op, defaultVal), operation(op), DEFAULT(defaultVal) {}

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

    T monotonicVal() const {
        if (s1.empty()) return s2.monotonicVal();
        if (s2.empty()) return s1.monotonicVal();
        return operation(s1.monotonicVal(), s2.monotonicVal());
    }

    bool empty() const { return s1.empty() && s2.empty(); }

    int size() const { return s1.size() + s2.size(); }
};`)
    }]);
  }

  // ─── 17. Splay Tree ────────────────────────────────────────────────
  const [splayTree] = await db.insert(templates).values({
    title: "Splay Tree",
    slug: "splay-tree",
    description: "Self-adjusting BST with amortized O(log n) operations, duplicates supported",
    categoryId: categoryId,
    tags: ["splay-tree", "bst", "self-balancing"],
    complexity: "O(log n) amortized per operation",
    notes: `# Splay Tree

A splay tree is a self-adjusting BST that performs a **splay operation** after every access, moving the accessed node to the root via rotations. This gives $O(\log n)$ amortized time per operation.

**Splay operation:** Three cases:
1. **Zig:** Parent is root — single rotation.
2. **Zig-zig:** Node and parent are same children — rotate parent first, then node.
3. **Zig-zag:** Node and parent are different children — rotate node twice.

\`\`\`cpp
SplayTree<int> st;
st.insert(3); st.insert(1); st.insert(5); st.insert(3);
cout << st.kth(0);         // 1 (0-indexed)
cout << st.countLess(4);  // 3
cout << st.getSize();     // 4
\`\`\`

## When to Use

- Dynamic sequence with order statistics.
- Amortized $O(\log n)$ without explicit balancing.
- Interval problems (combine with implicit key).

## Complexity

| Operation | Complexity |
|-----------|------------|
| Insert | $O(\log n)$ amortized |
| Erase | $O(\log n)$ amortized |
| Search | $O(\log n)$ amortized |
| K-th element | $O(\log n)$ amortized |
| Count less than | $O(\log n)$ amortized |
| Space | $O(n)$ |`,
  }).returning();
  if (splayTree) {
    await db.insert(templateCodes).values([{
      templateId: splayTree.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;

template <typename T = int>
struct SplayTree {

    struct Node {
        Node* ch[2], *par;
        T val;
        int subSz, freq;

        Node() : subSz(0), freq(0) {
            par = ch[0] = ch[1] = this;
            val = numeric_limits<T>::min();
        }

        Node(T V) : val(V), subSz(1), freq(1) {
            par = ch[0] = ch[1] = EMPTY;
        }

        void update() { subSz = freq + ch[0]->subSz + ch[1]->subSz; }
    };

    static Node* EMPTY;
    Node* root;
    enum dir { LEFT, RIGHT };

    SplayTree() { root = EMPTY; }

    void link(Node* p, Node* c, int d) {
        if (p != EMPTY) p->ch[d] = c, p->update();
        if (c != EMPTY) c->par = p;
    }

    int getDir(Node* p, Node* c) { return p->ch[RIGHT] == c; }

    void rotate(Node* p, int d) {
        Node* q = p->ch[d];
        Node* gp = p->par;
        int gd = getDir(gp, p);
        link(p, q->ch[!d], d);
        link(q, p, !d);
        link(gp, q, gd);
    }

    void splay(Node* q) {
        while (q->par != EMPTY) {
            Node* p = q->par;
            Node* gp = p->par;
            int d1 = getDir(p, q);
            int d2 = getDir(gp, p);
            if (gp == EMPTY) { rotate(p, d1); }
            else if (d1 == d2) { rotate(gp, d2); rotate(p, d1); }
            else { rotate(p, d1); rotate(gp, d2); }
        }
        root = q;
    }

    Node* find(Node* p, T val) {
        if (p == EMPTY) return EMPTY;
        Node* c = p->ch[val > p->val];
        if (p->val == val || c == EMPTY) return p;
        return find(c, val);
    }

    Node* splayByValue(Node* p, T val) {
        p = find(p, val);
        splay(p);
        return p;
    }

    Node* insert(Node* p, T val) {
        if (p == EMPTY) return new Node(val);
        p = splayByValue(p, val);
        if (p->val == val) { p->freq++; p->subSz++; return p; }
        Node* q = new Node(val);
        if (p->ch[val > p->val] != EMPTY) {
            auto c = p->ch[val > p->val];
            link(p, EMPTY, val > p->val);
            link(q, c, q->val < c->val);
            link(q, p, q->val < p->val);
            p = q;
        } else
            link(p, q, val > p->val);
        return p;
    }

    void insert(T val) { root = insert(root, val); }

    void split(Node* p, T val, Node*& ls, Node*& ge) {
        p = splayByValue(p, val);
        if (p->val < val) {
            ls = p; ge = p->ch[RIGHT];
            link(ls, EMPTY, RIGHT);
            link(EMPTY, ge, LEFT);
        } else {
            ls = p->ch[LEFT]; ge = p;
            link(ge, EMPTY, LEFT);
            link(EMPTY, ls, RIGHT);
        }
    }

    Node* merge(Node* ls, Node* ge) {
        if (ls == EMPTY) return ge;
        if (ge == EMPTY) return ls;
        ge = splayByValue(ge, numeric_limits<T>::min());
        link(ge, ls, LEFT);
        return ge;
    }

    Node* erase(Node* p, T val) {
        p = splayByValue(p, val);
        if (p->val != val) return p;
        if (p->freq > 1) { p->freq--; p->subSz--; return p; }
        Node* ls = p->ch[LEFT];
        Node* ge = p->ch[RIGHT];
        delete p;
        link(EMPTY, ls, LEFT);
        link(EMPTY, ge, RIGHT);
        return merge(ls, ge);
    }

    void erase(T val) { root = erase(root, val); }

    Node* kth(Node* p, T k) {
        if (p == EMPTY) return EMPTY;
        if (k > p->subSz) return EMPTY;
        int sz = p->ch[LEFT]->subSz;
        if (sz > k) return kth(p->ch[LEFT], k);
        if (sz + p->freq <= k) return kth(p->ch[RIGHT], k - sz - p->freq);
        return p;
    }

    T kth(T k) {
        auto p = kth(root, k);
        splay(p);
        root = p;
        return p->val;
    }

    int countLess(T val) {
        root = splayByValue(root, val);
        return root->ch[LEFT]->subSz + (root->val < val ? root->freq : 0);
    }

    int getSize() { return root->subSz; }

    void print(Node* p, int depth) {
        if (p == EMPTY) return;
        print(p->ch[LEFT], depth + 1);
        cout << string(2 * depth, ' ') << setw(2) << p->val << "\\n";
        print(p->ch[RIGHT], depth + 1);
    }

    void print() { print(root, 0); cout << "-----------------------------------\\n"; }

    bool search(T val) {
        root = splayByValue(root, val);
        return root->val == val;
    }
};

template <typename T>
typename SplayTree<T>::Node* SplayTree<T>::EMPTY = new typename SplayTree<T>::Node();`)
    }]);
  }

  // ─── 18. Implicit Splay Tree ───────────────────────────────────────
  const [implicitSplay] = await db.insert(templates).values({
    title: "Implicit Splay Tree",
    slug: "implicit-splay-tree",
    description: "Implicit key splay tree for sequence split/merge and range queries with lazy propagation",
    categoryId: categoryId,
    tags: ["splay-tree", "implicit", "sequence", "range-query", "lazy"],
    complexity: "O(log n) amortized per operation",
    notes: `# Implicit Splay Tree

An implicit splay tree uses the **position** (index) as the key, making it ideal for sequence operations: insert at position, erase at position, range queries, and lazy propagation.

**Split/merge:** Core operations. Split at position $k$ divides into $[0, k)$ and $[k, n)$. Merge concatenates two sequences. All other operations are built on split/merge.

**Lazy propagation:** Each node stores a lazy tag. Before accessing a subtree, push the tag down. The \`Data\` struct stores aggregate information (e.g., max subarray sum) recomputed during \`update()\`.

\`\`\`cpp
ImplicitSplayTree<Data> st;
st.insert(0, 3);
st.insert(1, -1);
st.insert(2, 5);
cout << st.query(0, 2);   // max subarray sum = 7
\`\`\`

## When to Use

- Sequence operations with range queries.
- Max subarray sum on dynamic sequences.
- Problems requiring split/merge on arrays.

## Complexity

| Operation | Complexity |
|-----------|------------|
| Insert at position | $O(\log n)$ amortized |
| Erase at position | $O(\log n)$ amortized |
| Range query | $O(\log n)$ amortized |
| Space | $O(n)$ |`,
  }).returning();
  if (implicitSplay) {
    await db.insert(templateCodes).values([{
      templateId: implicitSplay.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;

using ll = long long;

const ll LINF = 1e18;

struct Data {
    ll val, sum, pref, suff, maxSeg;
    Data() : val(0), sum(0), pref(-LINF), suff(-LINF), maxSeg(-LINF) {}
    Data(ll v) : val(v), sum(val), pref(val), suff(val), maxSeg(val) {}
};

Data combine(const Data& a, const Data& b) {
    Data res;
    res.sum = a.sum + b.sum;
    res.pref = max(a.pref, a.sum + b.pref);
    res.suff = max(b.suff, b.sum + a.suff);
    res.maxSeg = max({a.maxSeg, b.maxSeg, a.suff + b.pref});
    return res;
}

template <typename T = Data>
struct ImplicitSplayTree {

    struct Node {
        Node *ch[2], *par;
        T val, update;
        int subSz;
        bool isLazy;

        Node() : subSz(0), update(0), isLazy(false) {
            par = ch[0] = ch[1] = this;
        }

        Node(T V) : val(V), subSz(1), update(0), isLazy(false) {
            par = ch[0] = ch[1] = EMPTY;
        }

        void updateNode() {
            subSz = ch[0]->subSz + ch[1]->subSz + 1;
            auto v = val.val;
            val = combine(ch[0]->val, combine(Data(v), ch[1]->val));
            val.val = v;
        }

        void pushDown() {
            if (this == EMPTY || !isLazy) return;
            val = Data(update * subSz);
            ch[0]->lazyUpdate(update);
            ch[1]->lazyUpdate(update);
            isLazy = false;
        }

        void lazyUpdate(ll c) {
            if (this == EMPTY) return;
            update = c;
            isLazy = true;
        }
    };

    static Node* EMPTY;
    Node* root;
    enum dir { LEFT, RIGHT };

    ImplicitSplayTree() { root = EMPTY; }

    void link(Node* p, Node* c, int d) {
        if (p != EMPTY) p->ch[d] = c, p->updateNode();
        if (c != EMPTY) c->par = p;
    }

    int getDir(Node* p, Node* c) { return p->ch[RIGHT] == c; }

    void rotate(Node* p, int d) {
        Node* q = p->ch[d];
        Node* gp = p->par;
        int gd = getDir(gp, p);
        link(p, q->ch[!d], d);
        link(q, p, !d);
        link(gp, q, gd);
    }

    void splay(Node* q) {
        while (q->par != EMPTY) {
            Node* p = q->par;
            Node* gp = p->par;
            int d1 = getDir(p, q);
            int d2 = getDir(gp, p);
            if (gp == EMPTY) { rotate(p, d1); }
            else if (d1 == d2) { rotate(gp, d2); rotate(p, d1); }
            else { rotate(p, d1); rotate(gp, d2); }
        }
        root = q;
    }

    void split(Node* p, int idx, Node*& ls, Node*& ge) {
        if (idx >= p->subSz) { ls = p; ge = EMPTY; return; }
        p = splayByIdx(p, idx);
        ls = p->ch[LEFT];
        ge = p;
        link(ge, EMPTY, LEFT);
        link(EMPTY, ls, RIGHT);
    }

    Node* splayByIdx(Node* p, int idx) {
        p = at(p, idx);
        splay(p);
        return p;
    }

    Node* merge(Node* ls, Node* ge) {
        if (ls == EMPTY) return ge;
        if (ge == EMPTY) return ls;
        ge = splayByIdx(ge, 0);
        link(ge, ls, LEFT);
        return ge;
    }

    void merge(Node* p) { root = merge(root, p); }

    Node* at(Node* p, int k) {
        if (p == EMPTY) return EMPTY;
        p->pushDown();
        if (k > p->subSz) return EMPTY;
        int sz = p->ch[LEFT]->subSz;
        if (sz > k) return at(p->ch[LEFT], k);
        if (sz + 1 <= k) return at(p->ch[RIGHT], k - sz - 1);
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
        between->val = val;
        root = merge(merge(before, between), after);
    }

    ll query(int s, int e) {
        Node *before, *after, *between;
        split(root, e + 1, before, after);
        split(before, s, before, between);
        ll ans = between->val.maxSeg;
        root = merge(merge(before, between), after);
        return ans;
    }

    int getSize() { return root->subSz; }
};

template <typename T>
typename ImplicitSplayTree<T>::Node* ImplicitSplayTree<T>::EMPTY =
    new typename ImplicitSplayTree<T>::Node();`)
    }]);
  }

  // ─── 19. Heap (Min-Heap / Max-Heap) ───────────────────────────────
  const [heap] = await db.insert(templates).values({
    title: "Heap",
    slug: "heap",
    description: "Binary heap with custom comparator and push/pop/top/size",
    categoryId: categoryId,
    tags: ["heap", "priority-queue", "binary-heap"],
    complexity: "O(log n) push/pop, O(1) top",
    notes: `# Heap

A binary heap is a complete binary tree stored in an array, satisfying the heap property: for a max-heap, every parent is $\geq$ its children; for a min-heap, every parent is $\leq$ its children.

**Indexing (1-based):** Parent of $i$ is $\lfloor i/2 \rfloor$, left child is $2i$, right child is $2i+1$.

\`\`\`cpp
MinHeap<int> pq;
pq.push(5); pq.push(3); pq.push(7);
cout << pq.top();  // 3
pq.pop();          // removes 3
\`\`\`

## When to Use

- Priority queue operations (insert, extract min/max).
- Dijkstra's shortest path (min-heap).
- Merge K sorted lists/arrays.

## Complexity

| Operation | Complexity |
|-----------|------------|
| Push | $O(\log n)$ |
| Pop | $O(\log n)$ |
| Top | $O(1)$ |
| Size | $O(1)$ |
| Space | $O(n)$ |`,
  }).returning();
  if (heap) {
    await db.insert(templateCodes).values([{
      templateId: heap.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;

template <typename T>
struct MaxCmp {
    bool operator()(const T& a, const T& b) const { return a < b; }
};

template <typename T>
struct MinCmp {
    bool operator()(const T& a, const T& b) const { return a > b; }
};

template <typename T = int, typename Comp = MinCmp<T>>
struct Heap {

    vector<T> pq;
    int sz = 0;
    Comp comp;

    Heap() = default;

    Heap(Comp c) : comp(c) {}

    void heapifyUp(int i) {
        while (i > 1 && comp(pq[i], pq[i / 2])) {
            swap(pq[i], pq[i / 2]);
            i /= 2;
        }
    }

    void heapifyDown(int i) {
        while (2 * i <= sz) {
            int j = 2 * i;
            if (j + 1 <= sz && comp(pq[j + 1], pq[j])) j++;
            if (comp(pq[i], pq[j])) break;
            swap(pq[i], pq[j]);
            i = j;
        }
    }

    void push(T x) {
        pq.push_back(x);
        sz++;
        heapifyUp(sz);
    }

    void pop() {
        swap(pq[1], pq[sz]);
        pq.pop_back();
        sz--;
        heapifyDown(1);
    }

    T top() const { return pq[1]; }

    bool empty() const { return sz == 0; }

    int size() const { return sz; }
};`)
    }]);
  }

  // ─── 20. Coordinate Compression ────────────────────────────────────
  const [coordCompression] = await db.insert(templates).values({
    title: "Coordinate Compression",
    slug: "coordinate-compression",
    description: "Map arbitrary values to dense 0-indexed indices for use with BIT/segment tree",
    categoryId: categoryId,
    tags: ["coordinate-compression", "mapping", "discretization"],
    complexity: "O(n log n) for compression, O(log n) per lookup",
    notes: `# Coordinate Compression

Coordinate compression maps a sparse set of values to a dense $0..k-1$ index range. This is essential when using BIT/segment tree with values outside $[1, n]$ or when the value range is large but the number of distinct values is small.

**Algorithm:**
1. Collect all values, sort and remove duplicates.
2. Use binary search to find each value's rank.
3. Ranks are 0-indexed and contiguous.

\`\`\`cpp
CoordinateCompression cc;
cc.add(10); cc.add(5); cc.add(20);
cc.init();                    // {10, 5, 20} -> sorted {5, 10, 20}
cout << cc.getRank(10);     // 1 (0-indexed)
cout << cc.getValue(1);     // 10
\`\`\`

## When to Use

- BIT or segment tree with large value ranges.
- Counting distinct elements in a range.
- Any problem requiring dense indexing of sparse values.

## Complexity

| Operation | Complexity |
|-----------|------------|
| add | $O(1)$ |
| init | $O(n \log n)$ |
| getRank | $O(\log n)$ |
| getValue | $O(1)$ |
| Space | $O(n)$ |`,
  }).returning();
  if (coordCompression) {
    await db.insert(templateCodes).values([{
      templateId: coordCompression.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;

struct CoordinateCompression {
    vector<int> val;

    void add(int x) { val.push_back(x); }

    void init() {
        sort(val.begin(), val.end());
        val.erase(unique(val.begin(), val.end()), val.end());
    }

    int getRank(int x) { return lower_bound(val.begin(), val.end(), x) - val.begin(); }

    int getValue(int idx) { return val[idx]; }

    int size() { return val.size(); }
};`)
    }]);
  }

}
