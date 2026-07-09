# Binary Trie

A binary trie stores integers as bit strings of fixed length $B = 30$ (for $\text{int}$). Each node has two children (bit 0 and bit 1). Insertion and deletion traverse from MSB to LSB.

**XOR maximization:** To find the element maximizing $x \\oplus \text{val}$, traverse from MSB to LSB, greedily choosing the **opposite** bit if available.

\