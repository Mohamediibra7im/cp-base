# Catalan Numbers

Sequence: 1, 1, 2, 5, 14, 42, 132, 429, 1430, ...

## Formulas

**Closed form**: $C_n = \frac{1}{n+1}\binom{2n}{n}$

**Recurrence**: $C_{n+1} = \sum_{i=0}^{n} C_i \cdot C_{n-i}$

## When to Use

- Balanced bracket sequences ($n$ pairs of parentheses)
- Binary tree shapes ($n$ nodes)
- Polygon triangulation ($(n+2)$-gon)
- Dyck paths / lattice paths below diagonal
- Any problem matching Catalan sequence 1, 1, 2, 5, 14, 42, ...

## Complexity

- **Formula**: $O(n)$ with precomputed factorials
- **DP**: $O(n^2)$ time, $O(n)$ space

## Usage

\