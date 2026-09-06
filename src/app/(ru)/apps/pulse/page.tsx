import type { Metadata } from "next";
import AppPage, { appMetadata } from "@/components/pages/AppPage";
import ExternalAppShowcase from "@/components/ExternalAppShowcase";

export const metadata: Metadata = appMetadata("ru", "pulse");

export default function PulsePage() {
  return (
    <AppPage locale="ru" id="pulse">
      <ExternalAppShowcase locale="ru" id="pulse" />
    </AppPage>
  );
}
