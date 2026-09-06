import type { Metadata } from "next";
import AppPage, { appMetadata } from "@/components/pages/AppPage";
import ExternalAppShowcase from "@/components/ExternalAppShowcase";

export const metadata: Metadata = appMetadata("ru", "meetingscribe");

export default function MeetingScribePage() {
  return (
    <AppPage locale="ru" id="meetingscribe">
      <ExternalAppShowcase locale="ru" id="meetingscribe" />
    </AppPage>
  );
}
