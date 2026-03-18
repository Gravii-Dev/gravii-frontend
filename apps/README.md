# App Naming

The `apps/` folder uses persona-based internal naming.

- `gravii-backoffice`: internal admin and operations product
- `gravii-user-landing`: public Gravii landing site
- `gravii-user-app`: end-user app
- `gravii-partner-app`: partner-facing app
- `gravii-partner-landing`: partner-facing landing site

Naming rule:

- use `gravii-<persona>-app` for persona-owned product surfaces when there is also a landing surface
- use `gravii-<persona>-landing` for marketing surfaces that belong to a specific persona
- reserve `gravii-backoffice` for the single internal operations surface
- avoid version suffixes such as `-v1`
- avoid mixed labels such as `admin`, `lp`, or `launch-app` in internal app IDs once a persona label exists
