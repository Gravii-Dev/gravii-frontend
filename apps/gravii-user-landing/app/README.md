# App Directory

Next.js App Router pages and metadata routes for the Gravii landing app.

## Structure

```text
app/
  (site)/
    page.tsx              # Public landing page
    actions.ts            # Waitlist server action
    partners/page.tsx     # Partner acquisition route
    privacy/page.tsx
    terms/page.tsx
  layout.tsx              # Root metadata and app shell
  manifest.ts
  robots.ts
  sitemap.ts
```

## Route Rules

- Keep route files thin.
- Put reusable landing sections in `components/sections`.
- Keep non-UI logic in `lib`.
- Preserve `/partners` handoff behavior unless the partner acquisition flow is explicitly changed.
