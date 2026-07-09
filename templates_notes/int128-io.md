# 128-bit Integer I/O

Read and print __int128 values (GCC extension). Needed when products exceed 64-bit range (e.g., 1e18 * 1e18).

## When to Use

- Intermediate products exceed long long range
- CP judges that support GCC extensions

## Complexity

- Time: $O(digits)$ per read/print
- Not portable: GCC/Clang only\