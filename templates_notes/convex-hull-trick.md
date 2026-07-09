# Convex Hull Trick — Li Chao Segment Tree

Dynamically maintains a set of lines $y = m_i x + c_i$ and queries $\min_i (m_i x + c_i)$ at any $x$ in a bounded range. Unlike classic CHT (requires sorted slopes or offline), Li Chao handles **arbitrary insertion order** and **interleaved queries**.

## How It Works

At each segment tree node over $[L, R]$, store the line **best at the midpoint** $\text{mid} = \lfloor(L+R)/2\rfloor$.

### Insertion

Given $\\ell_{\text{new}}$ and node line $\\ell_{\text{cur}}$ covering $[l, r]$:

1. Compare at $\text{mid} = \lfloor(l+r)/2\rfloor$ — swap if new is better
2. At leaf ($l = r$): stop
3. Push the worse line to the child where it wins:
   - $\\ell_{\text{new}}(l) < \\ell_{\text{cur}}(l)$ → **left** child
   - Else → **right** child

### Query

At $x$: evaluate stored line, recurse to child containing $x$, return $\min$ along path.

## When to Use

- Lines inserted **dynamically**, not known offline
- **Queries interleaved** with insertions
- $x$-range is **bounded** ($[L, R]$)
- For $\max$: negate slopes and intercepts

**Classic CHT (deque)** still better when slopes monotonic + queries monotonic → $O(1)$ amortized.

## Complexity

- **Insert**: $O(\log C)$ where $C = R - L$
- **Query**: $O(\log C)$
- **Space**: $O(N \log C)$ dynamic nodes