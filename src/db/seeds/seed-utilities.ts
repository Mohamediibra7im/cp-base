import { sql } from "drizzle-orm";
import { templates, templateCodes } from "../schema";
import { stripMain, type Db, type CatMap } from "./helpers";

export async function seedUtilities(db: Db, catMap: CatMap) {
  const categoryId = catMap["utilities"];
  if (!categoryId) return;

  const [startTmpl] = await db.insert(templates).values({
    title: "CP Starter Template",
    slug: "cp-starter-template",
    description: "Standard competitive programming starter template with fast I/O",
    categoryId: categoryId,
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
      templateId: startTmpl.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
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
}`)
    }]);
  }

  const [int128] = await db.insert(templates).values({
    title: "128-bit Integer I/O",
    slug: "int128-io",
    description: "Read and print __int128 (not supported by cin/cout by default)",
    categoryId: categoryId,
    tags: ["int128", "big-integer", "io"],
    complexity: "O(n) digits",
    notes: `# 128-bit Integer I/O

\`__int128\` is a GCC extension for 128-bit signed integers. Standard \`cin\`/\`cout\` and \`printf\`/\`scanf\` do not support it — custom I/O functions are required.

## Usage

\`\`\`cpp
__int128 x = read();
// ... compute ...
print(x);
\`\`\`

## Functions

- **read()** — reads a 128-bit integer from stdin, returns \`__int128\`
- **print(x)** — writes \`__int128\` \`x\` to stdout

## Limits

- Range: -2^127 to 2^127 - 1 (~±1.7 × 10^38)
- Suitable for numbers up to ~39 decimal digits`,
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
  // =================== BIG INTEGER ===================
  const [bigInt] = await db.insert(templates).values({
    title: "Big Integer (Arbitrary Precision)",
    slug: "big-integer",
    description: "Non-negative arbitrary precision integer with addition, subtraction, multiplication, division, modulo",
    categoryId: categoryId,
    tags: ["bigint", "arbitrary-precision", "big-integer"],
    complexity: "O(n) for add/sub, O(n\u00b2) for multiply, O(n) for div/mod",
    notes: `# Big Integer

Arbitrary precision non-negative integer stored in base 1e9.

## Example
\`\`\`cpp
BigInt a = "123456789012345678";
BigInt b(999999999LL);
cout << a + b;
cout << a * b;
cout << (a % 1000000007LL);
\`\`\`

## Operators
| Op | Description |
|----|-------------|
| +, += | Addition |
| -, -=, --, ++ | Subtraction (throws on underflow) |
| *, *= | Multiplication |
| / (ll), /= | Division by long long |
| % (ll), %= | Modulo by long long |
| <, >, ==, <= | Comparison |
| >>, << | I/O (cin/cout) |

## Methods
- size() — number of base-1e9 digits
- zero() — bool, is zero
- val() — ll, convert (only if fits in ll)

## Internals
Each vector element stores 9 decimal digits (0..999,999,999).`,
  }).returning();
  if (bigInt) {
    await db.insert(templateCodes).values([{
      templateId: bigInt.id, language: "cpp", code: stripMain(`#include <bits/stdc++.h>
using namespace std;
#define ll long long

struct BigInt {

    const int BASE = 1000000000;
    vector < int > v;

    BigInt() {}

    BigInt(const long long &val) { *this = val; }

    BigInt(const string &val) { *this = val; }

    int size() const { return v.size(); }

    bool zero() const { return v.empty(); }

    BigInt& operator = (long long val) {
        v.clear();
        while (val) { v.push_back(val % BASE); val /= BASE; }
        return *this;
    }

    BigInt& operator = (const BigInt &a) { v = a.v; return *this; }

    BigInt& operator = (const vector < int > &a) { v = a; return *this; }

    BigInt& operator = (const string &s) {
        *this = 0;
        for (const char &ch : s)
            *this = *this * 10 + (ch - '0');
        return *this;
    }

    bool operator < (const BigInt &a) const {
        if (a.size() != size()) return size() < a.size();
        for (int i = size() - 1; i >= 0; i--)
            if (v[i] != a.v[i]) return v[i] < a.v[i];
        return false;
    }

    bool operator > (const BigInt &a) const { return a < *this; }

    bool operator == (const BigInt &a) const { return !(*this < a) && !(a < *this); }

    bool operator <= (const BigInt &a) const { return (*this < a) || !(a < *this); }

    ll val(){
        ll ans = 0;
        for (int i = size() - 1; i >= 0; i--)
            ans = ans * BASE + v[i];
        return ans;
    }

    BigInt operator + (const BigInt &a) const {
        BigInt res = *this;
        int idx = 0, carry = 0;
        while (idx < a.size() || carry) {
            if (idx < a.size()) carry += a.v[idx];
            if (idx == res.size()) res.v.push_back(0);
            res.v[idx] += carry;
            carry = res.v[idx] / BASE;
            res.v[idx] %= BASE;
            idx++;
        }
        return res;
    }

    BigInt& operator += (const BigInt &a) { *this = *this + a; return *this; }

    BigInt operator * (const BigInt &a) const {
        BigInt res;
        if (this -> zero() || a.zero()) return res;
        res.v.resize(size() + a.size());
        for (int i = 0; i < size(); i++) {
            if (v[i] == 0) continue;
            long long carry = 0;
            for (int j = 0; carry || j < a.size(); j++) {
                carry += 1LL * v[i] * (j < a.size() ? a.v[j] : 0);
                while (i + j >= res.size()) res.v.push_back(0);
                carry += res.v[i + j];
                res.v[i + j] = carry % BASE;
                carry /= BASE;
            }
        }
        while (!res.v.empty() && res.v.back() == 0) res.v.pop_back();
        return res;
    }

    BigInt& operator *= (const BigInt &a) { *this = *this * a; return *this; }

    BigInt& operator -= (const BigInt &b){
        if(*this < b) throw("UNDERFLOW");
        int n = this -> size(), m = b.size();
        int i, t = 0, s;
        for (i = 0; i < n; i++){
            if(i < m) s = this -> v[i] - b.v[i] + t;
            else s = this -> v[i] + t;
            if(s < 0) s += BASE, t = -1;
            else t = 0;
            this -> v[i] = s;
        }
        while(n > 1 && this -> v[n - 1] == 0)
            this -> v.pop_back(), n--;
        return *this;
    }

    BigInt operator - (const BigInt&b){ BigInt a = *this; a -= b; return a; }

    BigInt operator -- (const int){ *this -= BigInt(1); return *this; }

    BigInt operator ++ (const int){ *this += BigInt(1); return *this; }

    BigInt& operator /=(const ll a) {
        ll carry = 0;
        for (int i = (int)v.size() - 1; i >= 0; i--) {
            ll cur = v[i] + carry * BASE;
            v[i] = cur / a;
            carry = cur % a;
        }
        while (!v.empty() && v.back() == 0) v.pop_back();
        return *this;
    }

    BigInt operator / (const ll a) {
        ll carry = 0;
        vector < int > res = this -> v;
        for (int i = (int)res.size() - 1; i >= 0; i--) {
            ll cur = res[i] + carry * BASE;
            res[i] = cur / a;
            carry = cur % a;
        }
        BigInt ans; ans = res; return ans;
    }

    BigInt operator % (const ll a){
        ll res = 0;
        for (int i = (int)v.size() - 1; i >= 0; i--)
            res = (res * BASE + v[i]) % a;
        BigInt ans = res; return ans;
    }

    BigInt& operator %= (const ll a) { *this = *this % a; return *this; }

    friend ostream& operator<<(ostream &out, const BigInt &a) {
        out << (a.zero() ? 0 : a.v.back());
        for (int i = (int)a.v.size() - 2; i >= 0; i--)
            out << setfill('0') << setw(9) << a.v[i];
        return out;
    }

    friend istream& operator>>(istream &in, BigInt &a) {
        string s; in >> s; a = s; return in;
    }
};`)
    }]);
  }
}