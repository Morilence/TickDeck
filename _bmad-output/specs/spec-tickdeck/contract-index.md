# TickDeck Contract Index

本文件是 SPEC 派生的承重导航，不替代、重写或扩张 adopted companions。稳定 ID、阈值、Stop/Narrow、状态转换、视觉 token、技术版本和验收样例均以对应 companion 原文为准。

## Authority and reading rule

- `SPEC.md` 提供 Why、CAP-1–CAP-11、核心约束、非目标、成功信号、假设与开放项。
- `prd.md` 保留完整产品范围、UJ、词汇表、S0-V–S5、FR-001–FR-100、NFR-001–NFR-040、活跃 SM/SM-C、风险、resolved OQ-01/OQ-02、active OQ-03–OQ-06、活跃 A-01/A-02/A-05，以及 retired A-03/A-04/OQ-07/SM-09 记录。
- `addendum.md` 保留给定技术/交付约束、证据边界、数据厂商现实、Agent/沙箱/模型/扩展/访问/生命周期方案边界及延期方向。
- `DESIGN.md` 保留完整视觉系统、token、组件合同、阶段标记、mock 使用边界和 do/don't。
- `EXPERIENCE.md` 保留完整 IA、阶段 UX、表面闭合、组件/状态/交互合同、Risk Gate 状态机、数据与运行清单、平台/无障碍、文案和关键旅程。
- `ARCHITECTURE-SPINE.md` 保留架构图、AD-1–AD-32、状态机、一致性约定、精确 stack、结构种子和 Capability→Architecture Map；其 frontmatter 中列出的 companions 保留本次架构一致性、工具版本、TypeScript 6.0.3 与下游更新证据。
- `OQ-06` 的原始技术选择已由后续定稿的 AD-12 确定；compiler/componentizer/source-map 锁定及五平台 FR-095/NFR-037 证据仍是沙箱能力注册的阻塞项。此收敛不关闭其他 OQ，也不授权提前开放 S0 或后续阶段能力。

## Frozen source snapshot

| Adopted companion | SHA-256 |
|---|---|
| `prd.md` | `975b144ed0bebc5e78de491d385bed38bf426d27fb7c5cd0dc5a25de1a07e157` |
| `addendum.md` | `72dbe73764c4933bbe8d8c308c2fd9b5eadba4c63c4ec89dad6df5aeb0651373` |
| `DESIGN.md` | `9a2b4f59575c3f845e475cd6929507d24ff39bc79e51aef3fc8ab21a295e65d9` |
| `EXPERIENCE.md` | `58229e4f36ba8dbe8e4b8d1c60e8fee4d7be85074ed457721a8023c3d8e13f81` |
| `ARCHITECTURE-SPINE.md` | `2564bbbf4a112e633f75b42b623af99ad1e9646779336f5e69c2a5454c944079` |

源文件变化后必须由 `bmad-spec` 重新派生本文件和 `SPEC.md`；手改派生产物不受支持。

### Architecture update evidence snapshot

这些文件是 `ARCHITECTURE-SPINE.md` 自有的更新证据和下游路由，不提升为 SPEC 顶层 companion，也不替代架构正文；其 load-bearing 结论已投影到本 SPEC。

| Architecture-owned file | SHA-256 |
|---|---|
| `review-update-architecture-consistency-final.md` | `fb4bb8db39a2c55f20732d7e0009c094c91b4d62ac10183f4c3f428d3c15bb27` |
| `review-update-tool-versions-final.md` | `96f4f91ba54e020be01c9e4430ecdf3e905c79d6a3d04aaed15265fe78f0b55c` |
| `review-update-typescript-6.0.3-final.md` | `4778a741c2fffee257df3ad846d465c27551c3a5f3fdddccf92589e994e29057` |
| `DOWNSTREAM-UPDATE-CHECKLIST.md` | `4812279665443f11c3ff3b7a822579a2e04b482ddb7fe185c358fd96367bc647` |

