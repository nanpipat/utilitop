import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--bg-primary)",
        foreground: "var(--text-primary)",
        "bg-primary": "var(--bg-primary)",
        "bg-secondary": "var(--bg-secondary)",
        "bg-hover": "var(--bg-hover)",
        "bg-active": "var(--bg-active)",
        border: "var(--border)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-placeholder": "var(--text-placeholder)",
        accent: "var(--accent)",
        "accent-light": "var(--accent-light)",
        success: "var(--success)",
        error: "var(--error)",
        warning: "var(--warning)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
