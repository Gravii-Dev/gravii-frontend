# Utils

Pure utility functions organized by concern.

Use explicit imports for clarity and better tree-shaking:

```tsx
import { fetchWithTimeout } from '@/utils/fetch'
import { normalizeWaitlistEmail } from '@/utils/waitlist'
```

## Modules

| Module | Functions |
|--------|-----------|
| `fetch` | `fetchWithTimeout`, `fetchJSON` |
| `rate-limit` | In-memory server-side request limiting |
| `waitlist` | Waitlist validation, referral, and cache helpers |

## Common Patterns

```tsx
// Fetch with timeout
const response = await fetchWithTimeout(url, { timeout: 5000 })
```
