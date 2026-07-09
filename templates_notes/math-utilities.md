# Math Utilities

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
| isCollinear / distance | $O(1)$ |