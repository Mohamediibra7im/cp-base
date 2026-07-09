# CP-Base JSON Template Generation Instructions

You can use the instructions and prompts in this file to ask any AI agent to generate template configuration JSON files that are ready to import into the CP-Base Admin Panel.

## JSON Schema Specification

The JSON configuration file must adhere to the following schema:

```json
{
  "title": "String - The user-friendly title of the template (e.g. 'Segment Tree')",
  "slug": "String - URL-friendly, lower-case, hyphen-separated identifier (e.g. 'segment-tree')",
  "description": "String - Short single-line explanation of the template and its purpose",
  "categorySlug": "String - Slug of the category it belongs to (e.g. 'data-structures', 'math', 'graphs', 'strings', 'geometry', 'utilities')",
  "tags": ["Array of Strings - Keywords related to the algorithm for search boosting (e.g. ['segtree', 'range-query'])"],
  "notes": "String (Markdown) - Detailed notes, explanations, complexity tables, and sample usage. LaTeX math equations can be wrapped in $$ (e.g. $$O(N \\log N)$$). Escape newlines with \\n",
  "codes": [
    {
      "language": "String - Language key ('cpp', 'python', 'java', 'rust', 'go', 'javascript')",
      "code": "String - Complete copy-paste ready code implementation. Escape newlines with \\n"
    }
  ]
}
```

## AI Agent Prompt (Copy & Paste)

Send the following prompt to any AI coding assistant to generate the JSON file:

---
**PROMPT START**
Please generate a CP-Base template JSON file for the following algorithm.

Follow these strict JSON structure rules:
1. `title`: Standard capitalized algorithm name.
2. `slug`: URL-friendly lower-case hyphenated slug.
3. `description`: 1-sentence summary of when/why to use it.
4. `categorySlug`: Match one of the categories (e.g. "data-structures", "graphs", "math", "strings", "dynamic-programming", "geometry", "utilities", "combinatorics", "number-theory", "binary-search", "bit-manip", "algebra").
5. `tags`: List of 3-6 relevant lowercase tags.
6. `notes`: Comprehensive explanation in GitHub-Flavored Markdown. Include:
   - When to Use (bullet points)
   - Complexity details (using Markdown tables & LaTeX math wrapped in $$ like $$O(N)$$)
   - Short explanation of how it works.
7. `codes`: Array of code snippets. Standard language tags: "cpp", "python", "java".

Here is the source code and details:
[INSERT YOUR CODE & RAW NOTES HERE]
**PROMPT END**
---

## Example JSON File

```json
{
  "title": "Binary Search on Answer",
  "slug": "binary-search-on-answer",
  "description": "Binary search over a monotonic predicate to find the optimal answer in logarithmic time.",
  "categorySlug": "binary-search",
  "tags": ["binary-search", "monotonic", "predicate", "optimization"],
  "notes": "## Monotonic Predicate Binary Search\\n\\nUse this template when you need to find the minimum/maximum valid value where the check function transitions from false to true (or vice-versa).\\n\\n### Complexity\\n| Operation | Time Complexity | Space Complexity |\\n| :--- | :--- | :--- |\\n| Search | $$O(\\\log(\\\text{range}) \\\cdot f(\\\text{check}))$$ | $$O(1)$$\\n",
  "codes": [
    {
      "language": "cpp",
      "code": "#include <bits/stdc++.h>\\nusing namespace std;\\n\\nbool check(long long val) {\\n    // Monotonic checker\\n    return true;\\n}\\n\\nlong long binarySearch(long long low, long long high) {\\n    long long ans = -1;\\n    while (low <= high) {\\n        long long mid = low + (high - low) / 2;\\n        if (check(mid)) {\\n            ans = mid;\\n            high = mid - 1; // Find smaller valid value\\n        } else {\\n            low = mid + 1;\\n        }\\n    }\\n    return ans;\\n}"
    }
  ]
}
```
