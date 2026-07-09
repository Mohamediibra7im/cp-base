import { sql } from "drizzle-orm";
import { templates, templateCodes } from "../schema";
import { stripMain, type Db, type CatMap } from "./helpers";

export async function seedNumberTheory(db: Db, catMap: CatMap) {
  const categoryId = catMap["number-theory"];
  if (!categoryId) return;

  // --- Sieve of Eratosthenes ---
  const [sieve] = await db.insert(templates).values({
    title: "Sieve of Eratosthenes",
    slug: "sieve",
    description:
      "Linear sieve computing primes, smallest prime factor (SPF), Euler's totient (φ), and Möbius function (μ)",
    categoryId,
    tags: ["sieve", "prime", "number-theory", "factorization"],
    complexity: "$O(n)$",
    notes: `# Sieve of Eratosthenes

A **linear-time** sieve computing primes, smallest prime factor (SPF), Euler's totient ($\varphi$), and Möbius function ($\mu$) up to $n$.

## Algorithm

The **linear sieve** achieves $O(n)$ by ensuring every composite is crossed off exactly once. For each $i$, iterate over known primes $p$, mark $i \cdot p$ composite, and **break** when $p \\mid i$ — this prevents double-counting since composites with a smaller prime factor will be reached later.

The classic sieve marks composites in $O(n \log \log n)$; the linear variant adds $\varphi$ and $\mu$ computation at no extra asymptotic cost.

## When to Use

- **Precompute factorizations** — Use SPF to factor any number $\leq n$ in $O(\log n)$.
- **Totient/Möbius queries** — Compute $\varphi$ and $\mu$ for all numbers up to $n$ in one pass.
- **Prime counting** — List of primes enables $\pi(n)$ lookups.

## Complexity

- **Time:** $O(n)$ — each composite visited exactly once.
- **Memory:** $O(n)$ for the auxiliary arrays.`,
  }).returning();

  if (sieve) {
    await db.insert(templateCodes).values([
      {
        templateId: sieve.id,
        language: "cpp",
        code: stripMain(`#include <bits/stdc++.h>
using ll = long long;
using namespace std;

vector<bool> isPrime;
vector<int> prime, spf, phi, mobius;

void sieveOfEratosthenes(int n) {
    isPrime.assign(n + 1, true);
    spf.assign(n + 1, n + 1);
    phi.assign(n + 1, 1);
    mobius.assign(n + 1, 1);
    isPrime[0] = isPrime[1] = false;
    spf[1] = 1;
    mobius[1] = 1;

    for (int i = 2; i <= n; i++) {
        if (isPrime[i]) {
            prime.push_back(i);
            spf[i] = i;
            phi[i] = i - 1;
            mobius[i] = -1;
        }
        for (int p : prime) {
            if (i * p > n) break;
            isPrime[i * p] = false;
            spf[i * p] = p;
            if (i % p == 0) {
                phi[i * p] = phi[i] * p;
                mobius[i * p] = 0;
                break;
            }
            phi[i * p] = phi[i] * (p - 1);
            mobius[i * p] = -mobius[i];
        }
    }
}`),
      },
    ]);
  }

  const [miller] = await db.insert(templates).values({
    title: "Miller-Rabin Primality Test",
    slug: "miller-rabin",
    description:
      "Deterministic Miller-Rabin primality test for 64-bit integers using verified witness sets",
    categoryId,
    tags: ["primality-test", "miller-rabin", "deterministic", "64-bit"],
    complexity: "$O(k log n)$ per test, k = 12",
    notes: `# Miller-Rabin Primality Test

A **probabilistic** primality test that becomes **deterministic** for bounded ranges by choosing the right witness bases.

## Algorithm

Factor $n - 1 = d \cdot 2^s$, then test each base $a$:
- Compute $x = a^d \bmod n$.
- If $x = 1$ or $x = n-1$, pass. Otherwise square up to $s-1$ times looking for $n-1$.
- If neither found, $n$ is composite.

### Deterministic Witnesses

For $n < 2^{64}$, the 12 bases $\\{2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37\\}$ are sufficient — verified by Jim Sinclair (2011). Smaller ranges need fewer bases (e.g., $n < 2047$: just $\\{2\\}$).

## When to Use

- **Primality testing** — Check if a single 64-bit integer is prime.
- **Preprocessing for factorization** — Called before Pollard's Rho to verify factors.
- **Generating large primes** — Random search with primality verification.

## Complexity

- **Time:** $O(k \log n)$ where $k$ is the number of bases (12 for 64-bit).
- **Memory:** $O(1)$.`,
  }).returning();

  if (miller) {
    await db.insert(templateCodes).values([
      {
        templateId: miller.id,
        language: "cpp",
        code: stripMain(`#include <bits/stdc++.h>
using ll = long long;
using namespace std;

ll mulMod(ll a, ll b, ll m) {
    return (__int128)a * b % m;
}

ll powMod(ll a, ll d, ll m) {
    ll res = 1;
    a %= m;
    while (d) {
        if (d & 1) res = mulMod(res, a, m);
        a = mulMod(a, a, m);
        d >>= 1;
    }
    return res;
}

bool millerRabin(ll n) {
    if (n < 2) return false;
    ll d = n - 1;
    int s = 0;
    while (d % 2 == 0) { d /= 2; s++; }
    for (ll a : {2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37}) {
        if (a >= n) continue;
        ll x = powMod(a, d, n);
        if (x == 1 || x == n - 1) continue;
        bool composite = true;
        for (int r = 1; r < s; r++) {
            x = mulMod(x, x, n);
            if (x == n - 1) { composite = false; break; }
        }
        if (composite) return false;
    }
    return true;
}`),
      },
    ]);
  }

  const [pollard] = await db.insert(templates).values({
    title: "Pollard's Rho Factorization",
    slug: "pollard-rho",
    description:
      "Factorize 64-bit integers into primes using Pollard's Rho with Miller-Rabin",
    categoryId,
    tags: [
      "factorization",
      "pollard-rho",
      "number-theory",
      "prime-factors",
    ],
    complexity: "$O(n^{1/4})$ expected per factor",
    notes: `# Pollard's Rho Factorization

Factorize a 64-bit integer using trial division, Miller-Rabin, and Pollard's Rho.

## Algorithm

### Birthday Paradox Intuition

Evaluate a pseudo-random function $f(x) = (x^2 + c) \bmod n$ repeatedly. With probability ~50% in $O(\sqrt{p})$ steps (where $p$ is the smallest prime factor), two values $x_i, x_j$ will satisfy $\\gcd(|x_i - x_j|, n) > 1$, yielding a non-trivial factor.

### Floyd's Cycle Detection

Use **tortoise-and-hare** to find collisions without storing all values:
- **Tortoise** $x$: one step per iteration.
- **Hare** $y$: two steps per iteration.
- Compute $d = \\gcd(|x - y|, n)$ at each step. If $1 < d < n$, found a factor.

If the algorithm fails with one random constant $c$, retry with a new $c$.

## When to Use

- **Factoring large numbers** — Any number up to $2^{64}$ that can't be trial-divided.
- **RSA challenges** — Finding factors of semiprimes $n = p \cdot q$.
- **Number theory problems** — GCD-based factorization, counting divisors, totient computation.

## Complexity

- **Pollard's Rho:** $O(n^{1/4})$ expected per factor.
- **Trial division:** $O(\sqrt[3]{n})$ for small primes.`,
  }).returning();

  if (pollard) {
    await db.insert(templateCodes).values([
      {
        templateId: pollard.id,
        language: "cpp",
        code: stripMain(`#include <bits/stdc++.h>
using ll = long long;
using namespace std;

mt19937_64 rng(chrono::steady_clock::now().time_since_epoch().count());

ll mulMod(ll a, ll b, ll m) { return (__int128)a * b % m; }

ll powMod(ll a, ll d, ll m) {
    ll res = 1;
    a %= m;
    while (d) {
        if (d & 1) res = mulMod(res, a, m);
        a = mulMod(a, a, m);
        d >>= 1;
    }
    return res;
}

bool millerRabin(ll n) {
    if (n < 2) return false;
    ll d = n - 1;
    int s = 0;
    while (d % 2 == 0) { d /= 2; s++; }
    for (ll a : {2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37}) {
        if (a >= n) continue;
        ll x = powMod(a, d, n);
        if (x == 1 || x == n - 1) continue;
        bool composite = true;
        for (int r = 1; r < s; r++) {
            x = mulMod(x, x, n);
            if (x == n - 1) { composite = false; break; }
        }
        if (composite) return false;
    }
    return true;
}

ll pollardRho(ll n) {
    if (n % 2 == 0) return 2;
    ll x = rng() % (n - 2) + 2;
    ll y = x;
    ll c = rng() % (n - 1) + 1;
    ll d = 1;
    auto f = [&](ll x) { return (mulMod(x, x, n) + c) % n; };
    while (d == 1) {
        x = f(x);
        y = f(f(y));
        d = std::gcd(abs(x - y), n);
    }
    return d;
}

vector<ll> pollardRhoFactorize(ll n) {
    vector<ll> factors;
    function<void(ll)> rec = [&](ll n) {
        if (n == 1) return;
        if (millerRabin(n)) { factors.push_back(n); return; }
        ll d = pollardRho(n);
        rec(d);
        rec(n / d);
    };
    rec(n);
    sort(factors.begin(), factors.end());
    return factors;
}`),
      },
    ]);
  }

  const [matrix] = await db.insert(templates).values({
    title: "Matrix Exponentiation",
    slug: "matrix-exponentiation",
    description:
      "Binary exponentiation on square matrices for solving linear recurrences in O(n^3 log k)",
    categoryId,
    tags: ["matrix", "exponentiation", "linear-recurrence", "fibonacci"],
    complexity: "$O(n^3 log k)$",
    notes: `# Matrix Exponentiation

Compute $M^k$ for a square matrix $M$ of size $n \times n$ using **binary exponentiation** in $O(n^3 \log k)$ time.

## Recurrence-to-Matrix Conversion

Given a linear recurrence $a_n = c_1 a_{n-1} + \cdots + c_k a_{n-k}$, define the state vector $\mathbf{v}_n = [a_n, \\ldots, a_{n-k+1}]^T$ and transition matrix $A$:

$$\mathbf{v}_n = A^n \cdot \mathbf{v}_0$$

**Matrix construction:** First row = coefficients. Sub-diagonal shifts previous values down.

**Binary exponentiation:** Decompose $k$ in binary, square $M$ repeatedly, multiply when bit is 1. Reduces $O(k)$ multiplications to $O(\log k)$.

## When to Use

- **Fibonacci / Lucas numbers** — Compute $F_n \bmod m$ for $n$ up to $10^{18}$.
- **Linear recurrences** — Any order-$k$ recurrence with $k$ fixed.
- **Path counting** — $A^k$ gives walks of length $k$ in an adjacency matrix.
- **Competition problems** — When the answer follows a recurrence and $n$ is too large for DP.

## Complexity

- **Time:** $O(n^3 \log k)$ — $\log k$ matrix multiplications, each $O(n^3)$.
- **Memory:** $O(n^2)$.`,
  }).returning();

  if (matrix) {
    await db.insert(templateCodes).values([
      {
        templateId: matrix.id,
        language: "cpp",
        code: stripMain(`#include <bits/stdc++.h>
using ll = long long;
using namespace std;

const ll MOD = 1e9 + 7;

template <typename T = int>
struct MatrixExponentiation {
    int n;
    vector<vector<T>> mat;

    MatrixExponentiation(int _n = 0, bool identity = false)
        : n(_n), mat(_n, vector<T>(_n, 0)) {
        if (identity) for (int i = 0; i < n; i++) mat[i][i] = 1;
    }

    MatrixExponentiation operator*(const MatrixExponentiation& other) const {
        MatrixExponentiation res(n);
        for (int i = 0; i < n; i++)
            for (int k = 0; k < n; k++)
                if (mat[i][k])
                    for (int j = 0; j < n; j++)
                        res.mat[i][j] = (res.mat[i][j] + (ll)mat[i][k] * other.mat[k][j]) % MOD;
        return res;
    }

    MatrixExponentiation pow(ll exp) {
        MatrixExponentiation res(n, true);
        MatrixExponentiation base = *this;
        while (exp > 0) {
            if (exp & 1) res = res * base;
            base = base * base;
            exp >>= 1;
        }
        return res;
    }
};`),
      },
    ]);
  }

  const [modint] = await db.insert(templates).values({
    title: "Modular Integer (ModInt)",
    slug: "modint",
    description:
      "Type-safe modular arithmetic with operator overloading for clean competitive programming",
    categoryId,
    tags: ["modint", "modular", "arithmetic", "number-theory"],
    complexity: "$O(1)$ per operation",
    notes: `# Modular Integer (ModInt)

A **wrapper type** for modular arithmetic that automatically applies $\bmod \text{MOD}$ after every operation. This eliminates a common source of bugs in competitive programming: forgetting to reduce modulo at intermediate steps.

## Design Philosophy

### Why operator overloading?

In CP, problems frequently require computing expressions like:

$$\binom{n}{k} \cdot k! \cdot a^{n-k} \pmod{\text{MOD}}$$

Without ModInt, this requires writing $\\% \text{MOD}$ after every multiplication, addition, and division — error-prone and verbose. ModInt makes the code read like textbook math:

\`\`\`cpp
using Mint = ModInt<1000000007>;
Mint ans = C(n, k) * fact[k] * pow(a, n - k);
\`\`\`

### Template parameter

The modulus is a **template parameter** (default $10^9 + 7$), so different moduli produce different types. This prevents accidentally mixing values with different moduli at compile time.

### Modular inverse via Fermat's Little Theorem

Division $a / b \pmod{p}$ (where $p$ is prime) is implemented as $a \cdot b^{p-2} \pmod{p}$, since Fermat's Little Theorem gives $b^{p-1} \equiv 1 \pmod{p}$, hence $b^{-1} \equiv b^{p-2}$.

**Important:** \`inv()\` requires MOD to be prime. For composite moduli, use the extended Euclidean algorithm instead.

### Value normalization

The constructor normalizes $v$ to $[0, \text{MOD}-1]$:
- $v \bmod \text{MOD}$ if $v \geq 0$
- $v \bmod \text{MOD} + \text{MOD}$ if $v < 0$

This handles negative intermediates from subtraction.

## When to Use

- **Combinatorics** — Binomial coefficients, Catalan numbers, derangements.
- **DP with large answers** — When the answer must be $\bmod p$.
- **Counting problems** — Any problem where intermediate values overflow 64-bit.
- **Clean code** — Reduces modulo noise; makes formulas readable.

### When NOT to use

- **Small values** — If all values fit in 64-bit, plain arithmetic is faster.
- **Non-prime moduli** — \`inv()\` requires a prime modulus. Use extended GCD for composite moduli.
- **Performance-critical inner loops** — The function call overhead of \`pow(MOD-2)\` may matter in tight loops.

## Edge Cases

| Case | Behavior |
|------|----------|
| Negative input | Normalized to $[0, \text{MOD}-1]$ |
| Division by zero | Undefined behavior (no check) |
| \`pow(0)\` | Returns 1 ($a^0 = 1$ by convention) |
| \`inv()\` on 0 | Undefined (would need $0^{-1}$) |

## Complexity

- **Addition/Subtraction/Multiplication:** $O(1)$
- **Division (via \`inv()\`):** $O(\log \text{MOD})$ using binary exponentiation
- **\`pow(e)\`:** $O(\log e)$`,
  }).returning();

  if (modint) {
    await db.insert(templateCodes).values([
      {
        templateId: modint.id,
        language: "cpp",
        code: stripMain(`#include <bits/stdc++.h>
using ll = long long;
using namespace std;

/**
 * @brief Type-safe modular arithmetic wrapper with operator overloading.
 * @tparam MOD The prime modulus (default $10^9 + 7$)
 *
 * Automatically reduces values to $[0, \text{MOD}-1]$.
 * Division uses Fermat's Little Theorem: $a/b = a \cdot b^{\text{MOD}-2}$.
 *
 * Usage:
 *   using Mint = ModInt<998244353>;
 *   Mint a = 5, b = 3;
 *   Mint c = a * b + a / b;  // clean modular expressions
 */
template <int MOD = 1000000007>
struct ModInt {
    int val;

    /** @brief Construct from ll, normalized to $[0, \text{MOD}-1]$. */
    ModInt(ll v = 0) {
        val = v % MOD;
        if (val < 0) val += MOD;
    }

    ModInt operator+(const ModInt& o) const { return ModInt(val + o.val); }
    ModInt operator-(const ModInt& o) const { return ModInt(val - o.val); }
    ModInt operator*(const ModInt& o) const { return ModInt((ll)val * o.val); }
    ModInt operator/(const ModInt& o) const { return *this * o.inv(); }

    ModInt& operator+=(const ModInt& o) { val = (val + o.val) % MOD; return *this; }
    ModInt& operator-=(const ModInt& o) { val = (val - o.val + MOD) % MOD; return *this; }
    ModInt& operator*=(const ModInt& o) { val = (ll)val * o.val % MOD; return *this; }

    /** @brief Compute $\text{this}^e$ via binary exponentiation. $O(\log e)$ */
    ModInt pow(ll e) const {
        ModInt res(1), b(val);
        while (e) {
            if (e & 1) res = res * b;
            b = b * b;
            e >>= 1;
        }
        return res;
    }

    /** @brief Modular inverse via Fermat's Little Theorem: $a^{-1} = a^{\text{MOD}-2}$. */
    ModInt inv() const { return pow(MOD - 2); }

    friend ostream& operator<<(ostream& os, const ModInt& m) { return os << m.val; }
};`),
      },
    ]);
  }
}
