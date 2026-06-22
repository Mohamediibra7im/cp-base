import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CP-Base — Competitive Programming Templates",
    short_name: "CP-Base",
    description:
      "Terminal-themed competitive programming template library. Fast, organized, contest-ready.",
    start_url: "/",
    display: "minimal-ui",
    background_color: "#030a05",
    theme_color: "#22c55e",
    icons: [
      { src: "/icon", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
