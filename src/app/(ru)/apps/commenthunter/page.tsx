import type { Metadata } from "next";
import AppPage, { appMetadata } from "@/components/pages/AppPage";
import CommentHunterTool from "@/components/commenthunter/CommentHunterTool";
import { commentHunterSample } from "@/lib/demo/engineSample";

export const metadata: Metadata = appMetadata("ru", "commenthunter");

export default function CommenthunterPage() {
  return (
    <AppPage locale="ru" id="commenthunter">
      <CommentHunterTool locale="ru" sample={commentHunterSample("ru")} />
    </AppPage>
  );
}
