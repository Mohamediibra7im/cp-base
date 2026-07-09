import { sql } from "drizzle-orm";
import { templates, templateCodes } from "../schema";
import { stripMain, type Db, type CatMap } from "./helpers";

export async function seedAlgebra(db: Db, catMap: CatMap) {
  const categoryId = catMap["algebra"];
  if (!categoryId) return;

  const [binExp] = await db.insert(templates).values({
    title: "Binary Exponentiation",
    slug: "binary-exponentiation",
    description: "Fast exponentiation using binary representation in O(log n) multiplications",
    categoryId: categoryId,
    tags: ["exponentiation", "modular-arithmetic", "log-n"],
    complexity: "$O(log n)$",
    notes: `# Binary Exponentiation

Compute $a^n$ in $O(\log n)$ multiplications by exploiting binary representation of $n$.

## Algorithm

Decompose $n = \sum b_i \cdot 2^i$. Then $a^n = \prod_{b_i=1} a^{2^i}$. Repeatedly square the base; multiply into result when the current bit is set.

**Iterative**: Start with $\text{result}=1$. While $n>0$: if $n\\ \\&\\ 1$, multiply result by base. Square base, right-shift $n$. For modular variant, reduce mod $m$ after each multiplication.

## When to Use

- **Modular exponentiation**: $a^n \bmod m$ for large $n$
- **Matrix exponentiation**: $A^n$ for Fibonacci, linear recurrences
- **Permutation exponentiation**: Apply a permutation $k$ times
- **Graph problems**: Walks of length $k$ via adjacency matrix powers

## Complexity

- **Time**: $O(\log n)$ multiplications
- **Space**: $O(1)$ iterative, $O(\log n)$ recursive`,
  }).returning();
  if (binExp) {
    await db.insert(templateCodes).values([{
      templateId: binExp.id, language: "cpp", code: `#include <bits/stdc++.h>
using namespace std;
using ll = long long;

ll binaryExponentiation(ll a, ll b) {
    ll res = 1;
    while (b > 0) {
        if (b & 1) res = res * a;
        a = a * a;
        b >>= 1;
    }
    return res;
}

ll binaryExponentiation(ll a, ll b, ll m) {
    if (m == 1) return 0;
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
    description: "Modular multiplicative inverse via Fermat's little theorem, extended Euclidean, and linear precomputation",
    categoryId: categoryId,
    tags: ["modular-arithmetic", "inverse", "extended-gcd"],
    complexity: "$O(log m)$ per query / $O(n)$ precompute",
    notes: `# Modular Multiplicative Inverse

Find $x$ such that $a \cdot x \equiv 1 \pmod{m}$. Exists iff $\\gcd(a, m) = 1$.

## Methods

1. **Fermat's Little Theorem** (prime $m$): $a^{-1} \equiv a^{m-2} \pmod{m}$ via binary exponentiation. $O(\log m)$.
2. **Extended Euclidean** (any $m$): Find $x$ in $ax + my = \\gcd(a,m)$. Normalize: $x = (x \bmod m + m) \bmod m$. $O(\log m)$.
3. **Recursive Euclidean** (prime $m$): $\text{inv}(a) = m - \lfloor m/a \rfloor \cdot \text{inv}(m \bmod a) \bmod m$. $O(\log m)$ amortized.
4. **Linear Precomputation** (prime $m$): Compute $\text{inv}[1..n]$ in $O(n)$ via $\text{inv}[i] = m - \lfloor m/i \rfloor \cdot \text{inv}[m \bmod i] \bmod m$. Then $O(1)$ per query.

## When to Use

- **Combinatorics mod prime**: $\binom{n}{r} \bmod p$ needs modular inverse for factorials
- **Division under modulus**: Replace $a/b \bmod m$ with $a \cdot b^{-1} \bmod m$
- **Batch queries**: Linear precomputation for $\text{inv}[1..n]$

**See also**: ModInt struct in Number Theory for operator-overloaded version.

## Complexity

| Method | Precompute | Per Query |
|--------|-----------|-----------|
| Fermat's Little Theorem | $O(1)$ | $O(\log m)$ |
| Extended Euclidean | $O(1)$ | $O(\log m)$ |
| Recursive Euclidean | $O(1)$ | $O(\log m)$ |
| Linear Precomputation | $O(n)$ | $O(1)$ |`,
  }).returning();
  if (modInv) {
    await db.insert(templateCodes).values([{
      templateId: modInv.id, language: "cpp", code: `#include <bits/stdc++.h>
using namespace std;
using ll = long long;

ll extendedGcd(ll a, ll b, ll& x, ll& y) {
    if (b == 0) { x = 1; y = 0; return a; }
    ll x1, y1;
    ll g = extendedGcd(b, a % b, x1, y1);
    x = y1;
    y = x1 - (a / b) * y1;
    return g;
}

ll invFermat(ll a, ll mod) {
    ll res = 1;
    ll exp = mod - 2;
    while (exp > 0) {
        if (exp & 1) res = res * a % mod;
        a = a * a % mod;
        exp >>= 1;
    }
    return res;
}

ll invExtended(ll a, ll m) {
    ll x, y;
    ll g = extendedGcd(a, m, x, y);
    if (g != 1) return -1;
    return (x % m + m) % m;
}

vector<ll> invPrecompute(ll n, ll mod) {
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
    categoryId: categoryId,
    tags: ["primitive-root", "generator", "modular-arithmetic", "number-theory"],
    complexity: "$O(p^{1/2} \log^2 p)$",
    notes: `# Primitive Root

A **primitive root** modulo $n$ is $g$ generating the full multiplicative group $(\mathbb{Z}/n\mathbb{Z})^*$, i.e., $\text{ord}_n(g) = \phi(n)$.

## Existence

Primitive root exists iff $n \in \\{1, 2, 4, p^k, 2p^k\\}$ for odd prime $p$, $k \geq 1$. **Every prime** $p$ has one.

## Algorithm (prime $p$)

1. Compute $\phi(p) = p-1$ and factor into distinct primes $q_1, \dots, q_s$.
2. For each $g \in [2, p-1]$: check $g^{\phi(p)/q_i} \\not\equiv 1 \pmod{p}$ for all $q_i$.
3. First $g$ passing all checks is a primitive root.

## When to Use

- **Discrete logarithm**: Baby-Step Giant-Step requires primitive roots
- **NTT**: Need primitive $n$-th root of unity mod $p$
- **Generating all residues**: $g^0, \dots, g^{p-2}$ gives all of $(\mathbb{Z}/p\mathbb{Z})^*$
- **Cryptography**: Diffie-Hellman key exchange

## Complexity

- **Time**: $O(\sqrt{p})$ factoring $\phi(p)$, $O(s \log p)$ per candidate, $O(\log \log p)$ candidates expected
- **Space**: $O(\sqrt{p})$ for prime factors`,
  }).returning();
  if (primRoot) {
    await db.insert(templateCodes).values([{
      templateId: primRoot.id, language: "cpp", code: `#include <bits/stdc++.h>
using namespace std;
using ll = long long;

ll powerMod(ll a, ll b, ll p) {
    ll res = 1;
    while (b > 0) {
        if (b & 1) res = (ll)res * a % p;
        a = (ll)a * a % p;
        b >>= 1;
    }
    return res;
}

ll primitiveRoot(ll p) {
    vector<ll> primeFactors;
    ll phi = p - 1, n = phi;

    for (ll i = 2; i * i <= n; ++i) {
        if (n % i == 0) {
            primeFactors.push_back(i);
            while (n % i == 0) n /= i;
        }
    }
    if (n > 1) primeFactors.push_back(n);

    for (ll g = 2; g <= p; ++g) {
        bool ok = true;
        for (size_t i = 0; i < primeFactors.size() && ok; ++i)
            ok &= powerMod(g, phi / primeFactors[i], p) != 1;
        if (ok) return g;
    }
    return -1;
}`
    }]);
  }

  // =================== MATH UTILITIES ===================
  const [mathUtil] = await db.insert(templates).values({
    title: "Math Utilities",
    slug: "math-utilities",
    description: "Comprehensive math toolkit: GCD, LCM, prime factorization, divisors, totient, combinatorics, base conversion, and more",
    categoryId: categoryId,
    tags: ["math", "gcd", "lcm", "factorization", "divisors", "totient"],
    complexity: "$O(\sqrt{n})$ for factorization, $O(\log n)$ for gcd/pow",
    notes: `# Math Utilities

Catch-all struct with common CP math operations: GCD, LCM, prime factorization, nCr precomputation, Euler totient, Mobius function, collinearity checks.

## When to Use

- General-purpose math when you need multiple utilities in one struct
- Quick factorization / divisor enumeration
- nCr with precomputed factorials ($O(1)$ after $O(MAXN)$ setup)

## Complexity

- Factorization: O(\sqrt{n})
- Precomputed values: $O(1)$ lookup after $O(MAXN)$ init
- Divisor enumeration: $O(\sqrt{n})$

## Contents

- **Basic**: GCD, LCM
- **Primality**: trial-division isPrime, primeFactorization, totient ($\phi$)
- **Divisors**: all divisors, count ($\tau$), sum ($\sigma$)
- **Combinatorics**: nCr, nPr (exact, no modulus)
- **Modular**: binaryExponentiation, binaryMul (overflow-safe), addMod, mulMod, bigMod
- **Number Theory**: factorialPrimePowers, extendedGcd, solveLinear
- **Base Conversion**: decimalToBase, baseToDecimal
- **Misc**: summation, countMultiples, distance, isPerfectSquare, isCollinear

## When to Use

- **General-purpose math** in CP when you need multiple utilities in one struct
- Quick prototyping when you need basic number theory fast
- Problems combining multiple math ops (factorization + totient, etc.)
- When a problem requires GCD + LCM + factorization + modular arithmetic in the same solution

**See dedicated templates for**: Sieve, Modular Inverse, Binary Exponentiation.

## Complexity

| Operation | Complexity |
|-----------|------------|
| Factorization / divisors / totient | $O(\sqrt{n})$ |
| GCD / modular pow | $O(\log n)$ |
| nCr / nPr | $O(\min(r, n-r))$ |
| Base conversion | $O(\log_{\text{base}} n)$ |
| isCollinear / distance | $O(1)$ |`,
  }).returning();
  if (mathUtil) {
    await db.insert(templateCodes).values([{
      templateId: mathUtil.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;
using ll = long long;
#define all(vec) vec.begin(), vec.end()
#define sz(x) int(x.size())

struct Math {

    Math() {}

    ll GCD(ll a, ll b) {
        return (!b ? a : GCD(b, a % b));
    }

    ll LCM(ll a, ll b) {
        return a / GCD(a, b) * b;
    }

    vector<int> primeFactorization(ll n) {
        vector<int> factors;
        while (n % 2 == 0) factors.push_back(2), n /= 2;
        for (int i = 3; i <= sqrt(n); i += 2)
            while (n % i == 0) factors.push_back(i), n /= i;
        if (n > 2) factors.push_back(n);
        return factors;
    }

    bool isPrime(ll n) {
        if (n < 2 || (n % 2 == 0 && n != 2)) return false;
        for (int i = 3; i <= sqrt(n); i += 2)
            if (n % i == 0) return false;
        return true;
    }

    ll totient(ll n) {
        ll result = n;
        for (ll i = 2; i * i <= n; i++) {
            if (n % i == 0) {
                while (n % i == 0) n /= i;
                result -= result / i;
            }
        }
        if (n > 1) result -= result / n;
        return result;
    }

    vector<ll> divisors(ll n) {
        vector<ll> divs;
        for (int i = 1; i < sqrt(n); i++)
            if (n % i == 0) divs.push_back(i), divs.push_back(n / i);
        if (sqrt(n) == int(sqrt(n))) divs.push_back(sqrt(n));
        return divs;
    }

    int countDivisors(ll n) {
        int cnt = 0;
        for (int i = 1; i < sqrt(n); i++)
            if (n % i == 0) cnt += 2;
        return cnt + (sqrt(n) == (int)sqrt(n));
    }

    ll sumDivisors(ll n) {
        ll sum = 0;
        for (int i = 1; i < sqrt(n); i++)
            if (n % i == 0) sum += ((n / i) + i);
        ll sq = sqrt(n);
        return sum + (sq * sq == n ? sq : 0);
    }

    ll nCr(ll n, ll r) {
        if (r > n) return 0;
        ll p = 1, k = 1;
        if (n - r < r) r = n - r;
        if (n < 1) return 0;
        while (r > 0) {
            p *= n, k *= r;
            ll m = GCD(p, k);
            p /= m, k /= m, n--, r--;
        }
        return p;
    }

    ll nPr(ll n, ll r) {
        if (r > n) return 0;
        ll result = 1;
        while (r-- > 0) result *= n--;
        return result;
    }

    ll bigMod(string s, ll mod) {
        ll res = 0;
        for (auto& c : s)
            res = (res * 10 + (c - '0')) % mod;
        return res;
    }

    void add(ll& a, ll b, ll mod = 1e9 + 7) {
        a += b;
        if (a >= mod) a -= mod;
    }

    void mul(ll& a, ll b, ll mod = 1e9 + 7) {
        a = ((a % mod) * (b % mod)) % mod;
    }

    ll binaryExponentiation(ll b, ll e) {
        ll power = 1;
        while (e) {
            if (e & 1) power *= b;
            e >>= 1;
            b *= b;
        }
        return power;
    }

    ll binaryExponentiation(ll b, ll e, ll mod) {
        if (mod == 1) return 0;
        ll power = 1;
        while (e) {
            if (e & 1) mul(power, b, mod);
            e >>= 1;
            mul(b, b, mod);
        }
        return power % mod;
    }

    ll binaryMul(ll b, ll e, ll mod) {
        b %= mod;
        ll mult = 0;
        while (e) {
            if (e & 1) add(mult, b, mod);
            e >>= 1;
            add(b, b, mod);
        }
        return mult % mod;
    }

    ll factorialPrimePowers(ll n, ll p) {
        ll powers = 0;
        for (ll i = p; i <= n; i *= p)
            powers += n / i;
        return powers;
    }

    int extendedGcd(int a, int b, int& x, int& y) {
        if (b == 0) { x = 1; y = 0; return a; }
        int x1, y1;
        int d = extendedGcd(b, a % b, x1, y1);
        x = y1;
        y = x1 - y1 * (a / b);
        return d;
    }

    bool solveLinear(int a, int b, int c, int& x0, int& y0, int& g) {
        g = extendedGcd(abs(a), abs(b), x0, y0);
        if (c % g) return false;
        x0 *= c / g;
        y0 *= c / g;
        if (a < 0) x0 = -x0;
        if (b < 0) y0 = -y0;
        return true;
    }

    string decimalToBase(ll decimal, ll base) {
        if (decimal == 0) return "0";
        string num = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        string result;
        do {
            result.push_back(num[decimal % base]);
            decimal /= base;
        } while (decimal != 0);
        return string(result.rbegin(), result.rend());
    }

    ll baseToDecimal(string str, int base) {
        auto val = [](char c) {
            return (c >= '0' && c <= '9' ? (int)c - '0' : (int)c - 'A' + 10);
        };
        ll len = sz(str), power = 1, num = 0, i;
        for (i = len - 1; i >= 0; i--) {
            num += val(str[i]) * power;
            power = power * base;
        }
        return num;
    }

    ll summation(ll r, ll l = 0) {
        if (l > r) swap(l, r);
        return (r * (r + 1) / 2) - (l * (l - 1) / 2);
    }

    ll countMultiples(ll a, ll b, ll c) {
        return (b / c) - ((a - 1) / c);
    }

    ll summationOfMultiples(ll a, ll b, ll c) {
        ll right = summation(b / c);
        ll left = summation((a - 1) / c);
        return (right - left) * c;
    }

    double getLog(ll a, int b) {
        return log(a) / log(b);
    }

    bool isPerfectPower(ll number, int base = 2) {
        return (getLog(number, base) - (ll)getLog(number, base) <= 1e-9);
    }

    bool isTriangle(ll a, ll b, ll c) {
        return (a + b > c) && (a + c > b) && (b + c > a) && (a && b && c);
    }

    double distance(double x1, double y1, double x2, double y2) {
        return sqrt(pow(x1 - x2, 2) + pow(y1 - y2, 2));
    }

    bool isCollinear(ll x1, ll y1, ll x2, ll y2, ll x3, ll y3) {
        return (y2 - y1) * (x3 - x1) == (y3 - y1) * (x2 - x1);
    }

    bool isPerfectSquare(ll n) {
        ll sq = sqrt(n);
        return sq * sq == n;
    }
};`)
    }]);
  }
}
