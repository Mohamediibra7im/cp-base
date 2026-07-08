# CP-Base C++ Template Style Guide

## Code Style

### Headers
- ALWAYS use `#include <bits/stdc++.h>`
- Use `using namespace std;` (CP convention, acceptable for templates)

### Type Aliases
- Use `using ll = long long;` NOT `typedef long long ll;`
- Use `using pii = pair<int, int>;`
- Use `using vi = vector<int>;`
- Use `using vll = vector<ll>;`

### Naming
- Functions: `camelCase` — `binarySearch()`, `modInverse()`, `segmentTree()`
- Constants: `UPPER_CASE` — `const ll MOD = 1e9 + 7;`, `const int MAXN = 2e5 + 5;`
- Variables: `camelCase` — `long long` not `ll` in function params for clarity
- Struct/class members: `camelCase`
- Template parameters: `camelCase`

### Formatting
- 4-space indentation (no tabs)
- Opening brace on same line for functions/control flow
- Space after keywords: `if (`, `for (`, `while (`
- No space before parens in function calls
- Max line length: ~100 chars
- Single blank line between logical sections
- Comments: `//` for inline, `/** */` for function docs

### Function Documentation
Every public/template function gets a brief doc comment:
```cpp
/**
 * @brief One-line description
 * @param paramName Description
 * @return Description
 */
```

### Modulo Arithmetic
- Always define `const ll MOD = 1e9 + 7;` when needed
- Use `% MOD` after every multiplication
- `modAdd`, `modSub`, `modMul`, `modPow` helpers when complex

### Edge Cases to Handle in Code
- Empty input (n=0, empty vector)
- Single element
- Negative numbers where applicable
- Maximum values (overflow protection)
- Return `-1` for "not found" with clear docs

## Notes Format

Every template MUST have comprehensive notes in markdown with LaTeX:

```markdown
# Template Name

One-paragraph explanation of what this does and why it matters in CP.

## Algorithm

Step-by-step explanation of how it works. Use LaTeX for math:
- Time complexity: $O(n \log n)$
- Space complexity: $O(n)$

## Usage

```cpp
// Example showing how to call/use this template
```

## When to Use

- Bullet points of problem patterns that suggest this template
- Common variations or extensions

## Edge Cases

- List of edge cases the code handles
- Common pitfalls to avoid

## Complexity

- Time: $O(...)$
- Space: $O(...)$
```

## Notes Quality Standards

1. **Every formula** must be in LaTeX: `$O(n \log n)$`, `$\binom{n}{k}$`, `$\sum_{i=1}^{n}$`
2. **Include the algorithm explanation** — not just "this does X" but HOW it works
3. **Usage examples** showing real calling code
4. **When to use** section with problem patterns (e.g., "Use when problem asks for shortest path in weighted graph with non-negative edges")
5. **Edge cases** — what can go wrong, what to watch out for
6. **Complexity analysis** — both time and space, with brief justification

## Template Structure in Seed Files

```typescript
const [templateName] = await db.insert(templates).values({
  title: "Human Readable Name",
  slug: "kebab-case-slug",
  description: "One-line description",
  categoryId: categoryId,
  tags: ["tag1", "tag2", "tag3"],
  complexity: "O(log n)",
  notes: `# Template Name
  ... comprehensive notes ...
  `,
}).returning();
if (templateName) {
  await db.insert(templateCodes).values([{
    templateId: templateName.id, language: "cpp", code: stripMain(`...`)
  }]);
}
```

## Recategorization Rules

- Keep existing 12 categories unless there's strong reason to change
- "Utilities" is fine as a catch-all for misc CP tools
- "Algebra" = pure math operations (mod inverse, primitive root, matrix exp)
- "Number Theory" = divisibility, primes, factorization
- "Data Structures" = any container/tree structure
- "Range Queries" = anything querying ranges of arrays
