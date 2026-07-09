# Primitive Root

A **primitive root** modulo $n$ is $g$ generating the full multiplicative group $(\mathbb{Z}/n\mathbb{Z})^*$, i.e., $\text{ord}_n(g) = \phi(n)$.

## Existence

Primitive root exists iff $n \in \\{1, 2, 4, p^k, 2p^k\\}$ for odd prime $p$, $k \geq 1$. **Every prime** $p$ has one.

## Algorithm (prime $p$)

1. Compute $\phi(p) = p-1$ and factor into distinct primes $q_1, \dots, q_s$.
2. For each $g \in [2, p-1]$: check $g^{\phi(p)/q_i} \\not\equiv 1 \pmod{p}$ for all $q_i$.
3. First $g$ passing all checks is a primitive root.

## When to Use

- **Discrete logarithm**: Baby-Step Giant-Step requires primitive roots
- **NTT**: Need primitive $n$-th root of unity mod $p$
- **Generating all residues**: $g^0, \dots, g^{p-2}$ gives all of $(\mathbb{Z}/p\mathbb{Z})^*$
- **Cryptography**: Diffie-Hellman key exchange

## Complexity

- **Time**: $O(\sqrt{p})$ factoring $\phi(p)$, $O(s \log p)$ per candidate, $O(\log \log p)$ candidates expected
- **Space**: $O(\sqrt{p})$ for prime factors