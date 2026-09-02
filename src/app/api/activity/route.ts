import { NextResponse } from "next/server";
import { readRecentRuns } from "@/lib/activity";

/** Лента отдаётся без кеша: смысл в том, что она свежая. */
export const dynamic = "force-dynamic";

export async function GET() {
  const runs = await readRecentRuns(5);
  return NextResponse.json(
    { runs },
    { headers: { "Cache-Control": "no-store" } },
  );
}
