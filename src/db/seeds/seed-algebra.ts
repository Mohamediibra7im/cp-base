import { sql } from "drizzle-orm";
import { templates, templateCodes } from "../schema";
import { stripMain, type Db, type CatMap } from "./helpers";

export async function seedAlgebra(db: Db, catMap: CatMap) {
  const categoryId = catMap["algebra"];
  if (!categoryId) return;

  const [binExp] = await db.insert(templates).values({
    title: "Binary Exponentiation",
    slug: "binary-exponentiation",
    description: "Fast exponentiation using binary representation (O(log n))",
    categoryId: categoryId,
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
    categoryId: categoryId,
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
    categoryId: categoryId,
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
  // =================== MATH UTILITIES ===================
  const [mathUtil] = await db.insert(templates).values({
    title: "Math Utilities",
    slug: "math-utilities",
    description: "GCD, LCM, extended Euclidean, prime factorization, divisors, totient, exponentiation, base conversion",
    categoryId: categoryId,
    tags: ["math", "gcd", "lcm", "factorization", "divisors", "totient"],
    complexity: "O(\u221An) for factorization, O(log n) for gcd/pow",
    notes: `# Math Utilities

Collection of common math functions for competitive programming.

## Functions

| Function | Description |
|----------|-------------|
| GCD(a, b) | Greatest common divisor |
| LCM(a, b) | Least common multiple |
| prime_factorization(n) | Vector of prime factors |
| nCr(n, r) / nPr(n, r) | Combinations/Permutations (exact, no mod) |
| Bin_Pow(b, e, mod) | Binary exponentiation |
| Bin_Mul(b, e, mod) | Binary multiplication (no overflow) |
| is_prime(n) | Primality test |
| number_of_divisors(n) / sum_of_divisors(n) | Divisor count/sum |
| Get_Divisors(n) | All divisors as vector |
| phi(n) | Euler's totient |
| extended_gcd(a, b, x, y) | Extended Euclidean algorithm |
| decimal_to_any_base / any_base_to_decimal | Base conversion |

## Example
\`\`\`cpp
Math m;
cout << m.GCD(12, 8);                  // 4
cout << m.Bin_Pow(2, 10, 1e9+7);      // 1024
cout << m.is_prime(97);                // true
auto divs = m.Get_Divisors(12);        // {1, 12, 2, 6, 3, 4}
\`\`\``,
  }).returning();
  if (mathUtil) {
    await db.insert(templateCodes).values([{
      templateId: mathUtil.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;
#define all(vec) vec.begin(), vec.end()
#define sz(x) int(x.size())
#define ll long long

struct Math {

    Math(){}

    ll GCD(ll a, ll b){
        return (!b ? a : GCD(b, a % b));
    }

    ll LCM(ll a, ll b){
        return a / GCD(a, b) * b;
    }

    vector < int > prime_factorization(ll n){
        vector < int > factors;
        while(n % 2 == 0) factors.push_back(2), n /= 2;
        for(int i = 3; i <= sqrt(n); i += 2)
            while(n % i == 0) factors.push_back(i), n /= i;
        if(n > 2) factors.push_back(n);
        return factors;
    }

    ll nCr(ll n, ll r){
        if(r > n) return 0;
        ll p = 1, k = 1;
        if (n - r < r) r = n - r;
        if(n < 1) return 0;
        while (r > 0){
            p *= n, k *= r;
            ll m = GCD(p, k);
            p /= m, k /= m, n--, r--;
        }
        return p;
    }

    ll nPr(ll n, ll r){
        if(r > n) return 0;
        ll npr = 1;
        while(r-- > 0) npr *= n--;
        return npr;
    }

    ll Big_Mod(string s, ll mod){
        ll res = 0;
        for(auto& c : s)
            res = (res * 10 + (c - '0')) % mod;
        return res;
    }

    void add(ll& a, ll b, ll mod = 1e9 + 7){
        a += b;
        if(a >= mod) a -= mod;
    }

    void mul(ll& a, ll b, ll mod = 1e9 + 7){
        a = ((a % mod) * (b % mod)) % mod;
    }

    ll Bin_Pow(ll b, ll e){
        ll power = 1;
        while(e){
            if(e & 1) power *= b;
            e >>= 1;
            b *= b;
        }
        return power;
    }

    ll Bin_Pow(ll b, ll e, ll mod){
        ll power = 1;
        while(e){
            if(e & 1) mul(power, b, mod);
            e >>= 1;
            mul(b, b, mod);
        }
        return power % mod;
    }

    ll Bin_Mul(ll b, ll e, ll mod){
        b %= mod;
        ll mult = 0;
        while(e){
            if(e & 1) add(mult, b, mod);
            e >>= 1;
            add(b, b, mod);
        }
        return mult % mod;
    }

    bool is_prime(ll n){
        if(n < 2 || (n % 2 == 0 && n != 2)) return false;
        for(int i = 3; i <= sqrt(n); i += 2)
            if(n % i == 0) return false;
        return true;
    }

    int number_of_divisors(ll n){
        int divisors = 0;
        for(int i = 1; i < sqrt(n); i++)
            if(n % i == 0) divisors += 2;
        return divisors + (sqrt(n) == (int)sqrt(n));
    }

    ll sum_of_divisors(ll n){
        ll sum_divisors = 0;
        for(int i = 1; i < sqrt(n); i++)
            if(n % i == 0) sum_divisors += ((n / i) + i);
        ll sq = sqrt(n);
        return sum_divisors + (sq * sq == n ? sq : 0);
    }

    ll divisorSum(ll num){
        ll sum = 0;
        for (ll i = 1; i <= sqrt(num); i++) {
            ll t1 = i * (num / i - i + 1);
            ll t2 = (((num / i) * (num / i + 1)) / 2) - ((i * (i + 1)) / 2);
            sum += t1 + t2;
        }
        return sum;
    }

    vector < ll > Get_Divisors(ll n){
        vector < ll > divisors;
        for(int i = 1; i < sqrt(n); i++)
            if(n % i == 0) divisors.push_back(i), divisors.push_back(n / i);
        if(sqrt(n) == int(sqrt(n))) divisors.push_back(sqrt(n));
        return divisors;
    }

    ll Summation(ll r, ll l = 0){
        if(l > r) swap(l, r);
        return (r * (r + 1) / 2) - (l * (l - 1) / 2);
    }

    ll how_many_divisors(ll a, ll b, ll c){
        return (b / c) - ((a - 1) / c);
    }

    ll Summation_of_Devisors(ll a, ll b, ll c){
        ll right = Summation(b / c);
        ll left = Summation((a - 1) / c);
        return (right - left) * c;
    }

    double get_log(ll a, int b){
        return log(a) / log(b);
    }

    bool is_power(ll number, int base = 2){
        return (get_log(number, base) - (ll) get_log(number, base) <= 1e-9);
    }

    double dist(double x1, double y1, double x2, double y2){
        return sqrt(pow(x1 - x2, 2) + pow(y1 - y2, 2));
    }

    bool is_triangle(ll a, ll b, ll c){
        return (a + b > c) && (a + c > b) && (b + c > a) && (a && b && c);
    }

    double slope(double x1, double y1, double x2, double y2){
        if(x2 == x1) return 0;
        return (y2 - y1) / (x2 - x1);
    }

    bool is_same_line(ll x1, ll y1, ll x2, ll y2, ll x3, ll y3){
        return (y2 - y1) * (x3 - x1) == (y3 - y1) * (x2 - x1);
    }

    bool is_perfect_square(ll n){
        ll sq = sqrt(n);
        return sq * sq == n;
    }

    ll phi(ll n) {
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

    ll FactN_PrimePowers(ll n, ll p){
        ll powers = 0;
        for(ll i = p; i <= n; i *= p)
            powers += n / i;
        return powers;
    }

    int extended_gcd(int a, int b, int& x, int& y) {
        if (b == 0) { x = 1; y = 0; return a; }
        int x1, y1;
        int d = extended_gcd(b, a % b, x1, y1);
        x = y1;
        y = x1 - y1 * (a / b);
        return d;
    }

    bool find_any_solution(int a, int b, int c, int &x0, int &y0, int &g) {
        g = extended_gcd(abs(a), abs(b), x0, y0);
        if (c % g) return false;
        x0 *= c / g;
        y0 *= c / g;
        if (a < 0) x0 = -x0;
        if (b < 0) y0 = -y0;
        return true;
    }

    string decimal_to_any_base(ll decimal, ll base){
        if(decimal == 0) return "0";
        string num = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        string result;
        do{
            result.push_back(num[decimal % base]);
            decimal /= base;
        }while(decimal != 0);
        return string(result.rbegin(), result.rend());
    }

    ll any_base_to_decimal(string str, int base) {
        auto val = [](char c){
            return (c >= '0' && c <= '9' ? (int) c - '0' : (int) c - 'A' + 10);
        };
        ll len = sz(str), power = 1, num = 0, i;
        for (i = len - 1; i >= 0; i--) {
            num += val(str[i]) * power;
            power = power * base;
        }
        return num;
    }
};`)
    }]);
  }
}