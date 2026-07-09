# Lazy Propagation Segment Tree

A lazy propagation segment tree extends the standard segment tree to support **range updates** in $O(\log n)$ by deferring work. Each node stores both a value and a lazy tag. When a range update covers an entire node, the tag is stored and the node's value is updated immediately.

**Push-down:** Before accessing children, the lazy tag is propagated. The parent's lazy value is *composed* with the children's existing lazy values, and the children's values are updated via an *apply* function.

**CUSTOMIZE block variants:**

| Variant | combine | apply | compose |
|---------|---------|-------|---------|
| Range add + range sum | $a + b$ | $\text{val} + \text{lz} \cdot \text{len}$ | $\text{old} + \text{new}$ |
| Range assign + range min | $\min(a, b)$ | $\text{lz}$ | $\text{new}$ |

\