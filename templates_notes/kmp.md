# KMP Algorithm

Linear-time pattern matching leveraging previously matched characters to avoid redundant comparisons.

## Prefix Function

$$\pi[i] = \max\{k : s[0..k-1] = s[i-k+1..i],\; k < i+1\}$$

For each $i$, maintain $j = \pi[i-1]$: if $s[i] = s[j]$ extend ($\pi[i] = j+1$), else fallback ($j = \pi[j-1]$) until $j=0$.

## Pattern Matching

Concatenate $t = p + \# + s$ (sentinel prevents overlap). Compute $\pi$ on $t$. Match when $\pi[i] = |p|$ at position $i - 2|p|$ in $s$.

## When to Use

- Pattern matching (find all occurrences)
- String periodicity: period $p$ iff $\pi[|s|-1] \geq |s| - p$ and $p \mid |s|$
- Multi-pattern matching via $p_1\#p_2\#\cdots\#p_k\#s$

## Complexity

- **Time**: $O(n + m)$ where $n = |s|$, $m = |p|$
- **Space**: $O(n + m)$