# Fenwick Tree (BIT)

A Fenwick tree supports prefix sum queries and point updates in $O(\log n)$ using the **lowbit** operation: $\text{lowbit}(x) = x \\ \\& \\ (-x)$, isolating the lowest set bit.

Each index $i$ stores a partial sum of length $\text{lowbit}(i)$:

$$\text{tree}[i] = \sum_{j=i-\text{lowbit}(i)+1}^{i} a[j]$$

**Why it works:** Advancing $i \\mathrel{+}= \text{lowbit}(i)$ skips to the next non-overlapping range, covering all positions $\leq i$ in at most $\log n$ steps.

\