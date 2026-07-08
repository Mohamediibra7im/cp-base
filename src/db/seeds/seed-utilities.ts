import { sql } from "drizzle-orm";
import { templates, templateCodes } from "../schema";
import { stripMain, type Db, type CatMap } from "./helpers";

/**
 * Seed utility templates into the database.
 *
 * @param db   Drizzle database connection
 * @param catMap  mapping from category slug to numeric id
 */
export async function seedUtilities(db: Db, catMap: CatMap) {
  const categoryId = catMap["utilities"];
  if (!categoryId) return;

  // ── CP Starter Template ──────────────────────────────────────────────
  const [startTmpl] = await db
    .insert(templates)
    .values({
      title: "CP Starter Template",
      slug: "cp-starter-template",
      description:
        "Modern competitive programming starter template with fast I/O, common aliases, and contest-ready boilerplate",
      categoryId,
      tags: ["template", "boilerplate", "fast-io", "contest"],
      complexity: "O(1) setup",
      notes: `# CP Starter Template

A battle-tested starter template used across Codeforces, AtCoder, and CSES. Paste it at the top of every solution to skip boilerplate and focus on the algorithm.

## What's Included

- **Fast I/O** — disables sync with C stdio for up to 2x faster \`cin/cout\`.
- **Type aliases** — \`ll\`, \`vi\`, \`pii\`, etc. reduce typing under time pressure.
- **Iterator macros** — \`all(x)\` / \`rall(x)\` for STL containers.
- **Constants** — pre-defined modular arithmetic primes and array bounds.

## When to Use

Use this template for **every** CP solution. The fast I/O setup alone saves measurable time on problems with large input (\\$\\mathcal{O}(n \\log n)\\$ with \\$n \\geq 10^5\\$).

Common CP problem patterns this prepares you for:
- Interactive problems (remove \`cin.tie\`)
- Multi-test-case problems (loop \`solve()\`)
- Graph / tree problems (the \`vi\` and \`pii\` aliases)

## Edge Cases

- **Interactive problems**: Remove \`cin.tie(nullptr)\` so that \`cout\` flushes before reading.
- **Multi-test-case**: Wrap \`solve()\` inside \`int main()\` with \`int t; cin >> t; while (t--) solve();\`.
- **Large output**: The \`endl\` macro uses \`'\\n'\` (no flush), which is faster. Use \`cout.flush()\` only when interactive output requires it.

## Complexity

Template setup is \\$\\mathcal{O}(1)\\$. No runtime overhead.

## Usage

\`\`\`cpp
// ... (see template code below)
void solve() {
    int n; cin >> n;
    vi a(n);
    for (auto &x : a) cin >> x;
    // your algorithm here
}
\`\`\``,
    })
    .returning();

  if (startTmpl) {
    await db.insert(templateCodes).values([
      {
        templateId: startTmpl.id,
        language: "cpp",
        code: stripMain(`#include <bits/stdc++.h>
using namespace std;

using ll = long long;
using pii = pair<int, int>;
using vi = vector<int>;
using vll = vector<ll>;

#define all(x) (x).begin(), (x).end()
#define rall(x) (x).rbegin(), (x).rend()
#define pb push_back
#define sz(x) (int)(x).size()

const ll MOD = 998244353;
const ll MOD2 = 1e9 + 7;
const int MAXN = 2e5 + 5;

void fastIO() {
    ios_base::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);
}

void solve() {

}

int main() {
    fastIO();
    int t = 1;

    while (t--) solve();
    return 0;
}`),
      },
    ]);
  }

  const [int128] = await db
    .insert(templates)
    .values({
      title: "128-bit Integer I/O",
      slug: "int128-io",
      description:
        "Read and print __int128 — a GCC extension for 128-bit signed integers not supported by standard cin/cout",
      categoryId,
      tags: ["int128", "big-integer", "io", "gcc-extension"],
      complexity: "O(d) per read/print where d = number of digits",
      notes: `# 128-bit Integer I/O

Read and print __int128 values (GCC extension). Needed when products exceed 64-bit range (e.g., 1e18 * 1e18).

## When to Use

- Intermediate products exceed long long range
- CP judges that support GCC extensions

## Complexity

- Time: O(digits) per read/print
- Not portable: GCC/Clang only\`long long\` caps at \\$\\approx 9.2 \\times 10^{18}\\$ (\\$2^{63}-1\\$). Some problems require intermediate products or results exceeding this — for example:

- Multiplying two \\$10^9\\$ values gives \\$10^{18}\\$, which fits. But \\$10^{10} \\times 10^{10} = 10^{20}\\$ overflows.
- Counting problems with \\$n \\leq 10^{18}\\$ where you need \\$\\binom{n}{2}\\$.

\`__int128\` gives you \\$\\approx \\pm 1.7 \\times 10^{38}\\$ (\\$2^{127}-1\\$), handling most overflow scenarios in CP.

**Platform note**: \`__int128\` is a **GCC/Clang extension** — it works on Codeforces (GCC), AtCoder (GCC), and Linux judges. It is **not** available on MSVC or in standard C++.

## When to Use

- Products of two \\$\\sim 10^{10}\\$ values where you only need comparison, not output.
- Intermediate values in modular arithmetic before reducing.
- Checking overflow conditions in greedy/math problems.
- Problem constraints mention numbers \\$> 10^{18}\\$.

**Do NOT use when**: the final answer fits in \`long long\` and you can avoid the overhead. \`__int128\` I/O is slower than built-in types.

## Edge Cases

- **Leading whitespace / newlines**: \`read()\` skips all non-digit characters (including newlines, spaces, minus signs that aren't part of the number). This is intentional for CP-style input.
- **No digits at all**: If stdin reaches EOF before any digit, the function returns 0. This is a safe default for CP where input is guaranteed.
- **Overflow during input**: Numbers exceeding \\$2^{127}-1\\$ will silently overflow. Use BigInt for truly arbitrary precision.
- **Negative zero**: \`print(0)\` outputs \`0\` (no leading minus).

## Complexity

\`\`\`
read():  O(d)  where d = number of digits (≤ 39 for __int128)
print(): O(d)  recursive, d = number of digits
\`\`\`

## Usage

\`\`\`cpp
// Reading
__int128 x = read();

// Computing
__int128 product = a * b;  // might overflow long long

// Printing
print(product);  // outputs to stdout
\`\`\``,
    })
    .returning();

  if (int128) {
    await db.insert(templateCodes).values([
      {
        templateId: int128.id,
        language: "cpp",
        code: `
__int128 read() {
    __int128 x = 0;
    int f = 1;
    char ch = getchar();
    while (!isdigit(ch) && ch != '-') {
        ch = getchar();
    }
    if (ch == '-') {
        f = -1;
        ch = getchar();
    }
    while (isdigit(ch)) {
        x = x * 10 + (ch - '0');
        ch = getchar();
    }
    return x * f;
}

void print(__int128 x) {
    if (x < 0) {
        putchar('-');
        x = -x;
    }
    if (x > 9) print(x / 10);
    putchar(x % 10 + '0');
}`,
      },
    ]);
  }

  // ── Big Integer (Arbitrary Precision) ────────────────────────────────
  const [bigInt] = await db
    .insert(templates)
    .values({
      title: "Big Integer (Arbitrary Precision)",
      slug: "big-integer",
      description:
        "Non-negative arbitrary-precision integer with addition, subtraction, multiplication, division, and modulo",
      categoryId,
      tags: ["bigint", "arbitrary-precision", "big-integer", "math"],
      complexity:
        "O(n) add/sub, O(n*m) multiply, O(n) div/mod  (n, m = digit count in base 1e9)",
      notes: `# Big Integer (Arbitrary Precision)

Arbitrary precision integer using base-1e9 storage. Supports +, -, *, comparison. When to Use: when intermediate results exceed 64-bit (e.g., factorial of large n). Complexity: O(n) for add/sub, O(n²) for multiply.

## Why Big Integer in C++?

Unlike Python and Java, C++ has **no built-in arbitrary-precision integer type**. In competitive programming you sometimes need to compute values exceeding \\$2^{63}-1\\$ where \`__int128\` (\\$\\approx 10^{38}\\$) isn't enough:

- Numbers with **hundreds or thousands of digits** (e.g., computing \\$1000!\\$ or \\$2^{1000}\\$).
- **Exact modular products** where you multiply many large numbers before reducing.
- **Digit DP** or **string-to-number** problems requiring arbitrary precision.
- Problems where **Python/Java are disallowed** but the math demands it.

**When to use vs Python/Java**: If you can solve the problem in Python, do — Python's \`int\` is arbitrary-precision by default and faster. Use this template when the judge only accepts C++ or when you need C++ performance on the rest of the algorithm.

## How It Works

The integer is stored as a \`vector<int>\` where each element holds **9 decimal digits** (base \\$B = 10^9\\$). The least-significant chunk is at index 0. This base was chosen because:

- It fits in a 32-bit \`int\` (\\$10^9 < 2^{31}\\$).
- Multiplying two chunks fits in a 64-bit \`long long\` (\\$10^9 \\times 10^9 < 2^{63}\\$).
- Conversion to/from decimal strings is efficient — 9 digits at a time.

## When to Use

- Problem requires computing \\$A \\times B \\pmod{M}\\$ where \\$A, B > 10^{18}\\$ and \\$M > 10^{18}\\$.
- Output must be the **full decimal representation** of a huge number (e.g., \\$2^{1000}\\$).
- You need **exact arithmetic** — no floating-point rounding errors.
- The problem is a **math simulation** requiring carry propagation.

## Edge Cases

- **Subtraction underflow**: \`operator -\` throws if \`a < b\`. Always check \`a >= b\` before subtracting, or catch the exception.
- **Division by zero**: Division and modulo by 0 cause undefined behavior. Guard against it.
- **Zero representation**: An empty vector means zero. \`zero()\` checks for this — never index into \`v\` without checking.
- **Leading zeros**: Multiplication and division strip leading zeros automatically. If you manipulate \`v\` directly, call \`stripZeros()\`.
- **Negative numbers**: This implementation is **non-negative only**. Negate externally if needed (store sign separately).

## Complexity

| Operation | Complexity |
|-----------|-----------|
| Addition | \\$\\mathcal{O}(n)\\$ where \\$n = \\max(\\text{digits of } a, \\text{digits of } b)\\$ |
| Subtraction | \\$\\mathcal{O}(n)\\$ |
| Multiplication | \\$\\mathcal{O}(n \\cdot m)\\$ schoolbook |
| Division by \`ll\` | \\$\\mathcal{O}(n)\\$ |
| Modulo by \`ll\` | \\$\\mathcal{O}(n)\\$ |
| Comparison | \\$\\mathcal{O}(n)\\$ |

## Usage

\`\`\`cpp
BigInt a("123456789012345678901234567890");
BigInt b(999999999LL);

BigInt sum = a + b;          // addition
BigInt diff = a - b;         // subtraction (a must >= b)
BigInt prod = a * b;         // multiplication

BigInt quot = a / 1000000;   // division by long long
BigInt rem  = a % 1000000;   // modulo by long long

cout << a + b << "\\n";      // stream output
cin >> a;                     // stream input (reads decimal string)
\`\`\``,
    })
    .returning();

  if (bigInt) {
    await db.insert(templateCodes).values([
      {
        templateId: bigInt.id,
        language: "cpp",
        code: stripMain(`#include <bits/stdc++.h>
using namespace std;

using ll = long long;

/**
 * @brief Arbitrary-precision non-negative integer in base 1e9.
 *
 * Stores digits in little-endian order: v[0] is the least-significant
 * chunk of 9 decimal digits. An empty vector represents zero.
 */
struct BigInt {

    /// Base for each digit (9 decimal digits per chunk).
    static const int BASE = 1000000000;

    /// Digits in little-endian order, each in [0, BASE-1].
    vector<int> v;

    /** @brief Default constructor — value is 0. */
    BigInt() {}

    /**
     * @brief Construct from a long long value.
     * @param val The integer value (must be >= 0).
     */
    BigInt(ll val) { *this = val; }

    /**
     * @brief Construct from a decimal string.
     * @param s Non-negative decimal string (no leading zeros needed).
     */
    BigInt(const string& s) { *this = s; }

    /**
     * @brief Returns the number of base-1e9 digits.
     * @return Digit count (0 means the value is zero).
     */
    int size() const { return (int)v.size(); }

    /**
     * @brief Checks if the value is zero.
     * @return true if zero, false otherwise.
     */
    bool zero() const { return v.empty(); }

    /**
     * @brief Converts to long long. Undefined behavior if value overflows.
     * @return The value as a long long.
     */
    ll val() const {
        ll ans = 0;
        for (int i = (int)v.size() - 1; i >= 0; i--)
            ans = ans * BASE + v[i];
        return ans;
    }

    /**
     * @brief Strips trailing zero digits from the internal representation.
     */
    void stripZeros() {
        while (!v.empty() && v.back() == 0) v.pop_back();
    }

    // ── Assignment ────────────────────────────────────────────────────

    /**
     * @brief Assigns from a long long.
     * @param val The value (must be >= 0).
     * @return Reference to this BigInt.
     */
    BigInt& operator=(ll val) {
        v.clear();
        if (val == 0) return *this;
        while (val > 0) {
            v.push_back(val % BASE);
            val /= BASE;
        }
        return *this;
    }

    /**
     * @brief Assigns from a decimal string.
     * @param s Non-negative decimal string.
     * @return Reference to this BigInt.
     */
    BigInt& operator=(const string& s) {
        v.clear();
        for (int i = (int)s.size() - 1; i >= 0; i -= 9) {
            int start = max(0, i - 8);
            v.push_back(stoll(s.substr(start, i - start + 1)));
        }
        stripZeros();
        return *this;
    }

    // ── Comparison ────────────────────────────────────────────────────

    /**
     * @brief Less-than comparison.
     * @param a The other BigInt.
     * @return true if this < a.
     */
    bool operator<(const BigInt& a) const {
        if (size() != a.size()) return size() < a.size();
        for (int i = size() - 1; i >= 0; i--)
            if (v[i] != a.v[i]) return v[i] < a.v[i];
        return false;
    }

    /**
     * @brief Greater-than comparison.
     * @param a The other BigInt.
     * @return true if this > a.
     */
    bool operator>(const BigInt& a) const { return a < *this; }

    /**
     * @brief Equality comparison.
     * @param a The other BigInt.
     * @return true if this == a.
     */
    bool operator==(const BigInt& a) const {
        return v == a.v;
    }

    /**
     * @brief Less-than-or-equal comparison.
     * @param a The other BigInt.
     * @return true if this <= a.
     */
    bool operator<=(const BigInt& a) const { return !(a < *this); }

    /**
     * @brief Greater-than-or-equal comparison.
     * @param a The other BigInt.
     * @return true if this >= a.
     */
    bool operator>=(const BigInt& a) const { return !(*this < a); }

    // ── Arithmetic ────────────────────────────────────────────────────

    /**
     * @brief Adds two BigInts.
     * @param a The right-hand operand.
     * @return A new BigInt equal to this + a.
     */
    BigInt operator+(const BigInt& a) const {
        BigInt res = *this;
        int carry = 0;
        for (int i = 0; i < (int)a.v.size() || carry; i++) {
            if (i == (int)res.v.size()) res.v.push_back(0);
            long long cur = res.v[i] + carry + (i < (int)a.v.size() ? a.v[i] : 0);
            res.v[i] = cur % BASE;
            carry = cur / BASE;
        }
        return res;
    }

    /**
     * @brief Compound addition.
     * @param a The right-hand operand.
     * @return Reference to this BigInt (this += a).
     */
    BigInt& operator+=(const BigInt& a) { return *this = *this + a; }

    /**
     * @brief Subtracts two BigInts (this must be >= a).
     * @param b The right-hand operand.
     * @return A new BigInt equal to this - b.
     * @throws runtime_error if this < b (underflow).
     */
    BigInt operator-(const BigInt& b) const {
        if (*this < b) throw runtime_error("BigInt subtraction underflow");
        BigInt res = *this;
        int borrow = 0;
        for (int i = 0; i < (int)b.v.size() || borrow; i++) {
            long long cur = res.v[i] - borrow - (i < (int)b.v.size() ? b.v[i] : 0);
            if (cur < 0) {
                cur += BASE;
                borrow = 1;
            } else {
                borrow = 0;
            }
            res.v[i] = cur;
        }
        res.stripZeros();
        return res;
    }

    /**
     * @brief Compound subtraction (this must be >= b).
     * @param b The right-hand operand.
     * @return Reference to this BigInt (this -= b).
     */
    BigInt& operator-=(const BigInt& b) { return *this = *this - b; }

    /**
     * @brief Multiplies two BigInts using schoolbook algorithm.
     * @param a The right-hand operand.
     * @return A new BigInt equal to this * a.
     */
    BigInt operator*(const BigInt& a) const {
        if (zero() || a.zero()) return BigInt(0);
        BigInt res;
        res.v.resize(size() + a.size(), 0);
        for (int i = 0; i < size(); i++) {
            if (v[i] == 0) continue;
            long long carry = 0;
            for (int j = 0; j < (int)a.v.size() || carry; j++) {
                long long cur = res.v[i + j]
                    + carry
                    + 1LL * v[i] * (j < (int)a.v.size() ? a.v[j] : 0);
                res.v[i + j] = cur % BASE;
                carry = cur / BASE;
            }
        }
        res.stripZeros();
        return res;
    }

    /**
     * @brief Compound multiplication.
     * @param a The right-hand operand.
     * @return Reference to this BigInt (this *= a).
     */
    BigInt& operator*=(const BigInt& a) { return *this = *this * a; }

    /**
     * @brief Divides by a long long value.
     * @param a The divisor (must be > 0).
     * @return A new BigInt equal to this / a.
     */
    BigInt operator/(ll a) const {
        BigInt res = *this;
        res /= a;
        return res;
    }

    /**
     * @brief Compound division by a long long value.
     * @param a The divisor (must be > 0).
     * @return Reference to this BigInt (this /= a).
     */
    BigInt& operator/=(ll a) {
        ll carry = 0;
        for (int i = (int)v.size() - 1; i >= 0; i--) {
            long long cur = v[i] + carry * BASE;
            v[i] = cur / a;
            carry = cur % a;
        }
        stripZeros();
        return *this;
    }

    /**
     * @brief Modulo by a long long value.
     * @param a The modulus (must be > 0).
     * @return A new BigInt equal to this % a.
     */
    BigInt operator%(ll a) const {
        ll res = 0;
        for (int i = (int)v.size() - 1; i >= 0; i--)
            res = (res * BASE + v[i]) % a;
        return BigInt(res);
    }

    /**
     * @brief Compound modulo by a long long value.
     * @param a The modulus (must be > 0).
     * @return Reference to this BigInt (this %= a).
     */
    BigInt& operator%=(ll a) { return *this = *this % a; }

    // ── I/O ───────────────────────────────────────────────────────────

    /**
     * @brief Outputs the BigInt to an ostream (decimal representation).
     * @param out The output stream.
     * @param a The BigInt to print.
     * @return Reference to the output stream.
     */
    friend ostream& operator<<(ostream& out, const BigInt& a) {
        if (a.zero()) return out << 0;
        out << a.v.back();
        for (int i = (int)a.v.size() - 2; i >= 0; i--)
            out << setfill('0') << setw(9) << a.v[i];
        return out;
    }

    /**
     * @brief Reads a BigInt from an istream (expects a decimal string).
     * @param in The input stream.
     * @param a The BigInt to read into.
     * @return Reference to the input stream.
     */
    friend istream& operator>>(istream& in, BigInt& a) {
        string s;
        in >> s;
        a = s;
        return in;
    }
};`),
      },
    ]);
  }
}
