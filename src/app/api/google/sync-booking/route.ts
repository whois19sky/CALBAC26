import { NextRequest, NextResponse } from "next/server";
import { appendBookingRow } from "@/lib/googleSheets";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const required = ["id", "guest_name", "guest_email", "guest_phone", "room_name", "check_in", "check_out", "guests_count", "status"];
    for (const field of required) {
      if (body[field] === undefined || body[field] === null) {
        return NextResponse.json({ error: `Missing field: ${field}` }, { status: 400 });
      }
    }

    await appendBookingRow(body);
    return NextResponse.json({ ok: true });
  } catch (err) {
    // Sync failures should never block a guest's booking — log and return a
    // non-fatal error so the caller can decide whether to surface it.
    console.error("Google Sheets booking sync failed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Sync failed" },
      { status: 500 }
    );
  }
}
