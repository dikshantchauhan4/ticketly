/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        surface: "rgb(var(--surface) / <alpha-value>)",
        elevated: "rgb(var(--elevated) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        line: "rgb(var(--line) / <alpha-value>)",
        brand: "rgb(var(--brand) / <alpha-value>)",
        brandInk: "rgb(var(--brand-ink) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        danger: "rgb(var(--danger) / <alpha-value>)"
      },
      boxShadow: {
        soft: "0 16px 50px rgb(15 23 42 / 0.10)"
      }
    }
  },
  plugins: []
};
