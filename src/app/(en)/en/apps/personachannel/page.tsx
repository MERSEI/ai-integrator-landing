import type { Metadata } from "next";
import AppPage, { appMetadata } from "@/components/pages/AppPage";
import PersonaChannelTool from "@/components/personachannel/PersonaChannelTool";

export const metadata: Metadata = appMetadata("en", "personachannel");

export default function PersonachannelPageEn() {
  return (
    <AppPage locale="en" id="personachannel">
      <PersonaChannelTool locale="en" />
    </AppPage>
  );
}
