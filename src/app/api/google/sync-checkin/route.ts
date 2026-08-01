import { NextRequest, NextResponse } from "next/server";
import { appendCheckinRow } from "@/lib/googleSheets";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const required = ["booking_id", "full_name", "email", "phone", "nationality", "id_type", "id_number"];
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing field: ${field}` }, { status: 400 });
      }
    }

    // ID photos are stored in Supabase Storage only - the Google Drive mirror
    // was retired due to Google service account storage restrictions that
    // require a paid Shared Drive setup. body.id_image_url (the Supabase link)
    // is passed straight through to the Sheet instead.
    await appendCheckinRow({
      full_name: body.full_name,
      address: body.address,
      nationality: body.nationality,
      phone: body.phone,
      email: body.email,
      check_in: body.check_in,
      check_out: body.check_out,
      id_number: body.id_number,
      visa_no: body.visa_no,
      coming_from: body.coming_from,
      going_to: body.going_to,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Google Sheets check-in sync failed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Sync failed" },
      { status: 500 }
    );
  }
}
