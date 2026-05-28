# Hooks

Custom React hooks.

```tsx
import { useDeviceDetection, useStore } from '@/hooks'
```

## Available Hooks

| Hook | Purpose |
|------|---------|
| `useDeviceDetection` | Detect mobile/desktop/tablet |
| `useTransform` | Element transformations |
| `useStore` | Global Zustand store |

## useDeviceDetection

```tsx
const { isMobile, isTablet, isDesktop, isTouch } = useDeviceDetection()
```
