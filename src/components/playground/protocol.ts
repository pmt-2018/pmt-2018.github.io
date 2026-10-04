export interface RunRequest {
  code: string;
  stdin: string;
  baseUrl: string;
}

export interface RunResult {
  stdout: string;
  stderr: string;
  errors: string[];
  exitCode: number | null;
  compileMs: number;
  runMs: number | null;
}

export type WorkerMessage =
  | { type: 'loading'; progress: number }
  | { type: 'running' }
  | { type: 'result'; result: RunResult }
  | { type: 'failure'; message: string };
