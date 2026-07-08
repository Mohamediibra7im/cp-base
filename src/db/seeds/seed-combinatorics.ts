import { templates, templateCodes } from "../schema";
import { stripMain, type Db, type CatMap } from "./helpers";

export async function seedCombinatorics(db: Db, catMap: CatMap) {
  const categoryId = catMap["combinatorics"];
  if (!categoryId) return;

  // =================== BINOMIAL COEFFICIENTS ===================
  const [binom] = await db.insert(templates).values({
    title: "Binomial Coefficients",
    slug: "binomial-coefficients",
    description: "nCr and nPr with factorial precomputation (mod 1e9+7)",
    categoryId: categoryId,
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
      templateId: binom.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
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
}`)
    }]);
  }

  // =================== BURNSIDE'S LEMMA ===================
  const [burn] = await db.insert(templates).values({
    title: "Burnside's Lemma",
    slug: "burnsides-lemma",
    description: "Count distinct necklaces/colorings under symmetry (rotations)",
    categoryId: categoryId,
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
      templateId: burn.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
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
}`)
    }]);
  }

  // =================== CATALAN NUMBERS ===================
  const [catalan] = await db.insert(templates).values({
    title: "Catalan Numbers",
    slug: "catalan-numbers",
    description: "Catalan numbers via formula and DP (mod 1e9+7)",
    categoryId: categoryId,
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
      templateId: catalan.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
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
}`)
    }]);
  }

  // =================== INCLUSION-EXCLUSION ===================
  const [inclExcl] = await db.insert(templates).values({
    title: "Inclusion-Exclusion Principle",
    slug: "inclusion-exclusion",
    description: "Count coprime numbers and divisibility using inclusion-exclusion over bitmasks",
    categoryId: categoryId,
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
      templateId: inclExcl.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
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
}`)
    }]);
  }
}