## Validation record

- **Coherence — PASS (2026-08-28):** kernel capability pairs、阶段依赖、assumption/OQ 状态、免费源默认、B/S/桌面双入口、S0 能力上限与 AD-32 工程合同一致；CAP-1–CAP-11、产品范围和 capability authorization 未变化。
- **Preservation — PASS (2026-08-28):** 五个 adopted source digest 与四个架构更新证据 digest 全部匹配；FR-001–FR-100、NFR-001–NFR-040、AD-1–AD-32、S0-V–S5、SM/SM-C、A/OQ 历史、范围排除与 UX 合同均有保留落点。
- **Reviewer Gate — PASS (2026-08-28):** 三份架构更新证据均为 final PASS；本次 SPEC/contract-index/validator 的 adversarial、edge-case、verification-gap、structure 与 prose findings 已逐项关闭或按稳定 capability/非本次范围保留。该结论只证明当前架构与规格基线，应用骨架、hooks、lockfile、CI、branch rules、Rust workspace、OQ-06 及任何 S1–S5 capability 仍为 **IMPLEMENTATION DEFERRED**。
- 可用 `node validate-spec.mjs coherence`、`node validate-spec.mjs preservation` 与 `node validate-spec.mjs reviewer-gate` 重跑；每轮输出均绑定当前 `SPEC.md`、`contract-index.md` 与验证器摘要。本次范围检查另行确认 `stories.yaml` 不存在；未来合法的 Story Breakdown 不影响 SPEC 三轮验证。

## Capability traceability

| CAP | Product contract（direct + cross-cutting） | Qualification / quality contract | Primary companion landing |
|---|---|---|---|
| CAP-1 | FR-001–FR-007、FR-084–FR-087 | SM-10、NFR-031–NFR-032 | PRD §6.4, §7.1, §7.13；AD-7, AD-9, AD-24, AD-28, AD-31 |
| CAP-2 | FR-008–FR-014 | SM-11、NFR-003–NFR-004、NFR-021–NFR-023 | PRD §6.5/§7.2；DESIGN/EXPERIENCE；AD-13, AD-15–AD-17, AD-31 |
| CAP-3 | FR-015–FR-024 | SM-02、SM-04 | PRD §7.3–§7.4；EXPERIENCE UJ-1；AD-13–AD-17, AD-28, AD-31 |
| CAP-4 | FR-025–FR-028 | SM-16、NFR-009、NFR-017、NFR-036 | PRD §7.5；EXPERIENCE notifications；AD-4, AD-26, AD-29, AD-31 |
| CAP-5 | FR-029–FR-043、FR-094–FR-095 | SM-03、SM-05、SM-07、SM-11、NFR-007、NFR-016、NFR-037 | PRD §7.6–§7.7；EXPERIENCE strategy；AD-12, AD-16, AD-23, AD-31 |
| CAP-6 | FR-044–FR-051、FR-093 | SM-12、SM-16、NFR-036 | PRD §7.8；EXPERIENCE Risk Gate；AD-4–AD-5, AD-23, AD-28, AD-31 |
| CAP-7 | FR-052–FR-064、FR-091–FR-094 | SM-00、SM-04、SM-06、SM-17、NFR-035–NFR-036 | PRD §7.9/§7.13；EXPERIENCE Agent/Risk；AD-2–AD-8, AD-14, AD-31 |
| CAP-8 | FR-065–FR-069 | SM-01R、SM-17 | PRD §7.10；addendum 模型接入；AD-9, AD-14, AD-29, AD-31 |
| CAP-9 | FR-070–FR-076、FR-088–FR-090、FR-096 | SM-01、SM-01R、SM-13、SM-14、NFR-010–NFR-015、NFR-022、NFR-033–NFR-034、NFR-038 | PRD §7.11/§7.13；EXPERIENCE UJ-3；AD-6, AD-8, AD-10–AD-11, AD-18, AD-25, AD-30 |
| CAP-10 | FR-077–FR-083、FR-097、FR-099 | SM-15、NFR-026–NFR-028、NFR-039–NFR-040；不使用外部贡献人数指标 | PRD §7.12/§7.13；EXPERIENCE UJ-4；AD-2, AD-8–AD-9, AD-12, AD-18, AD-21–AD-22 |
| CAP-11 | FR-098、FR-100 | S0-V–S5、全部适用 SM/SM-C 与 NFR | PRD §6.6/§10；EXPERIENCE 阶段合同；AD-2, AD-18, AD-20–AD-21 |

