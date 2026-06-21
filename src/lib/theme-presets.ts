export const themePresets = {
  terminal: {
    name: "Terminal",
    description: "Classic terminal green aesthetic",
    colors: {
      background: "#080808",
      foreground: "#e8e8e8",
      primary: "#22c55e",
      primaryForeground: "#080808",
      card: "#111111",
      cardForeground: "#e8e8e8",
      border: "#2a2a2a",
      muted: "#1a1a1a",
      mutedForeground: "#888888",
      accent: "#22c55e",
      accentForeground: "#080808",
    },
  },
  cyberpunk: {
    name: "Cyberpunk",
    description: "Neon pink/cyan on deep dark",
    colors: {
      background: "#0a0a0f",
      foreground: "#f0f0f0",
      primary: "#00f3ff",
      primaryForeground: "#0a0a0f",
      card: "#13131a",
      cardForeground: "#f0f0f0",
      border: "#2a2a3e",
      muted: "#1a1a24",
      mutedForeground: "#7a7a9a",
      accent: "#ff2d95",
      accentForeground: "#0a0a0f",
    },
  },
  ocean: {
    name: "Ocean",
    description: "Deep blue professional theme",
    colors: {
      background: "#06141e",
      foreground: "#e8f4f8",
      primary: "#06b6d4",
      primaryForeground: "#06141e",
      card: "#0c1e2e",
      cardForeground: "#e8f4f8",
      border: "#1a3a4e",
      muted: "#102a3e",
      mutedForeground: "#6a9ab8",
      accent: "#22d3ee",
      accentForeground: "#06141e",
    },
  },
  forest: {
    name: "Forest",
    description: "Rich emerald and natural tones",
    colors: {
      background: "#0a160a",
      foreground: "#e8f0e8",
      primary: "#16a34a",
      primaryForeground: "#0a160a",
      card: "#122412",
      cardForeground: "#e8f0e8",
      border: "#2a4a2a",
      muted: "#1a301a",
      mutedForeground: "#7a9a7a",
      accent: "#22c55e",
      accentForeground: "#0a160a",
    },
  },
  sunset: {
    name: "Sunset",
    description: "Warm amber and coral tones",
    colors: {
      background: "#1c0a08",
      foreground: "#fef7f0",
      primary: "#f97316",
      primaryForeground: "#1c0a08",
      card: "#2a120c",
      cardForeground: "#fef7f0",
      border: "#4a2a1a",
      muted: "#301810",
      mutedForeground: "#b88a7a",
      accent: "#fb923c",
      accentForeground: "#1c0a08",
    },
  },
  monochrome: {
    name: "Monochrome",
    description: "Clean black & white minimalism",
    colors: {
      background: "#000000",
      foreground: "#ffffff",
      primary: "#ffffff",
      primaryForeground: "#000000",
      card: "#111111",
      cardForeground: "#ffffff",
      border: "#333333",
      muted: "#1a1a1a",
      mutedForeground: "#888888",
      accent: "#cccccc",
      accentForeground: "#000000",
    },
  },
} as const;

export type ThemePresetKey = keyof typeof themePresets;

export function getThemePreset(key: ThemePresetKey) {
  return themePresets[key];
}

export function applyThemePreset(key: ThemePresetKey) {
  const preset = themePresets[key];
  const root = document.documentElement;
  Object.entries(preset.colors).forEach(([key, value]) => {
    root.style.setProperty(`--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`, value);
  });
}