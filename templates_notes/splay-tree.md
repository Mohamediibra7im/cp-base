# Splay Tree

A splay tree is a self-adjusting BST that performs a **splay operation** after every access, moving the accessed node to the root via rotations. This gives $O(\log n)$ amortized time per operation.

**Splay operation:** Three cases:
1. **Zig:** Parent is root — single rotation.
2. **Zig-zig:** Node and parent are same children — rotate parent first, then node.
3. **Zig-zag:** Node and parent are different children — rotate node twice.

\