/**
 * Мерцающее звёздное поле для тёмных секций.
 *
 * Позиции считаются детерминированно (seeded PRNG), а не через Math.random():
 * при случайных значениях серверная и клиентская разметка разошлись бы и React
 * ругался бы на hydration mismatch. Компонент серверный — в бандл ничего не летит,
 * вся анимация на CSS.
 */

/** mulberry32 — компактный PRNG с фиксированным seed. */
function makeRandom(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const ACCENTS = [
  "rgba(59,130,246,0.9)", // accent blue
  "rgba(139,92,246,0.9)", // accent violet
  "rgba(255,255,255,0.9)",
];

export default function Starfield({
  count = 60,
  seed = 20260727,
  className = "",
}: {
  count?: number;
  seed?: number;
  className?: string;
}) {
  const rand = makeRandom(seed);

  const stars = Array.from({ length: count }, () => {
    const isAccent = rand() > 0.72;
    const color = isAccent
      ? ACCENTS[Math.floor(rand() * 2)]
      : ACCENTS[2];
    const size = isAccent ? 1.6 + rand() * 1.8 : 0.8 + rand() * 1.4;
    return {
      top: rand() * 100,
      left: rand() * 100,
      size,
      color,
      duration: 2.8 + rand() * 5.5,
      delay: rand() * 6,
      glow: isAccent,
    };
  });

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {stars.map((s, i) => (
        <span
          key={i}
          className="absolute animate-twinkle rounded-full will-change-transform"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            background: s.color,
            animationDuration: `${s.duration}s`,
            animationDelay: `${s.delay}s`,
            boxShadow: s.glow ? `0 0 ${s.size * 2.5}px ${s.color}` : undefined,
          }}
        />
      ))}
    </div>
  );
}
