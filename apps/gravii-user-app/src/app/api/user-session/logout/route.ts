import { NextResponse } from "next/server";

import {
  getClearedUserSessionCookieOptions,
  userSessionCookieName,
} from "@/lib/auth/server-user-session";

export async function POST() {
  const response = NextResponse.json({ ok: true });

  response.cookies.set(
    userSessionCookieName,
    "",
    getClearedUserSessionCookieOptions()
  );

  return response;
}
