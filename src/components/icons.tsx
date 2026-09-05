import type { SVGProps } from "react";

/**
 * Иконки проекта — инлайн-SVG вместо библиотеки.
 *
 * Раньше стоял react-icons: он тянул в бандл собственный рантайм и баррель-
 * модули на тысячи глифов ради полусотни используемых. Здесь ровно те иконки,
 * что реально нужны страницам, и ни одного лишнего килобайта JS.
 *
 * Пути взяты из наборов, что стояли до этого, поэтому вид не изменился:
 * Feather (Fi*) © Cole Bemis, Tabler (Tb*) © Paweł Kuna, Heroicons (Hi*)
 * © Tailwind Labs — все три под лицензией MIT.
 *
 * API совпадает с прежним (`<FiCheck size={16} className="..." />`), чтобы
 * места вызова не пришлось переписывать. Когда приедет свой набор SVG,
 * менять нужно только этот файл.
 */

export type IconProps = SVGProps<SVGSVGElement> & { size?: number | string };

/** Тип для мест, где иконка выбирается по ключу и хранится в словаре. */
export type IconComponent = (props: IconProps) => React.JSX.Element;

/** Контурные иконки: 24×24, обводка currentColor, скруглённые концы. */
function Outline({
  size = "1em",
  children,
  ...props
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
  );
}

/** Заливные иконки на сетке 20×20 — ими нарисовано меню в шапке. */
function Solid({
  size = "1em",
  children,
  ...props
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      width={size}
      height={size}
      fill="currentColor"
      {...props}
    >
      {children}
    </svg>
  );
}

export const FiActivity = (p: IconProps) => (
  <Outline {...p}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></Outline>
);

export const FiAlertCircle = (p: IconProps) => (
  <Outline {...p}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></Outline>
);

export const FiArrowLeft = (p: IconProps) => (
  <Outline {...p}><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></Outline>
);

export const FiArrowRight = (p: IconProps) => (
  <Outline {...p}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></Outline>
);

export const FiCalendar = (p: IconProps) => (
  <Outline {...p}><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></Outline>
);

export const FiCheck = (p: IconProps) => (
  <Outline {...p}><polyline points="20 6 9 17 4 12" /></Outline>
);

export const FiCheckCircle = (p: IconProps) => (
  <Outline {...p}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></Outline>
);

export const FiChevronDown = (p: IconProps) => (
  <Outline {...p}><polyline points="6 9 12 15 18 9" /></Outline>
);

export const FiChevronLeft = (p: IconProps) => (
  <Outline {...p}><polyline points="15 18 9 12 15 6" /></Outline>
);

export const FiChevronRight = (p: IconProps) => (
  <Outline {...p}><polyline points="9 18 15 12 9 6" /></Outline>
);

export const FiClock = (p: IconProps) => (
  <Outline {...p}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></Outline>
);

export const FiCopy = (p: IconProps) => (
  <Outline {...p}><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></Outline>
);

export const FiCornerUpLeft = (p: IconProps) => (
  <Outline {...p}><polyline points="9 14 4 9 9 4" /><path d="M20 20v-7a4 4 0 0 0-4-4H4" /></Outline>
);

export const FiCpu = (p: IconProps) => (
  <Outline {...p}><rect x="4" y="4" width="16" height="16" rx="2" ry="2" /><rect x="9" y="9" width="6" height="6" /><line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" /><line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" /><line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" /><line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" /></Outline>
);

export const FiCrosshair = (p: IconProps) => (
  <Outline {...p}><circle cx="12" cy="12" r="10" /><line x1="22" y1="12" x2="18" y2="12" /><line x1="6" y1="12" x2="2" y2="12" /><line x1="12" y1="6" x2="12" y2="2" /><line x1="12" y1="22" x2="12" y2="18" /></Outline>
);

export const FiFeather = (p: IconProps) => (
  <Outline {...p}><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" /><line x1="16" y1="8" x2="2" y2="22" /><line x1="17.5" y1="15" x2="9" y2="15" /></Outline>
);

export const FiHeart = (p: IconProps) => (
  <Outline {...p}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></Outline>
);

export const FiHelpCircle = (p: IconProps) => (
  <Outline {...p}><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></Outline>
);

export const FiInbox = (p: IconProps) => (
  <Outline {...p}><polyline points="22 12 16 12 14 15 10 15 8 12 2 12" /><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /></Outline>
);

export const FiInfo = (p: IconProps) => (
  <Outline {...p}><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></Outline>
);

export const FiLock = (p: IconProps) => (
  <Outline {...p}><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></Outline>
);

export const FiMail = (p: IconProps) => (
  <Outline {...p}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></Outline>
);

