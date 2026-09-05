/**
 * Иллюстрация к секции «Проблемы»: всё сходится на одном человеке.
 *
 * Рисует не предмет, а механизм боли — шесть каналов тянутся к центру, и
 * разбирает их вручную один человек. Один поток уходит вниз мимо: это лид,
 * до которого не дошли руки. Пунктиром — то, что вообще не доехало.
 *
 * Вектор, а не растр: сцена весит около килобайта, чёткая на любом экране,
 * красится теми же токенами, что и остальная страница, и не грузит LCP.
 * Обводки 1.6 и круглые концы — те же, что у иконок (icons.tsx), поэтому
 * иллюстрация читается частью того же набора, а не вставкой со стороны.
 */

const ACCENT = "#818CF8";
const ACCENT_DEEP = "#4F46E5";
const AMBER = "#D29922";

/** Канал: кружок-подложка и глиф поверх — общий вид для всех шести. */
function Token({
  x,
  y,
  unread = false,
  children,
}: {
  x: number;
  y: number;
  /** Точка «не разобрано». Именно точка, а не число: цифру пришлось бы выдумать. */
  unread?: boolean;
  children: React.ReactNode;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r="23" fill="#0F172A" stroke="rgba(255,255,255,0.10)" />
      <g
        stroke={ACCENT}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        {children}
      </g>
      {unread && (
        <circle cx="17" cy="-16" r="4.5" fill={AMBER} stroke="#0F172A" strokeWidth="2" />
      )}
    </g>
  );
}

export default function OverloadScene({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      role="img"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id="overload-glow" cx="50%" cy="46%" r="52%">
          <stop offset="0%" stopColor={ACCENT_DEEP} stopOpacity="0.30" />
          <stop offset="60%" stopColor={ACCENT_DEEP} stopOpacity="0.07" />
          <stop offset="100%" stopColor={ACCENT_DEEP} stopOpacity="0" />
        </radialGradient>
        {/* Входящие с краёв гаснут к рамке — поток без начала и конца. */}
        <linearGradient id="overload-fade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={ACCENT} stopOpacity="0" />
          <stop offset="100%" stopColor={ACCENT} stopOpacity="0.34" />
        </linearGradient>
      </defs>

      <circle cx="200" cy="186" r="190" fill="url(#overload-glow)" />

      {/* Нити не сходятся аккуратной звездой: они перехлёстываются перед
          центром и наматываются на человека. Ровный радиальный граф читался бы
          как «интеграция работает» — то есть ровно наоборот. Пунктир — то, что
          до человека не доехало вовсе. */}
      <g fill="none" strokeLinecap="round" stroke={ACCENT} strokeWidth="1.5">
        <path d="M120 92C168 118 132 168 176 176" opacity="0.5" />
        <path d="M292 100C238 116 262 172 226 174" opacity="0.5" />
        <path d="M332 206C286 178 268 226 250 206" opacity="0.42" />
        <path d="M290 312C300 258 216 262 232 232" opacity="0.45" strokeDasharray="5 7" />
        <path d="M70 196C112 168 140 218 154 208" opacity="0.42" strokeDasharray="5 7" />
        <path d="M108 306C96 254 178 258 168 230" opacity="0.45" />
      </g>

      {/* Ещё четыре потока — из-за края кадра: их никто не звал, они просто
          идут. Короткие и гаснущие: если дотянуть их до центра, получится
          орнамент, который спорит с основными нитями. */}
      <g fill="none" strokeLinecap="round" stroke="url(#overload-fade)" strokeWidth="1.3">
        <path d="M4 58C40 68 62 82 78 100" />
        <path d="M396 62C362 74 342 88 328 106" />
        <path d="M10 348C44 336 66 320 80 302" />
        <path d="M390 344C356 332 336 316 322 298" />
      </g>

      {/* Единственная нить, уходящая мимо: лид, до которого не дошли руки. */}
      <path
        d="M104 340C112 356 122 372 130 388"
        fill="none"
        stroke={AMBER}
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.8"
      />
      <circle cx="131" cy="391" r="3.2" fill={AMBER} opacity="0.8" />
      {/* Центр: один человек за столом, на нём сходится всё. */}
      <rect
        x="152"
        y="150"
        width="96"
        height="96"
        rx="26"
        fill="#0F172A"
        stroke="rgba(255,255,255,0.12)"
      />
      <g
        stroke="#F7F8F8"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        <circle cx="200" cy="184" r="13" />
        <path d="M177 222a23 23 0 0 1 46 0" />
      </g>
      <path
        d="M164 236h72"
        stroke={ACCENT}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.45"
      />

      {/* Шесть каналов, в которых лежит одна и та же работа. */}
      <Token x={110} y={82} unread>
        {/* переписка */}
        <path d="M-9-7h18a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H-1l-5 4v-4h-3a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2Z" />
      </Token>
      <Token x={302} y={90} unread>
        {/* почта */}
        <path d="M-10-7h20a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-20a1 1 0 0 1-1-1V-6a1 1 0 0 1 1-1Z" />
        <path d="m-10-6 10 7 10-7" />
      </Token>
      <Token x={342} y={208} unread>
        {/* комментарии */}
        <path d="M-10-8h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-8l-4 3v-3h-2a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Z" />
        <path d="M8-3h2a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2v3l-4-3" />
      </Token>
      <Token x={300} y={322}>
        {/* звонки */}
        <path d="M-8-9h5l2 5-3 2a13 13 0 0 0 6 6l2-3 5 2v5a2 2 0 0 1-2 2A17 17 0 0 1-10-7a2 2 0 0 1 2-2Z" />
      </Token>
      <Token x={98} y={316}>
        {/* заявки с сайта */}
        <path d="M-9-9h18v18h-18Z" />
        <path d="M-5-4h10M-5 0h10M-5 4h6" />
      </Token>
      <Token x={60} y={194}>
        {/* уведомления */}
        <path d="M-7 4a7 7 0 0 0 3-6v-2a4 4 0 0 1 8 0v2a7 7 0 0 0 3 6Z" />
        <path d="M-2 7a2 2 0 0 0 4 0" />
      </Token>
    </svg>
  );
}
