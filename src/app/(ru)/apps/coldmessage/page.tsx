import type { Metadata } from "next";
import AppPage, { appMetadata } from "@/components/pages/AppPage";
import ColdMessageTool from "@/components/coldmessage/ColdMessageTool";

export const metadata: Metadata = appMetadata("ru", "coldmessage");

export default function ColdmessagePage() {
  return (
    <AppPage locale="ru" id="coldmessage">
      <ColdMessageTool locale="ru" />
    </AppPage>
  );
}
