# Coordinate Compression

Coordinate compression maps a sparse set of values to a dense $0..k-1$ index range. This is essential when using BIT/segment tree with values outside $[1, n]$ or when the value range is large but the number of distinct values is small.

**Algorithm:**
1. Collect all values, sort and remove duplicates.
2. Use binary search to find each value's rank.
3. Ranks are 0-indexed and contiguous.

\