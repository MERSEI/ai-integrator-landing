import type { Metadata } from "next";
import AppPage, { appMetadata } from "@/components/pages/AppPage";
import ExternalAppShowcase from "@/components/ExternalAppShowcase";

export const metadata: Metadata = appMetadata("en", "meetingscribe");

export default function MeetingScribePageEn() {
  return (
    <AppPage locale="en" id="meetingscribe">
      <ExternalAppShowcase locale="en" id="meetingscribe" />
    </AppPage>
  );
}
