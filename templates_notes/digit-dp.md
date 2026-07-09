# Digit DP

A technique for **counting numbers in a range $[L, R]$ that satisfy some digit-level property**. Instead of iterating over all numbers (which is too slow), we process digits from most significant to least significant, building the number one digit at a time while tracking constraints.

## How It Works

### Core Idea

Convert the problem into: **count valid numbers $\le N$** for any upper bound $N$, then use $\text{solve}(L, R) = f(R) - f(L-1)$.

### State Definition

The DP state is defined by:

$$dp(\text{idx}, \text{tight}, \text{started}, \text{custom\\_state})$$

- **idx**: current digit position being processed (0 = most significant)
- **tight**: boolean — whether all digits chosen so far exactly match the prefix of the upper bound. When \