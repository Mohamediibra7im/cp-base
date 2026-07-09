# Fenwick Tree 2D

A 2D Fenwick tree (Binary Indexed Tree) extends the 1D BIT to two dimensions. **2D BIT for point updates + range sum queries on a matrix.** Uses inclusion-exclusion for prefix sums:

$$\text{query}(x_1, y_1, x_2, y_2) = S(x_2, y_2) - S(x_1-1, y_2) - S(x_2, y_1-1) + S(x_1-1, y_1-1)$$

**When to Use**: Matrix prefix sums with updates. Simpler alternative to 2D segment tree for additive operations. Supports point update + rectangle sum in $O(\log n \cdot \log m)$ per operation.

\