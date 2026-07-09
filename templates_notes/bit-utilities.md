# Bit Manipulation Utilities

Bit manipulation operates directly on the binary (base-2) representation of integers. Each bit position corresponds to a power of two, so bitwise operations map cleanly onto arithmetic properties. Mastering these primitives is essential in competitive programming because they run in $O(1)$ time and unlock compact solutions to subset, counting, and masking problems.

## When to Use

- **Subset enumeration / bitmask DP** — iterate over all $2^n$ subsets of a set of size $n$
- **Counting parity** — check whether the number of set bits is odd or even
- **Isolating properties** — extract the lowest set bit, find MSB/LSB positions
- **Power-of-two checks** — fast modular arithmetic, size alignment
- **State compression** — represent a set of $n$ elements as an $n$-bit integer
- **Game theory / Sprague-Grundy** — XOR is the Grundy merge operator

## Formulas

| Operation | Formula |
|-----------|---------|
| Check bit $i$ | $(n \\gg i) \\mathbin{\\&} 1$ |
| Set bit $i$ | $n \\mathbin{\\mid} (1 \\ll i)$ |
| Clear bit $i$ | $n \\mathbin{\\&} \sim(1 \\ll i)$ |
| Toggle bit $i$ | $n \\mathbin{\\oplus} (1 \\ll i)$ |
| Lowest set bit | $n \\mathbin{\\&} (-n)$ |
| Clear lowest set bit | $n \\mathbin{\\&} (n - 1)$ |
| Is power of two | $n > 0 \\land n \\mathbin{\\&} (n - 1) = 0$ |
| Is $a$ subset of $b$ | $a \\mathbin{\\&} b = a$ |

## Edge Cases

- **$n = 0$** — no bits are set; MSB/LSB position functions return $-1$; countBits returns $0$