FR-093、FR-094 与 FR-095 是跨切面 requirement：它们分别由 CAP-6 的 SM-12/SM-16、CAP-5 的 SM-03/SM-05/SM-07/SM-11，以及 CAP-7 的相关 success measures 关闭。此处显式列出不会改变 CAP-1–CAP-11 的稳定 intent/success。

## S0-V engineering-quality and epics handoff

AD-32 是 Story 1.1 的跨切面架构要求，不是 CAP-12，也不改变 CAP-1–CAP-11 或 S0-V→S5 的注册上限。

| Downstream change | Binding handoff |
|---|---|
| Architecture requirements | 新增稳定 `AR-AD-32`；更新 `AR-STACK-01`，精确继承 Architecture Stack 与 review 中的 Node.js 24.20.0、pnpm 11.24.0、TypeScript 6.0.3、Rust 1.98.0 及全部工程工具 pin。旧 TypeScript 7.0.2/“TS7-compatible”证据已 superseded。 |
| Executable story scope | Story 1.1 仍是唯一当前可执行 Story，只建立 S0-V 最小壳并把“对应需求/架构约束”增加 AD-32；所有后续 Story 保持现有 blocker，不得借工程工具提前注册产品 capability。 |
| Workspace and locked install | 根配置、精确 devDependencies、`pnpm-lock.yaml`、`Cargo.lock`、`pnpm install --frozen-lockfile`、Cargo `--locked`、逐包 `allowBuilds` 与实际 blocked 集精确比较全部进入 AC。16 个直接 pnpm member 必须逐项为 `apps/web`、`apps/desktop`、`apps/server`、`apps/worker`、`packages/contracts`、`packages/core`、`packages/policies`、`packages/storage-sqlite`、`packages/artifact-fs`、`packages/connectors-core`、`packages/connectors-official`、`packages/models`、`packages/notifications`、`packages/agent-mastra`、`packages/testkit`、`tools/component-compiler`；`tools/quality` 必须没有 `package.json`。 |
| Dependency edges and TypeScript profiles | AD-32 的 runtime、type-only、build/codegen、test/dev 初始边矩阵必须原样投影到 package manifest、source surface 与正反 fixture；Web、node-runtime、neutral-shared、node-config-only、test-overlay 五个 profile 的目录、target/lib/module/rootDir/types 与生产/测试 ambient 隔离不得合并或省略。 |
| Root quality authority | 根级 ESLint、Prettier、Web-only Stylelint、Commitlint、Husky、lint-staged、EditorConfig、rustfmt/Clippy 是唯一规则源。AC 必须覆盖 canonical ignores、Husky 命令、lint-staged repository-relative POSIX 路径与 filename-free Rust task、shadcn 源码 lint/format，以及固定 Tailwind v4 fixture。 |
| Validators, generated content and Rust | `workspace-check.mjs` 验证 member/profile/leaf script/edge coverage；`dependency-build-check.mjs` 精确比较 reviewed `allowBuilds: false` 与 pnpm blocked 集；`generated-check.mjs` 按 manifest 在干净目录比较 exact paths + bytes。提交 `rust-toolchain.toml`，固定 Rust 1.98.0、rustfmt、Clippy、check 与 build。 |
| CI and external evidence | CI 显式 `HUSKY=0`，以 locked install 和 `dependencies:check` 为前置；`lint`、`format-check`、`typecheck`、`build` 是四个独立 required contexts，Story 1.1 另要求 unit/component/真实浏览器 smoke 的 `test`。首次 merge 前以平台 API/CLI 归档日期、repository、ruleset ID/digest 与查询结果，不能从 workflow 文件推断 branch rules 已启用。 |
| Deferred runtime boundary | 不为 Story 1.1 安装尚未使用的 Monaco、Mastra、Wasmtime、连接器、通知或组合 runtime；保留 S0-V capability absence、a11y 与无外部云依赖验收。Story 2.9/5.2 继续受 OQ-06 与 S3 Gate 阻塞；TypeScript 6.0.3 编译探针不证明 TypeScript→Component、componentizer、source-map、WIT/WASI 或五平台沙箱证据完成。 |

