# CP-Base — Project Guide (for AI agents & new devs)

> Read this first. It's the fast-path map of the whole project: stack, conventions,
> data model, API surface, features, gotchas. Keep it updated when you change architecture.

---

## 1. What this is

**CP-Base** is a terminal/retro-BIOS themed **competitive-programming template library** with:
- A curated library of algorithm/data-structure **templates** (multi-language code + Markdown notes).
- **Categories** to organize templates.
- A **live contest calendar** (Codeforces, AtCoder, LeetCode, CodeChef).
- **CP profile** widget (Codeforces stats).
- A **public contribution system** (submit new templates / request edits) with admin review + email.
- **Template version history** with revert.
- An interactive **CLI console** overlay (backtick key) and heavy retro theming (scanlines, matrix rain, CRT flicker, sound fx).
- An **admin dashboard** (password-gated) to manage everything.

Single deploy target: **Vercel**. Data: **Neon Postgres** (serverless).

---

## 2. Stack

| Concern | Choice |
|---|---|
| Framework | **Next.js 16.2.9** (App Router, Turbopack) |
| Runtime/pkg mgr | **Bun** |
| React | 19.2 |
| DB | **Neon Postgres** via `@neondatabase/serverless` |
| ORM | **Drizzle** (`drizzle-orm` + `drizzle-kit`) |
| Styling | **Tailwind CSS v4** (`@tailwindcss/postcss`), `tw-animate-css` |
| UI prims | Radix UI + `@base-ui/react` + shadcn-style wrappers in `src/components/ui` |
| Icons | `lucide-react`, `react-icons` |
| Animation | `framer-motion` / `motion` |
| Search | `fuse.js` (fuzzy) |
| Auth | `jose` (JWT-ish) + password cookie |
| Syntax highlight | `shiki` |
| Math | `katex` |
| Code format | `@wasm-fmt/clang-format` |
| Email | `nodemailer` (SMTP) |
| Toasts | `sonner` |

---

## 3. ⚠️ Critical gotchas (read before coding)

1. **This is NOT the Next.js in your training data.** Next 16 has breaking changes. When unsure about an API, read `node_modules/next/dist/docs/`. Heed deprecation notices.
2. **Middleware is `src/proxy.ts`, not `middleware.ts`.** Next 16 renamed it. It exports `proxy(request)` + `config.matcher`.
3. **`params` are async.** Route/page params are `Promise` — `const { slug } = await params;`.
4. **Route handlers that read `searchParams`/DB must be dynamic.** Add `export const dynamic = "force-dynamic";` where freshness matters (e.g. history route).
5. **Notes render from the DB, NOT `.md` files.** Template display reads `templates.notes`. (There's a legacy `templates_notes/*.md` + `/api/admin/notes` file store still used by the admin edit page load and save; the public template page ignores it. Don't reintroduce md-file rendering on public pages.)
6. **DB writes go to a live Neon instance.** Migrations are additive; still be careful. Use `bun run db:generate` then `bun run db:migrate`.
7. **Admin API routes are NOT auth-protected by the proxy.** `proxy.ts` matcher is `/admin/:path*` only — it does **not** cover `/api/admin/*`. Those endpoints are effectively public (obscurity only). The public contribution forms rely on this to read `/api/admin/categories` and `/api/admin/templates`. If you lock down admin APIs, you must give the contribute forms their own public read endpoints.

---

## 4. Commands

```bash
bun install
bun run dev            # dev server (Turbopack)
bun run build          # production build (use to typecheck the whole app)
bun run start          # prod server
bun run lint
bun run db:generate    # generate a Drizzle migration from schema.ts
bun run db:migrate     # apply migrations to Neon (uses .env.local)
bun run db:seed        # seed script (src/db/seed.ts)
npx tsc --noEmit       # fast typecheck
```

Migrations live in `drizzle/`. Config: `drizzle.config.ts` (schema `./src/db/schema.ts`, dialect postgres).

---

## 5. Environment variables

