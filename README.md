# UrduSpire — Frontend

**Read · Research · Write · Publish**

This is the production-oriented frontend project built from the supplied UrduSpire design. The original layout, typography, spacing, color tokens, responsive CSS and screen markup have been retained. The frontend is deliberately backend-free so the API/authentication/storage layer can be connected in a later phase.

## Technology choice

- **Vite 8** — development server and optimized production bundling.
- **TypeScript 7** — typed workspace models, safer application code and separate type checking.
- **Semantic HTML + the supplied custom CSS** — preserved instead of rewriting the visual system in Tailwind or introducing a component framework that could shift the design.
- **Browser Local Storage** — temporary local workspace persistence until the backend is connected.

The current application is DOM-driven; keeping that interaction model avoids a risky visual rewrite. Vite supports TypeScript and optimized production builds; its build and type-check steps are intentionally separate.

## Requirements

- Node.js 20.19+ or 22.12+
- npm 10+

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`).

## Type-check and production build

```bash
npm run typecheck
npm run build
npm run preview
```

The production output is written to `dist/`. Deploy the contents of `dist/` to a static host such as Cloudflare Pages, Netlify, Vercel static hosting, or any Nginx/Apache web root. The configured relative asset paths support deployment under a sub-path. A pre-generated static `dist/` is included as a convenience. The build pipeline is configured for Vite; run the commands above after installing dependencies to regenerate the optimized Vite bundle.

## Included workspace features

- Dashboard, News, Published, My Research, My Notes, Writing Studio, Saved, News Sources, Author Profile, and Settings & Backup.
- Full-screen article/publication reader.
- Urdu RTL writing controls, rich-text formatting, and inline JPG/PNG/WebP image attachment with editable caption.
- Draft saving, local publishing, search, research folders, notes and saved articles.
- Light/dark appearance, JSON backup export/import and cross-tab local-storage refresh.
- Responsive sidebar and mobile navigation inherited from the original design.

## Important current limits

This is a **frontend release**, not a live multi-user service. No authentication, server database, live RSS fetch, moderation workflow, cross-device sync, or public server-side publication is connected. The sample headlines are demo content. User data is stored in the current browser profile; export a backup before clearing browser data or moving to another device. Large embedded images can use browser storage quota.

## Project layout

```text
index.html                     Original app shell / entry point
src/
  main.ts                      App interactions and view rendering
  styles.css                   Original supplied stylesheet
  storage.ts                   Local persistence adapter
  types.ts                     Shared TypeScript data models
public/
  favicon.svg
  manifest.webmanifest
vite.config.ts
tsconfig.json
docs/
  FRONTEND-BACKEND-HANDOFF.md
  QA-REPORT.md
 dist/                          Ready-to-serve static frontend
```

## Backend handoff

See [`docs/FRONTEND-BACKEND-HANDOFF.md`](docs/FRONTEND-BACKEND-HANDOFF.md) before replacing the local storage adapter. Keep the visible UI contracts stable while moving persistence, authentication and RSS to server APIs.
