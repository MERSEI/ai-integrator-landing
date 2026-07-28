import type { Metadata } from "next";
import AppPage, { appMetadata } from "@/components/pages/AppPage";
import PoachingTool from "@/components/poaching/PoachingTool";

export const metadata: Metadata = appMetadata("ru", "poaching");

export default function PoachingPage() {
  return (
    <AppPage locale="ru" id="poaching">
      <PoachingTool locale="ru" />
    </AppPage>
  );
}
