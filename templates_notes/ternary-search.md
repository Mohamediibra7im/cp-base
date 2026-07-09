# Ternary Search

Ternary search finds the **maximum** (or minimum) of a **unimodal function** on a continuous interval $[l, r]$. A unimodal function increases then decreases (for maximum), or decreases then increases (for minimum). At each step, the interval is divided into three equal parts using two interior points $m_1$ and $m_2$, and one-third is eliminated.

## Algorithm (Finding Maximum)

Given a unimodal function $f$ on $[l, r]$:

1. Compute $m_1 = l + \frac{r - l}{3}$ and $m_2 = r - \frac{r - l}{3}$.
2. If $f(m_1) < f(m_2)$, the maximum lies in $[m_1, r]$, so set $l = m_1$.
3. Otherwise, the maximum lies in $[l, m_2]$, so set $r = m_2$.
4. Repeat for a fixed number of iterations (e.g., 200).

After $k$ iterations, the remaining interval has length $\frac{2}{3}^k (r - l)$. With 200 iterations, precision is approximately $10^{-35}$, far beyond double-precision limits.

## Finding Minimum

To find the **minimum** of a unimodal function, simply negate the comparison:

\