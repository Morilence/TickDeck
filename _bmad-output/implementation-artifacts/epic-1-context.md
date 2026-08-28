# Epic 1 Context: 用真实只读任务证伪 Agent 选股价值

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

以 S0-V 最小只读纵切验证 Agent 能否在同一真实选股任务上产生可测量的增量价值：合格 Alpha 用户在唯一冻结的合法真实数据路径上对照现有工具链与受限 R0 Agent，形成可审计的条件树、候选或零候选、oracle 差异及运行证据，最终作出 SM-00 Go/Stop；价值未被证明时停止或收窄，不提前建设完整平台。

## Stories

- Story 1.1: 建立锁定的 S0-V 项目骨架与阶段壳
- Story 1.2: 冻结并校验 S0-V 实验合同
- Story 1.3: 准入冻结的真实数据快照
- Story 1.4: 执行规范化只读筛选与 oracle 校验
- Story 1.5: 编排受限的 R0 Agent 运行
- Story 1.6: 审阅可追溯的筛选证据
- Story 1.7: 记录同任务对照与两周复用证据
- Story 1.8: 生成不可伪造的 SM-00 Go/Stop 决策

## Requirements & Constraints

- S0-V 只允许一条通过授权、许可用途、能力和健康校验的真实数据路径，以及预先冻结的任务、oracle、工具链基线、盲审/样本协议、只读筛选和受限 R0 Agent。演示数据、fixture、厂商声明或自动化全绿不能替代真实实验资格。
- 有效实验至少覆盖 12 名合格用户，样本覆盖 A/港股合法数据使用者；每人至少完成两次同类真实任务，并分别使用现有工具链和 TickDeck。任一资格、样本、冻结条件或数据权利不满足，证据即无效。
- Go 必须同时满足：任务时间中位数至少降低 30%，盲审确认的实质错误或遗漏率至少降低 25%，至少 60% 用户在两周内主动完成第二个真实 Agent 任务，许可或越权违规为 0；否则 Stop/Narrow，不启动后续平台化阶段。
- 确定性领域工具须在冻结快照上计算筛选结果并接受独立 oracle 校验；零候选是合法结果。事实、计算、模型解释和未知项必须分离；未知、冲突、过期、缺失、不支持或不可复现须显式降级或拒绝，不得由模型补造或静默换源。
- 不建设或展示沙箱、提醒、组合、R1/R2、完整恢复、实盘、多 Agent、自动模型回退及任何 S1–S5 API、工具或导航 teaser。默认无遥测/官方回连；核心表面满足双语、键盘与 WCAG 2.2 AA，Gate 不能依赖模型输出判定。

## Technical Decisions

- 采用 Hexagonal Modular Monolith + Supervised Execution Plane。Fastify 控制面独占 Gate、策略、状态、持久化与审计权威；同主机 Worker 仅经版本化受认证端口执行，Web、Agent、connector 和 Worker 均不得绕过控制面。
- 服务端 Gate Registry 与 `packages/contracts` 的 canonical capability catalog 决定阶段能力；构建从同一 catalog 生成 digest 一致的 web/server/worker slices。缺失能力不注册、不加载，客户端 flag 不能授权能力。
- `packages/core` 独占领域语义、规范化筛选、oracle 对接、快照身份和权威十进制计算；浏览器与模型只消费结果，不得用裸 symbol、mutable `latest` 或 binary float 重算。数据只经 Broker 与策略边界进入，其许可、来源、时点、完整性、新鲜度、版本和 snapshot digest 一并冻结；未知许可 fail closed。
- 共享合同使用版本化 JSON Schema Draft 7、同一严格 Ajv profile 与稳定英文错误 code。HTTP snapshot 是客户端真值，事件流只通知变化；身份和证据使用稳定版本、UTC、RFC 8785 canonical JSON 及用途隔离的 SHA-256 digest。
- `packages/agent-mastra` 只编排，不直接访问 DB、文件、网络、秘密或 connector；每次工具调用重验 schema、数据使用、出站、风险、预算、状态和 Gate。仓库采用锁定 pnpm/Cargo workspace 与唯一根级跨语言质量合同，统一覆盖依赖边、TypeScript、Rust、lint、格式、生成物、构建和测试。

## UX & Interaction Patterns

- 只挂载 App Shell、筛选、最小运行与健康、Navigation Rail、Trust Strip、R0 Agent Panel/Run Timeline、Review Canvas、Data Table、Empty State、Status Badge、Form Control 和 Theme Control；后续能力不渲染禁用菜单、锁形入口或占位页。
- Agent 是右侧伴随面板而非聊天首页/一级导航；运行进入健康记录，复杂证据在中央 Review Canvas 按事实、确定性计算、模型解释、未知和运行清单分区。
- 数据表面常驻 Trust Strip，至少显示来源、数据时点、性质/可用性和 snapshot ID；降级贴近受影响字段，零候选说明数据边界和合法下一步。
- 使用官方 shadcn `base-vega` / Base UI、Tailwind 语义 token 与等价 light/dark/system 主题；保留原生语义、键盘、焦点与回返，提供 `zh-CN`、`en-US`、pseudo-long，关键状态不能只靠颜色。

## Cross-Story Dependencies

按 1.1 → 1.2 → 1.3 → 1.4 → 1.5 → 1.6 → 1.7 → 1.8 推进：骨架承载冻结合同，合同限定快照，快照供筛选/oracle，权威结果供 R0 编排与审阅，对照和两周复用证据供 SM-00。真实数据授权、冻结任务/oracle、合格 run、合法快照、盲审和完整观察缺一不可；fixture 只验机制。仅有效 SM-00 Go 可启动 Epic 2。
