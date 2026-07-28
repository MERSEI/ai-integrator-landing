import type { Metadata } from "next";
import AppPage, { appMetadata } from "@/components/pages/AppPage";
import LeadRadarTool from "@/components/leadradar/LeadRadarTool";

export const metadata: Metadata = appMetadata("ru", "leadradar");

export default function LeadradarPage() {
  return (
    <AppPage locale="ru" id="leadradar">
      <LeadRadarTool locale="ru" />
    </AppPage>
  );
}
