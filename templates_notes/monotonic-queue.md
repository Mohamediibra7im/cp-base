# Monotonic Queue

A monotonic queue maintains the aggregate of a sliding window in $O(1)$ amortized using the **two-stack queue** pattern. Two monotonic stacks $S_1$ (output) and $S_2$ (input) simulate a queue.

**Push** adds to $S_2$, maintaining the monotonic invariant. **Pop** removes from $S_1$; when $S_1$ is empty, elements transfer from $S_2$ to $S_1$ (reversing order, preserving monotonicity).

**Invariant:** Each stack maintains its own aggregate. Overall: $\text{op}(S_1.\text{mono}, S_2.\text{mono})$.

\