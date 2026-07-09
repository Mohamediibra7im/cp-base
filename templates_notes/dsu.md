# DSU / Union-Find

A Disjoint Set Union maintains disjoint sets, each identified by a **leader** (representative). Two key operations:

1. **Find:** Follow parent pointers to the root.
2. **Union:** Merge two sets by attaching one root to the other.

**Path compression** flattens the tree: every node on the path to the root points directly at the root. **Union by size** attaches the smaller tree under the larger one.

$$\text{amortized cost per operation} = O(\alpha(n))$$

where $\alpha$ is the inverse Ackermann function (effectively constant, $\leq 4$).

\