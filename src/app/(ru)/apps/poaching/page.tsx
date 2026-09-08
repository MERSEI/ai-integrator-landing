import type { Metadata } from "next";
import AppPage, { appMetadata } from "@/components/pages/AppPage";
import PoachingTool from "@/components/poaching/PoachingTool";
import { poachingSample } from "@/lib/demo/engineSample";

export const metadata: Metadata = appMetadata("ru", "poaching");

export default function PoachingPage() {
  return (
    <AppPage locale="ru" id="poaching">
      <PoachingTool locale="ru" sample={poachingSample("ru")} />
    </AppPage>
  );
}
