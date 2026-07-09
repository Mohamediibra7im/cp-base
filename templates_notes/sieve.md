# Sieve of Eratosthenes

A **linear-time** sieve computing primes, smallest prime factor (SPF), Euler's totient ($\varphi$), and Möbius function ($\mu$) up to $n$.

## Algorithm

The **linear sieve** achieves $O(n)$ by ensuring every composite is crossed off exactly once. For each $i$, iterate over known primes $p$, mark $i \cdot p$ composite, and **break** when $p \\mid i$ — this prevents double-counting since composites with a smaller prime factor will be reached later.

The classic sieve marks composites in $O(n \log \log n)$; the linear variant adds $\varphi$ and $\mu$ computation at no extra asymptotic cost.

## When to Use

- **Precompute factorizations** — Use SPF to factor any number $\leq n$ in $O(\log n)$.
- **Totient/Möbius queries** — Compute $\varphi$ and $\mu$ for all numbers up to $n$ in one pass.
- **Prime counting** — List of primes enables $\pi(n)$ lookups.

## Complexity

- **Time:** $O(n)$ — each composite visited exactly once.
- **Memory:** $O(n)$ for the auxiliary arrays.