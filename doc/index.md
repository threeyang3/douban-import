---
layout: home
hero:
  name: Douban Import
  text: 将豆瓣资料与个人记录带入 Obsidian
  tagline: 独立维护的插件与应用结构，承接现有功能，保留本地数据兼容性。
  actions:
    - theme: brand
      text: 使用指南
      link: /guide
    - theme: alt
      text: 从旧插件迁移
      link: /migration
features:
  - title: 资料导入
    details: 搜索电影、电视剧、书籍、音乐、游戏、舞台剧和豆瓣日记，支持批量 URL 导入。
    link: /guide
  - title: 收藏与个人内容
    details: 同步支持的个人收藏，预览替换、保留用户字段和正文，并管理本地作品笔记。
    link: /guide
  - title: 独立演进
    details: 应用、来源、同步、模板和本地数据分开组织，后续逐步接入新的文娱数据库约定。
    link: /architecture
---

## 当前状态

当前为 **0.1.0 开发基线**，插件 ID 是 `douban-import`，声明最低 Obsidian 版本为 **1.4.4**。这一兼容版本声明不代表已在该历史版本上进行过实机验证。

当前保留旧数据格式；本地 Work ID 和 Series/Work/Note/View 尚未实现。源码与发布状态见 [GitHub 仓库](https://github.com/threeyang3/douban-import)，构建、草稿和公开发布的区别见[发布说明](./releasing.md)。
