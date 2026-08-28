---
title: 'Story 1.1：建立锁定的 S0-V 项目骨架与阶段壳'
type: 'feature'
created: '2026-08-28'
status: 'done'
review_loop_iteration: 0
baseline_commit: 'b065cf22fa17d6949f5bb16d268838edd02fbf49'
context:
  - '_bmad-output/implementation-artifacts/sprint-status.yaml'
  - '_bmad-output/planning-artifacts/epics.md'
  - '_bmad-output/specs/spec-tickdeck/SPEC.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** 仓库尚无可重复构建的应用骨架，后续 S0-V 实验缺少受阶段约束、可审计的共同运行底座。

**Approach:** 落地 AD-32 pnpm/Cargo 合同、base-vega Web 基线和 Fastify/Worker 同源纵切；只投影本 Story 壳层。

## Boundaries & Constraints

**Always:** 以 planning contract、Story 1.1、SPEC 及 companions 为权威；锁定版本/lockfile、16 member、两个 crate 和一个 WIT seed；Fastify 是控制面权威；slice 共享 catalog digest；外部状态单独取证。

**Ask First:** 修改权威合同、仓库可见性/付费计划、版本/质量/NFR，或引入范围外 runtime/capability。

**Never:** 实现筛选、Agent、沙箱、图表、提醒、组合、扩展或未来导航；创建领域表、伪实体、第二前端、跨主机服务；安装后续 runtime；冒充 SM-00、OQ-06、branch rules 或后续 Gate。

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|---|---|---|---|
| 启动 | 锁定依赖与本地 Worker | 同源 SPA/版本化 health/manifest；认证 Worker 无业务 handler | 协议、凭据或 digest 不符即 fail closed |
| 阶段投影 | canonical catalog | 仅 App Shell、运行与健康、Theme Control；三 slice/release digest 一致 | 额外、缺失或漂移使构建失败 |
| 安装/生成 | 干净 checkout | frozen/locked 安装；空 generated registry 可重建校验 | lock、build policy、path/byte 漂移即失败 |

</frozen-after-approval>

## Code Map

- `_bmad-output/planning-artifacts/epics.md:464` -- Story 1.1 与 12 项 AC；只读。
- `_bmad-output/specs/spec-tickdeck/SPEC.md` 及 companions -- 完整阶段、UX、架构合同；只读。
- 根 manifests、lockfiles、tsconfig 与质量配置 -- 待建工程权威。
- `apps/*`、`packages/*`、`tools/component-compiler`、`crates/*`、`wit/*` -- 精确 workspace 与结构种子。
- `tools/quality/*` -- member/边/profile/build/generated/capability validators。
- `apps/{web,server,worker}`、`packages/contracts` -- 最小同源运行纵切。
- `.github/workflows/quality.yml`、根质量配置、`.husky/*` -- 单一质量权威与五个独立 CI contexts。

## Tasks & Acceptance

**Execution:**
- [x] `package.json`、`pnpm-workspace.yaml`、`Cargo.toml`、`apps/*`、`packages/*`、`crates/*`、`wit/*` -- 固定 AD-32 版本并建立无产品能力的结构。
- [x] `tools/quality/*`、根质量配置、各 `tsconfig*.json` -- 覆盖 typed edge/profile、leaf、build policy 与漂移。
- [x] `apps/web`、`tools/quality/starter-evidence/*` -- 运行固定 base-vega starter 并提交来源 digest。
- [x] `packages/contracts`、`apps/{server,worker,web}`、`.github/workflows/quality.yml` -- 实现同源壳、测试、CI 与状态同步。

**Acceptance Criteria:**
- Given 空仓库，when 安装，then 16 member、Rust/WIT seed、精确版本和双 lockfile 均 frozen/locked。
- Given lifecycle 依赖，when 校验，then 每项 `allowBuilds` 已裁决，ignored 与 `false` 集精确相等。
- Given workspace，when policy 运行，then四类 edge、五类 TS profile、ambient/exports 边界及 fixtures 全通过。
- Given authored 文件，when lint/format/hooks 运行，then唯一根规则覆盖全部范围、Tailwind fixture 与 Rust 单次 fmt。
- Given generated/Rust 检查，when重建/编译，then空 registry、exact bytes、fmt/clippy/check/build 全绿。
- Given Web 初始化，when审计，then固定 base-vega 命令、preset/源码/逐项 digest 可复核，无平行 primitive。
- Given dev/prod 启动，when访问，then Fastify 同源 SPA/health/manifest 与认证 Worker 健康可用，冷启动不超 30 秒。
- Given S0-V release，when投影 catalog，then仅三项壳层存在，三 slice/release digest 一致且漂移失败。
- Given键盘、读屏和主题，when操作，then light/dark/system、语义焦点、2px/2px/3:1、三语言合同成立。
- Given骨架源码，when静态审计，then core/状态权威隔离，无领域表、权威浏览器存储、遥测或官方回连。
- Given根脚本/CI，when执行，then所有 leaf 真实覆盖，lint/format-check/typecheck/build/test 为独立 context；外部 required rules 单独取证。
- Given干净 checkout，when完整验证，then frozen install、dependencies、lint、format、typecheck、build、unit/component/真实浏览器 test 全绿且不冒充后续 Gate。

