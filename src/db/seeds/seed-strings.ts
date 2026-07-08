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
    description: "Knuth-Morris-Pratt pattern matching and prefix function",
    categoryId: categoryId,
    tags: ["kmp", "pattern-matching", "string", "prefix-function"],
    complexity: "O(n+m)",
    notes: `# KMP Algorithm

## Usage

\`\`\`cpp
string s = "ababcabcabab", pattern = "abc";
vector<int> pi = prefix_function(s);          // compute prefix function
vector<int> matches = KMP(s, pattern);        // find all occurrences
// matches contains starting indices of each match (0-indexed)
\`\`\`

## Methods

- **prefix_function(s)** — compute prefix function (pi) for string s
  - pi[i] = length of longest proper prefix of s[0..i] that is also a suffix
- **KMP(s, p)** — find all occurrences of pattern p in string s
  - Returns vector of starting indices (0-indexed)

## Complexity

- Time: O(n + m) where n = |s|, m = |p|
- Space: O(n + m)`,
  }).returning();
  if (kmp) {
    await db.insert(templateCodes).values([{
      templateId: kmp.id,
      language: "cpp",
      code: stripMain(`#include <bits/stdc++.h>
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
}`),
    }]);
  }

  // --- Manacher ---
  const [manacher] = await db.insert(templates).values({
    title: "Manacher's Algorithm",
    slug: "manacher",
    description: "Find all palindromic substrings in O(n) time",
    categoryId: categoryId,
    tags: ["manacher", "palindrome", "string", "substring"],
    complexity: "O(n)",
    notes: `# Manacher's Algorithm

## Usage

\`\`\`cpp
string s = "ababa";
vector<int> p = manacher(s);
// p[i] = radius of palindrome centered at t[i] in transformed string t = "#a#b#a#b#a#"
\`\`\`

## Return Array

The function returns an array \`p\` for the transformed string \`t = "#" + join("#", s) + "#"\`.

For position i in t:
- p[i] = radius of palindrome centered at i (half-length including center)
- After transformation, odd-length palindromes center at odd positions, even-length at even positions

To convert back to original string s:
- Center in original = i / 2 (integer division)
- Radius in original = (p[i] - 1) / 2
- Palindrome length = p[i] - 1

## Complexity

- Time: O(n)
- Space: O(n)`,
  }).returning();
  if (manacher) {
    await db.insert(templateCodes).values([{
      templateId: manacher.id,
      language: "cpp",
      code: stripMain(`#include <bits/stdc++.h>
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
}`),
    }]);
  }

  // --- Rolling Hash ---
  const [rollingHash] = await db.insert(templates).values({
    title: "Rolling Hash (Hashing)",
    slug: "rolling-hash",
    description: "String hashing with polynomial rolling hash (double hash for safety)",
    categoryId: categoryId,
    tags: ["hashing", "rolling-hash", "string", "substring"],
    complexity: "O(n) build, O(1) per substring query",
    notes: `# Rolling Hash (Polynomial Double Hash)

## Anti-Hack

This implementation picks random bases and mods at runtime from a pre-defined set of safe primes using \`once_flag\` and \`mt19937\`. Randomized parameters prevent deliberate collisions from adversarial test cases.

## Usage

\`\`\`cpp
string s = "abcabc";
Hash<ll, 1> h(s);
// 1-indexed after construction
auto sub = h.sub(1, 3);                    // hash of "abc"
bool eq = h.equal(1, 3, 4, 6);             // true (abc == abc)
auto single = h.at(2);                      // hash of single char 'b'
auto merged = h.merge_hash(1, 2, 4, 5);    // hash of "ab" + "bc" = "abbc"
\`\`\`

The template also works with vectors:

\`\`\`cpp
vector<int> vec = {1, 2, 3, 1, 2, 3};
Hash<ll, 0> h(vec);
h.equal(0, 2, 3, 5);  // true
\`\`\`

## Methods

- **sub(l, r)** — returns \`pair<T,T>\` double hash of substring/range [l, r]
- **equal(l1, r1, l2, r2)** — returns bool, whether s[l1..r1] == s[l2..r2]
- **at(idx)** — returns hash of single character/element at position idx
- **merge_hash(l1, r1, l2, r2)** — returns hash of concatenation s[l1..r1] + s[l2..r2]

## Complexity

- Build: O(n)
- Each query: O(1)`,
  }).returning();
  if (rollingHash) {
    await db.insert(templateCodes).values([{
      templateId: rollingHash.id,
      language: "cpp",
      code: stripMain(`#include <bits/stdc++.h>
using namespace std;
#define all(vec) vec.begin(), vec.end()
#define rall(vec) vec.rbegin(), vec.rend()
#define sz(x) int(x.size())
#define ll long long
template < typename T = long long , int Base = 0 > struct Hash {
    mt19937 rng;
    int n;
    vector < T > pow1, pow2, h1, h2;
    static constexpr array < T, 6 > powers = {307, 509, 1009, 2003, 3001, 4001};
    static constexpr array < T, 6 > mods = {1000000007, 1000000009, 1000000021, 1000000033, 1000000087, 1000000093};
    static T p1, p2;
    static T m1, m2;

    Hash() : rng(chrono::steady_clock::now().time_since_epoch().count()) {
        initialize_static();
    }

    Hash(const string &s) : rng(chrono::steady_clock::now().time_since_epoch().count()) {
        initialize_static();
        initialize(s.size());
        calculate_powers();
        calculate_hashes(s);
    }

    Hash(const vector < T > &vec) : rng(chrono::steady_clock::now().time_since_epoch().count()) {
        initialize_static();
        initialize(vec.size());
        calculate_powers();
        calculate_hashes(vec);
    }

    static void initialize_static() {
        static once_flag flag;
        static mt19937 rng(chrono::steady_clock::now().time_since_epoch().count());
        call_once(flag, []() {
            uniform_int_distribution<int> dist(0, 5);
            p1 = powers[dist(rng)];
            p2 = powers[dist(rng)];
            m1 = mods[dist(rng)];
            m2 = mods[dist(rng)];
        });
    }

    inline void initialize(int size) {
        n = size;
        pow1.reserve(n + 5); pow2.reserve(n + 5);
        h1.reserve(n + 5); h2.reserve(n + 5);
        pow1.assign(n + 5, 0); pow2.assign(n + 5, 0);
        h1.assign(n + 5, 0); h2.assign(n + 5, 0);
    }

    inline void calculate_powers() {
        pow1[0] = pow2[0] = 1;
        for (int i = 1; i <= n; ++i) {
            pow1[i] = (pow1[i - 1] * p1) % m1;
            pow2[i] = (pow2[i - 1] * p2) % m2;
        }
    }

    inline void calculate_hashes(const string& s) {
        h1[0] = h2[0] = 0;
        for (int i = 1; i <= n; ++i) {
            h1[i] = (h1[i - 1] * p1 + s[i - !Base]) % m1;
            h2[i] = (h2[i - 1] * p2 + s[i - !Base]) % m2;
        }
    }

    inline void calculate_hashes(const vector < T >& vec) {
        h1[0] = h2[0] = 0;
        for (int i = 1; i <= n; ++i) {
            h1[i] = (h1[i - 1] * p1 + vec[i - !Base]) % m1;
            h2[i] = (h2[i - 1] * p2 + vec[i - !Base]) % m2;
        }
    }

    inline pair < T, T > sub(int l, int r) const {
        T F = (h1[r] - (h1[l - 1] * pow1[r - l + 1] % m1) + m1) % m1;
        T S = (h2[r] - (h2[l - 1] * pow2[r - l + 1] % m2) + m2) % m2;
        return {F, S};
    }

    inline pair < T, T > merge_hash(int l1, int r1, int l2, int r2) const {
        auto a = sub(l1, r1), b = sub(l2, r2);
        T F = ((a.first * pow1[r2 - l2 + 1]) + b.first) % m1;
        T S = ((a.second * pow2[r2 - l2 + 1]) + b.second) % m2;
        return {F, S};
    }

    inline pair < T, T > at(int idx) const {
        return sub(idx, idx);
    }

    inline bool equal(int l1, int r1, int l2, int r2) const {
        return sub(l1, r1) == sub(l2, r2);
    }
};

template < typename T, int Base > constexpr array < T, 6 > Hash < T, Base >::powers;
template < typename T, int Base > constexpr array < T, 6 > Hash < T, Base >::mods;
template < typename T, int Base > T Hash < T, Base >::p1 = 0;
template < typename T, int Base > T Hash < T, Base >::p2 = 0;
template < typename T, int Base > T Hash < T, Base >::m1 = 0;
template < typename T, int Base > T Hash < T, Base >::m2 = 0;`),
    }]);
  }

  // --- Hashed Deque ---
  const [hashedDeque] = await db.insert(templates).values({
    title: "Hashed Deque",
    slug: "hashed-deque",
    description: "Deque with O(1) rolling polynomial double hash for equality comparison",
    categoryId: categoryId,
    tags: ["hashing", "deque", "rolling-hash", "sliding-window"],
    complexity: "O(1) per operation, O(n) init",
    notes: `# Hashed Deque

## Usage

\`\`\`cpp
Hashed_Deque<int> dq1, dq2;
dq1.push_back(1); dq1.push_back(2);
dq2.push_back(1); dq2.push_back(2);
if (dq1 == dq2) { /* same content */ }
dq1.push_front(0);
dq1.pop_back();
\`\`\`

Supports O(1) equality comparison between two deques by comparing their double hash values. Useful for sliding window hashing, palindrome checking, and sequence comparison.

## Methods

- **push_back(x)** — append x to back, O(1)
- **push_front(x)** — prepend x to front, O(1)
- **pop_back()** — remove from back, O(1)
- **pop_front()** — remove from front, O(1)
- **size()** — returns current size, O(1)
- **operator==** — O(1) equality check (same size, same hash value)

## Complexity

- All operations: O(1) amortized
- Initialization: O(N) where N = max deque capacity (500,005 default)
- Anti-hack: randomized 64-bit moduli chosen at runtime`,
  }).returning();
  if (hashedDeque) {
    await db.insert(templateCodes).values([{
      templateId: hashedDeque.id,
      language: "cpp",
      code: stripMain(`#include <bits/stdc++.h>
using namespace std;
#define all(vec) vec.begin(), vec.end()
#define rall(vec) vec.rbegin(), vec.rend()
#define sz(x) int(x.size())
#define ll long long
template < typename T >
class Hashed_Deque {
private:
    int len;
    vector < ll > val;
    deque < T > curr;

    static mt19937 rng;
    static vector < ll > mod;

    const int N = 500005;
    const ll base = 1000000007;

    vector < vector < ll > > p, inv;

    static bool is_prime(ll x) {
        if (x < 2 || (x % 2 == 0 && x != 2)) return false;
        for (ll i = 3; i * i <= x; i += 2) {
            if (x % i == 0) return false;
        }
        return true;
    }

    static ll nxt_prime(ll x) {
        while (!is_prime(x)) ++x;
        return x;
    }

    static void get_mods() {
        static once_flag flag;
        call_once(flag, []() {
            mt19937 local_rng(chrono::steady_clock::now().time_since_epoch().count());
            mod.resize(2);
            mod[0] = nxt_prime(uniform_int_distribution < ll >(900000000, 1000000009)(local_rng));
            mod[1] = nxt_prime(uniform_int_distribution < ll >(900000000, 1000000009)(local_rng));
            while (mod[1] == mod[0])
                mod[1] = nxt_prime(uniform_int_distribution < ll >(900000000, 1000000009)(local_rng));
        });
    }

    ll fast_power(ll base_val, ll exp, ll mod_val) {
        ll res = 1;
        while (exp > 0) {
            if (exp % 2 == 1)
                res = (res * base_val) % mod_val;
            base_val = (base_val * base_val) % mod_val;
            exp /= 2;
        }
        return res;
    }

    void initial() {
        p = inv = vector < vector < ll > >(N, vector < ll > (2, 1));
        get_mods();
        for (int i = 1; i < N; ++i) {
            for (int j = 0; j < 2; ++j) {
                p[i][j] = (p[i - 1][j] * base) % mod[j];
                inv[i][j] = fast_power(p[i][j], mod[j] - 2, mod[j]);
            }
        }
    }

public:
    Hashed_Deque() : len(0), val(2, 0) {
        initial();
    }

    ll rand(ll l, ll r) {
        return uniform_int_distribution < ll > (l, r)(rng);
    }

    void push_back(T x) {
        for (int i = 0; i < 2; ++i)
            val[i] = ((val[i] * base) % mod[i] + x) % mod[i];
        curr.push_back(x);
        ++len;
    }

    void push_front(T x) {
        for (int i = 0; i < 2; ++i)
            val[i] = ((x * p[len][i]) % mod[i] + val[i]) % mod[i];
        curr.push_front(x);
        ++len;
    }

    void pop_back() {
        for (int i = 0; i < 2; ++i) {
            val[i] = ((val[i] - curr.back()) % mod[i] + mod[i]) % mod[i];
            val[i] = (val[i] * inv[1][i]) % mod[i];
        }
        curr.pop_back();
        --len;
    }

    void pop_front() {
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

    bool operator == (const Hashed_Deque < T >& rhs) const {
        return len == rhs.len && val == rhs.val;
    }
};

template < typename T > mt19937 Hashed_Deque < T >::rng(chrono::steady_clock::now().time_since_epoch().count());
template < typename T > vector < ll > Hashed_Deque < T >::mod;`),
    }]);
  }

  // --- Hash Segment Tree ---
  const [hashSegTree] = await db.insert(templates).values({
    title: "Hash Segment Tree",
    slug: "hash-segment-tree",
    description: "Segment tree storing double hash values for range substring hashing with point updates",
    categoryId: categoryId,
    tags: ["hashing", "segment-tree", "substring-hash", "range-hash"],
    complexity: "O(log n) per query/update",
    notes: `# Hash Segment Tree

## Usage

\`\`\`cpp
int n = 10;
Hash_SegmentTree<ll, 1> hs(n);

// Build from array
vector<ll> arr = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
hs.build(arr);

// Or build character by character with point updates
for (int i = 1; i <= n; i++)
    hs.update(i, s[i-1]);  // update with char (maps 'a' -> 1)

// Query range hash
auto h1 = hs.query(1, 5);
auto h2 = hs.query(6, 10);
if (h1 == h2) { /* s[1..5] == s[6..10] */ }

// Point update
hs.update(3, 'x');  // update position 3 to 'x'
\`\`\`

## Parameters

Uses double hashing with fixed bases and mods:
- Hash 1: p1 = 313, m1 = 1e9 + 7
- Hash 2: p2 = 1013, m2 = 1e9 + 9

Two ranges are equal iff both hash components match.

## Methods

- **build(nums)** — build segment tree from array/vector
- **update(index, value)** — point update with integer value at position index
- **update(index, char)** — point update with character (maps 'a' → 1, 'b' → 2, ...)
- **query(l, r)** — returns \`pair<T,T>\` double hash of range [l, r]

## Complexity

- Build: O(n)
- Query: O(log n)
- Update: O(log n)`,
  }).returning();
  if (hashSegTree) {
    await db.insert(templateCodes).values([{
      templateId: hashSegTree.id,
      language: "cpp",
      code: stripMain(`#include <bits/stdc++.h>
using namespace std;
#define all(vec) vec.begin(), vec.end()
#define rall(vec) vec.rbegin(), vec.rend()
#define sz(x) int(x.size())
#define ll long long
constexpr int Mod = 1e9 + 7;
template < typename T = int > using Pair = pair < T, T >;

template < typename T = int , int Base = 0 > struct Hash_SegmentTree {
    int n, size;
    vector < T > pow1, pow2, inv1, inv2;
    const T p1 = 313, p2 = 1013;
    const T m1 = 1e9 + 7, m2 = 1e9 + 9;
    vector < Pair < T > > tree;

    #define LEFT (idx << 1)
    #define RIGHT ((idx << 1) | 1)

    T mul(T a, T b, T m) {
        return (1LL * a * b) % m;
    }

    T add(T a, T b, T m) {
        a += b;
        if (a >= m) a -= m;
        return a;
    }

    T pow_mod(T b, T e, int m = Mod) {
        T ret = 1;
        while (e) {
            if (e & 1) ret = mul(ret, b, m);
            b = mul(b, b, m);
            e >>= 1;
        }
        return ret;
    }

    Hash_SegmentTree(int _n = 0) : n(_n) {
        size = 1;
        Pair < T > DEFAULT = {0, 0};
        while (size < n) size *= 2;
        tree = vector < Pair < T > > (2 * size, DEFAULT);
        pow1 = pow2 = inv1 = inv2 = vector < T > (2 * size);

        pow1[0] = pow2[0] = inv1[0] = inv2[0] = 1;

        T inv1_val = pow_mod(p1, m1 - 2, m1);
        T inv2_val = pow_mod(p2, m2 - 2, m2);

        for (int i = 1; i < 2 * size; i++) {
            pow1[i] = mul(pow1[i - 1], p1, m1);
            pow2[i] = mul(pow2[i - 1], p2, m2);
            inv1[i] = mul(inv1[i - 1], inv1_val, m1);
            inv2[i] = mul(inv2[i - 1], inv2_val, m2);
        }
    }

    Pair < T > merge(const Pair < T >& a, const Pair < T >& b) {
        return {add(a.first, b.first, m1), add(a.second, b.second, m2)};
    }

    void build(const vector < T >& nums, int idx, int lx, int rx) {
        if (Base ? lx >= sz(nums) : lx > sz(nums)) return;
        if (rx == lx) tree[idx] = {mul(nums[lx - !Base], pow1[idx], m1), mul(nums[lx - !Base], pow2[idx], m2)};
        else {
            int mx = (rx + lx) / 2;
            build(nums, LEFT, lx, mx);
            build(nums, RIGHT, mx + 1, rx);
            tree[idx] = merge(tree[LEFT], tree[RIGHT]);
        }
    }

    void build(const vector < T >& nums) {
        build(nums, 1, 1, size);
    }

    void update(int index, T val, int idx, int lx, int rx) {
        if (rx == lx) tree[idx] = {mul(val, pow1[idx], m1), mul(val, pow2[idx], m2)};
        else {
            int mx = (rx + lx) / 2;
            if (index <= mx) update(index, val, LEFT, lx, mx);
            else update(index, val, RIGHT, mx + 1, rx);
            tree[idx] = merge(tree[LEFT], tree[RIGHT]);
        }
    }

    void update(const int index, const T val) {
        update(index, val, 1, 1, size);
    }

    void update(const int index, char c) {
        update(index, c - 'a' + 1, 1, 1, size);
    }

    Pair < T > query(int l, int r, int idx, int lx, int rx) {
        if (lx > r || l > rx) return {0, 0};
        if (lx >= l && rx <= r) return tree[idx];
        int mx = (lx + rx) / 2;
        return merge(query(l, r, LEFT, lx, mx), query(l, r, RIGHT, mx + 1, rx));
    }

    Pair < T > query(const int l, const int r) {
        auto [h1, h2] = query(l, r, 1, 1, size);
        return {mul(h1, inv1[l - 1], m1), mul(h2, inv2[l - 1], m2)};
    }
};`),
    }]);
  }
}
