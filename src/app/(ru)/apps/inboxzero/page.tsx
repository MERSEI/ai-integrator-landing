import type { Metadata } from "next";
import AppPage, { appMetadata } from "@/components/pages/AppPage";
import InboxZeroTool from "@/components/inboxzero/InboxZeroTool";

export const metadata: Metadata = appMetadata("ru", "inboxzero");

export default function InboxzeroPage() {
  return (
    <AppPage locale="ru" id="inboxzero">
      <InboxZeroTool locale="ru" />
    </AppPage>
  );
}
