# @gravii/brand-logo-3d

Shared React Three Fiber implementation of the Gravii 3D logo mark.

This package owns the procedural geometry, material texture, idle breathing,
and ring/smile spin behavior used by Gravii web surfaces. Apps still own layout
sizing and placement through their local CSS Modules.

## Exports

- `GraviiLogo3D`: client component for rendering the interactive logo scene.

## Responsibilities

- Keep the ring and lower-smile geometry consistent across apps.
- Keep hover and click spin behavior in one implementation.
- Respect `prefers-reduced-motion`.
- Avoid app-specific spacing, navigation, or shell behavior.
