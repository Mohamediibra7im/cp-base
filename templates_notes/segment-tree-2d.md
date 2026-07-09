# Segment Tree 2D

A 2D segment tree is a nested segment tree: the outer tree indexes rows, each outer node contains an inner segment tree over columns.

**Build:** Outer tree first. For each outer node covering rows $[r_1, r_2]$, its inner tree is built by combining children's inner trees pointwise.

**Query:** Decompose row range $[r_1, r_2]$ into $O(\log n)$ outer segments, query inner tree over $[c_1, c_2]$ in $O(\log m)$. Total: $O(\log n \cdot \log m)$.

\