import type { Metadata } from "next";
import AppPage, { appMetadata } from "@/components/pages/AppPage";
import FollowUpBotTool from "@/components/followupbot/FollowUpBotTool";

export const metadata: Metadata = appMetadata("ru", "followupbot");

export default function FollowupbotPage() {
  return (
    <AppPage locale="ru" id="followupbot">
      <FollowUpBotTool locale="ru" />
    </AppPage>
  );
}
