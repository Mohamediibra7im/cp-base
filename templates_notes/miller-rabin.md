# Miller-Rabin Primality Test

A **probabilistic** primality test that becomes **deterministic** for bounded ranges by choosing the right witness bases.

## Algorithm

Factor $n - 1 = d \cdot 2^s$, then test each base $a$:
- Compute $x = a^d \bmod n$.
- If $x = 1$ or $x = n-1$, pass. Otherwise square up to $s-1$ times looking for $n-1$.
- If neither found, $n$ is composite.

### Deterministic Witnesses

For $n < 2^{64}$, the 12 bases $\\{2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37\\}$ are sufficient — verified by Jim Sinclair (2011). Smaller ranges need fewer bases (e.g., $n < 2047$: just $\\{2\\}$).

## When to Use

- **Primality testing** — Check if a single 64-bit integer is prime.
- **Preprocessing for factorization** — Called before Pollard's Rho to verify factors.
- **Generating large primes** — Random search with primality verification.

## Complexity

- **Time:** $O(k \log n)$ where $k$ is the number of bases (12 for 64-bit).
- **Memory:** $O(1)$.