# Binary Exponentiation

Compute $a^n$ in $O(\log n)$ multiplications by exploiting binary representation of $n$.

## Algorithm

Decompose $n = \sum b_i \cdot 2^i$. Then $a^n = \prod_{b_i=1} a^{2^i}$. Repeatedly square the base; multiply into result when the current bit is set.

**Iterative**: Start with $\text{result}=1$. While $n>0$: if $n\\ \\&\\ 1$, multiply result by base. Square base, right-shift $n$. For modular variant, reduce mod $m$ after each multiplication.

## When to Use

- **Modular exponentiation**: $a^n \bmod m$ for large $n$
- **Matrix exponentiation**: $A^n$ for Fibonacci, linear recurrences
- **Permutation exponentiation**: Apply a permutation $k$ times
- **Graph problems**: Walks of length $k$ via adjacency matrix powers

## Complexity

- **Time**: $O(\log n)$ multiplications
- **Space**: $O(1)$ iterative, $O(\log n)$ recursive