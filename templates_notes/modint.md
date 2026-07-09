# Modular Integer (ModInt)

A **wrapper type** for modular arithmetic that automatically applies $\bmod \text{MOD}$ after every operation. This eliminates a common source of bugs in competitive programming: forgetting to reduce modulo at intermediate steps.

## Design Philosophy

### Why operator overloading?

In CP, problems frequently require computing expressions like:

$$\binom{n}{k} \cdot k! \cdot a^{n-k} \pmod{\text{MOD}}$$

Without ModInt, this requires writing $\\% \text{MOD}$ after every multiplication, addition, and division — error-prone and verbose. ModInt makes the code read like textbook math:

\