export const FiMapPin = (p: IconProps) => (
  <Outline {...p}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></Outline>
);

export const FiMessageCircle = (p: IconProps) => (
  <Outline {...p}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></Outline>
);

export const FiPhone = (p: IconProps) => (
  <Outline {...p}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></Outline>
);

export const FiRadio = (p: IconProps) => (
  <Outline {...p}><circle cx="12" cy="12" r="2" /><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14" /></Outline>
);

export const FiRefreshCw = (p: IconProps) => (
  <Outline {...p}><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></Outline>
);

export const FiRepeat = (p: IconProps) => (
  <Outline {...p}><polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" /></Outline>
);

export const FiRotateCcw = (p: IconProps) => (
  <Outline {...p}><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" /></Outline>
);

export const FiSearch = (p: IconProps) => (
  <Outline {...p}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></Outline>
);

export const FiSend = (p: IconProps) => (
  <Outline {...p}><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></Outline>
);

export const FiShield = (p: IconProps) => (
  <Outline {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></Outline>
);

export const FiSlash = (p: IconProps) => (
  <Outline {...p}><circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" /></Outline>
);

export const FiStar = (p: IconProps) => (
  <Outline {...p}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></Outline>
);

export const FiTarget = (p: IconProps) => (
  <Outline {...p}><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></Outline>
);

export const FiTrendingDown = (p: IconProps) => (
  <Outline {...p}><polyline points="23 18 13.5 8.5 8.5 13.5 1 6" /><polyline points="17 18 23 18 23 12" /></Outline>
);

export const FiTrendingUp = (p: IconProps) => (
  <Outline {...p}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></Outline>
);

export const FiUserCheck = (p: IconProps) => (
  <Outline {...p}><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><polyline points="17 11 19 13 23 9" /></Outline>
);

export const FiUsers = (p: IconProps) => (
  <Outline {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></Outline>
);

export const FiX = (p: IconProps) => (
  <Outline {...p}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Outline>
);

export const FiZap = (p: IconProps) => (
  <Outline {...p}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></Outline>
);

export const HiMenu = (p: IconProps) => (
  <Solid {...p}><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></Solid>
);

export const HiX = (p: IconProps) => (
  <Solid {...p}><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></Solid>
);

export const TbBolt = (p: IconProps) => (
  <Outline {...p}><path d="M13 3l0 7l6 0l-8 11l0 -7l-6 0l8 -11" /></Outline>
);

export const TbBrandTelegram = (p: IconProps) => (
  <Outline {...p}><path d="M15 10l-4 4l6 6l4 -16l-18 7l4 2l2 6l3 -4" /></Outline>
);

export const TbBrandWhatsapp = (p: IconProps) => (
  <Outline {...p}><path d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9" /><path d="M9 10a.5 .5 0 0 0 1 0v-1a.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a.5 .5 0 0 0 0 -1h-1a.5 .5 0 0 0 0 1" /></Outline>
);

export const TbCalculator = (p: IconProps) => (
  <Outline {...p}><path d="M4 5a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2l0 -14" /><path d="M8 8a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1v1a1 1 0 0 1 -1 1h-6a1 1 0 0 1 -1 -1l0 -1" /><path d="M8 14l0 .01" /><path d="M12 14l0 .01" /><path d="M16 14l0 .01" /><path d="M8 17l0 .01" /><path d="M12 17l0 .01" /><path d="M16 17l0 .01" /></Outline>
);

export const TbShieldCheck = (p: IconProps) => (
  <Outline {...p}><path d="M11.46 20.846a12 12 0 0 1 -7.96 -14.846a12 12 0 0 0 8.5 -3a12 12 0 0 0 8.5 3a12 12 0 0 1 -.09 7.06" /><path d="M15 19l2 2l4 -4" /></Outline>
);

export const TbSparkles = (p: IconProps) => (
  <Outline {...p}><path d="M16 18a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2m0 -12a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2m-7 12a6 6 0 0 1 6 -6a6 6 0 0 1 -6 -6a6 6 0 0 1 -6 6a6 6 0 0 1 6 6" /></Outline>
);

export const TbStethoscope = (p: IconProps) => (
  <Outline {...p}><path d="M6 4h-1a2 2 0 0 0 -2 2v3.5a5.5 5.5 0 0 0 11 0v-3.5a2 2 0 0 0 -2 -2h-1" /><path d="M8 15a6 6 0 1 0 12 0v-3" /><path d="M11 3v2" /><path d="M6 3v2" /><path d="M18 10a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /></Outline>
);

export const TbTrendingUp = (p: IconProps) => (
  <Outline {...p}><path d="M3 17l6 -6l4 4l8 -8" /><path d="M14 7l7 0l0 7" /></Outline>
);
