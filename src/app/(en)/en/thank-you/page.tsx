import type { Metadata } from "next";
import ThankYouPage from "@/components/pages/ThankYouPage";
import { getContent } from "@/lib/content";

export const metadata: Metadata = {
  title: getContent("en").thankYou.metaTitle,
  robots: { index: false },
};

export default function ThankYouEn() {
  return <ThankYouPage locale="en" />;
}
