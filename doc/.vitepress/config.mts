import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'Douban Import',
  description: '将豆瓣资料与个人收藏记录导入 Obsidian。',
  lang: 'zh-CN',
  base: '/douban-import/',
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '使用指南', link: '/guide' },
      { text: '迁移', link: '/migration' },
      { text: 'GitHub', link: 'https://github.com/threeyang3/douban-import' },
    ],
    sidebar: [
      { text: '使用指南', link: '/guide' },
      { text: '从旧插件迁移', link: '/migration' },
      { text: '架构与后续方向', link: '/architecture' },
      { text: '构建与发布', link: '/releasing' },
    ],
    search: { provider: 'local' },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/threeyang3/douban-import' },
    ],
    footer: {
      message: 'GPL-3.0-only · 来源与署名见仓库 PROVENANCE.md',
      copyright: 'Maintained by threeyang3',
    },
  },
});
