# Modular Multiplicative Inverse

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
| Linear Precomputation | $O(n)$ | $O(1)$ |