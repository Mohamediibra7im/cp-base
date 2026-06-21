# CP-Base — Project Reference

> Full plan, decisions, stack, and state for the CP-Base website.
> Created from Claude conversation — pick up any session from zero.

---

## 1. Project Overview

A polished Next.js website to host competitive-programming (CP) templates,
organized by category, with an admin panel to add/edit templates easily.

**Target directory:** `/home/midoriya/Documents/CP-Park/cp-templates-hub`

---

## 2. Stack (all latest versions confirmed)

| Layer | Choice | Version |
|-------|--------|---------|
| Framework | Next.js (App Router) | **16.2.9** |
| Runtime | Bun | **1.3.14** |
| Node | Node | **v24.16.0** |
| Styling | Tailwind CSS v4 + shadcn/ui (new-york, OKLCH) | **4.11.0** (shadcn) |
| Animation | Aceternity UI (MIT, via shadcn registry) + `motion` | registry |
| DB | Neon Postgres + Drizzle ORM | latest |
| Auth | Cookie-based password gate (env `ADMIN_PASSWORD`) | custom |
| Syntax Highlight | Shiki (C++, Python, Java, Rust, Go, JS) | latest |
| Icons | `lucide-react` + `react-icons` | latest |
| Toast | `sonner` | via shadcn |
| Bundler | Turbopack (Next.js 16 default) | built-in |

### Next.js 16 specifics
- Explicit caching via Cache Components (not `getServerSideProps`)
- Async-only request APIs: `await params`, `await cookies()`, `await headers()`
- Turbopack is the default bundler (no `--turbopack` flag needed)
- React 19

---

## 3. Design Decisions (all confirmed by user)

| Decision | Choice |
|----------|--------|
| Visual style | **Dark neon / aurora** theme (dark default, light toggle) |
| DB storage | **Neon Postgres** (serverless) |
| DB setup time | Scaffold now, user adds `DATABASE_URL` later |
| Auth method | **Simple password gate** (single `ADMIN_PASSWORD` env var) |
| Admin access | Cookie-based httpOnly signed cookie, middleware protects `/admin/*` |
| Languages supported | C++, Python, Java, Rust, Go, JavaScript |
| Syntax highlighter | **Shiki** (not prism or react-syntax-highlighter) |
| Seed data | Yes — seed a few example templates on setup |
| Component source | Aceternity UI free components (MIT) via shadcn registry |
| Icons | `lucide-react` + `react-icons` |

---

## 4. Database Schema (Drizzle ORM)

Three tables in `src/db/schema.ts`:

### `categories`
| Column | Type | Notes |
|--------|------|-------|
| `id` | serial / uuid PK | auto-increment |
| `name` | text | e.g. "Graphs" |
| `slug` | text | unique, for URL |
| `description` | text | nullable |
| `icon` | text | Lucide icon name |
| `color` | text | hex or tailwind color |
| `order` | integer | sort order |

### `templates`
| Column | Type | Notes |
|--------|------|-------|
| `id` | serial / uuid PK | |
| `title` | text | |
| `slug` | text | unique |
| `description` | text | |
| `categoryId` | integer FK → categories.id | |
| `tags` | text[] | array of strings |
| `difficulty` | text | "easy", "medium", "hard" |
| `complexity` | text | e.g. "O(n log n)" |
| `notes` | text | nullable, markdown |
| `createdAt` | timestamp | default now |
| `updatedAt` | timestamp | auto-update |

### `template_codes`
| Column | Type | Notes |
|--------|------|-------|
| `id` | serial / uuid PK | |
| `templateId` | integer FK → templates.id | |
| `language` | text | "cpp", "python", "java", "rust", "go", "javascript" |
| `code` | text | the actual template code |

---

## 5. Route Structure

```
/
├── (public)
│   ├── page.tsx                    # Hero + category bento grid
│   ├── category/[slug]/page.tsx   # Templates in a category
│   └── template/[slug]/page.tsx   # Single template with code viewer
│
├── admin/
│   ├── page.tsx                    # Admin dashboard (template list)
│   ├── login/page.tsx             # Password login form
│   ├── templates/
│   │   ├── new/page.tsx           # Create template form
│   │   └── [id]/edit/page.tsx     # Edit template form
│   └── categories/                # (optional) category CRUD
│       ├── page.tsx
│       ├── new/page.tsx
│       └── [id]/edit/page.tsx
│
└── api/
    └── admin/
        ├── login/route.ts          # POST: verify password, set cookie
        ├── logout/route.ts         # POST: clear cookie
        ├── templates/route.ts      # GET (list), POST (create)
        └── templates/[id]/route.ts # GET, PUT, DELETE
```

