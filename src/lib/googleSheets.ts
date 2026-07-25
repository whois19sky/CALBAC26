import { getSheetsClient } from "./google";

/**
 * Appends a row to the given sheet tab. If the tab doesn't have a header row yet,
 * one is written first. Each row is appended after the last used row, so this is
 * safe to call repeatedly (won't overwrite existing data).
 */
async function appendRow(sheetName: string, headers: string[], row: (string | number)[]) {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  if (!spreadsheetId) {
    throw new Error("GOOGLE_SHEET_ID is not set. See GOOGLE_SETUP.md.");
  }

  const sheets = getSheetsClient();

  // Ensure the header row exists (cheap check — reads row 1 only).
  const existing = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!A1:1`,
  }).catch(() => null);

  if (!existing?.data?.values || existing.data.values.length === 0) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetName}!A1`,
      valueInputOption: "RAW",
      requestBody: { values: [headers] },
    });
  }

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetName}!A1`,
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [row] },
  });
}

export async function appendBookingRow(booking: {
  id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  room_name: string;
  check_in: string;
  check_out: string;
  guests_count: number;
  notes?: string;
  total_amount?: number;
  status: string;
}) {
  const headers = [
    "Booking ID", "Guest Name", "Email", "Phone", "Room", "Check-in", "Check-out",
    "Guests", "Notes", "Total (₹)", "Status", "Synced At",
  ];
  const row = [
    booking.id,
    booking.guest_name,
    booking.guest_email,
    booking.guest_phone,
    booking.room_name,
    booking.check_in,
    booking.check_out,
    booking.guests_count,
    booking.notes || "",
    booking.total_amount ?? "",
    booking.status,
    new Date().toISOString(),
  ];
  await appendRow("Bookings", headers, row);
}

export async function appendCheckinRow(checkin: {
  booking_id: string;
  full_name: string;
  email: string;
  phone: string;
  nationality: string;
  id_type: string;
  id_number: string;
  emergency_contact?: string;
  special_requests?: string;
  id_image_drive_url?: string;
}) {
  const headers = [
    "Booking ID", "Full Name", "Email", "Phone", "Nationality", "ID Type",
    "ID Number", "Emergency Contact", "Special Requests", "ID Photo (Drive Link)", "Synced At",
  ];
  const row = [
    checkin.booking_id,
    checkin.full_name,
    checkin.email,
    checkin.phone,
    checkin.nationality,
    checkin.id_type,
    checkin.id_number,
    checkin.emergency_contact || "",
    checkin.special_requests || "",
    checkin.id_image_drive_url || "",
    new Date().toISOString(),
  ];
  await appendRow("Check-ins", headers, row);
}
