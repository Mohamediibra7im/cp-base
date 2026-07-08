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

$\\binom{n}{k}$ counts ways to choose $k$ from $n$ elements (order irrelevant).

## Formula

$$\\binom{n}{k} = \\frac{n!}{k!(n-k)!}$$

## Properties

- **Pascal's Identity**: $\\binom{n}{k} = \\binom{n-1}{k-1} + \\binom{n-1}{k}$
- **Sum over all k**: $\\sum_{k=0}^{n} \\binom{n}{k} = 2^n$
- **Boundary**: $\\binom{n}{0} = \\binom{n}{n} = 1$

## Modular Computation

For prime $p$, compute $\\binom{n}{k} \\bmod p$ using Fermat's Little Theorem:

$$\\binom{n}{k} \\equiv n! \\cdot (k!)^{-1} \\cdot ((n-k)!)^{-1} \\pmod{p}$$

where $a^{-1} \\equiv a^{p-2} \\pmod{p}$.

## When to Use

- Counting subsets, combinations of items
- Paths on grid: $(0,0)$ to $(n,m)$ is $\\binom{n+m}{n}$
- Intermediate step in inclusion-exclusion or counting formulas

## Complexity

- **Precomputation**: $O(\\text{MAXN})$ for factorials
- **Query**: $O(1)$ per $\\binom{n}{k}$

## Usage

