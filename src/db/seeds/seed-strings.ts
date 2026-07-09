import { sql } from "drizzle-orm";
import { templates, templateCodes } from "../schema";
import { stripMain, type Db, type CatMap } from "./helpers";

export async function seedStrings(db: Db, catMap: CatMap) {
  const categoryId = catMap["strings"];
  if (!categoryId) return;

  // --- KMP ---
  const [kmp] = await db.insert(templates).values({
    title: "KMP Algorithm",
    slug: "kmp",
    description: "Knuth-Morris-Pratt pattern matching and prefix function in O(n+m)",
    categoryId: categoryId,
    tags: ["kmp", "pattern-matching", "string", "prefix-function"],
    complexity: "$O(n+m)$",
    notes: `# KMP Algorithm

Linear-time pattern matching leveraging previously matched characters to avoid redundant comparisons.

## Prefix Function

$$\pi[i] = \max\{k : s[0..k-1] = s[i-k+1..i],\; k < i+1\}$$

For each $i$, maintain $j = \pi[i-1]$: if $s[i] = s[j]$ extend ($\pi[i] = j+1$), else fallback ($j = \pi[j-1]$) until $j=0$.

## Pattern Matching

Concatenate $t = p + \# + s$ (sentinel prevents overlap). Compute $\pi$ on $t$. Match when $\pi[i] = |p|$ at position $i - 2|p|$ in $s$.

## When to Use

- Pattern matching (find all occurrences)
- String periodicity: period $p$ iff $\pi[|s|-1] \geq |s| - p$ and $p \mid |s|$
- Multi-pattern matching via $p_1\#p_2\#\cdots\#p_k\#s$

## Complexity

- **Time**: $O(n + m)$ where $n = |s|$, $m = |p|$
- **Space**: $O(n + m)$`,
  }).returning();
  if (kmp) {
    await db.insert(templateCodes).values([{
      templateId: kmp.id,
      language: "cpp",
      code: stripMain(`#include <bits/stdc++.h>
using namespace std;
using ll = long long;

vector<int> prefixFunction(const string& s) {
    int n = s.size();
    vector<int> pi(n);
    for (int i = 1; i < n; i++) {
        int j = pi[i - 1];
        while (j > 0 && s[i] != s[j])
            j = pi[j - 1];
        if (s[i] == s[j])
            j++;
        pi[i] = j;
    }
    return pi;
}

vector<int> kmpSearch(const string& s, const string& p) {
    string t = p + "#" + s;
    vector<int> pi = prefixFunction(t);
    vector<int> matches;
    int m = p.size();
    for (int i = m + 1; i < (int)t.size(); i++) {
        if (pi[i] == m)
            matches.push_back(i - 2 * m);
    }
    return matches;
}`),
    }]);
  }

  const [manacher] = await db.insert(templates).values({
    title: "Manacher's Algorithm",
    slug: "manacher",
    description: "Find all palindromic substrings in O(n) time using linear expansion",
    categoryId: categoryId,
    tags: ["manacher", "palindrome", "string", "substring", "center-expansion"],
    complexity: "$O(n)$",
    notes: `# Manacher's Algorithm

Finds all palindromic substrings in $O(n)$ time by exploiting symmetry.

## How It Works

### Transformation

Insert sentinel $\\#$ between characters: $t = \\# a \\# b \\# a \\#$. Every palindrome in $s$ becomes an odd-length palindrome in $t$.

### Palindrome Expansion

For each position $i$ in $t$, compute $p[i] =$ largest radius such that $t[i-k..i+k]$ is a palindrome.

Maintain the rightmost palindrome $[l, r]$ with center $c$. For position $i$:

1. If $i > r$: expand naively ($k = 1$)
2. If $i \leq r$: reuse mirror — $k = \min(p[2c - i],\\; r - i + 1)$
3. Expand while $t[i-k] = t[i+k]$
4. Update $[l, r]$ if palindrome extends past $r$

### Converting Back

| Property | Formula |
|----------|---------|
| Original center | $i / 2$ |
| Palindrome length | $p[i] - 1$ |

Odd palindromes → odd $i$ in $t$. Even palindromes → even $i$ in $t$.

## When to Use

- All palindromic substrings of a string
- Longest palindromic substring
- Palindrome counting / decomposition

## Complexity

- **Time**: $O(n)$ — $r$ never decreases across iterations
- **Space**: $O(n)$`,
  }).returning();
  if (manacher) {
    await db.insert(templateCodes).values([{
      templateId: manacher.id,
      language: "cpp",
      code: stripMain(`#include <bits/stdc++.h>
using namespace std;
using ll = long long;

vector<int> manacher(const string& s) {
    string t = "#";
    for (char c : s) {
        t += c;
        t += '#';
    }
    int n = t.size();
    vector<int> p(n);
    int l = 0, r = -1;
    for (int i = 0; i < n; i++) {
        int k = (i > r) ? 1 : min(p[l + r - i], r - i + 1);
        while (i - k >= 0 && i + k < n && t[i - k] == t[i + k])
            k++;
        p[i] = k--;
        if (i + k > r) {
            l = i - k;
            r = i + k;
        }
    }
    return p;
}`),
    }]);
  }

  const [rollingHash] = await db.insert(templates).values({
    title: "Rolling Hash (Hashing)",
    slug: "rolling-hash",
    description: "Polynomial rolling hash with double hashing for collision-resistant substring comparison",
    categoryId: categoryId,
    tags: ["hashing", "rolling-hash", "string", "substring", "double-hash"],
    complexity: "$O(n)$ build, $O(1)$ per query",
    notes: `# Rolling Hash (Polynomial Double Hash)

Polynomial rolling hash for $O(1)$ substring comparison with double hashing for collision resistance.

## How It Works

### Hash Computation

For a string $s$ of length $n$, define the polynomial hash:

$$H(s) = \sum_{i=0}^{n-1} s[i] \cdot p^{n-1-i} \\mod m$$

Using prefix hashes $H[i] = H(s[0..i-1])$, the hash of substring $s[l..r]$ (1-indexed) is:

$$\text{hash}(l, r) = H[r] - H[l-1] \cdot p^{r-l+1} \\mod m$$

This follows from:

$$H[r] = H[l-1] \cdot p^{r-l+1} + \sum_{i=l}^{r} s[i] \cdot p^{r-i} \\mod m$$

### Double Hashing

Use two independent hash pairs $(p_1, m_1)$ and $(p_2, m_2)$ to reduce collision probability. Two substrings are equal iff both hash components match. The probability of collision is $O(1/m_1 m_2) \approx 10^{-18}$.

### Anti-Hack (Randomized Parameters)

Bases and moduli are chosen randomly at runtime from a set of safe primes:

| Parameter | Possible Values |
|-----------|----------------|
| Bases | 307, 509, 1009, 2003, 3001, 4001 |
| Moduli | $10^9+7$, $10^9+9$, $10^9+21$, $10^9+33$, $10^9+87$, $10^9+93$ |

Randomization prevents adversarial hash collisions in contest settings. The \`once_flag\` ensures parameters are initialized exactly once across all instances.

### Merge Hash

To concatenate hashes of two ranges $[l_1, r_1]$ and $[l_2, r_2]$:

$$\text{merge} = (\text{hash}(l_1, r_1) \cdot p^{r_2-l_2+1} + \text{hash}(l_2, r_2)) \\mod m$$

This allows comparing concatenations without constructing the actual string.

## When to Use

- Substring equality queries
- Longest common substring (binary search + hash)
- Distinct substring counting
- Pattern matching with wildcards
- Polynomial hash of sequences (vectors of integers)
- Palindrome checking: compare $s[l..r]$ with its reverse

## Edge Cases

- **Empty string**: hash is 0
- **Single character**: hash equals the character's numeric value
- **All same characters**: hash values grow as geometric series in the base
- **Collision**: extremely unlikely with double hash from 12 possible parameter pairs
- **Template parameter \`Base\`**: 0 for 1-indexed vectors, 1 for 0-indexed strings

## Complexity

- **Build**: $O(n)$
- **Query** (sub, equal, mergeHash, at): $O(1)$
- **Space**: $O(n)$

## Usage

\`\`\`cpp

string s = "abcabc";
RollingHash<ll, 1> h(s);
auto sub = h.sub(1, 3);
bool eq = h.equal(1, 3, 4, 6);
auto single = h.at(2);
auto merged = h.mergeHash(1, 2, 4, 5);

vector<int> vec = {1, 2, 3, 1, 2, 3};
RollingHash<ll, 0> hv(vec);
hv.equal(0, 2, 3, 5);
\`\`\`
`,
  }).returning();
  if (rollingHash) {
    await db.insert(templateCodes).values([{
      templateId: rollingHash.id,
      language: "cpp",
      code: stripMain(`#include <bits/stdc++.h>
using namespace std;
using ll = long long;

template <typename T = long long, int Base = 0>
struct RollingHash {
    mt19937 rng;
    int n;
    vector<T> pow1, pow2, h1, h2;
    static constexpr array<T, 6> powers = {307, 509, 1009, 2003, 3001, 4001};
    static constexpr array<T, 6> mods = {1000000007, 1000000009, 1000000021, 1000000033, 1000000087, 1000000093};
    static T p1, p2;
    static T m1, m2;

    RollingHash() : rng(chrono::steady_clock::now().time_since_epoch().count()) {
        initializeStatic();
    }

    RollingHash(const string& s) : rng(chrono::steady_clock::now().time_since_epoch().count()) {
        initializeStatic();
        initialize(s.size());
        calculatePowers();
        calculateHashes(s);
    }

    RollingHash(const vector<T>& vec) : rng(chrono::steady_clock::now().time_since_epoch().count()) {
        initializeStatic();
        initialize(vec.size());
        calculatePowers();
        calculateHashes(vec);
    }

    static void initializeStatic() {
        static once_flag flag;
        static mt19937 localRng(chrono::steady_clock::now().time_since_epoch().count());
        call_once(flag, []() {
            uniform_int_distribution<int> dist(0, 5);
            p1 = powers[dist(localRng)];
            p2 = powers[dist(localRng)];
            m1 = mods[dist(localRng)];
            m2 = mods[dist(localRng)];
        });
    }

    inline void initialize(int size) {
        n = size;
        pow1.assign(n + 5, 0);
        pow2.assign(n + 5, 0);
        h1.assign(n + 5, 0);
        h2.assign(n + 5, 0);
    }

    inline void calculatePowers() {
        pow1[0] = pow2[0] = 1;
        for (int i = 1; i <= n; ++i) {
            pow1[i] = (pow1[i - 1] * p1) % m1;
            pow2[i] = (pow2[i - 1] * p2) % m2;
        }
    }

    inline void calculateHashes(const string& s) {
        h1[0] = h2[0] = 0;
        for (int i = 1; i <= n; ++i) {
            h1[i] = (h1[i - 1] * p1 + s[i - !Base]) % m1;
            h2[i] = (h2[i - 1] * p2 + s[i - !Base]) % m2;
        }
    }

    inline void calculateHashes(const vector<T>& vec) {
        h1[0] = h2[0] = 0;
        for (int i = 1; i <= n; ++i) {
            h1[i] = (h1[i - 1] * p1 + vec[i - !Base]) % m1;
            h2[i] = (h2[i - 1] * p2 + vec[i - !Base]) % m2;
        }
    }

    inline pair<T, T> sub(int l, int r) const {
        T F = (h1[r] - (h1[l - 1] * pow1[r - l + 1] % m1) + m1) % m1;
        T S = (h2[r] - (h2[l - 1] * pow2[r - l + 1] % m2) + m2) % m2;
        return {F, S};
    }

    inline pair<T, T> mergeHash(int l1, int r1, int l2, int r2) const {
        auto a = sub(l1, r1), b = sub(l2, r2);
        T F = ((a.first * pow1[r2 - l2 + 1]) + b.first) % m1;
        T S = ((a.second * pow2[r2 - l2 + 1]) + b.second) % m2;
        return {F, S};
    }

    inline pair<T, T> at(int idx) const {
        return sub(idx, idx);
    }

    inline bool equal(int l1, int r1, int l2, int r2) const {
        return sub(l1, r1) == sub(l2, r2);
    }
};

template <typename T, int Base> constexpr array<T, 6> RollingHash<T, Base>::powers;
template <typename T, int Base> constexpr array<T, 6> RollingHash<T, Base>::mods;
template <typename T, int Base> T RollingHash<T, Base>::p1 = 0;
template <typename T, int Base> T RollingHash<T, Base>::p2 = 0;
template <typename T, int Base> T RollingHash<T, Base>::m1 = 0;
template <typename T, int Base> T RollingHash<T, Base>::m2 = 0;`),
    }]);
  }

  const [hashedDeque] = await db.insert(templates).values({
    title: "Hashed Deque",
    slug: "hashed-deque",
    description: "Deque with O(1) rolling polynomial double hash for constant-time equality comparison",
    categoryId: categoryId,
    tags: ["hashing", "deque", "rolling-hash", "sliding-window", "double-hash"],
    complexity: "$O(1)$ per operation, $O(n)$ init",
    notes: `# Hashed Deque

Double-ended queue maintaining a rolling polynomial double hash for $O(1)$ equality comparison.

## How It Works

Hash of sequence $a_0, a_1, \\ldots, a_{n-1}$:

$$H = \sum_{i=0}^{n-1} a_i \cdot b^{n-1-i} \\mod m$$

### Push Back

$$H' = (H \cdot b + x) \\mod m$$

### Push Front

$$H' = (x \cdot b^{\text{len}} + H) \\mod m$$

### Pop Back

$$H' = (H - a_{\text{len}-1}) \cdot b^{-1} \\mod m$$

where $b^{-1} = b^{m-2} \\mod m$ (Fermat's little theorem).

### Pop Front

Remove $a_0$ (contribution $a_0 \cdot b^{\text{len}-1}$):

$$H' = H - a_0 \cdot b^{\text{len}-1} \\mod m$$

## When to Use

- $O(1)$ equality comparison of two deques/sequences
- Sliding window hashing with dynamic front/back operations
- Palindrome checking on a deque structure

## Complexity

- **Push/Pop**: $O(1)$ per operation
- **Equality**: $O(1)$
- **Init**: $O(N)$ to precompute powers and inverses`,
  }).returning();
  if (hashedDeque) {
    await db.insert(templateCodes).values([{
      templateId: hashedDeque.id,
      language: "cpp",
      code: stripMain(`#include <bits/stdc++.h>
using namespace std;
using ll = long long;

template <typename T>
class HashedDeque {
private:
    int len;
    vector<ll> val;
    deque<T> curr;

    static mt19937 rng;
    static vector<ll> mod;

    const int N = 500005;
    const ll base = 1000000007;

    vector<vector<ll>> p, inv;

    static bool isPrime(ll x) {
        if (x < 2 || (x % 2 == 0 && x != 2)) return false;
        for (ll i = 3; i * i <= x; i += 2) {
            if (x % i == 0) return false;
        }
        return true;
    }

    static ll nextPrime(ll x) {
        while (!isPrime(x)) ++x;
        return x;
    }

    static void getMods() {
        static once_flag flag;
        call_once(flag, []() {
            mt19937 localRng(chrono::steady_clock::now().time_since_epoch().count());
            mod.resize(2);
            mod[0] = nextPrime(uniform_int_distribution<ll>(900000000, 1000000009)(localRng));
            mod[1] = nextPrime(uniform_int_distribution<ll>(900000000, 1000000009)(localRng));
            while (mod[1] == mod[0])
                mod[1] = nextPrime(uniform_int_distribution<ll>(900000000, 1000000009)(localRng));
        });
    }

    ll fastPower(ll baseVal, ll exp, ll modVal) {
        ll res = 1;
        while (exp > 0) {
            if (exp % 2 == 1)
                res = (res * baseVal) % modVal;
            baseVal = (baseVal * baseVal) % modVal;
            exp /= 2;
        }
        return res;
    }

    void initialize() {
        p = inv = vector<vector<ll>>(N, vector<ll>(2, 1));
        getMods();
        for (int i = 1; i < N; ++i) {
            for (int j = 0; j < 2; ++j) {
                p[i][j] = (p[i - 1][j] * base) % mod[j];
                inv[i][j] = fastPower(p[i][j], mod[j] - 2, mod[j]);
            }
        }
    }

public:
    HashedDeque() : len(0), val(2, 0) {
        initialize();
    }

    ll rand(ll l, ll r) {
        return uniform_int_distribution<ll>(l, r)(rng);
    }

    void pushBack(T x) {
        for (int i = 0; i < 2; ++i)
            val[i] = ((val[i] * base) % mod[i] + x) % mod[i];
        curr.push_back(x);
        ++len;
    }

    void pushFront(T x) {
        for (int i = 0; i < 2; ++i)
            val[i] = ((x * p[len][i]) % mod[i] + val[i]) % mod[i];
        curr.push_front(x);
        ++len;
    }

    void popBack() {
        for (int i = 0; i < 2; ++i) {
            val[i] = ((val[i] - curr.back()) % mod[i] + mod[i]) % mod[i];
            val[i] = (val[i] * inv[1][i]) % mod[i];
        }
        curr.pop_back();
        --len;
    }

    void popFront() {
        --len;
        for (int i = 0; i < 2; ++i) {
            ll v = (1ll * curr.front() * p[len][i]) % mod[i];
            val[i] = ((val[i] - v) % mod[i] + mod[i]) % mod[i];
        }
        curr.pop_front();
    }

    int size() const {
        return len;
    }

    bool operator==(const HashedDeque<T>& rhs) const {
        return len == rhs.len && val == rhs.val;
    }
};

template <typename T> mt19937 HashedDeque<T>::rng(chrono::steady_clock::now().time_since_epoch().count());
template <typename T> vector<ll> HashedDeque<T>::mod;`),
    }]);
  }

  const [hashSegTree] = await db.insert(templates).values({
    title: "Hash Segment Tree",
    slug: "hash-segment-tree",
    description: "Segment tree storing double hash values for range substring hashing with point updates",
    categoryId: categoryId,
    tags: ["hashing", "segment-tree", "substring-hash", "range-hash", "point-update"],
    complexity: "$O(log n)$ per query/update",
    notes: `# Hash Segment Tree

Segment tree storing polynomial double hash values, supporting $O(\log n)$ range hash queries and point updates.

## How It Works

Each leaf stores a weighted hash:

$$\text{leaf}[idx] = a_{\text{pos}} \cdot p^{idx} \mod m$$

Internal nodes sum children: $\text{tree}[idx] = \text{tree}[2 \cdot idx] + \text{tree}[2 \cdot idx + 1] \mod m$

**Query normalization** -- divide out the leading power to get a standalone substring hash:

$$\text{hash}(l, r) = \text{query}(l, r) \cdot (p^{l-1})^{-1} \mod m$$

**Point update** -- replace leaf hash: $\text{tree}[\text{leaf}] = v \cdot p^{\text{leaf}} \mod m$, then propagate up.

Two independent hashes with $p_1 = 313, p_2 = 1013$ and $m_1 = 10^9+7, m_2 = 10^9+9$ for collision resistance.

## When to Use

- Substring hash with point updates (dynamic strings)
- Pattern matching in mutable strings
- Palindrome checking with character updates

## Complexity

- **Build**: $O(n)$
- **Query / Update**: $O(\log n)$
- **Space**: $O(n)$`,
  }).returning();
  if (hashSegTree) {
    await db.insert(templateCodes).values([{
      templateId: hashSegTree.id,
      language: "cpp",
      code: stripMain(`#include <bits/stdc++.h>
using namespace std;
using ll = long long;

const ll MOD = 1e9 + 7;

template <typename T = int>
using Pair = pair<T, T>;

/**
 * @brief Segment tree storing double hash values for range substring hashing.
 *
 * Supports point updates and range hash queries. Combines hash values
 * using polynomial hash properties so that query(l, r) returns the
 * normalized hash of the substring s[l..r].
 *
 * @tparam T Integer type (default: int)
 * @tparam Base 0 for 1-indexed input, 1 for 0-indexed (default: 0)
 */
template <typename T = int, int Base = 0>
struct HashSegmentTree {
    int n, size;
    vector<T> pow1, pow2, inv1, inv2;
    const T p1 = 313, p2 = 1013;
    const T m1 = 1e9 + 7, m2 = 1e9 + 9;
    vector<Pair<T>> tree;

    #define LEFT (idx << 1)
    #define RIGHT ((idx << 1) | 1)

    /** @brief Modular multiplication: (a * b) mod m. */
    T mul(T a, T b, T m) {
        return (1LL * a * b) % m;
    }

    /** @brief Modular addition: (a + b) mod m. */
    T add(T a, T b, T m) {
        a += b;
        if (a >= m) a -= m;
        return a;
    }

    /** @brief Modular exponentiation: b^e mod m. */
    T powMod(T b, T e, int m = MOD) {
        T ret = 1;
        while (e) {
            if (e & 1) ret = mul(ret, b, m);
            b = mul(b, b, m);
            e >>= 1;
        }
        return ret;
    }

    /**
     * @brief Construct the segment tree for n elements.
     * @param _n Number of elements (default: 0)
     */
    HashSegmentTree(int _n = 0) : n(_n) {
        size = 1;
        Pair<T> DEFAULT = {0, 0};
        while (size < n) size *= 2;
        tree = vector<Pair<T>>(2 * size, DEFAULT);
        pow1 = pow2 = inv1 = inv2 = vector<T>(2 * size);

        pow1[0] = pow2[0] = inv1[0] = inv2[0] = 1;

        T inv1Val = powMod(p1, m1 - 2, m1);
        T inv2Val = powMod(p2, m2 - 2, m2);

        for (int i = 1; i < 2 * size; i++) {
            pow1[i] = mul(pow1[i - 1], p1, m1);
            pow2[i] = mul(pow2[i - 1], p2, m2);
            inv1[i] = mul(inv1[i - 1], inv1Val, m1);
            inv2[i] = mul(inv2[i - 1], inv2Val, m2);
        }
    }

    /** @brief Merge two hash pairs by component-wise addition mod m. */
    Pair<T> merge(const Pair<T>& a, const Pair<T>& b) {
        return {add(a.first, b.first, m1), add(a.second, b.second, m2)};
    }

    void build(const vector<T>& nums, int idx, int lx, int rx) {
        if (Base ? lx >= (int)nums.size() : lx > (int)nums.size()) return;
        if (rx == lx)
            tree[idx] = {mul(nums[lx - !Base], pow1[idx], m1),
                         mul(nums[lx - !Base], pow2[idx], m2)};
        else {
            int mx = (rx + lx) / 2;
            build(nums, LEFT, lx, mx);
            build(nums, RIGHT, mx + 1, rx);
            tree[idx] = merge(tree[LEFT], tree[RIGHT]);
        }
    }

    /** @brief Build segment tree from array. */
    void build(const vector<T>& nums) {
        build(nums, 1, 1, size);
    }

    void update(int index, T val, int idx, int lx, int rx) {
        if (rx == lx)
            tree[idx] = {mul(val, pow1[idx], m1), mul(val, pow2[idx], m2)};
        else {
            int mx = (rx + lx) / 2;
            if (index <= mx) update(index, val, LEFT, lx, mx);
            else update(index, val, RIGHT, mx + 1, rx);
            tree[idx] = merge(tree[LEFT], tree[RIGHT]);
        }
    }

    /** @brief Point update with integer value at position index. */
    void update(const int index, const T val) {
        update(index, val, 1, 1, size);
    }

    /** @brief Point update with character (maps 'a' -> 1, 'b' -> 2, ...). */
    void update(const int index, char c) {
        update(index, c - 'a' + 1, 1, 1, size);
    }

    Pair<T> query(int l, int r, int idx, int lx, int rx) {
        if (lx > r || l > rx) return {0, 0};
        if (lx >= l && rx <= r) return tree[idx];
        int mx = (lx + rx) / 2;
        return merge(query(l, r, LEFT, lx, mx),
                     query(l, r, RIGHT, mx + 1, rx));
    }

    /**
     * @brief Get double hash of range [l, r].
     * @param l Left endpoint (1-indexed)
     * @param r Right endpoint (inclusive)
     * @return pair<T,T> normalized double hash of s[l..r]
     */
    Pair<T> query(const int l, const int r) {
        auto [h1, h2] = query(l, r, 1, 1, size);
        return {mul(h1, inv1[l - 1], m1), mul(h2, inv2[l - 1], m2)};
    }
};`),
    }]);
  }
}
