# Persistent Segment Tree

A persistent segment tree preserves all previous versions after each update via **path copying**. An update creates $O(\log n)$ new nodes along the root-to-leaf path, sharing all unchanged subtrees with the previous version.

Each version $t$ has its own root $\text{roots}[t]$. Creating version $t$ from $t-1$ costs $O(\log n)$ new nodes. Total memory for $q$ updates: $O(n + q \log n)$.

\