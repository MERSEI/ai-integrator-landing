import { ogImage, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/ogImage";

export const alt = "AI Integrator";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return ogImage("en");
}
