/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: ["selector", '[data-theme="dark"]'],
  theme: {
    extend: {
      // Ported 1:1 from the :root / [data-theme="dark"] custom properties
      // in the original sahara-x.html. Each token resolves through the CSS
      // variable so light/dark values stay in sync with globals.css.
      colors: {
        indigo: "var(--indigo)",
        "indigo-dim": "var(--indigo-dim)",
        "indigo-text": "var(--indigo-text)",
        marigold: "var(--marigold)",
        "marigold-dim": "var(--marigold-dim)",
        green: "var(--green)",
        "green-dim": "var(--green-dim)",
        rust: "var(--rust)",
        "rust-dim": "var(--rust-dim)",
        khadi: "var(--khadi)",
        card: "var(--card)",
        ink: "var(--ink)",
        "ink-soft": "var(--ink-soft)",
        line: "var(--line)",
      },
      borderRadius: {
        DEFAULT: "var(--radius)",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        sans: ["IBM Plex Sans", "sans-serif"],
        devanagari: ["IBM Plex Sans Devanagari", "IBM Plex Sans", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
      },
    },
  },
  plugins: [],
};
