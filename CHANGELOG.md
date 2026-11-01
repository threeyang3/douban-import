# Changelog

## 0.1.0 — Unreleased

### Independent project

- Establish the Douban Import name, `douban-import` plugin ID and independent repository.
- Import the `douban-sync/adv` business-code baseline at `b6cfd80bf597b70444295e4c3d37d435d2bb40de`, version 2.3.0 with subsequent merged fixes.
- Organize code by application, source, sync, configuration, templates, notes, user data, platform, shared utilities, UI and localization.
- Refactor application lifecycle, command registration and service coordination while retaining existing parsing and data-handling behavior.
- Preserve GPL licensing and upstream attribution.

### Retained functionality

- Seven metadata types, multi-URL import and five collection-sync types.
- Complete selected sync scopes, preview, date ranges, incremental processing and replacement.
- Desktop web-login entry point, desktop/mobile QR login and Cookie fallback.
- Built-in, file and inline templates; previews, custom fields and output paths.
- Local notes, settings and user-data import/export, backups, collision handling and sync reports.

### Compatibility

- Existing Markdown, settings and JSON format versions remain compatible.
- New plugin identity separates settings and command shortcuts from `obsidian-douban-plugin`.
- New default working paths use `douban-import`; imported explicit user paths remain respected.
- Local Work IDs, Series/Work/Note/View and automatic minimal Series creation are planned separately and are not included.

This entry records a development baseline, not a published release or a claim of live Douban/Obsidian verification. Historical changes and authorship remain available in the source repository identified in `PROVENANCE.md`.
