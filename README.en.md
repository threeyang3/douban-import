# Douban Import

[中文](README.md)

Douban Import is an independently maintained Obsidian plugin by **threeyang3** for importing Douban metadata and personal collection records into local Markdown. Its plugin ID is `douban-import` and its independent version line starts at **0.1.0**.

The project reorganizes application lifecycle, commands, source handling, sync, settings, templates, user data, and platform integration around their responsibilities. Existing Douban parsing and business logic are retained. This is a separately maintained refactoring project, not a claim that every line was written from scratch; see [PROVENANCE.md](PROVENANCE.md).

## Feature scope

| Area | Retained functionality |
| --- | --- |
| Search and metadata import | Films, television, books, music, games, theater, and Douban diary entries |
| Batch import | Multiple URLs, deduplication, progress, cancellation, and individual failure handling |
| Collection sync | Films, television, books, music, and games; all selected types/states, date ranges, incremental handling, and replacement |
| Preview and reporting | Planned create/replace/skip actions, failure details, reports, and filename collision handling |
| Login | Desktop web login entry point, desktop/mobile QR login, and Cookie fallback |
| Templates and fields | Built-in, file, and inline templates; live previews, save-as, reset, custom YAML fields, paths, and array formatting |
| Personal notes and data | Create/continue or link local notes, export/import user data, compare and merge changes |
| Protection and migration | Note backups, configurable preservation of custom fields and note sections, settings export/import with credentials excluded by default |

Seven supported metadata types do **not** imply seven collection-sync types. The current sync interface supports films, television, books, music, and games. Douban diary entries are also distinct from the future local Note model.

Independent local Work IDs, Series/Work/Note/View pages, and multiple external sources are future work, not features of this baseline.

## Build and install

This is the **0.1.0 development baseline**. It does not imply that a public release exists or that the plugin is listed in the official community directory.

Use Node.js 22:

~~~bash
git clone https://github.com/threeyang3/douban-import.git
cd douban-import
npm ci
npm run build
~~~

Copy `main.js`, `manifest.json`, and `styles.css` into:

~~~text
Your vault/.obsidian/plugins/douban-import/
~~~

Restart Obsidian and enable **Douban Import**. Replace `.obsidian` if you use a custom configuration directory. The declared minimum Obsidian version is **1.4.4**; this is not a claim of live testing on that historical release.

Once a release is published, the same files can be downloaded from its assets. Numeric version tags create a **draft release**; publication is a separate step. BRAT requires an accessible published release.

## Migration

Export settings from the old plugin, disable it, enable Douban Import, and import the settings. Credentials are excluded from exports by default, so sign in again. Existing notes and template paths remain usable. Reassign shortcuts because command IDs now use a different plugin prefix. Avoid running both plugins against the same notes.

See the [migration guide](doc/migration.md) and [usage guide](doc/guide.md).

## Network and account use

Search, import, and sync contact Douban. Cover downloads contact image URLs supplied by entries. Optional image hosting contacts the service you configure. Personal collection sync requires an account, and some pages may also require login.

Login credentials are stored in local plugin settings and excluded from settings exports by default. Notes and downloaded images remain in your vault. The plugin imports information about media, not media content.

## Development

Use `npm run dev` for watch builds, `npm run build` for production, `npm test -- --runInBand` for existing tests, and `npm run docs:build` for documentation. Choose validation relevant to the change. Build and unit-test results do not establish live Obsidian or Douban verification.

## Attribution and license

The business-code baseline is [threeyang3/douban-sync](https://github.com/threeyang3/douban-sync) at `adv` commit `b6cfd80bf597b70444295e4c3d37d435d2bb40de`, version 2.3.0 plus subsequent merged fixes. Its original upstream is **Wanxp**'s [obsidian-douban](https://github.com/Wanxp/obsidian-douban).

This project uses **GPL-3.0-only**; see [LICENSE](LICENSE) and [PROVENANCE.md](PROVENANCE.md). Original attribution and applicable notices are retained. The official Obsidian directory has separate [policies for derivative plugins](https://docs.obsidian.md/community-directory/developer-policies).
