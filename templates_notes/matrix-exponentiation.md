# Matrix Exponentiation

Compute $M^k$ for a square matrix $M$ of size $n \times n$ using **binary exponentiation** in $O(n^3 \log k)$ time.

## Recurrence-to-Matrix Conversion

Given a linear recurrence $a_n = c_1 a_{n-1} + \cdots + c_k a_{n-k}$, define the state vector $\mathbf{v}_n = [a_n, \\ldots, a_{n-k+1}]^T$ and transition matrix $A$:

$$\mathbf{v}_n = A^n \cdot \mathbf{v}_0$$

**Matrix construction:** First row = coefficients. Sub-diagonal shifts previous values down.

**Binary exponentiation:** Decompose $k$ in binary, square $M$ repeatedly, multiply when bit is 1. Reduces $O(k)$ multiplications to $O(\log k)$.

## When to Use

- **Fibonacci / Lucas numbers** — Compute $F_n \bmod m$ for $n$ up to $10^{18}$.
- **Linear recurrences** — Any order-$k$ recurrence with $k$ fixed.
- **Path counting** — $A^k$ gives walks of length $k$ in an adjacency matrix.
- **Competition problems** — When the answer follows a recurrence and $n$ is too large for DP.

## Complexity

- **Time:** $O(n^3 \log k)$ — $\log k$ matrix multiplications, each $O(n^3)$.
- **Memory:** $O(n^2)$.