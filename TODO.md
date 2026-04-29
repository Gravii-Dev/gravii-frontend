# Durable TODO

Use this file for remaining actionable work that should survive session boundaries. Do not log completed work here, and do not mirror the active execution steps from `PLAN.md`.

## Active

- Review the shipped `gravii-user-app` pilot in a real browser, tune the motion-logo geometry and copy tone, and only then decide whether to extend the same system beyond `GRAVII ID` and `X-RAY`.
- Finish hosted QA on `gravii.io` and `gravii.io/partners` now that the landing waitlist and `/partners` route both target their live backend contracts.
- Finish the authenticated browser QA pass for `gravii-partner-app`, especially the newly live Lens flow, then do pixel/copy polish across all partner routes until they are visually identical to the current partner mockup.
- Keep polishing `gravii-user-app` against the live User API contract, especially the exact Gravii ID/X-Ray UX, panel chrome, and any wallet-provider edge cases found during browser QA.
- Replace the seeded app-local auth issuance in the admin app with the live backend contract once the admin auth surface is confirmed.
- Profile the remaining slow `gravii-partner-app` routes in an authenticated browser session and keep trimming client-render cost in `reach` and `analytics` if local testing still feels heavy after the prefetch rollback.
- Replace the temporary permissive partner plan-to-module defaults with backend-driven feature entitlements once the Partner API exposes them.
- Replace the current preview status callouts in `gravii-partner-app` with real live data wiring route-by-route once the Partner API publishes dashboard/population reads instead of `404`.

## Next

- Run production QA on `gravii.io` and `gravii.io/partners` for CTA routing, UTM passthrough, and analytics correctness.
- Run authenticated QA on `partner.gravii.io/lens` for CSV import, pool progress, rename/delete, wallet filters, pagination, and wallet drill-down against the live Partner API.
- Configure Firebase provider environments and the admin workspace domain for deployed surfaces.
- Expand Playwright auth coverage to the live partner Google flow plus refresh, failure, and role-boundary behavior.

## Later

- Expand wallet coverage beyond the first EVM flow if product requirements broaden.
- Wire feature-level user and partner screens to the shared data API clients once the backend payloads stabilize.
- Audit and remove stale generated artifacts that still mention the retired standalone partner landing app.

## Intake Rules

- Add only actionable items with clear scope.
- Move items between sections as priority changes.
- Remove or rewrite items once they are completed or no longer valid.
- If work starts now, track step-by-step execution in `PLAN.md` and log outcomes in `PROGRESS.md`.
