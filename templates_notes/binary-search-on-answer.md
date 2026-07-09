# Binary Search on Answer

Binary search on answer is a technique for **optimization problems** where you can formulate a **monotonic predicate** $P(x)$: if $P(x)$ is true, then $P(y)$ is true for all $y \geq x$ (or $y \leq x$, depending on direction). This lets you binary search over the answer space instead of iterating over all candidates.

## Core Idea

Given a search range $[\text{lo}, \text{hi}]$ and a predicate $P(x)$ that is monotonic:

- **Minimize**: $P(x) = $ \