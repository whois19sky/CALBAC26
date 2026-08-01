import { google } from "googleapis";

/**
 * Server-only Google API client, authenticated via a service account.
 *
 * Setup required (see GOOGLE_SETUP.md for full walkthrough):
 * 1. Create a Google Cloud project, enable the Sheets API and Drive API.
 * 2. Create a Service Account, generate a JSON key.
 * 3. Set env vars: GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY_B64
 * 4. Share your target Google Sheet AND Google Drive folder with the
 *    service account's email address (as Editor) — this step is easy to
 *    miss and is the #1 cause of "permission denied" errors.
 */

function getServiceAccountAuth() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const base64Key = process.env.GOOGLE_PRIVATE_KEY_B64;
  const rawKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!email || (!base64Key && !rawKey)) {
    throw new Error(
      "GOOGLE_SERVICE_ACCOUNT_EMAIL / GOOGLE_PRIVATE_KEY_B64 are not set. See GOOGLE_SETUP.md."
    );
  }

  let normalizedKey: string;

  if (base64Key) {
    // Preferred: a base64-encoded key is just plain alphanumeric characters,
    // so it can never be corrupted by newline/quote-escaping issues in env
    // var import tools the way a raw multi-line PEM key can be.
    normalizedKey = Buffer.from(base64Key, "base64").toString("utf-8");
  } else {
    // Fallback: old-style raw key with literal "\n" sequences that need
    // converting back to real newlines.
    normalizedKey = rawKey!.replace(/\\n/g, "\n");
  }

  return new google.auth.JWT({
    email,
    key: normalizedKey,
    scopes: [
      "https://www.googleapis.com/auth/spreadsheets",
      "https://www.googleapis.com/auth/drive.file",
    ],
  });
}

export function getSheetsClient() {
  const auth = getServiceAccountAuth();
  return google.sheets({ version: "v4", auth });
}

export function getDriveClient() {
  const auth = getServiceAccountAuth();
  return google.drive({ version: "v3", auth });
}
