import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
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
        ivory: "#FFFFF3",
        timberwolf: "#E4DAD1",
        lion: "#CDA46F",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#CDA46F",
          foreground: "#FFFFF3",
        },
        secondary: {
          DEFAULT: "#E4DAD1",
          foreground: "#000000",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "#E4DAD1",
          foreground: "#666666",
        },
        accent: {
          DEFAULT: "#CDA46F",
          foreground: "#FFFFF3",
        },
        popover: {
          DEFAULT: "#FFFFF3",
          foreground: "#000000",
        },
        card: {
          DEFAULT: "#FFFFF3",
          foreground: "#000000",
        },
      },
      fontFamily: {
        sans: ['Gramatika', 'sans-serif'],
        display: ['Octave', 'serif'],
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
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'inherit',
            a: {
              color: 'inherit',
              textDecoration: 'none',
            },
            h1: {
              fontFamily: 'Octave, serif',
              color: 'inherit',
            },
            h2: {
              fontFamily: 'Octave, serif',
              color: 'inherit',
            },
            h3: {
              fontFamily: 'Octave, serif',
              color: 'inherit',
            },
            h4: {
              fontFamily: 'Octave, serif',
              color: 'inherit',
            },
          },
        },
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require('@tailwindcss/typography'),
  ],
} satisfies Config;