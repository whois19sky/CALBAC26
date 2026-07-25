// Server-side admin session handling.
// Uses a signed (HMAC-SHA256), expiring token instead of a plain "authenticated" string,
// so the session cookie can't just be guessed or copy-pasted by anyone.
// Uses Web Crypto (globalThis.crypto) so this also works in Next.js Edge Middleware.

const COOKIE_NAME = "admin_session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24; // 24 hours

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error(
      "ADMIN_SESSION_SECRET is not set. Add it to your environment variables (server-only, do NOT prefix with NEXT_PUBLIC_)."
    );
  }
  return secret;
}

// Edge Runtime (where middleware.ts runs) doesn't reliably provide Node's Buffer,
// so we encode using Web-standard btoa instead.
function arrayBufferToBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function hmac(data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return arrayBufferToBase64Url(signature);
}

/**
 * Creates a signed session token: `${expiryTimestamp}.${signature}`
 */
export async function createSessionToken(): Promise<string> {
  const expiry = Date.now() + SESSION_DURATION_MS;
  const payload = String(expiry);
  const signature = await hmac(payload);
  return `${payload}.${signature}`;
}

/**
 * Verifies a session token's signature and expiry.
 */
export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const expected = await hmac(payload);
  if (expected !== signature) return false;

  const expiry = Number(payload);
  if (!Number.isFinite(expiry) || Date.now() > expiry) return false;

  return true;
}

export function checkCredentials(email: string, password: string): boolean {
  const validEmail = process.env.ADMIN_EMAIL;
  const validPassword = process.env.ADMIN_PASSWORD;
  const missing: string[] = [];
  if (!validEmail) missing.push("ADMIN_EMAIL");
  if (!validPassword) missing.push("ADMIN_PASSWORD");
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variable(s) on the server: ${missing.join(", ")}. Set these in your hosting platform's environment variables (not just .env.local) and redeploy.`
    );
  }
  return email === validEmail && password === validPassword;
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;
export const ADMIN_SESSION_MAX_AGE_SECONDS = SESSION_DURATION_MS / 1000;
