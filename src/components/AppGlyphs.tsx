import type { IconProps } from "./icons";

/**
 * Иконки приложений — свои, а не подобранные из общего набора.
 *
 * Раньше здесь стояли глифы Feather: crosshair, radio, mail. Они рисовали
 * предмет, а не работу — «мишень» одинаково подходит и охоте за клиентами, и
 * трендам, и радару лидов, поэтому в сетке из двенадцати карточек иконки не
 * различались. Здесь каждая рисует то, что инструмент делает: Poaching метит
 *人 в чужих комментариях, LeadRadar ловит сигнал, InboxZero разбирает ящик.
 *
 * Сетка 24×24, обводка 1.8 и скруглённые концы — общие для всех, поэтому
 * набор читается как один. Цвет наследуется от родителя (currentColor),
 * оттенок задаёт категория приложения (см. AppIcon).
 */

function Glyph({ size = "1em", children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
  );
}

/** Poaching — чужие клиенты взяты на прицел. */
export const GlyphPoaching = (p: IconProps) => (
  <Glyph {...p}>
    <circle cx="12" cy="12" r="8.4" />
    <path d="M12 1.9v2.3M12 19.8v2.3M1.9 12h2.3M19.8 12h2.3" />
    <circle cx="12" cy="10.2" r="2" />
    <path d="M8.5 16.7a3.7 3.7 0 0 1 7 0" />
  </Glyph>
);

/** LeadRadar — сигнал запроса, пойманный в эфире. */
export const GlyphLeadRadar = (p: IconProps) => (
  <Glyph {...p}>
    <circle cx="12" cy="18.4" r="1.6" fill="currentColor" stroke="none" />
    <path d="M8.3 15.1a5.2 5.2 0 0 1 7.4 0" />
    <path d="M5.6 11.9a9 9 0 0 1 12.8 0" />
    <path d="M3 8.8a12.8 12.8 0 0 1 18 0" />
  </Glyph>
);

/** CommentHunter — лупа по комментариям. */
export const GlyphCommentHunter = (p: IconProps) => (
  <Glyph {...p}>
    <path d="M4 7.5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H9.5L6 16v-2.5a2 2 0 0 1-2-2Z" />
    <circle cx="16" cy="16" r="3.4" />
    <path d="m18.6 18.6 2.4 2.4" />
  </Glyph>
);

/** ColdMessage — письмо, собранное моделью. */
export const GlyphColdMessage = (p: IconProps) => (
  <Glyph {...p}>
    <path d="M3 9a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
    <path d="m3.6 9.4 6.4 4.2 6.4-4.2" />
    <path d="M20 3v4M18 5h4" />
  </Glyph>
);

/** ObjectionKiller — возражение отбито. */
export const GlyphObjectionKiller = (p: IconProps) => (
  <Glyph {...p}>
    <path d="M12 3 5 6v5.2c0 4.2 2.8 7.4 7 8.8 4.2-1.4 7-4.6 7-8.8V6Z" />
    <path d="m9 12 2.2 2.2L15.4 10" />
  </Glyph>
);

/** FollowUpBot — возврат к сделке в срок. */
export const GlyphFollowUpBot = (p: IconProps) => (
  <Glyph {...p}>
    <circle cx="13" cy="13" r="6.5" />
    <path d="M13 9.5V13l2.4 1.4" />
    <path d="M4.6 10.2A8.6 8.6 0 0 1 13 3.6" />
    <path d="M4 6.6 4.7 10.4 8.4 9.4" />
  </Glyph>
);

/** SalesAgent — продавец на линии. */
export const GlyphSalesAgent = (p: IconProps) => (
  <Glyph {...p}>
    <circle cx="11.4" cy="8.6" r="3.2" />
    <path d="M4.9 19.6v-.5a6.5 6.5 0 0 1 13 0v.5" />
    <circle cx="19.6" cy="4.8" r="1.6" fill="currentColor" stroke="none" />
  </Glyph>
);

/** InboxZero — разобранный ящик. */
export const GlyphInboxZero = (p: IconProps) => (
  <Glyph {...p}>
    <path d="M3.5 13.5h4l1.4 2.4h6.2l1.4-2.4h4" />
    <path d="M3.5 13.5 6 7.2A2 2 0 0 1 7.9 6h8.2a2 2 0 0 1 1.9 1.2l2.5 6.3v4a2 2 0 0 1-2 2H5.5a2 2 0 0 1-2-2Z" />
    <path d="m9.6 9.6 1.6 1.6 3.2-3.2" />
  </Glyph>
);

/** PersonaChannel — текст, написанный вашим голосом. */
export const GlyphPersonaChannel = (p: IconProps) => (
  <Glyph {...p}>
    <path d="M14.9 3.9a2.2 2.2 0 0 1 3.2 3.2L8.5 16.6l-4.1 1.3 1.3-4.1Z" />
    <path d="m13.6 5.2 3.2 3.2" />
    <path d="M4.5 21h15" />
  </Glyph>
);

/** ContentLoop — контент по кругу. */
export const GlyphContentLoop = (p: IconProps) => (
  <Glyph {...p}>
    <path d="M4.6 10V9a3.6 3.6 0 0 1 3.6-3.6h8" />
    <path d="m13.8 2.8 2.6 2.6-2.6 2.6" />
    <path d="M19.4 14v1a3.6 3.6 0 0 1-3.6 3.6h-8" />
    <path d="m10.2 21.2-2.6-2.6 2.6-2.6" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
  </Glyph>
);

/** TrendSniper — тренд на подходе, взятый на мушку. */
export const GlyphTrendSniper = (p: IconProps) => (
  <Glyph {...p}>
    <path d="m3.5 17.5 4.6-4.6 3.4 3.4 3.4-3.4" />
    <circle cx="18.2" cy="9.4" r="2.9" />
    <circle cx="18.2" cy="9.4" r="0.9" fill="currentColor" stroke="none" />
  </Glyph>
);

/** BizDoctor — диагностика бизнеса. */
export const GlyphBizDoctor = (p: IconProps) => (
  <Glyph {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M6.8 12.4h2.3l1.7-3.6 2.3 6.4 1.6-2.8h2.5" />
  </Glyph>
);

/** Соответствие id приложения и его иконки. */
export const APP_GLYPHS = {
  poaching: GlyphPoaching,
  leadradar: GlyphLeadRadar,
  commenthunter: GlyphCommentHunter,
  coldmessage: GlyphColdMessage,
  objectionkiller: GlyphObjectionKiller,
  followupbot: GlyphFollowUpBot,
  salesagent: GlyphSalesAgent,
  inboxzero: GlyphInboxZero,
  personachannel: GlyphPersonaChannel,
  contentloop: GlyphContentLoop,
  trendsniper: GlyphTrendSniper,
  bizdoctor: GlyphBizDoctor,
} as const;
