---
name: TickDeck
description: A/HK 股研究、策略验证、提醒与模拟组合的桌面 UX 行为合同
status: final
sources:
  - /usr/local/src/TickDeck/_bmad-output/planning-artifacts/prds/prd-TickDeck-2026-08-27/prd.md
  - /usr/local/src/TickDeck/_bmad-output/planning-artifacts/prds/prd-TickDeck-2026-08-27/addendum.md
updated: 2026-08-28
---

# Foundation

TickDeck v1.0 是桌面优先、自托管、在同一受信工作区内共享状态的 Web 产品，同时提供 B/S 与 Tauri 2 薄桌面客户端。UI 基于同一 React SPA、shadcn/ui `base-vega`（Base UI）和 Tailwind CSS；视觉身份以 [DESIGN.md](./DESIGN.md) 为准。最终实现采用 TickDeck 自身 shadcn 配置所解析的官方 `base-vega` 组件、默认 variant、交互语义和 Tailwind/shadcn 语义 token 预设。UX 只定义官方组件之上的行为差异，以及预设未覆盖的行情、数据质量和 R0–R3 语义。桌面、本地 B/S 与远端 B/S 提供相同的产品能力、状态和 Gate；桌面壳不建立第二套 UI 或业务交互合同。移动端验收、官方托管、完整离线和多租户仍不承诺。

一套实例只有一个受信工作区，不建立用户、组织、RBAC 或逐用户归属。远端入口认证由部署者的 HTTPS 反向代理承担；本地与远端都必须建立应用层受保护会话。代理身份只能进入审计上下文，不能产生 TickDeck 角色或权限差异。

产品体验的基本判断顺序是：先确认数据和能力，再计算，再解释，最后由人决定。模型不是行情、收益、指标或回测的事实源；不存在的产品能力不得由模型模拟。

## 阶段合同

完整 v1.0 IA 是目标合同，不表示所有能力已获同时实施许可。任何 0.x 构建只呈现已通过 Gate 的入口；不使用禁用菜单、锁形 teaser 或占位页面暗示后续能力已承诺。

| 阶段 | 可进入产品的体验 | 明确不得出现 |
|---|---|---|
| S0-V | 一条合法真实数据路径、只读筛选、受限 R0 Agent、冻结验证任务/oracle、同任务对照与二次复用观察 | 沙箱、提醒、组合、R1/R2、完整恢复、后续导航 teaser |
| S0 | 受保护会话、B/S/桌面双入口壳、目标架构与 UX 合同；实施仍受 OQ-06 阻塞 | 双入口提前展示后续业务能力；宣称沙箱安全闭环已通过 |
| S1 | A/港股真实数据路径、图表工作台、自选、基本面、资讯、连接器/模型诊断 | 未授权连接器显示“已支持”；S2+ 行为入口 |
| S2 | 完整单 Agent、模型能力分级、R0–R3、预算、取消、运行清单和恢复 | 多 Agent、自动外部模型回退、绕过 Gate |
| S3 | TypeScript 指标/策略、沙箱、回测、样本外与敏感性验证 | 未通过合规套件即称安全沙箱 |
| S4 | 提醒、产品内通知、Webhook、模拟组合与逐次确认 | 实盘、无人值守自动交易、提醒直接下单 |
| S5 | 四类受信扩展、供应链与发布治理表面 | 在线市场、远程一键安装、公共脚本社区、公共 REST API |

## Open Questions and Handoff Boundaries

UX 不替上游关闭开放项：OQ-06 继续阻塞 S0 实施；OQ-03 阻塞 S1。OQ-01 已关闭：官方 demo 只使用固定版本、固定种子的确定性合成数据并标记 `demo/non-current`。OQ-02 的实验协议已关闭，但合格招募和有效实验证据仍阻塞 S2。OQ-04、OQ-05 按 PRD 的 alpha 或 beta 门槛关闭；OQ-07 已退役。所有 mock 中的连接器、模型、行情、健康和版本号只能是演示/未知示例。

架构阶段必须决定沙箱平台/隔离/终止、连接器进程形态、持久化与任务恢复实现、受保护会话、DataUsePolicy/EgressPolicy、不可重放授权和一致性机制；UX 只规定可观察结果。

# Information Architecture

## 应用壳

同一壳层分为“研究”和“系统”两个导航分组；分组只表达任务域。Agent 不占一级导航；其交互入口是右侧伴随面板，其运行实例是“运行历史”中的任务实体。

| 一级表面 | 主要职责 | 最早阶段 | 落地旅程 |
|---|---|---:|---|
| 筛选 | 构建/执行只读条件、证据审阅、S0-V 对照验证 | S0-V | UJ-1 |
| 运行与健康 | S0-V：R0 运行记录与最小失败诊断；S1：TickDeck/连接器/模型分层健康；S2：待确认、暂停与完整恢复 | S0-V（分阶段增强） | UJ-1、UJ-3 |
| 工作台 | 图表、标的、自选、对象树、数据窗口、基本面、资讯与 Agent 上下文 | S1 | UJ-1 |
| 连接与模型 | 数据连接器、模型档案、能力、许可、成本和测试结果 | S1 | UJ-3 |
| 策略实验室 | TypeScript 编辑、策略契约、沙箱诊断、回测与比较 | S3 | UJ-2 |
| 提醒 | 提醒定义、版本、触发证据、通知状态 | S4 | UJ-1、UJ-2 |
| 模拟组合 | 现金、持仓、订单、成交、绩效与公司行动审计 | S4 | UJ-1、UJ-2 |
| 通知中心 | Agent 完成、待确认、提醒触发、失败和健康事件 | S4 | UJ-1、UJ-2、UJ-3 |
| 扩展 | 数据、模型、Agent 工具、通知渠道的本地受信扩展治理 | S5 | UJ-4 |

