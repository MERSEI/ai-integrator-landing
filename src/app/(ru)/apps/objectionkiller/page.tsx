import type { Metadata } from "next";
import AppPage, { appMetadata } from "@/components/pages/AppPage";
import ObjectionKillerTool from "@/components/objectionkiller/ObjectionKillerTool";

export const metadata: Metadata = appMetadata("ru", "objectionkiller");

export default function ObjectionkillerPage() {
  return (
    <AppPage locale="ru" id="objectionkiller">
      <ObjectionKillerTool locale="ru" />
    </AppPage>
  );
}
