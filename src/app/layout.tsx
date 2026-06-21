import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { NavBar } from "@/components/nav-bar";
import { Footer } from "@/components/footer";
import { Suspense } from "react";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "CP-Base | Competitive Programming Templates",
    template: "%s | CP-Base",
  },
  description:
    "A terminal-themed competitive programming template library. Organized, searchable, and ready to copy-paste into contests.",
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
  metadataBase: new URL("https://cp-base.dev"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "CP-Base",
    title: "CP-Base | Competitive Programming Templates",
    description:
      "A terminal-themed competitive programming template library. Organized, searchable, and ready to use.",
  },
  twitter: {
    card: "summary_large_image",
    title: "CP-Base | Competitive Programming Templates",
    description:
      "A terminal-themed competitive programming template library.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${jetbrainsMono.variable} h-full antialiased dark`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-mono">
        <Providers>
          <Suspense>
            <NavBar />
          </Suspense>
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
