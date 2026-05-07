/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "system-ui"],
        serif: ["var(--font-serif)", "serif"],
        sans: ["var(--font-sans)", "system-ui"],
        mono: ["var(--font-mono)", "monospace"],
      },
      colors: {
        // Levvate brand
        indigo: {
          DEFAULT: "#1E2A8A",
          deep: "#141B5C",
          ink: "#0E1340",
          50: "#F2F3FA",
          100: "#E8E9F7",
          200: "#D8D9F2",
          300: "#B5B7E5",
          400: "#7A7DC9",
        },
        lavender: {
          DEFAULT: "#D8D9F2",
          soft: "#E8E9F7",
          mist: "#F2F3FA",
        },
        // Diagram palette (matches GSoC aesthetic)
        diag: {
          mint: "#D4EDE2",
          mintBorder: "#7FB89A",
          peach: "#FCE0CC",
          peachBorder: "#E89B5C",
          lilac: "#E5DCF5",
          lilacBorder: "#A687D4",
          sky: "#D6E8F7",
          skyBorder: "#6FA1D0",
          rose: "#F7D7E0",
          roseBorder: "#D17A95",
        },
        ink: "#0A0A0A",
        paper: "#FFFFFF",
        muted: "#5A5C72",
      },
      borderRadius: { pill: "999px" },
      boxShadow: {
        soft: "0 1px 2px rgba(14, 19, 64, 0.04), 0 4px 16px rgba(14, 19, 64, 0.06)",
        lift: "0 8px 32px rgba(14, 19, 64, 0.10)",
      },
    },
  },
  plugins: [],
};
