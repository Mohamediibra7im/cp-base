# Bellman-Ford

Single-source shortest path supporting **negative edge weights**. Relaxes all edges V-1 times — each round guarantees correctness for paths with one more edge. Run one extra pass to detect negative cycles (any distance still improving indicates a cycle).

## When to Use

- **Negative weights**: currency exchange, arbitrage detection
- **Negative cycle detection**: identify profitable cycles in constraint graphs
- **Difference constraints**: systems of \