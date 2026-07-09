# Mo's Algorithm

Mo's algorithm processes $q$ offline range queries on an array of size $n$ by reordering them to minimize the movement of two pointers. Instead of answering queries in input order, we sort them so that consecutive queries share overlapping ranges, amortizing the cost of adding/removing elements.

## How It Works

### Two-Pointer Approach

Maintain two pointers \