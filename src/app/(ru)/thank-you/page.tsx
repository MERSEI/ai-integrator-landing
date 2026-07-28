import type { Metadata } from "next";
import ThankYouPage from "@/components/pages/ThankYouPage";
import { getContent } from "@/lib/content";

export const metadata: Metadata = {
  title: getContent("ru").thankYou.metaTitle,
  robots: { index: false },
};

export default function ThankYou() {
  return <ThankYouPage locale="ru" />;
}