## Stage Gate matrix

| Stage | Registration ceiling | Go | Stop / Narrow |
|---|---|---|---|
| S0-V | 一条合法真实数据路径、只读筛选、受限 R0 Agent、固定任务对照；不建设沙箱、提醒或组合。 | SM-00 全部通过。 | 未改善时间、漏错和复用即停止全工具 Agent thesis，不进入平台化建设。 |
| S0 | 演示数据、统一工具/数据契约、Run Manifest、风险策略、沙箱、单工作区访问边界及只承载当前阶段能力的 B/S/桌面双入口壳。 | 契约、权限、双入口等价性、沙箱和恢复基准通过。 | 无法形成安全且可复现的共同运行时即停止全工具 Agent。 |
| S1 | 一条 A 股及一条港股真实路径，完成“打开图表→筛选→证据结果”。 | PRD §6.4 能力画像与许可记录通过。 | 任一市场无合法可用路径即不得承诺 A/港股 v1.0。 |
| S2 | 双市场规范化条件树、证据产物、保存与复跑；单 Agent 只能编排 `stage <= S2` 的工具。 | SM-02、SM-04、SM-10 通过。 | 语义或数据资格不稳定则维持实验，不扩张策略能力。 |
| S3 | TypeScript 策略、沙箱回测、偏差矩阵与语义基准。 | SM-03、SM-05、SM-07、SM-11 通过。 | 只能编译而不能通过行为基准即停止自动策略生成。 |
| S4 | 提醒、组合、模拟订单、审计与数据生命周期。 | SM-06、SM-12–SM-14、SM-16 通过。 | 不能证明副作用一致性和市场规则正确即不启用 Agent 模拟交易。 |
| S5 | PRD 的八组产品功能范围（映射到 CAP-1–CAP-11）、Parity Rubric、双语、可访问性、备份、扩展与治理。 | 全部 v1.0 SM/NFR 通过。 | 未通过项保持 beta，不以 v1.0 发布。 |

Gate Registry 必须把该矩阵作为带 source digest 的不可变规范输入。Capability Manifest 中不存在的能力不得注册；`locked` / `suspended` 只在运行时和健康诊断中出现，不能表现为 disabled menu、lock teaser 或 placeholder page。

## Assumption closure index

| ID | Interactive confirmation | Closure evidence | Failure action |
|---|---|---|---|
| A-01 | 2026-08-28 已确认保留为待证；尚未验证 | SM-00 全部通过。 | 收窄为辅助 Agent，或停止核心竞争力主张。 |
| A-02 | 2026-08-28 已确认保留为待证；尚未验证 | 至少 12 名合格 alpha 用户，且 SM-01R 与 SM-00 同时通过。 | 收窄 ICP、提供更薄部署形态，或停止公开采用目标。 |
| A-05 | 2026-08-28 已确认保留为待证；尚未验证 | SM-02、SM-11 与 SM-00 的迁移/复用证据通过。 | 修订 Parity Rubric，或收窄“可比肩”表述。 |

