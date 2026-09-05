/**
 * Фактура фона первого экрана.
 *
 * Раньше глубину давал один CSS-градиент, и на больших экранах верх страницы
 * читался как плоская заливка. Здесь к нему добавлены две вещи, которых
 * градиентом не сделать: световые полосы под углом и плёночное зерно.
 *
 * Зерно — feTurbulence, но не на весь экран: фильтр считается один раз на
 * плитке 120×120, дальше плитка размножается паттерном. Полноэкранный
 * turbulence пришлось бы пересчитывать на каждый ресайз, а это первый экран,
 * где меряется LCP.
 */
export default function HeroTexture() {
  return (
    <svg
      className="pointer-events-none absolute inset-x-0 top-0 h-[560px] w-full"
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="none"
      viewBox="0 0 1200 560"
    >
      <defs>
        <filter id="hero-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <pattern
          id="hero-grain-tile"
          width="120"
          height="120"
          patternUnits="userSpaceOnUse"
        >
          <rect width="120" height="120" filter="url(#hero-grain)" />
        </pattern>

        {/* Полосы света: гаснут к обоим концам, иначе видно, где они начались. */}
        <linearGradient id="hero-streak" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#818CF8" stopOpacity="0" />
          <stop offset="45%" stopColor="#818CF8" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#818CF8" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="hero-streak-emerald" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#10B981" stopOpacity="0" />
          <stop offset="55%" stopColor="#10B981" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Полосы держатся выше и ниже заголовка: линия, проходящая сквозь
          набор, читается как дефект рендера, а не как свет. */}
      <g stroke="url(#hero-streak)" strokeWidth="1">
        <path d="M-40 68 L1240 6" opacity="0.5" />
        <path d="M-40 148 L1240 62" opacity="0.3" />
        <path d="M-40 542 L1240 452" opacity="0.22" />
      </g>
      <path
        d="M-40 502 L1240 404"
        stroke="url(#hero-streak-emerald)"
        strokeWidth="1"
        opacity="0.5"
      />

      {/* Зерно поверх всего и почти невидимо: оно должно чувствоваться, а не
          читаться как шум на градиенте. */}
      <rect width="1200" height="560" fill="url(#hero-grain-tile)" opacity="0.045" />
    </svg>
  );
}
