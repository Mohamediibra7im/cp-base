import { sql } from "drizzle-orm";
import { templates, templateCodes } from "../schema";
import { stripMain, type Db, type CatMap } from "./helpers";

export async function seedDP(db: Db, catMap: CatMap) {
  const categoryId = catMap["dp"];
  if (!categoryId) return;

  // --- Kadane ---
  const [kadane] = await db.insert(templates).values({
    title: "Kadane's Algorithm", slug: "kadane",
    description: "Maximum subarray sum in O(n) time",
    categoryId: categoryId,
    tags: ["kadane", "subarray", "maximum-sum", "dp"],
    complexity: "O(n)",
    notes: `# Kadane's Algorithm

Finds the maximum subarray sum in O(n) time.

## Usage

\`\`\`cpp
vector<int> arr = {-2, 1, -3, 4, -1, 2, 1, -5, 4};
int max_sum = Kadane(arr);  // returns 6 (subarray [4, -1, 2, 1])
\`\`\`

## Algorithm

Maintain \`max_ending\` = max subarray sum ending at current position.
- Either extend the previous subarray (\`max_ending + x\`)
- Or start a new subarray at current position (\`x\`)
Keep global \`max_subarray\` as max of all \`max_ending\` values.

## Variations

- **Circular Kadane**: max subarray sum in circular array = max(standard Kadane, total_sum - min_subarray_sum)
- **2D Kadane**: reduce rows using prefix sums, apply 1D Kadane on each column compression`,
  }).returning();
  if (kadane) {
    await db.insert(templateCodes).values([{
      templateId: kadane.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;
#define all(vec) vec.begin(), vec.end()
#define rall(vec) vec.rbegin(), vec.rend()
#define sz(x) int(x.size())
#define ll long long
template < typename T = int > T Kadane(const vector < T > &arr){
    T max_ending = 0, max_subarray = 0;
    for(auto& x : arr){ max_ending = max(x, max_ending + x); max_subarray = max(max_subarray, max_ending); }
    return max_subarray;
}`)
    }]);
  }

  // --- Digit DP ---
  const [digitDp] = await db.insert(templates).values({
    title: "Digit DP", slug: "digit-dp",
    description: "Digit dynamic programming for counting numbers with digit constraints",
    categoryId: categoryId,
    tags: ["digit-dp", "dp", "digits", "counting"],
    complexity: "O(len · tight · sum_state)",
    notes: `# Digit DP

Count numbers in range [L, R] satisfying a property by processing digits from most significant to least.

## Usage

\`\`\`cpp
// Count numbers with no consecutive equal digits in [L, R]
ll ans = solve(L, R);
\`\`\`

## State Variables

- **idx**: current digit position (0 = most significant)
- **tight**: whether the prefix so far matches the upper bound
- **started**: whether a non-zero digit has been placed (for leading zeros)
- **last_digit**: value of the last placed digit (custom state variable)

## Customization

Modify the DP state and transition to match your counting condition:
1. Add more dimensions to \`dp[idx][tight][started][...custom...]\`
2. Modify the loop \`for (int d = 0; d <= limit; d++)\`
3. Adjust the transition logic after \`if (!nstarted)\`

## Complexity

- State space: O(len · 2 · 2 · sum_state)
- Transitions: O(10) per state`,
  }).returning();
  if (digitDp) {
    await db.insert(templateCodes).values([{
      templateId: digitDp.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;
#define all(vec) vec.begin(), vec.end()
#define rall(vec) vec.rbegin(), vec.rend()
#define sz(x) int(x.size())
#define ll long long
ll dp[20][2][2][10]; string num; int K;
ll solve_dp(int idx, bool tight, bool started, int last_digit) {
    if (idx == sz(num)) return started ? 1 : 0;
    ll &ret = dp[idx][tight][started][last_digit]; if (~ret) return ret; ret = 0;
    int limit = tight ? num[idx] - '0' : 9;
    for (int d = 0; d <= limit; d++) {
        bool ntight = tight && (d == limit);
        bool nstarted = started || d != 0;
        if (!nstarted) ret += solve_dp(idx + 1, ntight, false, 0);
        else ret += solve_dp(idx + 1, ntight, true, d);
    }
    return ret;
}
ll solve(ll l, ll r) {
    if (l > r) return 0;
    num = to_string(r); memset(dp, -1, sizeof(dp)); ll R = solve_dp(0, 1, 0, 0);
    num = to_string(l - 1); memset(dp, -1, sizeof(dp)); ll L = solve_dp(0, 1, 0, 0);
    return R - L;
}`)
    }]);
  }

  // --- Convex Hull Trick ---
  const [cht] = await db.insert(templates).values({
    title: "Convex Hull Trick (Li Chao)", slug: "convex-hull-trick",
    description: "Li Chao segment tree for dynamic line insertion and min/max query",
    categoryId: categoryId,
    tags: ["cht", "li-chao", "convex-hull", "dp-optimization"],
    complexity: "O(log C) per insert/query",
    notes: `# Convex Hull Trick (Li Chao Segment Tree)

Insert lines y = m·x + c and query minimum (or maximum) at any x in O(log C) time.

## Usage

\`\`\`cpp
LiChao lc(-1e9, 1e9);       // x range
lc.add_line(Line(2, 3));    // insert y = 2x + 3
ll val = lc.query(5);       // min value at x = 5
\`\`\`

## Algorithm

Each node stores the "best" line for the midpoint of its range. When inserting a new line, compare it with the existing line at the midpoint — the worse line gets pushed down to the child where it might win.

## When to Use

Use Li Chao when:
- Lines are added dynamically (not known in advance)
- Queries are interleaved with insertions
- x coordinates are bounded (can be compressed)

## Complexity

- Insert: O(log C) where C = coordinate range
- Query: O(log C)
- Memory: O(N log C) dynamic nodes`,
  }).returning();
  if (cht) {
    await db.insert(templateCodes).values([{
      templateId: cht.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;
#define all(vec) vec.begin(), vec.end()
#define rall(vec) vec.rbegin(), vec.rend()
#define sz(x) int(x.size())
#define fi first
#define se second
#define ll long long
struct Line { ll m, c; Line(ll _m = 0, ll _c = LLONG_MAX) : m(_m), c(_c) {} ll operator()(ll x) { return m * x + c; } };
struct LiChao {
    struct Node { Line line; Node *l, *r; Node(Line _line = Line()) : line(_line), l(nullptr), r(nullptr) {} };
    Node *root; ll L, R;
    LiChao(ll _L, ll _R) : L(_L), R(_R) { root = new Node(); }
    void add_line(Line new_line) { add_line(root, L, R, new_line); }
    ll query(ll x) { return query(root, L, R, x); }
    void add_line(Node *node, ll l, ll r, Line new_line) {
        ll mid = (l + r) >> 1; bool left = new_line(l) < node->line(l); bool m = new_line(mid) < node->line(mid);
        if (m) swap(node->line, new_line); if (l == r) return;
        if (left != m) { if (!node->l) node->l = new Node(); add_line(node->l, l, mid, new_line); }
        else { if (!node->r) node->r = new Node(); add_line(node->r, mid + 1, r, new_line); }
    }
    ll query(Node *node, ll l, ll r, ll x) {
        if (!node) return LLONG_MAX; ll ans = node->line(x); if (l == r) return ans;
        ll mid = (l + r) >> 1;
        if (x <= mid) return min(ans, query(node->l, l, mid, x));
        else return min(ans, query(node->r, mid + 1, r, x));
    }
};`)
    }]);
  }
}
