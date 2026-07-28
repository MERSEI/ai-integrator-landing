import type { Metadata } from "next";
import AppPage, { appMetadata } from "@/components/pages/AppPage";
import LeadRadarTool from "@/components/leadradar/LeadRadarTool";

export const metadata: Metadata = appMetadata("en", "leadradar");

export default function LeadradarPageEn() {
  return (
    <AppPage locale="en" id="leadradar">
      <LeadRadarTool locale="en" />
    </AppPage>
  );
}
