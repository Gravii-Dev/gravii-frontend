# Lib

Non-UI code for the landing app.

## Directories

| Directory | Purpose |
| --- | --- |
| `config/` | Site URL and deployment-derived configuration |
| `hooks/` | App-local client state used by Lenis and layout runtime |
| `styles/` | Tokens, generated CSS config, and global CSS |
| `utils/` | Fetch, rate limiting, and waitlist helpers |
| `webgpu/` | Raw WebGPU hero renderer internals |

## Rule

UI belongs in `components/`; reusable non-UI behavior belongs here.
