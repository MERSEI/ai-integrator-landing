import type { Metadata } from "next";
import { buildMetadata, LocaleRoot } from "@/lib/layout";
import "../globals.css";

export const metadata: Metadata = buildMetadata("ru");

export default function RuRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <LocaleRoot locale="ru">{children}</LocaleRoot>;
}
