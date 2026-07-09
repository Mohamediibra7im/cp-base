# Mo's Algorithm on Trees

Mo's algorithm on trees answers offline path queries on a tree by reducing them to linear range queries on an Euler tour sequence. Combined with LCA (lowest common ancestor) via binary lifting, this handles arbitrary node-to-node path queries.

## How It Works

### Euler Tour Encoding

Perform a DFS from the root, recording each node's entry time \