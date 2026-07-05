# AGENTS.md

## Cursor Cloud specific instructions

This repo is a **static portfolio website** (plain HTML/CSS/vanilla JS, no build step, no backend, no database). There are no npm runtime dependencies.

### Running the app (dev)
- Serve from the repo root so relative paths and `locales/*.json` resolve: `python3 -m http.server 8080` (aliased as `npm start` / `npm run serve` in `package.json`). Then open `http://localhost:8080`.
- The site uses `fetch()` to load `locales/en.json` / `locales/ar.json`, so it MUST be served over HTTP — opening `index.html` via `file://` breaks translations due to browser local-file restrictions. Keep the `locales/` folder intact.

### Lint / test / build
- There is no configured linter, no automated test suite, and no build step. Verification is manual: load the site and confirm sections render and the EN/AR language switcher toggles text and RTL layout (globe/"ع"/"EN" toggle in the top nav).

### Notes
- No environment variables or secrets are required.
- `netlify.toml` and `.htaccess` are deploy configs only; not needed for local dev.
