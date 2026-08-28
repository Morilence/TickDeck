---
id: SPEC-tickdeck
companions:
  - contract-index.md
  - ../../planning-artifacts/prds/prd-TickDeck-2026-08-27/prd.md
  - ../../planning-artifacts/prds/prd-TickDeck-2026-08-27/addendum.md
  - ../../planning-artifacts/ux-designs/ux-TickDeck-2026-08-27/DESIGN.md
  - ../../planning-artifacts/ux-designs/ux-TickDeck-2026-08-27/EXPERIENCE.md
  - ../../planning-artifacts/architecture/architecture-TickDeck-2026-08-27/ARCHITECTURE-SPINE.md
sources: []
---

> **Canonical contract.** 本 SPEC 与 `companions:` 中的文件共同构成完整、经 Preservation 校验的构建、测试与验收合同。任何下游工作都必须读取全部 companion；不得仅凭本 kernel 推断未获阶段授权的能力。

# TickDeck 正式规格

## Why

TickDeck 要让具备 A/港股研究经验、合法数据访问和自托管能力的进阶个人投资者，在自己掌控数据与模型的开源工作台中完成行情观察、选股研究、策略验证、提醒和模拟组合闭环，并让 Agent 把自然语言意图变成可审计、可复跑的确定性工具过程。该产品 thesis 尚未验证；先以 S0-V 廉价证伪，只有逐阶段 Gate 通过后才能扩展和发布 v1.0。

## Capabilities

- **CAP-1 — 数据与能力治理**
  - **intent:** 部署者可配置和替换数据连接器，系统仅按实际能力、许可与溯源为 A/港股任务供数。
  - **success:** FR-001–FR-007、FR-084–FR-087、SM-10、NFR-031–NFR-032 全部通过。
- **CAP-2 — 图表工作台**
  - **intent:** 用户可在统一工作台搜索、打开、检查、比较、绘制和保存 A/港股及基准行情上下文。
  - **success:** FR-008–FR-014、Parity 任务 1–5、SM-11 及关联性能与无障碍合同通过。
- **CAP-3 — 自选、筛选与研究证据**
  - **intent:** 用户可管理自选、组合筛选并审阅基本面、公司行动、公告新闻和逐项证据，允许零候选。
  - **success:** FR-015–FR-024、SM-02、SM-04 通过，且无静默补值、换源或许可绕过。
- **CAP-4 — 提醒与通知证据**
  - **intent:** 用户可创建和管理价格、指标、筛选与策略提醒，并分别追踪触发证据和通知投递。
  - **success:** FR-025–FR-028、SM-16 及 AD-26 状态合同通过。
- **CAP-5 — TypeScript 策略与可信回测**
  - **intent:** 用户和 Agent 可创作受限 TypeScript 指标或策略，并执行可复现、偏差可见的确定性回测。
  - **success:** FR-029–FR-043、SM-03、SM-05、SM-07、SM-11 通过。
- **CAP-6 — 模拟组合**
  - **intent:** 用户可在不连接券商的模拟组合中管理多币种现金、订单、成交、持仓、绩效与公司行动。
  - **success:** FR-044–FR-051、SM-12、SM-16 通过，且每笔 Agent 模拟订单均完成逐次确认。
- **CAP-7 — 可审计 Agent 与风险 Gate**
  - **intent:** Agent 可把自然语言目标编排为可审计、可取消和可恢复的产品工具运行，但权限、计算真值和投资决定均不由 Agent 掌握。
  - **success:** FR-052–FR-064、FR-091–FR-094、SM-00、SM-04、SM-06、SM-17 通过。
- **CAP-8 — 可替换模型与资格分级**
  - **intent:** 部署者可配置可替换模型端点，并按精确 `model + prompt + toolset` 资格决定可用 Agent 模式。
  - **success:** FR-065–FR-069、SM-01R、SM-17 通过，且不存在静默 provider 回退。
- **CAP-9 — 双入口自托管工作区生命周期**
  - **intent:** 部署者可通过桌面客户端、本地 B/S 或远端 B/S 运行能力等价且受保护的单工作区，并对其进行持久化、备份、恢复、迁移和诊断。
  - **success:** FR-070–FR-076、FR-088–FR-090、FR-096、SM-01、SM-01R、SM-13、SM-14 通过。
- **CAP-10 — 开源扩展与供应链治理**
  - **intent:** 贡献者可用演示路径开发四类受信扩展，部署者可核验其合同、来源、权限、SBOM、禁用与回滚。
  - **success:** FR-077–FR-083、FR-097、FR-099、SM-15、NFR-039–NFR-040 通过；不以外部贡献人数判定成功。
