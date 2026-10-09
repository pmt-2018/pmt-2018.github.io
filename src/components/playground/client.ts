import type { WorkerMessage } from './protocol';
import type { CppEditor } from './CppEditor';

for (const root of document.querySelectorAll<HTMLElement>('.cpp-playground')) {
  const get = <T extends HTMLElement>(selector: string) => root.querySelector<T>(selector)!;
  const source = get<HTMLTextAreaElement>('.cpp-source');
  const stdin = get<HTMLTextAreaElement>('.cpp-stdin');
  const fallback = get('.cpp-fallback');
  const modifiedCode = get('.cpp-modified-code');
  const editorPane = get('.cpp-editor-pane');
  const editorHost = get('.cpp-editor-host');
  const plainEditor = get('.cpp-plain-editor');
  const editorHelp = get('.cpp-editor-help');
  const editorNotice = get('.cpp-editor-notice');
  const interactive = get('.cpp-interactive');
  const edit = get<HTMLButtonElement>('[data-action="edit"]');
  const run = get<HTMLButtonElement>('[data-action="run"]');
  const stop = get<HTMLButtonElement>('[data-action="stop"]');
  const status = get('.cpp-status');
  const progress = get<HTMLProgressElement>('.cpp-progress');
  const loadNote = get('.cpp-load-note');
  const runDetails = get<HTMLDetailsElement>('.cpp-run-details');
  const diagnostics = get('.cpp-diagnostics');
  const diagnosticsPanel = get<HTMLDetailsElement>('.cpp-diagnostics-panel');
  const stdout = get('.cpp-stdout');
  const stdoutPanel = get('.cpp-stdout-panel');
  const stderr = get('.cpp-stderr');
  const stderrPanel = get('.cpp-stderr-panel');
  const failure = get('.cpp-failure');
  const failurePanel = get('.cpp-failure-panel');
  const original = { code: source.value, stdin: stdin.value };
  const canRun = typeof Worker !== 'undefined' && typeof WebAssembly !== 'undefined';
  let worker: Worker | undefined;
  let editor: CppEditor | undefined;
  let editorLoading = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let busy = false;
  let editorOpen = false;
  let hasResult = false;

  const markChanged = () => {
    if (hasResult && !busy) status.textContent = '代码或输入已修改 · 请重新运行以更新结果';
  };

  const syncEditor = () => {
    const modified = source.value !== original.code;
    fallback.hidden = editorOpen || modified;
    editorPane.hidden = !editorOpen && !(modified && editor);
    modifiedCode.hidden = editorOpen || !modified || Boolean(editor);
    modifiedCode.querySelector('code')!.textContent = source.value;
    edit.querySelector('[data-action-label]')!.textContent = editorOpen ? '阅读' : '编辑';
    edit.setAttribute('aria-expanded', String(editorOpen));
    editorHelp.hidden = !editorOpen || !editor;
    source.readOnly = busy || !editorOpen;
    editor?.setReadOnly(busy || !editorOpen);
  };

  const loadEditor = async () => {
    if (editor || editorLoading) return;
    editorLoading = true;
    edit.disabled = true;
    editorNotice.hidden = false;
    editorNotice.textContent = '正在加载代码编辑器…';
    try {
      // This chunk is only requested on Edit. Reading and Run do not load CodeMirror.
      const { createCppEditor } = await import('./CppEditor');
      editorHost.hidden = false;
      editor = createCppEditor(editorHost, source, () => {
        modifiedCode.querySelector('code')!.textContent = source.value;
        markChanged();
      });
      plainEditor.hidden = true;
      editorNotice.hidden = true;
      syncEditor();
      if (editorOpen && !busy) editor.focus();
    } catch {
      editorHost.hidden = true;
      plainEditor.hidden = false;
      editorNotice.textContent = '代码编辑器未能加载，仍可在文本框中修改并运行。';
    } finally {
      editorLoading = false;
      edit.disabled = busy;
    }
  };

  const setBusy = (value: boolean) => {
    busy = value;
    run.disabled = value || !canRun;
    run.querySelector('[data-action-label]')!.textContent = value ? '运行中…' : '运行';
    stop.hidden = !value;
    edit.disabled = value || editorLoading;
    source.readOnly = value || !editorOpen;
    stdin.readOnly = value;
    editor?.setReadOnly(value || !editorOpen);
    if (!value) progress.hidden = true;
  };
  const clearTimer = () => { clearTimeout(timer); timer = undefined; };
  const terminate = () => {
    worker?.terminate();
    worker = undefined;
    clearTimer();
    setBusy(false);
  };
  const clearResults = (message = '运行后，结果显示在这里。') => {
    hasResult = false;
    diagnostics.textContent = stderr.textContent = failure.textContent = '';
    diagnosticsPanel.hidden = stderrPanel.hidden = failurePanel.hidden = true;
    diagnosticsPanel.open = false;
    runDetails.hidden = true;
    runDetails.open = false;
    stdoutPanel.hidden = false;
    stdout.classList.add('cpp-empty');
    stdout.textContent = message;
  };
  const fail = (message: string) => {
    terminate();
    stdoutPanel.hidden = true;
    failure.textContent = message;
    failurePanel.hidden = false;
    status.textContent = '运行环境错误 · 请查看说明后重试';
    loadNote.hidden = false;
  };
  const deadline = (ms: number, message: string) => {
    clearTimer();
    timer = setTimeout(() => fail(message), ms);
  };

  run.addEventListener('click', () => {
    if (busy || !canRun) return;
    clearResults('等待运行结果…');
    setBusy(true);
    loadNote.hidden = true;
    status.textContent = worker ? '正在编译并运行…' : '首次加载编译器（约 28 MB）…';
    progress.hidden = Boolean(worker);
    progress.removeAttribute('value');
    deadline(90_000, '加载编译器超过 90 秒，已停止。请检查网络后重试。');
    try {
      if (!worker) {
        // The package's importScripts build requires a classic worker.
        worker = new Worker(new URL('./cpp-worker.ts', import.meta.url));
        worker.onmessage = (event: MessageEvent<WorkerMessage>) => {
          const message = event.data;
          if (message.type === 'loading') {
            const percent = Math.max(0, Math.min(100, Math.round(message.progress * 100)));
            progress.hidden = false;
            progress.value = percent;
            status.textContent = `首次加载编译器 · ${percent}%`;
          } else if (message.type === 'running') {
            progress.hidden = true;
            status.textContent = '正在编译并运行（最多 30 秒）…';
            deadline(30_000, '编译和运行超过 30 秒，已停止。请检查死循环或简化示例后重试。');
          } else if (message.type === 'failure') {
            fail(message.message);
          } else {
            clearTimer();
            setBusy(false);
            const result = message.result;
            hasResult = true;
            diagnostics.textContent = result.errors.join('\n');
            diagnosticsPanel.hidden = result.errors.length === 0;
            diagnosticsPanel.open = result.exitCode === null;
            stdoutPanel.hidden = result.exitCode === null;
            stdout.textContent = result.stdout || '（无输出）';
            stdout.classList.toggle('cpp-empty', !result.stdout);
            stderr.textContent = result.stderr;
            stderrPanel.hidden = !result.stderr;
            status.textContent = result.exitCode === null
              ? '编译 / 链接失败 · 程序未执行'
              : result.exitCode === 0 ? '运行成功 · 退出码 0' : `程序结束 · 退出码 ${result.exitCode}`;
            runDetails.hidden = false;
            runDetails.querySelector('p')!.textContent = `编译 ${Math.round(result.compileMs)} ms${result.runMs === null ? '' : ` · 运行 ${Math.round(result.runMs)} ms`}。当前工具链不返回成功编译时的警告。`;
          }
        };
        worker.onerror = (event) => { event.preventDefault(); fail(event.message || '编译器无法启动。'); };
        worker.onmessageerror = () => fail('无法读取编译器返回的数据。');
      }
      worker.postMessage({
        code: source.value,
        stdin: stdin.value,
        baseUrl: new URL(root.dataset.runtimeBase!, location.href).href,
      });
    } catch (error) {
      fail(error instanceof Error ? error.message : String(error));
    }
  });

  edit.addEventListener('click', () => {
    if (busy || editorLoading) return;
    editorOpen = !editorOpen;
    syncEditor();
    if (editorOpen) {
      if (editor) editor.focus();
      else { source.focus(); void loadEditor(); }
    }
  });
  source.addEventListener('input', markChanged);
  stdin.addEventListener('input', markChanged);

  stop.addEventListener('click', () => {
    terminate();
    clearResults('已停止，未返回运行结果。');
    status.textContent = '已停止 · 下次运行将重新加载编译器';
    loadNote.hidden = false;
  });
  get<HTMLButtonElement>('[data-action="reset"]').addEventListener('click', () => {
    if (busy) terminate();
    source.value = original.code;
    stdin.value = original.stdin;
    editor?.setValue(original.code);
    syncEditor();
    clearResults();
    status.textContent = canRun ? '已恢复初始示例' : '当前浏览器无法运行 C++，可复制代码在本地编译。';
    loadNote.hidden = Boolean(worker) || !canRun;
  });
  window.addEventListener('pagehide', terminate);
  if (!canRun) {
    status.textContent = '当前浏览器无法运行 C++，可复制代码在本地编译。';
    run.disabled = true;
    loadNote.hidden = true;
  }
  root.classList.add('cpp-enhanced');
  interactive.hidden = false;
  syncEditor();
}
