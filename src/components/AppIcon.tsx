
import { APP_GLYPHS } from "./AppGlyphs";
/**
 * Плитка приложения: своя иконка (см. AppGlyphs) в подложке, окрашенной по
 * категории — в сетке сразу видно группы, а внутри группы иконки различаются.
 */

const TINT: Record<string, string> = {
  attract: "from-accent-blue/[0.18] text-accent-blue ring-accent-blue/20",
  sales: "from-accent-violet/[0.18] text-accent-violet ring-accent-violet/20",
  content: "from-success/[0.18] text-success ring-success/20",
  analytics: "from-warning/[0.18] text-warning ring-warning/20",
};

export default function AppIcon({
  id,
  category,
  size = 52,
}: {
  id: string;
  category: string;
  size?: number;
}) {
  const Glyph = APP_GLYPHS[id as keyof typeof APP_GLYPHS] ?? APP_GLYPHS.bizdoctor;
  const tint = TINT[category] ?? TINT.attract;

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-b to-transparent ring-1 ring-inset ${tint}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <Glyph size={Math.round(size * 0.46)} />
    </span>
  );
}
