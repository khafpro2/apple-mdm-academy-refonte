import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: "#fbfbfd",
        "surface-elevated": "#ffffff",
        ink: "#1d1d1f",
        "ink-secondary": "#6e6e73",
        "ink-tertiary": "#86868b",
        accent: "#0071e3",
        "accent-hover": "#0077ed",
        border: "#d2d2d7",
        "border-light": "#e8e8ed",
      },
    },
  },
  plugins: [],
};

export default config;
