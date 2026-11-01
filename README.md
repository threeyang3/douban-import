# Douban Import

[English](README.en.md) · [使用指南](doc/guide.md) · [迁移说明](doc/migration.md) · [架构与后续方向](doc/architecture.md)

**Douban Import** 是由 threeyang3 独立维护的 Obsidian 插件，将豆瓣资料和个人收藏记录导入本地 Markdown。插件 ID 为 `douban-import`，独立版本从 **0.1.0** 开始。

本项目在自己的应用结构下承接 `douban-sync` 的既有功能：应用入口、命令与生命周期按职责组织，豆瓣解析、同步、模板、用户数据和平台能力分别管理。部分业务实现来自原项目，来源与 GPL 许可见 [PROVENANCE.md](PROVENANCE.md)。这是独立维护的重构项目，并非从零独立重写全部代码。

## 功能范围

| 能力 | 0.1.0 承接范围 |
| --- | --- |
| 资料搜索与导入 | 电影、电视剧、书籍、音乐、游戏、舞台剧、豆瓣日记共 7 类；电影与电视剧共用相关搜索入口并按页面识别 |
| 批量 URL 导入 | 多行地址、去重、进度、取消与单条失败隔离 |
| 个人收藏同步 | 电影、电视剧、书籍、音乐、游戏；处理全部已选类型/状态，支持日期范围、增量处理和强制替换 |
| 同步预览与结果 | 替换前展示创建/替换/跳过计划，保留失败明细与同步报告，处理同名文件冲突 |
| 登录 | 桌面网页登录入口、桌面/移动端二维码登录、Cookie 备用登录 |
| 模板与字段 | 内置、文件、自定义内容三种来源，实时预览、另存为、恢复默认；自定义 YAML 属性、输出路径与数组显示 |
| 本地笔记 | 为当前作品创建或继续笔记，关联已有笔记或其中标题 |
| 数据保护 | 备份旧笔记，按配置保留用户属性与记录/感想正文；预览用户数据差异与合并策略 |
| 数据迁移 | 配置和用户数据 JSON 导出/导入；配置导出默认排除登录凭据 |

**7 类资料解析不等于 7 类收藏同步。** 当前同步界面提供电影、电视剧、书籍、音乐、游戏，未提供舞台剧和豆瓣日记的完整收藏同步入口。“豆瓣日记”也与未来文娱库中的个人 Note 页面不同。

当前基线保留已有数据格式。独立 Work ID、Series/Work/Note/View 和多来源映射属于[后续方向](doc/architecture.md#后续方向)，尚未在 0.1.0 实现。

## 安装与构建

当前为 **0.1.0 开发基线**，不据此声称已有公开 Release 或已进入 Obsidian 官方插件目录。

使用 Node.js 22，从源码构建：

~~~bash
git clone https://github.com/threeyang3/douban-import.git
cd douban-import
npm ci
npm run build
~~~

将 `main.js`、`manifest.json` 和 `styles.css` 放入：

~~~text
你的 Vault/.obsidian/plugins/douban-import/
~~~

重启 Obsidian，在第三方插件中启用 **Douban Import**。自定义配置目录替换上述 `.obsidian`；声明最低 Obsidian 版本为 **1.4.4**，未据此声称在该历史版本实测。

发布后，也可从本仓库的 Release 下载相同的三个附件。数字版本 tag 触发的工作流生成 **Release 草稿**，草稿不等于公开可安装版本；BRAT 安装需要可访问的正式 Release。插件市场中的原 Douban 插件不会自动更新为本项目。

## 开始使用

1. 在设置中确认笔记输出目录、模板和附件目录。
2. 用命令面板搜索豆瓣相关命令，搜索条目或粘贴多个 URL 导入。
3. 需要同步自己的收藏时，先在“登录”设置中登录豆瓣，再选择内容类型、状态和日期范围。
4. 使用强制替换前，查看同步预览及数据保护设置。

详细操作和登录方式见[使用指南](doc/guide.md)。从旧插件切换时，先按[迁移说明](doc/migration.md)导出配置、停用旧插件，再导入新配置并重新登录。现有 Markdown、模板路径和个人笔记可以继续使用；新插件 ID 使快捷键需要重新绑定。

## 网络与账号

搜索、导入和同步访问豆瓣；封面下载访问条目提供的图片地址。可选图床功能访问你配置的服务。个人收藏同步需要豆瓣账号，部分页面也可能要求登录。

登录凭据保存在本地插件配置中，默认不会包含在配置导出文件里。生成的笔记、图片和个人内容保存在 Vault 内。本插件整理资料，不提供影视、音乐或图书内容资源。

## 开发与发布

- 开发构建：`npm run dev`。
- 生产构建：`npm run build`。
- 现有测试：`npm test -- --runInBand`。
- 文档构建：`npm run docs:build`。

按修改范围选择必要验证。架构说明见 [doc/architecture.md](doc/architecture.md)，协作约定见 [AGENTS.md](AGENTS.md)，发布方式见 [doc/releasing.md](doc/releasing.md)。构建或测试通过不能代替真实 Obsidian 环境及豆瓣线上行为的验证。

## 来源与许可

初始业务代码来自 [threeyang3/douban-sync](https://github.com/threeyang3/douban-sync) 的 `adv` 提交 `b6cfd80bf597b70444295e4c3d37d435d2bb40de`，源版本为 2.3.0，并含此版本之后已合并的修复。原始上游是 **Wanxp** 的 [obsidian-douban](https://github.com/Wanxp/obsidian-douban)。

本项目采用 **GPL-3.0-only**，保留 [LICENSE](LICENSE)、原作者署名及其他适用许可说明。独立仓库和新架构不会改变继承代码的来源。Obsidian 官方目录另有[派生插件政策](https://docs.obsidian.md/community-directory/developer-policies)，上架需单独满足其要求。
