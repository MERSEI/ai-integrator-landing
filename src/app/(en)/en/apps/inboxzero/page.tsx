import type { Metadata } from "next";
import AppPage, { appMetadata } from "@/components/pages/AppPage";
import InboxZeroTool from "@/components/inboxzero/InboxZeroTool";

export const metadata: Metadata = appMetadata("en", "inboxzero");

export default function InboxzeroPageEn() {
  return (
    <AppPage locale="en" id="inboxzero">
      <InboxZeroTool locale="en" />
    </AppPage>
  );
}
