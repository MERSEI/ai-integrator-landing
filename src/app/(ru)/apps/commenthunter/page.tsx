import type { Metadata } from "next";
import AppPage, { appMetadata } from "@/components/pages/AppPage";
import CommentHunterTool from "@/components/commenthunter/CommentHunterTool";

export const metadata: Metadata = appMetadata("ru", "commenthunter");

export default function CommenthunterPage() {
  return (
    <AppPage locale="ru" id="commenthunter">
      <CommentHunterTool locale="ru" />
    </AppPage>
  );
}
