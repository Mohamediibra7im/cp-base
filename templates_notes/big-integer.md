# Big Integer (Arbitrary Precision)

Arbitrary precision integer using base-1e9 storage. Supports +, -, *, comparison. When to Use: when intermediate results exceed 64-bit (e.g., factorial of large n). Complexity: O(n) for add/sub, O(n²) for multiply.

## Why Big Integer in C++?

Unlike Python and Java, C++ has **no built-in arbitrary-precision integer type**. In competitive programming you sometimes need to compute values exceeding $2^{63}-1$ where \