自选、基本面、公司行动、公告/新闻、绘图和指标是工作台上下文，不增加一级入口。复杂 Agent 产物打开在中央 Review Canvas；关闭后精确恢复进入前的标的、时间范围、缩放、面板宽度、展开项与滚动位置。

## Workbench 布局

从左到右为 Navigation Rail、可折叠 Context Drawer、中央 Chart Canvas、可折叠 Agent Panel。Context Drawer 承载自选、对象树和数据窗口；Agent Panel 只承载冻结上下文、时间线、摘要、风险/未知和下一步。完整报告不塞入侧栏。

面板可拖拽调宽并按当前客户端本地记忆，不写入共享业务真值。中央画布具有最低宽度；空间不足时先收起 Context Drawer，不能遮挡运行中的 Agent 或 R2。布局恢复不得改变正在运行任务的冻结上下文。

## Surface closure

| 已声明需要 | 交付表面 | 到达路径 | 失败/降级落点 |
|---|---|---|---|
| 行情与研究上下文 | 工作台 + Trust Strip | 筛选结果、自选、深链 | 受影响图层旁的缺失/陈旧/许可态 |
| 可审计筛选 | 筛选 + Review Canvas | 一级导航或 Agent 结果 | 零候选成功态、能力不足拒绝态 |
| Agent 执行与恢复 | Agent Panel + 运行与健康 | 任意研究上下文、通知深链 | 待确认、失败、已中断、不可恢复 |
| 策略与回测 | 策略实验室 + Review Canvas | 一级导航或 Agent 产物 | 编译/沙箱/偏差/预算诊断 |
| 提醒与通知 | 提醒 + 通知中心 | 工作台、策略、一级导航 | 触发/发送分离，Webhook 失败可诊断 |
| 模拟研究闭环 | 模拟组合 | 报告、策略、工作台经 R2 | 拒单、部分成交、重试、市场规则说明 |
| 部署和维护 | 连接与模型 + 运行与健康 | 系统导航 | 旁路、代理、连接、存储、备份诊断 |
| 无商用数据贡献 | 扩展 + 演示环境 | 系统导航/贡献指引 | 契约、兼容、供应链或权限检查失败 |

## Visual References and Mock Coverage

[DESIGN.md](./DESIGN.md) 与 [EXPERIENCE.md](./EXPERIENCE.md) 是规范性合同；mock 只用于表达布局、密度、信息层级和状态关系，发生冲突时以两份 spine 为准，且不得以 mock 像素值覆盖 shadcn 默认 variant 或 token 预设。

| 参考 | 稳定 scenario ID | 阶段/主题 | 可检查文件 | 覆盖边界 |
|---|---|---|---|---|
| 冻结筛选审阅 | `SCN-S0V-EVIDENCE-01` | S0-V | [HTML](./mockups/key-s0v-screening-review.html) · [PNG](./mockups/key-s0v-screening-review.png) | 只读筛选、R0 Agent、冻结任务/oracle、对照指标 |
| 图表工作台 | `SCN-WB-QUAL-DEMO-R2-01` | 目标 v1.0，最早 S4 合成；深色 | [HTML](./mockups/key-workbench-dark.html) · [PNG](./mockups/key-workbench-dark.png) | 双侧工作台、Trust Strip、已获资格的演示 Agent、R2；不是 0.x 可用能力声明 |
| 图表工作台 | `SCN-WB-QUAL-DEMO-R2-01` | 目标 v1.0，最早 S4 合成；浅色 | [HTML](./mockups/key-workbench-light.html) · [PNG](./mockups/key-workbench-light.png) | 与深色为同一场景的主题变体，不是另一次运行 |
| 策略实验室与回测 | `SCN-S3-BACKTEST-REVIEW-01` | 目标 v1.0，最早 S3 | [HTML](./mockups/key-strategy-lab-backtest.html) · [PNG](./mockups/key-strategy-lab-backtest.png) | 编辑、契约、诊断、回测与比较 |
| 连接与健康 | `SCN-CONN-DEGRADED-01` | 目标 v1.0 合成；表面最早 S1 | [HTML](./mockups/key-connections-health.html) · [PNG](./mockups/key-connections-health.png) | 独立的连接降级诊断；能力、许可、健康与脱敏诊断，未来导航为 target IA only |

scenario ID 是视觉/验收 fixture 身份，不是运行清单 ID。`SCN-CONN-DEGRADED-01` 与 `SCN-WB-QUAL-DEMO-R2-01` 属于不同工作区状态、不同运行，前者的模型资格失败不得与后者的 qualified-demo Agent 拼接解释；两者都不证明真实供应商接入或发布资格。

提醒管理、模拟组合管理、通知中心和扩展管理已在 spine 中闭合，但本轮不再增加 mock；其阶段、到达路径、状态与失败落点以本文件为准。

# Stable Requirement Traceability

本文件不复制上游验收文本；稳定 ID 与原名以 `sources` 为准，任何下游故事不得重命名。以下表用于 UX 路由，不改变需求含义。

