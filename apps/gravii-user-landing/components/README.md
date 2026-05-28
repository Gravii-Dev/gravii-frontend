# Components

UI, layout, motion, and landing sections for the Gravii landing app.

## Structure

```text
components/
  effects/       Scroll and display primitives
  layout/        Site shell, header, footer, Lenis, overlays
  sections/      Public landing sections
  ui/            Small reusable primitives
```

## Current Public Page Sections

```tsx
import { Hero } from '@/components/sections/hero'
import { IntroOne } from '@/components/sections/intro-one'
import { IntroTwo } from '@/components/sections/intro-two'
import { Recognition } from '@/components/sections/recognition'
import { Bridge } from '@/components/sections/bridge'
import { Passport } from '@/components/sections/passport'
import { Inside } from '@/components/sections/inside'
import { Vision } from '@/components/sections/vision'
import { Waitlist } from '@/components/sections/waitlist'
```

## Import Rules

- Prefer direct imports from the owning folder.
- Use CSS Modules for component styling.
- Do not add Tailwind utilities to new component code.
- Keep section-specific motion inside the section or the shared `chapter-panel`/`display-moment` primitives.