```
DATABASE_URL=postgresql://...neon.tech/neondb   # required
ADMIN_PASSWORD=...                               # admin login + session cookie value
NEXT_PUBLIC_SITE_URL=https://cp-base.vercel.app  # canonical URL (metadata/sitemap/emails)

# Contribution approval/rejection emails (nodemailer SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=you@example.com
SMTP_PASS=app-password
SMTP_FROM="CP-Base <noreply@cp-base.net>"

# Optional profile widget handles (defaults exist in code)
CODEFORCES_HANDLE=...
# (AtCoder / LeetCode handles similar; see src/app/api/profiles/route.ts)
```

`.env.example` documents the required set. Emails no-op (logged, non-blocking) if SMTP unset.

---

## 6. Directory map

```
src/
  proxy.ts                      # middleware (admin auth gate) — NOT middleware.ts
  db/
    index.ts                    # getDb() lazy Neon+Drizzle singleton; exports { schema }
    schema.ts                   # ALL tables + relations (source of truth)
    seed.ts                     # seed script
  lib/
    email.ts                    # nodemailer transporter + approval/rejection HTML emails
    template-history.ts         # snapshotTemplate(db, templateId, reason, contributionId?)
    format-code.ts              # clang-format wasm wrapper
    theme-presets.ts            # terminal color themes
    utils.ts                    # cn() etc.
  app/
    layout.tsx                  # root layout, fonts, Providers, structured data (JSON-LD)
    metadata.ts                 # site-wide SEO/OG metadata
    page.tsx                    # homepage (hero, profiles, contests, categories) — sections toggleable
    templates/page.tsx          # full templates listing + search
    template/[slug]/page.tsx    # template detail (code tabs, notes, contributors)
    template/[slug]/opengraph-image.tsx
    category/[slug]/page.tsx    # category page
    contribute/                 # PUBLIC contribution flow
      page.tsx                  #   landing (new vs edit)
      new/page.tsx              #   submit new template form
      edit/page.tsx             #   request edit on existing template (pre-fills code+notes)
    admin/
      login/page.tsx
      (dashboard)/layout.tsx
      (dashboard)/page.tsx      # dashboard: templates/categories/contributions/sections/stats tabs
      (dashboard)/templates/new/page.tsx
      (dashboard)/templates/[id]/edit/page.tsx   # BIOS-style editor + History tab (revert/delete)
    api/                        # see §8
    icon.tsx apple-icon.tsx opengraph-image.tsx manifest.ts robots.ts sitemap.ts not-found.tsx
  components/                   # see §7
    ui/                         # shadcn-style primitives
```

---

## 7. Key components

- `theme-provider.tsx` — `useTerminalTheme()` context: theme color, scanlines, flicker, sound, matrix toggles, and sound fx `playClick/playBeep/playSuccess`. Used everywhere.
- `cli-console.tsx` — backtick-toggled terminal overlay with commands (`ls`, `cd`, `cat`, `theme`, `scanlines`, `matrix`, `sudo rm -rf /` easter egg…).
- `nav-bar.tsx` — top nav (Categories, Templates, **Contribute**), fuzzy search, mobile sheet.
- `footer.tsx` — retro system-monitor footer.
- `contest-calendar.tsx` — per-platform tabbed calendar; data from `/api/contests`.
- `cp-profiles.tsx` — CF profile widget; data from `/api/profiles`.
- `template-card.tsx` / `templates-list.tsx` — listing cards (Fuse search).
- `code-block.tsx` / `language-tabs.tsx` — Shiki-highlighted multi-language code with copy.
- `math-renderer.tsx` — Markdown + KaTeX (handles `%%MATH_BLOCK%%` / inline placeholders, incl. inside table cells).
- `markdown-editor.tsx` — notes editor (admin).
- `like-button.tsx` — like counter → `/api/templates/like`.
- Eye-candy: `matrix-rain.tsx`, `particle-field.tsx`, `animated-counter.tsx`, `retro-settings.tsx`.

---

