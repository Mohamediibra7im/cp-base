# Inclusion-Exclusion Principle

Corrects over-counting by alternately adding/subtracting intersections.

## Formula

For finite sets $A_1, \dots, A_n$:

$$\left|\bigcup_{i=1}^{n} A_i\right| = \sum_{i} |A_i| - \sum_{i<j} |A_i \cap A_j| + \cdots + (-1)^{n+1} |A_1 \cap \cdots \cap A_n|$$

## Bitmask Approach

Count elements satisfying **none** of $n$ properties:

$$|\overline{A_1} \cap \cdots \cap \overline{A_n}| = \sum_{S \subseteq \\{1,\dots,n\\}} (-1)^{|S|} |\bigcap_{i \in S} A_i|$$

Iterate $2^p$ subsets via bitmask, add/subtract based on parity.

## Applications

- **Coprime counting**: Factor $n$, IE over prime subsets
- **Divisibility**: Count in $[1,n]$ divisible by at least one divisor
- **Derangements**: $D_n = n! \sum_{k=0}^{n} \frac{(-1)^k}{k!}$

## When to Use

- "How many from 1 to N NOT divisible by any of these?"
- Small property/prime set ($p \leq 20$)
- "At least one" or "none" conditions

## Complexity

- **Time**: $O(2^p \cdot p)$ | **Space**: $O(p)$

## Usage

\