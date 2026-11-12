# UrduSpire frontend → backend handoff

## Current frontend boundary

The current browser app reads and writes a versioned local workspace under the local-storage key `urduspire_v1`. The access is isolated in `src/storage.ts`; `src/main.ts` calls `readLocalState()` during startup and `writeLocalState()` when the workspace changes.

This layer is intentionally temporary. Do not treat browser Local Storage as a source of truth for a multi-user service.

## Recommended backend integration sequence

1. **Identity and profile:** authenticate users, create a profile row, and scope all reads/writes to the authenticated user.
2. **Workspace data:** migrate `sources`, `articles`, `projects`, `notes`, `documents`, `saved`, `read`, and `researchItems` into relational tables. Preserve IDs or provide an explicit migration map.
3. **Media:** upload article images to object storage and store stable asset URLs/IDs in document content. Do not keep large Base64 images in local storage or database rows.
4. **News ingestion:** validate/allow-list RSS endpoints on the server, fetch and parse feeds in scheduled jobs, deduplicate by canonical URL, and store attribution, published time and original source URL. Do not fetch arbitrary user-supplied URLs from the browser.
5. **Publishing and moderation:** keep drafts private; implement review states and server-side authorization. Only approved/published content should be public.
6. **Search:** move to server-side search when content volume warrants it, while retaining the same visible search UI.

## API boundary proposal

Keep the frontend-facing data contract close to `src/types.ts`. Add a `WorkspaceRepository` interface with operations such as:

- `loadWorkspace(userId)`
- `saveNote(note)` / `deleteNote(id)`
- `saveResearchFolder(folder)` / `linkResearchItem(link)`
- `saveDocument(document)` / `publishDocument(id)`
- `listArticles(filters)` / `markArticleRead(id)`
- `uploadMedia(file)`

Provide `LocalWorkspaceRepository` as a temporary implementation and later replace it with `ApiWorkspaceRepository`. Avoid calling a database directly from view rendering functions.

## Security and privacy requirements for backend phase

- Enforce ownership and role rules server-side; never rely on hidden UI controls as authorization.
- Keep service-role/secret credentials out of browser bundles.
- Validate every incoming payload on the server and sanitize rich text before public rendering.
- Use private draft storage and explicit publication transitions.
- Validate and rate-limit uploads; constrain file types and sizes; store media outside local storage.
- Restrict RSS fetch destinations to prevent SSRF and block private-network addresses.
- Add audit logs for moderation, publication and account-sensitive actions.

## Design preservation rule

The supplied `src/styles.css` and app shell in `index.html` are the design source of truth. Backend work should change data adapters and event handlers, not re-create the view styling. Any unavoidable UI change should be separately reviewed against the supplied design reference at desktop and mobile widths.
