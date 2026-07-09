# Trie

A trie (prefix tree) stores strings character by character. Each node has $|\\Sigma|$ child pointers and a word-end flag.

**Insertion:** Follow (or create) child pointers for each character. Mark the final node.\n\n**Search:** Follow child pointers; return true only if the final node is a word endpoint.\n\n**Prefix check:** Same as search, without requiring the word-end flag.\n\n**Erasure:** Recursively traverse, decrement frequency, delete nodes with zero frequency.\n\n\