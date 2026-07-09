# Hash Segment Tree

Segment tree storing polynomial double hash values, supporting $O(\log n)$ range hash queries and point updates.

## How It Works

Each leaf stores a weighted hash:

$$\text{leaf}[idx] = a_{\text{pos}} \cdot p^{idx} \mod m$$

Internal nodes sum children: $\text{tree}[idx] = \text{tree}[2 \cdot idx] + \text{tree}[2 \cdot idx + 1] \mod m$

**Query normalization** -- divide out the leading power to get a standalone substring hash:

$$\text{hash}(l, r) = \text{query}(l, r) \cdot (p^{l-1})^{-1} \mod m$$

**Point update** -- replace leaf hash: $\text{tree}[\text{leaf}] = v \cdot p^{\text{leaf}} \mod m$, then propagate up.

Two independent hashes with $p_1 = 313, p_2 = 1013$ and $m_1 = 10^9+7, m_2 = 10^9+9$ for collision resistance.

## When to Use

- Substring hash with point updates (dynamic strings)
- Pattern matching in mutable strings
- Palindrome checking with character updates

## Complexity

- **Build**: $O(n)$
- **Query / Update**: $O(\log n)$
- **Space**: $O(n)$