import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        mint: "#a5dacc",
        campus: {
          50: "#ecfdf8",
          100: "#a5dacc",
          500: "#0d9488",
          600: "#0f766e",
          700: "#115e59",
        },
        accent: "#007BFF",
      },
      fontFamily: {
        sans: ["Segoe UI", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
