# Windows C++20 入门配置：MSYS2 UCRT64

适用于 x86-64 Windows 10/11 和 VS Code 的单文件练习。

默认安装 MSYS2 到 `C:/msys64`，在 UCRT64 终端执行：

```bash
pacman -S --needed mingw-w64-ucrt-x86_64-gcc mingw-w64-ucrt-x86_64-gdb
```

## 使用

1. 解压配置包，使用 VS Code 的“文件 → 打开文件夹”打开 `windows-msys2`，确认左侧能看到 `main.cpp` 和 `.vscode`。
2. 安装 Microsoft C/C++ 扩展（`ms-vscode.cpptools`）。
3. 打开 `main.cpp` 并保存，按 Ctrl+Shift+B 编译当前文件。
4. 按 Ctrl+F5 运行，或 F5 启动基本调试；首次选择 `C++: run active file (MSYS2 UCRT64)`。在下方终端输入 `2 3` 并回车，应输出 `5`。本章不展开断点调试。
5. Code Runner 可选，未列入默认推荐。安装后使用命令面板的“Run Code”；本配置运行完整文件，运行前保存，在 Command Prompt 中接收输入。

配置以当前活动 `.cpp` 文件为对象，请保持源码标签页活动。编译任务仅编译，运行入口会先调用编译任务；`debug.onTaskErrors` 设置为 `abort`，编译失败时中止启动。

## 改安装路径

默认工具目录：`C:/msys64/ucrt64/bin`。如果位置不同，搜索 `.vscode` 中这个目录，统一替换 `settings.json`、`c_cpp_properties.json`、`tasks.json`、`launch.json` 的对应路径。JSON 中可用正斜杠；工具目录内的文件应保留完整。

本配置只为当前文件夹指定终端和工具路径，不修改全局 PATH。修改终端设置后，关闭旧的 VS Code 终端，再新建终端；Code Runner 的旧 Code 终端也要关闭。

## 配置文件职责

- `extensions.json`：只推荐 Microsoft C/C++。
- `settings.json`：C++20、UTF-8、缩进、Command Prompt、局部 PATH 与可选 Code Runner。
- `c_cpp_properties.json`：编译器与代码提示标准。
- `tasks.json`：调用编译器，生成与源码同名的 `.exe`。
- `launch.json`：GDB 运行/调试入口，先编译并在终端接收输入。

本包不含编译器。示例和配置参数在 Linux 下进行了静态及源码检查，Windows 原生 VS Code/GDB 流程尚未实机验证。正式操作说明见站内第 0 课。
