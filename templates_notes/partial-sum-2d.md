# Partial Sum 2D (Difference Array)

A 2D difference array for batch rectangle updates ($O(1)$ each) followed by full propagation to compute the final grid.

## How It Works

### 1D Review

Add $k$ to every element in $[l, r]$: set $d[l] += k, \\; d[r+1] -= k$, then prefix-sum.

### 2D Extension

Add $k$ to rectangle $[x_1, y_1]$ to $[x_2, y_2]$ — mark four corners:

$$d[x_2][y_2] += k, \\quad d[x_2][y_1 - 1] -= k$$
$$d[x_1 - 1][y_2] -= k, \\quad d[x_1 - 1][y_1 - 1] += k$$

### Propagation

After all updates, sweep right-to-left then bottom-to-top:

1. Row-wise: $d[i][j] += d[i][j+1]$
2. Column-wise: $d[i][j] += d[i+1][j]$

Each cell now holds the total accumulated value.

## When to Use

- **Batch rectangle additions** then read final grid
- "How many rectangles cover cell $(x, y)$?"
- Overlapping range problems (sweep line alternative)

## Complexity

| Operation | Time |
|-----------|------|
| Update | $O(1)$ |
| Propagate | $O(n \cdot m)$ |
| Query (after propagate) | $O(1)$ |
| Space | $O(n \cdot m)$ |