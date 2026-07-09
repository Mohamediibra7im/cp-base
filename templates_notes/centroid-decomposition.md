# Centroid Decomposition

Divide-and-conquer on trees by recursively splitting at the **centroid** — a node whose largest subtree ≤ n/2. Process all paths through the centroid, then recurse on remaining components. Height is $O(log n)$.

## When to Use

- **Path counting**: "paths with property P" — reduces $O(n²)$ brute force to $O(n log n)$
- **Distance queries**: aggregate distances from centroid to subtree nodes
- **Tree problems**: any $O(n²)$ tree problem → $O(n log n)$ via decomposition

## Complexity

- **Time**: \