---
name: TickDeck architecture downstream update checklist
status: final
updated: '2026-08-28'
source: './ARCHITECTURE-SPINE.md'
---

# 下游产物更新清单

本清单只描述后续重新派生/校正工作。本次架构更新没有修改 `SPEC.md`、`contract-index.md`、`validate-spec.mjs`、`epics.md` 或 `sprint-status.yaml`。

## 1. `bmad-spec` — 先采用更新后的架构 companion

输入以当前 `ARCHITECTURE-SPINE.md` 及三份 `review-update-*-final.md` 为准，并保持 AD-1–AD-31 编号不变、新增 AD-32。

- 在 `SPEC.md` 将承重架构范围由 AD-1–AD-31 更新为 AD-1–AD-32，并采用 TypeScript 6.0.3、根级工程质量合同、canonical ignores、workspace coverage validator、generated manifests、Rust toolchain 与四项 CI Gate。
- 在 `contract-index.md` 更新 architecture digest、AD 覆盖范围、Coherence/Preservation 证据及 Story 1.1 的工程落点；把旧 TypeScript 7 评审标记为历史、被本次 6.0.3 证据取代。
- 更新 spec memlog 中的 companion digest 与 AD-32 constraint；保留历史 append-only 记录，不重写旧决策。
- 检查 `validate-spec.mjs` 是否仍把允许 AD 上限固定为 31；若是，提升到 32，并让验证器确认 AD-32、TypeScript 6.0.3 与 companion digest 已保留。
- 不改变 CAP-1–CAP-11、产品范围、S0-V→S5 顺序、SM/A/OQ 状态或任何 capability authorization。

## 2. `bmad-create-epics-and-stories` — 重新派生 Story 1.1

只在新的 SPEC/contract index 通过 preservation 后执行。

- 在 architecture requirements 增加稳定 `AR-AD-32`，并让 `AR-STACK-01` 明确 TypeScript 6.0.3 及 AD-32 的 exact tooling pins。
- Story 1.1 的“对应需求/架构约束”增加 AD-32；保持它仍是唯一当前可执行 Story，且只构建 S0-V 最小壳。
- Story 1.1 AC 增加：根配置文件、精确 devDependency 与 lockfile、pnpm `allowBuilds` 的逐包决策及 blocked 集精确比较、16 个 S0-V workspace member、非 workspace 的 `tools/quality`、typed runtime/type-only/build/test dependency edges、穷举的 Web/Node-runtime/neutral/config/test tsconfig profile、workspace-policy/check、canonical ignores、Husky hooks、lint-staged 路径规范化与 Rust filename-free task、Web-only Stylelint 及固定 Tailwind fixture、generated manifests/bytes check、`rust-toolchain.toml`、Rust fmt/clippy/check/build，以及 `lint`/`format-check`/`typecheck`/`build` 四个 CI required checks。
- 将 AC 7 的泛化“TypeScript 构建”校正为 AD-32 根脚本与 frozen/locked 安装；把 unit/component/真实浏览器 smoke 的 `test` check 设为 Story 1.1 required，并以平台 API/CLI 归档 branch rules 证据。仍保留 S0-V capability absence、a11y、无外部云依赖等既有验收。
- 不给 Story 1.1 安装尚未实际使用的 Monaco、Mastra、Wasmtime、连接器、通知或组合 runtime；工程工具不是产品 capability。
- Story 2.9/5.2 继续受 OQ-06 与 S3 Gate 约束：TypeScript 6.0.3 的应用编译兼容性不能冒充 TypeScript→Component 工具链已锁定。

## 3. `bmad-sprint-planning` — 最后刷新计划权威

只在 SPEC 与 `epics.md` 更新并通过各自验证后执行。

- 重算 `planning_contract.authority.epic_file_sha256` 及由 workflow 管理的 source/companion hashes 和时间字段。
- 重新运行 readiness/consistency 检查，使 Story 1.1 继承 AD-32 与新的工程 AC。
- 保持 `current_stage: S0-V`、`current_executable_scope: ["1.1"]`、`executable_story_count: 1`、Story 1.1 `ready-for-dev`；Story 1.2 及其后仍按现有 blockers 关闭。
- 不把本次架构 PASS 解释成 SM-00、真实数据、模型、OQ-06、Vault、五平台 release 或任何 S1–S5 Gate 已通过。

## 当前只读基线（本次结束时须仍匹配）

| File | SHA-256 before architecture update |
| --- | --- |
| `_bmad-output/specs/spec-tickdeck/SPEC.md` | `e7cbae53b269bf21d72bf9bd1c994eb20ccb0af68bcc551fe9eea10f57f3a8f5` |
| `_bmad-output/planning-artifacts/epics.md` | `f6089c6174aca2a7e977f3b348c78f0182bc2decca6bb0b8679c61c2f4ba6d97` |
| `_bmad-output/implementation-artifacts/sprint-status.yaml` | `e9c7b2f96dd57726c36da8cf522c44ea5d9c60e53bb56badd8ab6270a46776da` |

执行顺序不可交换：`bmad-spec` → `bmad-create-epics-and-stories` → `bmad-sprint-planning` → 首次 `bmad-build`。
