# Lowest Common Ancestor (Binary Lifting)

Lowest Common Ancestor using binary lifting preprocessing. Answers LCA queries in $O(log n)$ after $O(n log n)$ preprocessing. When to Use: tree path queries, distance between nodes.

Finds the lowest common ancestor of two nodes in a tree using **binary lifting**. Also supports distance and k-th ancestor queries.

## How It Works

### Preprocessing

1. Run DFS from root to compute \