**Retired A-03（2026-08-28）：** 用户否决其作为待证假设，ID 不复用。替代决策为合法免费数据源默认优先，商用源只由部署者主动选配；该决策不降低 §6.4、SM-10 或阶段 Gate。

**Retired A-04 / SM-09（2026-08-28）：** 用户否决以社区自然增长作为待证假设或成功指标，两个 ID 均不复用。Apache-2.0、贡献脚手架、无商用数据开发环境、四类扩展、SM-15、明确维护责任和发布/安全演练继续有效。

## Open-question and revisit index

| Item | Owner / close gate | Current contract state |
|---|---|---|
| OQ-01 演示数据来源与许可 | **Resolved 2026-08-28** | 官方 demo 只使用固定版本、固定种子的确定性合成数据，不打包第三方真实历史行情；覆盖 A/港股关键市场语义和异常数据状态，标记 `demo/non-current`，永不替代真实资格。 |
| OQ-02 Alpha 用户与冻结基线 | **Resolved 2026-08-28** | 协议固定为至少 12 名合格用户、覆盖 A/港股合法数据使用者、每人至少两次同类真实任务并分别使用两套工具，且任务/oracle/盲审/基线预先冻结；实际招募与有效证据仍阻塞 S2。 |
| OQ-03 首批免费 A/港股连接器 | **Confirmed open 2026-08-28**；项目维护者；S1 前 | 等待独立资格调研；调研完成前继续阻塞 S1。默认选择并验证合法免费路径。免费路径不合格时收窄相应市场或保持 beta，不得静默改用商用源；部署者可主动选配经同等验证的商用连接器。 |
| OQ-04 公共发布法律文本 | **Confirmed open 2026-08-28**；项目维护者；公开 beta 前 | 待实际免费数据源及外部模型/通知路径确定后，核对数据许可、第三方内容、免责声明与隐私说明；不阻塞当前设计和早期验证，现有文档不构成法律意见。 |
| OQ-05 性能参考环境 | **Confirmed open 2026-08-28**；工程与 QA；首轮 alpha 后 | 首轮 alpha 前当前目标不变；实测后只有在保留原目标、环境、原始结果、理由和新目标时才可调整 NFR-001–NFR-006，禁止为测试变绿而静默降标。 |
| OQ-06 实施证据余项 | **Confirmed open 2026-08-28**；架构与安全；沙箱能力注册前 | AD-12 已拍板平台/隔离/终止；S0 仍须锁定精确 compiler/componentizer/source-map 与 WIT/WASI 版本、证明确定性输出，并在五平台通过 FR-095/NFR-037；证据通过前不得注册或宣称沙箱能力可用。 |
| OQ-07 备份维护者 | **Retired 2026-08-28** | 用户确认不要求强制备份维护者，ID 不复用；至少一名明确项目维护者及发布/安全响应演练要求继续有效。 |
| 五平台最低 OS/libc/system WebView | **Confirmed open 2026-08-28**；S0 release spike | 把五个平台的实际 B/S archive、桌面 envelope、安装/启动/升级/回滚和 CI 证据分别写入对应的固定 profile；未经证据不得宣称支持，也不得删减或静默降级。 |
| Vault 加密/KDF/headless 格式 | **Confirmed open 2026-08-28**；S0 安全设计评审 | 锁定精确算法、库版本、KDF、轮换、迁移、headless secret-file 格式与权限规则；不得改变 AD-9 的独立 Vault、外部根密钥、SecretRef 与 `LOCKED`/fail-closed 边界，证据通过前不得宣称能力就绪。 |
| 权威十进制实现 | **Resolved 2026-08-28** | AD-31 锁定 `decimal.js` 10.6.0，由 `packages/core/finance-decimal` 独占封装；采用封闭 34 位值域、逐基础运算 `ROUND_HALF_EVEN` context rounding、独立版本化业务量化、lossless connector ingress、统一金融 envelope/SQLite sort key、沙箱 opaque resource 和非权威显示投影。binary float、SQLite REAL、图表坐标及格式化文本不得成为权威值；A/港股、多币种 oracle 与跨边界 conformance 仍是对应能力 Gate 的实现证据，不再是架构选择。 |
| 精确模型/通知/官方连接器清单 | **Confirmed open 2026-08-28**；各阶段资格与 Gate | 实际候选通过许可、manifest、版本、权限、来源、哈希与健康校验，并满足对应 Gate 后，方可逐项登记；模型以精确 `model + prompt + toolset` 组合为资格单位，免费 A/港股源仍由 OQ-03 单独关闭；接口或 adapter 存在不等于能力已授权。 |
| B/S + 桌面发布/bootstrap 机制 | **Resolved 2026-08-28** | 采用一个签名 product payload、两个入口：B/S 本地/远端 + Tauri 2 薄桌面壳；共用 Fastify SPA、product-supervisor、WorkspaceIdentity、Capability/Gate 和 durable UpgradeCoordinator。v1 只显式导入本地签名 release set，launcher/payload 分层更新但禁止混合版本；桌面壳无第二套业务逻辑或授权路径，五平台真实安装/回滚证据仍是发布 Gate。 |

