/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
        parisienne: ["var(--font-parisienne)", "cursive"],
        tangerine: ["var(--font-tangerine)", "cursive"],
        montserrat: ["var(--font-montserrat)", "sans-serif"],
        crimson: ["var(--font-crimson)", "sans-serif"],
        mrs_saint_delafield: ["var(--font-mrs-saint-delafield)", "sans-serif"]
      },
    },
  },
  plugins: [],
};

export default config; // ✅ Correct ES module syntax

