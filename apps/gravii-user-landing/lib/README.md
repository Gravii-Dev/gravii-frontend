# Lib

Non-UI code for the landing app.

## Directories

| Directory | Purpose |
| --- | --- |
| `config/` | Site URL and deployment-derived configuration |
| `dev/` | Development-only overlay tools |
| `features/` | Root-level optional runtime toggles |
| `hooks/` | Shared React hooks and Lenis state |
| `styles/` | Tokens, generated CSS config, and global CSS |
| `utils/` | Fetch, math, strings, rate limiting, waitlist helpers |
| `webgpu/` | Raw WebGPU hero renderer internals |

## Rule

UI belongs in `components/`; reusable non-UI behavior belongs here.
