import type { Metadata } from "next";
import AppPage, { appMetadata } from "@/components/pages/AppPage";
import PersonaChannelTool from "@/components/personachannel/PersonaChannelTool";

export const metadata: Metadata = appMetadata("ru", "personachannel");

export default function PersonachannelPage() {
  return (
    <AppPage locale="ru" id="personachannel">
      <PersonaChannelTool locale="ru" />
    </AppPage>
  );
}
