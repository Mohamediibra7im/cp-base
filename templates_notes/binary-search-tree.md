# Binary Search Tree

A binary search tree (BST) maintains the invariant: for every node, all values in the left subtree are strictly less, and all values in the right subtree are strictly greater. This ordering enables $O(\log n)$ average-case search, insert, and delete.

Insertion compares the target to the current node and descends left or right. Deletion handles three cases: leaf (remove), single child (bypass), and two children (replace with in-order successor, then delete the successor).

\