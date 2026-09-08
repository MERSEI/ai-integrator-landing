import type { Metadata } from "next";
import AppPage, { appMetadata } from "@/components/pages/AppPage";
import TrendSniperTool from "@/components/trendsniper/TrendSniperTool";
import { trendSniperSample } from "@/lib/demo/engineSample";

export const metadata: Metadata = appMetadata("en", "trendsniper");

export default function TrendsniperPageEn() {
  return (
    <AppPage locale="en" id="trendsniper">
      <TrendSniperTool locale="en" sample={trendSniperSample("en")} />
    </AppPage>
  );
}
