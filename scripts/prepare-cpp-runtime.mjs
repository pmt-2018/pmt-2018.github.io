import { cp, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

// Generated from the pinned npm package; never download a compiler from a CDN at runtime.
const packageRoot = dirname(fileURLToPath(import.meta.resolve('@live-codes/clang-wasm/iife')));
const target = fileURLToPath(new URL('../public/cpp-runtime/', import.meta.url));
await mkdir(target, { recursive: true });
await cp(join(packageRoot, '../assets'), target, { recursive: true });
await cp(join(packageRoot, 'clang-wasm.global.js'), join(target, 'clang-wasm.global.js'));
for (const file of ['LICENSE', 'THIRD-PARTY-NOTICES.md']) {
  await cp(join(packageRoot, '..', file), join(target, file));
}
console.log('C++ runtime assets prepared in public/cpp-runtime/');
