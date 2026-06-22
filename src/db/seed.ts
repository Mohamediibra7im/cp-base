import "dotenv/config";
import { sql } from "drizzle-orm";
import { getDb } from "./index";
import { categories, templates, templateCodes } from "./schema";

const seedCategories = [
  { name: "Algebra", slug: "algebra", description: "Number theory and algebraic algorithms", icon: "Sigma", color: "#a855f7", order: 1 },
  { name: "Binary Search", slug: "binary-search", description: "Binary search and ternary search algorithms", icon: "Search", color: "#f59e0b", order: 2 },
  { name: "Bit Manipulation", slug: "bit-manipulation", description: "Bit manipulation utilities", icon: "Binary", color: "#06b6d4", order: 3 },
  { name: "Combinatorics", slug: "combinatorics", description: "Combinatorial algorithms and counting", icon: "Split", color: "#ec4899", order: 4 },
  { name: "Data Structures", slug: "data-structures", description: "Essential data structures for CP", icon: "Layers", color: "#3b82f6", order: 5 },
  { name: "Geometry", slug: "geometry", description: "Computational geometry", icon: "Triangle", color: "#22c55e", order: 6 },
  { name: "Number Theory", slug: "number-theory", description: "Number theory utilities and functions", icon: "Hash", color: "#8b5cf6", order: 7 },
  { name: "Range Queries", slug: "range-queries", description: "Static range query algorithms", icon: "BetweenHorizontalEnd", color: "#10b981", order: 8 },
  { name: "Utilities", slug: "utilities", description: "General CP utilities and helpers", icon: "Wrench", color: "#6b7280", order: 9 },
  { name: "Graph", slug: "graph", description: "Graph algorithms: shortest paths, SCC, LCA", icon: "GitBranch", color: "#ef4444", order: 10 },
  { name: "Dynamic Programming", slug: "dp", description: "Dynamic programming patterns and optimizations", icon: "Layers", color: "#f97316", order: 11 },
  { name: "Strings", slug: "strings", description: "String processing algorithms (KMP, hashing, palindromes)", icon: "Type", color: "#14b8a6", order: 12 },
];

// Helper: remove main() test code, keep only the template implementation
function stripMain(src: string): string {
  const mainIdx = src.indexOf("int main()");
  if (mainIdx === -1) return src;
  // Keep everything before main() — includes type aliases, functions, classes
  return src.substring(0, mainIdx).trimEnd();
}

