# Douban Import

[中文](README.md) · [Usage guide](doc/guide.md) · [Migration](doc/migration.md) · [Download builds](https://github.com/threeyang3/douban-import/actions/workflows/ci.yml) · [Report an issue](https://github.com/threeyang3/douban-import/issues)

**Import Douban metadata and personal collection records into Obsidian, using your own templates to create local Markdown notes.**

Douban Import supplies Douban information for your personal media library: search entries, import URLs in batches, or sync collections. Bring in covers, descriptions, creators and publication details alongside your ratings, comments and collection history. Choose where files go, customize their fields, and link your own notes.

Current version: **0.1.0**. Plugin ID: `douban-import`. Requires **Obsidian 1.4.4 or later**. Desktop and mobile are supported; the web-login window and PicGo image uploads are desktop-only.

## Features

### Metadata and personal collections

| Content type | Metadata import | Collection sync |
| --- | --- | --- |
| Films | Supported | Want to watch, watching, watched |
| Television | Supported; shares the related film search entry point and detects the type | Want to watch, watching, watched |
| Books | Supported | Want to read, reading, read |
| Music | Supported | Want to listen, listening, listened |
| Games | Supported | Want to play, playing, played |
| Theater | Dedicated parser and template | No collection-sync entry point yet |
| Douban diary entries | Supported | No collection-sync entry point yet |

- **Search:** use keywords or the current filename, then create a note or insert content into the current editor selection.
- **Batch import:** one Douban URL per line, with deduplication, type detection, progress, cancellation and individual failure details.
- **Collection sync:** process every selected type and state, with count and date ranges. Normal sync skips recognized existing entries; replacement is optional.
- **Personal records:** import ratings, comments, states, collection dates and tags when logged in and the records are available.

### Templates, fields and covers

- Select a **built-in template, a template file in your vault, or custom template content** for each content type.
- Preview templates live, edit file or custom content, copy templates, save as a file, or restore the built-in template.
- Use variables such as `{{type}}` and `{{title}}` for note folders, filenames and cover paths.
- Define custom YAML properties; export definitions as JSON and import them by merging or replacing.
- Configure array formatting and limit fields such as actors, directors, authors and aliases by content type.
- Keep remote cover URLs or download covers locally, with high-quality and overwrite options. **PicGo Server uploads are desktop-only.**

Common template variables:

| Purpose | Examples |
| --- | --- |
| Basic metadata | `{{id}}`, `{{title}}`, `{{type}}`, `{{url}}`, `{{desc}}`, `{{score}}`, `{{yearPublished}}` |
| Type-specific metadata | `{{director}}`, `{{actor}}`, `{{author}}`, `{{translator}}`, `{{isbn}}`, `{{platform}}`; availability depends on content type |
| Covers | `{{image}}` is the processed cover URL or local path; `{{imageData.url}}` is the source cover URL; `{{imageName}}` is the image filename |
| Personal records | `{{myRating}}`, `{{myRatingStar}}`, `{{myState}}`, `{{myComment}}`, `{{myTags}}`, `{{myCollectionDate}}` |
| Book comments | `{{popularComments}}`: up to five short comments visible on the book page |

The settings page lists variables available for each type. Some built-in templates contain Dataview inline expressions. Enable Dataview for those displays, or replace them with plain Markdown.

### Local notes and user data

- Create a linked note for the currently open entry; if it already exists, open it for further writing.
- Link an existing note or one of its headings through the entry's `笔记` property.
- Export local custom properties and the `## 记录` and `## 感想` body sections.
- Preview imported user data, select entries, ignore or map fields, and choose **keep local, overwrite, or smart merge** per field.

Linked notes currently identify entries through `doubanId`. Importing Douban diary entries is a separate feature.

### Sync protection and reports

Replacement sync previews planned creates, replacements and skips. It supports backups before replacement, filename collision handling and structured result reports. Requests retain timeouts, bounded retries and individual failure handling; login, verification and other unexpected pages are detected and reported.

With **“Inherit old note fields”** enabled in the sync dialog, data-protection settings preserve **local custom properties, `## 记录` and `## 感想`**. Douban and system fields are excluded from custom-property protection: fields such as `tags`, `aliases`, ratings and states may still be updated from imported data. Keep independent personal content in custom properties or linked notes.

## Installation

### Download a development build

Development builds are available; a formal Release has not yet been published.

1. Open the [CI runs](https://github.com/threeyang3/douban-import/actions/workflows/ci.yml) and select the latest successful run on the `main` branch.
2. Download and extract the **douban-import** artifact. Downloading usually requires a GitHub login; artifacts are retained for 14 days.
3. Copy `main.js`, `manifest.json` and `styles.css` into:

~~~text
Your vault/.obsidian/plugins/douban-import/
~~~

4. Restart Obsidian and enable **Douban Import** under Community plugins.

Replace `.obsidian` if you use a custom configuration directory. Future published installation packages will be available on the [Releases](https://github.com/threeyang3/douban-import/releases) page.

### Build from source

Use Node.js 22:

~~~bash
git clone https://github.com/threeyang3/douban-import.git
cd douban-import
npm ci
npm run build
~~~

Install the generated `main.js` together with the root `manifest.json` and `styles.css` in the directory above.

## Getting started

1. **Set output locations:** check note folders, filename rules, template sources and attachment paths.
2. **Import an entry:** open the command palette, search for `Douban Import`, and choose the search-and-create or batch URL import command.
3. **Sync your collection:** sign in from plugin settings, then use the book icon in the ribbon to choose types, states and ranges.
4. **Write your own notes:** open an entry and use the command to create a linked note or link an existing one.

Desktop and mobile both provide **QR-code and manual Cookie** login. Desktop also provides an embedded web-login window. See the [usage guide](doc/guide.md) for details.

### A simple template

Save this as a Markdown template in your vault, or paste it into the custom-content option and preview it in the template editor. The Chinese section headings are intentional: they identify the record and thoughts sections used by data protection.

~~~markdown
---
doubanId: {{id}}
title: {{title}}
type: {{type}}
url: {{url}}
image: {{image}}
score: {{score}}
---

# {{title}}

{{desc}}

## 记录

## 感想
~~~

### Three JSON import/export workflows

| Data | Purpose |
| --- | --- |
| Plugin settings | Transfer output paths, template choices and other settings; credentials are excluded by default |
| Custom-property definitions | Transfer which properties and values are generated for each content type |
| Local user data | Transfer custom properties and record/thoughts sections from existing entries |

Use the corresponding interface for configuration or content migration.

## Migrating from douban-sync

Douban Import uses a separate plugin ID. Its settings and shortcuts are stored separately from `obsidian-douban-plugin`.

1. Export settings from the old plugin, then disable it.
2. Enable Douban Import, import those settings and sign in to Douban again.
3. Check output, template, attachment and backup paths, then reassign shortcuts.

Existing Markdown, images, template files and explicitly configured paths remain usable; you do not need to fetch the entire library again. Avoid running both plugins against the same notes. See the [migration guide](doc/migration.md) for the full procedure and rollback.

New defaults place temporary files and reports in `.tmp/douban-import/` and backups in `.tmp/douban-import/backups/`. Explicit backup paths in imported settings continue to apply.

## Feature inheritance and validation

The functional baseline is [douban-sync/adv](https://github.com/threeyang3/douban-sync/tree/b6cfd80bf597b70444295e4c3d37d435d2bb40de), commit **`b6cfd80`**, including merged fixes after version 2.3.0. Douban Import retains the implemented user-facing features while reorganizing the application entry point, commands, search, sync, file imports and configuration management.

- All **13 original commands** and **33 original regression-test suites** are retained.
- The initial 0.1.0 code commit [`3fcb338`](https://github.com/threeyang3/douban-import/commit/3fcb338a93a39f9b4877c49ac3cd86048332f141) passed **37 suites and 207 tests**, plus production and documentation builds in [GitHub CI](https://github.com/threeyang3/douban-import/actions/runs/41274389064).
- Plugin identity, default working directories and the minimum Obsidian version declaration changed; existing note fields and JSON formats remain compatible.

These findings come from source comparison and automated checks. Real vault workflows, live Douban login and device-specific operations have not yet been individually verified.

## Development and future work

| Command | Purpose |
| --- | --- |
| `npm run dev` | Watch source changes and rebuild |
| `npm run build` | TypeScript checking and production build |
| `npm test -- --runInBand` | Run tests |
| `npm run check:manifest` | Check plugin identity and version metadata |
| `npm run docs:build` | Build the documentation site |

Pushing a numeric tag matching the version creates a Release draft; see [building and releasing](doc/releasing.md).

Future work includes independent local Work identity, Series / Work / Note / View, multiple source mappings and new note workflows. These are **not included in 0.1.0**; see [architecture and future directions](doc/architecture.md).

## Network and license

Search, import and sync contact Douban. Cover downloads contact source image URLs; optional image hosting contacts the configured service. Login credentials are stored in local plugin settings and excluded from settings exports by default.

This project is independently maintained by **threeyang3** under [GPL-3.0-only](LICENSE). Its initial code comes from `threeyang3/douban-sync`, originating from **Wanxp**'s [obsidian-douban](https://github.com/Wanxp/obsidian-douban). See [PROVENANCE.md](PROVENANCE.md) for attribution and license details.
