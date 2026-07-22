import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#FFFFFF",
        "primary-light": "#D4D4D4",
        secondary: "#737373",
        accent: "#FFFFFF",
        dark: "#050505",
        surface: "#0A0A0A",
        "surface-2": "#121212",
        light: "#F5F5F5",
        success: "#E5E5E5",
        warning: "#A3A3A3",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        heading: ["var(--font-manrope)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "16px",
        xl: "24px",
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      boxShadow: {
        glow: "0 0 48px -10px rgba(255, 255, 255, 0.22)",
        "glow-sm": "0 0 28px -8px rgba(255, 255, 255, 0.14)",
        card: "0 8px 32px -12px rgba(0, 0, 0, 0.55)",
      },
      keyframes: {
        drift: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(40px, -30px) scale(1.08)" },
          "66%": { transform: "translate(-30px, 24px) scale(0.95)" },
        },
        "drift-alt": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "40%": { transform: "translate(-36px, 28px) scale(1.06)" },
          "70%": { transform: "translate(28px, -20px) scale(0.96)" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.55", transform: "scale(0.8)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        "blink-fade": {
          "0%, 60%": { opacity: "1" },
          "30%": { opacity: "0" },
          "100%": { opacity: "0" },
        },
      },
      animation: {
        drift: "drift 18s ease-in-out infinite",
        "drift-alt": "drift-alt 22s ease-in-out infinite",
        "pulse-dot": "pulse-dot 2.4s ease-in-out infinite",
        shimmer: "shimmer 8s linear infinite",
        blink: "blink 0.9s step-end infinite",
        "blink-fade": "blink-fade 2.4s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
