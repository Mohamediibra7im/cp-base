# Dijkstra's Algorithm

Finds shortest paths from a single source in graphs with **non-negative** edge weights. Uses a min-priority queue to greedily extract the closest unvisited node and relax its neighbors. Fails with negative weights — use Bellman-Ford instead.

## When to Use

- **Shortest path**: single-source with non-negative weights
- **Grid/pathfinding**: 0-1 BFS is a special case (weights 0 or 1 only)
- **State-space search**: minimum cost/moves on implicit graphs

## Complexity

- **Time**: \