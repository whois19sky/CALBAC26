import { NextRequest, NextResponse } from "next/server";
import {
  checkCredentials,
  createSessionToken,
  ADMIN_COOKIE_NAME,
  ADMIN_SESSION_MAX_AGE_SECONDS,
} from "@/lib/adminAuth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (typeof email !== "string" || typeof password !== "string") {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    if (!checkCredentials(email, password)) {
      // Generic error message on purpose — don't reveal whether the email or password was wrong.
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const token = await createSessionToken();

    const response = NextResponse.json({ ok: true });
    response.cookies.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true, // not readable/writable from client-side JS
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
    });

    return response;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server misconfiguration";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
