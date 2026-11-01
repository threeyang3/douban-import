---
title: 构建与发布
---

# 构建与发布

当前独立版本为 **0.1.0 开发基线**。构建产物、GitHub Release 草稿、公开 Release 和官方插件目录上架是不同状态。

## 本地构建

使用 Node.js 22：

~~~bash
npm ci
npm run build
~~~

构建会执行 TypeScript 检查并生成 `main.js`。安装所需文件为 `main.js`、`manifest.json` 和 `styles.css`；许可证及来源说明保留在仓库和分发材料中。

按改动选择现有测试，使用 `npm test -- --runInBand`；文档使用 `npm run docs:build`。测试或构建结果只说明实际检查的范围，不能直接表述为已完成真实 Obsidian、移动端或豆瓣线上验证。

## 自动构建产物

CI 执行构建、测试和文档检查，并提供名为 `douban-import` 的工作流附件，包含：

- `main.js`
- `manifest.json`
- `styles.css`
- `LICENSE`
- `PROVENANCE.md`

工作流附件保留 14 天，适合查看当前构建结果；它不是长期发布渠道，也不表示已公开发布新版插件。

## Release 草稿

版本号应在 `package.json`、`package-lock.json`、`manifest.json` 和 `versions.json` 保持一致。推送与 manifest 版本相同的数字 tag（例如 `0.1.0`，不加 `v`），会触发发布工作流，构建并创建带插件附件的 **Release 草稿**。

检查对应源码、说明和附件后，按本次发布授权将草稿公开。普通用户和 BRAT 不能把私有草稿当作正式下载版本。正式发布后不再随意更改插件 ID。

## 官方插件目录

本项目继承 GPL 代码，保留原作者和来源说明。官方目录对派生插件还有[开发者政策](https://docs.obsidian.md/community-directory/developer-policies)，不能因为仓库、名称或架构改变就宣布已满足上架条件。

当前文档不声明已提交目录、获原作者上架许可或通过审核。
