import type { Metadata } from "next";
import AppPage, { appMetadata } from "@/components/pages/AppPage";
import BizDoctorTool from "@/components/bizdoctor/BizDoctorTool";

export const metadata: Metadata = appMetadata("ru", "bizdoctor");

export default function BizdoctorPage() {
  return (
    <AppPage locale="ru" id="bizdoctor">
      <BizDoctorTool locale="ru" />
    </AppPage>
  );
}