- **CAP-11 — 阶段与发布资格**
  - **intent:** 系统和发布流程只注册当前阶段已获证据授权的能力，并在 Stop/Narrow 条件发生时停止或收窄。
  - **success:** FR-098、FR-100、AD-2 的 Capability/Release Manifest 一致性及 S0-V→S5 全部 Gate 规则通过。

## Constraints

- 阶段顺序固定为 `S0-V → S0 → S1 → S2 → S3 → S4 → S5`；前一 Gate 未 Go 时，后续能力只能实验，不得注册、挂载 UI、展示 teaser 或进入 v1.0 承诺。
- 一等资产仅为沪深北 A 股和港交所股票；主要市场与行业指数只用于观察、比较和回测基准。
- 合法免费数据源是默认数据选项；商用或付费数据源仅为部署者主动配置的可选替代，不得默认优先。免费与付费真实路径都必须通过同一许可、能力、溯源和健康校验。
- 官方演示数据只使用固定版本、固定种子的确定性合成数据并标记 `demo/non-current`；不打包第三方真实历史行情，也不计入 SM-10 或真实数据 v1.0 Gate。
- Alpha 协议固定为至少 12 名合格用户且覆盖 A/港股合法数据使用者；每人至少完成两次同类真实选股任务，并分别使用现有工具链与 TickDeck；任务、oracle、盲审规则和基线必须预先冻结。协议已拍板，但有效招募与实验结果仍阻塞 S2。
- TickDeck 不提供市场数据、模型托管或投资建议；数据缺失、陈旧、未知、冲突、到期或不满足参考能力画像时必须显式降级或默认拒绝，且不能据此通过完整 v1.0 真实数据资格。
- 筛选、指标、收益、回测、组合和风险由确定性代码或工具计算；事实、计算、模型解释和未知必须分区呈现。
- `ARCHITECTURE-SPINE.md` 的 AD-1–AD-32、Consistency Conventions、Stack、Structural Seed 与 Capability Map 全部承重；同主机 Hexagonal Modular Monolith + Supervised Execution Plane 不得被擅自放宽。
- S0-V/Story 1.1 项目骨架必须服从 AD-32 固定的 TypeScript 6.0.3、根级跨语言工程质量、workspace policy、typed dependency edges、canonical ignores、validators 与 required checks；完整逐项 handoff 见 `contract-index.md`。工程骨架存在不等于注册产品 capability，也不关闭 OQ-06。
- v1.0 同时提供 B/S 与 Tauri 2 薄桌面客户端；两者必须运行同一 React SPA、Fastify/Worker 产品内核、工作区真值和 Capability/Gate 合同。桌面壳只负责窗口、启动、受保护会话 bootstrap、安装与升级，不得建立第二套业务逻辑、状态或授权路径；它是 S0 发行表面，不提前授权 S1–S5 能力。
- 用户 TypeScript 只可经锁定工具链编译为 WebAssembly Component，并在一次性 Wasmtime 子进程中运行，同时受平台级终止边界约束；五平台证据未通过不得注册该能力，也不得降级到较弱沙箱。
- SQLite WAL 是唯一数据库；Fastify 控制面是状态、策略、Gate、授权、审计、outbox 和领域写入路径的唯一权威，工件由服务端内容寻址 Artifact Service 持有。
- 所有模式使用受保护会话；一实例一受信工作区，不建立用户、组织、RBAC、多租户或逐用户归属。
- DataUsePolicy、EgressPolicy、RiskPolicy、不可重放授权、SecretRef、审计及外部拨号前单次授权均 fail closed，并随数据衍生与恢复传播。
- UX 完整服从 `DESIGN.md` 与 `EXPERIENCE.md`：React、shadcn `base-vega`/Base UI、Tailwind variables、桌面优先、简中/英文；核心旅程必须满足 WCAG 2.2 AA，阶段表面不得提前挂载。
- 发行物采用 Apache-2.0、自包含、可回退且默认无遥测；不得设置付费功能锁、license server、强制官方云账户或官方 SaaS 依赖。

## Non-goals

