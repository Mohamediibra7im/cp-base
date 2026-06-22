import type { Metadata } from "next";

const description =
  "A terminal-themed competitive programming template library. Organized, searchable, and ready to copy-paste into contests.";

export const metadata: Metadata = {
  title: {
    default: "CP-Base | Competitive Programming Templates",
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
    "cp",
    "segment tree",
    "graph algorithms",
    "dynamic programming",
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
        : "https://cp-base.mohmmediibrahim.dev"),
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "CP-Base",
    title: "CP-Base | Competitive Programming Templates",
    description,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "CP-Base | Competitive Programming Templates",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CP-Base | Competitive Programming Templates",
    description,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};
