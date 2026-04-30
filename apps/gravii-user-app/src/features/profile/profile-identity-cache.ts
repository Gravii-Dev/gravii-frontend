"use client";

import {
  clearUserIdentityBootstrapPending,
  readUserIdentity,
  type GraviiIdentity,
} from "@/lib/auth/user-api";

let cachedProfileIdentity: GraviiIdentity | null = null;
let profileIdentityRequest: Promise<GraviiIdentity | null> | null = null;

export function peekProfileIdentity() {
  return cachedProfileIdentity;
}

export function storeProfileIdentity(identity: GraviiIdentity) {
  cachedProfileIdentity = identity;
}

export function clearProfileIdentityCache() {
  cachedProfileIdentity = null;
  profileIdentityRequest = null;
}

export async function prefetchProfileIdentity() {
  if (cachedProfileIdentity) {
    return cachedProfileIdentity;
  }

  if (profileIdentityRequest) {
    return profileIdentityRequest;
  }

  profileIdentityRequest = readUserIdentity()
    .then((identity) => {
      cachedProfileIdentity = identity;
      clearUserIdentityBootstrapPending();
      return identity;
    })
    .catch(() => null)
    .finally(() => {
      profileIdentityRequest = null;
    });

  return profileIdentityRequest;
}