| 稳定范围 | 主要 UX 落点 |
|---|---|
| FR-001–FR-007 | 连接与模型、Trust Strip、数据状态、UJ-3 |
| FR-008–FR-014 | 工作台、Chart Canvas、Context Drawer、UJ-1 |
| FR-015–FR-024 | 筛选、自选、Review Canvas、工作台、UJ-1 |
| FR-025–FR-028 | 提醒、Notification Center、触发/投递状态 |
| FR-029–FR-043 | 策略实验室、Run Timeline、Review Canvas、UJ-2 |
| FR-044–FR-051 | 模拟组合、Risk Gate、UJ-1/UJ-2 |
| FR-052–FR-064 | Agent Panel、运行与健康、R0–R3、清单、UJ-1/UJ-2 |
| FR-065–FR-069 | 连接与模型、模型能力分级、运行披露 |
| FR-070–FR-076 | App Shell、受保护会话、备份恢复、Diagnostic Panel、UJ-3 |
| FR-077–FR-083 | 扩展、贡献脚手架、受信/沙箱边界、UJ-4 |
| FR-084–FR-100 | 发布资格、策略默认拒绝、审计一致性、Parity、切片 Gate |
| NFR-001–NFR-012 | 加载/运行反馈、幂等、恢复、修订与不可复现状态 |
| NFR-013–NFR-020 | 校验、脱敏、隔离、审计、无遥测、分层健康 |
| NFR-021–NFR-025 | Accessibility Floor、Responsive & Platform、双语、演示环境 |
| NFR-026–NFR-040 | 契约/版本、测试证据、安全策略、供应链和治理诊断 |


# Component Patterns

组件名称与 DESIGN.md 完全一致。

## Interaction primitive inheritance

交互基础层的唯一默认来源是 shadcn 官方 registry 按项目 `components.json` 生成的 `base-vega` / Base UI 组件。实现必须保留官方组件的 DOM/ARIA 语义、键盘模型、焦点与回返、dismiss/portal、disabled/loading/invalid 状态和默认 variant；本文件只覆盖 TickDeck 的领域组合与行为增量。shadcn 组件按其 source-owned 模式进入仓库后允许受控修改，但修改必须可追溯为 TickDeck delta，不能改成另一套未声明的基础组件。

| TickDeck 使用场景 | 官方 `base-vega` 基础 | TickDeck 只增加的行为 |
|---|---|---|
| 导航、抽屉与分区 | Sidebar、Button、Tooltip、Collapsible、Sheet、Separator | 阶段挂载、研究/系统分组、布局记忆和冻结任务不被切换影响 |
| 表单与配置 | Field、Label、Input、Textarea、Select、Checkbox、Button | secret 不回显、连接资格、许可用途、成本与 policy 结果 |
| 浮层与命令 | Dialog、Sheet、Popover、Dropdown Menu、Tooltip、Command | R2 不能被快捷键绕过、作用域路由、关闭后的精确焦点回返 |
| 切换、状态与加载 | Tabs、Collapsible、Card、Badge、Skeleton、Progress | 数据质量、运行状态、R0–R3、确定/不确定进度与阶段差异 |
| 数据与通知 | Table/Data Table、官方通知 primitive/integration | 虚拟化可访问性、通知中心权威记录、触发与投递分离 |

Chart Canvas、Trust Strip、Risk Gate、Run Timeline、Review Canvas 和 Agent Panel 是允许的领域组合；它们不证明 shadcn 官方存在同名整件组件，其内部可交互 primitive 仍遵循上表。若官方 registry 没有满足需求的 primitive，必须先记录能力缺口和替代边界，再做最小扩展并重新验证；不得静默切换到 Radix/New York 风格、第三方 registry 或 mock HTML 实现。

