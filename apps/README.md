# App Naming

The `apps/` folder uses persona-based internal naming.

- `gravii-backoffice`: internal admin and operations product
- `gravii-user-landing`: public Gravii landing site
- `gravii-user-app`: end-user app
- `gravii-partner-app`: partner-facing app

Naming rule:

- use `gravii-<persona>-app` for persona-owned product surfaces when there is also a landing surface
- use route ownership inside the active landing app when the persona does not need a separate deployable marketing surface
- reserve `gravii-backoffice` for the single internal operations surface
- avoid version suffixes such as `-v1`
- avoid mixed labels such as `admin`, `lp`, or `launch-app` in internal app IDs once a persona label exists

Current routing note:

- the partner marketing and acquisition route now lives inside `gravii-user-landing` at `/partners`
