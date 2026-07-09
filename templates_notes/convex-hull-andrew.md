# Convex Hull -- Andrew's Monotone Chain

Andrew's monotone chain computes the **convex hull** of 2D points in $O(n \log n)$.

## Algorithm

Sort points lexicographically by $(x, y)$. Build the **lower hull** left-to-right: for each point, pop while the last two points and the new point form a non-left turn. Build the **upper hull** right-to-left the same way. Concatenate both halves (removing duplicate endpoints).

Core orientation test:

$$\text{orient}(a, b, c) = \text{cross}(b - a,\; c - a)$$

| Return | Meaning |
|--------|---------|
| $> 0$ | Counter-clockwise (left turn) |
| $= 0$ | Collinear |
| $< 0$ | Clockwise (right turn) |

The \