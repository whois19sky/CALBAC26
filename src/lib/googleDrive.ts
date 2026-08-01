import { Readable } from "stream";
import { getDriveClient } from "./google";

/**
 * Downloads a file from a public URL (e.g. a Supabase Storage public URL) and
 * uploads it into the configured Google Drive folder. Returns a shareable link.
 */
export async function mirrorFileToDrive(fileUrl: string, fileName: string): Promise<string> {
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
  if (!folderId) {
    throw new Error("GOOGLE_DRIVE_FOLDER_ID is not set. See GOOGLE_SETUP.md.");
  }

  const response = await fetch(fileUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch source file (${response.status}): ${fileUrl}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const mimeType = response.headers.get("content-type") || "application/octet-stream";

  const drive = getDriveClient();

  const created = await drive.files.create({
    requestBody: {
      name: fileName,
      parents: [folderId],
    },
    media: {
      mimeType,
      body: Readable.from(buffer),
    },
    fields: "id, webViewLink",
    supportsAllDrives: true, // Required for uploads into a Shared Drive folder
  });

  const fileId = created.data.id;
  if (!fileId) {
    throw new Error("Google Drive upload did not return a file ID.");
  }

  // Anyone with the link can view — matches the convenience of the original
  // Supabase public storage link. Tighten this if you need stricter access control.
  await drive.permissions.create({
    fileId,
    requestBody: { role: "reader", type: "anyone" },
    supportsAllDrives: true,
  });

  return created.data.webViewLink || `https://drive.google.com/file/d/${fileId}/view`;
}
