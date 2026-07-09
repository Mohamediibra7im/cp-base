# Kadane's Algorithm

Finds the **maximum sum of a contiguous subarray** in $O(n)$ time using a single pass.

This is the simplest and most classic linear DP problem. The key insight is that at each position, you only need to decide: **extend the previous subarray or start fresh**.

## How It Works

Define $dp[i]$ as the maximum subarray sum **ending at index $i$** (i.e., the subarray must include $a[i]$).

### Recurrence

$$dp[i] = \max(a[i], \\; dp[i-1] + a[i])$$

- $a[i]$: start a new subarray at position $i$ (discard everything before).
- $dp[i-1] + a[i]$: extend the previous subarray by appending $a[i]$.

The answer is the global maximum:

$$\text{answer} = \max_{0 \le i < n} dp[i]$$

In the template, we track \