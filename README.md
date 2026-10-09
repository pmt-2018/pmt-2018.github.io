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

## C++ 浏览器运行试验（试验分支）

页面地址：`http://localhost:4321/experiments/cpp/`。

本分支使用固定版本 `@live-codes/clang-wasm@0.3.0`，通过站点自己的
`src/components/playground/CppPlayground.astro` 组件提供可编辑示例、stdin、运行、停止、重置、
编译诊断、stdout 和 stderr。MDX 中可以这样使用：

```mdx
import CppPlayground from '../../../components/playground/CppPlayground.astro';

import example from './example.cpp?raw';

<CppPlayground source={example} sourceName="example.cpp" stdin="" />
```

import 路径按文章位置调整。普通 C++ 代码块继续使用 Markdown 围栏。

- `npm run dev` / `npm run build` 会自动从 npm 包复制工具链和许可文件到 `public/cpp-runtime/`。
  该目录属于生成资源，不提交到 Git；构建产物包含它，兼容静态部署，不需要编译后端或运行时 CDN。
- 页面初始化不创建 Worker、不下载编译器；第一次点击运行后加载约 28 MB 压缩资源。
  GNU C++17 编译与执行发生在经典 Web Worker 中，后续运行复用它。
- 加载限时 90 秒，编译和运行合计限时 30 秒。停止和超时会终止 Worker，下次运行重新初始化。
  重置恢复源代码和 stdin；运行期间重置也会停止 Worker。
- stdin 一次性提供，读完后为 EOF；在 MDX 中请使用模板字符串里的真实换行，避免把 `\\n` 写成字面量反斜杠和字母 n：
  `stdin={\`5\n5 1 4 3 9\n\`}`。输出缓冲到结束后显示。成功编译时的警告不由该 API 返回。
- 默认是 Shiki 高亮的阅读态，可直接运行原始示例；点击“编辑”后按需加载 CodeMirror 6 和 C++ 语言支持。
  编辑器提供行号、语法高亮、四空格缩进、括号匹配/自动闭合、撤销重做和查找。
  Tab 缩进，Shift+Tab 取消缩进，Esc 后按 Tab 离开编辑器，Ctrl/Cmd+F 查找。
  返回阅读态时保留修改后的代码；重置会恢复源代码、stdin 并清空编辑器撤销历史。
  编辑器加载失败时保留普通文本框，不影响运行。
- 代码位于面板上方，下方是 stdin 和结果；窄屏自动上下排列。
  编译失败时展开诊断，stderr 仅在有内容时显示，运行环境错误单独展示。
  首次加载显示进度，运行详情收纳耗时等信息。
- 编辑器依赖由构建打包为站点静态资源，不依赖运行时 CDN。编辑器与编译器分别按需加载。
- 推荐把示例放在文章旁边的 `.cpp` 文件中，在 MDX 里用 `import example from './example.cpp?raw'` 引用，
  再传给 `source`。`code` 仍可用于很短的内联示例。
- 无 JavaScript 时保留 Shiki 高亮代码；不支持 WebAssembly/Worker 或加载失败时仍可阅读、复制代码。
- 此工具链不支持 C++ 异常。浏览器 WASM/WASI 与本地 Linux/GCC 并不等价。
  编译器可能占用数百 MB 内存，本试验没有硬性内存或输出配额，适合小型教学示例。

本试验页面没有加入首页导航。部署工作流仍仅自动响应 `master` 推送；不要手动从试验分支触发
正式 Pages 部署。如需放弃试验，确保本分支的变更已提交，再切回 `master` 即可。

实现依据：[工具链官方文档](https://github.com/live-codes/clang-wasm/tree/main/packages/clang-wasm)。

本分支已验证 `npm run check`、静态构建，以及 Chrome 中开发/生产预览的真实 C++ 编译运行。
浏览器检查覆盖 stdin、stdout/stderr、退出码、编译错误、EOF、Worker 复用、手动停止、
30 秒自动超时和恢复、资源 404、无 WebAssembly、无 JavaScript 和手机宽度布局。

## 内容目录

- `src/content/teaching/`：按课程和学期组织的教学材料
- `src/content/notes/`：统一的长期笔记，包含算法、编程、工具与其他参考资料；首页和侧栏按 `category` 分组

当前课程学期为 2026 秋，课程入口为 `/teaching/nju-ps/2026-fall/`，讲义放在
`src/content/teaching/nju-ps/2026-fall/`。之前的 2026 春占位材料已删除。
第 0 课的定稿大纲位于 `docs/teaching/getting-started-outline.md`，作为正式写作依据，不进入站点构建。
正文为 `src/content/teaching/nju-ps/2026-fall/lectures/getting-started.md`。
配套配置放在 `public/files/cpp-starter/` 和 `public/files/latex-workshop/`；修改这些目录后，
执行 `python3 scripts/package-teaching-examples.py` 更新下载 ZIP。

算法内容已合并到笔记，例如 `src/content/notes/graph/example.md` 对应 `/notes/graph/example/`。
旧的 `/algorithms/` 和已迁移文章地址通过 `astro.config.mjs` 的静态跳转保留兼容。
以后统一在 `notes` 集合中新增内容；不需要再维护独立的算法栏目。

导航、内容入口和 playground 操作按钮使用 `src/components/Icon.astro` 中的 Lucide 线条图标。
图标在构建时生成静态 SVG，沿用文字颜色，保留文字标签并对辅助技术隐藏装饰图标。

普通文章使用 Markdown；需要嵌入组件时再使用 MDX。文章的 frontmatter 由 `src/content.config.ts` 校验。

OJ 内容可以使用 `published: false` 和 `releaseDate` 延迟公开。未满足发布条件的内容不会进入静态构建。

## 部署

推送到 `master` 后，GitHub Actions 会运行 Astro 构建并发布到 GitHub Pages。仓库设置中的 Pages 来源需要选择 **GitHub Actions**。
