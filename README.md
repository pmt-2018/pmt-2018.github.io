# pmt2018.github.io

个人学术主页与学习资料库，使用 Astro 构建并部署到 GitHub Pages。

## 本地开发

需要 Node.js 20.3 或更高版本；建议使用当前 Astro 支持的 Node 20.19+ 或 Node 22 LTS。

```bash
npm install
npm run dev
```

开发服务器默认运行在 `http://localhost:4321`。构建生产版本并预览：

```bash
npm run build
npm run preview
```

`npm run dev` 会启动可热更新的本地开发服务器，适合边修改边查看页面。

## 内容目录

- `src/content/teaching/`：按课程和学期组织的教学材料
- `src/content/algorithms/`：按主题组织的算法笔记
- `src/content/notes/`：其他长期笔记

普通文章使用 Markdown；需要嵌入组件时再使用 MDX。文章的 frontmatter 由 `src/content.config.ts` 校验。

OJ 内容可以使用 `published: false` 和 `releaseDate` 延迟公开。未满足发布条件的内容不会进入静态构建。

## 部署

推送到 `master` 后，GitHub Actions 会运行 Astro 构建并发布到 GitHub Pages。仓库设置中的 Pages 来源需要选择 **GitHub Actions**。
