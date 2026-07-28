import type { Metadata } from "next";
import AppPage, { appMetadata } from "@/components/pages/AppPage";
import ObjectionKillerTool from "@/components/objectionkiller/ObjectionKillerTool";

export const metadata: Metadata = appMetadata("en", "objectionkiller");

export default function ObjectionkillerPageEn() {
  return (
    <AppPage locale="en" id="objectionkiller">
      <ObjectionKillerTool locale="en" />
    </AppPage>
  );
}
