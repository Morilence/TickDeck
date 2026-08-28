# 工程工具版本复核证据 — 2026-08-28

## Verdict

**PASS.** TypeScript 已按“6 系列最新稳定版”精确锁定为 `6.0.3`；AD-32 所需 JavaScript/TypeScript/CSS/Git 工具均存在于 npm 官方注册表、采用稳定版本，且其 Node/peer 范围与 TickDeck 的 Node.js 24.20.0、TypeScript 6.0.3 相容。EditorConfig 是提交到仓库的文本规则，不作为 npm 依赖伪造版本号。

## 核验方法

- 核验时间：2026-08-28（Asia/Shanghai）。
- 权威来源：npm registry 的 `dist-tags`、`versions`、`version`、`engines`、`peerDependencies` 与 `dist.integrity` 元数据。
- 选择规则：根 `package.json` 使用下表精确版本，不使用 `latest`、`next`、`^` 或 `~`；`pnpm-lock.yaml` 是安装真值。
- “6 系列最新稳定版”按 `typescript` 官方版本列表筛选正式 `6.0.x`，不是采用 registry 当前整体 `latest`（该 tag 已指向 7 系列）。正式 6 系列最高版本是 `6.0.3`。

## 精确版本

| Package / standard | Pin | 官方元数据与适配结论 |
| --- | --- | --- |
| `typescript` | `6.0.3` | 6 系列最高正式 patch；Node engine `>=14.17`；integrity `sha512-y2TvuxSZPDyQakkFRPZHKFm+KKVqIisdg9/CZwm9ftvKXLP8NRWj38/ODjNbr43SsoXqNuAisEf1GdCxqWcdBw==`。[registry](https://registry.npmjs.org/typescript/6.0.3) |
| `eslint` / `@eslint/js` | `10.9.1` / `10.0.1` | ESLint 要求 Node `^20.19.0 || ^22.13.0 || >=24`；`@eslint/js` peer 接受 ESLint 10。[eslint](https://registry.npmjs.org/eslint/10.9.1) · [@eslint/js](https://registry.npmjs.org/@eslint/js/10.0.1) |
| `typescript-eslint` | `8.68.0` | peer 明确接受 ESLint 8.57/9/10 与 TypeScript `>=4.8.4 <6.1.0`，覆盖 6.0.3。[registry](https://registry.npmjs.org/typescript-eslint/8.68.0) |
| `eslint-config-prettier` | `10.1.8` | 根 flat config 的冲突关闭层。[registry](https://registry.npmjs.org/eslint-config-prettier/10.1.8) |
| `eslint-plugin-react-hooks` | `7.1.1` | 仅 Web React/TSX 配置使用。[registry](https://registry.npmjs.org/eslint-plugin-react-hooks/7.1.1) |
| `globals` | `17.11.0` | 为 Web 与 Node 分别声明 globals，不给共享领域包混入 ambient 权限。[registry](https://registry.npmjs.org/globals/17.11.0) |
| `prettier` | `3.9.6` | Node engine `>=14`；只格式化 authored text，Rust 由 rustfmt 负责。[registry](https://registry.npmjs.org/prettier/3.9.6) |
| `@commitlint/cli` / `@commitlint/config-conventional` | `21.2.2` / `21.2.2` | 两者要求 Node `>=22.12.0`，Node 24.20.0 满足。[CLI](https://registry.npmjs.org/@commitlint/cli/21.2.2) · [config](https://registry.npmjs.org/@commitlint/config-conventional/21.2.2) |
| `stylelint` / `stylelint-config-standard` | `17.14.1` / `40.0.0` | 两者要求 Node `>=20.19.0`；standard peer 要求 Stylelint 17。[stylelint](https://registry.npmjs.org/stylelint/17.14.1) · [config](https://registry.npmjs.org/stylelint-config-standard/40.0.0) |
| `husky` | `9.1.7` | Node engine `>=18`；只负责安装/调度 hooks，不拥有质量规则。[registry](https://registry.npmjs.org/husky/9.1.7) |
| `lint-staged` | `17.4.1` | Node engine `>=22.22.1`，Node 24.20.0 满足。[registry](https://registry.npmjs.org/lint-staged/17.4.1) |
| EditorConfig | root `.editorconfig` | 非 npm runtime；提交 `root=true`、UTF-8、LF、final newline、空格/制表符与 Markdown 例外，最终格式仍由 Prettier/rustfmt 判定。[spec](https://spec.editorconfig.org/) |

为适配 TypeScript 6 默认 `types: []`，骨架同时精确锁定 `@types/node@24.13.3`、`@types/react@19.2.18`、`@types/react-dom@19.2.5`，并由每个 tsconfig 显式列出允许的 ambient types。

`eslint-plugin-import-x@4.17.1` 曾在候选工具探针中通过版本检查，但不进入最终基线：目录依赖边由 `workspace-policy.mjs` 生成的 ESLint core `no-restricted-imports` 与边界 fixture 共同执行。这样减少一个带原生 lifecycle build 的传递依赖面，也不会削弱 Structural Seed 的允许边权威。

工程运行时同时精确锁定 `node@24.20.0`、`pnpm@11.24.0` 与 `rust-toolchain.toml` 中的 Rust `1.98.0`；pnpm 配置要求 `strictDepBuilds: true`、逐包 `allowBuilds`。安装后实际 blocked package 集必须与审查为 `false` 的 lockfile-resolved 集精确相等，缺失决策、placeholder 或额外阻断均失败；不能把空集误作唯一合法结果。Rust profile 固定为 `minimal` 并安装 `rustfmt`、`clippy`。这些不是 npm devDependency，但属于同一可重现骨架。

## Tailwind Web 适配

Stylelint 只作用于 `apps/web/**/*.{css,pcss}`。配置保留未知 at-rule 检查，仅为 Tailwind v4 官方 `@theme`、`@source`、`@utility`、`@variant`、`@custom-variant`、`@apply`、`@reference`、`@config`、`@plugin` 与 package `@import` 处理已知语法冲突；同时精确关闭 standard 与 Tailwind/shadcn 源格式冲突的 `import-notation`、`lightness-notation`、`hue-degree-notation`、custom-property/selector pattern 及相应 empty-line 规则，并固定 long hex。例外不扩散到 Node、Rust 或任意 CSS 目录。[Tailwind directives](https://tailwindcss.com/docs/functions-and-directives)

## 运行验证

在隔离目录安装上述精确 lint/format/commit 工具后，以下命令均以 exit 0 完成：

```text
eslint src --max-warnings 0
prettier --check ...
stylelint "src/**/*.css" --max-warnings 0
printf 'docs: define exact engineering gate\n' | commitlint
```

探针覆盖 TypeScript/TSX、React Hooks flat config、type-aware `typescript-eslint`、Tailwind v4 at-rules、Prettier 与 Conventional Commits。首个简化 Tailwind fixture 通过；Reviewer Gate 随后用更接近 shadcn globals 的 decimal OKLCH、全部官方 directives 与 package import 找到了 standard 默认规则冲突，因此 AD-32 改为要求提交固定的 `tools/quality/fixtures/tailwind-v4.css`，不能从简化探针外推。按 AD-32 最终精确例外重跑该代表性 fixture 后，Prettier check 与 Stylelint 17.14.1 均 exit 0，且未知 at-rule 规则仍保持启用。

实际仓库尚无应用骨架，因此 lockfile、最终 Tailwind fixture、pnpm lifecycle approvals、Cargo 工具和 CI/repository rules 必须由首次 `bmad-build` 按 AD-32 落地并再次验收；本证据只证明版本选择与候选配置可行，不冒充配置已实现或 CI 已部署。
