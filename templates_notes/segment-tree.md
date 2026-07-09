# Segment Tree

A segment tree is a binary tree where each internal node stores the result of a commutative, associative operation over a contiguous range. The root covers $[1, n]$, splitting at the midpoint.

**Indexing:** Node $i$ has children at $2i$ (left) and $2i+1$ (right). For an internal node covering $[l, r]$ with midpoint $m = \lfloor(l+r)/2\rfloor$:

$$\text{tree}[i] = \text{op}(\text{tree}[2i],\\; \text{tree}[2i+1])$$

**Build** constructs bottom-up in $O(n)$. **Point update** propagates changes up $O(\log n)$ levels. **Range query** decomposes $[l, r]$ into $O(\log n)$ disjoint segments.

\