# Gravii API Documentation

## External APIs

### Landing API

**Purpose**: Serves the Gravii landing page (gravii.io). Handles wallet/email registration for the waitlist and label preview ("try it" experience).

**Auth**: None — public endpoints. Wallet signature is verified server-side but no login required.

| | Link |
|---|---|
| Swagger UI | https://gravii-landing-api-1077809741476.europe-west6.run.app/docs |
| OpenAPI Spec | https://gravii-landing-api-1077809741476.europe-west6.run.app/openapi.json |
| Repo | https://github.com/Gravii-Dev/gravii-landing-api |

---

### User API

**Purpose**: Serves the Gravii user app (app.gravii.io). Wallet analysis, behavioral labels, DeFi positions, trading history, and sybil detection.

**Auth**: Wallet signature — user connects their wallet (EVM or Solana) via WalletConnect and signs a message. The engine verifies the signature before returning data.

| | Link |
|---|---|
| Swagger UI | https://gravii-user-api-1077809741476.europe-west6.run.app/docs |
| OpenAPI Spec | https://gravii-user-api-1077809741476.europe-west6.run.app/openapi.json |
| Repo | https://github.com/Gravii-Dev/gravii-user-api |

---

### Partner API

**Purpose**: Serves the partner dashboard (partner.gravii.io). B2B analytics — population management, aggregate intelligence, behavioral labels, risk scoring, and sybil cluster detection across a partner's wallet population.

**Auth**: Email OAuth — partners log in with Gmail or Microsoft account. Firebase Auth issues a JWT which is verified by middleware on every request.

| | Link |
|---|---|
| Swagger UI | https://gravii-partner-api-1077809741476.europe-west6.run.app/docs |
| OpenAPI Spec | https://gravii-partner-api-1077809741476.europe-west6.run.app/openapi.json |
| Repo | https://github.com/Gravii-Dev/gravii-partner-api |

---

## Internal Engine

**Purpose**: Core intelligence engine — wallet analysis, labeling, sybil detection, dashboard aggregation, data feeds. Never exposed externally. Only callable by the 3 external APIs and the Telegram verifier via Cloud Run OIDC service-to-service auth.

**Auth**: OIDC — Cloud Run "Require authentication" setting. Calling services obtain an identity token from the GCP metadata server and pass it as a Bearer token.

| | Link |
|---|---|
| Swagger UI | https://gravii-api-1077809741476.europe-west6.run.app/docs |
| OpenAPI Spec | https://gravii-api-1077809741476.europe-west6.run.app/openapi.json |
| Repo | https://github.com/Gravii-Dev/gravii-api |

---

## How it fits together

```
gravii.io           →  Landing API (no auth)       ─┐
app.gravii.io       →  User API (wallet sig)        ├──OIDC──→  Engine (internal)
partner.gravii.io   →  Partner API (email OAuth)    ─┤
Telegram            →  Verifier (webhook secret)   ─┘
```

All external APIs are thin proxies — request validation, auth, and CORS. Business logic lives in the engine.
