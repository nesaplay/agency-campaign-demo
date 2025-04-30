
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
      fontFamily: {
        inter: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '8px',
        lg: "8px",
        md: "6px",
        sm: "4px",
      },
      boxShadow: {
        card: "0px 4px 6px -1px rgba(0,0,0,0.10), 0px 2px 4px -1px rgba(0,0,0,0.06)",
        elevated: "0px 10px 15px -3px rgba(0,0,0,0.10), 0px 4px 6px -2px rgba(0,0,0,0.05)",
        'button-primary': "0 3px 8px rgba(245,158,11,0.12), 0px 1.5px 3px rgba(40,104,195,0.10)",
      },
      colors: {
        empowerlocal: {
          navy: "var(--empowerlocal-navy)",
          blue: "var(--empowerlocal-blue)",
          teal: "var(--empowerlocal-teal)",
          gold: "var(--empowerlocal-gold)",
          amber: "var(--empowerlocal-gold)",
          green: "var(--empowerlocal-green)",
          success: "var(--empowerlocal-green)",
          coral: "var(--empowerlocal-coral)",
          peach: "var(--empowerlocal-coral)",
          terracotta: "var(--empowerlocal-terracotta)",
          background: "var(--empowerlocal-bg)",
          gradient: "linear-gradient(90deg, #25A87E 0%, #2868C3 100%)",
        },
        success: "var(--empowerlocal-success)",
        warning: "var(--empowerlocal-warning)",
        error: "var(--empowerlocal-error)",
        info: "var(--empowerlocal-info)",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
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
        // updated to go from teal to dark blue, left to right
        'empowerlocal-gradient': 'linear-gradient(90deg, #25A87E 0%, #2868C3 100%)',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

