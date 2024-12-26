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
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#086543", // Castleton Green - for primary actions
          foreground: "hsl(var(--primary-foreground))",
          light: "#86BC82", // Pistachio - for hover states
        },
        secondary: {
          DEFAULT: "#158ABC", // Blue - for secondary elements
          foreground: "hsl(var(--secondary-foreground))",
          light: "#5ABEB1", // Verdigris - for hover states
        },
        success: {
          DEFAULT: "#86BC82", // Pistachio
          foreground: "#086543", // Castleton Green
        },
        warning: {
          DEFAULT: "#FACA06", // Jonquil
          foreground: "#4A2614", // Dark brown
        },
        destructive: {
          DEFAULT: "#FE5F00", // Orange
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "#E4DAD1", // Timberwolf
          foreground: "#7C616C", // Rose Taupe
        },
        accent: {
          DEFAULT: "#CDA46F", // Lion
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Add your brand colors as direct references
        brand: {
          green: "#086543", // Castleton Green
          pistachio: "#86BC82",
          ivory: "#FFFFF3",
          timberwolf: "#E4DAD1",
          lion: "#CDA46F",
          racing: "#42614F", // British Racing Green
          blue: "#158ABC",
          verdigris: "#5ABEB1",
          indigo: "#A594F9", // Tropical Indigo
          taupe: "#7C616C", // Rose Taupe
          tea: "#C8E9C5", // Tea Green
          orange: "#FE5F00",
          jonquil: "#FACA06",
          periwinkle: "#CDC1FF",
          feldgrau: "#42614F",
        },
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
              color: 'inherit',
            },
            h2: {
              color: 'inherit',
            },
            h3: {
              color: 'inherit',
            },
            h4: {
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