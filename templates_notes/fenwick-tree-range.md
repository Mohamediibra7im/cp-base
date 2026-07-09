# Fenwick Tree — Range Updates

Supports **range add** and **range sum** simultaneously using two BITs based on the **difference array**: $d[i] = a[i] - a[i-1]$.

Range add $[l, r]$ by $v$: $d[l] \\mathrel{+}= v$, $d[r+1] \\mathrel{-}= v$.

Prefix sum decomposes as:

$$\sum_{i=1}^{k} a[i] = k \sum_{i=1}^{k} d[i] - \sum_{i=1}^{k} (i-1) \cdot d[i]$$

\