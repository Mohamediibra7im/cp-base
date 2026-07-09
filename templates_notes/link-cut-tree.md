# Link-Cut Tree (LCT)

Dynamic tree data structure supporting **link**, **cut**, and **path aggregate** queries in O(log n) amortized time.

## How It Works

### Splay Tree + Preferred Paths

A Link-Cut Tree represents a forest using:

1. **Splay trees**: each splay tree represents a **preferred path** in the original tree
2. **Parent pointers**: connect splay trees (virtual edges between paths)
3. **Expose operation**: makes the path from root to a node a single splay tree

### Key Operations

#### \