## 8. Database schema (`src/db/schema.ts`)

All access via `getDb()` from `src/db`. `getDb()` returns `null` if `DATABASE_URL` unset — **always null-check**.

**`categories`** — id, name, slug(unique), description, icon, color, order, hidden.

**`templates`** — id, title, slug(unique), description, categoryId→categories(cascade), tags[], complexity, notes, createdAt, updatedAt, hidden, copyCount, likeCount, **contributorName**, **contributorCfHandle**.
- The two contributor columns hold the "primary/last" credit + legacy fallback. The full contributor list is derived from `contributions` (see §9).

**`templateCodes`** — id, templateId→templates(cascade), language, code. One row per language tab.

**`siteSettings`** — key(pk), value. Homepage section toggles: `show_hero_section`, `show_profiles_section`, `show_contests_section`, `show_categories_section` (string `"false"` disables).

**`contributions`** — public submissions/edit-requests:
- type `"new" | "edit"`, status `"pending" | "approved" | "rejected"`.
- contributor: contributorName, contributorEmail, contributorCfHandle.
- for `new`: title, slug, description, categoryId, tags[], complexity, notes, codes(jsonb `[{language,code}]`).
- for `edit`: templateId→templates, editReason, editCodes(jsonb), editNotes.
- adminNote, createdAt, reviewedAt. On approve of `new`, `templateId` is set to the created template.

**`templateHistory`** — version snapshots for revert:
- id, templateId→templates(cascade), **contributionId** (links a snapshot to the contribution that triggered it), full field snapshot (title, slug, description, categoryId, tags[], complexity, notes, hidden, contributorName, contributorCfHandle), codes(jsonb), reason, createdAt.

Relations are defined for all FKs (see bottom of `schema.ts`).

---

## 9. Features & flows

### Templates & categories
- Public: homepage, `/templates` (Fuse search), `/category/[slug]`, `/template/[slug]`.
- Admin CRUD via dashboard + `/api/admin/templates` & `/api/admin/categories`.
- `template/[slug]` shows code tabs, notes (Markdown+KaTeX from DB), like button, and a **Contributors** panel.

### Contributors (GitHub-style)
- On the template page, the full contributor list is **derived from approved `contributions`** for that `templateId` (deduped by name+handle, oldest-first). `type:"new"` → **creator**, `type:"edit"` → editor.
- **Avatars**: real Codeforces photo (batched `user.info` call, filters placeholder) when a handle exists; otherwise a deterministic DiceBear identicon. Names with a handle link to `codeforces.com/profile/<handle>`.
- Legacy fallback: if no contribution rows, uses `templates.contributorName/CfHandle`.

