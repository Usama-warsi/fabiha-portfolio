import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ivory: "#F3EFE8",
        warmwhite: "#FAF8F4",
        charcoal: "#181716",
        exhibition: "#111111",
        stone: "#DED7CC",
        terracotta: "#995F49",
        ochre: "#A98B56",
        ink: "#2A2724",
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        label: "0.22em",
        wide2: "0.14em",
      },
      maxWidth: {
        container: "1600px",
        prose2: "68ch",
      },
      transitionTimingFunction: {
        gallery: "cubic-bezier(0.22, 1, 0.36, 1)",
        soft: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        grain: {
          "0%,100%": { transform: "translate(0,0)" },
          "20%": { transform: "translate(-4%,3%)" },
          "40%": { transform: "translate(3%,-5%)" },
          "60%": { transform: "translate(-2%,4%)" },
          "80%": { transform: "translate(4%,-2%)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.8s ease forwards",
        grain: "grain 0.6s steps(3) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
