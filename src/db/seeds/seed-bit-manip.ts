import { templates, templateCodes } from "../schema";
import { stripMain, type Db, type CatMap } from "./helpers";

export async function seedBitManip(db: Db, catMap: CatMap) {
  const categoryId = catMap["bit-manipulation"];
  if (!categoryId) return;

  const [bitUtils] = await db
    .insert(templates)
    .values({
      title: "Bit Utilities",
      slug: "bit-utilities",
      description: "Comprehensive bit manipulation utility functions",
      categoryId,
      tags: ["bit-manipulation", "bitwise", "utilities"],
      complexity: "$O(1)$ per operation",
      notes: [
        "# Bit Manipulation Utilities",
        "",
        "Bit manipulation operates directly on the binary (base-2) representation of integers. Each bit position corresponds to a power of two, so bitwise operations map cleanly onto arithmetic properties. Mastering these primitives is essential in competitive programming because they run in $O(1)$ time and unlock compact solutions to subset, counting, and masking problems.",
        "",
        "## When to Use",
        "",
        "- **Subset enumeration / bitmask DP** — iterate over all $2^n$ subsets of a set of size $n$",
        "- **Counting parity** — check whether the number of set bits is odd or even",
        "- **Isolating properties** — extract the lowest set bit, find MSB/LSB positions",
        "- **Power-of-two checks** — fast modular arithmetic, size alignment",
        "- **State compression** — represent a set of $n$ elements as an $n$-bit integer",
        "- **Game theory / Sprague-Grundy** — XOR is the Grundy merge operator",
        "",
        "## Formulas",
        "",
        "| Operation | Formula |",
        "|-----------|---------|",
        "| Check bit $i$ | $(n \\gg i) \\mathbin{\\&} 1$ |",
        "| Set bit $i$ | $n \\mathbin{\\mid} (1 \\ll i)$ |",
        "| Clear bit $i$ | $n \\mathbin{\\&} \sim(1 \\ll i)$ |",
        "| Toggle bit $i$ | $n \\mathbin{\\oplus} (1 \\ll i)$ |",
        "| Lowest set bit | $n \\mathbin{\\&} (-n)$ |",
        "| Clear lowest set bit | $n \\mathbin{\\&} (n - 1)$ |",
        "| Is power of two | $n > 0 \\land n \\mathbin{\\&} (n - 1) = 0$ |",
        "| Is $a$ subset of $b$ | $a \\mathbin{\\&} b = a$ |",
        "",
        "## Edge Cases",
        "",
        "- **$n = 0$** — no bits are set; MSB/LSB position functions return $-1$; countBits returns $0$",
        "- **$i \notin [0, 63]$** — shift by $\ge 64$ is undefined behavior on 64-bit integers; always validate $i$",
        "- **Negative numbers** — signed right-shift is implementation-defined; these functions assume non-negative inputs",
        "- **Power of two** — $0$ is **not** a power of two; the function correctly returns false",
        "- **generateSubsets with empty set** — returns one subset (the empty set)",
        "",
        "## Complexity",
        "",
        "| Function | Time | Space |",
        "|----------|------|-------|",
        "| All bit primitives | $O(1)$ | $O(1)$ |",
        "| generateSubsets | $O(n \cdot 2^n)$ | $O(n \cdot 2^n)$ |",
        "| countBits | $O(1)$ | $O(1)$ |",
        "",
        "## Usage Examples",
        "",
        "```cpp",
        "// Check if n is a power of two",
        "long long n = 16;",
        "if (isPowerOfTwo(n)) { /* ... */ }",
        "",
        "// Toggle bit 3 (the 4's place)",
        "long long result = toggleBit(0b1010, 3); // 0b1110 = 14",
        "",
        "// Enumerate all subsets of {1, 2, 3}",
        "vector<vector<int>> subsets = generateSubsets({1, 2, 3});",
        "// Result: {}, {1}, {2}, {1,2}, {3}, {1,3}, {2,3}, {1,2,3}",
        "```",
      ].join("\n"),
    })
    .returning();

  if (bitUtils) {
    await db.insert(templateCodes).values([
      {
        templateId: bitUtils.id,
        language: "cpp",
        code: stripMain(`#include <bits/stdc++.h>
using ll = long long;

/**
 * @brief Check if the i-th bit (0-indexed from LSB) is set.
 * @param n  The integer to inspect.
 * @param i  Bit position to check (0-based, must be in [0, 63]).
 * @return   1 if bit i is set, 0 otherwise.
 */
bool checkBit(ll n, int i) {
    return (n >> i) & 1;
}

/**
 * @brief Set the i-th bit to 1.
 * @param n  The integer to modify.
 * @param i  Bit position to set (0-based, must be in [0, 63]).
 * @return   Value with bit i set to 1.
 */
ll setBit(ll n, int i) {
    return n | (1LL << i);
}

/**
 * @brief Clear the i-th bit to 0.
 * @param n  The integer to modify.
 * @param i  Bit position to clear (0-based, must be in [0, 63]).
 * @return   Value with bit i cleared to 0.
 */
ll resetBit(ll n, int i) {
    return n & ~(1LL << i);
}

/**
 * @brief Toggle (flip) the i-th bit.
 * @param n  The integer to modify.
 * @param i  Bit position to toggle (0-based, must be in [0, 63]).
 * @return   Value with bit i inverted.
 */
ll toggleBit(ll n, int i) {
    return n ^ (1LL << i);
}

/**
 * @brief Check whether n is a power of two.
 * @param n  The integer to test (treated as non-negative).
 * @return   true if n > 0 and exactly one bit is set.
 */
bool isPowerOfTwo(ll n) {
    return n > 0 && (n & (n - 1)) == 0;
}

/**
 * @brief Count the number of set bits (population count).
 * @param n  The integer whose bits to count.
 * @return   Number of 1-bits in the binary representation.
 */
int countBits(ll n) {
    return __builtin_popcountll(n);
}

/**
 * @brief Isolate the lowest set bit.
 * @param n  The integer (must be nonzero for meaningful result).
 * @return   A value with only the lowest set bit of n remaining.
 */
ll lowestSetBit(ll n) {
    return n & (-n);
}

/**
 * @brief Clear the lowest set bit.
 * @param n  The integer (must be nonzero for meaningful result).
 * @return   Value with the lowest set bit of n cleared.
 */
ll clearLowestBit(ll n) {
    return n & (n - 1);
}

/**
 * @brief Check if a is a subset of b (in set-bit sense).
 * @param a  The candidate subset bitmask.
 * @param b  The superset bitmask.
 * @return   true if every set bit in a is also set in b.
 */
bool isSubset(ll a, ll b) {
    return (a & b) == a;
}

/**
 * @brief Get the position of the most significant set bit (0-indexed).
 * @param n  The integer to inspect.
 * @return   0-based position of the MSB, or -1 if n == 0.
 */
int msbPosition(ll n) {
    if (n == 0) return -1;
    return 63 - __builtin_clzll(n);
}

/**
 * @brief Get the position of the least significant set bit (0-indexed).
 * @param n  The integer to inspect.
 * @return   0-based position of the LSB, or -1 if n == 0.
 */
int lsbPosition(ll n) {
    if (n == 0) return -1;
    return __builtin_ctzll(n);
}

/**
 * @brief Compute the number of bits needed to represent n.
 * @param n  The integer (non-negative).
 * @return   Minimum number of bits required, at least 1.
 */
int bitLength(ll n) {
    if (n == 0) return 1;
    return msbPosition(n) + 1;
}

/**
 * @brief Generate all subsets of a set using bitmask enumeration.
 * @param s  The input set (no duplicates required).
 * @return   A vector of all 2^n subsets, each as a vector.
 */
std::vector<std::vector<int>> generateSubsets(
    const std::vector<int>& s
) {
    int n = (int)s.size();
    std::vector<std::vector<int>> ans;
    ans.reserve(1LL << n);
    for (int mask = 0; mask < (1 << n); mask++) {
        std::vector<int> subset;
        for (int i = 0; i < n; i++) {
            if (checkBit(mask, i)) {
                subset.push_back(s[i]);
            }
        }
        ans.push_back(subset);
    }
    return ans;
}
`),
      },
    ]);
  }
}