- 实盘下单、券商连接、跟单、自动交易、投资顾问及无人值守交易。
- ETF、场外基金、债券、期货、期权、外汇、加密、美股及其他全球资产的一等支持；任何重开都需要新产品决策。
- 用户、组织、RBAC、多租户、陌生用户共享、官方托管 SaaS 或跨主机拓扑。
- 社交、直播、课程、公开脚本社区、在线插件市场、远程一键安装或受支持的外部公共 REST API。
- 内置、转售或绕授权取得商用数据；自动多模型路由、多 Agent 编排；模型下载、量化、GPU 或推理服务运维。
- 移动端验收、完整离线模式，或逐像素复制 TradingView 与其全球资产/全部工具。

## Success signal

- **继续产品 thesis：** S0-V 的 SM-00 全部通过——至少 12 名合格用户各完成至少 2 个同类真实任务，任务时间中位数降低至少 30%，实质错误或遗漏率降低至少 25%，两周内主动二次复用至少 60%，数据许可或越权违规为 0；否则停止平台化或收窄 Agent thesis。
- **发布 v1.0：** S0-V→S5 全部依赖 Gate、FR-001–FR-100、NFR-001–NFR-040、全部适用 SM/SM-C、双市场真实数据资格、Parity、UX、恢复、安全、供应链和治理合同均以规定证据通过；SM-00 或任何后续条件未通过时保持 beta，不得称为 v1.0。

## Assumptions

- **A-01:** 全工具 Agent 相对现有工具链能显著改善任务时间、实质错误/遗漏和两周内二次复用；只能由 SM-00 关闭。（用户于 2026-08-28 确认按此待证；不代表假设已验证。）
- **A-02:** 足够多目标用户愿意承担合法数据、模型和自托管配置成本；只能由招募、SM-01R 与 SM-00 关闭。（用户于 2026-08-28 确认按此待证；不代表假设已验证。）
- **A-05:** 任务级 TradingView Parity Rubric 足以替代目标用户现有研究环节；只能由 SM-02、SM-11 与 SM-00 的迁移/复用证据关闭。（用户于 2026-08-28 确认按此待证；不代表假设已验证。）

## Open Questions

- **OQ-03:** S1 前分别选择哪一条合法免费 A 股和港股数据路径，并如何证明其字段、时效、历史、稳定性、许可用途与健康状态满足 §6.4？若不合格，收窄哪个市场或保持何种 beta 边界？（用户于 2026-08-28 确认保持开放，等待独立资格调研；S1 继续阻塞。）
- **OQ-04:** 公开 beta 前采用哪些经核对的数据许可、第三方内容、免责声明和隐私法律文本？（用户于 2026-08-28 确认保持开放；待实际免费数据源及外部模型/通知路径确定后关闭，不阻塞当前设计和早期验证。）
- **OQ-05:** 首轮 alpha 基准后是否调整 NFR-001–NFR-006，同时保留原基线、环境和调整理由？（用户于 2026-08-28 确认保持开放；首轮 alpha 前当前目标不变，禁止为测试变绿而静默降标。）
- **OQ-06 实施证据余项:** 在 AD-12 已决定 Wasmtime Component 双层终止边界后，S0 应锁定哪套精确 compiler/componentizer/source-map 组合，并以哪些覆盖五个平台的 FR-095/NFR-037 证据准许能力注册？（用户于 2026-08-28 确认保持开放；它是 S0 工具链与五平台证据 Gate，证据通过前不得注册或宣称沙箱能力可用。）
- **架构未决项 — 平台基线:** S0 release spike 要为五个平台分别固定哪些最低 OS/libc/system WebView 版本？（用户于 2026-08-28 确认保持开放；五个固定 profile 不变，须以实际 B/S archive、桌面 envelope、安装/启动/升级/回滚和 CI 证据写入 Release Profile，未经证据不得宣称支持或静默删减平台。）
- **架构未决项 — Vault:** S0 安全设计评审要固定哪套加密库、KDF、轮换/迁移规则与 headless secret-file 格式？（用户于 2026-08-28 确认保持开放；评审须锁定精确算法、库版本和文件权限规则，但不得改变 AD-9 的独立 Vault、外部根密钥、SecretRef 与 `LOCKED`/fail-closed 边界，证据通过前不得宣称秘密管理能力就绪。）
- **架构未决项 — 适配清单:** 各阶段最终选择哪些精确模型、通知渠道和官方连接器，且其资格、许可、manifest 与 Gate 如何证明？（用户于 2026-08-28 确认保持开放；只能在实际候选通过版本、权限、来源、哈希、健康及对应 Gate 后逐项登记。模型以精确 `model + prompt + toolset` 组合为资格单位，免费 A/港股数据源仍由 OQ-03 单独关闭；接口或 adapter 存在不等于能力已授权。）
