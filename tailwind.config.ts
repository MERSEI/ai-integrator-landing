import type { Config } from "tailwindcss";

/**
 * Дизайн-токены v2. Имена намеренно совпадают с v1: все десять демо-инструментов
 * (src/components/<app>/*Tool.tsx) собраны на этих же токенах и общих классах из
 * globals.css, поэтому смена значений перекрашивает их без правки их JSX.
 * Переименование токена = ручная правка ~65 мест, поэтому меняем только значения.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Текст. Чистый #FFF на тёмном звенит — берём чуть притушенный белый.
        primary: "#F7F8F8",
        "primary-light": "#C9CDD3",
        secondary: "#8A8F98",
        accent: "#6E56CF",
        "accent-hover": "#7C66DD",

        // Холст и поверхности: тёплый near-black с еле заметным подъёмом слоёв.
        dark: "#08090A",
        surface: "#0E0F11",
        "surface-2": "#16181B",
        light: "#F7F8F8",

        success: "#3FB950",
        warning: "#D29922",

        // Пара для рёбер графа сценариев и редких акцентных подсветок.
        "accent-blue": "#4C8DFF",
        "accent-violet": "#9A7CF0",
      },
      // Один гарнитур на весь сайт (Inter): различие даёт трекинг и вес, а не
      // вторая гарнитура. Токен `heading` сохранён — им размечено много JSX.
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        heading: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        tight: "-0.02em",
        tighter: "-0.03em",
      },
      borderRadius: {
        sm: "6px",
        md: "8px",
        lg: "12px",
        xl: "16px",
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      /**
       * «Glow» из v1 переопределён в hairline-ring + сдержанная тень: несущий
       * приём Linear — 1px граница, а не свечение. Имена оставлены прежними,
       * чтобы инструменты подхватили новый вид автоматически.
       */
      boxShadow: {
        glow: "0 0 0 1px rgba(255,255,255,0.06), 0 8px 24px -12px rgba(0,0,0,0.7)",
        "glow-sm": "0 0 0 1px rgba(255,255,255,0.05), 0 4px 12px -6px rgba(0,0,0,0.6)",
        card: "0 1px 2px rgba(0,0,0,0.4), 0 8px 24px -16px rgba(0,0,0,0.8)",
        "glow-accent":
          "0 0 0 1px rgba(110,86,207,0.5), 0 8px 28px -10px rgba(110,86,207,0.45)",
        "glow-accent-sm":
          "0 0 0 1px rgba(110,86,207,0.35), 0 2px 12px -6px rgba(110,86,207,0.3)",
      },
      keyframes: {
        // Живой индикатор у бейджа «в работе» — единственная уместная петля.
        "pulse-dot": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.35", transform: "scale(0.8)" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        // Импульс по связи графа: анимируем left/top, потому что проценты здесь
        // считаются от размера связи, а translate — от размера самой точки.
        "flow-dot-x": {
          "0%": { left: "0%", opacity: "0" },
          "15%, 85%": { opacity: "1" },
          "100%": { left: "100%", opacity: "0" },
        },
        "flow-dot-y": {
          "0%": { top: "0%", opacity: "0" },
          "15%, 85%": { opacity: "1" },
          "100%": { top: "100%", opacity: "0" },
        },
      },
      animation: {
        "pulse-dot": "pulse-dot 2.4s ease-in-out infinite",
        "fade-up": "fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
        blink: "blink 0.9s step-end infinite",
        "flow-dot-x": "flow-dot-x 2.6s ease-in-out infinite",
        "flow-dot-y": "flow-dot-y 2.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
