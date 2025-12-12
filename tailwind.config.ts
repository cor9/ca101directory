import type { Config } from "tailwindcss";

const { fontFamily } = require("tailwindcss/defaultTheme");

const config = {
  darkMode: ["class"],
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1rem",
    },
    extend: {
      colors: {
        // UI Kit - Dark Patreon Edition (Phase 6)
        "bg-dark": "#0E1117",
        "bg-dark-2": "#151922",
        "bg-dark-3": "#1B1F29",
        "card-surface": "rgba(255,255,255,0.05)",
        "border-subtle": "rgba(255,255,255,0.08)",

     // Accent palette — Patreon modern colors
"accent-teal": "#3EE2C9",
"accent-lemon": "#F7D74E",
"accent-blue": "#4FA6FF",
"accent-purple": "#A97CFF",
"accent-salmon": "#FF8C7A",
"accent-cranberry": "#B92B5C",

        // Text colors
        "text-primary": "#FFFFFF",
        "text-secondary": "#D1D5DB",
        "text-muted": "#A0A3A9",

        // Brand colors
        brand: {
          success: "#3DD68C",
          warning: "#F7C948",
          danger: "#EF4665",
          info: "#2BB0ED",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
       sidebar: {
  DEFAULT: "hsl(var(--sidebar-background))",
  foreground: "hsl(var(--sidebar-foreground))",
  primary: "hsl(var(--sidebar-primary))",
  "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
  accentBg: "hsl(var(--sidebar-accent))",
  accentFg: "hsl(var(--sidebar-accent-foreground))",
  border: "hsl(var(--sidebar-border))",
  ring: "hsl(var(--sidebar-ring))",
},
        // ------------------------------------------
patreon: {
  // Core Surfaces
  bg: "#0E1117",
  bg2: "#151922",
  bg3: "#1B1F29",

  // Card + Surface Layers
  card: {
    DEFAULT: "rgba(255,255,255,0.05)",
    hover: "rgba(255,255,255,0.08)",
  },

  // Accents (renamed from `accent`)
  accents: {
    teal: "#1CC8B0",
    lemon: "#F5E76A",
    purple: "#C57CFF",
    salmon: "#FF8A7A",
    cranberry: "#D9476D",
    stone: "#A8ACB9",
    blue: "#4EA3FF",
  },

  // Text System
  text: {
    primary: "#FFFFFF",
    secondary: "#D1D5DB",
    muted: "#A0A3A9",
  },
},
        // Production-ready color system from artwork
        bg: "#0D1B2A",
        bg2: "#142B3B",
        surface: "#FFFDD0",
        paper: "#FAFAF4",
        ink: "#F7FAFC",
        text: "#1F2327",
        "primary-orange": "#E4572E",
        "primary-orange-600": "#CC4E2A",
        "secondary-denim": "#3A76A6",
        "secondary-denim-600": "#2E5E85",
        highlight: "#E4A72E",
        success: "#AEBF98",
        info: "#3E9CA3",
        error: "#C84F41",

        // Legacy colors (to be phased out)
        cream: "hsl(var(--cream))",
        charcoal: "hsl(var(--charcoal))",
        "retro-blue": "hsl(var(--retro-blue))",
        "tomato-red": "hsl(var(--tomato-red))",
        "mustard-gold": "hsl(var(--mustard-gold))",
        "muted-teal": "hsl(var(--muted-teal))",

        // Category-specific colors
        coaches: "hsl(var(--coaches-color))",
        photographers: "hsl(var(--photographers-color))",
        editors: "hsl(var(--editors-color))",
        studios: "hsl(var(--studios-color))",

        // Bauhaus Mid-Century Modern Hollywood Colors
        "bauhaus-mustard": "var(--mustard-yellow)",
        "bauhaus-orange": "var(--faded-red-orange)",
        "bauhaus-blue": "var(--robin-egg-blue)",
        "bauhaus-charcoal": "var(--charcoal)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        card: "12px",
        xl: "1rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        card: "0 4px 12px rgba(0,0,0,0.35)",
        hover: "0 10px 20px rgba(13, 27, 42, 0.35)",
        inset: "inset 0 0 0 1px rgba(255,255,255,0.08)",
        "card-new": "0 4px 20px rgba(0, 0, 0, 0.3)",
        "card-new-hover": "0 8px 30px rgba(0, 0, 0, 0.4)",
      },
      fontFamily: {
        bricolage: ["var(--font-bricolage)", ...fontFamily.sans],
        sourceSans: ["var(--font-source-sans)", ...fontFamily.sans],
        sourceSerif: ["var(--font-source-serif)", ...fontFamily.serif],
        workSans: ["var(--font-work-sans)", ...fontFamily.sans],
        display: ["Inter", "system-ui", ...fontFamily.sans],
        body: ["Inter", "system-ui", ...fontFamily.sans],
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "fade-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)",
          },
          "80%": {
            opacity: "0.7",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0px)",
          },
        },
        "fade-down": {
          "0%": {
            opacity: "0",
            transform: "translateY(-10px)",
          },
          "80%": {
            opacity: "0.6",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0px)",
          },
        },
        "fade-in": {
          "0%": {
            opacity: "0",
          },
          "50%": {
            opacity: "0.6",
          },
          "100%": {
            opacity: "1",
          },
        },
        "fade-out": {
          "0%": {
            opacity: "0",
          },
          "50%": {
            opacity: "0.6",
          },
          "100%": {
            opacity: "1",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.5s",
        "fade-down": "fade-down 0.5s",
        "fade-in": "fade-in 0.4s",
        "fade-out": "fade-out 0.4s",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;

export default config;
