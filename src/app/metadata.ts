import type { Metadata } from "next";

const description =
  "A terminal-themed competitive programming template library with a live contest calendar. Browse algorithms, track upcoming Codeforces, AtCoder, LeetCode & CodeChef contests, and copy-paste optimized templates into your next contest.";

export const metadata: Metadata = {
  title: {
    default: "CP-Base | Competitive Programming Templates & Contest Calendar",
    template: "%s | CP-Base",
  },
  description,
  keywords: [
    "competitive programming",
    "cp templates",
    "algorithms",
    "data structures",
    "code templates",
    "contest",
    "contest calendar",
    "upcoming contests",
    "cp",
    "icpc",
    "codeforces",
    "codeforces contests",
    "atcoder",
    "atcoder contests",
    "leetcode",
    "leetcode contests",
    "codechef",
    "codechef contests",
    "competitive programming calendar",
    "segment tree",
    "graph algorithms",
    "dynamic programming",
    "binary search",
    "number theory",
    "combinatorics",
    "string algorithms",
    "geometry algorithms",
    "range queries",
    "bit manipulation",
    "fenwick tree",
    "disjoint set union",
    "trie",
    "kmp",
    "dijkstra",
    "sieve",
    "matrix exponentiation",
    "sparse table",
    "convex hull trick",
    "modular arithmetic",
    "cpp templates",
    "contest programming",
    "algorithm library",
    "coding templates",
  ],
  authors: [{ name: "Mohamed Ibrahim", url: "https://mohamediibrahim.dev" }],
  creator: "Mohamed Ibrahim",
  icons: {
    icon: [{ url: "/icon", type: "image/png", sizes: "32x32" }],
    shortcut: "/icon",
    apple: [{ url: "/apple-icon", type: "image/png", sizes: "180x180" }],
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "https://cp-base.vercel.app"),
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "CP-Base",
    title: "CP-Base | Competitive Programming Templates & Contest Calendar",
    description,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "CP-Base | Competitive Programming Templates & Contest Calendar",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CP-Base | Competitive Programming Templates & Contest Calendar",
    description,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};
