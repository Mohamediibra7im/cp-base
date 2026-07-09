# Implicit Splay Tree

An implicit splay tree uses the **position** (index) as the key, making it ideal for sequence operations: insert at position, erase at position, range queries, and lazy propagation.

**Split/merge:** Core operations. Split at position $k$ divides into $[0, k)$ and $[k, n)$. Merge concatenates two sequences. All other operations are built on split/merge.

**Lazy propagation:** Each node stores a lazy tag. Before accessing a subtree, push the tag down. The \