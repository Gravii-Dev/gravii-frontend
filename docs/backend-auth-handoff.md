# Backend Auth Handoff

This document defines the backend auth contract needed to support the current frontend rollout for `app.gravii.io`, `partner.gravii.io`, and `admin.gravii.io`.

## Ownership

Backend should implement the real auth endpoints and bearer-protected business APIs.

Frontend should keep owning:

- sign-in UI
- app-local bootstrap routes
- refresh-cookie storage on the app subdomain
- route protection and redirect logic

## Important Architecture Note

The frontend rollout assumes:

- short-lived access tokens are used as bearer tokens on direct Cloud Run business API calls
- refresh tokens are stored only in secure, `httpOnly`, app-owned cookies

Because the refresh cookie must belong to `app.gravii.io`, `partner.gravii.io`, or `admin.gravii.io`, raw Cloud Run auth domains should not be the final cookie owner.

Recommended production shape:

1. Frontend app route calls backend auth endpoint server-to-server.
2. Backend returns `session` and `refreshToken`.
3. Frontend app route stores `refreshToken` in the app-owned cookie.
4. Frontend returns `session` to the browser runtime.
5. Browser uses `Authorization: Bearer <accessToken>` for protected business API calls.

## Shared Response Types

Backend responses should align with the shared auth types in `packages/domain-types/src/auth.ts`.

Recommended auth bootstrap response shape:

```json
{
  "ok": true,
  "session": {
    "audience": "user",
    "accessToken": "string",
    "expiresAt": "2026-03-20T00:00:00.000Z",
    "refreshTokenExpiresAt": "2026-03-27T00:00:00.000Z",
    "issuedAt": "2026-03-20T00:00:00.000Z",
    "identity": {
      "audience": "user",
      "subject": "string",
      "role": "user",
      "provider": "wallet"
    }
  },
  "refreshToken": "string"
}
```

For plain browser-facing `session` reads, the frontend app route may strip `refreshToken` and return only:

```json
{
  "ok": true,
  "session": {}
}
```

## User API

### `POST /api/v1/auth/wallet/challenge`

Request body:

```json
{
  "walletAddress": "0xabc...",
  "walletChainFamily": "evm"
}
```

Response body:

```json
{
  "challengeId": "string",
  "walletAddress": "0xabc...",
  "walletChainFamily": "evm",
  "nonce": "string",
  "message": "string",
  "issuedAt": "2026-03-20T00:00:00.000Z",
  "expiresAt": "2026-03-20T00:05:00.000Z"
}
```

### `POST /api/v1/auth/wallet/verify`

Request body:

```json
{
  "challengeId": "string",
  "walletAddress": "0xabc...",
  "walletChainFamily": "evm",
  "signature": "0xsignature",
  "displayName": "optional"
}
```

Response body:

```json
{
  "ok": true,
  "session": {},
  "refreshToken": "string"
}
```

### `GET /api/v1/auth/session`

- used by app-local routes to restore the auth session from a refresh token

### `POST /api/v1/auth/refresh`

- rotates or reissues access tokens from a valid refresh token
- should return `ok`, `session`, and `refreshToken`

### `POST /api/v1/auth/logout`

- revokes the refresh token

### `GET /api/v1/me`

Minimum response shape:

```json
{
  "walletAddress": "0xabc...",
  "walletChainFamily": "evm",
  "profileStatus": "live",
  "tier": "Black",
  "primaryLabel": "Wealth Guard"
}
```

## Partner API

### `POST /api/v1/auth/provider/exchange`

Request body:

```json
{
  "provider": "google",
  "providerToken": "optional-provider-token",
  "email": "line@partner.com",
  "displayName": "Line Ops",
  "organizationSlug": "line"
}
```

Supported providers:

- `google`
- `microsoft`
- `email_magic_link`

Response body:

```json
{
  "ok": true,
  "session": {},
  "refreshToken": "string"
}
```

### `GET /api/v1/auth/session`

- used by app-local routes to restore partner auth state

### `POST /api/v1/auth/refresh`

- should return `ok`, `session`, and `refreshToken`

### `POST /api/v1/auth/logout`

- revokes the partner refresh token

### `GET /api/v1/me`

Minimum response shape:

```json
{
  "partnerId": "partner-line",
  "partnerName": "Line",
  "email": "line@partner.com",
  "provider": "google",
  "enabledModules": ["dashboard", "lens", "connect"]
}
```

## Admin API

### `POST /api/v1/auth/google/exchange`

Request body:

```json
{
  "provider": "google_workspace",
  "providerToken": "optional-provider-token",
  "email": "admin@gravii.io",
  "displayName": "Gravii Admin"
}
```

Backend requirements:

- validate the Google Workspace identity
- enforce allowed workspace domain
- enforce admin authorization

Response body:

```json
{
  "ok": true,
  "session": {},
  "refreshToken": "string"
}
```

### `GET /api/v1/auth/session`

- used by app-local routes to restore admin auth state

### `POST /api/v1/auth/refresh`

- should return `ok`, `session`, and `refreshToken`

### `POST /api/v1/auth/logout`

- revokes the admin refresh token

### `GET /api/v1/me`

Minimum response shape:

```json
{
  "email": "admin@gravii.io",
  "displayName": "Gravii Admin",
  "workspaceDomain": "gravii.io"
}
```

## OpenAPI Requirements

Backend should publish bearer auth explicitly in OpenAPI:

```yaml
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
```

Protected routes should declare:

```yaml
security:
  - bearerAuth: []
```

At minimum, all protected business routes and `GET /api/v1/me` should be declared as bearer-protected.

## Frontend Assumptions To Preserve

- no auth token storage in `localStorage`
- app-owned refresh cookies
- direct bearer calls from the browser to business APIs
- seeded QA can be removed once the real auth contract is live
