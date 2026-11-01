# Douban Import development

## Scope and identity

- Repository: `threeyang3/douban-import`.
- Plugin: **Douban Import**, ID `douban-import`, independent baseline `0.1.0`.
- Business-code baseline: `threeyang3/douban-sync`, `adv` commit `b6cfd80bf597b70444295e4c3d37d435d2bb40de`.
- Preserve provenance, GPL-3.0-only, original author credit, and applicable third-party notices.
- This project has its own architecture and release identity; inherited parsing and business modules are not clean-room code.

## Working principles

1. Complete the requested feature with the smallest sufficient change. Do not expand routine work into unrelated refactoring or a general-purpose framework.
2. Preserve existing notes, template paths, user fields, settings, and import/export formats. Schema changes require a concrete migration plan; do not silently rewrite the user's vault.
3. Keep source identity such as `doubanId` compatible with existing data. Do not rename persisted keys for cosmetic consistency.
4. Handle concrete failure cases without stacking speculative fallbacks, redundant checks, or exceptions that hide the real error.
5. Use relevant existing tests and builds. Simple text changes do not need new tests; once the identified risk is resolved, stop expanding verification.
6. Keep completed functionality separate from future plans. Local Work IDs and Series/Work/Note/View are not implemented merely because the roadmap describes them.
7. Apply the user's current authorization to repository changes and releases. Do not independently contact upstream authors, submit marketplace applications, or announce releases.
8. Do not copy private architecture documents, private links, or personal vault content into this public repository.

## Responsibilities

| Directory | Responsibility |
| --- | --- |
| `src/app/` | Application lifecycle, command registration, migrations and service coordination |
| `src/sources/douban/` | Douban search, parsing, authentication and source models |
| `src/sync/` | Collection scopes, preview, execution and results |
| `src/settings/` | Configuration, settings UI and configuration import/export |
| `src/templates/` | Defaults, presets, rendering and preview |
| `src/notes/` | Creating, continuing and linking local notes |
| `src/userdata/` | Extracting, comparing, importing and preserving personal content |
| `src/platform/` | Vault access and desktop/mobile network behavior |
| `src/shared/` | Shared utilities and legacy cross-module types |
| `src/ui/` | Reusable interaction components and dialogs |
| `src/i18n/` | Runtime localization |

Prefer these responsibility boundaries when placing new code. The current refactor does not imply that every inherited dependency is already decoupled. Introduce a new abstraction only when a concrete feature needs it.

## Compatibility and releases

- Keep `package.json`, `package-lock.json`, `manifest.json` and `versions.json` consistent.
- Plugin version and persisted JSON format versions are independent. Do not reset data format versions when changing branding or plugin versions.
- A release tag must be `x.y.z`, without `v`, and match the manifest. Assets are `main.js`, `manifest.json` and `styles.css`.
- Numeric tags create a release draft. A draft is not a published or BRAT-installable release.
- Treat the plugin ID as stable once publicly released. Maintain an accurate `minAppVersion` when introducing newer APIs.
- The official directory has additional derivative-plugin requirements; see `PROVENANCE.md`.

## Commands

Use Node.js 22 and locked dependencies: `npm ci`. Production build: `npm run build`. Watch: `npm run dev`. Existing tests: `npm test -- --runInBand`. Documentation: `npm run docs:build`.

Develop in a dedicated test vault. Record what was actually checked; do not equate build success with live login, mobile behavior or a complete Obsidian workflow.

## Future model

Follow the public summary in `doc/architecture.md`. The local Work identity must remain independent from Douban/Bangumi IDs. Series/Work/Note/View, collection-driven minimal Series creation and note workflows are future work. The schema and exact Note creation timing are not frozen.
