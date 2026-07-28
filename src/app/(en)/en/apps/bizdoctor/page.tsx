import type { Metadata } from "next";
import AppPage, { appMetadata } from "@/components/pages/AppPage";
import BizDoctorTool from "@/components/bizdoctor/BizDoctorTool";

export const metadata: Metadata = appMetadata("en", "bizdoctor");

export default function BizdoctorPageEn() {
  return (
    <AppPage locale="en" id="bizdoctor">
      <BizDoctorTool locale="en" />
    </AppPage>
  );
}