---

## 6. Component Tree

```
src/components/
├── code-block.tsx          # Shiki highlight + copy button
├── template-card.tsx       # Card for template listings
├── category-card.tsx       # Card for category grid
├── language-tabs.tsx       # Tab switcher for multi-language code
├── search-command.tsx      # ⌘K global search (shadcn command)
├── theme-toggle.tsx        # Dark/light toggle
├── nav-bar.tsx             # Top navigation
├── admin-sidebar.tsx       # Admin layout sidebar
└── providers.tsx           # Theme provider + sonner
```

---

## 7. Shadcn Components to Add

```
button card dialog input textarea select badge
dropdown-menu sonner sheet tabs label
scroll-area separator skeleton command
```

### Aceternity components to add (free tier)
From https://ui.aceternity.com/components:
- `background-beams` — hero background
- `bento-grid` — category grid on home
- `card-hover-effect` — template cards
- `spotlight` — hero spotlight
- `text-generate-effect` — hero title animation
- `aurora-background` — dark neon feel
- `floating-navbar` — navigation

Check each component's page for its shadcn registry add command
(e.g. `bunx shadcn@latest add https://ui.aceternity.com/registry/...`)

---

## 8. Auth Flow

```
Request /admin/*
  → middleware.ts checks for auth cookie
  → No cookie? Redirect to /admin/login
  → Valid cookie? Allow through

POST /api/admin/login
  → Body: { password: string }
  → Compare against ADMIN_PASSWORD env var
  → Match? Set httpOnly signed cookie, return 200
  → No match? Return 401

POST /api/admin/logout
  → Clear auth cookie
```

**Env vars needed:**
```
DATABASE_URL=postgresql://...
ADMIN_PASSWORD=your-secure-password
```

---

## 9. Seed Data Plan

5 categories:
1. **Graphs** — icon: `GitBranch`, color: `#22c55e`
2. **Data Structures** — icon: `Layers`, color: `#3b82f6`
3. **Dynamic Programming** — icon: `Zap`, color: `#f59e0b`
4. **Math / Number Theory** — icon: `Sigma`, color: `#a855f7`
5. **Strings** — icon: `Text`, color: `#ec4899`

Example templates per category (C++ code):
- Data Structures: DSU (Disjoint Set Union), Segment Tree
- Math: Sieve of Eratosthenes, ModPow
- Strings: KMP (Knuth-Morris-Pratt)
- Graphs: Dijkstra, DFS

---

## 10. Current State (as of last session)

| Item | Status |
|------|--------|
| Project scaffold | ❌ **Not done** — directory empty |
| bun install | ❌ Not done |
| shadcn init + add | ❌ Not done |
| Drizzle schema + config | ❌ Not done |
| DB seed | ❌ Not done (needs DATABASE_URL) |
| Auth middleware | ❌ Not done |
| Public pages | ❌ Not done |
| Admin panel | ❌ Not done |
| Components | ❌ Not done |

**Blockers:** None — clean start. All tooling confirmed available
(Bun 1.3.14, Node 24, latest Next 16.2.9 in registry).

---

## 11. Aceternity Registry Notes

Aceternity components are MIT licensed and added via shadcn CLI from their registry.
Each component page at https://ui.aceternity.com/components/<name> shows the exact
`shadcn add` command. They live in your `src/components/ui/` directory — no runtime
dependency.

Example:
```bash
bunx shadcn@latest add https://ui.aceternity.com/registry/background-beams
```

Check each component page for the exact URL. The CLI will prompt you to install
dependencies (motion, clsx, tailwind-merge, etc.) automatically.

---

## 12. Key Links

- Aceternity UI components: https://ui.aceternity.com/components
- shadcn/ui: https://ui.shadcn.com
- Lucide icons: https://lucide.dev/icons
- React Icons: https://react-icons.github.io/react-icons
- Drizzle docs: https://orm.drizzle.team
- Neon Postgres: https://neon.tech
- Shiki: https://shiki.style
- Next.js 16: https://nextjs.org/docs
