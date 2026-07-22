/**
 * Единый SVG-логотип (монохром): белый знак с чёрным AI-узлом + словесный знак.
 */
export default function Logo({ className = "h-8 w-auto" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 190 36"
      className={className}
      role="img"
      aria-label="AI Integrator"
    >
      <defs>
        <linearGradient id="logo-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#BFBFBF" />
        </linearGradient>
      </defs>

      <rect width="36" height="36" rx="10" fill="url(#logo-mark)" />
      <g stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round">
        <line x1="11" y1="25" x2="18.5" y2="11.5" opacity="0.9" />
        <line x1="18.5" y1="11.5" x2="26" y2="23" opacity="0.9" />
        <line x1="11" y1="25" x2="26" y2="23" opacity="0.55" />
      </g>
      <g fill="#0A0A0A">
        <circle cx="11" cy="25" r="2.6" />
        <circle cx="18.5" cy="11.5" r="2.8" />
        <circle cx="26" cy="23" r="2.4" />
      </g>

      <text
        x="46"
        y="24"
        fontFamily="var(--font-manrope), system-ui, sans-serif"
        fontWeight="800"
        fontSize="18.5"
        letterSpacing="-0.3"
        fill="#fff"
      >
        AI Integrator
      </text>
    </svg>
  );
}