async function seed() {
  const db = getDb()!;
  if (!db) {
    console.error("DATABASE_URL not set");
    process.exit(1);
  }

  // Clear existing data (TRUNCATE RESTART IDENTITY to reset sequences)
  console.log("Clearing existing data...");
  await db.execute(sql`TRUNCATE template_codes, templates, categories RESTART IDENTITY CASCADE`);

  console.log("Seeding categories...");
  for (const cat of seedCategories) {
    await db.insert(categories).values(cat);
  }

  const catRows = await db.select().from(categories);
  const catMap = Object.fromEntries(catRows.map((c) => [c.slug, c.id]));

  const algebraId = catMap["algebra"];
  const binarySearchId = catMap["binary-search"];
  const bitManipId = catMap["bit-manipulation"];
  const combinatoricsId = catMap["combinatorics"];
  const dataStructId = catMap["data-structures"];
  const geometryId = catMap["geometry"];
  const numberTheoryId = catMap["number-theory"];
  const rangeQueriesId = catMap["range-queries"];
  const utilsId = catMap["utilities"];
  const graphId = catMap["graph"];
  const dpId = catMap["dp"];
  const stringsId = catMap["strings"];

  console.log("Seeding templates...");

  // =================== ALGEBRA ===================
  async function seedAlgebra() {
    if (!algebraId) return;

    const [binExp] = await db.insert(templates).values({
      title: "Binary Exponentiation",
      slug: "binary-exponentiation",
      description: "Fast exponentiation using binary representation (O(log n))",
      categoryId: algebraId,
      tags: ["exponentiation", "modular-arithmetic", "log-n"],
      complexity: "O(log n)",
      notes: `# Binary Exponentiation

Binary exponentiation (also known as exponentiation by squaring) allows calculating $a^n$ using only $O(\\log n)$ multiplications instead of $O(n)$.

## Algorithm

Write $n$ in base 2, e.g. $3^{13} = 3^{1101_2} = 3^8 \\cdot 3^4 \\cdot 3^1$.

Since $n$ has $\\lfloor \\log_2 n \\rfloor + 1$ bits, we only need $O(\\log n)$ multiplications if we know powers $a^1, a^2, a^4, a^8, \\dots, a^{2^{\\lfloor \\log n \\rfloor}}$.

## Applications

- Large exponents modulo $m$ (modular exponentiation)
- Computing Fibonacci numbers in $O(\\log n)$ via matrix exponentiation
- Applying a permutation $k$ times
- Fast geometric transformations (scaling, rotation, shift)
- Number of paths of length $k$ in a graph (adjacency matrix exponentiation)
- Multiplying two numbers modulo $m$ without overflow`,
    }).returning();
    if (binExp) {
      await db.insert(templateCodes).values([{
        templateId: binExp.id, language: "cpp", code: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

ll binpow(ll a, ll b) {
    ll res = 1;
    while (b > 0) {
        if (b & 1) res = res * a;
        a = a * a;
        b >>= 1;
    }
    return res;
}

ll binpow(ll a, ll b, ll m) {
    a %= m;
    ll res = 1;
    while (b > 0) {
        if (b & 1) res = res * a % m;
        a = a * a % m;
        b >>= 1;
    }
    return res;
}`
      }]);
    }

    const [modInv] = await db.insert(templates).values({
      title: "Modular Inverse",
      slug: "modular-inverse",
      description: "Modular multiplicative inverse using Fermat, extended Euclidean, and linear precomputation",
      categoryId: algebraId,
      tags: ["modular-arithmetic", "inverse", "extended-gcd"],
      complexity: "O(log m) per query / O(n) precompute",
      notes: `# Modular Multiplicative Inverse

A modular multiplicative inverse of $a$ modulo $m$ is $x$ such that $a \\cdot x \\equiv 1 \\pmod m$. Exists iff $\\gcd(a, m) = 1$.

## Methods

1. **Extended Euclidean Algorithm** — Find $x, y$ such that $a \\cdot x + m \\cdot y = 1$. Then $x$ is the inverse.
2. **Fermat's Little Theorem** — When $m$ is prime: $a^{m-2} \\equiv a^{-1} \\pmod m$. Use binary exponentiation.
3. **Euclidean Division (Recursive)** — For prime modulus $m > a$: $\\text{inv}(a) = m - (m/a) \\cdot \\text{inv}(m \\% a) \\% m$.
4. **Linear Precomputation** — Compute all inverses from $1$ to $n$ in $O(n)$: $\\text{inv}[i] = m - (m/i) \\cdot \\text{inv}[m \\% i] \\% m$.

## Array Inverse Trick

For an array of numbers (all invertible), compute prefix product, total inverse, then suffix product to get each inverse in O(n + log m).`,
    }).returning();
    if (modInv) {
      await db.insert(templateCodes).values([{
        templateId: modInv.id, language: "cpp", code: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

ll ext_gcd(ll a, ll b, ll &x, ll &y) {
    if (b == 0) { x = 1; y = 0; return a; }
    ll x1, y1;
    ll g = ext_gcd(b, a % b, x1, y1);
    x = y1;
    y = x1 - (a / b) * y1;
    return g;
}

// Modular inverse using Fermat's Little Theorem (mod must be prime)
ll inv_fermat(ll a, ll mod) {
    ll res = 1;
    ll exp = mod - 2;
    while (exp > 0) {
        if (exp & 1) res = res * a % mod;
        a = a * a % mod;
        exp >>= 1;
    }
    return res;
}

// Modular inverse using extended Euclidean
ll inv_ext(ll a, ll m) {
    ll x, y;
    ll g = ext_gcd(a, m, x, y);
    if (g != 1) return -1;
    return (x % m + m) % m;
}

// Precompute all inverses from 1 to n
vector<ll> inv_precompute(ll n, ll mod) {
    vector<ll> inv(n + 1);
    inv[1] = 1;
    for (ll i = 2; i <= n; i++)
        inv[i] = mod - (mod / i) * inv[mod % i] % mod;
    return inv;
}`
      }]);
    }

    const [primRoot] = await db.insert(templates).values({
      title: "Primitive Root",
      slug: "primitive-root",
      description: "Find a primitive root (generator) modulo prime p",
      categoryId: algebraId,
      tags: ["primitive-root", "generator", "modular-arithmetic", "number-theory"],
      complexity: "O(Ans · log φ(n) · log n)",
      notes: `# Primitive Root

A number $g$ is a primitive root modulo $n$ if every number coprime to $n$ is congruent to a power of $g$ modulo $n$.

## Existence

Primitive root modulo $n$ exists iff: $n = 1, 2, 4$, $n = p^k$, or $n = 2 \\cdot p^k$ (odd prime $p$).

## Algorithm

1. Compute $\\phi(n)$ and factorize it: $\\phi(n) = p_1^{a_1} \\cdots p_s^{a_s}$.
2. For each candidate $g \\in [2, n]$:
   - Check $g^{\\phi(n)/p_i} \\not\\equiv 1 \\pmod n$ for all prime factors $p_i$.
   - If all pass, $g$ is a primitive root.

## Property

The number of primitive roots modulo $n$ (if any) is $\\phi(\\phi(n))$.`,
    }).returning();
    if (primRoot) {
      await db.insert(templateCodes).values([{
        templateId: primRoot.id, language: "cpp", code: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

ll powmod(ll a, ll b, ll p) {
    ll res = 1;
    while (b) {
        if (b & 1) res = (ll)res * a % p;
        a = (ll)a * a % p;
        b >>= 1;
    }
    return res;
}

// Returns a primitive root modulo p, or -1 if none exists
ll generator(ll p) {
    vector<ll> fact;
    ll phi = p - 1, n = phi;
    for (ll i = 2; i * i <= n; ++i) {
        if (n % i == 0) {
            fact.push_back(i);
            while (n % i == 0) n /= i;
        }
    }
    if (n > 1) fact.push_back(n);

    for (ll res = 2; res <= p; ++res) {
        bool ok = true;
        for (size_t i = 0; i < fact.size() && ok; ++i)
            ok &= powmod(res, phi / fact[i], p) != 1;
        if (ok) return res;
    }
    return -1;
}`
      }]);
    }
  }
  await seedAlgebra();

  // =================== BINARY SEARCH ===================
  async function seedBinarySearch() {
    if (!binarySearchId) return;

    const [bsNum] = await db.insert(templates).values({
      title: "Binary Search on Number",
      slug: "binary-search-on-number",
      description: "Classic binary search to find a value in a sorted array",
      categoryId: binarySearchId,
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

int main() {
    int n, q;
    cin >> n >> q;
    vector<int> arr(n);
    for (int i = 0; i < n && cin >> arr[i]; i++);

    while (q--) {
        int x;
        cin >> x;
        int l = 0, r = n - 1, ans = -1;
        bool found = false;
        while (l <= r) {
            int mid = l + (r - l) / 2;
            if (arr[mid] == x) {
                ans = mid;
                found = true;
                break;
            } else if (arr[mid] < x) {
                l = mid + 1;
            } else {
                r = mid - 1;
            }
        }
        cout << (ans == -1 ? "Not Found" : "Found") << endl;
    }
}`
      }]);
    }

    const [lowerB] = await db.insert(templates).values({
      title: "Lower Bound",
      slug: "lower-bound",
      description: "Find first element ≥ target in sorted array",
      categoryId: binarySearchId,
      tags: ["binary-search", "lower-bound", "sorted-array"],
      complexity: "O(log n)",
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
      categoryId: binarySearchId,
      tags: ["binary-search", "upper-bound", "sorted-array"],
      complexity: "O(log n)",
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
      categoryId: binarySearchId,
      tags: ["ternary-search", "unimodal", "convex-function"],
      complexity: "O(log n)",
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
  await seedBinarySearch();

  // =================== BIT MANIPULATION ===================
  async function seedBitManip() {
    if (!bitManipId) return;

    const [bitUtils] = await db.insert(templates).values({
      title: "Bit Utilities",
      slug: "bit-utilities",
      description: "Comprehensive bit manipulation utility functions",
      categoryId: bitManipId,
      tags: ["bit-manipulation", "bitwise", "utilities"],
      complexity: "O(1) per operation",
      notes: `# Bit Manipulation

Computers represent integers as binary numbers. Bit manipulation operations work directly on the binary representation.

## Common Operations

- **Check bit**: $(n \\gg i) \\& 1$
- **Set bit**: $n \\mid (1 \\ll i)$
- **Clear bit**: $n \\& \\sim(1 \\ll i)$
- **Toggle bit**: $n \\oplus (1 \\ll i)$
- **Power of two**: $n \\& (n-1) = 0$ (excluding $n=0$)
- **Lowest set bit**: $n \\& -n$
- **Clear lowest set bit**: $n \\& (n-1)$
- **Count set bits**: \`__builtin_popcountll(n)\`
- **Count leading zeros**: \`__builtin_clzll(n)\`
- **Count trailing zeros**: \`__builtin_ctzll(n)\`

## Tricks

- Subset enumeration: iterate mask from 0 to $(1 \\ll n) - 1$
- Check if $a$ is subset of $b$: $(a \\& b) = a$
- Generate all subsets: use bitmask iteration`,
    }).returning();
    if (bitUtils) {
      await db.insert(templateCodes).values([{
        templateId: bitUtils.id, language: "cpp", code: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

// Check if i-th bit is set
bool Knowbit(ll n, int i) { return (n >> i) & 1; }

// Turn on the i-th bit
ll Setbit(ll n, int i) { return n | (1LL << i); }

// Turn off the i-th bit
ll Resetbit(ll n, int i) { return n & (~(1LL << i)); }

// Flip the i-th bit
ll flip(ll n, int i) { return n ^ (1LL << i); }

// Check if n is a power of two
bool isPowerOfTwo(int n) { return n && !(n & (n - 1)); }

// Count number of set bits
int countBits(ll n) { return __builtin_popcountll(n); }

// Lowest set bit
ll lowestSetBit(ll n) { return n & (-n); }

// Clear lowest set bit
ll clearLowestBit(ll n) { return n & (n - 1); }

// Check if a is subset of b
bool isSubset(ll a, ll b) { return (a & b) == a; }

// MSB position (0-indexed), -1 if n==0
int msbPosition(ll n) {
    if (n == 0) return -1;
    return 63 - __builtin_clzll(n);
}

// LSB position (0-indexed), -1 if n==0
int lsbPosition(ll n) {
    if (n == 0) return -1;
    return __builtin_ctzll(n);
}

// Number of bits needed to represent n
int bitLength(ll n) {
    if (n == 0) return 1;
    return msbPosition(n) + 1;
}

// Convert n to given base
vector<ll> convertToBase(ll n, ll base) {
    vector<ll> vect;
    while (n) { vect.push_back(n % base); n /= base; }
    reverse(vect.begin(), vect.end());
    return vect;
}

// Generate all subsets of a set using bitmask
vector<vector<int>> generateSubsets(const vector<int> &s) {
    int n = s.size();
    vector<vector<int>> ans;
    for (int mask = 0; mask < (1 << n); mask++) {
        vector<int> v;
        for (int i = 0; i < n; i++)
            if (Knowbit(mask, i)) v.push_back(s[i]);
        ans.push_back(v);
    }
    return ans;
}`
      }]);
    }
  }
  await seedBitManip();

  // =================== COMBINATORICS ===================
  async function seedCombinatorics() {
    if (!combinatoricsId) return;

    const [binom] = await db.insert(templates).values({
      title: "Binomial Coefficients",
      slug: "binomial-coefficients",
      description: "nCr and nPr with factorial precomputation (mod 1e9+7)",
      categoryId: combinatoricsId,
      tags: ["combinatorics", "nCr", "nPr", "factorial"],
      complexity: "O(MAXN) precompute, O(1) per query",
      notes: `# Binomial Coefficients

$\\binom{n}{k}$ = number of ways to select $k$ elements from $n$ without order.

**Formula**: $\\binom{n}{k} = \\frac{n!}{k!(n-k)!}$

**Properties**:
- $\\binom{n}{k} = \\binom{n-1}{k-1} + \\binom{n-1}{k}$ (Pascal's Triangle)
- $\\sum_{k=0}^n \\binom{n}{k} = 2^n$
- $\\binom{n}{0} = \\binom{n}{n} = 1$`,
    }).returning();
    if (binom) {
      await db.insert(templateCodes).values([{
        templateId: binom.id, language: "cpp", code: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const ll mod = 1e9 + 7;
const int MAXN = 2e6 + 5;

ll fact[MAXN], invfact[MAXN];

ll power(ll base, ll exp, ll mod) {
    base %= mod;
    ll res = 1;
    while (exp > 0) {
        if (exp & 1) res = res * base % mod;
        base = base * base % mod;
        exp >>= 1;
    }
    return res;
}

void factorial_init() {
    fact[0] = 1;
    for (int i = 1; i < MAXN; i++)
        fact[i] = i * fact[i - 1] % mod;
    invfact[MAXN - 1] = power(fact[MAXN - 1], mod - 2, mod);
    for (int i = MAXN - 2; i >= 0; i--)
        invfact[i] = (i + 1) * invfact[i + 1] % mod;
}

ll nCr(ll n, ll r) {
    if (n < r || r < 0) return 0;
    return fact[n] * invfact[r] % mod * invfact[n - r] % mod;
}

ll nPr(ll n, ll r) {
    if (n < r || r < 0) return 0;
    return fact[n] * invfact[n - r] % mod;
}`
      }]);
    }

    const [burn] = await db.insert(templates).values({
      title: "Burnside's Lemma",
      slug: "burnsides-lemma",
      description: "Count distinct necklaces/colorings under symmetry (rotations)",
      categoryId: combinatoricsId,
      tags: ["combinatorics", "burnside", "necklace", "group-theory"],
      complexity: "O(n log MOD)",
      notes: `# Burnside's Lemma / Pólya Enumeration Theorem

Burnside's lemma counts equivalence classes under group actions.

For a set of colorings with $k$ colors and $n$ beads under rotation:

$$\\text{Necklaces} = \\frac{1}{n}\\sum_{i=1}^n k^{\\gcd(i,n)}$$

**Key idea**: For each group element $g$, count the number of colorings fixed by $g$. The number of equivalence classes is the average of these fixed counts.`,
    }).returning();
    if (burn) {
      await db.insert(templateCodes).values([{
        templateId: burn.id, language: "cpp", code: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const ll mod = 1e9 + 7;

ll power(ll base, ll exp, ll mod) {
    base %= mod;
    ll res = 1;
    while (exp > 0) {
        if (exp & 1) res = res * base % mod;
        base = base * base % mod;
        exp >>= 1;
    }
    return res;
}

ll inv(ll x, ll mod) {
    return power(x, mod - 2, mod);
}

// Number of distinct necklaces of n beads with k colors (rotations only)
ll necklace_count(ll n, ll k) {
    ll ans = 0;
    for (ll i = 1; i <= n; i++)
        ans = (ans + power(k, __gcd(i, n), mod)) % mod;
    return ans * inv(n, mod) % mod;
}`
      }]);
    }

    const [catalan] = await db.insert(templates).values({
      title: "Catalan Numbers",
      slug: "catalan-numbers",
      description: "Catalan numbers via formula and DP (mod 1e9+7)",
      categoryId: combinatoricsId,
      tags: ["combinatorics", "catalan", "dp", "bracket-sequences"],
      complexity: "O(n) formula / O(n²) DP",
      notes: `# Catalan Numbers

$C_0, C_1, C_2, \\dots = 1, 1, 2, 5, 14, 42, 132, 429, 1430, \\dots$

**Formulas**:
- $C_n = \\frac{1}{n+1}\\binom{2n}{n}$ (closed form)
- $C_{n+1} = \\sum_{i=0}^{n} C_i \\cdot C_{n-i}$ (recurrence)

**Applications**: bracket sequences, binary trees, polygon triangulations, monotonic lattice paths, non-crossing partitions, stack-sortable permutations.`,
    }).returning();
    if (catalan) {
      await db.insert(templateCodes).values([{
        templateId: catalan.id, language: "cpp", code: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const ll mod = 1e9 + 7;

ll power(ll base, ll exp, ll mod) {
    base %= mod;
    ll res = 1;
    while (exp > 0) {
        if (exp & 1) res = res * base % mod;
        base = base * base % mod;
        exp >>= 1;
    }
    return res;
}

// Catalan number using formula: C(2n, n) / (n + 1)
ll catalan(ll n) {
    ll res = 1;
    for (ll i = 0; i < n; i++)
        res = res * (2 * n - i) % mod * power(i + 1, mod - 2, mod) % mod;
    return res * power(n + 1, mod - 2, mod) % mod;
}

// Catalan with DP (for small n)
const int MAXN = 20;
ll catalan_dp[MAXN];

void init_catalan_dp() {
    catalan_dp[0] = catalan_dp[1] = 1;
    for (int i = 2; i < MAXN; i++) {
        catalan_dp[i] = 0;
        for (int j = 0; j < i; j++)
            catalan_dp[i] = (catalan_dp[i] + catalan_dp[j] * catalan_dp[i - j - 1]) % mod;
    }
}`
      }]);
    }

    const [inclExcl] = await db.insert(templates).values({
      title: "Inclusion-Exclusion Principle",
      slug: "inclusion-exclusion",
      description: "Count coprime numbers and divisibility using inclusion-exclusion over bitmasks",
      categoryId: combinatoricsId,
      tags: ["combinatorics", "inclusion-exclusion", "counting", "bitmask"],
      complexity: "O(2^p) where p = number of prime factors",
      notes: `# Inclusion-Exclusion Principle

For sets $A_1, \\dots, A_n$:

$$\\left|\\bigcup_{i=1}^n A_i\\right| = \\sum_i |A_i| - \\sum_{i<j} |A_i \\cap A_j| + \\sum_{i<j<k} |A_i \\cap A_j \\cap A_k| - \\cdots$$

## Applications

- Count numbers coprime to $n$ up to $r$: factorize $n$, use inclusion-exclusion over subsets of prime factors.
- Count numbers divisible by any of given divisors.
- Derangements, Stirling numbers, Euler's totient function.`,
    }).returning();
    if (inclExcl) {
      await db.insert(templateCodes).values([{
        templateId: inclExcl.id, language: "cpp", code: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

// Count numbers from 1 to r that are coprime with n
int coprime_count(int n, int r) {
    vector<int> p;
    for (int i = 2; i * i <= n; ++i) {
        if (n % i == 0) {
            p.push_back(i);
            while (n % i == 0) n /= i;
        }
    }
    if (n > 1) p.push_back(n);

    int sum = 0;
    for (int msk = 1; msk < (1 << p.size()); ++msk) {
        int mult = 1, bits = 0;
        for (int i = 0; i < (int)p.size(); ++i) {
            if (msk & (1 << i)) {
                ++bits;
                mult *= p[i];
            }
        }
        if (bits % 2 == 1) sum += r / mult;
        else sum -= r / mult;
    }
    return r - sum;
}

// Count integers in [1, n] divisible by at least one from vector a
int divisible_by_any(int n, vector<int> &a) {
    int m = a.size();
    int sum = 0;
    for (int mask = 1; mask < (1 << m); mask++) {
        int lcm_val = 1, bits = 0;
        for (int i = 0; i < m; i++) {
            if (mask & (1 << i)) {
                bits++;
                lcm_val = lcm_val / __gcd(lcm_val, a[i]) * a[i];
            }
        }
        if (bits % 2 == 1) sum += n / lcm_val;
        else sum -= n / lcm_val;
    }
    return sum;
}`
      }]);
    }
  }
  await seedCombinatorics();

  // =================== DATA STRUCTURES ===================
  async function seedDataStruct() {
    if (!dataStructId) return;

    const [sparse] = await db.insert(templates).values({
      title: "Sparse Table",
      slug: "sparse-table",
      description: "Static range minimum/sum query with O(n log n) build, O(1) RMQ",
      categoryId: rangeQueriesId,
      tags: ["sparse-table", "range-query", "rmq", "static-array"],
      complexity: "O(n log n) build, O(1) RMQ, O(log n) sum",
      notes: `# Sparse Table

Data structure for immutable arrays answering range queries. True power: **range minimum queries** in $O(1)$.

**Limitation**: Array cannot be changed between queries — entire structure must be recomputed.

## Idea

Precompute answers for all intervals with power-of-two lengths. Any interval can be split into at most $\\lceil \\log_2(\\text{length}) \\rceil$ such precomputed intervals.

**RMQ (idempotent)**: Overlap is fine, so two intervals suffice — $O(1)$ query.
**Sum (non-idempotent)**: Decompose into disjoint intervals — $O(\\log n)$ query.

## Precomputation

$\\text{st}[i][j]$ stores answer for range $[j, j + 2^i - 1]$. Size: $(K+1) \\times \\text{MAXN}$.`,
    }).returning();
    if (sparse) {
      await db.insert(templateCodes).values([{
        templateId: sparse.id, language: "cpp", code: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

// Sparse Table for static range minimum query
// O(n log n) build, O(1) query
const int MAXN = 1e5 + 5;
const int K = 20;

int st[K + 1][MAXN];
int lg[MAXN + 1];

void build(vector<int> &a) {
    int n = a.size();
    for (int i = 0; i < n; i++) st[0][i] = a[i];

    for (int i = 1; i <= K; i++)
        for (int j = 0; j + (1 << i) <= n; j++)
            st[i][j] = min(st[i - 1][j], st[i - 1][j + (1 << (i - 1))]);

    lg[1] = 0;
    for (int i = 2; i < MAXN; i++)
        lg[i] = lg[i / 2] + 1;
}

// Query min on [L, R]
int query(int L, int R) {
    int i = lg[R - L + 1];
    return min(st[i][L], st[i][R - (1 << i) + 1]);
}

// Sparse Table for range sum
ll st_sum[K + 1][MAXN];

void build_sum(vector<int> &a) {
    int n = a.size();
    for (int i = 0; i < n; i++) st_sum[0][i] = a[i];

    for (int i = 1; i <= K; i++)
        for (int j = 0; j + (1 << i) <= n; j++)
            st_sum[i][j] = st_sum[i - 1][j] + st_sum[i - 1][j + (1 << (i - 1))];
}

ll query_sum(int L, int R) {
    ll sum = 0;
    for (int i = K; i >= 0; i--) {
        if ((1 << i) <= R - L + 1) {
            sum += st_sum[i][L];
            L += 1 << i;
        }
    }
    return sum;
}`
      }]);
    }

    // --- Segment Tree ---
    const [segTree] = await db.insert(templates).values({
      title: "Segment Tree",
      slug: "segment-tree",
      description: "Generic segment tree supporting range queries and point updates",
      categoryId: dataStructId,
      tags: ["segment-tree", "range-query", "point-update", "data-structure"],
      complexity: "O(log n) per query",
    }).returning();
    if (segTree) {
      await db.insert(templateCodes).values([{
        templateId: segTree.id, language: "cpp", code: `#include <bits/stdc++.h>
using namespace std;
#define all(vec) vec.begin(), vec.end()
#define rall(vec) vec.rbegin(), vec.rend()
#define sz(x) int(x.size())
#define fi first
#define se second
#define ll long long
template < typename T = int > using Pair = pair < T, T >;

template < typename T = int > struct Segment_Tree {
    int n;
    vector < T > seg;
    T def;
    Segment_Tree(int _n, T _def = T()) { n = _n; def = _def; seg.assign(4 * n + 5, def); }
    T operation(T a, T b){ return a + b; }
    T query(int l, int r){ return query(1, 1, n, l, r); }
    void update(int idx, T val){ update(1, 1, n, idx, val); }
    template < typename M > T query(M&& func){ return query(1, 1, n, forward<M>(func)); }
private:
    T query(int p, int s, int e, int l, int r){
        if(l > e || s > r) return def;
        if(l <= s && e <= r) return seg[p];
        int md = (s + e) >> 1;
        return operation(query(p * 2, s, md, l, r), query(p * 2 + 1, md + 1, e, l, r));
    }
    void update(int p, int s, int e, int idx, T val){
        if(s == e) { seg[p] = val; return; }
        int md = (s + e) >> 1;
        if(idx <= md) update(p * 2, s, md, idx, val);
        else update(p * 2 + 1, md + 1, e, idx, val);
        seg[p] = operation(seg[p * 2], seg[p * 2 + 1]);
    }
    template < typename M > T query(int p, int s, int e, M&& func){
        if(func(seg[p])) return seg[p];
        if(s == e) return def;
        int md = (s + e) >> 1;
        T ret = query(p * 2, s, md, forward<M>(func));
        if(ret != def) return ret;
        return query(p * 2 + 1, md + 1, e, forward<M>(func));
    }
};`
      }]);
    }

    // --- Fenwick Tree ---
    const [fenwick] = await db.insert(templates).values({
      title: "Fenwick Tree (BIT)",
      slug: "fenwick-tree",
      description: "Binary Indexed Tree for prefix sum queries and point updates",
      categoryId: dataStructId,
      tags: ["fenwick", "BIT", "range-query", "point-update"],
      complexity: "O(log n) per operation",
    }).returning();
    if (fenwick) {
      await db.insert(templateCodes).values([{
        templateId: fenwick.id, language: "cpp", code: `#include <bits/stdc++.h>
using namespace std;
#define all(vec) vec.begin(), vec.end()
#define rall(vec) vec.rbegin(), vec.rend()
#define sz(x) int(x.size())
#define fi first
#define se second
#define ll long long

template < typename T = int > struct Fenwick_Tree {
    int n;
    vector < T > BIT;
    Fenwick_Tree(int _n = 0){ n = _n; BIT.assign(n + 5, 0); }
    void add(int idx, T val){ while(idx <= n){ BIT[idx] += val; idx += idx & -idx; } }
    T get(int idx){ T ret = 0; while(idx){ ret += BIT[idx]; idx -= idx & -idx; } return ret; }
    T get(int l, int r){ return get(r) - get(l - 1); }
};`
      }]);
    }

    // --- DSU ---
    const [dsu] = await db.insert(templates).values({
      title: "DSU / Union-Find",
      slug: "dsu",
      description: "Disjoint Set Union with path compression and union by size",
      categoryId: dataStructId,
      tags: ["dsu", "union-find", "disjoint-set", "connectivity"],
      complexity: "O(α(n)) amortized per operation",
    }).returning();
    if (dsu) {
      await db.insert(templateCodes).values([{
        templateId: dsu.id, language: "cpp", code: `#include <bits/stdc++.h>
using namespace std;
#define all(vec) vec.begin(), vec.end()
#define rall(vec) vec.rbegin(), vec.rend()
#define sz(x) int(x.size())
#define fi first
#define se second
#define ll long long

struct DSU {
    vector < int > par, sz;
    DSU(int n){ par.assign(n + 5, 0); sz.assign(n + 5, 1); for(int i = 1; i <= n; i++) par[i] = i; }
    int find_root(int u){ return par[u] = (par[u] == u ? u : find_root(par[u])); }
    bool union_sets(int u, int v){
        u = find_root(u), v = find_root(v);
        if(u == v) return false;
        if(sz[u] < sz[v]) swap(u, v);
        par[v] = u; sz[u] += sz[v];
        return true;
    }
    bool is_same_set(int u, int v){ return find_root(u) == find_root(v); }
    int get_size(int u){ return sz[find_root(u)]; }
};`
      }]);
    }

    // --- Trie ---
    const [trie] = await db.insert(templates).values({
      title: "Trie",
      slug: "trie",
      description: "Trie data structure with XOR max query support",
      categoryId: dataStructId,
      tags: ["trie", "prefix-tree", "string", "xor"],
      complexity: "O(|S|) per insert/query",
    }).returning();
    if (trie) {
      await db.insert(templateCodes).values([{
        templateId: trie.id, language: "cpp", code: `#include <bits/stdc++.h>
using namespace std;
#define all(vec) vec.begin(), vec.end()
#define rall(vec) vec.rbegin(), vec.rend()
#define sz(x) int(x.size())
#define ll long long

struct Trie {
    struct Node { Node *nxt[2]; int cnt; Node() { nxt[0] = nxt[1] = nullptr; cnt = 0; } };
    Node *root;
    Trie() { root = new Node(); }
    void insert(ll x){
        Node *cur = root;
        for(int i = 32; i >= 0; i--){
            int bit = (x >> i) & 1;
            if(!cur->nxt[bit]) cur->nxt[bit] = new Node();
            cur = cur->nxt[bit]; cur->cnt++;
        }
    }
    void remove(ll x){
        Node *cur = root;
        for(int i = 32; i >= 0; i--){
            int bit = (x >> i) & 1;
            cur = cur->nxt[bit]; cur->cnt--;
        }
    }
    ll max_xor(ll x){
        Node *cur = root; ll ans = 0;
        for(int i = 32; i >= 0; i--){
            int bit = (x >> i) & 1;
            if(cur->nxt[!bit] && cur->nxt[!bit]->cnt){ cur = cur->nxt[!bit]; ans |= (1LL << i); }
            else { cur = cur->nxt[bit]; }
        }
        return ans;
    }
};`
      }]);
    }

    // --- Monotonic Stack & Queue ---
    const [mono] = await db.insert(templates).values({
      title: "Monotonic Stacks & Queues",
      slug: "monotonic-stack-queue",
      description: "Monotonic stack (NGE/PGE) and monotonic queue utilities",
      categoryId: dataStructId,
      tags: ["monotonic", "stack", "queue", "next-greater-element"],
      complexity: "O(n)",
    }).returning();
    if (mono) {
      await db.insert(templateCodes).values([{
        templateId: mono.id, language: "cpp", code: `#include <bits/stdc++.h>
using namespace std;
#define all(vec) vec.begin(), vec.end()
#define rall(vec) vec.rbegin(), vec.rend()
#define sz(x) int(x.size())
#define fi first
#define se second
#define ll long long

template < typename T = int > struct Monotonic_Stack {
    vector < T > nxt_greater, prv_greater, nxt_smaller, prv_smaller;
    int n;
    Monotonic_Stack(const vector < T > &arr){
        n = sz(arr);
        nxt_greater.assign(n, n); prv_greater.assign(n, -1);
        nxt_smaller.assign(n, n); prv_smaller.assign(n, -1);
        stack < int > st;
        for(int i = 0; i < n; i++){
            while(!st.empty() && arr[st.top()] < arr[i]){ nxt_greater[st.top()] = i; st.pop(); }
            if(!st.empty()) prv_greater[i] = st.top();
            st.push(i);
        }
        while(!st.empty()) st.pop();
        for(int i = 0; i < n; i++){
            while(!st.empty() && arr[st.top()] > arr[i]){ nxt_smaller[st.top()] = i; st.pop(); }
            if(!st.empty()) prv_smaller[i] = st.top();
            st.push(i);
        }
    }
};`
      }]);
    }

    // --- Coordinate Compression ---
    const [coordCompress] = await db.insert(templates).values({
      title: "Coordinate Compression",
      slug: "coordinate-compression",
      description: "Coordinate compression with 0/1-indexed query support",
      categoryId: dataStructId,
      tags: ["compression", "coordinate", "discretization"],
      complexity: "O(n log n)",
    }).returning();
    if (coordCompress) {
      await db.insert(templateCodes).values([{
        templateId: coordCompress.id, language: "cpp", code: `#include <bits/stdc++.h>
using namespace std;
#define all(vec) vec.begin(), vec.end()
#define rall(vec) vec.rbegin(), vec.rend()
#define sz(x) int(x.size())
#define fi first
#define se second
#define ll long long

template < typename T = int > struct Coordinate_Compression {
    vector < T > compressed;
    bool zeroBase;
    Coordinate_Compression(const vector < T > &arr, bool zeroBase = true){
        this->zeroBase = zeroBase;
        compressed = arr;
        sort(all(compressed));
        compressed.erase(unique(all(compressed)), compressed.end());
    }
    int getIdx(T val){ return lower_bound(all(compressed), val) - compressed.begin() - !zeroBase; }
    T getVal(int idx){ return compressed[idx + !zeroBase]; }
    int size(){ return sz(compressed); }
};`
      }]);
    }

    // --- Mo's Algorithm ---
    const [mo] = await db.insert(templates).values({
      title: "Mo's Algorithm",
      slug: "mos-algorithm",
      description: "Mo's algorithm for offline range queries with Hilbert order optimization",
      categoryId: dataStructId,
      tags: ["mo-algorithm", "offline", "range-query", "sqrt-decomposition"],
      complexity: "O((n+q)√n)",
    }).returning();
    if (mo) {
      await db.insert(templateCodes).values([{
        templateId: mo.id, language: "cpp", code: `#include <bits/stdc++.h>
using namespace std;
#define all(vec) vec.begin(), vec.end()
#define rall(vec) vec.rbegin(), vec.rend()
#define sz(x) int(x.size())
#define fi first
#define se second
#define ll long long

class MoAlgorithm {
public:
    struct Query {
        int l, r, idx, block;
        Query(int L, int R, int IDX, int B) : l(L), r(R), idx(IDX), block(B) {}
        bool operator<(const Query& q) const {
            if(block != q.block) return block < q.block;
            return (block & 1) ? (r > q.r) : (r < q.r);
        }
    };
    int n, q, block_size;
    vector < Query > queries;
    vector < ll > answers;
    MoAlgorithm(int N, int Q) : n(N), q(Q) { block_size = int(sqrt(n)) + 1; }
    void add_query(int l, int r, int idx) { queries.emplace_back(l, r, idx, l / block_size); }
    void process(const vector < int > &arr) {
        sort(all(queries));
        answers.assign(q, 0);
        int cur_l = 1, cur_r = 0;
        ll cur_ans = 0;
        vector < int > freq(1000005, 0);
        auto add = [&](int pos){ int val = arr[pos]; if(freq[val] == 0) cur_ans++; freq[val]++; };
        auto remove = [&](int pos){ int val = arr[pos]; freq[val]--; if(freq[val] == 0) cur_ans--; };
        for(auto& [l, r, idx, blk] : queries){
            while(cur_l > l) add(--cur_l);
            while(cur_r < r) add(++cur_r);
            while(cur_l < l) remove(cur_l++);
            while(cur_r > r) remove(cur_r--);
            answers[idx] = cur_ans;
        }
    }
};`
      }]);
    }
  }
  await seedDataStruct();

  // =================== GRAPH ===================
  async function seedGraph() {
    if (!graphId) return;

    // --- Graph Representation ---
    const [graphRep] = await db.insert(templates).values({
      title: "Graph Representation",
      slug: "graph-representation",
      description: "Graph I/O helpers and adjacency list utilities",
      categoryId: graphId,
      tags: ["graph", "adjacency-list", "io"],
      complexity: "O(n+m) build",
    }).returning();
    if (graphRep) {
      await db.insert(templateCodes).values([{
        templateId: graphRep.id, language: "cpp", code: `#include <bits/stdc++.h>
using namespace std;
#define all(vec) vec.begin(), vec.end()
#define rall(vec) vec.rbegin(), vec.rend()
#define sz(x) int(x.size())
#define fi first
#define se second
#define ll long long
template < typename T = int > istream& operator >> (istream &in, vector < T > &v) { for (auto &x : v) in >> x; return in; }
template < typename T = int > ostream& operator << (ostream &out, const vector < T > &v) { for (const T &x : v) out << x << ' '; return out; }
enum GRAPH_TYPE { INDIRECTED = 0, DIRECTED = 1 };
vector < vector < int > > adj;
void add_edge(int u, int v, bool is_directed = false) { adj[u].push_back(v); if (!is_directed) adj[v].push_back(u); }
void build_adj(int n, int m, bool is_directed = false, bool is_oneIndexed = true) {
    adj = vector < vector < int > > (n + 5);
    for (int i = 0, u, v; i < m && cin >> u >> v; i++) add_edge(u, v, is_directed);
}`
      }]);
    }

    // --- Dijkstra ---
    const [dijkstra] = await db.insert(templates).values({
      title: "Dijkstra's Algorithm", slug: "dijkstra",
      description: "Shortest path in non-negative weighted graphs",
      categoryId: graphId,
      tags: ["dijkstra", "shortest-path", "graph"],
      complexity: "O((E+V) log V)",
    }).returning();
    if (dijkstra) {
      await db.insert(templateCodes).values([{
        templateId: dijkstra.id, language: "cpp", code: `#include <bits/stdc++.h>
using namespace std;
#define all(vec) vec.begin(), vec.end()
#define rall(vec) vec.rbegin(), vec.rend()
#define sz(x) int(x.size())
#define fi first
#define se second
#define ll long long
template < typename T = int > struct Dijkstra {
    struct Edge { T v, w; Edge(T V = 0, T W = 0): v(V), w(W) {} bool operator < (const Edge& e) const { return w > e.w; } };
    vector < vector < Edge > > adj;
    Dijkstra(int edges, bool indirected = true){
        adj = vector < vector < Edge > > (edges);
        for(int i = 0, u, v, w; i < edges; i++){ cin >> u >> v >> w; adj[u].push_back(Edge(v, w)); if(indirected) adj[v].push_back(Edge(u, w)); }
    }
    T Min_Cost(int src, int dest){
        int n = sz(adj); vector < T > dist(n, LLONG_MAX); dist[src] = 0;
        priority_queue < Edge > Dij; Dij.push(Edge(src, 0));
        while(!Dij.empty()){
            auto [u, cost] = Dij.top(); Dij.pop();
            for(auto& [v, w] : adj[u]) if(dist[v] > dist[u] + w){ dist[v] = dist[u] + w; Dij.push(Edge(v, dist[v])); }
        }
        return (dist[dest] == LLONG_MAX ? -1 : dist[dest]);
    }
    vector < T > get_dist(int src){
        int n = sz(adj); vector < T > dist(n, LLONG_MAX); dist[src] = 0;
        priority_queue < Edge > Dij; Dij.push(Edge(src, 0));
        while(!Dij.empty()){
            auto [u, cost] = Dij.top(); Dij.pop();
            for(auto& [v, w] : adj[u]) if(dist[v] > dist[u] + w){ dist[v] = dist[u] + w; Dij.push(Edge(v, dist[v])); }
        }
        return dist;
    }
};`
      }]);
    }

    // --- Floyd-Warshall ---
    const [floyd] = await db.insert(templates).values({
      title: "Floyd-Warshall", slug: "floyd-warshall",
      description: "All-pairs shortest paths in weighted graphs",
      categoryId: graphId,
      tags: ["floyd-warshall", "all-pairs", "shortest-path", "dp"],
      complexity: "O(V³)",
    }).returning();
    if (floyd) {
      await db.insert(templateCodes).values([{
        templateId: floyd.id, language: "cpp", code: `#include <bits/stdc++.h>
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
};`
      }]);
    }

    // --- LCA ---
    const [lca] = await db.insert(templates).values({
      title: "LCA — Lowest Common Ancestor", slug: "lca",
      description: "Binary lifting for LCA, distance, and k-th ancestor queries",
      categoryId: graphId,
      tags: ["lca", "lowest-common-ancestor", "binary-lifting", "tree"],
      complexity: "O(n log n) build, O(log n) per query",
    }).returning();
    if (lca) {
      await db.insert(templateCodes).values([{
        templateId: lca.id, language: "cpp", code: `#include <bits/stdc++.h>
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
};`
      }]);
    }

    // --- Tarjan ---
    const [tarjan] = await db.insert(templates).values({
      title: "Tarjan's Algorithm", slug: "tarjan",
      description: "Strongly Connected Components, bridges, and articulation points",
      categoryId: graphId,
      tags: ["tarjan", "scc", "bridges", "articulation-points", "graph"],
      complexity: "O(V+E)",
    }).returning();
    if (tarjan) {
      await db.insert(templateCodes).values([{
        templateId: tarjan.id, language: "cpp", code: `#include <bits/stdc++.h>
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
};`
      }]);
    }

    // --- Bellman-Ford ---
    const [bellman] = await db.insert(templates).values({
      title: "Bellman-Ford", slug: "bellman-ford",
      description: "Shortest path with negative weights and negative cycle detection",
      categoryId: graphId,
      tags: ["bellman-ford", "shortest-path", "negative-cycle", "graph"],
      complexity: "O(V·E)",
    }).returning();
    if (bellman) {
      await db.insert(templateCodes).values([{
        templateId: bellman.id, language: "cpp", code: `#include <bits/stdc++.h>
using namespace std;
#define all(vec) vec.begin(), vec.end()
#define rall(vec) vec.rbegin(), vec.rend()
#define sz(x) int(x.size())
#define fi first
#define se second
#define ll long long
struct Edge { int u, v, w; };
int n, m;
vector < Edge > edges;
const ll INF = 1e18;
vector < ll > Bellman_Ford(int src) {
    vector < ll > dist(n + 1, INF); dist[src] = 0;
    for (int i = 1; i <= n; i++) { bool any = false;
        for (auto& [u, v, w] : edges) { if (dist[u] < INF && dist[v] > dist[u] + w) { dist[v] = dist[u] + w; any = true; if (i == n) return {}; } }
        if (!any) break;
    }
    return dist;
}`
      }]);
    }
  }
  await seedGraph();

  // =================== DYNAMIC PROGRAMMING ===================
  async function seedDP() {
    if (!dpId) return;

    // --- Kadane ---
    const [kadane] = await db.insert(templates).values({
      title: "Kadane's Algorithm", slug: "kadane",
      description: "Maximum subarray sum in O(n) time",
      categoryId: dpId,
      tags: ["kadane", "subarray", "maximum-sum", "dp"],
      complexity: "O(n)",
    }).returning();
    if (kadane) {
      await db.insert(templateCodes).values([{
        templateId: kadane.id, language: "cpp", code: `#include <bits/stdc++.h>
using namespace std;
#define all(vec) vec.begin(), vec.end()
#define rall(vec) vec.rbegin(), vec.rend()
#define sz(x) int(x.size())
#define ll long long
template < typename T = int > T Kadane(const vector < T > &arr){
    T max_ending = 0, max_subarray = 0;
    for(auto& x : arr){ max_ending = max(x, max_ending + x); max_subarray = max(max_subarray, max_ending); }
    return max_subarray;
}`
      }]);
    }

    // --- Digit DP ---
    const [digitDp] = await db.insert(templates).values({
      title: "Digit DP", slug: "digit-dp",
      description: "Digit dynamic programming for counting numbers with digit constraints",
      categoryId: dpId,
      tags: ["digit-dp", "dp", "digits", "counting"],
      complexity: "O(len · tight · sum_state)",
    }).returning();
    if (digitDp) {
      await db.insert(templateCodes).values([{
        templateId: digitDp.id, language: "cpp", code: `#include <bits/stdc++.h>
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
}`
      }]);
    }

    // --- Convex Hull Trick ---
    const [cht] = await db.insert(templates).values({
      title: "Convex Hull Trick (Li Chao)", slug: "convex-hull-trick",
      description: "Li Chao segment tree for dynamic line insertion and min/max query",
      categoryId: dpId,
      tags: ["cht", "li-chao", "convex-hull", "dp-optimization"],
      complexity: "O(log C) per insert/query",
    }).returning();
    if (cht) {
      await db.insert(templateCodes).values([{
        templateId: cht.id, language: "cpp", code: `#include <bits/stdc++.h>
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
};`
      }]);
    }
  }
  await seedDP();

  // =================== STRINGS ===================
  async function seedStrings() {
    if (!stringsId) return;

    // --- KMP ---
    const [kmp] = await db.insert(templates).values({
      title: "KMP Algorithm", slug: "kmp",
      description: "Knuth-Morris-Pratt pattern matching and prefix function",
      categoryId: stringsId,
      tags: ["kmp", "pattern-matching", "string", "prefix-function"],
      complexity: "O(n+m)",
    }).returning();
    if (kmp) {
      await db.insert(templateCodes).values([{
        templateId: kmp.id, language: "cpp", code: `#include <bits/stdc++.h>
using namespace std;
#define all(vec) vec.begin(), vec.end()
#define rall(vec) vec.rbegin(), vec.rend()
#define sz(x) int(x.size())
#define ll long long
vector < int > prefix_function(const string &s) {
    int n = sz(s); vector < int > pi(n);
    for (int i = 1; i < n; i++) { int j = pi[i - 1]; while (j > 0 && s[i] != s[j]) j = pi[j - 1]; if (s[i] == s[j]) j++; pi[i] = j; }
    return pi;
}
vector < int > KMP(const string &s, const string &p) {
    string t = p + '#' + s; vector < int > pi = prefix_function(t), matches;
    for (int i = sz(p) + 1; i < sz(t); i++) if (pi[i] == sz(p)) matches.push_back(i - 2 * sz(p));
    return matches;
}`
      }]);
    }

    // --- Manacher ---
    const [manacher] = await db.insert(templates).values({
      title: "Manacher's Algorithm", slug: "manacher",
      description: "Find all palindromic substrings in O(n) time",
      categoryId: stringsId,
      tags: ["manacher", "palindrome", "string", "substring"],
      complexity: "O(n)",
    }).returning();
    if (manacher) {
      await db.insert(templateCodes).values([{
        templateId: manacher.id, language: "cpp", code: `#include <bits/stdc++.h>
using namespace std;
#define all(vec) vec.begin(), vec.end()
#define rall(vec) vec.rbegin(), vec.rend()
#define sz(x) int(x.size())
#define ll long long
vector < int > manacher(const string &s) {
    string t = "#"; for (char c : s) { t += c; t += '#'; }
    int n = sz(t); vector < int > p(n); int l = 0, r = -1;
    for (int i = 0; i < n; i++) {
        int k = (i > r) ? 1 : min(p[l + r - i], r - i + 1);
        while (i - k >= 0 && i + k < n && t[i - k] == t[i + k]) k++;
        p[i] = k--; if (i + k > r) { l = i - k; r = i + k; }
    }
    return p;
}`
      }]);
    }

    // --- Rolling Hash ---
    const [rollingHash] = await db.insert(templates).values({
      title: "Rolling Hash (Hashing)", slug: "rolling-hash",
      description: "String hashing with polynomial rolling hash (double hash for safety)",
      categoryId: stringsId,
      tags: ["hashing", "rolling-hash", "string", "substring"],
      complexity: "O(n) build, O(1) per substring query",
    }).returning();
    if (rollingHash) {
      await db.insert(templateCodes).values([{
        templateId: rollingHash.id, language: "cpp", code: `#include <bits/stdc++.h>
using namespace std;
#define all(vec) vec.begin(), vec.end()
#define rall(vec) vec.rbegin(), vec.rend()
#define sz(x) int(x.size())
#define ll long long
struct Hash {
    static const ll mod1 = 1e9 + 7, mod2 = 1e9 + 9, base = 13331;
    vector < pair < ll, ll > > h, pw;
    Hash(const string &s) {
        int n = sz(s); h.assign(n + 1, {0, 0}); pw.assign(n + 1, {1, 1});
        for (int i = 1; i <= n; i++) {
            h[i].first = (h[i - 1].first * base + s[i - 1]) % mod1;
            h[i].second = (h[i - 1].second * base + s[i - 1]) % mod2;
            pw[i].first = (pw[i - 1].first * base) % mod1;
            pw[i].second = (pw[i - 1].second * base) % mod2;
        }
    }
    pair < ll, ll > get(int l, int r) {
        ll hash1 = (h[r].first - h[l - 1].first * pw[r - l + 1].first % mod1 + mod1) % mod1;
        ll hash2 = (h[r].second - h[l - 1].second * pw[r - l + 1].second % mod2 + mod2) % mod2;
        return {hash1, hash2};
    }
};`
      }]);
    }
  }
  await seedStrings();

  // =================== GEOMETRY ===================
  async function seedGeometry() {
    if (!geometryId) return;

    const [geo2d] = await db.insert(templates).values({
      title: "2D Geometry",
      slug: "2d-geometry",
      description: "Complete 2D computational geometry: points, lines, segments, polygons, circles",
      categoryId: geometryId,
      tags: ["geometry", "2d", "computational-geometry", "polygon", "circle"],
      complexity: "O(1) per operation",
      notes: `# Basic Geometry

## Linear Operations

Points in 2D maintain linear space: sum and scalar multiplication are defined. Using \`complex<T>\` from STL is convenient.

## Key Concepts

**Dot product**: $v \\cdot w = v_x w_x + v_y w_y$ — measures projection.
**Cross product**: $v \\times w = v_x w_y - v_y w_x$ — measures signed area.

## Orientation

orient(a, b, c) = cross(b - a, c - a):
- > 0: counter-clockwise (left turn)
- < 0: clockwise (right turn)
- = 0: collinear

## Polygon Area

Shoelace formula: $\\text{area} = \\frac{1}{2}\\left|\\sum_{i=0}^{n-1} (x_i y_{i+1} - x_{i+1} y_i)\\right|$`,
    }).returning();
    if (geo2d) {
      await db.insert(templateCodes).values([{
        templateId: geo2d.id, language: "cpp", code: `#include<bits/stdc++.h>
using namespace std;
typedef double ld;
typedef long long ll;
const ld EPS = 1e-9;

typedef ld T;
typedef complex<T> pt;
#define x real()
#define y imag()

// --- Basics ---
bool operator==(pt a, pt b) { return fabs(a.x - b.x) < EPS && fabs(a.y - b.y) < EPS; }
int sgn(T val) { return (T(0) < val) - (val < T(0)); }
T sq(pt p) { return p.x * p.x + p.y * p.y; }
ld abs(pt p) { return sqrt(sq(p)); }
pt perp(pt p) { return {-p.y, p.x}; }
T dot(pt v, pt w) { return v.x * w.x + v.y * w.y; }
T cross(pt v, pt w) { return v.x * w.y - v.y * w.x; }

// --- Orientation ---
T orient(pt a, pt b, pt c) { return cross(b - a, c - a); }

// --- Lines ---
struct line {
    pt v; T c;
    line(pt v, T c) : v(v), c(c) {}
    line(T a, T b, T _c) { v = {b, -a}; c = _c; }
    line(pt p, pt q) { v = q - p; c = cross(v, p); }
    T side(pt p) { return cross(v, p) - c; }
    double dist(pt p) { return abs(side(p)) / abs(v); }
    pt proj(pt p) { return p - perp(v) * side(p) / sq(v); }
    pt refl(pt p) { return p - perp(v) * (T)2.0 * side(p) / sq(v); }
};

bool inter(line l1, line l2, pt &out) {
    T d = cross(l1.v, l2.v);
    if (fabs(d) <= EPS) return false;
    out = (l2.v * l1.c - l1.v * l2.c) / d;
    return true;
}

// --- Segments ---
bool onSegment(pt a, pt b, pt p) {
    return fabsl(orient(a, b, p)) <= EPS && dot(a - p, b - p) <= EPS;
}

bool properInter(pt a, pt b, pt c, pt d, pt &out) {
    T oa = orient(c, d, a), ob = orient(c, d, b);
    T oc = orient(a, b, c), od = orient(a, b, d);
    if (sgn(oa) * sgn(ob) < 0 && sgn(oc) * sgn(od) < 0) {
        out = (a * ob - b * oa) / (ob - oa);
        return true;
    }
    return false;
}

ld segPoint(pt a, pt b, pt p) {
    if (a != b) {
        line l(a, b);
        if (l.cmpProj(a, p) && l.cmpProj(p, b))
            return l.dist(p);
    }
    return min(abs(p - a), abs(p - b));
}

// --- Polygons ---
bool isConvex(vector<pt> p) {
    bool hasPos = false, hasNeg = false;
    for (int i = 0, n = p.size(); i < n; i++) {
        int o = orient(p[i], p[(i + 1) % n], p[(i + 2) % n]);
        if (o > 0) hasPos = true;
        if (o < 0) hasNeg = true;
    }
    return !(hasPos && hasNeg);
}

ld areaTriangle(pt a, pt b, pt c) {
    return abs(cross(b - a, c - a)) / 2.0;
}

ld areaPolygon(vector<pt> p) {
    ld area = 0.0;
    for (int i = 0, n = p.size(); i < n; i++)
        area += cross(p[i], p[(i + 1) % n]);
    return abs(area) / 2.0;
}

bool inPolygon(vector<pt> p, pt a, bool strict = true) {
    int numCrossings = 0;
    for (int i = 0, n = p.size(); i < n; i++) {
        if (onSegment(p[i], p[(i + 1) % n], a))
            return !strict;
        bool aboveA = (p[(i + 1) % n].y >= a.y) - (p[i].y >= a.y);
        numCrossings += aboveA * orient(a, p[i], p[(i + 1) % n]) > 0;
    }
    return numCrossings & 1;
}`
      }]);
    }
  }
  await seedGeometry();

  // =================== NUMBER THEORY ===================
  async function seedNumberTheory() {
    if (!numberTheoryId) return;

    const [fib] = await db.insert(templates).values({
      title: "Fibonacci Numbers",
      slug: "fibonacci-numbers",
      description: "Recursive Fibonacci calculation",
      categoryId: dpId,
      tags: ["fibonacci", "recursion", "number-theory"],
      complexity: "O(2^n) naive — use matrix exponentiation for O(log n)",
    }).returning();
    if (fib) {
      await db.insert(templateCodes).values([{
        templateId: fib.id, language: "cpp", code: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

// Fibonacci Function
// @brief Calculates the nth Fibonacci number using recursion.
// @param n The position in the Fibonacci sequence.
// @return The nth Fibonacci number.
ll fibonacci(ll n) {
    if (n <= 2) return n - 1;
    return fibonacci(n - 1) + fibonacci(n - 2);
}`
      }]);
    }

    const [mathUtils] = await db.insert(templates).values({
      title: "Math Utilities",
      slug: "math-utilities",
      description: "Comprehensive math toolkit: modular arithmetic, GCD/LCM, sieve, phi, factoring, nCr",
      categoryId: utilsId,
      tags: ["math", "modular", "gcd", "sieve", "phi", "factorization", "nCr"],
      complexity: "Varies per function",
      notes: `Comprehensive mathematics utility library for competitive programming. Contains:

- **Modular Arithmetic**: fastPower, invMod, add, mul, sub, divide
- **GCD/LCM**: Euclidean GCD, Binary GCD (Stein's), extended GCD, array GCD/LCM
- **Prime Numbers**: Sieve of Eratosthenes, linear sieve, isPrime
- **Euler's Totient**: single value PHI, phi_1_to_n via sieve
- **Divisors**: all divisors, k smallest divisors, count, sum
- **Factorization**: prime factorization
- **Combinatorics**: factorial precomputation, nCr, nPr
- **Utilities**: bigMod (huge string mod), Summation, permutations`,
    }).returning();
    if (mathUtils) {
      await db.insert(templateCodes).values([{
        templateId: mathUtils.id, language: "cpp", code: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const ll mod = 1e9 + 7, maxA = 2e6 + 5;

// Fast Power
ll fastPower(ll base, ll expo, ll mod) {
    base %= mod; ll res = 1;
    while (expo > 0) {
        if (expo & 1) res = (res * base) % mod;
        base = (base * base) % mod;
        expo >>= 1;
    }
    return res;
}

// Modular Inverse (mod must be prime)
ll invMod(ll x, ll mod) { return fastPower(x, mod - 2, mod); }

// Modular arithmetic helpers
ll add(ll a, ll b) { return ((a % mod) + (b % mod)) % mod; }
ll mul(ll a, ll b) { return ((a % mod) * (b % mod)) % mod; }
ll divide(ll a, ll b) { return mul(a, invMod(b, mod)); }
ll sub(ll a, ll b) { return (((a % mod) - (b % mod)) % mod + mod) % mod; }

// Factorial
ll fact[maxA + 1], invfact[maxA + 1];
void factorial(int mod) {
    fact[0] = 1;
    for (int i = 1; i < maxA; i++) fact[i] = i * fact[i - 1] % mod;
    invfact[maxA - 1] = fastPower(fact[maxA - 1], mod - 2, mod);
    for (int i = maxA - 2; i >= 0; i--)
        invfact[i] = (i + 1) * invfact[i + 1] % mod;
}
ll nCr(ll n, ll r) {
    if (n < r || r < 0) return 0LL;
    return fact[n] * invfact[n - r] % mod * invfact[r] % mod;
}
ll nPr(ll n, ll r) {
    if (n < r || r < 0) return 0LL;
    return fact[n] * invfact[n - r] % mod;
}

// Big Mod (huge string)
ll bigMod(string s, ll mod) {
    ll res = 0;
    for (char c : s) res = (res * 10 + (c - '0')) % mod;
    return res;
}

// Primality
bool isPrime(ll n) {
    if (n < 2 || (n % 2 == 0 && n != 2)) return false;
    for (int i = 3; i * i <= n; i += 2) if (n % i == 0) return false;
    return true;
}

// GCD/LCM
ll GCD(ll a, ll b) { return (b == 0 ? a : GCD(b, a % b)); }
ll LCM(ll a, ll b) { return a / GCD(a, b) * b; }
ll extended_gcd(ll a, ll b, ll &x, ll &y) {
    if (b == 0) { x = 1; y = 0; return a; }
    ll x1, y1, g = extended_gcd(b, a % b, x1, y1);
    x = y1; y = x1 - (a / b) * y1; return g;
}

// Binary GCD (Stein's algorithm)
ll gcd_bin(ll a, ll b) {
    if (!a || !b) return a | b;
    int shift = __builtin_ctz(a | b);
    a >>= __builtin_ctz(a);
    do { b >>= __builtin_ctz(b);
        if (a > b) swap(a, b); b -= a;
    } while (b);
    return a << shift;
}

// Prime factorization
vector<int> primeFactorization(ll n) {
    vector<int> factors;
    while (n % 2 == 0) { factors.push_back(2); n /= 2; }
    for (int i = 3; i * i <= n; i += 2)
        while (n % i == 0) { factors.push_back(i); n /= i; }
    if (n > 2) factors.push_back(n);
    return factors;
}

// Divisors
vector<ll> getDivisors(ll n) {
    vector<ll> divisors;
    for (int i = 1; i * i <= n; i++)
        if (n % i == 0) {
            divisors.push_back(i);
            if (i != n / i) divisors.push_back(n / i);
        }
    return divisors;
}
ll sumOfDivisors(ll n) {
    ll sum = 0;
    for (int i = 1; i * i < n; i++) if (n % i == 0) sum += (n / i) + i;
    ll sq = sqrt(n); return sum + (sq * sq == n ? sq : 0);
}

// Sieve
vector<ll> sieve(ll n) {
    vector<bool> prime(n + 1, true);
    for (ll i = 2; i * i <= n; i++)
        if (prime[i]) for (ll j = i * i; j <= n; j += i) prime[j] = false;
    vector<ll> res;
    for (ll p = 2; p <= n; p++) if (prime[p]) res.push_back(p);
    return res;
}

// Euler's Totient
ll PHI(int n) {
    ll result = n;
    for (ll i = 2; i * i <= n; i++)
        if (n % i == 0) {
            while (n % i == 0) n /= i;
            result -= result / i;
        }
    if (n > 1) result -= result / n;
    return result;
}
vector<int> phi_1_to_n(int n) {
    vector<int> phi(n + 1);
    for (int i = 0; i <= n; i++) phi[i] = i;
    for (int i = 2; i <= n; i++)
        if (phi[i] == i) for (int j = i; j <= n; j += i) phi[j] -= phi[j] / i;
    return phi;
}`
      }]);
    }

    // --- Sieve ---
    const [sieve] = await db.insert(templates).values({
      title: "Sieve of Eratosthenes", slug: "sieve",
      description: "Prime sieve with linear optimization (SPF), phi, mu precomputation",
      categoryId: numberTheoryId,
      tags: ["sieve", "prime", "number-theory", "factorization"],
      complexity: "O(n log log n)",
    }).returning();
    if (sieve) {
      await db.insert(templateCodes).values([{
        templateId: sieve.id, language: "cpp", code: `#include <bits/stdc++.h>
using namespace std;
#define all(vec) vec.begin(), vec.end()
#define rall(vec) vec.rbegin(), vec.rend()
#define sz(x) int(x.size())
#define ll long long
vector < bool > is_prime;
vector < int > prime, spf, phi, mobius;
void sieve(int n){
    is_prime.assign(n + 1, true);
    spf.assign(n + 1, n + 1);
    phi.assign(n + 1, 1);
    mobius.assign(n + 1, 1);
    is_prime[0] = is_prime[1] = false;
    spf[1] = 1; mobius[1] = 1;
    for(int i = 2; i <= n; i++){
        if(is_prime[i]){ prime.push_back(i); spf[i] = i; phi[i] = i - 1; mobius[i] = -1; }
        for(int p : prime){
            if(i * p > n) break;
            is_prime[i * p] = false;
            spf[i * p] = p;
            if(i % p == 0){ phi[i * p] = phi[i] * p; mobius[i * p] = 0; break; }
            phi[i * p] = phi[i] * (p - 1);
            mobius[i * p] = -mobius[i];
        }
    }
}`
      }]);
    }

    // --- Miller-Rabin ---
    const [miller] = await db.insert(templates).values({
      title: "Miller-Rabin Primality Test", slug: "miller-rabin",
      description: "Deterministic Miller-Rabin primality test for 64-bit integers",
      categoryId: numberTheoryId,
      tags: ["primality-test", "miller-rabin", "deterministic", "64-bit"],
      complexity: "O(log n) per test",
    }).returning();
    if (miller) {
      await db.insert(templateCodes).values([{
        templateId: miller.id, language: "cpp", code: `#include <bits/stdc++.h>
using namespace std;
#define all(vec) vec.begin(), vec.end()
#define rall(vec) vec.rbegin(), vec.rend()
#define sz(x) int(x.size())
#define ll long long
ll mul_mod(ll a, ll b, ll m) { return (__int128)a * b % m; }
ll pow_mod(ll a, ll d, ll m) { ll res = 1; a %= m; while(d){ if(d & 1) res = mul_mod(res, a, m); a = mul_mod(a, a, m); d >>= 1; } return res; }
bool isPrime(ll n) {
    if (n < 2) return false;
    ll d = n - 1; int s = 0;
    while (d % 2 == 0) { d /= 2; s++; }
    vector < ll > bases = {2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37};
    for (ll a : bases) {
        if (a >= n) continue;
        ll x = pow_mod(a, d, n);
        if (x == 1 || x == n - 1) continue;
        bool composite = true;
        for (int r = 1; r < s; r++) {
            x = mul_mod(x, x, n);
            if (x == n - 1) { composite = false; break; }
        }
        if (composite) return false;
    }
    return true;
}`
      }]);
    }

    // --- Factorization ---
    const [factors] = await db.insert(templates).values({
      title: "Prime Factorization", slug: "prime-factorization",
      description: "Prime factorization with Pollard's Rho for 64-bit integers",
      categoryId: numberTheoryId,
      tags: ["factorization", "prime-factors", "trial-division"],
      complexity: "O(√n) / O(n^{1/4}) with Pollard Rho",
    }).returning();
    if (factors) {
      await db.insert(templateCodes).values([{
        templateId: factors.id, language: "cpp", code: `#include <bits/stdc++.h>
using namespace std;
#define all(vec) vec.begin(), vec.end()
#define rall(vec) vec.rbegin(), vec.rend()
#define sz(x) int(x.size())
#define ll long long
mt19937_64 rng(chrono::steady_clock::now().time_since_epoch().count());
ll mul_mod(ll a, ll b, ll m) { return (__int128)a * b % m; }
ll pow_mod(ll a, ll d, ll m) { ll res = 1; a %= m; while(d){ if(d & 1) res = mul_mod(res, a, m); a = mul_mod(a, a, m); d >>= 1; } return res; }
bool isPrime(ll n) {
    if (n < 2) return false; ll d = n - 1; int s = 0; while (d % 2 == 0) { d /= 2; s++; }
    for (ll a : {2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37}) {
        if (a >= n) continue; ll x = pow_mod(a, d, n); if (x == 1 || x == n - 1) continue;
        bool composite = true;
        for (int r = 1; r < s; r++) { x = mul_mod(x, x, n); if (x == n - 1) { composite = false; break; } }
        if (composite) return false;
    }
    return true;
}
ll Pollard_Rho(ll n) {
    if (n % 2 == 0) return 2;
    ll x = rng() % (n - 2) + 2, y = x, c = rng() % (n - 1) + 1, d = 1;
    auto f = [&](ll x) { return (mul_mod(x, x, n) + c) % n; };
    while (d == 1) { x = f(x); y = f(f(y)); d = gcd(abs(x - y), n); }
    return d;
}
vector < ll > factorize(ll n) {
    vector < ll > res;
    function < void(ll) > rec = [&](ll n) {
        if (n == 1) return;
        if (isPrime(n)) { res.push_back(n); return; }
        ll d = Pollard_Rho(n); rec(d); rec(n / d);
    };
    rec(n);
    sort(all(res));
    return res;
}`
      }]);
    }

    // --- Matrix Exponentiation ---
    const [matrix] = await db.insert(templates).values({
      title: "Matrix Exponentiation", slug: "matrix-exponentiation",
      description: "Matrix multiplication and binary exponentiation for linear recurrences",
      categoryId: numberTheoryId,
      tags: ["matrix", "exponentiation", "linear-recurrence", "fibonacci"],
      complexity: "O(n³ log k)",
    }).returning();
    if (matrix) {
      await db.insert(templateCodes).values([{
        templateId: matrix.id, language: "cpp", code: `#include <bits/stdc++.h>
using namespace std;
#define all(vec) vec.begin(), vec.end()
#define rall(vec) vec.rbegin(), vec.rend()
#define sz(x) int(x.size())
#define ll long long
const int MOD = 1e9 + 7;
template < typename T = int > struct Matrix_Power {
    int n; vector < vector < T > > mat;
    Matrix_Power(int _n = 0, bool identity = false) : n(_n) {
        mat.assign(n, vector < T >(n, 0));
        if (identity) for(int i = 0; i < n; i++) mat[i][i] = 1;
    }
    Matrix_Power operator * (const Matrix_Power &other) const {
        Matrix_Power res(n);
        for(int i = 0; i < n; i++) for(int k = 0; k < n; k++) if(mat[i][k])
            for(int j = 0; j < n; j++) res.mat[i][j] = (res.mat[i][j] + (ll)mat[i][k] * other.mat[k][j]) % MOD;
        return res;
    }
    Matrix_Power pow(ll exp) {
        Matrix_Power res(n, true), base = *this;
        while(exp > 0) { if(exp & 1) res = res * base; base = base * base; exp >>= 1; }
        return res;
    }
};`
      }]);
    }

    // --- Modular Int ---
    const [modint] = await db.insert(templates).values({
      title: "Modular Integer (ModInt)", slug: "modint",
      description: "Modular arithmetic with operator overloading for safe modular operations",
      categoryId: numberTheoryId,
      tags: ["modint", "modular", "arithmetic", "number-theory"],
      complexity: "O(1) per operation",
    }).returning();
    if (modint) {
      await db.insert(templateCodes).values([{
        templateId: modint.id, language: "cpp", code: `#include <bits/stdc++.h>
using namespace std;
#define all(vec) vec.begin(), vec.end()
#define rall(vec) vec.rbegin(), vec.rend()
#define sz(x) int(x.size())
#define ll long long
template < int MOD = 1000000007 > struct ModInt {
    int val;
    ModInt(ll v = 0) { val = v % MOD; if (val < 0) val += MOD; }
    ModInt operator + (const ModInt& o) const { return ModInt(val + o.val); }
    ModInt operator - (const ModInt& o) const { return ModInt(val - o.val); }
    ModInt operator * (const ModInt& o) const { return ModInt((ll)val * o.val); }
    ModInt operator / (const ModInt& o) const { return *this * o.inv(); }
    ModInt& operator += (const ModInt& o) { val = (val + o.val) % MOD; return *this; }
    ModInt& operator -= (const ModInt& o) { val = (val - o.val + MOD) % MOD; return *this; }
    ModInt& operator *= (const ModInt& o) { val = (ll)val * o.val % MOD; return *this; }
    ModInt pow(ll e) const { ModInt r(1), b(val); while(e) { if(e & 1) r = r * b; b = b * b; e >>= 1; } return r; }
    ModInt inv() const { return pow(MOD - 2); }
    friend ostream& operator << (ostream& os, const ModInt& m) { return os << m.val; }
};`
      }]);
    }
  }
  await seedNumberTheory();

  // =================== RANGE QUERIES ===================
  async function seedRangeQueries() {
    if (!rangeQueriesId) return;

    const [prefSum] = await db.insert(templates).values({
      title: "Prefix Sum (1D)",
      slug: "prefix-sum-1d",
      description: "Static range sum queries in O(1) using prefix sum array",
      categoryId: rangeQueriesId,
      tags: ["prefix-sum", "range-query", "static"],
      complexity: "O(n) build, O(1) per query",
      notes: `# Prefix Sum (1D)

Preprocess array $A[1..n]$ to answer sum queries $A[l..r]$ in $O(1)$.

$\\text{pref}[i] = \\sum_{k=1}^{i} A[k]$

$\\text{sum}(l, r) = \\text{pref}[r] - \\text{pref}[l-1]$

**Problem**: CSES Range Sum Queries (1646)`,
    }).returning();
    if (prefSum) {
      await db.insert(templateCodes).values([{
        templateId: prefSum.id, language: "cpp", code: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;

const int N = 2e5 + 9;
ll pref_sum[N];
int a[N];

int main() {
    int n, q;
    cin >> n >> q;
    for (int i = 1; i <= n; i++) cin >> a[i];
    for (int i = 1; i <= n; i++) pref_sum[i] = pref_sum[i - 1] + a[i];
    while (q--) {
        int l, r;
        cin >> l >> r;
        cout << pref_sum[r] - pref_sum[l - 1] << endl;
    }
}`
      }]);
    }

    const [prefXor] = await db.insert(templates).values({
      title: "Prefix XOR",
      slug: "prefix-xor",
      description: "Static range XOR queries in O(1) using prefix XOR array",
      categoryId: rangeQueriesId,
      tags: ["prefix-xor", "range-query", "xor"],
      complexity: "O(n) build, O(1) per query",
      notes: `# Prefix XOR

Similar to prefix sum but with XOR. $\\text{pref}[i] = \\bigoplus_{k=1}^{i} A[k]$.

$\\text{xor}(l, r) = \\text{pref}[r] \\oplus \\text{pref}[l-1]$

**Problem**: CSES Range XOR Queries (1650)`,
    }).returning();
    if (prefXor) {
      await db.insert(templateCodes).values([{
        templateId: prefXor.id, language: "cpp", code: `#include <bits/stdc++.h>
using namespace std;

const int N = 2e5 + 9;
int pref_xor[N];
int a[N];

int main() {
    int n, q;
    cin >> n >> q;
    for (int i = 1; i <= n; i++) cin >> a[i];
    for (int i = 1; i <= n; i++) pref_xor[i] = pref_xor[i - 1] ^ a[i];
    while (q--) {
        int l, r;
        cin >> l >> r;
        cout << (pref_xor[r] ^ pref_xor[l - 1]) << '\n';
    }
}`
      }]);
    }

    const [pref2d] = await db.insert(templates).values({
      title: "2D Prefix Sum",
      slug: "prefix-sum-2d",
      description: "Static 2D range sum queries in O(1) using inclusion-exclusion",
      categoryId: rangeQueriesId,
      tags: ["prefix-sum", "2d", "range-query", "grid"],
      complexity: "O(n·m) build, O(1) per query",
      notes: `# 2D Prefix Sum

$\\text{pref}[i][j] = A[i][j] + \\text{pref}[i-1][j] + \\text{pref}[i][j-1] - \\text{pref}[i-1][j-1]$

Query $(x1,y1)$ to $(x2,y2)$:

$\\text{sum} = \\text{pref}[x2][y2] - \\text{pref}[x1-1][y2] - \\text{pref}[x2][y1-1] + \\text{pref}[x1-1][y1-1]$`,
    }).returning();
    if (pref2d) {
      await db.insert(templateCodes).values([{
        templateId: pref2d.id, language: "cpp", code: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
typedef vector<ll> vl;
typedef vector<vector<ll>> vvl;

int main() {
    int n, m, q;
    cin >> n >> m >> q;

    vvl arr(n + 1, vl(m + 1, 0));
    vvl prefix(n + 1, vl(m + 1, 0));

    for (int i = 1; i <= n; ++i) {
        for (int j = 1; j <= m; ++j) {
            cin >> arr[i][j];
            prefix[i][j] = arr[i][j] + prefix[i - 1][j]
                         + prefix[i][j - 1] - prefix[i - 1][j - 1];
        }
    }

    while (q--) {
        int x1, y1, x2, y2;
        cin >> x1 >> y1 >> x2 >> y2;
        ll res = prefix[x2][y2] - prefix[x1 - 1][y2]
               - prefix[x2][y1 - 1] + prefix[x1 - 1][y1 - 1];
        cout << res << endl;
    }
}`
      }]);
    }
  }
  await seedRangeQueries();

  // =================== UTILITIES ===================
  async function seedUtilities() {
    if (!utilsId) return;

    const [startTmpl] = await db.insert(templates).values({
      title: "CP Starter Template",
      slug: "cp-starter-template",
      description: "Standard competitive programming starter template with fast I/O",
      categoryId: utilsId,
      tags: ["template", "boilerplate", "fast-io"],
      complexity: "O(1) setup",
      notes: `Standard CP starter template with:
- Fast I/O via ios_base::sync_with_stdio(false)
- Common type aliases (ll = long long)
- Shorthand macros (all, rall)
- Predefined MOD values (998244353, 1e9+7)`,
    }).returning();
    if (startTmpl) {
      await db.insert(templateCodes).values([{
        templateId: startTmpl.id, language: "cpp", code: `#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
#define endl '\\n'
#define all(x) x.begin(), x.end()
#define rall(x) x.rbegin(), x.rend()
const ll MOD = 998244353, mod = 1e9 + 7, maxA = 1e5 + 5;

void fastIO() {
    ios_base::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);
}

void solve() {
    // Enter your solution logic here
}

int main() {
    fastIO();
    solve();
    return 0;
}`
      }]);
    }

    const [int128] = await db.insert(templates).values({
      title: "128-bit Integer I/O",
      slug: "int128-io",
      description: "Read and print __int128 (not supported by cin/cout by default)",
      categoryId: utilsId,
      tags: ["int128", "big-integer", "io"],
      complexity: "O(n) digits",
    }).returning();
    if (int128) {
      await db.insert(templateCodes).values([{
        templateId: int128.id, language: "cpp", code: `#include<bits/stdc++.h>
using namespace std;

__int128 read() {
    __int128 x = 0;
    int f = 1;
    char ch = getchar();
    while (ch < '0' || ch > '9') {
        if (ch == '-') f = -1;
        ch = getchar();
    }
    while (ch >= '0' && ch <= '9') {
        x = x * 10 + ch - '0';
        ch = getchar();
    }
    return x * f;
}

void print(__int128 x) {
    if (x < 0) { putchar('-'); x = -x; }
    if (x > 9) print(x / 10);
    putchar(x % 10 + '0');
}`
      }]);
    }
  }
  await seedUtilities();

  console.log("Seed complete! ");
}

seed().catch(console.error);
