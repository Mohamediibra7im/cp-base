import { templates, templateCodes } from "../schema";
import { stripMain, type Db, type CatMap } from "./helpers";

export async function seedBitManip(db: Db, catMap: CatMap) {
  const categoryId = catMap["bit-manipulation"];
  if (!categoryId) return;

  const [bitUtils] = await db.insert(templates).values({
    title: "Bit Utilities",
    slug: "bit-utilities",
    description: "Comprehensive bit manipulation utility functions",
    categoryId,
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
      templateId: bitUtils.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
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
}`)
    }]);
  }
}