### Contribution system (public, no auth)
1. `/contribute` → choose New or Edit.
2. `/contribute/new` → contributor info (name*, email*, CF handle) + template fields + multi-language code + notes → `POST /api/contributions`.
3. `/contribute/edit` → search/select template (loads code **and current notes pre-filled** so notes aren't wiped), give edit reason, modify code/notes → `POST /api/contributions`.
4. Admin dashboard **Contributions tab**: filter by status, pending badge, expandable detail, **approve**/**reject** (with note) → `PUT /api/admin/contributions`.
   - Approve `new`: inserts template (+codes), sets credit, **auto-uniquifies slug** on collision, emails contributor.
   - Approve `edit`: **snapshots current version** (linked to the contribution), applies code/notes, updates credit, emails.
   - Reject: emails contributor with optional admin note.
5. **Delete a contribution** (`DELETE /api/admin/contributions?id=`):
   - Approved **edit** → **auto-reverts** the template to the pre-edit snapshot (fields+code+prior credit), purges that contributor's history snapshot, takes a safety snapshot first. (Reverting a mid-stack edit rolls back to before it; delete newest-first for clean results.)
   - Approved **new** → keeps the published template, strips the credit.
   - Emails are NOT sent on delete.

### Template history + revert
- Every admin save (`PUT /api/admin/templates`) and every approved edit snapshots the **prior** state into `templateHistory` (best-effort, never blocks the edit).
- Admin edit page → **History tab**: lists snapshots (newest-first by `id`), expandable preview, **Revert** (snapshots current first, then restores — so revert is undoable), single + **multi-select delete** of snapshots.
- History API is `no-store` + `force-dynamic` (avoids stale lists that caused wrong-target reverts).

### Contest calendar
- `/api/contests?platform=codeforces|atcoder|leetcode|codechef|all`.
- CF: official JSON API (phase BEFORE). AtCoder: HTML scrape of upcoming table. LeetCode: GraphQL `allContests`. CodeChef: JSON API (future+present). All fetched in parallel, independent `.catch(()=>[])`, no fallback data.

### CP profiles
- `/api/profiles` — Codeforces `user.info` + `user.status`. Handle from `CODEFORCES_HANDLE` env (default in code).

### Admin auth
- `src/proxy.ts` gates `/admin/*` (except `/admin/login`): checks `admin_session` cookie === `ADMIN_PASSWORD`, else redirect to login.
- `POST /api/admin/login` sets cookie; `POST /api/admin/logout` clears it.
- **Reminder**: `/api/admin/*` handlers themselves are not gated (see §3.7).

### Theming / retro
- `useTerminalTheme()` drives color themes (green/amber/cyan/red/purple), CRT scanlines, flicker, matrix rain, and Web-Audio sound fx. Toggle via CLI console or `retro-settings`.

---

## 10. API reference

Public:
- `POST /api/contributions` — submit new/edit contribution (validated; no auth).
- `GET /api/contests?platform=` — upcoming contests.
- `GET /api/profiles` — CF profile stats.
- `POST /api/templates/copy` — increment copyCount.
- `POST /api/templates/like` — like/unlike.

Admin (not proxy-gated — see §3.7):
- `GET/POST/PUT/DELETE /api/admin/templates` — template CRUD (PUT snapshots history first).
- `GET/POST/PUT/DELETE /api/admin/templates/history` — list / revert(POST {historyId}) / delete(?id or {ids:[]}).
- `GET/POST/PUT/DELETE /api/admin/categories`.
- `GET /api/admin/contributions` (list), `PUT` (approve/reject), `DELETE` (delete + auto-revert).
- `GET/PUT /api/admin/notes` — legacy `.md` note file store (admin edit page).
- `GET/POST /api/admin/settings` — homepage section toggles.
- `POST /api/admin/login`, `POST /api/admin/logout`.

Response convention: `NextResponse.json`; DB-missing → `{ error }` 500; validation → 400; not found → 404.

---

## 11. Conventions

- **Styling**: match the existing retro/terminal aesthetic — mono fonts, `[ bracketed ]` button labels, `$ command` prompts, borders over shadows, `border`+`bg-*/5` chips, traffic-light dots. Avoid thick single-side accent borders (flagged by the design hook).
- **Client vs server**: pages are server components by default; interactive bits are `"use client"` and use `useTerminalTheme()` for sound/theme.
- **Match surrounding code** density and idiom when editing a file.
- **Validation** on public POSTs (contributions) is server-side and defensive.
- After schema changes: `db:generate` → `db:migrate`, then `bun run build` to typecheck.

---

## 12. Known caveats / TODO candidates

- `/api/admin/*` unauthenticated (intentional-ish; contribute forms depend on it). Locking down requires public read endpoints for categories/templates.
- Reverting a **mid-stack** edit (older edit with newer edits on top) rolls the template back to before that edit; newer work is preserved only in history, not live.
- Admin edit page still loads/saves notes to the legacy `.md` store in addition to DB; public rendering uses DB only.
- History snapshots only exist from when a template is first edited (no snapshot at creation).
- Contribution `contributionId` history link exists only for contributions approved after that feature landed; older ones fall back to credit-strip on delete.
- No spam/rate-limit on public contribution POST (chosen: fully public).

---

_Last updated: keep this current when you change schema, routes, or core flows._
