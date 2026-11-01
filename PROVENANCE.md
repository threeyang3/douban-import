# Code provenance and licensing

## Baseline

| Item | Value |
| --- | --- |
| Independent project | [threeyang3/douban-import](https://github.com/threeyang3/douban-import) |
| Display name / plugin ID | Douban Import / `douban-import` |
| Independent version line | `0.1.0` |
| Direct business-code source | [threeyang3/douban-sync](https://github.com/threeyang3/douban-sync) |
| Imported source branch | `adv` |
| Imported source commit | [`b6cfd80bf597b70444295e4c3d37d435d2bb40de`](https://github.com/threeyang3/douban-sync/commit/b6cfd80bf597b70444295e4c3d37d435d2bb40de) |
| Source manifest version | `2.3.0` |
| Original upstream | [Wanxp/obsidian-douban](https://github.com/Wanxp/obsidian-douban) |

The imported `adv` snapshot includes four commits beyond the old `main` baseline, including merged fixes after the 2.3.0 release. Its commit ID, not the old release number alone, identifies the code used here.

## What is inherited and what changes

Douban parsers, login integrations, UI components, synchronization behavior, templates, data protection, platform utilities, and regression tests originate in the source project and its contributors.

Douban Import establishes its own repository and plugin identity and reorganizes this code into application, source, sync, settings, template, note, user-data, platform, shared, UI, and localization modules. Application lifecycle and service coordination are refactored separately from inherited source parsing and business behavior.

This architectural work does not make the inherited code a clean-room implementation. Original authorship and notices remain applicable. Internal Douban field names are kept where required for data compatibility.

## Licenses and acknowledgments

- The inherited root license is GNU GPL v3; package metadata specifies **GPL-3.0-only**. The project retains the full text in [LICENSE](LICENSE).
- **Wanxp** and the original obsidian-douban contributors are credited for the original plugin. The development history of **threeyang3/douban-sync** supplies the direct baseline and subsequent improvements.
- Existing source-level acknowledgments remain in place, including credits attached to reused login and UI implementations.
- `doc/LICENSE` retains the inherited MIT notice for the historical **just-the-docs** material. It is a provenance notice for that material; it does not relicense the plugin or declare that all new documentation is MIT.
- Third-party dependencies retain their own licenses.

The new documentation site is a small VitePress site. It does not copy the historical documentation site or screenshots wholesale.

## Distribution

Independent GitHub releases and entry into the official Obsidian directory are separate matters. The directory's [developer policies](https://docs.obsidian.md/community-directory/developer-policies) impose additional conditions on derivative plugins. A new repository, name, or architecture does not by itself establish approval from the original author or eligibility for directory listing.
