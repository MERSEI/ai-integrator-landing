import type { Metadata } from "next";
import AppPage, { appMetadata } from "@/components/pages/AppPage";
import TrendSniperTool from "@/components/trendsniper/TrendSniperTool";
import { trendSniperSample } from "@/lib/demo/engineSample";

export const metadata: Metadata = appMetadata("ru", "trendsniper");

export default function TrendsniperPage() {
  return (
    <AppPage locale="ru" id="trendsniper">
      <TrendSniperTool locale="ru" sample={trendSniperSample("ru")} />
    </AppPage>
  );
}
