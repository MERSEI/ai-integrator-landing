import type { Metadata } from "next";
import AppPage, { appMetadata } from "@/components/pages/AppPage";
import ExternalAppShowcase from "@/components/ExternalAppShowcase";

export const metadata: Metadata = appMetadata("en", "pulse");

export default function PulsePageEn() {
  return (
    <AppPage locale="en" id="pulse">
      <ExternalAppShowcase locale="en" id="pulse" />
    </AppPage>
  );
}