| 组件 | 行为合同 | 关键状态 | 最早阶段 |
|---|---|---|---:|
| App Shell | 只挂载当前阶段已通过的导航；受保护会话失效时保存安全草稿并转入重新验证 | loading、ready、session-expired、degraded | S0-V |
| Navigation Rail | 键盘循环、可见焦点、当前项朗读；研究/系统不是权限域 | default、hover、focus、current | S0-V |
| Context Drawer | 可折叠/调宽/记忆；切换内容不改变 Agent 冻结上下文 | collapsed、open、resizing、empty | S1 |
| Trust Strip | 常驻来源、数据时点、获取/同步时点、快照身份与状态；一步展开完整溯源、许可用途和影响范围 | real、delayed、demo、partial、fresh、stale、missing、unsupported、unknown | S0-V |
| Chart Canvas | 键盘平移/缩放；十字光标同步 Data Window；未完成 K 线可见 | loading、ready、partial、no-data、revised | S1 |
| Agent Panel | 自动建议可移除 Context Chips；启动时冻结快照；页面切换不变更运行输入；S0-V 只有 R0；`waiting`、`paused`、`recovered` 从 S2 起可用 | idle、draft、running、done、failed；S2+ waiting、paused、recovered | S0-V（分阶段增强） |
| Run Timeline | S0-V 显示计划、当前步骤、R0 工具事件和结果；S2 加入 Gate、预算、暂停/恢复。常规工具折叠，高风险/失败/重试/降级自动展开 | queued、active、collapsed、expanded；S2+ waiting、blocked | S0-V（分阶段增强） |
| Risk Gate | R0 自动留痕；R1 范围授权；R2 绑定状态后逐次、单次确认；R3 阻止且无覆盖 | r0-recorded；r1-pending/active/revoked/expired；r2-pending/confirmed/expired/state-changed/consumed；r3-blocked | S2 |
| Review Canvas | 把产物固定分为事实、确定性计算、模型解释、未知和运行清单；支持来源深链 | loading、ready、partial、not-reproducible、error | S0-V |
| Notification Center | 持久记录、已读/未读、类型筛选与深链；Toast 不是记录来源 | unread、read、action-required、delivery-failed | S4 |
| Data Table | 排序/筛选/列设置可键盘操作；虚拟化不能破坏焦点和屏幕阅读器上下文 | loading、ready、empty、partial、error | S0-V |
| Command Palette | `Ctrl/⌘+K`；显示命令作用域和快捷键；危险命令只导航到确认界面 | open、searching、no-match、disabled-by-policy | S1 |
| Form Control | Base UI 表单语义；错误贴近字段；秘密字段永不回显真实值 | default、focus、invalid、disabled、secret-set | S0-V |
| Status Badge | 图标/文字/形态冗余；提供可访问名称 | info、success、warning、danger、unknown | S0-V |
| Empty State | 空状态也是可信结果；解释条件、数据时点和合法下一步 | first-use、zero-result、no-capability、no-license | S0-V |
| Diagnostic Panel | 区分 TickDeck、连接器、模型、沙箱、队列、通知和存储；总状态列出 enabled/blocked capability；导出前预览脱敏内容 | healthy、degraded、down、unknown、exporting | S1 |
| Theme Control | 浅色/深色/跟随系统三态；切换不重置工作状态 | light、dark、system | S0-V |

## 既有组件的子模式

这些名称不产生新组件或一级表面：

| 子模式 | 父组件 | 行为边界 |
|---|---|---|
| Data Window | Chart Canvas；可托管于 Context Drawer | 与图表焦点、时间范围和十字光标同步的结构化读数/表格模式 |
| Context Chips | Agent Panel | 提交前可移除；提交后只读冻结并进入运行清单 |
| Toast | Notification Center 在 App Shell 的即时反馈模式 | 不抢焦点、可关闭/暂停；权威记录与动作仍在 Notification Center |

# State Patterns

## 通用异步状态

冷加载使用稳定骨架，不伪造数据；超过性能基线后显示已耗时和取消/诊断入口。错误保留已验证的旧内容并标记其时间，不用空白替换。网络断开不等于离线支持：页面显示断线、最后成功时间和哪些动作不可用。

Agent 和回测统一使用：排队、运行中、待确认、已暂停、已完成、失败、已取消、已中断。导航、刷新或关闭浏览器/桌面窗口不取消；只有“停止运行”请求终止。服务重启后明确显示恢复或中断。R2 到期安全失效，绝不自动执行。

## 数据状态

- `real`、`delayed`、`demo`、`partial` 是来源性质；`fresh`、`stale`、`missing`、`unknown` 是当前可用状态，二者可组合。界面显示“真实来源”，避免孤立的“真实”暗示实时、完整或许可已确认。
- 缺失、陈旧、超额、断连和不支持贴近受影响字段、图层、表格或结果；Toast 只提示变化。
- 授权未知、冲突或到期默认拒绝缓存、派生、模型发送、Webhook、导出、备份等相应动作。
- 数据到期清理后，产物保留不含受限数据的元数据和清单，并进入 `not-reproducible`。

Trust Strip 的状态组合必须同时给出文字/图标和对当前动作的影响：

| 可用状态 | 最小可见语义 | 默认影响 |
|---|---|---|
| `fresh` | 在当前 freshness policy 内；显示数据时点 | 仍需结合来源性质、完整性和许可判断，不等于实时 |
| `stale` | 超出阈值；显示超出多久和最后成功同步 | 当前判断/动作按 policy 降级或阻止，不静默沿用 |
| `missing` | 所需对象、区间或字段不存在 | 贴近受影响结果排除/拒绝，不由模型补值 |
| `unknown` | 无足够证据判断时点、完整性或许可 | 默认拒绝依赖该判断的动作，并显示待补证据 |
| `unsupported` | 当前 connector/tool 合同不提供该能力 | 阻止对应任务；不静默换源或由模型模拟 |

## 表面状态覆盖

| 表面 | 必须覆盖的状态 |
|---|---|
| 筛选 | first-use、editing、running、zero-result、partial、unsupported、error |
| 工作台 | cold-load、ready、focus、no-data、partial、stale、revised、layout-conflict |
| 运行与健康 | S0-V：empty、queued、running、failed、interrupted；S1：healthy、degraded、unknown；S2：waiting、paused、recovered、permission-denied |
| 连接与模型 | unconfigured、testing、capability-limited、license-unknown、healthy、degraded、secret-invalid |
| 策略实验室 | draft、compiling、diagnostic、sandbox-blocked、running、over-budget、not-reproducible |
| 提醒 | draft、active、paused、expired、triggered、delivery-retrying、delivery-failed |
| 模拟组合 | empty、ready、market-closed、order-pending、partial-fill、rejected、stale-valuation |
| 通知中心 | empty、unread、read、action-required、deep-link-missing |
| 扩展 | demo-only、compatible、permission-diff、untrusted-source、disabled、rollback-available |

