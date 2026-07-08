import { sql } from "drizzle-orm";
import { templates, templateCodes } from "../schema";
import { stripMain, type Db, type CatMap } from "./helpers";

export async function seedBinarySearch(db: Db, catMap: CatMap) {
  const categoryId = catMap["binary-search"];
  if (!categoryId) return;

  const [bsNum] = await db.insert(templates).values({
    title: "Binary Search on Number",
    slug: "binary-search-on-number",
    description: "Classic binary search to find a value in a sorted array",
    categoryId: categoryId,
    tags: ["binary-search", "search", "sorted-array"],
    complexity: "O(log n)",
    notes: `# Binary Search

Binary search splits the search interval in half each step. Most common application is searching in sorted arrays.

Given sorted array $A[0..n-1]$ and target $k$, maintain interval $[L, R]$ such that $A_L \\leq k \\leq A_R$. Pick midpoint $M = \\lfloor (L+R)/2 \\rfloor$ and compare $A_M$ with $k$. Halve the interval until $R = L+1$, then compare directly.

Time: $O(\\log n)$. Uses $O(1)$ space.`,
  }).returning();
  if (bsNum) {
    await db.insert(templateCodes).values([{
      templateId: bsNum.id, language: "cpp", code: `#include <bits/stdc++.h>
using namespace std;

/**
 * @brief Binary search for target in sorted array
 * @param arr Sorted array of integers
 * @param n Size of the array
 * @param target Value to search for
 * @return Index of target if found, -1 otherwise
 */
int binary_search(const vector<int>& arr, int n, int target) {
    int l = 0, r = n - 1;
    while (l <= r) {
        int mid = l + (r - l) / 2;  // avoids overflow
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) l = mid + 1;
        else r = mid - 1;
    }
    return -1;
}`
    }]);
  }

  const [lowerB] = await db.insert(templates).values({
    title: "Lower Bound",
    slug: "lower-bound",
    description: "Find first element ≥ target in sorted array",
    categoryId: categoryId,
    tags: ["binary-search", "lower-bound", "sorted-array"],
    complexity: "O(log n)",
    notes: `# Lower Bound

Find the index of the first element ≥ target in a sorted array.

## Usage

\`\`\`cpp
int arr[] = {1, 3, 5, 7, 9};
int idx = lower_bound(arr, 5, 5);  // returns 2
// arr[2] = 5 ≥ 5
\`\`\`

## Comparison to std::lower_bound

Same behavior as C++ STL \`std::lower_bound\`: returns pointer/index to first element not less than target. Implementation uses manual binary search instead of STL for portability.

## Complexity

- O(log n) time, O(1) space`,
  }).returning();
  if (lowerB) {
    await db.insert(templateCodes).values([{
      templateId: lowerB.id, language: "cpp", code: `#include <bits/stdc++.h>
using namespace std;

/**
 * @brief Finds the index of the first element >= target.
 * @param nums Sorted array of integers.
 * @param n Size of the array.
 * @param target The value to search for.
 * @return Index of first element >= target, or -1 if all are smaller.
 */
int lower_bound(int nums[], int n, int target) {
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
}`
    }]);
  }

  const [upperB] = await db.insert(templates).values({
    title: "Upper Bound",
    slug: "upper-bound",
    description: "Find last element < target in sorted array",
    categoryId: categoryId,
    tags: ["binary-search", "upper-bound", "sorted-array"],
    complexity: "O(log n)",
    notes: `# Upper Bound

Find the index of the last element < target in a sorted array (strictly less than).

## Usage

\`\`\`cpp
int arr[] = {1, 3, 5, 7, 9};
int idx = upper_bound(arr, 5, 5);  // returns 1
// arr[1] = 3 < 5
\`\`\`

## Comparison to std::upper_bound

Unlike C++ STL \`std::upper_bound\` (which returns first element > target), this returns the last element < target. Equivalent to: \`std::upper_bound - 1\`.

## Complexity

- O(log n) time, O(1) space`,
  }).returning();
  if (upperB) {
    await db.insert(templateCodes).values([{
      templateId: upperB.id, language: "cpp", code: `#include <bits/stdc++.h>
using namespace std;

/**
 * @brief Finds the index of the last element strictly less than target.
 * @param nums Sorted array of integers.
 * @param n Size of the array.
 * @param target The value to search for.
 * @return Index of last element < target, or -1 if none.
 */
int upper_bound(int nums[], int n, int target) {
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
}`
    }]);
  }

  // --- Ternary Search ---
  const [ternary] = await db.insert(templates).values({
    title: "Ternary Search",
    slug: "ternary-search",
    description: "Find maximum of a unimodal function on a range",
    categoryId: categoryId,
    tags: ["ternary-search", "unimodal", "convex-function"],
    complexity: "O(log n)",
    notes: `# Ternary Search

Find the maximum (or minimum) of a unimodal function on a continuous range. A unimodal function increases then decreases (or vice versa).

## Usage

\`\`\`cpp
// Find x where f(x) is maximized in [0, 10]
ld max_x = ternary_search([](ld x) { return -x*x + 5*x + 3; }, 0.0, 10.0);
\`\`\`

## Algorithm

Divide the range into three equal parts (m1 and m2). If f(m1) < f(m2), the maximum is in [m1, r]. Otherwise it's in [l, m2]. Repeat until range is small enough.

## Parameters

- **f**: unimodal function to maximize
- **l, r**: search interval bounds
- **iterations**: number of iterations (each halves the search range). 100 iterations gives precision of (r-l) / 3^100.

## Complexity

- O(iterations · cost_of_f)
- 100 iterations sufficient for double precision`,
  }).returning();
  if (ternary) {
    await db.insert(templateCodes).values([{
      templateId: ternary.id, language: "cpp", code: `#include <bits/stdc++.h>
using namespace std;

typedef long double ld;

/**
 * @brief Finds maximum of a unimodal function f in [l, r].
 * @param f Unimodal function to evaluate.
 * @param l Left bound.
 * @param r Right bound.
 * @param iterations Number of iterations (e.g., 100).
 * @return x that maximizes f in [l, r].
 */
ld ternary_search(function<ld(ld)> f, ld l, ld r, int iterations = 100) {
    for (int i = 0; i < iterations; i++) {
        ld m1 = l + (r - l) / 3;
        ld m2 = r - (r - l) / 3;
        if (f(m1) < f(m2)) l = m1;
        else r = m2;
    }
    return (l + r) / 2;
}`
    }]);
  }
}
