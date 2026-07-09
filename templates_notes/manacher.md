# Manacher's Algorithm

Finds all palindromic substrings in $O(n)$ time by exploiting symmetry.

## How It Works

### Transformation

Insert sentinel $\\#$ between characters: $t = \\# a \\# b \\# a \\#$. Every palindrome in $s$ becomes an odd-length palindrome in $t$.

### Palindrome Expansion

For each position $i$ in $t$, compute $p[i] =$ largest radius such that $t[i-k..i+k]$ is a palindrome.

Maintain the rightmost palindrome $[l, r]$ with center $c$. For position $i$:

1. If $i > r$: expand naively ($k = 1$)
2. If $i \leq r$: reuse mirror — $k = \min(p[2c - i],\\; r - i + 1)$
3. Expand while $t[i-k] = t[i+k]$
4. Update $[l, r]$ if palindrome extends past $r$

### Converting Back

| Property | Formula |
|----------|---------|
| Original center | $i / 2$ |
| Palindrome length | $p[i] - 1$ |

Odd palindromes → odd $i$ in $t$. Even palindromes → even $i$ in $t$.

## When to Use

- All palindromic substrings of a string
- Longest palindromic substring
- Palindrome counting / decomposition

## Complexity

- **Time**: $O(n)$ — $r$ never decreases across iterations
- **Space**: $O(n)$