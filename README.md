<div align="center">

# CP-Base

**A terminal-themed competitive programming template library**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

Copy, paste, and ace your next contest.

[Getting Started](#getting-started) · [Features](#features) · [Tech Stack](#tech-stack) · [Admin Panel](#admin-panel)

</div>

---

## Overview

CP-Base is a modern, terminal-inspired web application for organizing and sharing competitive programming templates. Built for speed and accessibility — find the right algorithm template in seconds, copy it, and focus on solving problems.

## Features

| Feature | Description |
|---------|-------------|
| **Terminal UI** | CRT scanlines, green-on-black aesthetic, monospace everything |
| **Fuzzy Search** | Find templates instantly with intelligent fuzzy matching |
| **Multi-language** | Templates in C++, Python, Java, Rust, Go, and JavaScript |
| **Math Support** | Write LaTeX formulas in notes using `$$` syntax |
| **Syntax Highlighting** | Beautiful code blocks powered by Shiki |
| **Markdown Notes** | Rich editor with live preview for algorithm explanations |
| **Admin Panel** | Full CRUD for managing templates and categories |
| **Responsive** | Works seamlessly on desktop and mobile |

## Tech Stack

```
├── Framework     Next.js 16 (App Router + Turbopack)
├── Language      TypeScript 5
├── Database      Neon Postgres (Serverless)
├── ORM           Drizzle ORM
├── UI            Radix UI + Tailwind CSS 4
├── Search        Fuse.js (Fuzzy Search)
├── Math          KaTeX (LaTeX Rendering)
├── Code          Shiki (Syntax Highlighting)
└── Font          JetBrains Mono
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ or [Bun](https://bun.sh/) 1+
- A [Neon](https://neon.tech) Postgres database (free tier works)

### Installation

```bash
# Clone the repository
git clone https://github.com/midoriya01/cp-templates-hub.git
cd cp-templates-hub

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env.local
```

Edit `.env.local` with your database URL:

```env
DATABASE_URL=postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require
```

### Database Setup

```bash
# Run migrations
bun run db:migrate

# Seed with sample templates (optional)
bun run db:seed
```

### Development

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/              # Admin panel pages
│   ├── api/                # API routes
│   ├── category/           # Category pages
│   ├── template/           # Template detail pages
│   └── templates/          # All templates page
├── components/             # React components
│   ├── ui/                 # Shadcn UI components
│   ├── nav-bar.tsx         # Navigation bar
│   ├── footer.tsx          # Footer
│   ├── template-card.tsx   # Template card component
│   ├── category-card.tsx   # Category card component
│   ├── code-block.tsx      # Syntax highlighted code
│   ├── markdown-editor.tsx # Markdown editor with math
│   └── math-renderer.tsx   # KaTeX math rendering
├── db/                     # Database layer
│   ├── schema.ts           # Drizzle schema
│   ├── index.ts            # Database connection
│   └── seed.ts             # Sample data
└── lib/                    # Utilities
```

## Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start development server |
| `bun run build` | Create production build |
| `bun run start` | Start production server |
| `bun run lint` | Run ESLint |
| `bun run db:generate` | Generate migrations |
| `bun run db:migrate` | Run migrations |
| `bun run db:seed` | Seed sample data |

## Admin Panel

Access the admin panel at `/admin` to:

- Create, edit, and delete templates
- Manage categories with custom icons and colors
- Add code snippets in multiple languages
- Write detailed notes with Markdown and LaTeX math

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Built with ❤️ for competitive programmers

</div>
