# Pollard's Rho Factorization

Factorize a 64-bit integer using trial division, Miller-Rabin, and Pollard's Rho.

## Algorithm

### Birthday Paradox Intuition

Evaluate a pseudo-random function $f(x) = (x^2 + c) \bmod n$ repeatedly. With probability ~50% in $O(\sqrt{p})$ steps (where $p$ is the smallest prime factor), two values $x_i, x_j$ will satisfy $\\gcd(|x_i - x_j|, n) > 1$, yielding a non-trivial factor.

### Floyd's Cycle Detection

Use **tortoise-and-hare** to find collisions without storing all values:
- **Tortoise** $x$: one step per iteration.
- **Hare** $y$: two steps per iteration.
- Compute $d = \\gcd(|x - y|, n)$ at each step. If $1 < d < n$, found a factor.

If the algorithm fails with one random constant $c$, retry with a new $c$.

## When to Use

- **Factoring large numbers** — Any number up to $2^{64}$ that can't be trial-divided.
- **RSA challenges** — Finding factors of semiprimes $n = p \cdot q$.
- **Number theory problems** — GCD-based factorization, counting divisors, totient computation.

## Complexity

- **Pollard's Rho:** $O(n^{1/4})$ expected per factor.
- **Trial division:** $O(\sqrt[3]{n})$ for small primes.