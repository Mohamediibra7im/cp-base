# Binomial Coefficients

$\binom{n}{k}$ counts ways to choose $k$ from $n$ elements (order irrelevant).

## Formula

$$\binom{n}{k} = \frac{n!}{k!(n-k)!}$$

## Properties

- **Pascal's Identity**: $\binom{n}{k} = \binom{n-1}{k-1} + \binom{n-1}{k}$
- **Sum over all k**: $\sum_{k=0}^{n} \binom{n}{k} = 2^n$
- **Boundary**: $\binom{n}{0} = \binom{n}{n} = 1$

## Modular Computation

For prime $p$, compute $\binom{n}{k} \bmod p$ using Fermat's Little Theorem:

$$\binom{n}{k} \equiv n! \cdot (k!)^{-1} \cdot ((n-k)!)^{-1} \pmod{p}$$

where $a^{-1} \equiv a^{p-2} \pmod{p}$.

## When to Use

- Counting subsets, combinations of items
- Paths on grid: $(0,0)$ to $(n,m)$ is $\binom{n+m}{n}$
- Intermediate step in inclusion-exclusion or counting formulas

## Complexity

- **Precomputation**: $O(\text{MAXN})$ for factorials
- **Query**: $O(1)$ per $\binom{n}{k}$

## Usage

\