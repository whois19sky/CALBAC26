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

// Converts an ISO date (yyyy-mm-dd) to ddmmyyyy, matching the sheet's expected format.
function toDdMmYyyy(isoDate: string): string {
  if (!isoDate) return "";
  const [year, month, day] = isoDate.split("-");
  if (!year || !month || !day) return isoDate; // fall back to whatever was given
  return `${day}${month}${year}`;
}

export async function appendCheckinRow(checkin: {
  full_name: string;
  address?: string;
  nationality: string;
  phone: string;
  email: string;
  check_in?: string;
  check_out?: string;
  id_number: string;
  visa_no?: string;
  coming_from?: string;
  going_to?: string;
}) {
  const headers = [
    "Full Name", "Address", "Country", "Phone", "E-mail",
    "Check In Date (ddmmyyyy)", "Check Out Date (ddmmyyyy)",
    "Identity Doc. No.", "Visa No.", "Coming From", "Going To",
  ];
  const row = [
    checkin.full_name,
    checkin.address || "",
    checkin.nationality,
    checkin.phone,
    checkin.email,
    toDdMmYyyy(checkin.check_in || ""),
    toDdMmYyyy(checkin.check_out || ""),
    checkin.id_number,
    checkin.visa_no || "",
    checkin.coming_from || "",
    checkin.going_to || "",
  ];
  // Writing to "Sheet1" to match the tab in the existing hand-built sheet,
  // rather than auto-creating a separate "Check-ins" tab.
  await appendRow("Sheet1", headers, row);
}
