# Upper Bound (Custom)

Returns the last element strictly less than the target. NOT the same as std::upper_bound (which returns first element > target).

## When to Use

- Find predecessor of a value in sorted array
- Find last element satisfying a predicate
- Complement of lower bound for range queries

## Complexity

- Time: O(log n)
- Space: O(1)\