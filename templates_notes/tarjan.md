# Tarjan's Algorithm (SCC, Bridges, Articulation Points)

Finds bridges and articulation points using DFS low-link values. Also works for SCCs. When to Use: bridge detection, articulation point identification, SCC computation. Complexity: O(V + E).

Finds **Strongly Connected Components**, **bridges**, and **articulation points** in a single DFS pass.

## How It Works

### Core Concepts

Every node \