import { sql } from "drizzle-orm";
import { templates, templateCodes } from "../schema";
import { stripMain, type Db, type CatMap } from "./helpers";

export async function seedNumberTheory(db: Db, catMap: CatMap) {
  const categoryId = catMap["number-theory"];
  if (!categoryId) return;

  // --- Sieve ---
  const [sieve] = await db.insert(templates).values({
    title: "Sieve of Eratosthenes", slug: "sieve",
    description: "Prime sieve with linear optimization (SPF), phi, mu precomputation",
    categoryId,
    tags: ["sieve", "prime", "number-theory", "factorization"],
    complexity: "O(n log log n)",
    notes: `# Sieve of Eratosthenes

Linear sieve that computes primes, smallest prime factor (SPF), Euler's totient (φ), and Möbius function (μ) up to n.

## Usage

\`\`\`cpp
int n = 1000000;
sieve(n);
// prime      → list of primes ≤ n
// is_prime   → boolean array
// spf[i]     → smallest prime factor of i
// phi[i]     → Euler's totient φ(i)
// mobius[i]  → Möbius function μ(i)
\`\`\`

## Properties

- **spf**: smallest prime factor. \`spf[i] = p\` where p is the smallest prime dividing i.
- **phi**: Euler's totient. φ(i) = count of numbers k < i with gcd(k,i) = 1. φ(p^k) = p^k - p^{k-1}.
- **mobius**: μ(1) = 1. μ(i) = 0 if i is not squarefree, otherwise μ(i) = (-1)^k where k = number of prime factors.

## Complexity

- Time: O(n)
- Memory: O(n)`,
  }).returning();
  if (sieve) {
    await db.insert(templateCodes).values([{
      templateId: sieve.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
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
}`)
    }]);
  }

  // --- Miller-Rabin ---
  const [miller] = await db.insert(templates).values({
    title: "Miller-Rabin Primality Test", slug: "miller-rabin",
    description: "Deterministic Miller-Rabin primality test for 64-bit integers",
    categoryId,
    tags: ["primality-test", "miller-rabin", "deterministic", "64-bit"],
    complexity: "O(log n) per test",
    notes: `# Miller-Rabin Primality Test

Deterministic primality test for 64-bit integers. Uses bases {2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37} which are sufficient for all n < 2^64.

## Usage

\`\`\`cpp
isPrime(n)  // returns true if n is prime
\`\`\`

## Algorithm

Write n-1 = d · 2^s. For each base a, compute a^d mod n. If result is 1 or n-1, continue. Otherwise square s-1 times — if any result is n-1, continue. Otherwise n is composite.

## Complexity

- Time: O(log n) per test (12 modular exponentiations worst-case)
- Deterministic for n < 2^64`,
  }).returning();
  if (miller) {
    await db.insert(templateCodes).values([{
      templateId: miller.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
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
}`)
    }]);
  }

  // --- Factorization ---
  const [factors] = await db.insert(templates).values({
    title: "Prime Factorization", slug: "prime-factorization",
    description: "Prime factorization with Pollard's Rho for 64-bit integers",
    categoryId,
    tags: ["factorization", "prime-factors", "trial-division"],
    complexity: "O(√n) / O(n^{1/4}) with Pollard Rho",
    notes: `# Prime Factorization

Factorizes a 64-bit integer into its prime factors using:
- Trial division for small factors (n < 2^40)
- Pollard's Rho algorithm for large factors (O(n^{1/4}))
- Miller-Rabin for primality testing

## Usage

\`\`\`cpp
vector<ll> factors = factorize(n);
// factors = sorted list of prime factors (with multiplicity)
// Example: factorize(12) → {2, 2, 3}
\`\`\`

## How Pollard's Rho Works

Uses Floyd's cycle detection with a pseudo-random function f(x) = (x^2 + c) mod n. If gcd(|x - y|, n) > 1, found a non-trivial factor. Recursively factor.

## Complexity

- Expected: O(n^{1/4}) for Pollard's Rho
- Worst-case: O(√n) if n is prime (Miller-Rabin catches this quickly)`,
  }).returning();
  if (factors) {
    await db.insert(templateCodes).values([{
      templateId: factors.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
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
}`)
    }]);
  }

  // --- Matrix Exponentiation ---
  const [matrix] = await db.insert(templates).values({
    title: "Matrix Exponentiation", slug: "matrix-exponentiation",
    description: "Matrix multiplication and binary exponentiation for linear recurrences",
    categoryId,
    tags: ["matrix", "exponentiation", "linear-recurrence", "fibonacci"],
    complexity: "O(n³ log k)",
    notes: `# Matrix Exponentiation

Raise a square matrix to power k using binary exponentiation (O(n³ log k)).

## Usage

\`\`\`cpp
int n = 2;  // matrix size
Matrix_Power<ll> mat(n);
mat.mat = {{1, 1}, {1, 0}};  // Fibonacci matrix
Matrix_Power<ll> result = mat.pow(10);  // F(10)
\`\`\`

## Applications

- **Fibonacci numbers**: [[1,1],[1,0]]^n = [[F_{n+1}, F_n],[F_n, F_{n-1}]]
- **Linear recurrences**: Any linear recurrence of order k can be expressed as matrix exponentiation
- **Graph paths**: Adjacency matrix A^k gives number of walks of length k between nodes

## Complexity

- Time: O(n³ log k) using naive multiplication
- Memory: O(n²)`,
  }).returning();
  if (matrix) {
    await db.insert(templateCodes).values([{
      templateId: matrix.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
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
};`)
    }]);
  }

  // --- Modular Int ---
  const [modint] = await db.insert(templates).values({
    title: "Modular Integer (ModInt)", slug: "modint",
    description: "Modular arithmetic with operator overloading for safe modular operations",
    categoryId,
    tags: ["modint", "modular", "arithmetic", "number-theory"],
    complexity: "O(1) per operation",
    notes: `# Modular Integer (ModInt)

Wrapper type for modular arithmetic with operator overloading. Handles modulo operations automatically.

## Usage

\`\`\`cpp
using Mint = ModInt<1000000007>;
Mint a = 5, b = 3;
Mint c = a + b;        // 8
Mint d = a * b;        // 15
Mint e = a / b;        // 5 * inv(3) mod MOD
\`\`\`

## Methods

- All basic operators: +, -, *, /, +=, -=, *=
- \`\`\`cpp
ModInt::pow(e)    // returns *this raised to e
ModInt::inv()     // returns modular inverse (MOD must be prime)
\`\`\`

## Properties

- MOD must be prime for \`inv()\` to work (uses Fermat's little theorem)
- Values are always kept in [0, MOD-1]
- Division uses modular inverse: a/b = a * b^{-1}`,
  }).returning();
  if (modint) {
    await db.insert(templateCodes).values([{
      templateId: modint.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
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
};`)
    }]);
  }
}
