/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      colors: {
        // Semantic Theme Colors (Mapped to CSS Variables)
        "app-bg": "var(--app-bg)",
        "card-bg": "var(--card-bg)", // Renamed from card-dark for consistency
        "primary-text": "var(--text-primary)",
        "secondary-text": "var(--text-secondary)",
        "divider": "var(--divider)", // Renamed from dark-border
        "primary-accent": "var(--primary-accent)", // Renamed from soft-gold/faith
        "highlight": "var(--highlight)",
        "correct": "var(--correct)",
        "error": "var(--error)",
        "button-text": "var(--button-text)",

        // Retaining legacy/direct names if needed, or mapping them to vars too
        ivory: "#FAF9F6",
        charcoal: "#2F2F2F",
        muted: "#6F6F6F",
        faith: "#4A7FB5",

      },
    },
  },
  plugins: [],
}