# API Clients

Thin shared fetch wrappers for the live Gravii APIs.

Current scope:

- centralize base URLs
- centralize request and error handling
- expose endpoint-specific client methods
- allow app adapters to supply their own response types

Non-goals for now:

- generated SDKs
- strict OpenAPI-to-TypeScript codegen
- frontend state management
- direct UI wiring

The current OpenAPI specs expose real routes, but they are still too loose for a heavy codegen-first contract package. These clients keep the shared access layer thin while leaving response shaping to app-level adapters.
