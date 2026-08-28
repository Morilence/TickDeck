# TypeScript 6.0.3 兼容性复核证据 — 2026-08-28

## Verdict

**PASS（架构基线）/ IMPLEMENTATION EVIDENCE DEFERRED（完整沙箱链）**。TypeScript 6.0.3 可作为 TickDeck Web、Node、测试、合同与现有精确依赖的统一编译基线；原来基于 TypeScript 7.0.2 的兼容性判断全部由本次 6.0.3 元数据和编译探针替代。TypeScript→WebAssembly Component 的完整 compiler/componentizer/source-map/WIT/WASI 组合仍由 OQ-06 和既有阶段 Gate 阻塞，本次没有借 compiler API 探针提前关闭它。

## TypeScript 6.0 行为约束

官方 6.0 release notes 直接影响 monorepo 骨架：

- `types` 默认变为 `[]`，所以 Web、Node、测试与中立共享包必须分别显式列出 ambient types；禁止用 `types: ["*"]` 重新混入全部声明。
- `rootDir` 默认变为 tsconfig 所在目录，所以每个 workspace 显式设置 `rootDir`，避免 emit/tree 与项目引用漂移。
- `baseUrl`、`moduleResolution: node/node10` 被弃用，`classic` 已移除；Web 使用 Bundler，Node 服务/工具使用 NodeNext，workspace 包使用 package exports。
- `target`/`module` 默认值会变化，所以 Web 固定 ES2022/ESNext，Node 固定 ES2023/NodeNext；不依赖浮动默认。
- `stableTypeOrdering` 是 6→7 差异诊断开关且可能显著拖慢检查，不进入正常 CI；`ignoreDeprecations` 不作为绕过手段。

来源：[TypeScript 6.0 release notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-6-0.html) · [TypeScript 6.0 announcement](https://devblogs.microsoft.com/typescript/announcing-typescript-6-0/) · [npm 6.0.3 metadata](https://registry.npmjs.org/typescript/6.0.3)

## 精确探针

探针使用 `typescript@6.0.3`、`strict: true`、`skipLibCheck: false`、`noUncheckedIndexedAccess`、`exactOptionalPropertyTypes`、`noUncheckedSideEffectImports`、`verbatimModuleSyntax`、`isolatedModules` 与显式 `target/lib/rootDir/types`。

| Surface | Exact packages | Config | Result |
| --- | --- | --- | --- |
| Web/TSX | React/DOM 19.2.8、types 19.2.18/19.2.5、Vite 8.2.2、plugin-react 6.1.0、Vitest 4.1.11 | ES2022、DOM/DOM.Iterable、ESNext + Bundler、`types: ["vite/client"]` | `tsc --noEmit` exit 0 |
| Node control plane | Node types 24.13.3、Fastify 5.12.1、type-provider-typebox 6.1.0、typebox 1.3.19、Ajv 8.20.0 | ES2023、NodeNext、`types: ["node"]` | `tsc --noEmit` exit 0 |
| Deterministic numeric ingress | decimal.js 10.6.0、lossless-json 4.3.1 | 同时从 Web/Node probe 导入其正式 declarations | exit 0；替代此前 TypeScript 7 decimal probe |
| Compiler API boundary | TypeScript 6.0.3 `createSourceFile` / `ScriptTarget` | 只代表 `tools/component-compiler` 可绑定 6.0.3 API | exit 0；不证明 componentizer/WIT 可行性 |
| ESLint typed parser | ESLint 10.9.1、typescript-eslint 8.68.0 | 两个 tsconfig 的 type-aware strict config | exit 0；peer range明确覆盖 TS 6.0.3 |

第一次 NodeNext 探针准确暴露并修复了两项 6.0.3 导入要求：

1. `TypeBoxTypeProvider` 在 `verbatimModuleSyntax` 下必须使用 `import type`；否则产生 TS1484。
2. Ajv 8.20.0 在 NodeNext 下使用其具名 `Ajv` constructor；沿用默认构造写法会产生 TS2351。具名导入同时通过 Node ESM runtime probe。

修正后 Web 与 Node 两个严格检查都 exit 0；没有启用 `skipLibCheck`、`ignoreDeprecations` 或 TypeScript 7 sidecar/compatibility package。

## 兼容性结论

- React/Vite Web、Fastify/TypeBox/Ajv Node 服务、测试工具、decimal/lossless ingress 与 ESLint typed parser 均有可复现的 6.0.3 基线。
- `moduleResolution: Bundler` 不是全仓默认；只属于 Vite 负责运行时解析的 Web surface。Node 服务/工具必须使用 NodeNext 并接受其更严格的 ESM/CJS 导入检查。
- shared `core/contracts/policies` 不继承 DOM 或 Node globals；这同时强化 AD-1/AD-3 边界。
- Monaco/browser worker/server compiler/API contract 仍需 release lockfile 和 S3 integration evidence；本探针只证明顶层 declarations 与配置可编译。
- 所有历史文档中“TypeScript 7.0.2 已验证”“TS7-compatible”或“不会调用 TS7 已移除 API”的结论均为被替代的历史证据，不得用于 Story 1.1 或后续 Gate。当前权威证据是本文件与 AD-32。

## 保留 Gate

实际项目建立后仍必须用 `pnpm install --frozen-lockfile` 在受支持 profile 上运行 AD-32 的 `lint`、`format-check`、`typecheck`、`build`。OQ-06 还必须另行锁定完整沙箱工具链、检查 Component imports、source maps、确定性输出、资源与五平台 FR-095/NFR-037 证据；未通过时能力保持未注册。
