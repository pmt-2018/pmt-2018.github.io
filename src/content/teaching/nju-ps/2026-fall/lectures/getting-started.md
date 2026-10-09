---
title: "第 0 课：配置 C++ 环境并完成第一次 OJ 提交"
description: "安装编译器，运行两数相加程序，学习 OJ 提交、查资料和求助。"
course: "nju-problem-solving"
semester: "2026-fall"
week: 1
category: "lecture"
tags: [cpp, setup, oj, debugging]
published: true
---

这一课用一个“两数相加”程序，带你走完**写代码 → 编译 → 运行 → 测试 → 提交**的过程。

第一次接触编程，按顺序操作。安装部分只看自己的系统；Windows 初学者可以选 WinLibs 主线，跳过另外两条路线。已有环境的同学从[环境验证](#环境验证)开始。

本地统一使用 **C++20**。提交到 OJ 时，按课程要求选择语言和标准。

## 1. 准备一个练习文件夹

在容易找到的位置新建 `cpp-practice` 文件夹。源码和编译生成的程序都放在这里。

Windows 用户在文件资源管理器的“查看”菜单中开启**文件扩展名**。扩展名是文件名末尾的部分，如 `.cpp`。开启后，能看出文件是否误存成了 `main.cpp.txt`。

## 2. 配置 C++ 环境

**编辑器**用来写代码，**编译器**把代码变成可以运行的程序。本教程使用 VS Code 编辑器。安装 C/C++ 扩展后，仍需另外安装编译器。

### Windows：VS Code 与 WinLibs（主线）

1. 从 [VS Code 官网](https://code.visualstudio.com/)下载并安装 VS Code。
2. 打开 [WinLibs 下载页](https://winlibs.com/)，在 **Release versions → UCRT runtime** 下选择：
   - **Win64**；
   - **POSIX threads**；
   - **without LLVM/Clang/LLD/LLDB**；
   - **Zip archive**。

   选稳定版，不选 Win32 或 snapshot（快照版）。这套配置适用于 x86-64 Windows 10/11；ARM 电脑需另查对应的安装方式。
3. 解压到 `C:\mingw64`，确认能找到 `C:\mingw64\bin\g++.exe` 和 `gdb.exe`。注意不要多套一层 `mingw64` 文件夹。
4. Windows 搜索“编辑账户的环境变量”，打开“环境变量”。在**用户变量 → Path** 中新建一项 `C:\mingw64\bin`，保存，保留原有条目。

   **PATH** 是系统查找命令的目录列表。加上这个目录后，终端才能直接找到 `g++`。
5. 重新打开 VS Code。在“终端”面板的“+”旁下拉菜单中选择 **Command Prompt / 命令提示符**，执行：

   ```bat
   g++ --version
   gdb --version
   ```

   看到版本信息就表示工具可以找到。若提示找不到命令，检查 `bin` 路径，并重新打开 VS Code。

### Windows：MSYS2（补充路线）

已安装 WinLibs 的同学可以跳过。MSYS2 可以通过软件包管理器安装和更新编译器；本教程使用其中的 **UCRT64** 环境。

1. 从 [MSYS2 官网](https://www.msys2.org/)下载安装，使用默认目录 `C:\msys64`。
2. 从开始菜单打开 **MSYS2 UCRT64**，执行：

   ```bash
   pacman -Syu
   ```

   若提示关闭终端，关闭后重新打开 UCRT64，再执行一次更新命令。
3. 在同一个 UCRT64 终端安装 GCC 和 GDB：

   ```bash
   pacman -S --needed mingw-w64-ucrt-x86_64-gcc mingw-w64-ucrt-x86_64-gdb
   ```

4. 按上一小节的方法，把 `C:\msys64\ucrt64\bin` 加入用户 PATH。
5. 重新打开 VS Code 的 **Command Prompt**，执行 `g++ --version` 和 `gdb --version` 检查。

后面的配置包要选 MSYS2 版，编译器和调试器都使用 `ucrt64\bin` 中的工具。

### Windows：小熊猫 C++（备用选择）

[小熊猫 C++](https://royqh.net/redpandacpp/)也能编辑、编译和运行程序，旧资料中可能叫“小熊猫 Dev-C++”。如果选择它，可以跳过 VS Code 配置。

1. 在[官方下载页](https://royqh.net/redpandacpp/download/)选择 Windows 64 位、带 MinGW/GCC 的包。按说明安装；绿色版解压后运行 `RedPandaIDE.exe`。
2. 新建 C++ 源文件，把第 3 节代码保存为 `main.cpp`。
3. 选择检测到的 GNU GCC 编译器集，在 C++ 编译选项中设置 C++20。若没有对应选项，可添加编译参数 `-std=c++20`。
4. 点击“编译运行”，输入 `2 3` 并回车，应得到 `5`。出现错误时，看编译信息，修改后保存并重新编译。

菜单位置可查[官方使用说明](https://royqh.net/redpandacpp/docsy/docs/usage/)。未检测到 GCC 时，先检查下载的包是否带编译器。

### macOS：VS Code 与 Clang

1. 安装 [VS Code](https://code.visualstudio.com/)。
2. 打开系统的“终端”应用，执行：

   ```bash
   xcode-select --install
   ```

   按提示安装 Apple Command Line Tools；如果已安装，继续下一步。
3. 执行 `clang++ --version`，确认能看到版本信息。

macOS 上的 `g++` 也可能指向 Clang。本文统一用 `clang++`，通过终端手动编译。

### Debian / Ubuntu Linux：VS Code 与 GCC

1. 安装 [VS Code](https://code.visualstudio.com/)。
2. 打开终端，执行：

   ```bash
   sudo apt update
   sudo apt install g++
   ```

3. 执行 `g++ --version`，确认能看到版本信息。

`sudo` 用于安装系统软件，后面编译和运行程序不需要它。若旧版 GCC 不支持 C++20，需按发行版说明更新编译器。其他发行版可参考 [Fedora](https://docs.fedoraproject.org/en-US/quick-docs/installing-from-source/) 或 [Arch Linux](https://wiki.archlinux.org/title/GNU_Compiler_Collection) 的说明。

### 环境验证

用下面的命令检查编译器位置和版本：

| 系统 | 查看位置 | 查看版本 |
|---|---|---|
| Windows Command Prompt | `where g++` | `g++ --version` |
| macOS | `command -v clang++` | `clang++ --version` |
| Linux | `command -v g++` | `g++ --version` |

Windows 若列出多个路径，第一项应是你刚安装的编译器。

### VS Code 扩展

在 VS Code 左侧打开“扩展”，搜索下表中的 ID，核对发布者后安装。

| 扩展（ID） | 发布者 | 用途 |
|---|---|---|
| [C/C++](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cpptools)（`ms-vscode.cpptools`） | Microsoft | 本课使用：代码提示和调试 |
| [LaTeX Workshop](https://marketplace.visualstudio.com/items?itemName=James-Yu.latex-workshop)（`James-Yu.latex-workshop`） | James Yu | 理论课需要时安装，配置见文末 |
| [Code Runner](https://marketplace.visualstudio.com/items?itemName=formulahendry.code-runner)（`formulahendry.code-runner`） | Jun Han | 可选：快捷编译和运行单文件 |
| [简体中文语言包](https://marketplace.visualstudio.com/items?itemName=MS-CEINTL.vscode-language-pack-zh-hans)（`MS-CEINTL.vscode-language-pack-zh-hans`） | Microsoft | 可选：中文界面 |

Code Runner 调用已安装的编译器。建议先手动编译一次，再使用它。LaTeX Workshop 也需要另外安装 TeX 工具，按理论课安排准备即可。

### Windows VS Code 配置包

**先完成第 3 节的手动编译，再回来设置快捷运行。** macOS/Linux 使用后面的终端命令即可。

- [WinLibs 配置包 ZIP](/files/cpp-starter/windows-winlibs.zip) · [使用说明](/files/cpp-starter/windows-winlibs/README.md)
- [MSYS2 UCRT64 配置包 ZIP](/files/cpp-starter/windows-msys2.zip) · [使用说明](/files/cpp-starter/windows-msys2/README.md)

按编译器路线下载一份，然后：

1. 解压，在 VS Code 中用“文件 → 打开文件夹”打开 `windows-winlibs` 或 `windows-msys2`。左侧应能看到 `main.cpp` 和 `.vscode`。
2. 安装 Microsoft C/C++ 扩展。若出现工作区信任提示，核对文件后信任该文件夹。
3. 打开并保存 `main.cpp`，保持这个标签页选中。按 `Ctrl+Shift+B` 编译，按 `Ctrl+F5` 运行；首次选择本包的 `C++: run active file` 配置。
4. 在下方终端输入 `2 3` 并回车，应输出 `5`。`F5` 可启动基本调试，本课暂不讲断点操作。

包内的 `tasks.json` 负责 C++20 编译，`launch.json` 负责运行和调试，其余文件设置代码提示、终端和扩展推荐。**配置包不含编译器。**

默认工具目录是 `C:\mingw64\bin` 或 `C:\msys64\ucrt64\bin`。安装在其他位置时，在 `.vscode` 文件中统一替换路径，然后关闭旧终端、新建终端。

Code Runner 没有列入默认扩展推荐。若自行安装，在命令面板执行 **Run Code**；配套设置会保存文件，用 C++20 编译，并在终端中运行和接收输入。

## 3. 编写、编译和运行“两数相加”

### 创建源文件

用 VS Code 打开 `cpp-practice` 文件夹，新建 `main.cpp`，输入并保存：

```cpp
#include <iostream>

int main() {
    int a, b;
    std::cin >> a >> b;
    std::cout << a + b << '\n';
}
```

程序读取两个整数，输出它们的和。练习时，每个数取 `-1000` 到 `1000` 之间的整数。

`#include <iostream>` 引入输入输出功能，`main` 是程序入口。`std::cin` 读取输入，`std::cout` 输出结果，`'\n'` 表示换行。其他语法会在后面的课程中学习。

### 打开终端，找到源文件

在 VS Code 中选择“终端 → 新建终端”。**终端**是输入命令、查看输出的窗口。Windows 请在“+”旁下拉菜单中选 **Command Prompt**；提示符以 `PS` 开头的是 PowerShell，不适用本文的 Windows 命令。

检查当前文件夹：

Windows Command Prompt：

```bat
cd
dir
```

macOS/Linux：

```bash
pwd
ls
```

第一条显示位置，第二条列出文件，应能看到 `main.cpp`。终端当前所在的文件夹叫**工作目录**，编译器会从这里找源码。

若找不到文件，检查 VS Code 是否打开了正确的文件夹。也可以切换目录，下面的路径要换成你自己的：

```bat
cd /d "D:\course work\cpp-practice"
```

macOS/Linux 用 `cd "文件夹的完整路径"`。路径含空格时加引号；Windows 的 `/d` 允许同时切换盘符。

### 编译并运行

按自己的系统执行一条命令：

Windows Command Prompt：

```bat
g++ -std=c++20 -Wall -Wextra -Wpedantic main.cpp -o main.exe && main.exe
```

macOS：

```bash
clang++ -std=c++20 -Wall -Wextra -Wpedantic main.cpp -o main && ./main
```

Debian/Ubuntu：

```bash
g++ -std=c++20 -Wall -Wextra -Wpedantic main.cpp -o main && ./main
```

这些命令先编译，再运行：

- `-std=c++20`：使用 C++20。
- `-Wall -Wextra -Wpedantic`：开启常用警告。
- `-o`：指定生成的程序名，Windows 是 `main.exe`，macOS/Linux 是 `main`。
- `&&`：编译成功才运行。`./main` 中的 `./` 表示当前文件夹。

运行后，在终端输入：

```text
2 3
```

按回车，应看到：

```text
5
```

两个整数用空格或换行分隔都可以。程序没有打印“请输入两个数”，这是为了符合 OJ 的输出要求。没有马上出结果时，先检查是否还在等输入。

若编译出现 `error:`，从第一条错误开始看，注意文件名和行号。以实际编译结果为准，编辑器的代码提示可能与它不同。

### 修改后重新编译

1. 把 `a + b` 改成 `a - b`，保存，再执行编译运行命令。输入 `2 3`，应输出 `-1`。
2. 恢复成相加，再删去 `std::cout` 那一行末尾的分号。保存、编译，观察报错。
3. 恢复分号，保存并重新编译。

编译失败时，磁盘上可能还留着旧程序。上面的 `&&` 会阻止它继续运行，避免把旧结果当成修改后的结果。

## 4. 本地测试

每次运行前，先自己算出答案，再比较程序输出：

| 输入 | 预期输出 |
|---|---:|
| `2 3` | `5` |
| `0 7` | `7` |
| `-4 1` | `-3` |

只通过样例还不够，真实题目还要检查边界数据和输入输出格式。

程序等待输入时，点击终端，输入数字并回车。需要中止运行时，按 `Ctrl+C`。

**选读：从文件输入。** 把 `2 3` 保存到同一目录的 `input.txt`。成功编译后，Windows 执行 `main.exe < input.txt`，macOS/Linux 执行 `./main < input.txt`，应输出 `5`。`<` 把文件内容交给程序作为输入。

键盘或文件提供的数据叫**标准输入**，`std::cout` 的答案输出叫**标准输出**。还有用于输出诊断的**标准错误**，C++ 中可用 `std::cerr`。

## 5. 遇到问题：查资料和求助

先确定卡在哪一步：安装、编译、运行，还是答案不对。保留命令和完整报错，一次只改一项，再检查结果。

### 怎样搜索和读文档

STFW 大意是“先搜索”，RTFM 大意是“先读手册”，都是带有粗鲁语气的网络缩写。这里借它们介绍查资料的方法。不会搜、看不懂，或尝试后仍卡住，都可以直接求助。

搜索时，把**工具名 + 关键报错 + 系统**放在一起。例如，把“C++ 不能用”改成：

```text
VS Code g++ is not recognized Windows Command Prompt
```

尽量保留原始英文报错。阅读结果时，核对系统和版本；安装方法、配置选项优先查官方文档。

例如，`g++ --version` 提示“不是内部或外部命令”时，依次检查：

1. 编译器是否已安装，`bin` 目录里是否有 `g++.exe`。
2. PATH 是否指向这个 `bin` 目录。
3. 修改 PATH 后，是否重新打开了 VS Code 和终端。

修正后再执行 `g++ --version`，看到版本信息就可以继续。

### 选择哪种帮助

| 途径 | 适合做什么 | 需要核对什么 |
|---|---|---|
| 搜索引擎 | 找到相同报错的讨论 | 系统和版本是否相同 |
| 官方文档 | 查安装方法、配置含义 | 是否对应所用版本 |
| AI | 解释报错、整理检查步骤 | 建议是否适用，能否验证 |
| 老师、助教、同学 | 了解课程规则，或一起排查 | 是否提供了代码、输入和报错 |

### 怎样用 AI 辅助排查

把环境、目标、命令和报错一起提供给 AI，请它解释原因和检查方法。例如：

```text
我在 Windows 的 VS Code Command Prompt 中使用 WinLibs GCC。
main.cpp 在当前文件夹，输入 2 3 应输出 5。
我执行了：g++ -std=c++20 main.cpp -o main.exe
报错是：[粘贴完整报错]
请解释错误，并给出两三项检查步骤。
```

AI 可能猜错，也看不到你没提供的电脑信息。理解建议后逐项尝试，用实际结果验证；不要反复只说“还是不行”。作业中如何使用 AI，按课程规定执行。

### 怎样提问

“运行不了”很难判断原因。用下面的模板补齐信息，命令、代码和报错尽量复制成文字。代码问题附上能复现错误的最短代码和输入；界面问题可附截图。

```text
我想完成：
操作系统、工具和版本：
文件位置与执行的命令：
代码或操作步骤：
输入与预期输出：
实际结果与完整报错：
已尝试的方法及结果：
```

试着用第 3 节的分号错误写一个搜索词或问题描述，再重新编译验证你得到的解释。

## 6. 使用课程 OJ

OJ（Online Judge，在线评测系统）会编译你提交的源码，用测试数据运行，再判断结果。入口、账号、截止时间和提交规则以课程通知为准。

课程 OJ 的读题、评测和自定义测试方法，见[第 0.5 课：OJ 使用指南](/teaching/nju-ps/2026-fall/lectures/oj-guide/)。

1. 从课程提供的入口登录，找到本次作业和题目，核对题名、题号。
2. 读清题目要求、输入输出格式、数据范围，以及时间和内存限制。
3. 在本地保存、编译，测试样例和自己构造的数据，删除多余提示和调试输出。
4. 按要求粘贴或上传**源码**，不是 `main.exe`。选择课程要求的 C++ 语言选项。
5. 找到本次提交记录，核对时间、代码和评测结果。修改后再次提交，要查看对应的新记录。

本文的“两数相加”是自拟练习：一组输入，两个 `-1000` 到 `1000` 的整数，输出它们的和并换行。例如，输入 `2 3`，输出 `5`。

如果课程有类似题目，先核对要求，再提交。真实题目可能有多组输入、要求读到 EOF（文件结束），或只提交一个函数，不能直接照搬完整程序。数据范围影响类型和算法的选择；时间、内存限制规定程序可使用的资源。

## 7. 看懂评测反馈

下面是常见状态，具体名称以课程 OJ 为准。

| 状态 | 含义 | 先检查什么 |
|---|---|---|
| Pending / 评测中 | 尚无最终结果 | 等待，稍后查看记录 |
| AC | 通过评测 | 确认课程作业的完成状态 |
| CE | 编译失败 | 编译报错、语言选项和代码 |
| WA | 答案错误 | 题意、输入输出格式和边界数据 |
| RE | 运行时异常 | 越界、除以零等问题 |
| TLE | 运行超时 | 死循环或计算量过大 |
| MLE | 内存超限 | 数组、容器等是否过大 |

**本地能运行、样例通过、OJ 通过是不同的结果。** 例如，误写成减法也能运行，输入 `0 0` 甚至会得到正确答案，但输入 `2 3` 就错了。要按题意检查，不能只凭一次运行判断。

## 8. 完成检查

- [ ] 能找到源码，知道终端当前在哪个文件夹。
- [ ] 能检查编译器版本，编译并运行程序。
- [ ] 修改后会保存、重新编译，并测试结果。
- [ ] 能保留报错，查资料或描述问题求助。
- [ ] 能提交源码，找到对应记录并理解评测结果。

完成后，可以继续学习基本类型、表达式和控制流程。

## 常见问题速查

### 找不到 `g++` 命令

检查编译器是否安装、PATH 中的 `bin` 路径是否正确，然后重新打开 VS Code。MSYS2 用户应使用 UCRT64 的工具。

### 找不到 `main.cpp`

用 `dir`（Windows）或 `ls`（macOS/Linux）检查当前文件夹。文件不在这里就切换目录；Windows 还要检查是否误存成了 `main.cpp.txt`。

### 编译后没有消息

编译成功时可能没有提示。单独编译后，检查是否生成了 `main.exe` 或 `main`；本文的 `&&` 命令会接着运行程序。

### 修改代码后，输出没变

先保存，再重新编译。编译失败时，不要运行旧的可执行文件。

### 路径有空格，命令出错

给完整路径加引号。Windows 切换目录用 `cd /d "完整路径"`。

### 程序不能输入，或一直不结束

点击下方“终端”面板输入并回车。需要停止时，在终端按 `Ctrl+C`。

Code Runner 的“输出”面板不能输入。检查 `code-runner.runInTerminal` 是否为 `true`，关闭旧的 `Code` 终端再运行；使用配套配置包可直接在终端输入。

### 代码提示与编译结果不一致

检查 `.vscode/settings.json` 和 `c_cpp_properties.json` 中的编译器路径。代码提示设置不会改变手动编译时调用的工具。

### 本地通过，OJ 返回 CE 或 WA

CE 先看报错和语言选项；WA 重新核对格式、边界数据和多余输出。确认看的记录对应最新代码。

### 无法访问 OJ，或找不到课程、提交记录

核对课程通知中的入口、账号和网络要求。把网址、时间和页面提示提供给课程指定的求助渠道。

## 术语表

| 术语 | 意思 |
|---|---|
| 扩展名 | 文件名末尾表示类型的部分，如 `.cpp` |
| 源文件 | 保存代码的文件，如 `main.cpp` |
| 路径 | 文件或文件夹的位置；完整路径指向固定位置，相对路径从当前目录开始找 |
| 工作目录 | 终端当前所在的文件夹 |
| 终端 | 输入命令、查看输出的窗口 |
| Shell | 解释命令的程序，如 Command Prompt、PowerShell、Bash |
| 编译器 | 把源码变成可运行程序的工具 |
| 可执行文件 | 编译生成的程序，如 `main.exe` |
| PATH | 系统查找命令的目录列表 |
| 标准输入 / 输出 / 错误 | 程序接收数据、输出答案、输出诊断的通道 |
| OJ | 编译、运行并评测所提交程序的网站 |
| 测试用例 | 一组输入和对应的预期输出 |

## 官方资料与配置文件

- 安装：[VS Code](https://code.visualstudio.com/)、[WinLibs](https://winlibs.com/)、[MSYS2](https://www.msys2.org/)、[Apple Command Line Tools](https://developer.apple.com/documentation/xcode/installing-the-command-line-tools/)、[小熊猫 C++](https://royqh.net/redpandacpp/download/)。
- 扩展：[Microsoft C/C++](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cpptools)、[Code Runner](https://github.com/formulahendry/vscode-code-runner)、LaTeX Workshop 的[安装要求](https://github.com/James-Yu/LaTeX-Workshop/wiki/Install)与[编译说明](https://github.com/James-Yu/LaTeX-Workshop/wiki/Compile)。
- 配置：[WinLibs ZIP](/files/cpp-starter/windows-winlibs.zip)、[MSYS2 ZIP](/files/cpp-starter/windows-msys2.zip)、[LaTeX Workshop ZIP](/files/latex-workshop.zip)。

## 附录：LaTeX Workshop 基本配置

理论课需要 LaTeX 时，安装 `James-Yu.latex-workshop`。TeX 发行版按理论课安排安装；本节不讲 LaTeX 语法。

配套配置使用 `latexmk` 和 XeLaTeX。先执行 `latexmk --version`、`xelatex --version` 检查工具。MiKTeX 用户还需安装 Perl，见[插件安装说明](https://github.com/James-Yu/LaTeX-Workshop/wiki/Install)。

1. 用 VS Code 打开理论作业文件夹。
2. 把[配置文件](/files/latex-workshop/.vscode/settings.json)放到该文件夹的 `.vscode/settings.json`。已有设置时，只合并 `latex-workshop.*` 字段。
3. 打开 `.tex` 文件，在命令面板执行 **LaTeX Workshop: Build LaTeX project**，再执行 **LaTeX Workshop: View LaTeX PDF file**。

配置关闭自动编译，在编辑器标签页预览 PDF。课程模板若要求其他编译引擎或已有配置，沿用模板说明。

如果只想关闭自动编译、在编辑器预览 PDF，添加这两项即可；它们不设置编译引擎：

```json
{
  "latex-workshop.latex.autoBuild.run": "never",
  "latex-workshop.view.pdf.viewer": "tab"
}
```

合并 JSON 时，字段之间用逗号分隔，不要把两组 `{}` 直接拼起来。编译失败时，查看 LaTeX Workshop 日志，检查工具安装和模板要求。
