import type { Metadata } from "next";
import AppPage, { appMetadata } from "@/components/pages/AppPage";
import FollowUpBotTool from "@/components/followupbot/FollowUpBotTool";

export const metadata: Metadata = appMetadata("en", "followupbot");

export default function FollowupbotPageEn() {
  return (
    <AppPage locale="en" id="followupbot">
      <FollowUpBotTool locale="en" />
    </AppPage>
  );
}
