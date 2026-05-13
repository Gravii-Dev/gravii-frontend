import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import {
  getClearedUserSessionCookieOptions,
  getServerUserApiBaseUrl,
  getUserSessionCookieOptions,
  userSessionCookieName,
} from "@/lib/auth/server-user-session";

type UserApiRouteContext = {
  params: Promise<{
    path?: string[];
  }>;
};

type BackendVerifyPayload = {
  token?: unknown;
  [key: string]: unknown;
};

function getForwardedRequestHeaders(request: NextRequest, accessToken: string | undefined) {
  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  const accept = request.headers.get("accept");

  if (contentType) {
    headers.set("content-type", contentType);
  }

  if (accept) {
    headers.set("accept", accept);
  }

  if (accessToken) {
    headers.set("authorization", `Bearer ${accessToken}`);
  }

  return headers;
}

function getResponseHeaders(upstream: Response) {
  const headers = new Headers();
  const contentType = upstream.headers.get("content-type");
  const cacheControl = upstream.headers.get("cache-control");

  if (contentType) {
    headers.set("content-type", contentType);
  }

  if (cacheControl) {
    headers.set("cache-control", cacheControl);
  } else {
    headers.set("cache-control", "no-store");
  }

  return headers;
}

function buildBackendUrl(pathSegments: string[], request: NextRequest) {
  const normalizedSegments =
    pathSegments[0] === "api" && pathSegments[1] === "v1"
      ? pathSegments.slice(2)
      : pathSegments;
  const encodedPath = normalizedSegments
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  const backendUrl = new URL(`/api/v1/${encodedPath}`, getServerUserApiBaseUrl());
  backendUrl.search = request.nextUrl.search;
  return backendUrl;
}

async function readRequestBody(request: NextRequest) {
  if (request.method === "GET" || request.method === "HEAD") {
    return undefined;
  }

  return request.text();
}

function isVerifyRoute(pathSegments: string[]) {
  const normalizedSegments =
    pathSegments[0] === "api" && pathSegments[1] === "v1"
      ? pathSegments.slice(2)
      : pathSegments;

  return normalizedSegments.join("/") === "auth/verify";
}

async function proxyUserApiRequest(request: NextRequest, context: UserApiRouteContext) {
  const { path = [] } = await context.params;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(userSessionCookieName)?.value;
  const backendUrl = buildBackendUrl(path, request);
  const upstream = await fetch(backendUrl, {
    body: await readRequestBody(request),
    cache: "no-store",
    headers: getForwardedRequestHeaders(request, accessToken),
    method: request.method,
    redirect: "manual",
  });

  const headers = getResponseHeaders(upstream);
  const isJson = headers.get("content-type")?.includes("application/json") ?? false;

  if (isVerifyRoute(path) && upstream.ok && isJson) {
    const payload = (await upstream.json()) as BackendVerifyPayload;
    const token = typeof payload.token === "string" ? payload.token : null;

    if (token) {
      delete payload.token;
    }

    const response = NextResponse.json(payload, {
      headers,
      status: upstream.status,
    });

    if (token) {
      response.cookies.set(userSessionCookieName, token, getUserSessionCookieOptions());
    }

    return response;
  }

  const body = upstream.status === 204 ? null : await upstream.arrayBuffer();
  const response = new NextResponse(body, {
    headers,
    status: upstream.status,
  });

  if (upstream.status === 401 && accessToken) {
    response.cookies.set(
      userSessionCookieName,
      "",
      getClearedUserSessionCookieOptions()
    );
  }

  return response;
}

export const GET = proxyUserApiRequest;
export const POST = proxyUserApiRequest;
export const PUT = proxyUserApiRequest;
export const PATCH = proxyUserApiRequest;
export const DELETE = proxyUserApiRequest;
