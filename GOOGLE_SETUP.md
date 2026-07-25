# Google Sheets + Drive Sync — Setup Guide

Bookings and check-ins now automatically sync to a Google Sheet, and guest ID
photos uploaded at check-in are mirrored into a Google Drive folder. This
requires a one-time setup in Google Cloud. Takes about 10 minutes.

## 1. Create a Google Cloud project (skip if you already have one)
1. Go to https://console.cloud.google.com/
2. Create a new project (e.g. "Calcutta Backpackers")

## 2. Enable the two required APIs
In your project, go to **APIs & Services → Library** and enable:
- **Google Sheets API**
- **Google Drive API**

## 3. Create a Service Account
1. Go to **APIs & Services → Credentials → Create Credentials → Service Account**
2. Give it a name (e.g. `calcutta-backpackers-sync`)
3. No roles needed at the project level — click through and finish
4. Click into the new service account → **Keys** tab → **Add Key → Create new key → JSON**
5. A JSON file downloads. Open it — you'll need two values from it:
   - `client_email` → this is your `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `private_key` → this is your `GOOGLE_PRIVATE_KEY` (copy the whole thing, including
     `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`)

## 4. Create your Google Sheet
1. Create a new Google Sheet (anywhere in your Drive) — this will hold both a
   "Bookings" tab and a "Check-ins" tab, which the app creates automatically
   the first time it writes to them.
2. Copy the Sheet ID from its URL:
   `https://docs.google.com/spreadsheets/d/`**`THIS_PART_IS_THE_ID`**`/edit`
3. Click **Share** on the Sheet, and share it with your service account's
   `client_email` (from step 3) as **Editor**. This step is the #1 cause of
   "permission denied" errors if skipped.

## 5. Create your Google Drive folder (for ID photos)
1. Create a new folder in Google Drive (e.g. "Guest ID Uploads")
2. Copy the folder ID from its URL:
   `https://drive.google.com/drive/folders/`**`THIS_PART_IS_THE_ID`**
3. Share this folder with your service account's `client_email` as **Editor**,
   same as the Sheet.

## 6. Set your environment variables
In `.env.local` (or your hosting platform's environment variables):

```
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQ...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=1aBcD...xyz
GOOGLE_DRIVE_FOLDER_ID=1xYz...abc
```

**Important about `GOOGLE_PRIVATE_KEY`:** keep it wrapped in quotes and keep
the `\n` characters as literal `\n` text (not actual line breaks) — the app
converts them back to real newlines automatically. Most hosting platforms
(Vercel, Netlify, etc.) handle this correctly if you paste it in as one line.

## 7. Install the new dependency
```bash
npm install
```
(`googleapis` was added to `package.json`.)

## What happens now
- **New booking submitted** → a row is appended to the "Bookings" tab, and the
  guest's booking still completes even if this sync fails (checked separately
  in your server logs).
- **New check-in submitted** → the guest's uploaded ID photo is copied from
  Supabase Storage into your Drive folder, and a row is appended to the
  "Check-ins" tab with a link to that Drive copy.
- Both syncs are **non-blocking** — a Google API hiccup will never prevent a
  guest from completing a booking or check-in. Failures are logged to your
  server console (visible in your hosting platform's logs) so you can debug
  without ever affecting guests.

## Testing it
After setup, submit a test booking and a test check-in on your site, then
check your Google Sheet for the new rows and your Drive folder for the
mirrored ID photo.
