import { sql } from "drizzle-orm";
import { templates, templateCodes } from "../schema";
import { stripMain, type Db, type CatMap } from "./helpers";

export async function seedBinarySearch(db: Db, catMap: CatMap) {
  const categoryId = catMap["binary-search"];
  if (!categoryId) return;

  // ─── Binary Search on Number ───────────────────────────────────────
  const [bsNum] = await db.insert(templates).values({
    title: "Binary Search on Number",
    slug: "binary-search-on-number",
    description: "Classic binary search to find a value in a sorted array",
    categoryId: categoryId,
    tags: ["binary-search", "search", "sorted-array"],
    complexity: "O(log n)",
    notes: `# Binary Search on Number

Binary search is a divide-and-conquer algorithm that locates a target value within a **sorted** array by repeatedly halving the search interval. At each step, the midpoint is compared to the target: if equal, the search ends; if the midpoint is less, the right half is discarded; otherwise the left half is discarded.

Given sorted array $A[0 \\ldots n-1]$ and target $k$, maintain an inclusive interval $[L, R]$ where $k$ may exist. Compute the midpoint $M = L + \\lfloor (R - L) / 2 \\rfloor$. If $A_M = k$, return $M$. If $A_M < k$, set $L = M + 1$; otherwise set $R = M - 1$. Repeat until $L > R$, at which point the target is absent.

> **Overflow-safe midpoint**: Always use $M = L + \\lfloor (R - L) / 2 \\rfloor$ instead of $\\lfloor (L + R) / 2 \\rfloor$. The latter can overflow when $L + R > 2^{31} - 1$ for signed 32-bit integers.

\`\`\`cpp
int arr[] = {1, 3, 5, 7, 9};
int idx = binarySearch(arr, 5, 7);  // returns 3
int miss = binarySearch(arr, 5, 4); // returns -1
\`\`\`

## When to Use

- Searching for an exact value in a sorted array or \`std::set\`/\`std::map\`.
- As the inner loop of other algorithms (e.g., finding a pair with a given sum in sorted arrays).
- Finding a specific element in \`std::lower_bound\` / \`std::upper_bound\` results.

## Edge Cases

| Case | Behavior |
|------|----------|
| Empty array ($n = 0$) | Loop never executes, returns $-1$ |
| Single element, match | Returns $0$ |
| Single element, no match | Returns $-1$ |
| All elements equal to target | Returns the first match found (midpoint path) |
| Target smaller than all elements | $R$ shrinks to $-1$, returns $-1$ |
| Target larger than all elements | $L$ exceeds $n-1$, returns $-1$ |
| Overflow risk | Use $L + (R - L) / 2$, not $(L + R) / 2$ |

## Complexity

- **Time**: $O(\\log n)$ — search space halves each iteration.
- **Space**: $O(1)$ — only a few integer variables.`,
  }).returning();
  if (bsNum) {
    await db.insert(templateCodes).values([{
      templateId: bsNum.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;

using ll = long long;

int binarySearch(const vector<int>& arr, int n, int target) {
    int l = 0, r = n - 1;
    while (l <= r) {
        int mid = l + (r - l) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target)
            l = mid + 1;
        else
            r = mid - 1;
    }
    return -1;
}

int main() {
    vector<int> arr = {1, 3, 5, 7, 9};
    cout << binarySearch(arr, 5, 7) << "\\n";
    cout << binarySearch(arr, 5, 4) << "\\n";
    return 0;
}`),
    }]);
  }

  const [lowerB] = await db.insert(templates).values({
    title: "Lower Bound",
    slug: "lower-bound",
    description: "Find first element ≥ target in a sorted array",
    categoryId: categoryId,
    tags: ["binary-search", "lower-bound", "sorted-array"],
    complexity: "O(log n)",
    notes: `# Lower Bound

Finds the first element \u2265 target using predicate-based binary search. Equivalent to std::lower_bound but with a custom comparator.

## When to Use

- Find first occurrence of a value in sorted array
- Find insertion point for a value
- Binary search on monotonic predicate (first true)

## Complexity

- Time: O(log n)
- Space: O(1)\`std::lower_bound\` behavior.

**How it works**: Finds the first element $\\geq$ target using predicate-based binary search. Equivalent to \`std::lower_bound\` but with custom comparator logic. Returns an iterator/index to the first \`true\` position in the implicit predicate \`element >= target\`.

Maintain an answer variable \`ans\` initialized to $-1$. At each step, compute midpoint $M = L + \\lfloor (R - L) / 2 \\rfloor$. If $A_M \\geq k$, record $M$ as a candidate and search left ($R = M - 1$) to find an earlier match. If $A_M < k$, search right ($L = M + 1$). When the loop ends, \`ans\` holds the first position $\\geq$ target, or $-1$ if no such element exists.

\`\`\`cpp
int arr[] = {1, 3, 3, 5, 7};
int idx = lowerBound(arr, 5, 3);
int idx2 = lowerBound(arr, 5, 4);
int idx3 = lowerBound(arr, 5, 10);
\`\`\`

## When to Use

- Finding the first occurrence of a value in a sorted array with duplicates.
- Smallest element $\\geq$ target ("ceiling" query).
- Searching in \`std::set\` or \`std::map\` via \`lower_bound()\`.
- Binary search on answer: when predicate goes \`false ... false true ... true\`, lower bound gives the first \`true\`.

## Difference from \`std::lower_bound\`

This template replicates STL \`std::lower_bound\` behavior exactly. It returns the index of the first element $\\geq$ target. If you need a pointer-based version for iterators, use the STL directly.

## Edge Cases

| Case | Behavior |
|------|----------|
| Empty array | Returns $-1$ |
| All elements $<$ target | Returns $-1$ |
| All elements $\\geq$ target | Returns $0$ (first position) |
| Target equals first element | Returns $0$ |
| Duplicates of target | Returns index of **first** occurrence |
| Single element, match | Returns $0$ |
| Single element, no match | Returns $0$ or $-1$ depending on comparison |

## Complexity

- **Time**: $O(\\log n)$ — halves search space each iteration.
- **Space**: $O(1)$ — constant auxiliary memory.`,
  }).returning();
  if (lowerB) {
    await db.insert(templateCodes).values([{
      templateId: lowerB.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;

using ll = long long;

int lowerBound(const vector<int>& nums, int n, int target) {
    int l = 0, r = n - 1, ans = -1;
    while (l <= r) {
        int m = l + (r - l) / 2;
        if (nums[m] >= target) {
            ans = m;
            r = m - 1;
        } else {
            l = m + 1;
        }
    }
    return ans;
}

int main() {
    vector<int> nums = {1, 3, 3, 5, 7};
    cout << lowerBound(nums, 5, 3) << "\\n";
    cout << lowerBound(nums, 5, 4) << "\\n";
    cout << lowerBound(nums, 5, 10) << "\\n";
    return 0;
}`),
    }]);
  }

  const [upperB] = await db.insert(templates).values({
    title: "Upper Bound (Custom)",
    slug: "upper-bound",
    description: "Find last element < target in a sorted array",
    categoryId: categoryId,
    tags: ["binary-search", "upper-bound", "sorted-array", "custom"],
    complexity: "O(log n)",
    notes: `# Upper Bound (Custom)

Returns the last element strictly less than the target. NOT the same as std::upper_bound (which returns first element > target).

## When to Use

- Find predecessor of a value in sorted array
- Find last element satisfying a predicate
- Complement of lower bound for range queries

## Complexity

- Time: O(log n)
- Space: O(1)\`std::upper_bound\`, which returns the **first element strictly greater than** ($>$) the target. See the comparison below.

**How it works**: Custom upper bound that returns the last element $<$ target. **NOT** the same as \`std::upper_bound\` (which returns first element $>$ target). Useful when you need the predecessor — the element immediately before where \`lower_bound\` would point.

The algorithm maintains an answer variable \`ans\` initialized to $-1$. At each step, compute midpoint $M = L + \\lfloor (R - L) / 2 \\rfloor$. If $A_M < k$, record $M$ as a candidate and search right ($L = M + 1$) to find a later match. If $A_M \\geq k$, search left ($R = M - 1$). When the loop ends, \`ans\` holds the last position $<$ target, or $-1$ if no such element exists.

**Relationship to STL**: This function returns the same index as \`std::upper_bound(arr, arr+n, target) - arr - 1\` when interpreted as the element just before the first element $>=$ target. Equivalently, it gives \`std::lower_bound(arr, arr+n, target) - arr - 1\`.

\`\`\`cpp
int arr[] = {1, 3, 5, 7, 9};
int idx = upperBound(arr, 5, 5);
int idx2 = upperBound(arr, 5, 0);
int idx3 = upperBound(arr, 5, 10);
\`\`\`

## When to Use

- Finding the **last element strictly less than** a target.
- Finding the position just before \`std::lower_bound\` (i.e., number of elements $<$ target).
- Counting elements less than a value: return value $+ 1$ gives the count.
- Useful in problems asking "how many elements are strictly less than $x$?"

## Comparison to \`std::upper_bound\`

| Function | Returns |
|----------|---------|
| \`std::lower_bound\` | First element $\\geq$ target |
| \`std::upper_bound\` | First element $>$ target |
| **This template** | **Last element $<$ target** |

To get STL \`std::upper_bound\` behavior (first element $>$ target), use: \`lowerBound(nums, n, target + 1)\` for integers, or write a separate template.

## Edge Cases

| Case | Behavior |
|------|----------|
| Empty array | Returns $-1$ |
| All elements $\\geq$ target | Returns $-1$ |
| All elements $<$ target | Returns $n - 1$ (last index) |
| Target equals first element | Returns $-1$ (nothing is $<$ target) |
| Duplicates of target | Returns index just before the first occurrence |
| Single element $<$ target | Returns $0$ |
| Single element $\\geq$ target | Returns $-1$ |

## Complexity

- **Time**: $O(\\log n)$ — halves search space each iteration.
- **Space**: $O(1)$ — constant auxiliary memory.`,
  }).returning();
  if (upperB) {
    await db.insert(templateCodes).values([{
      templateId: upperB.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;

using ll = long long;

int upperBound(const vector<int>& nums, int n, int target) {
    int l = 0, r = n - 1, ans = -1;
    while (l <= r) {
        int m = l + (r - l) / 2;
        if (nums[m] < target) {
            ans = m;
            l = m + 1;
        } else {
            r = m - 1;
        }
    }
    return ans;
}

int main() {
    vector<int> nums = {1, 3, 5, 7, 9};
    cout << upperBound(nums, 5, 5) << "\\n";
    cout << upperBound(nums, 5, 0) << "\\n";
    cout << upperBound(nums, 5, 10) << "\\n";
    return 0;
}`),
    }]);
  }

  const [bsAnswer] = await db.insert(templates).values({
    title: "Binary Search on Answer",
    slug: "binary-search-on-answer",
    description: "Binary search over a monotonic predicate to find the optimal answer",
    categoryId: categoryId,
    tags: ["binary-search", "binary-search-on-answer", "monotonic", "predicate"],
    complexity: "O(log(range) · cost_of_check)",
    notes: `# Binary Search on Answer

Binary search on answer is a technique for **optimization problems** where you can formulate a **monotonic predicate** $P(x)$: if $P(x)$ is true, then $P(y)$ is true for all $y \\geq x$ (or $y \\leq x$, depending on direction). This lets you binary search over the answer space instead of iterating over all candidates.

## Core Idea

Given a search range $[\\text{lo}, \\text{hi}]$ and a predicate $P(x)$ that is monotonic:

- **Minimize**: $P(x) = $ \`check(x)\` is true. The predicate goes \`false ... false true ... true\`. Binary search for the first \`true\`.
- **Maximize**: $P(x) = $ \`check(x)\` is true. The predicate goes \`true ... true false ... false\`. Binary search for the last \`true\`.

The loop invariant maintains: \`lo\` is always the answer side, \`hi\` is the other side.

\`\`\`cpp

int binarySearchAnswer(int lo, int hi) {
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (check(mid))
            hi = mid;
        else
            lo = mid + 1;
    }
    return lo;
}
\`\`\`

## When to Use

- **Minimize maximum**: "Split array into $k$ parts, minimize the largest sum."
- **Maximize minimum**: "Place $k$ items, maximize the minimum distance."
- **Feasibility search**: "Can we complete the task in $x$ time/operations?"
- **K-th element in matrix/merged arrays**: Binary search on value, count $\\leq$ mid.
- **Capacity problems**: "What is the minimum capacity to ship all packages in $d$ days?"
- **Painting/splitting problems**: Classic CP patterns from Codeforces, AtCoder.

## Template Pattern

\`\`\`cpp
// Minimize answer: find smallest x where check(x) == true
int lo = MIN_VAL, hi = MAX_VAL;
while (lo < hi) {
    int mid = lo + (hi - lo) / 2;
    if (check(mid))
        hi = mid;
    else
        lo = mid + 1;
}
// lo == hi == answer (or MAX_VAL+1 if no valid answer)
\`\`\`

For **maximize answer**, flip the predicate or reverse the direction:

\`\`\`cpp
while (lo < hi) {
    int mid = lo + (hi - lo + 1) / 2;  // note: +1 to avoid infinite loop
    if (check(mid))
        lo = mid;
    else
        hi = mid - 1;
}
\`\`\`

## Edge Cases

| Case | Handling |
|------|----------|
| No valid answer exists | \`lo\` ends at \`MAX_VAL + 1\`; check after loop |
| Predicate always true | Returns \`MIN_VAL\` |
| Predicate always false | Returns \`MAX_VAL + 1\` |
| Single element range | Loop skipped, return \`lo\` |
| Integer overflow in mid | Use \`lo + (hi - lo) / 2\` |
| Maximize pattern: off-by-one | Use \`mid = lo + (hi - lo + 1) / 2\` to avoid infinite loop |

## Complexity

- **Time**: $O(\\log(\\text{range}) \\cdot C)$ where $C$ is the cost of the predicate \`check()\`.
- **Space**: $O(1)$ additional space (excluding predicate internals).`,
  }).returning();
  if (bsAnswer) {
    await db.insert(templateCodes).values([{
      templateId: bsAnswer.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;

using ll = long long;

int binarySearchOnAnswer(int lo, int hi, bool (*check)(int)) {
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (check(mid))
            hi = mid;
        else
            lo = mid + 1;
    }

    return check(lo) ? lo : hi + 1;
}

bool check(ll x) {
    ll target = 17;
    return x * x >= target;
}

int main() {

    int ans = binarySearchOnAnswer(0, 100, check);
    cout << ans << "\\n";
    return 0;
}`),
    }]);
  }

  const [ternary] = await db.insert(templates).values({
    title: "Ternary Search",
    slug: "ternary-search",
    description: "Find extremum of a unimodal function on a continuous range",
    categoryId: categoryId,
    tags: ["ternary-search", "unimodal", "convex-function", "optimization"],
    complexity: "O(log n) evaluations",
    notes: `# Ternary Search

Ternary search finds the **maximum** (or minimum) of a **unimodal function** on a continuous interval $[l, r]$. A unimodal function increases then decreases (for maximum), or decreases then increases (for minimum). At each step, the interval is divided into three equal parts using two interior points $m_1$ and $m_2$, and one-third is eliminated.

## Algorithm (Finding Maximum)

Given a unimodal function $f$ on $[l, r]$:

1. Compute $m_1 = l + \\frac{r - l}{3}$ and $m_2 = r - \\frac{r - l}{3}$.
2. If $f(m_1) < f(m_2)$, the maximum lies in $[m_1, r]$, so set $l = m_1$.
3. Otherwise, the maximum lies in $[l, m_2]$, so set $r = m_2$.
4. Repeat for a fixed number of iterations (e.g., 200).

After $k$ iterations, the remaining interval has length $\\frac{2}{3}^k (r - l)$. With 200 iterations, precision is approximately $10^{-35}$, far beyond double-precision limits.

## Finding Minimum

To find the **minimum** of a unimodal function, simply negate the comparison:

\`\`\`cpp
if (f(m1) > f(m2)) l = m1;
else r = m2;
\`\`\`

Or equivalently, search for the maximum of $-f(x)$.

\`\`\`cpp
// Maximum
ld max_x = ternarySearchMax([](ld x) { return -x*x + 5*x + 3; }, 0.0, 10.0);

// Minimum (negate comparison)
ld min_x = ternarySearchMin([](ld x) { return x*x - 5*x + 3; }, 0.0, 10.0);
\`\`\`

## When to Use

- **Continuous optimization**: Find $x$ that maximizes/minimizes $f(x)$ where $f$ is unimodal.
- **Geometric problems**: Minimum enclosing circle radius, closest pair on a line.
- **CP patterns**: "Find the optimal real-valued parameter" — e.g., optimal speed, angle, or ratio.
- **Cannot use derivative**: When $f$ is not differentiable or is given as a black box.

## Edge Cases

| Case | Behavior |
|------|----------|
| Flat function ($f$ constant) | Returns midpoint of interval (any point is valid) |
| $l = r$ (zero-length interval) | Returns $l$ immediately (no iterations needed) |
| Non-unimodal function | Algorithm may return a local extremum, not global — **caller must guarantee unimodality** |
| Integer domain | Use integer ternary search variant (compare mid points) |
| Very narrow interval | Converges regardless; 200 iterations always sufficient for doubles |

## Complexity

- **Time**: $O(k \\cdot C_f)$ where $k$ is the number of iterations and $C_f$ is the cost of evaluating $f$.
- **Space**: $O(1)$ — only stores interval bounds.
- Typical: 100–200 iterations for double precision; 60–80 for integer results.`,
  }).returning();
  if (ternary) {
    await db.insert(templateCodes).values([{
      templateId: ternary.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;

using ll = long long;
using ld = long double;

/**
 * @brief Finds the maximum of a unimodal function f in [l, r].
 *
 * Divides the interval into thirds at each step and eliminates
 * one-third based on function comparison. Converges to the
 * maximum of a unimodal (single-peaked) function.
 *
 * @param f  Unimodal function to maximize.
 * @param l  Left bound of the search interval.
 * @param r  Right bound of the search interval.
 * @param iterations  Number of iterations (default 200).
 * @return x that maximizes f in [l, r].
 */
ld ternarySearchMax(function<ld(ld)> f, ld l, ld r, int iterations = 200) {
    for (int i = 0; i < iterations; i++) {
        ld m1 = l + (r - l) / 3.0;
        ld m2 = r - (r - l) / 3.0;
        if (f(m1) < f(m2))
            l = m1;
        else
            r = m2;
    }
    return (l + r) / 2.0;
}

/**
 * @brief Finds the minimum of a unimodal function f in [l, r].
 *
 * Same as ternarySearchMax but with flipped comparison.
 * Alternatively, pass -f(x) to ternarySearchMax.
 *
 * @param f  Unimodal function to minimize.
 * @param l  Left bound of the search interval.
 * @param r  Right bound of the search interval.
 * @param iterations  Number of iterations (default 200).
 * @return x that minimizes f in [l, r].
 */
ld ternarySearchMin(function<ld(ld)> f, ld l, ld r, int iterations = 200) {
    for (int i = 0; i < iterations; i++) {
        ld m1 = l + (r - l) / 3.0;
        ld m2 = r - (r - l) / 3.0;
        if (f(m1) > f(m2))
            l = m1;
        else
            r = m2;
    }
    return (l + r) / 2.0;
}

// --- Example usage (remove in production) ---
int main() {
    // Find maximum of f(x) = -x^2 + 5x + 3 in [0, 10]
    auto f = [](ld x) -> ld { return -x*x + 5*x + 3; };
    ld maxX = ternarySearchMax(f, 0.0, 10.0);
    cout << "Max at x = " << maxX << ", f(x) = " << f(maxX) << "\\n";

    // Find minimum of g(x) = x^2 - 4x + 7 in [0, 10]
    auto g = [](ld x) -> ld { return x*x - 4*x + 7; };
    ld minX = ternarySearchMin(g, 0.0, 10.0);
    cout << "Min at x = " << minX << ", g(x) = " << g(minX) << "\\n";

    return 0;
}`),
    }]);
  }
}
