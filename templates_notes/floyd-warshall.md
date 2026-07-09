# Floyd-Warshall

All-pairs shortest path via DP. Works with negative weights (but not negative cycles). Recurrence: dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]). When to Use: small graphs (n ≤ 500), need all-pairs distances. Complexity: O(V³).

All-pairs shortest paths via $O(V³)$ DP. Recurrence: \