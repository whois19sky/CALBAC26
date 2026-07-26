import { NextRequest, NextResponse } from "next/server";
import { appendCheckinRow } from "@/lib/googleSheets";
import { mirrorFileToDrive } from "@/lib/googleDrive";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const required = ["booking_id", "full_name", "email", "phone", "nationality", "id_type", "id_number"];
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing field: ${field}` }, { status: 400 });
      }
    }

    let id_image_drive_url: string | undefined;

    if (body.id_image_url) {
      try {
        const safeName = body.full_name.replace(/[^a-zA-Z0-9]+/g, "_");
        const ext = body.id_image_url.split(".").pop()?.split("?")[0] || "jpg";
        id_image_drive_url = await mirrorFileToDrive(
          body.id_image_url,
          `${safeName}_${body.id_type}_${Date.now()}.${ext}`
        );
      } catch (driveErr) {
        // Don't fail the whole check-in sync just because the Drive mirror failed —
        // the row still gets logged to Sheets with the original Supabase URL noted.
        console.error("Google Drive mirror failed:", driveErr);
      }
    }

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

    return NextResponse.json({ ok: true, id_image_drive_url });
  } catch (err) {
    console.error("Google Sheets check-in sync failed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Sync failed" },
      { status: 500 }
    );
  }
}