## Preservation ledger

| Source claim group | Contract landing |
|---|---|
| PRD 当前决策状态、愿景、原则、用户与 UJ | `SPEC.md` Why/Constraints/CAP；PRD 原文 companion |
| PRD 词汇表、真实数据画像、Parity、策略偏差矩阵 | PRD 原文 companion；本文件 CAP/Stage 导航 |
| PRD S0-V–S5 Gate | `SPEC.md` Constraint/CAP-11；本文件 Stage Gate matrix；PRD 原文 companion |
| PRD FR-001–FR-100 | CAP-1–CAP-11 映射；PRD 原文 companion |
| PRD 数据、安全、成本和 NFR-001–NFR-040 | `SPEC.md` Constraints；CAP 映射；PRD 原文 companion |
| PRD SM-00、SM-01/01R、SM-02–SM-17、SM-C01–SM-C08 | `SPEC.md` Success signal；CAP/assumption 映射；PRD 原文 companion |
| PRD 风险、resolved OQ-01/OQ-02、active OQ-03–OQ-06、活跃 A-01/A-02/A-05 与 retired A-03/A-04/OQ-07/SM-09 | `SPEC.md` Assumptions/Open Questions/实验、数据与开源治理约束；本文件 closure/revisit index；PRD 原文 companion |
| Addendum 全部技术约束、证据边界与方案取舍 | addendum adopted companion；相关约束映射到 CAP 与 architecture |
| DESIGN 全部视觉 token、组件、阶段和 mock 边界 | DESIGN adopted companion；`SPEC.md` UX constraint |
| EXPERIENCE 全部 IA、组件、状态机、交互、证据、响应式、无障碍、文案和流程 | EXPERIENCE adopted companion；`SPEC.md` UX constraint |
| ARCHITECTURE-SPINE 图、AD-1–AD-32、状态机、约定、Stack、Structural Seed、Capability Map | ARCHITECTURE-SPINE adopted companion；`SPEC.md` architecture/engineering constraints；本文件 S0-V engineering-quality and epics handoff |
| 架构更新的 consistency/tool-version/TypeScript 6.0.3 证据与 downstream checklist | ARCHITECTURE-SPINE 自有 companions；本文件 evidence snapshot、Validation record 与 S0-V engineering-quality and epics handoff |

### Wrapper-only content

源文件 frontmatter、标题、读者导览和生成过程说明不重复进入 kernel；它们仍保留在 adopted companions 中用于审计。未丢弃任何 FR、NFR、Gate、SM/SM-C、A、OQ、非目标、UX 合同或 ADOPTED 架构决策。