# Interaction Primitives

## 上下文与深链

当前标的、筛选器、脚本、回测或组合会被建议为 Context Chips。用户可在提交前移除；提交后形成冻结快照。运行期间页面切换不变更输入；“重新绑定当前上下文”生成新清单版本并记录差异。

Trust Strip、时间线节点、通知和报告引用都可深链到来源对象。深链失败时保留对象 ID、版本和错误原因，不把用户送回无解释首页。

## 键盘与命令

`Ctrl/⌘+K` 打开全局 Command Palette。事件优先级固定为 IME composition/原生输入 → 当前 modal → editor/table/chart scope → global；已被当前作用域消费的按键不得被上层劫持。`Escape` 逐层关闭并回到触发器。图表、Agent 输入、Data Table 和代码编辑器隔离作用域；菜单/按钮提供所有快捷键的等价入口。删除、覆盖、外发数据、启用策略和模拟订单不能靠单个快捷键执行；R2/R3 不提供确认或覆盖快捷键。

# Execution, Risk, Recovery & Notifications

## 保存、撤销与确认

低风险本地草稿可自动保存并显示时间。版本化产物的覆盖转换为新版本或 R2；删除必须说明影响、可恢复性和关联对象。R1 显示工具、对象、范围、有效期和撤销入口。R3 只提供原因、策略来源、审计 ID 和安全替代路径。

