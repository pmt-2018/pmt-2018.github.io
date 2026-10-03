import type { WorkerMessage } from './protocol';

for (const root of document.querySelectorAll<HTMLElement>('.cpp-playground')) {
  const get = <T extends HTMLElement>(selector: string) => root.querySelector<T>(selector)!;
  const source = get<HTMLTextAreaElement>('.cpp-source');
  const stdin = get<HTMLTextAreaElement>('.cpp-stdin');
  const run = get<HTMLButtonElement>('[data-action="run"]');
  const stop = get<HTMLButtonElement>('[data-action="stop"]');
  const status = get('.cpp-status');
  const diagnostics = get('.cpp-diagnostics');
  const stdout = get('.cpp-stdout');
  const stderr = get('.cpp-stderr');
  const failure = get('.cpp-failure');
  const failurePanel = get('.cpp-failure-panel');
  const original = { code: source.value, stdin: stdin.value };
  let worker: Worker | undefined;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let busy = false;

  const setBusy = (value: boolean) => {
    busy = value;
    run.disabled = value;
    stop.disabled = !value;
    source.readOnly = value;
    stdin.readOnly = value;
  };
  const clearTimer = () => { clearTimeout(timer); timer = undefined; };
  const terminate = () => {
    worker?.terminate();
    worker = undefined;
    clearTimer();
    setBusy(false);
  };
  const fail = (message: string) => {
    terminate();
    failure.textContent = message;
    failurePanel.hidden = false;
    status.textContent = '运行未完成，可以修改代码后重试。';
  };
  const deadline = (ms: number, message: string) => {
    clearTimer();
    timer = setTimeout(() => fail(message), ms);
  };

  run.addEventListener('click', () => {
    if (busy) return;
    setBusy(true);
    diagnostics.textContent = stdout.textContent = stderr.textContent = '等待结果…';
    failurePanel.hidden = true;
    status.textContent = worker ? '正在编译并运行…' : '首次加载本地编译器（约 28 MB），请稍候…';
    deadline(90_000, '加载编译器超过 90 秒，已停止。请检查网络后重试。');
    try {
      if (!worker) {
        // A classic worker is required by the package's self-contained importScripts build.
        worker = new Worker(new URL('./cpp-worker.ts', import.meta.url));
        worker.onmessage = (event: MessageEvent<WorkerMessage>) => {
          const message = event.data;
          if (message.type === 'loading') {
            status.textContent = `正在加载本地编译器：${Math.round(message.progress * 100)}%`;
          } else if (message.type === 'running') {
            status.textContent = '正在编译并运行（最多 30 秒）…';
            deadline(30_000, '编译和运行超过 30 秒，Worker 已终止。请检查死循环或简化示例后重试。');
          } else if (message.type === 'failure') {
            fail(message.message);
          } else {
            clearTimer();
            setBusy(false);
            const result = message.result;
            diagnostics.textContent = result.errors.join('\n') || '编译成功。此试验 API 不返回成功编译时的警告。';
            stdout.textContent = result.stdout || '（无输出）';
            stderr.textContent = result.stderr || '（无输出）';
            status.textContent = result.exitCode === null
              ? '编译 / 链接失败，程序未执行。'
              : `退出码 ${result.exitCode} · 编译 ${Math.round(result.compileMs)} ms · 运行 ${Math.round(result.runMs ?? 0)} ms`;
          }
        };
        worker.onerror = (event) => { event.preventDefault(); fail(event.message || 'Worker 无法启动。'); };
        worker.onmessageerror = () => fail('无法读取 Worker 返回的数据。');
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

  stop.addEventListener('click', () => {
    terminate();
    diagnostics.textContent = stdout.textContent = stderr.textContent = '（已停止，未返回结果）';
    status.textContent = '已停止。下次运行将重新初始化编译器。';
  });
  get<HTMLButtonElement>('[data-action="reset"]').addEventListener('click', () => {
    if (busy) terminate();
    source.value = original.code;
    stdin.value = original.stdin;
    diagnostics.textContent = stdout.textContent = stderr.textContent = '尚未运行';
    failurePanel.hidden = true;
    status.textContent = '已恢复初始示例。';
  });
  window.addEventListener('pagehide', terminate);
  if (typeof Worker === 'undefined' || typeof WebAssembly === 'undefined') {
    status.textContent = '当前浏览器不支持 Worker 或 WebAssembly，请使用本地编译器。';
    run.disabled = true;
  }
  get('.cpp-fallback').hidden = true;
  get('.cpp-interactive').hidden = false;
}
