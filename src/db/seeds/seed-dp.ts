import { sql } from "drizzle-orm";
import { templates, templateCodes } from "../schema";
import { stripMain, type Db, type CatMap } from "./helpers";

export async function seedDP(db: Db, catMap: CatMap) {
  const categoryId = catMap["dp"];
  if (!categoryId) return;

  // --- Kadane's Algorithm --------------------------------------------------------
  const [kadane] = await db.insert(templates).values({
    title: "Kadane's Algorithm",
    slug: "kadane",
    description: "Maximum contiguous subarray sum in O(n) time using linear DP",
    categoryId: categoryId,
    tags: ["kadane", "subarray", "maximum-sum", "dp", "contiguous"],
    complexity: "O(n) time, O(1) space",
    notes: `# Kadane's Algorithm

Finds the **maximum sum of a contiguous subarray** in O(n) time using a single pass.

This is the simplest and most classic linear DP problem. The key insight is that at each position, you only need to decide: **extend the previous subarray or start fresh**.

## How It Works

Define $dp[i]$ as the maximum subarray sum **ending at index $i$** (i.e., the subarray must include $a[i]$).

### Recurrence

$$dp[i] = \\max(a[i], \\; dp[i-1] + a[i])$$

- $a[i]$: start a new subarray at position $i$ (discard everything before).
- $dp[i-1] + a[i]$: extend the previous subarray by appending $a[i]$.

The answer is the global maximum:

$$\\text{answer} = \\max_{0 \\le i < n} dp[i]$$

In the template, we track \`maxEnding\` ($dp[i]$) and \`maxSubarray\` (global answer) as rolling variables — no array needed.

### Step-by-step walkthrough

For \`arr = [-2, 1, -3, 4, -1, 2, 1, -5, 4]\`:

| $i$ | $a[i]$ | $dp[i]$ | $\\max dp$ | Decision |
|-----|--------|---------|-----------|----------|
| 0 | -2 | -2 | -2 | start fresh |
| 1 | 1 | 1 | 1 | start fresh |
| 2 | -3 | -2 | 1 | extend |
| 3 | 4 | 4 | 4 | start fresh |
| 4 | -1 | 3 | 4 | extend |
| 5 | 2 | 5 | 5 | extend |
| 6 | 1 | 6 | 6 | extend |
| 7 | -5 | 1 | 6 | extend |
| 8 | 4 | 5 | 6 | extend |

Answer: **6** (subarray \`[4, -1, 2, 1]\`)

## When to Use

- Problem asks for **maximum sum/minimum sum of a contiguous subarray**
- Elements can be negative — if all non-negative, the answer is just the total sum
- Variants: circular subarray, 2D subarray, maximum product subarray
- As a subroutine inside larger DP problems (e.g., maximum sum rectangle in a matrix)

**Do NOT use when:**
- You need the maximum **non-contiguous** subset sum (use standard subset DP)
- You need the actual subarray indices (minor modification needed — track start/end pointers)
- You need range-specific queries on subarrays (use segment tree instead)

## Edge Cases

1. **All negative numbers**: returns the least negative element (not 0). If you want 0 for "empty subarray allowed", initialize \`maxSubarray = 0\` and \`maxEnding = 0\` instead.
2. **Single element**: returns that element.
3. **Empty array**: the template returns 0. Adjust if needed.
4. **Integer overflow**: use \`long long\` for large arrays with values near $10^9$.

## Complexity

- **Time**: $O(n)$ — single pass through the array
- **Space**: $O(1)$ — two rolling variables

## Usage

\`\`\`cpp
vector<int> arr = {-2, 1, -3, 4, -1, 2, 1, -5, 4};
ll maxSum = kadane(arr);  // returns 6

// All-negative case:
vector<int> neg = {-5, -3, -1};
ll maxNeg = kadane(neg);  // returns -1 (least negative)
\`\`\`

## Variations

- **Circular Kadane**: maximum subarray in a circular array = $\\max(\\text{Kadane}, \\text{total} - \\text{min subarray sum})$. Edge case: all negative → return Kadane result.
- **2D Kadane**: fix top and bottom rows, compute column-wise prefix sums, apply 1D Kadane. $O(n^3)$ for $n \\times n$ matrix.
- **Maximum product subarray**: track both min and max ending at each position (products can flip sign).
- **Kadane with indices**: track the start position of the current subarray for returning the actual subarray.`,
  }).returning();
  if (kadane) {
    await db.insert(templateCodes).values([{
      templateId: kadane.id,
      language: "cpp",
      code: stripMain(`#include <bits/stdc++.h>
using ll = long long;

/**
 * @brief Finds the maximum contiguous subarray sum using Kadane's algorithm.
 *
 * Maintains two rolling variables: maxEnding (best sum ending at current
 * position) and maxSubarray (global best). At each element, we either
 * extend the previous subarray or start a new one.
 *
 * @param arr Input array of integers (may contain negatives).
 * @return The maximum sum of any contiguous subarray. Returns 0 for an
 *         empty array. If all elements are negative, returns the least
 *         negative element.
 *
 * @note Time complexity: O(n), Space complexity: O(1).
 */
template <typename T = ll>
T kadane(const std::vector<T>& arr) {
    T maxEnding = 0;
    T maxSubarray = 0;
    for (const auto& x : arr) {
        maxEnding = std::max(x, maxEnding + x);
        maxSubarray = std::max(maxSubarray, maxEnding);
    }
    return maxSubarray;
}`
      )
    }]);
  }

  // --- Digit DP ------------------------------------------------------------------
  const [digitDp] = await db.insert(templates).values({
    title: "Digit DP",
    slug: "digit-dp",
    description: "Count numbers in a range satisfying digit-level constraints using DP on digits",
    categoryId: categoryId,
    tags: ["digit-dp", "dp", "digits", "counting", "range-query"],
    complexity: "O(len \\cdot 2 \\cdot 2 \\cdot S) where S = extra state dimension",
    notes: `# Digit DP

A technique for **counting numbers in a range $[L, R]$ that satisfy some digit-level property**. Instead of iterating over all numbers (which is too slow), we process digits from most significant to least significant, building the number one digit at a time while tracking constraints.

## How It Works

### Core Idea

Convert the problem into: **count valid numbers $\\le N$** for any upper bound $N$, then use $\\text{solve}(L, R) = f(R) - f(L-1)$.

### State Definition

The DP state is defined by:

$$dp(\\text{idx}, \\text{tight}, \\text{started}, \\text{custom\\_state})$$

- **idx**: current digit position being processed (0 = most significant)
- **tight**: boolean — whether all digits chosen so far exactly match the prefix of the upper bound. When \`tight = 1\`, the current digit is limited to \`digit[idx]\` of the bound. When \`tight = 0\`, we can place any digit 0–9.
- **started**: boolean — whether we have placed a non-zero digit yet. This handles leading zeros (e.g., the number 5 is represented as \`005\` with 3 digits).
- **custom_state**: any extra information needed for your specific constraint (e.g., sum of digits, last digit placed, count of specific digits).

### Recurrence

$$dp(\\text{idx}, \\text{tight}, \\text{started}, \\text{state}) = \\sum_{d=0}^{\\text{limit}} dp(\\text{idx}+1, \\text{ntight}, \\text{nstarted}, \\text{nstate})$$

Where:
- $\\text{limit} = \\text{tight} \\ ? \\ \\text{digit}[\\text{idx}] \\ : \\ 9$
- $\\text{ntight} = \\text{tight} \\ \\wedge \\ (d = \\text{limit})$
- $\\text{nstarted} = \\text{started} \\ \\vee \\ (d \\neq 0)$
- $\\text{nstate}$ depends on your custom constraint

### Base Case

$$dp(n, \\text{\\_}, \\text{\\_}, \\text{\\_}) = \\text{started} \\ ? \\ 1 \\ : \\ 0$$

We only count the number if at least one non-zero digit was placed (to avoid counting 0 multiple times).

### Memoization

Use $-1$ sentinel in the DP table to indicate uncomputed states. The table is reset between the $R$ and $L-1$ calls since the bounds differ.

## When to Use

- "Count integers in $[L, R]$ where the digits satisfy property $P$"
- "How many numbers from $A$ to $B$ have digit sum $= K$"
- "Count numbers with no repeated digits in range"
- "Count numbers divisible by $K$ whose digit sum is $\\le S$"
- Problems where direct enumeration is infeasible ($R$ can be up to $10^{18}$)

**Do NOT use when:**
- The constraint is on the value modulo something without digit structure (use modular arithmetic instead)
- You need to optimize (not count) — then it's a different approach

## Edge Cases

1. **Leading zeros**: the \`started\` flag ensures \`0\` is counted exactly once. Without it, numbers like \`005\` and \`5\` would be double-counted.
2. **$L = 1$**: $L - 1 = 0$. The DP for $0$ returns 0 (not started), so $f(0) = 0$. This is correct.
3. **$L > R$**: return 0 immediately.
4. **Very large bounds**: $R$ up to $10^{18}$ fits in \`long long\`, and has at most 19 digits, so the state space is small.

## Complexity

- **State space**: $O(\\text{digits} \\cdot 2 \\cdot 2 \\cdot S)$ where $S$ is the range of your extra state
- **Transitions per state**: $O(10)$ (digits 0–9)
- **Total**: $O(\\text{digits} \\cdot 2 \\cdot 2 \\cdot S \\cdot 10)$
- For a 19-digit bound with no extra state: $O(19 \\cdot 2 \\cdot 2 \\cdot 10) = O(760)$

## Usage

\`\`\`cpp
// Count numbers in [L, R] with no consecutive equal digits
ll ans = solve(l, r);
\`\`\`

## Customization Guide

1. **Add dimensions** to the DP table for your constraint:
   - Sum of digits: add \`dp[idx][tight][started][sum]\`
   - Last digit placed: already included as \`last_digit\`
   - Count of specific digits: add \`dp[idx][tight][started][count]\`
2. **Modify the transition loop** $d = 0 \\to \\text{limit}$ and update \`nstate\` accordingly
3. **Adjust the base case** if your condition requires checking the full number (e.g., modular condition)
4. **Change the return value** from 1 to other values if you need to compute something other than count`,
  }).returning();
  if (digitDp) {
    await db.insert(templateCodes).values([{
      templateId: digitDp.id,
      language: "cpp",
      code: stripMain(`#include <bits/stdc++.h>
using ll = long long;

ll dp[20][2][2][10];
std::string num;

/**
 * @brief Recursively counts valid numbers by processing digits left to right.
 *
 * State: (idx, tight, started, lastDigit)
 * - idx:       current digit position (0 = most significant)
 * - tight:     1 if prefix matches upper bound exactly, 0 otherwise
 * - started:   1 if a non-zero digit has been placed
 * - lastDigit: value of the most recently placed digit (0 if not started)
 *
 * At each position, try all digits 0..limit where limit depends on tight.
 * When tight=1, limit is the actual digit of the bound; when tight=0, limit is 9.
 *
 * @param idx       Current digit index being filled.
 * @param tight     Whether we are still constrained by the upper bound.
 * @param started   Whether a non-zero digit has been placed yet.
 * @param lastDigit The last placed digit (relevant only when started=1).
 * @return Count of valid completions from this state.
 */
ll solveDp(int idx, bool tight, bool started, int lastDigit) {
    if (idx == (int)num.size()) {
        return started ? 1 : 0;
    }
    ll& ret = dp[idx][tight][started][lastDigit];
    if (~ret) return ret;
    ret = 0;

    int limit = tight ? num[idx] - '0' : 9;
    for (int d = 0; d <= limit; d++) {
        bool ntight   = tight && (d == limit);
        bool nstarted = started || (d != 0);
        if (!nstarted) {
            ret += solveDp(idx + 1, ntight, false, 0);
        } else {
            ret += solveDp(idx + 1, ntight, true, d);
        }
    }
    return ret;
}

/**
 * @brief Counts numbers in [l, r] satisfying the digit constraint.
 *
 * Uses the standard prefix technique: f(r) - f(l-1).
 * Each call resets the memoization table and sets the digit string.
 *
 * @param l Lower bound of the range (inclusive).
 * @param r Upper bound of the range (inclusive).
 * @return Number of integers in [l, r] that satisfy the digit property.
 */
ll solve(ll l, ll r) {
    if (l > r) return 0;

    num = std::to_string(r);
    std::memset(dp, -1, sizeof(dp));
    ll R = solveDp(0, 1, 0, 0);

    num = std::to_string(l - 1);
    std::memset(dp, -1, sizeof(dp));
    ll L = solveDp(0, 1, 0, 0);

    return R - L;
}`
      )
    }]);
  }

  // --- Convex Hull Trick (Li Chao) -----------------------------------------------
  const [cht] = await db.insert(templates).values({
    title: "Convex Hull Trick (Li Chao)",
    slug: "convex-hull-trick",
    description: "Li Chao segment tree for dynamic line insertion and minimum/maximum query at any point",
    categoryId: categoryId,
    tags: ["cht", "li-chao", "convex-hull", "dp-optimization", "dynamic-programming"],
    complexity: "O(log C) per insert/query, C = coordinate range",
    notes: `# Convex Hull Trick — Li Chao Segment Tree

Dynamically maintains a set of lines $y = m_i x + c_i$ and queries $\\min_i (m_i x + c_i)$ at any $x$ in a bounded range. Unlike classic CHT (requires sorted slopes or offline), Li Chao handles **arbitrary insertion order** and **interleaved queries**.

## How It Works

At each segment tree node over $[L, R]$, store the line **best at the midpoint** $\\text{mid} = \\lfloor(L+R)/2\\rfloor$.

### Insertion

Given $\\ell_{\\text{new}}$ and node line $\\ell_{\\text{cur}}$ covering $[l, r]$:

1. Compare at $\\text{mid} = \\lfloor(l+r)/2\\rfloor$ — swap if new is better
2. At leaf ($l = r$): stop
3. Push the worse line to the child where it wins:
   - $\\ell_{\\text{new}}(l) < \\ell_{\\text{cur}}(l)$ → **left** child
   - Else → **right** child

### Query

At $x$: evaluate stored line, recurse to child containing $x$, return $\\min$ along path.

## When to Use

- Lines inserted **dynamically**, not known offline
- **Queries interleaved** with insertions
- $x$-range is **bounded** ($[L, R]$)
- For $\\max$: negate slopes and intercepts

**Classic CHT (deque)** still better when slopes monotonic + queries monotonic → $O(1)$ amortized.

## Complexity

- **Insert**: $O(\\log C)$ where $C = R - L$
- **Query**: $O(\\log C)$
- **Space**: $O(N \\log C)$ dynamic nodes`,
  }).returning();
  if (cht) {
    await db.insert(templateCodes).values([{
      templateId: cht.id,
      language: "cpp",
      code: stripMain(`#include <bits/stdc++.h>
using ll = long long;

/**
 * @brief Represents a line y = m*x + c.
 *
 * The call operator evaluates the line at a given x coordinate.
 * Default c = LLONG_MAX acts as infinity for minimization queries.
 */
struct Line {
    ll m, c;

    /**
     * @brief Constructs a line y = m*x + c.
     * @param _m Slope of the line.
     * @param _c Intercept of the line (default: LLONG_MAX for min queries).
     */
    Line(ll _m = 0, ll _c = LLONG_MAX) : m(_m), c(_c) {}

    /**
     * @brief Evaluates the line at x.
     * @param x The x coordinate to evaluate at.
     * @return The value m*x + c.
     */
    ll operator()(ll x) const { return m * x + c; }
};

/**
 * @brief Li Chao segment tree for dynamic line insertion and min query.
 *
 * Maintains the lower envelope of lines over a bounded x-range [L, R].
 * Each node stores the line that is best at the midpoint of its interval.
 * On insertion, the worse line at the midpoint is pushed to the child
 * where it might win.
 */
struct LiChao {
    struct Node {
        Line line;
        Node *left, *right;

        /**
         * @brief Constructs a node with the given line.
         * @param _line The line stored at this node.
         */
        Node(Line _line = Line()) : line(_line), left(nullptr), right(nullptr) {}
    };

    Node* root;
    ll L, R;

    /**
     * @brief Constructs a Li Chao tree over the range [L, R].
     * @param _L Left boundary of the x-coordinate range.
     * @param _R Right boundary of the x-coordinate range.
     */
    LiChao(ll _L, ll _R) : L(_L), R(_R) {
        root = new Node();
    }

    /**
     * @brief Inserts a new line into the tree.
     *
     * Traverses from root to leaf, comparing the new line with the stored
     * line at each midpoint. The worse line is pushed to the appropriate
     * child. Time complexity: O(log(R - L)).
     *
     * @param newLine The line to insert.
     */
    void addLine(Line newLine) {
        addLine(root, L, R, newLine);
    }

    /**
     * @brief Queries the minimum value at x among all inserted lines.
     *
     * Traverses from root to leaf containing x, taking the minimum of
     * all stored lines along the path. Time complexity: O(log(R - L)).
     *
     * @param x The x coordinate to query at.
     * @return The minimum value m*x + c over all inserted lines.
     */
    ll query(ll x) {
        return query(root, L, R, x);
    }

private:
    /**
     * @brief Recursive helper for line insertion.
     * @param node Current tree node.
     * @param l    Left boundary of current interval.
     * @param r    Right boundary of current interval.
     * @param newLine Line being inserted.
     */
    void addLine(Node* node, ll l, ll r, Line newLine) {
        ll mid = (l + r) >> 1;

        bool leftBetter  = newLine(l)  < node->line(l);
        bool midBetter   = newLine(mid) < node->line(mid);

        if (midBetter) {
            std::swap(node->line, newLine);
        }

        if (l == r) return;

        if (leftBetter != midBetter) {
            // newLine wins on the left half
            if (!node->left) node->left = new Node();
            addLine(node->left, l, mid, newLine);
        } else {
            // newLine wins on the right half
            if (!node->right) node->right = new Node();
            addLine(node->right, mid + 1, r, newLine);
        }
    }

    /**
     * @brief Recursive helper for querying minimum at x.
     * @param node Current tree node (may be nullptr).
     * @param l    Left boundary of current interval.
     * @param r    Right boundary of current interval.
     * @param x    The x coordinate being queried.
     * @return The minimum value at x among lines on this path.
     */
    ll query(Node* node, ll l, ll r, ll x) {
        if (!node) return LLONG_MAX;

        ll ans = node->line(x);
        if (l == r) return ans;

        ll mid = (l + r) >> 1;
        if (x <= mid) {
            return std::min(ans, query(node->left, l, mid, x));
        } else {
            return std::min(ans, query(node->right, mid + 1, r, x));
        }
    }
};`
      )
    }]);
  }
}
