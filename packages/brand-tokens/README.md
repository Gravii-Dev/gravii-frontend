# Brand Tokens

Shared Gravii visual tokens for frontend apps.

This package intentionally starts with the stable design-system foundation:

- CSS custom properties for canvas, surface, ink, accent, radius, shadow, and motion tokens
- TypeScript exports for consumers that need token values in code
- no React components yet, so app-specific layouts can keep evolving without forcing a premature shared component API

Apps should import the CSS once in their root layout before app-local global CSS:

```ts
import "@gravii/brand-tokens/css";
```

Promote components into this package only after at least two apps need the same API and interaction behavior.
