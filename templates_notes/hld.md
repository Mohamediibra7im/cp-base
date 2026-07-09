# Heavy Light Decomposition

HLD decomposes a tree into **chains** so that any root-to-leaf path crosses at most $O(\log n)$ light edges. This allows path queries to be answered by decomposing into $O(\log n)$ contiguous segments, each queryable with a segment tree.

**Decomposition:**\n1. DFS computes subtree sizes and identifies the **heavy child** (largest subtree).\n2. DFS assigns positions: heavy children continue the chain; light children start new chains.\n\n**Heavy edge:** Connects a node to its largest subtree child. At most one per node.\n\n**Light edge:** All other edges. Crossing one at least doubles subtree size, so $O(\log n)$ light edges per path.\n\n\