import { NextRequest, NextResponse } from "next/server";
import { upstash, upstashCreds } from "@/lib/rate-limit";
import { LEADS_KEY, type Lead } from "@/lib/leads";

/**
 * Приватный просмотр лидов, накопленных через /api/subscribe.
 * Требует Authorization: Bearer <LEADS_ADMIN_TOKEN>.
 */
export async function GET(req: NextRequest) {
  const adminToken = process.env.LEADS_ADMIN_TOKEN;
  const provided = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  if (!adminToken || provided !== adminToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const creds = upstashCreds();
  if (!creds) {
    return NextResponse.json(
      { error: "Upstash не настроен — лиды не сохраняются" },
      { status: 503 }
    );
  }

  const raw = (await upstash(creds, ["LRANGE", LEADS_KEY, "0", "-1"])) as
    | string[]
    | null;

  const leads: Lead[] = (raw ?? [])
    .map((s) => {
      try {
        return JSON.parse(s) as Lead;
      } catch {
        return null;
      }
    })
    .filter((l): l is Lead => l !== null);

  return NextResponse.json({ count: leads.length, leads });
}