R2 的绑定、失效与单次消费以 [Risk Gate 状态与转换](#risk-gate-状态与转换) 为准。

诊断“导出”必须区分本地下载与外部发送。本地包先展示字段清单并按 policy 脱敏，secret reference 默认转为不透明 alias/hash；发送到外部服务是另一动作，必须显示目的地址、最小字段集、费用/预算和出站判定，并按适用风险等级进入 R2。

## Risk Gate 状态与转换

状态由受保护服务端记录判定；客户端视觉状态不能授权执行。

| 状态 | 必须显示 | 唯一主操作 | 必记审计 | 禁止转换/行为 |
|---|---|---|---|---|
| `r0-recorded` | 工具、参数摘要、结果/失败、数据 manifest、耗时/成本 | 查看运行记录 | R0 决策与工具结果 | 不升级为持久化/外发副作用 |
| `r1-pending` | 工具、对象、范围、有效期、subject、撤销方式 | 授予该范围；取消为次操作 | presented/approved/declined | 不接受模糊范围或默认勾选 |
| `r1-active` | 已授权范围、剩余有效期、最近使用 | 撤销 | used/revoked | 不扩大工具、对象、范围或期限 |
| `r1-revoked` | 撤销时间、影响、审计 ID | 重新发起新授权 | revoke reason | 不恢复旧授权、不重放 |
| `r1-expired` | 到期时间、被阻止动作 | 重新发起新授权 | expiry/block reason | 不自动续期或继续执行 |
| `r2-pending` | 完整绑定摘要、影响、到期、一次性 | 确认这一次；拒绝为次操作 | presented/confirmed/declined | 不允许快捷键、深链或旧页面直接执行 |
| `r2-confirmed` | 确认回执、绑定摘要、待执行状态 | 无第二次确认动作 | confirmation receipt | 只允许匹配绑定的一次请求；不改变参数 |
| `r2-expired` | 到期/阻止原因 | 生成新的确认 | expiry/block reason | 不执行、不恢复旧确认 |
| `r2-state-changed` | 变化字段与旧/新版本 | 生成新的确认 | invalidation diff | 不沿用旧确认或隐藏差异 |
| `r2-consumed` | 执行结果、消费时间、幂等键、审计 ID | 查看运行 | consumed/result | 不得再次消费；重试不得产生第二次副作用 |
| `r3-blocked` | 被阻止对象、原因、策略来源、审计 ID、安全替代路径 | 进入安全替代路径；无危险主操作 | policy block | 无覆盖、降级授权或管理员绕过 |

R2 的不可折叠绑定摘要显示：subject/session、run ID、`tool@version`、parameter hash、snapshot/manifest ID、数据性质/新鲜度/完整性、portfolio version、DataUsePolicy/EgressPolicy judgment、预计成本/出站/组合影响、有效期和 `single-use`。参数、工具版本、数据快照或状态、组合版本、subject/session、policy judgment、有效期任一变化都会使确认失效；nonce 不必回显，但必须显示不可重放和剩余使用次数。

统一审计字段至少包含 event ID/time、subject/session、run ID、Gate 前后状态、tool@version、parameter hash、snapshot/manifest、portfolio version、policy judgment、request/idempotency ID、原因与结果。呈现、确认、失效、阻止、消费和恢复分别记录为独立事件，不用单条“成功”覆盖过程。

| 绕过/竞态用例 | 必须结果 |
|---|---|
| 刷新、后退、关闭后重开、通知深链 | 恢复同一服务端状态；`r2-pending` 仍需完整确认；`r2-expired` / `r2-state-changed` 只可生成新确认 |
| Command Palette、快捷键、直接 URL | 只能导航到完整 Gate，不能确认或执行 |
| 服务重启/任务恢复 | 重新验证 subject、绑定与 policy；旧确认不会随任务自动恢复执行 |
| 两个并发标签页 | 首次消费成功后另一页进入 `r2-consumed` 或冲突态，不产生第二副作用 |
| 重复网络请求/客户端重试 | 同一幂等键返回同一结果；不同参数必须触发 `r2-state-changed` |

## 通知

Notification Center 是权威记录；Toast 只作当前页面即时反馈。提醒触发、Agent 长任务完成、待确认、失败和健康事件进入中心。Webhook 只在部署者显式配置、DataUsePolicy/EgressPolicy 允许并完成相应确认后发送；触发结果和投递结果分开显示，失败重试可诊断。

## 长任务、恢复与通知事件序列

| 事件 | 页面恢复后的可见状态 | 通知/动作 | 审计要求 |
|---|---|---|---|
| 网络断开 | `running-disconnected`，保留最后已确认步骤和同步时间 | 重连后按 run ID 拉取；不自行重启 | disconnected/reconnected、last event cursor |
| 刷新 | 从服务端清单恢复 queued/running/waiting；页面状态不取消任务 | 回到同一运行；焦点落在恢复摘要 | page-resumed、run state/version |
| 关闭浏览器或桌面窗口 | 后台任务继续或按服务端状态中断，不能由关闭动作推断完成 | 完成/失败/待确认进入 Notification Center | client-detached、后续状态事件 |
| 服务重启 | 明确 `recovered` 或 `interrupted`；不把未知写成成功 | 可恢复则继续未完成的安全步骤；否则给诊断/安全重跑 | restart、checkpoint、recovery decision |
| 等待中的 R2 到期 | `r2-expired`，无执行动作 | 通知要求重新审阅；不得自动执行 | expiry、blocked execution |
| 提醒触发但投递失败 | trigger 保持成功证据，delivery 独立为 retrying/failed | 中心提供诊断与合规重试；Toast 不是唯一记录 | trigger ID、channel、attempt、policy、error |

长任务事件共同保存 run ID、manifest/version、步骤/进度、事件 cursor、耗时/成本、subject/session、policy/风险状态、重试/幂等 ID、最后成功时间和错误原因。高频更新合并，不能抹去状态转换。

# Data, Model & Evidence Contract

## Trust Strip identity

每个数据驱动表面常驻 Trust Strip。时点和身份必须分开：

| 字段 | 含义与最小行为 |
|---|---|
| source | 稳定来源/connector profile，不以模型名称代替 |
| data / observation time | 行情或事实对应的业务时点，带时区 |
| acquired / fetched-at | TickDeck 实际取得该批数据的时间 |
| last-successful-sync | 最近一次成功同步；失败后仍保留并显示 elapsed |
| snapshot / manifest ID | 结果、通知、运行与 Gate 共同引用的不可混淆身份 |
| nature + availability | 真实来源/延时/演示/部分，与 fresh/stale/missing/unknown 分维组合 |

折叠态至少显示来源、data time、freshness/availability、snapshot ID；展开后显示 fetched-at、last-successful-sync、时区、币种、复权、完整性、连接器版本/hash、许可用途、用途到期和影响范围。摘要、派生、索引、导出和备份继承来源限制。

## Agent result and manifest

Agent 最终结果严格分区：

1. **事实**：来自带溯源的原始或规范化数据；
2. **确定性计算**：指标、筛选、收益、回测和组合核算；
3. **模型解释**：明确为解释或假设，不伪装为事实；
4. **未知项**：缺失、冲突、许可、能力和因果不确定；
5. **运行清单**：冻结上下文、`tool@version`、参数/hash、snapshot/manifest、精确 model、prompt hash、toolset、qualification manifest ID、费用、policy/risk 状态和引用。

## Model qualification

完整 Agent 模式只能使用运行清单中已通过代表性资格测试的精确 `model + prompt hash + toolset` 组合；资格 manifest 与该次运行一并保存。资格失败、到期或组合不匹配时，仅允许连接合同已明确许可的无副作用单步 R0，并显示限制原因；不得静默换数据源、模型、provider、prompt 或 toolset。

## Strategy/backtest disclosure

策略与回测必须展示市场、周期、信号、仓位、风控、基准、执行假设、费用、税费、滑点、未确认 K 线、样本内外和偏差警示。模拟组合必须披露当前数据粒度无法模拟的现实因素；提醒不能直接提交订单。

# Responsive & Platform

B/S 支持当前及前两个主要版本的 Chrome、Edge、Firefox 和 Safari；桌面客户端在五个固定 Release Profile 的系统 WebView 上运行完全相同的 SPA，并通过同一核心旅程、阶段表面、双语和无障碍验收。最低验收视口 `1280×720`，最佳 `1440×900` 以上。`≥1600px` 可双侧展开；`1280–1599px` 默认收起 Context Drawer；`<1280px` 时进入专注布局：一次只展开一个伴随面板，并提示该布局不在 v1 验收范围。移动端不进入验收。

页面和伴随面板不得以固定画布或 `overflow:hidden` 隐藏核心操作。Agent Panel 主体是独立可滚动区。在 `1280×720` 及 200% 缩放下，用户仍可按顺序到达 R2 对象、绑定摘要、影响、有效期，以及确认和拒绝操作。若动作区 sticky，焦点元素与最后字段不能被其遮挡；空间不足时先折叠已完成的普通时间线节点，不折叠 Gate 决策字段。

主题支持浅色、深色、跟随系统。首次为“跟随系统”；显式选择按当前客户端保存，不写共享工作区。系统主题变化实时解析，但不得重置图表、运行或面板，也不播放强烈过渡。语言偏好同样按当前客户端保存。

# Accessibility Floor

核心旅程达到 WCAG 2.2 AA；以下是实现与验收合同，不以 mock 中的静态焦点、颜色或 `title` 属性作为通过证据。

## 焦点、语义与回返

- 所有操作使用原生或 Base UI 的 button/link/input/checkbox/Tabs/Dialog/Menu/Tree/Grid 语义。当前导航使用 `aria-current="page"`；Tabs 使用 roving tabindex + `aria-selected`；装饰 SVG 从可访问树隐藏。
- 可见轮廓须等效于至少 `2px` 实线，具有 `2px` offset，并与相邻颜色达到至少 `3:1` 的对比度；还要有轮廓/位移等非颜色形态。滚动容器设置 scroll padding，使焦点不被 sticky header/composer/Gate actions 遮挡。
- 顺序为 Navigation Rail → 展开的 Context Drawer → 中央画布 → 展开的 Agent Panel；隐藏内容不进入 Tab。Drawer 收起、Dialog/Command Palette 关闭、错误修复或通知深链返回时，焦点回到仍存在的触发器；触发器消失则落到该表面的有名称标题。
- R2 出现时焦点进入 Gate 标题/摘要；拒绝或完成后回到触发动作。R3 fixture 只含原因、策略来源、审计 ID 和安全替代路径，无覆盖或危险主按钮。

## 图表与动态状态

- 红涨绿跌除正负号/箭头外，K 线使用空心/实心、开收盘 tick 或同等形态；多序列曲线使用线型/marker 区分。图例同步文字映射，不能只靠颜色。
- 每个图表提供与当前范围、筛选和焦点同步的 Data Window/Data Table；包含时间、OHLCV/序列值、指标、数据状态、未完成与修订状态。图表键盘焦点先播报名称、范围和帮助，逐点移动只播当前点，并提供退出方式。
- Agent/回测只维护一个简短、去重的 `aria-live="polite"` 状态摘要；不朗读每条工具日志。失败、R2 待确认/到期和恢复产生独立状态消息；Trust Strip 本体是命名 region，只有性质、新鲜度、许可或完整性实质变化进入 live summary。
- 已知进度使用原生 `<progress>` 或 `role="progressbar"`，提供 min/max/now/text；未知进度显示阶段与已耗时，不伪造百分比。高频进度按意义合并。
- Notification Center 打开后焦点进入有名称标题，关闭回到通知触发器；条目按类型、时间、来源、状态、动作的顺序供读屏读取，未读/已读/action-required/delivery-failed 均有非颜色文本。Toast 不抢焦点，可暂停/关闭，并把重要事件写入 Notification Center；相同 run 的更新合并，未读数只播有意义的变化。

## 键盘、虚拟化与调宽

- 快捷键行为以 [键盘与命令](#键盘与命令) 为准；验收可见的等价入口、逐层焦点回返，以及 R2/R3 无确认或覆盖快捷键。
- Data Table 采用语义 table + windowing，或 grid/treegrid + roving focus；暴露 `aria-rowcount`、`aria-rowindex`、必要的 `aria-colindex` 和排序状态。focused row 必须 pin，不因虚拟化卸载；排序/筛选后保持对象焦点或说明对象已移除，并提供可读的总数/当前位置。
- resize separator 具有至少 `24×24px` hit area、可见 grip、可访问名称和值；左右箭头步进、Home/End 到边界，并有重置操作。checkbox 的控件或关联 label 命中区同样至少 `24×24px`。

## 文本、主题与 fixture

- 中文、English 和 1.5× 长度伪本地化在 100%/200% 下验收；风险、许可、数据状态、Gate、错误和长 model/provider ID 不得以 ellipsis 截断，也不得只在 `title` 中提供完整文本。应允许换行，或提供可聚焦的展开/复制控件，并保留完整 accessible name。根 `lang` 随界面语言更新，来源片段单独标语言。
- 尊重 `prefers-reduced-motion`；实时数据不闪烁，更新强调可关闭。系统主题切换不重置图表、任务、焦点或 Gate。
- fixture 矩阵至少覆盖 `light/dark/system` × `zh-CN/en-US/pseudo-long` × `1280×720/1440×900/1600×1000` × `100%/200%`。每组抽查正文/辅助文字、focus-visible、hover/current/disabled、市场涨跌、fresh/stale/missing/unknown、R0–R3、通知和图表；R3 另测长策略原因、无覆盖按钮、键盘/读屏与两主题对比。

# Design and Content Guidance

## Inspiration & Anti-patterns

工具侧借鉴 TradingView 等成熟研究工具的图表空间锚点、紧凑工具带、上下文面板、命令搜索和布局恢复。Agent 侧组合借鉴 Codex 的任务/审阅生命周期、Claude 的计划与权限纪律、Kimi 的后台任务与成果交付。

这些名称仅是交互启发，不构成集成、授权、能力等价或范围来源。禁止引入实盘券商连接、社交发布、社区脚本、付费增长、多 Agent、自动模型路由或代码 diff 作为所有研究产物的通用隐喻。TickDeck 的差异化合同是 Trust Strip、运行清单、事实/计算/解释/未知分离、R0–R3 和阶段门。

## Voice and Tone

语气专业、直接、可核查，不代替用户做投资判断。先说结果和影响，再说技术细节；错误文案必须说明“发生了什么、影响什么、系统做了什么、用户可以做什么”。

| 场景 | 推荐 | 禁止 |
|---|---|---|
| 数据不足 | “港股流通市值字段缺失；已排除依赖该字段的条件，结果为部分。” | “AI 已补全缺失信息。” |
| 零候选 | “在当前条件和数据时点下没有候选。” | “筛选失败，请放宽条件。” |
| 模型解释 | “模型解释：该变化可能与……相关；尚未验证因果。” | “系统确认将上涨。” |
| R2 | “确认后仅执行这一次模拟订单；参数变化会要求重新确认。” | “继续即可获得更高收益。” |
| R3 | “该操作被策略阻止：实盘下单不在产品范围内。” | “请联系管理员绕过。” |
| 不可复现 | “原数据因许可到期已清理；保留清单，但无法完整复跑。” | 静默展示旧结果为可复现 |

界面支持简体中文与 English。首次按当前浏览器或桌面 WebView 的语言选择，之后按当前客户端保存；证券简称、公告、研报和新闻保留来源语言并标注。Agent 默认跟随界面语言，任务可单独指定输出语言。代码、类型、清单字段和错误代码保持稳定英文命名。

# Key Flows

## UJ-1：周岚完成一次可审计的选股研究

1. 周岚从“筛选”描述条件；Agent 把自然语言转为可检查的规范化条件树，并标出未知口径。
2. 她确认口径；系统检查能力和 DataUsePolicy，冻结上下文后以确定性工具运行。
3. Review Canvas 展示候选或零候选、每项命中/未知证据、Trust Strip、风险和运行清单。
4. 她从候选进入工作台，核查图表、基本面、公告与新闻，保存筛选器和自选。
5. 通过 S4 后，她创建提醒；通知和触发证据分别可追踪。
6. **Climax：** 她在完整证据和组合影响可见的 R2 中决定是否加入模拟组合，而不是接受 Agent 替她拍板。
7. 失败路径：数据缺失、陈旧、超额或不支持时，系统贴近条件降级、拒绝或返回零候选；不补值、不静默换源。

## UJ-2：陈宇把策略想法变成可信验证

1. 陈宇描述策略意图；Agent 形成包含市场、周期、信号、仓位、风控、基准和执行假设的策略契约。
2. 他确认契约后查看、编辑 TypeScript 草稿；编译、能力和沙箱诊断定位到源码。
3. 系统冻结脚本、参数、数据、复权、引擎、费用和成交模型，运行预算内回测。
4. Review Canvas 展示收益、基准、回撤、交易、成本、偏差检查和复现清单。
5. 他运行样本外和敏感性验证，并比较多个运行。
6. **Climax：** 他基于证据决定保存哪个策略版本，并在 R2 中决定是否让其信号接入模拟组合。
7. 失败路径：编译、沙箱、数据、预算或市场规则失败时保留诊断；修改后生成新清单复跑，不覆盖证据。

## UJ-3：赵琪安全部署并维护一个受信工作区

1. 赵琪选择桌面客户端、本地 B/S 或远端 B/S；首次引导解释三种入口共享同一受保护工作区、Capability/Gate 和无 RBAC 边界。
2. 远端模式检查 HTTPS 代理、可信转发头、Host/Origin/WebSocket 和上游旁路；失败给出阻断与诊断。
3. 她创建数据连接器和模型档案；秘密只显示“已设置”，连接与能力测试保存精确版本结果。
4. 她检查许可用途、配额、费用和 TickDeck/连接器/模型分层健康。
5. **Climax：** 她显式选择本地签名 release set，先看到来源、版本、签名、备份和迁移影响，再触发升级；产品不自动联网检查或下载。升级或故障后，她预览脱敏诊断包，验证备份兼容性并恢复产物。恢复后，外部调用不会自动重启；secret reference 必须重新验证。
6. 失败路径：签名、版本兼容、迁移、秘密、代理、连接或恢复失败时阻止混合版本运行，保留升级前精确版本和可恢复数据，指出影响面和安全回退。

## UJ-4：林舟在没有商用数据时完成开源贡献

1. 林舟从贡献指引启动演示数据和兼容测试模型环境；所有表面明确标记 demo。
2. 他从四类受信扩展中选择一种脚手架，查看类型化契约、权限和稳定错误语义。
3. 他实现变更并运行类型、契约、边界、安全和文档检查；专有 SDK、真实数据和密钥不进入仓库。
4. 系统展示来源、哈希、锁定版本、SBOM、兼容范围和权限差异。
5. **Climax：** 林舟在没有商用授权的情况下完成可复现验证，并能清楚说明受信服务端扩展与受限沙箱脚本的不同风险。
6. 失败路径：缺少来源、权限清单、锁定版本或兼容证据时默认拒绝安装/发布，并提供本地修复路径。

## S0-V：冻结任务的廉价证伪

1. 产品维护者冻结真实任务、oracle、现有工具链基线和唯一合法数据路径。
2. 周岚分别执行现有流程与 TickDeck R0 只读流程；系统记录任务时间、实质错误/遗漏、人工修正和证据核查成本。
3. Agent 输出规范化条件树；oracle 计算 precision/recall，不能用主观“看起来正确”替代。
4. **Climax：** 两周内的第二次真实任务观察是否发生复用及净收益；SM-00 未通过则停止平台化建设。
5. 失败路径：样本、任务或数据权利不满足冻结条件时，实验标记无效，不进入 S1。
