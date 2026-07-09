# Sparse Table

A sparse table is a static data structure for range queries on arrays that do not change. Preprocess in $O(n \log n)$, answer each query in $O(1)$ for **idempotent** operations (where $\text{op}(x, x) = x$, e.g., min, max, gcd).

**Preprocessing:**

$$\text{table}[i][j] = \text{op}(\text{table}[i][j-1],\\; \text{table}[i + 2^{j-1}][j-1])$$

**Query:** For range $[L, R]$ of length $k = R - L + 1$, let $p = \lfloor \log_2 k \rfloor$:

$$\text{query}(L, R) = \text{op}(\text{table}[L][p],\\; \text{table}[R - 2^p + 1][p])$$

\