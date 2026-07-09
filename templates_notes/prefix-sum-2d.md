# Prefix Sum 2D

A 2D prefix sum enables $O(1)$ sum queries over any axis-aligned rectangle in a static grid. The grid is preprocessed once, after which any rectangle sum is computed via inclusion-exclusion of four precomputed values.

## How It Works

### Building the Prefix Sum Matrix

Given an $n \times m$ grid $A$ (0-indexed), construct a 1-indexed prefix sum matrix $P$ where:

$$P[i][j] = \sum_{x=0}^{i-1} \sum_{y=0}^{j-1} A[x][y]$$

Recurrence:

$$P[i][j] = A[i-1][j-1] + P[i][j-1] + P[i-1][j] - P[i-1][j-1]$$

This is computed by iterating $i$ from $1$ to $n$ and $j$ from $1$ to $m$.

### Query: Sum of rectangle $[x_1, y_1]$ to $[x_2, y_2]$

Using inclusion-exclusion (all coordinates 1-indexed):

$$\text{sum}([x_1..x_2] \times [y_1..y_2]) = P[x_2][y_2] - P[x_1-1][y_2] - P[x_2][y_1-1] + P[x_1-1][y_1-1]$$

**Why it works**: $P[x_2][y_2]$ is the sum of the entire rectangle from $(1,1)$ to $(x_2, y_2)$. Subtracting $P[x_1-1][y_2]$ removes everything above row $x_1$. Subtracting $P[x_2][y_1-1]$ removes everything left of column $y_1$. But the region above $x_1$ and left of $y_1$ was subtracted twice, so we add it back: $+ P[x_1-1][y_1-1]$.

\