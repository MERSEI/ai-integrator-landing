import type { Metadata } from "next";
import { buildMetadata, LocaleRoot } from "@/lib/layout";
import "../globals.css";

export const metadata: Metadata = buildMetadata("en");

export default function EnRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <LocaleRoot locale="en">{children}</LocaleRoot>;
}
