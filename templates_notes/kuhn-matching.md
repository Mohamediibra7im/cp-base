# Kuhn's Algorithm — Maximum Bipartite Matching

Finds maximum cardinality matching in a bipartite graph using **augmenting paths**.

## How It Works

### Definitions

- **Matching**: set of edges with no shared vertices
- **Augmenting path**: path from unmatched left to unmatched right, alternating between unmatched/matched edges
- **Maximum matching**: matching with the most edges

### Algorithm

For each left-side vertex \