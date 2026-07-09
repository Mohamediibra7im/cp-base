# Monotonic Stack

A monotonic stack maintains elements in sorted order. The key insight: when a new element arrives, pop all stack elements that violate the monotonic property — they are blocked and will never be the answer for future elements.

**Invariant:** Elements in the stack are always monotonic. Processing from right to left, pop elements $\geq a[i]$ (for next-greater) — they are blocked by $a[i]$.

\