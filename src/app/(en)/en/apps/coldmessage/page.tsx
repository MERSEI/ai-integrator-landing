import type { Metadata } from "next";
import AppPage, { appMetadata } from "@/components/pages/AppPage";
import ColdMessageTool from "@/components/coldmessage/ColdMessageTool";

export const metadata: Metadata = appMetadata("en", "coldmessage");

export default function ColdmessagePageEn() {
  return (
    <AppPage locale="en" id="coldmessage">
      <ColdMessageTool locale="en" />
    </AppPage>
  );
}