\`\`\`cpp
factorialInit();
long long ans = nCr(n, k);  // $\\binom{n}{k} \\bmod 10^9+7$
long long perm = nPr(n, k); // $P(n,k) = \\frac{n!}{(n-k)!}$
\`\`\``,
  }).returning();
  if (binom) {
    await db.insert(templateCodes).values([{
      templateId: binom.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;

using ll = long long;
const ll MOD = 1e9 + 7;
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

ll modInverse(ll x, ll mod) {
    return power(x, mod - 2, mod);
}

void factorialInit() {
    fact[0] = 1;
    for (int i = 1; i < MAXN; i++)
        fact[i] = i * fact[i - 1] % MOD;
    invfact[MAXN - 1] = modInverse(fact[MAXN - 1], MOD);
    for (int i = MAXN - 2; i >= 0; i--)
        invfact[i] = (i + 1) * invfact[i + 1] % MOD;
}

ll nCr(ll n, ll r) {
    if (n < r || r < 0) return 0;
    return fact[n] * invfact[r] % MOD * invfact[n - r] % MOD;
}

ll nPr(ll n, ll r) {
    if (n < r || r < 0) return 0;
    return fact[n] * invfact[n - r] % MOD;
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
    notes: `# Burnside's Lemma

Counts distinct objects under a group action (e.g., necklace rotations).

## Formula

Let $G$ act on finite set $X$. Number of distinct orbits:

$$|X/G| = \\frac{1}{|G|} \\sum_{g \\in G} |X^g|$$

where $X^g = \\{x \\in X : g \\cdot x = x\\}$ (fixed elements).

## Necklace Application

For $n$ beads with $k$ colors under **rotations**, a rotation by $i$ positions fixes $k^{\\gcd(i,n)}$ colorings:

$$\\text{Necklaces} = \\frac{1}{n} \\sum_{i=1}^{n} k^{\\gcd(i, n)}$$

## When to Use

- Distinct colorings of a necklace under rotation
- "How many distinct objects up to symmetry?"
- Grid/polygon coloring under rotational symmetry

## Complexity

- **Time**: $O(n \\log n)$ for gcd + modular exponentiation
- **Space**: $O(1)$

## Usage

\`\`\`cpp
long long ans = necklaceCount(n, k);  // n beads, k colors, rotations only
\`\`\``,
  }).returning();
  if (burn) {
    await db.insert(templateCodes).values([{
      templateId: burn.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;

using ll = long long;
const ll MOD = 1e9 + 7;

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

ll modInverse(ll x, ll mod) {
    return power(x, mod - 2, mod);
}

ll necklaceCount(ll n, ll k) {
    ll ans = 0;
    for (ll i = 1; i <= n; i++)
        ans = (ans + power(k, __gcd(i, n), MOD)) % MOD;
    return ans * modInverse(n, MOD) % MOD;
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
    complexity: "O(n) formula / O(n^2) DP",
    notes: `# Catalan Numbers

Sequence: 1, 1, 2, 5, 14, 42, 132, 429, 1430, ...

## Formulas

**Closed form**: $C_n = \\frac{1}{n+1}\\binom{2n}{n}$

**Recurrence**: $C_{n+1} = \\sum_{i=0}^{n} C_i \\cdot C_{n-i}$

## When to Use

- Balanced bracket sequences ($n$ pairs of parentheses)
- Binary tree shapes ($n$ nodes)
- Polygon triangulation ($(n+2)$-gon)
- Dyck paths / lattice paths below diagonal
- Any problem matching Catalan sequence 1, 1, 2, 5, 14, 42, ...

## Complexity

- **Formula**: $O(n)$ with precomputed factorials
- **DP**: $O(n^2)$ time, $O(n)$ space

## Usage

\`\`\`cpp
long long c = catalan(n);        // C_n mod MOD via formula
initCatalanDp();
long long c2 = catalanDp[n];     // C_n via DP (small n only)
\`\`\``,
  }).returning();
  if (catalan) {
    await db.insert(templateCodes).values([{
      templateId: catalan.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;

using ll = long long;
const ll MOD = 1e9 + 7;

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

ll modInverse(ll x, ll mod) {
    return power(x, mod - 2, mod);
}

ll catalan(ll n) {
    ll res = 1;
    for (ll i = 0; i < n; i++)
        res = res * (2 * n - i) % MOD * modInverse(i + 1, MOD) % MOD;
    return res * modInverse(n + 1, MOD) % MOD;
}

const int MAXN_CATALAN = 20;
ll catalanDp[MAXN_CATALAN];

void initCatalanDp() {
    catalanDp[0] = catalanDp[1] = 1;
    for (int i = 2; i < MAXN_CATALAN; i++) {
        catalanDp[i] = 0;
        for (int j = 0; j < i; j++)
            catalanDp[i] = (catalanDp[i] + catalanDp[j] * catalanDp[i - j - 1]) % MOD;
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

Corrects over-counting by alternately adding/subtracting intersections.

## Formula

For finite sets $A_1, \\dots, A_n$:

$$\\left|\\bigcup_{i=1}^{n} A_i\\right| = \\sum_{i} |A_i| - \\sum_{i<j} |A_i \\cap A_j| + \\cdots + (-1)^{n+1} |A_1 \\cap \\cdots \\cap A_n|$$

## Bitmask Approach

Count elements satisfying **none** of $n$ properties:

$$|\\overline{A_1} \\cap \\cdots \\cap \\overline{A_n}| = \\sum_{S \\subseteq \\{1,\\dots,n\\}} (-1)^{|S|} |\\bigcap_{i \\in S} A_i|$$

Iterate $2^p$ subsets via bitmask, add/subtract based on parity.

## Applications

- **Coprime counting**: Factor $n$, IE over prime subsets
- **Divisibility**: Count in $[1,n]$ divisible by at least one divisor
- **Derangements**: $D_n = n! \\sum_{k=0}^{n} \\frac{(-1)^k}{k!}$

## When to Use

- "How many from 1 to N NOT divisible by any of these?"
- Small property/prime set ($p \\leq 20$)
- "At least one" or "none" conditions

## Complexity

- **Time**: $O(2^p \\cdot p)$ | **Space**: $O(p)$

## Usage

\`\`\`cpp
int result = coprimeCount(n, r);     // numbers in [1, r] coprime to n
int result2 = divisibleByAny(n, divs); // numbers in [1, n] divisible by any in divs
\`\`\``,
  }).returning();
  if (inclExcl) {
    await db.insert(templateCodes).values([{
      templateId: inclExcl.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;

using ll = long long;

int coprimeCount(int n, int r) {

    vector<int> p;
    for (int i = 2; i * i <= n; ++i) {
        if (n % i == 0) {
            p.push_back(i);
            while (n % i == 0) n /= i;
        }
    }
    if (n > 1) p.push_back(n);

    int sum = 0;
    for (int msk = 1; msk < (1 << (int)p.size()); ++msk) {
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

int divisibleByAny(int n, vector<int> &a) {
    int m = (int)a.size();
    int sum = 0;
    for (int mask = 1; mask < (1 << m); mask++) {
        ll lcmVal = 1;
        int bits = 0;
        bool overflow = false;
        for (int i = 0; i < m; i++) {
            if (mask & (1 << i)) {
                bits++;

                ll g = __gcd(lcmVal, (ll)a[i]);
                lcmVal = lcmVal / g * a[i];

                if (lcmVal > n) {
                    overflow = true;
                    break;
                }
            }
        }
        if (overflow) continue;
        if (bits % 2 == 1) sum += (int)(n / lcmVal);
        else sum -= (int)(n / lcmVal);
    }
    return sum;
}`)
    }]);
  }
}
