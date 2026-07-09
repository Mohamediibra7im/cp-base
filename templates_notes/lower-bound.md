# Lower Bound

Finds the first element \u2265 target using predicate-based binary search. Equivalent to std::lower_bound but with a custom comparator.

## When to Use

- Find first occurrence of a value in sorted array
- Find insertion point for a value
- Binary search on monotonic predicate (first true)

## Complexity

- Time: $O(log n)$
- Space: O(1)\