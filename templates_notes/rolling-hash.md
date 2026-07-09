# Rolling Hash (Polynomial Double Hash)

Polynomial rolling hash for $O(1)$ substring comparison with double hashing for collision resistance.

## How It Works

### Hash Computation

For a string $s$ of length $n$, define the polynomial hash:

$$H(s) = \sum_{i=0}^{n-1} s[i] \cdot p^{n-1-i} \\mod m$$

Using prefix hashes $H[i] = H(s[0..i-1])$, the hash of substring $s[l..r]$ (1-indexed) is:

$$\text{hash}(l, r) = H[r] - H[l-1] \cdot p^{r-l+1} \\mod m$$

This follows from:

$$H[r] = H[l-1] \cdot p^{r-l+1} + \sum_{i=l}^{r} s[i] \cdot p^{r-i} \\mod m$$

### Double Hashing

Use two independent hash pairs $(p_1, m_1)$ and $(p_2, m_2)$ to reduce collision probability. Two substrings are equal iff both hash components match. The probability of collision is $O(1/m_1 m_2) \approx 10^{-18}$.

### Anti-Hack (Randomized Parameters)

Bases and moduli are chosen randomly at runtime from a set of safe primes:

| Parameter | Possible Values |
|-----------|----------------|
| Bases | 307, 509, 1009, 2003, 3001, 4001 |
| Moduli | $10^9+7$, $10^9+9$, $10^9+21$, $10^9+33$, $10^9+87$, $10^9+93$ |

Randomization prevents adversarial hash collisions in contest settings. The \