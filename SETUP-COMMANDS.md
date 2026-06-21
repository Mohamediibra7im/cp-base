# Setup Commands — CP-Base

> Run these in order to scaffold the full project from scratch.
> All commands run from `/home/midoriya/Documents/CP-Park/cp-templates-hub` unless noted.

---

## Prerequisites

```bash
# Verify tooling
export PATH="$HOME/.bun/bin:$PATH"
bun --version        # should be 1.3.x
node --version       # should be v24.x
bunx next --version  # should be 16.2.x
```

---

## Phase 1: Scaffold Next.js

```bash
# Clean target dir (if retrying)
rm -rf /home/midoriya/Documents/CP-Park/cp-templates-hub/* \
        /home/midoriya/Documents/CP-Park/cp-templates-hub/.* 2>/dev/null

# Create Next.js 16 app
bun create next-app@latest /home/midoriya/Documents/CP-Park/cp-templates-hub \
  --typescript --tailwind --eslint --app --src-dir \
  --import-alias "@/*" --yes

cd /home/midoriya/Documents/CP-Park/cp-templates-hub
```

---

## Phase 2: shadcn/ui Init + Components

```bash
# Init shadcn (new-york style, Tailwind v4)
bunx --bun shadcn@latest init

# Add base shadcn components
bunx --bun shadcn@latest add button card dialog input textarea select badge \
  dropdown-menu sonner sheet tabs label scroll-area separator skeleton command
```

---

## Phase 3: Dependencies

```bash
# Core deps
bun add drizzle-orm @neondatabase/serverless dotenv
bun add -D drizzle-kit @types/node

# Syntax highlighting
bun add shiki

# Icons
bun add lucide-react react-icons

# Auth cookie signing
bun add jose

# Aceternity deps (will also be auto-installed by shadcn add)
bun add motion clsx tailwind-merge class-variance-authority
```

---

## Phase 4: Aceternity UI Components

Visit each component page for the exact registry URL, then:

```bash
# Example (actual URLs depend on Aceternity's current registry paths):
bunx shadcn@latest add https://ui.aceternity.com/registry/background-beams
bunx shadcn@latest add https://ui.aceternity.com/registry/bento-grid
bunx shadcn@latest add https://ui.aceternity.com/registry/card-hover-effect
bunx shadcn@latest add https://ui.aceternity.com/registry/spotlight
bunx shadcn@latest add https://ui.aceternity.com/registry/text-generate-effect
bunx shadcn@latest add https://ui.aceternity.com/registry/aurora-background
bunx shadcn@latest add https://ui.aceternity.com/registry/floating-navbar
```

> The CLI will prompt for dependency installation — answer yes.
> Components land in `src/components/ui/`.

---

## Phase 5: Drizzle Setup

Create these files (see full schema in PROJECT-REFERENCE.md):

```
src/db/schema.ts      # Tables: categories, templates, template_codes
src/db/index.ts       # Neon client + Drizzle instance
drizzle.config.ts     # Drizzle Kit config
src/db/seed.ts        # Seed data
```

Then:

```bash
# Generate migration
bun run db:generate

# This requires DATABASE_URL to be set — skip until you have Neon DB:
bun run db:migrate
bun run db:seed
```

---

## Phase 6: Environment

```bash
cp .env.example .env.local
# Edit .env.local:
#   DATABASE_URL=postgresql://...
#   ADMIN_PASSWORD=your-secure-password
```

---

## Phase 7: Dev Server

```bash
bun dev
# Opens at http://localhost:3000
```

---

## Phase 8: Build Check

```bash
bun run build
```

---

## Directory Structure After Setup

```
cp-templates-hub/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Home (hero + category grid)
│   │   ├── category/[slug]/page.tsx
│   │   ├── template/[slug]/page.tsx
│   │   ├── admin/
│   │   │   ├── page.tsx          # Dashboard
│   │   │   ├── login/page.tsx
│   │   │   └── templates/
│   │   │       ├── new/page.tsx
│   │   │       └── [id]/edit/page.tsx
│   │   └── api/admin/
│   │       ├── login/route.ts
│   │       ├── logout/route.ts
│   │       └── templates/[...]/route.ts
│   ├── components/
│   │   ├── ui/                   # shadcn + Aceternity components
│   │   ├── code-block.tsx
│   │   ├── template-card.tsx
│   │   ├── category-card.tsx
│   │   ├── language-tabs.tsx
│   │   ├── search-command.tsx
│   │   ├── theme-toggle.tsx
│   │   ├── nav-bar.tsx
│   │   ├── admin-sidebar.tsx
│   │   └── providers.tsx
│   ├── db/
│   │   ├── schema.ts
│   │   ├── index.ts
│   │   └── seed.ts
│   ├── lib/
│   │   └── utils.ts             # cn() helper
│   └── middleware.ts             # Auth gate for /admin
├── drizzle.config.ts
├── .env.example
├── .env.local
└── package.json
```

---

## Notes

- Next.js 16 uses Turbopack by default — no special flag needed
- All API route handlers use `await params` (Next 16 async API)
- Auth cookie uses `jose` for signing (no `jsonwebtoken` needed)
- Shiki is used over `react-syntax-highlighter` for better performance and ESM support
- Aceternity components are MIT — no paid tier needed for the free components
- The `motion` package replaces `framer-motion` (same API, maintained fork)
