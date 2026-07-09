# Binary Search on Number

Binary search is a divide-and-conquer algorithm that locates a target value within a **sorted** array by repeatedly halving the search interval. At each step, the midpoint is compared to the target: if equal, the search ends; if the midpoint is less, the right half is discarded; otherwise the left half is discarded.

Given sorted array $A[0 \\ldots n-1]$ and target $k$, maintain an inclusive interval $[L, R]$ where $k$ may exist. Compute the midpoint $M = L + \lfloor (R - L) / 2 \rfloor$. If $A_M = k$, return $M$. If $A_M < k$, set $L = M + 1$; otherwise set $R = M - 1$. Repeat until $L > R$, at which point the target is absent.

> **Overflow-safe midpoint**: Always use $M = L + \lfloor (R - L) / 2 \rfloor$ instead of $\lfloor (L + R) / 2 \rfloor$. The latter can overflow when $L + R > 2^{31} - 1$ for signed 32-bit integers.

\