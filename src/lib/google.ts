import { google } from "googleapis";

/**
 * Server-only Google API client, authenticated via a service account.
 *
 * Setup required (see GOOGLE_SETUP.md for full walkthrough):
 * 1. Create a Google Cloud project, enable the Sheets API and Drive API.
 * 2. Create a Service Account, generate a JSON key.
 * 3. Set env vars: GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY
 * 4. Share your target Google Sheet AND Google Drive folder with the
 *    service account's email address (as Editor) — this step is easy to
 *    miss and is the #1 cause of "permission denied" errors.
 */

function getServiceAccountAuth() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!email || !privateKey) {
    throw new Error(
      "GOOGLE_SERVICE_ACCOUNT_EMAIL / GOOGLE_PRIVATE_KEY are not set. See GOOGLE_SETUP.md."
    );
  }

  // Private keys stored in env vars usually have their real newlines escaped as
  // literal "\n" — convert them back before handing to the JWT client.
  const normalizedKey = privateKey.replace(/\\n/g, "\n");

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
