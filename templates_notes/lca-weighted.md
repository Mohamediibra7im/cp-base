# LCA on Weighted Trees

Binary lifting for LCA with **path aggregates** (sum, max, min) on weighted trees. Each ancestor entry stores the 2^j-th ancestor and the aggregate of edge weights along that jump.

## When to Use

- **Path sum/max/min**: aggregate edge weights on path u→v in $O(log n)$
- **Bottleneck edges**: max/min edge on path (MST verification)
- **Custom aggregates**: any associative operation — GCD, XOR, etc.

## Complexity

- **Build**: \