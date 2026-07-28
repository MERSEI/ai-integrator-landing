import type { Metadata } from "next";
import AppPage, { appMetadata } from "@/components/pages/AppPage";
import CommentHunterTool from "@/components/commenthunter/CommentHunterTool";

export const metadata: Metadata = appMetadata("en", "commenthunter");

export default function CommenthunterPageEn() {
  return (
    <AppPage locale="en" id="commenthunter">
      <CommentHunterTool locale="en" />
    </AppPage>
  );
}