## Spec Change Log

## Design Notes

Structural Seed 不注册 capability。2026-08-28 已以 Node 24.20.0、pnpm 11.24.0、Rust 1.98.0 精确工具链完成本地验证；仓库 `Morilence/TickDeck` 为 Public，ruleset `21725853` 已 active，要求 `lint`、`format-check`、`typecheck`、`build`、`test` 五个 exact contexts。只读证据归档于 `tools/quality/external-evidence/github-ruleset.json`，规则体 domain-separated digest 为 `sha256:f5487c16e9b5b3d79046bd57924e1238e0a957b5df7d1070511893da5bacf450`；live 状态仍须由根级 `gh` 独立复核，不由离线 validator 冒充。OQ-06 与后续 Gate 仍未关闭，不得扩大 S0-V。

pnpm 默认 24 小时 release-age 策略保持启用；经用户精确授权，仅以 `minimumReleaseAgeExclude` 放行 `@testing-library/react@16.3.3`，validator 拒绝删除、泛化或追加例外。Type-aware `eslint .` 仅扫描 71 个 authored files，不进入 `node_modules`、`dist`、`build`、`target` 或 `coverage`；4 GiB heap 下峰值 RSS 为 2,669,112 KiB，因此内存上调对应真实 lint 工作集。Worker credential 仅通过 stdin/inherited pipe 单次传入，不进入环境变量。

无 PR 交付仍保留五项线上 checks：Husky 当前仅有 `pre-commit` 与 `commit-msg`，lint-staged 只覆盖暂存文件，不能替代远端全仓、不可绕过的验证。workflow 的 push 触发范围机械锁定为 `main` 与 `codex/**`；提交先在受控分支取得五项成功状态，再以同一 SHA 更新 `main`。

## Verification

**Commands:**
- `pnpm install --frozen-lockfile && pnpm dependencies:check` -- lock 与 lifecycle policy 精确通过。
- `pnpm lint && pnpm format:check && pnpm typecheck && pnpm build && pnpm test` -- 根质量合同及真实浏览器 smoke 全绿。
- `cargo fmt --all --check && cargo clippy --workspace --all-targets --all-features --locked -- -D warnings && cargo check --workspace --all-targets --all-features --locked && cargo build --workspace --all-targets --all-features --locked` -- Rust 1.98.0 全绿。
- `git diff --check` -- 无 whitespace 错误；逐 AC evidence 与范围扫描无遗漏。

**Manual checks (if no CLI):**
- API/CLI 核对 required contexts；无权限时保留失败证据，不声称 AC 11 完成。

## Suggested Review Order

**工程合同与阶段投影**

- 从唯一 policy 查看 16 members、typed edges 与 profile。
  [`workspace-policy.mjs:20`](../../tools/quality/workspace-policy.mjs#L20)

- 三个 slice 共享 catalog digest，并限制为 S0-V 壳层。
  [`index.ts:47`](../../packages/contracts/src/index.ts#L47)

- 构建产物再次拒绝 testkit 与范围外 capability。
  [`build-projection-check.mjs:29`](../../tools/quality/build-projection-check.mjs#L29)

**同源运行与秘密边界**

- Fastify 统一承载 SPA、health 与 capability manifest。
  [`server/index.ts:117`](../../apps/server/src/index.ts#L117)

- Worker 只暴露认证握手，不注册业务 handler。
  [`worker/index.ts:59`](../../apps/worker/src/index.ts#L59)

- credential 经 inherited pipe 注入，避免环境变量泄漏。
  [`start-stack.mjs:47`](../../tools/quality/start-stack.mjs#L47)

**用户可见壳层**

- App Shell 仅呈现运行健康、主题控制与当前阶段。
  [`App.tsx:81`](../../apps/web/src/App.tsx#L81)

- Chromium 验证同源纵切、键盘主题和未来导航缺席。
  [`shell.spec.ts:75`](../../apps/web/tests/shell.spec.ts#L75)

**质量与供应链护栏**

- 根 workflow 提供五个独立、全 SHA 固定的 contexts。
  [`quality.yml:1`](../../.github/workflows/quality.yml#L1)

- starter 命令、原始源码和逐项 digest 均机械复核。
  [`workspace-check.mjs:354`](../../tools/quality/workspace-check.mjs#L354)

- release-age 例外删除、泛化或扩张都会失败。
  [`validator-negative-tests.mjs:142`](../../tools/quality/validator-negative-tests.mjs#L142)

- 4 GiB lint heap 与唯一精确例外集中锁定。
  [`pnpm-workspace.yaml:9`](../../pnpm-workspace.yaml#L9)

- 外部 ruleset 证据与五个 required contexts 可复核。
  [`github-ruleset.json:9`](../../tools/quality/external-evidence/github-ruleset.json#L9)
