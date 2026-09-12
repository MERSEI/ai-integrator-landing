/**
 * Иллюстрация к секции «Вы теряете клиентов без автоматизации».
 *
 * Тот же кинематографичный премиальный язык, что и на первом экране
 * (HeroScene3D): объёмные засветы, стеклянные узлы, тонкие лучи света —
 * только здесь сюжет обратный. Лиды стекаются в воронку сверху, но часть
 * потока утекает сквозь трещину и гаснет в темноте снизу — это то, что
 * обычно и происходит без автоматизации.
 *
 * Полностью вектор + CSS: ни одного растра, вес — доли килобайта, и сцена
 * красится теми же токенами, что остальная страница.
 */

const ACCENT = "#818CF8";
const ACCENT_DEEP = "#4F46E5";
const EMERALD = "#10B981";
const AMBER = "#D29922";

export default function LossScene({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`} aria-hidden="true">
      {/* Объёмные засветы: те же, что в HeroScene3D, дают сцене толщину. */}
      <div className="pointer-events-none absolute -inset-10 overflow-hidden">
        <div className="absolute left-1/2 top-[6%] h-40 w-40 -translate-x-1/2 rounded-full bg-accent/20 blur-[70px]" />
        <div className="absolute bottom-[4%] left-[18%] h-28 w-28 rounded-full bg-warning/15 blur-[60px]" />
      </div>

      <svg
        viewBox="0 0 400 420"
        className="relative w-full"
        role="img"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <radialGradient id="loss-glow" cx="50%" cy="30%" r="55%">
            <stop offset="0%" stopColor={ACCENT_DEEP} stopOpacity="0.28" />
            <stop offset="60%" stopColor={ACCENT_DEEP} stopOpacity="0.06" />
            <stop offset="100%" stopColor={ACCENT_DEEP} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="loss-funnel" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>
          <linearGradient id="loss-leak" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0.7" />
            <stop offset="100%" stopColor={AMBER} stopOpacity="0" />
          </linearGradient>
          <linearGradient id="loss-in" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={ACCENT} stopOpacity="0" />
            <stop offset="100%" stopColor={ACCENT} stopOpacity="0.55" />
          </linearGradient>
        </defs>

        <circle cx="200" cy="140" r="180" fill="url(#loss-glow)" />

        {/* Входящие потоки лидов — сходятся к воронке сверху. */}
        <g strokeLinecap="round" fill="none">
          <path d="M60 30 C100 70 140 90 176 118" stroke="url(#loss-in)" strokeWidth="1.4" />
          <path d="M340 30 C300 70 260 90 224 118" stroke="url(#loss-in)" strokeWidth="1.4" />
          <path d="M200 10 L200 108" stroke="url(#loss-in)" strokeWidth="1.4" />
        </g>
        <circle cx="60" cy="30" r="3" fill={ACCENT} opacity="0.8" />
        <circle cx="340" cy="30" r="3" fill={ACCENT} opacity="0.8" />
        <circle cx="200" cy="10" r="3" fill={ACCENT} opacity="0.8" />

        {/* Стеклянная воронка с трещиной сбоку. */}
        <path
          d="M120 118 L280 118 L232 210 L232 248 L168 248 L168 210 Z"
          fill="url(#loss-funnel)"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1.4"
        />
        {/* Трещина, через которую утекает поток. */}
        <path
          d="M244 150 L256 172 L246 190 L262 214"
          fill="none"
          stroke={AMBER}
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.85"
        />

        {/* То, что дошло: ровный, собранный поток вниз к CRM. */}
        <path
          d="M200 248 L200 300"
          stroke={EMERALD}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.6"
        />
        <rect
          x="168"
          y="300"
          width="64"
          height="40"
          rx="10"
          fill="#0F172A"
          stroke="rgba(16,185,129,0.35)"
          strokeWidth="1.4"
        />
        <path
          d="M182 320l12 10 22-22"
          fill="none"
          stroke={EMERALD}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* То, что утекло: гаснущая нить в темноту, мимо результата. */}
        <path
          d="M262 214 C276 244 268 280 288 320 C296 336 292 356 276 372"
          fill="none"
          stroke="url(#loss-leak)"
          strokeWidth="1.6"
          strokeLinecap="round"
          className="motion-safe:animate-pulse"
        />
        <circle cx="276" cy="372" r="3" fill={AMBER} opacity="0.65" />
      </svg>
    </div>
  );
}
