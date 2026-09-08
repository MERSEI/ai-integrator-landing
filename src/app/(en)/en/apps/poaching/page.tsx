import type { Metadata } from "next";
import AppPage, { appMetadata } from "@/components/pages/AppPage";
import PoachingTool from "@/components/poaching/PoachingTool";
import { poachingSample } from "@/lib/demo/engineSample";

export const metadata: Metadata = appMetadata("en", "poaching");

export default function PoachingPageEn() {
  return (
    <AppPage locale="en" id="poaching">
      <PoachingTool locale="en" sample={poachingSample("en")} />
    </AppPage>
  );
}
