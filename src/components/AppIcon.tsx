
import { FiActivity, FiCrosshair, FiFeather, FiInbox, FiMail, FiMessageCircle, FiRadio, FiRefreshCw, FiRepeat, FiShield, FiTrendingUp, FiUserCheck , type IconComponent } from "./icons";
/**
 * Иконки приложений: один набор (Feather) с общей обводкой вместо разнородных
 * сгенерированных картинок. Тон задаёт категория, поэтому в сетке видно группы.
 */
const GLYPH: Record<string, IconComponent> = {
  poaching: FiCrosshair,
  leadradar: FiRadio,
  commenthunter: FiMessageCircle,
  coldmessage: FiMail,
  objectionkiller: FiShield,
  followupbot: FiRefreshCw,
  salesagent: FiUserCheck,
  inboxzero: FiInbox,
  personachannel: FiFeather,
  contentloop: FiRepeat,
  trendsniper: FiTrendingUp,
  bizdoctor: FiActivity,
};

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
  const Glyph = GLYPH[id] ?? FiActivity;
  const tint = TINT[category] ?? TINT.attract;

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-b to-transparent ring-1 ring-inset ${tint}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <Glyph size={Math.round(size * 0.42)} />
    </span>
  );
}
