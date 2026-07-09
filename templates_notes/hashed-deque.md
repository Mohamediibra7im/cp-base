# Hashed Deque

Double-ended queue maintaining a rolling polynomial double hash for $O(1)$ equality comparison.

## How It Works

Hash of sequence $a_0, a_1, \\ldots, a_{n-1}$:

$$H = \sum_{i=0}^{n-1} a_i \cdot b^{n-1-i} \\mod m$$

### Push Back

$$H' = (H \cdot b + x) \\mod m$$

### Push Front

$$H' = (x \cdot b^{\text{len}} + H) \\mod m$$

### Pop Back

$$H' = (H - a_{\text{len}-1}) \cdot b^{-1} \\mod m$$

where $b^{-1} = b^{m-2} \\mod m$ (Fermat's little theorem).

### Pop Front

Remove $a_0$ (contribution $a_0 \cdot b^{\text{len}-1}$):

$$H' = H - a_0 \cdot b^{\text{len}-1} \\mod m$$

## When to Use

- $O(1)$ equality comparison of two deques/sequences
- Sliding window hashing with dynamic front/back operations
- Palindrome checking on a deque structure

## Complexity

- **Push/Pop**: $O(1)$ per operation
- **Equality**: $O(1)$
- **Init**: $O(N)$ to precompute powers and inverses