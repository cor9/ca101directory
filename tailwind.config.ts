import type { Config } from "tailwindcss";
const { fontFamily } = require("tailwindcss/defaultTheme");

const config: Config = {
  darkMode: ["class"],
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
  prefix: "",

  theme: {
    container: {
      center: true,
      padding: "1rem",
    },

    extend: {
      /* ----------------------------------------
         CORE DARK MARKETPLACE SYSTEM
      ---------------------------------------- */
      colors: {
        /* Surfaces */
        bg: {
          DEFAULT: "#0E1117",
          2: "#151922",
          3: "#1B1F29",
          dark: "#0E1117", // Alias for DEFAULT
          "dark-2": "#151922", // Alias for 2
        },

        card: {
          DEFAULT: "rgba(255,255,255,0.05)",
          hover: "rgba(255,255,255,0.08)",
          surface: "rgba(255,255,255,0.05)",
        },

        border: {
          subtle: "rgba(255,255,255,0.08)",
        },

        /* Text */
        text: {
          primary: "#FFFFFF",
          secondary: "#D1D5DB",
          muted: "#A0A3A9",
        },

        /* Accents - ONE canonical system (Patreon-style) */
        accent: {
          red: "#FF3333",       // urgency / submit / alerts
          orange: "#FF8800",    // CTAs / revenue
          rose: "#FF00CC",      // creative / demo reels
          blue: "#6666FF",      // agents / trust
          aqua: "#00E5FF",      // search / discovery
          purple: "#B24BF3",    // premium / featured
          gold: "#FFD700",      // verified / approved
        },

        /* Status / utility */
        brand: {
          success: "#3DD68C",
          warning: "#F7C948",
          danger: "#EF4665",
          info: "#2BB0ED",
        },

        /* Sidebar (kept, but normalized) */
        sidebar: {
          bg: "#151922",
          fg: "#E5E7EB",
          primary: "#3EE2C9",
          primaryFg: "#0E1117",
          accent: "#A97CFF",
          accentFg: "#0E1117",
          border: "rgba(255,255,255,0.08)",
        },
      },

      /* ----------------------------------------
         RADIUS & SHADOWS
      ---------------------------------------- */
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "14px",
        xl: "18px",
        card: "14px",
        tile: "18px",
      },

      boxShadow: {
        card: "0 6px 16px rgba(0,0,0,0.35)",
        cardHover: "0 12px 28px rgba(0,0,0,0.45)",
        inset: "inset 0 0 0 1px rgba(255,255,255,0.08)",
      },

      /* ----------------------------------------
         TYPOGRAPHY
      ---------------------------------------- */
      fontFamily: {
        display: ["Inter", ...fontFamily.sans],
        body: ["Inter", ...fontFamily.sans],
        serif: ["var(--font-source-serif)", ...fontFamily.serif],
      },

      /* ----------------------------------------
         MOTION
      ---------------------------------------- */
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },

      animation: {
        "fade-up": "fade-up 0.4s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
      },
    },
  },

  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};

export default config;
