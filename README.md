# Douban Import

[English](README.en.md) · [使用指南](doc/guide.md) · [从旧插件迁移](doc/migration.md) · [构建下载](https://github.com/threeyang3/douban-import/actions/workflows/ci.yml) · [反馈问题](https://github.com/threeyang3/douban-import/issues)

**将豆瓣作品资料和个人收藏记录导入 Obsidian，按自己的模板保存为本地 Markdown 笔记。**

Douban Import 为个人文娱资料库提供豆瓣信息来源：搜索条目、批量导入链接、同步收藏，获取封面、简介、作者、年份等资料，以及自己的评分、短评和标记记录。你可以控制文件位置、模板和字段，并在本地继续记录感想、关联笔记。

当前版本为 **0.1.0**，插件 ID 为 `douban-import`，要求 **Obsidian 1.4.4 或更高版本**。支持桌面端和移动端，桌面端另提供网页登录窗口和 PicGo 图床上传。

## 功能

### 资料导入与个人收藏

| 内容类型 | 条目资料导入 | 个人收藏同步 |
| --- | --- | --- |
| 电影 | 支持 | 想看、在看、看过 |
| 电视剧 | 支持，与电影共用相关搜索入口并自动识别类型 | 想看、在看、看过 |
| 书籍 | 支持 | 想读、在读、读过 |
| 音乐 | 支持 | 想听、在听、听过 |
| 游戏 | 支持 | 想玩、在玩、玩过 |
| 舞台剧 | 支持独立解析与模板 | 暂无收藏同步入口 |
| 豆瓣日记 | 支持 | 暂无收藏同步入口 |

- **搜索导入**：输入关键词或按当前文件名搜索，创建新笔记，或将内容写入当前编辑器选区。
- **批量导入**：每行一个豆瓣 URL，支持去重、类型识别、进度显示、取消和逐条失败明细。
- **收藏同步**：处理全部已选内容类型与状态，支持数量和日期范围，普通同步跳过已识别的现有条目，也可选择强制替换。
- **个人记录**：在登录且相应记录可获取时，导入个人评分、短评、状态、标记日期和标签。

### 模板、字段与封面

- 为不同内容类型分别选择**内置模板、Vault 中的模板文件、自定义模板内容**。
- 实时预览模板，编辑文件或自定义内容，复制模板、另存为文件、恢复内置模板。
- 用 `{{type}}`、`{{title}}` 等变量设置笔记目录、文件名、封面目录和封面文件名。
- 自定义 YAML 属性；属性定义可以导出 JSON，再以合并或覆盖方式导入。
- 调整数组的显示格式，并按内容类型限制演员、导演、作者、别名等字段的输出长度。
- 保留远程封面地址或下载封面到本地；支持高质量封面与覆盖选项。**PicGo Server 图床上传仅限桌面端**。

常用模板变量：

| 用途 | 示例变量 |
| --- | --- |
| 基础资料 | `{{id}}`、`{{title}}`、`{{type}}`、`{{url}}`、`{{desc}}`、`{{score}}`、`{{yearPublished}}` |
| 分类资料 | `{{director}}`、`{{actor}}`、`{{author}}`、`{{translator}}`、`{{isbn}}`、`{{platform}}`；按内容类型提供 |
| 封面 | `{{image}}` 为处理后的封面地址或本地路径；`{{imageData.url}}` 为来源封面 URL；`{{imageName}}` 为图片文件名 |
| 个人记录 | `{{myRating}}`、`{{myRatingStar}}`、`{{myState}}`、`{{myComment}}`、`{{myTags}}`、`{{myCollectionDate}}` |
| 图书短评 | `{{popularComments}}`：图书页面可见短评，最多 5 条 |

设置页的模板变量说明提供各类型可用字段。部分内置模板包含 Dataview 行内表达式；使用对应展示效果需启用 Dataview，也可自行改成普通 Markdown 模板。

### 本地笔记与用户数据

- 为当前打开的条目创建关联笔记；笔记已存在时直接打开，方便继续记录。
- 关联已有笔记或其中的标题，将链接写入条目的 `笔记` 属性。
- 导出本地条目的自定义属性以及正文中的 `## 记录`、`## 感想` 分区。
- 导入用户数据时预览条目和字段差异，选择条目、忽略字段或映射字段名，并逐字段选择**保持本地、覆盖或智能合并**。

当前关联笔记功能通过条目中的 `doubanId` 识别作品。豆瓣日记导入与上述本地笔记是两项独立功能。

### 同步保护与结果记录

强制替换前会显示创建、替换、跳过等计划，并支持替换前备份、同名条目冲突处理和结构化结果报告。请求层保留超时、有限重试和单条失败隔离；登录页、验证页等异常内容会被识别并报告。

在同步界面启用“继承旧笔记字段”后，按数据保护设置保留**本地自定义属性、`## 记录`、`## 感想`**。豆瓣和系统字段不属于这项自定义属性保护范围，例如 `tags`、`aliases`、评分和状态仍可能由导入结果更新。需要长期保留的独立个人内容，适合放在自定义属性或关联笔记中。

## 安装

### 下载开发构建

当前提供开发构建，尚未发布正式 Release。

1. 打开 [CI 构建列表](https://github.com/threeyang3/douban-import/actions/workflows/ci.yml)，选择 `main` 分支最近一次成功运行。
2. 在 **Artifacts** 中下载 `douban-import` 并解压。下载通常需要登录 GitHub；构建附件保留 14 天。
3. 将 `main.js`、`manifest.json`、`styles.css` 放入 Vault 的插件目录：

```text
你的 Vault/.obsidian/plugins/douban-import/
```

4. 重启 Obsidian，在“第三方插件”中启用 **Douban Import**。

使用自定义配置目录时，以该目录替换 `.obsidian`。以后公开发布的安装包会出现在本仓库的 [Releases](https://github.com/threeyang3/douban-import/releases) 页面。

### 从源码构建

开发环境使用 Node.js 22：

```bash
git clone https://github.com/threeyang3/douban-import.git
cd douban-import
npm ci
npm run build
```

将生成的 `main.js` 与根目录的 `manifest.json`、`styles.css` 按上述路径安装。

## 开始使用

1. **设置保存位置**：确认笔记输出目录、文件名规则、模板来源和附件目录。
2. **导入一个条目**：打开命令面板，搜索 `Douban Import`，选择“搜索并创建文档”或“按豆瓣 URL 批量导入”。
3. **同步个人收藏**：在插件设置中登录豆瓣，点击侧栏书本图标进入同步界面，选择类型、状态和范围。
4. **记录自己的内容**：打开条目笔记，执行“为当前条目创建关联笔记”或“为当前条目添加现有笔记”。

桌面和移动端都提供**二维码、手工 Cookie** 登录入口；桌面端另有内置网页登录窗口。详细操作见[使用指南](doc/guide.md)。

### 一个简单模板

可将下面的内容保存为 Vault 中的 Markdown 模板文件，或粘贴到“自定义内容”中，再用模板编辑器预览。

```markdown
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
```

### 三类 JSON 导入导出

| 内容 | 作用 |
| --- | --- |
| 插件配置 | 迁移输出路径、模板选择和其他设置；默认排除登录凭据 |
| 自定义属性定义 | 迁移“哪些类型生成哪些属性、属性值是什么”的配置 |
| 本地用户数据 | 迁移已有条目中的本地自定义属性和记录/感想正文 |

三者分别用于设置迁移和内容迁移，选择对应界面的入口操作。

## 从 douban-sync 迁移

Douban Import 使用独立插件 ID，设置和快捷键与旧 `obsidian-douban-plugin` 分开保存。

1. 在旧插件中导出配置，然后停用旧插件。
2. 启用 Douban Import，导入刚导出的配置并重新登录豆瓣。
3. 核对输出目录、模板、附件和备份路径，重新绑定常用快捷键。

已有 Markdown、图片、模板文件及明确配置的路径可以继续使用，无需重新抓取整个资料库。避免同时运行两个插件对同一批笔记进行同步。完整步骤和回退方法见[迁移说明](doc/migration.md)。

新版本默认将临时文件和同步报告写入 `.tmp/douban-import/`，备份写入 `.tmp/douban-import/backups/`；导入配置中明确指定的备份路径继续生效。

## 功能继承与验证

当前功能基线是 [douban-sync/adv](https://github.com/threeyang3/douban-sync/tree/b6cfd80bf597b70444295e4c3d37d435d2bb40de)，提交 **`b6cfd80`**，包括 2.3.0 之后已合并的修复。Douban Import 完整承接该基线已实现的用户功能，重组了应用入口、命令、搜索、同步、文件导入和配置管理。

- 原有 **13 个命令**和 **33 组回归测试**全部保留。
- `0.1.0` 初始代码提交 [`3fcb338`](https://github.com/threeyang3/douban-import/commit/3fcb338a93a39f9b4877c49ac3cd86048332f141) 已通过 **37 组、207 个测试**，生产构建和文档构建也通过了 [GitHub CI](https://github.com/threeyang3/douban-import/actions/runs/41274389064)。
- 插件身份、默认工作目录和最低 Obsidian 版本声明有所调整，既有笔记字段和 JSON 数据格式继续兼容。

上述结论来自源码对照及自动化验证；真实 Vault、豆瓣线上登录和各设备操作尚未完成逐项实测。

## 开发与后续方向

| 命令 | 用途 |
| --- | --- |
| `npm run dev` | 监听源码变化并构建 |
| `npm run build` | TypeScript 检查与生产构建 |
| `npm test -- --runInBand` | 运行测试 |
| `npm run check:manifest` | 检查插件身份与版本信息 |
| `npm run docs:build` | 构建文档站点 |

发布流程会在推送匹配版本号的数字标签后生成 Release 草稿，见[构建与发布](doc/releasing.md)。

后续将围绕本地 Work 独立身份、Series / Work / Note / View、多来源映射和新的随记流程继续演进。这些能力尚未包含在 0.1.0 中，具体设计见[架构与后续方向](doc/architecture.md)。

## 网络与许可

搜索、导入和同步访问豆瓣；封面下载访问来源图片地址；可选图床功能访问你配置的服务。登录凭据保存在本地插件配置中，配置导出默认不包含这些凭据。

本项目由 **threeyang3** 独立维护，采用 [GPL-3.0-only](LICENSE)。初始代码继承自 `threeyang3/douban-sync`，原始上游为 **Wanxp** 的 [obsidian-douban](https://github.com/Wanxp/obsidian-douban)。详细来源、署名与许可记录见 [PROVENANCE.md](PROVENANCE.md)。
