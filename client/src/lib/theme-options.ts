// Theme options organized by categories

export type ThemeType = {
  name: string;
  primary: string;
  background: string;
  text: string;
  accent: string;
  variant: "professional" | "tint" | "vibrant";
  description: string;
};

// Seasonal Themes
export const seasonalThemes: ThemeType[] = [
  {
    name: "winter",
    primary: "#4B6CB7",
    background: "#0F172A",
    text: "#F1F5F9",
    accent: "#38BDF8",
    variant: "vibrant",
    description: "Cool blue tones inspired by winter landscapes"
  },
  {
    name: "spring",
    primary: "#84CC16",
    background: "#052e16",
    text: "#ECFCCB",
    accent: "#BEF264",
    variant: "vibrant",
    description: "Fresh greens and pastels of spring blooms"
  },
  {
    name: "summer",
    primary: "#F97316",
    background: "#3A1212",
    text: "#FFEDD5",
    accent: "#FB923C",
    variant: "vibrant",
    description: "Warm vibrant colors of summer sunshine"
  },
  {
    name: "autumn",
    primary: "#B45309",
    background: "#1C1917",
    text: "#FEF3C7",
    accent: "#F59E0B",
    variant: "tint",
    description: "Rich, earthy tones of autumn leaves"
  }
];

// Holiday Themes
export const holidayThemes: ThemeType[] = [
  {
    name: "valentine's day",
    primary: "#E11D48",
    background: "#1E1B1C",
    text: "#FBD7E3",
    accent: "#FB7185",
    variant: "vibrant",
    description: "Romantic reds and pinks for Valentine's Day"
  },
  {
    name: "st. patrick's day",
    primary: "#16A34A",
    background: "#052e16",
    text: "#D1FAE5",
    accent: "#4ADE80",
    variant: "vibrant",
    description: "Lucky greens for St. Patrick's Day"
  },
  {
    name: "halloween",
    primary: "#F97316",
    background: "#1a120b",
    text: "#FEF3C7",
    accent: "#EA580C",
    variant: "vibrant",
    description: "Spooky orange and black for Halloween"
  },
  {
    name: "christmas",
    primary: "#B91C1C",
    background: "#052e16",
    text: "#FFFFFF",
    accent: "#22C55E",
    variant: "vibrant",
    description: "Festive red and green for Christmas"
  },
  {
    name: "hanukkah",
    primary: "#2563EB",
    background: "#0C0D21",
    text: "#F8FAFC",
    accent: "#93C5FD",
    variant: "tint",
    description: "Traditional blue and white for Hanukkah"
  },
  {
    name: "new year",
    primary: "#6D28D9",
    background: "#0F172A",
    text: "#F8FAFC",
    accent: "#A855F7",
    variant: "vibrant",
    description: "Celebratory purple and gold for New Year"
  }
];

// Custom Fun Themes
export const customThemes: ThemeType[] = [
  {
    name: "cyberpunk",
    primary: "#EC4899",
    background: "#18181b",
    text: "#D1D5DB",
    accent: "#06B6D4",
    variant: "vibrant",
    description: "Neon colors inspired by cyberpunk aesthetics"
  },
  {
    name: "retro wave",
    primary: "#8B5CF6",
    background: "#171717",
    text: "#f5f5f5",
    accent: "#EC4899",
    variant: "vibrant",
    description: "80s-inspired synthwave colors"
  },
  {
    name: "forest",
    primary: "#059669",
    background: "#1C1917",
    text: "#D1FAE5",
    accent: "#10B981",
    variant: "tint",
    description: "Serene colors inspired by deep forests"
  },
  {
    name: "cosmic",
    primary: "#7C3AED",
    background: "#030712",
    text: "#E2E8F0",
    accent: "#8B5CF6",
    variant: "vibrant",
    description: "Deep space-inspired purple and blues"
  },
  {
    name: "monochrome",
    primary: "#525252",
    background: "#0A0A0A",
    text: "#F5F5F5",
    accent: "#A3A3A3",
    variant: "professional",
    description: "Elegant black and white with shades of gray"
  },
  {
    name: "sunset",
    primary: "#DC2626",
    background: "#0c0a09",
    text: "#FEF3C7",
    accent: "#FB923C",
    variant: "tint",
    description: "Warm gradient colors of a sunset"
  }
];

export const allThemes = [
  ...seasonalThemes, 
  ...holidayThemes, 
  ...customThemes
];

// Default themes
export const defaultDarkTheme: ThemeType = {
  name: "default dark",
  primary: "#FFFFFF",
  background: "#000000",
  text: "#FFFFFF",
  accent: "#FFFFFF",
  variant: "professional",
  description: "Default dark theme with white on black"
};

export const defaultLightTheme: ThemeType = {
  name: "default light",
  primary: "#000000",
  background: "#FFFFFF",
  text: "#000000",
  accent: "#000000",
  variant: "professional",
  description: "Default light theme with black on white"
};