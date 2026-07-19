import type { IconType } from "react-icons";
import {
  TbTargetArrow,
  TbRobot,
  TbChartHistogram,
  TbMailBolt,
  TbRefresh,
  TbShieldCheck,
} from "react-icons/tb";

export const APP_ICONS: Record<string, IconType> = {
  target: TbTargetArrow,
  robot: TbRobot,
  chart: TbChartHistogram,
  mail: TbMailBolt,
  loop: TbRefresh,
  shield: TbShieldCheck,
};
