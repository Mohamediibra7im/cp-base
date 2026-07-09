# Burnside's Lemma

Counts distinct objects under a group action (e.g., necklace rotations).

## Formula

Let $G$ act on finite set $X$. Number of distinct orbits:

$$|X/G| = \frac{1}{|G|} \sum_{g \in G} |X^g|$$

where $X^g = \\{x \in X : g \cdot x = x\\}$ (fixed elements).

## Necklace Application

For $n$ beads with $k$ colors under **rotations**, a rotation by $i$ positions fixes $k^{\\gcd(i,n)}$ colorings:

$$\text{Necklaces} = \frac{1}{n} \sum_{i=1}^{n} k^{\\gcd(i, n)}$$

## When to Use

- Distinct colorings of a necklace under rotation
- "How many distinct objects up to symmetry?"
- Grid/polygon coloring under rotational symmetry

## Complexity

- **Time**: $O(n \log n)$ for gcd + modular exponentiation
- **Space**: $O(1)$

## Usage

\