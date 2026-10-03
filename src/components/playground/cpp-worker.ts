import type { RunRequest, RunResult, WorkerMessage } from './protocol';

interface Compiler {
  run(code: string, stdin: string): Promise<RunResult>;
}

const scope = self as unknown as {
  clangWasm: {
    createCompiler(language: string, options: {
      baseUrl: string;
      std: string;
      onProgress: (progress: number) => void;
    }): Promise<Compiler>;
  };
};
const send = (message: WorkerMessage) => self.postMessage(message);
let compiler: Compiler | undefined;

self.onmessage = async (event: MessageEvent<RunRequest>) => {
  try {
    if (!compiler) {
      importScripts(new URL('clang-wasm.global.js', event.data.baseUrl).href);
      compiler = await scope.clangWasm.createCompiler('cpp', {
        baseUrl: event.data.baseUrl,
        std: 'gnu++17',
        onProgress: (progress) => send({ type: 'loading', progress }),
      });
    }
    send({ type: 'running' });
    const result = await compiler.run(event.data.code, event.data.stdin);
    send({ type: 'result', result });
  } catch (error) {
    send({ type: 'failure', message: error instanceof Error ? error.message : String(error) });
  }
};
