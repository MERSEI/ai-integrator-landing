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
        // Indigo — несущий акцент интерфейса: доверие, точность, «инженерный»
        // тон. Всё интерактивное (кнопки, фокус, активные состояния) красится
        // им, поэтому деньги на нём не выделишь — для этого ниже отдельная
        // зелёная пара.
        accent: "#4F46E5",
        "accent-hover": "#6366F1",

        // Холст и поверхности: глубокий сине-чёрный slate вместо тёплого
        // near-black — под indigo он читается как один материал, а не как
        // синее пятно на сером.
        dark: "#020617",
        surface: "#0F172A",
        "surface-2": "#1E293B",
        light: "#F7F8F8",

        success: "#10B981",
        warning: "#D29922",

        // accent-blue — светлый indigo для рёбер графа и вторичных подсветок.
        // accent-violet — emerald: имя историческое (им размечено ~65 мест в
        // демо-инструментах), значение теперь «деньги». Всё, что показывает
        // экономию, выручку и окупаемость, красится именно им.
        "accent-blue": "#818CF8",
        "accent-violet": "#10B981",

        // Серии графиков. Отдельно от интерфейсных токенов: они проверены
        // валидатором палитры на тёмной поверхности (#1E293B) — попадают в
        // полосу светлоты 0.48–0.67, ΔE между сериями 23.5 (deutan) и 9.2
        // (tritan), контраст к фону выше 3:1. Интерфейсный #10B981 в полосу
        // не попадает, поэтому у графиков свой зелёный.
        "chart-1": "#6366F1",
        "chart-2": "#0EA37A",
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
          "0 0 0 1px rgba(79,70,229,0.5), 0 8px 28px -10px rgba(79,70,229,0.45)",
        "glow-accent-sm":
          "0 0 0 1px rgba(79,70,229,0.35), 0 2px 12px -6px rgba(79,70,229,0.3)",
        "glow-money":
          "0 0 0 1px rgba(16,185,129,0.35), 0 8px 28px -12px rgba(16,185,129,0.35)",
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
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        // Появление модалки: подъём со сжатием, как было у framer-motion.
        "modal-in": {
          from: { opacity: "0", transform: "translateY(24px) scale(0.98)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "dropdown-in": {
          from: { opacity: "0", transform: "translate(-50%, -8px) scale(0.97)" },
          to: { opacity: "1", transform: "translate(-50%, 0) scale(1)" },
        },
        // Шапка въезжает сверху один раз при загрузке.
        "header-in": {
          from: { opacity: "0", transform: "translateY(-72px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "header-line": {
          from: { transform: "scaleX(0)" },
          to: { transform: "scaleX(1)" },
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
        "fade-in": "fade-in 0.2s ease-out both",
        "modal-in": "modal-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) both",
        "dropdown-in": "dropdown-in 0.25s cubic-bezier(0.16, 1, 0.3, 1) both",
        "header-in": "header-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
        "header-line": "header-line 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both",
        blink: "blink 0.9s step-end infinite",
        "flow-dot-x": "flow-dot-x 2.6s ease-in-out infinite",
        "flow-dot-y": "flow-dot-y 2.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
