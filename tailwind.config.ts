
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Brand system palette (all accessible via var(--name))
        empowerlocal: {
          // Brand gradient is for backgrounds, not a single color
          navy: "var(--empowerlocal-navy)",
          blue: "var(--empowerlocal-blue)",
          teal: "var(--empowerlocal-teal)",
          gold: "var(--empowerlocal-gold)",
          amber: "var(--empowerlocal-gold)",
          coral: "var(--empowerlocal-coral)",
          peach: "var(--empowerlocal-coral)",
          terracotta: "var(--empowerlocal-terracotta)",
          background: "var(--empowerlocal-bg)",
          gradient: "linear-gradient(90deg, #25A87E 0%, #2868C3 100%)",
        },
        // Functional colors (solid)
        success: "var(--empowerlocal-success)",
        warning: "var(--empowerlocal-warning)",
        error: "var(--empowerlocal-error)",
        info: "var(--empowerlocal-info)",
        // default system colors, kept for fallback
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      backgroundImage: {
        'empowerlocal-gradient': 'linear-gradient(90deg, #25A87E 0%, #2868C3 100%)',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

