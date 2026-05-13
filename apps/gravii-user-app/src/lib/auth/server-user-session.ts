import "server-only";

import { resolveApiBaseUrl } from "@gravii/api-clients";

export const userSessionCookieName = "gravii_user_token";

const userSessionLifetimeSeconds = 24 * 60 * 60;
const defaultUserApiBaseUrl =
  "https://gravii-user-api-1077809741476.europe-west6.run.app";

export function getUserSessionCookieOptions() {
  return {
    httpOnly: true,
    maxAge: userSessionLifetimeSeconds,
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };
}

export function getClearedUserSessionCookieOptions() {
  return {
    expires: new Date(0),
    httpOnly: true,
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };
}

export function getServerUserApiBaseUrl() {
  return resolveApiBaseUrl({
    override: undefined,
    envKeys: [
      "GRAVII_USER_API_BASE_URL",
      "NEXT_PUBLIC_GRAVII_USER_API_BASE_URL",
      "NEXT_PUBLIC_USER_API_URL",
    ],
    fallback: defaultUserApiBaseUrl,
  }).replace(/\/$/, "");
}
