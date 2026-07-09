# SQRT Decomposition

Partitions an array of $n$ elements into $B = \lceil \sqrt{n} \rceil$ blocks, each stored in sorted order. Enables range counting queries and point updates in $O(\sqrt{n})$.

## How It Works

### Building

Element at index $i$ goes into block $\lfloor i / B \rfloor$. Sort each block for binary search.

### Query: Count elements $\geq x$ in $[l, r]$

Three regions:

1. **Left boundary** — scan partial block: $O(B)$
2. **Full blocks** — binary search each for count $\geq x$: $O(\log B)$ per block
3. **Right boundary** — scan partial block: $O(B)$

### Point Update

Find the block, overwrite old value with new, re-sort: $O(B)$.

$$B = \lceil \sqrt{n} \rceil, \\quad \text{Query} = O(B) + O\\!\left(\frac{n}{B} \log B\right) = O(\sqrt{n})$$

## When to Use

- **Range counting** ("count elements $\geq k$ in $[l, r]$")
- Simple alternative to segment tree when $O(\sqrt{n})$ suffices
- Problems with point updates

## Complexity

| Operation | Time |
|-----------|------|
| Build | $O(n \log n)$ |
| Query | $O(\sqrt{n})$ |
| Point update | $O(\sqrt{n})$ |
| Space | $O(n)$ |