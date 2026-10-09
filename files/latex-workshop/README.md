# LaTeX Workshop 基本配置

理论课需要编辑 `.tex` 文件时，安装 `James-Yu.latex-workshop`。本目录只提供编辑器配置，不含 TeX 发行版或课程模板，也不讲 LaTeX 语法。

这个配置使用 `latexmk` 调用 XeLaTeX。前提是你已经按照理论课安排安装了带有 `latexmk` 和 `xelatex` 的 TeX 发行版；在终端中用 `latexmk --version`、`xelatex --version` 检查。使用 MiKTeX 时，`latexmk` 还依赖 Perl，参见插件官方安装说明。

## 使用

1. 用 VS Code 打开理论作业所在的文件夹。
2. 把本目录的 `.vscode/settings.json` 放入该文件夹；若已有设置，只合并 `latex-workshop.*` 字段，不直接覆盖原文件。
3. 打开课程提供的 `.tex` 文件，在命令面板中执行 **LaTeX Workshop: Build LaTeX project**，随后执行 **LaTeX Workshop: View LaTeX PDF file**。
4. 这个配置关闭自动编译，在编辑器标签页中预览 PDF。若课程模板要求其他引擎或已有 recipe，优先使用模板自己的配置。

配置字段已对照 [LaTeX Workshop 官方编译说明](https://github.com/James-Yu/LaTeX-Workshop/wiki/Compile)。已在 Linux 上用配套命令编译最小文档并生成 PDF，尚未验证理论课模板和 Windows 插件操作。
