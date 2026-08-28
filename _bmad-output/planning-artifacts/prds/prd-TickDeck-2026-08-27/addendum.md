# TickDeck PRD 补充材料

> 本文档保存不属于 PRD 能力正文、但对后续架构、UX、Epic 拆分和供应商验证有价值的技术约束、调研证据与方案边界。调研数据截止为 2026-08-27；厂商能力、授权和产品功能在使用前仍需重新核对。

## 如何使用本补充材料

| 读者 | 优先阅读 |
|---|---|
| 架构与工程 | 固定技术约束、连接器形态、Agent/沙箱、公共接口取舍 |
| UX 与产品 | 产品验证含义、数据能力降级、审批与单工作区边界 |
| 安全评审 | 应用访问、DataUse/Egress、秘密、沙箱和扩展供应链 |
| 供应商验证 | 市场数据厂商接入现实、授权问题和参考来源 |
| 开源维护者 | 交付边界、扩展契约、治理门槛和延期方向 |

## 产品验证状态

竞品能力分散只能支持“存在组合空白”，不能支持“用户愿意迁移”。因此，PRD 中定义的 S0-V 必须使用同一真实任务，对 Agent-on 与现有工具链进行对照评估，并同时验证任务时间、实质错误/遗漏、人工修正、证据核查成本和两周内二次复用。只提高生成速度、只获得正面访谈反馈或只完成一次演示均不能关闭产品 thesis。

OQ-02 的实验协议已于 2026-08-28 固定：至少 12 名符合 PRD §3.1 的用户，样本整体覆盖 A/港股合法数据使用者；每人至少两次同类真实选股任务，并分别使用现有工具链与 TickDeck；任务、oracle、盲审规则和现有工具链基线在实验前冻结。协议关闭不代表已完成招募或 SM-00；任何冻结条件不满足时实验无效且不得进入 S2。

为避免在证伪前建设完整双市场平台，S0-V 只使用一条合法真实数据路径、只读筛选工具和受限 R0 Agent。它不需要 TypeScript 沙箱、提醒、模拟组合或完整恢复系统；但仍需要冻结任务、oracle、数据许可和只读边界。若 PRD 中定义的 SM-00 未通过，则停止平台化建设。S0-V 通过后，双市场真实数据、完整的安全与恢复验收门槛仍是 v1.0 的硬性发布条件。

## 已给定的技术与交付约束

- 产品采用同一 Web 产品内核，正式支持 B/S 与桌面客户端；B/S 支持本地运行与远端自托管，桌面客户端封装同一受保护本地实例。
- 产品不建设完整用户体系；远端入口的身份认证交由反向代理承担。
- 指定技术栈：TypeScript、Fastify、React、shadcn/ui（Base UI）、Tailwind CSS、Mastra。
- 产品内的 TypeScript 指标和策略在沙箱中运行。
- 市场数据接口和 Agent 大模型接口必须可由部署者配置与替换。
- 官方演示数据只使用固定版本、固定种子的确定性合成生成器，不打包第三方真实历史行情；fixture 覆盖 A/港股关键市场语义和异常数据状态，始终标记 `demo/non-current`，不得关闭真实数据 Gate。
- 开源协议为 Apache-2.0。

## 当前联调条件

- 合法免费数据源是默认数据选项；当前尚未选定并完成 A/港股免费路径的许可、能力和健康验证，按 OQ-03 在 S1 前关闭。
- 当前没有可用于联调的 Wind、Choice、iFinD 等商用数据授权；商用或付费数据源仅为部署者主动配置的可选替代，不是发布前提，也不得默认优先。
- 默认免费源不因“免费”而自动取得真实数据资格；不满足参考能力画像时必须显式降级，不能冒充完整 v1.0 资格。

## 交付与运行边界

- v1.0 同时提供 B/S 与 Tauri 2 薄桌面客户端；桌面壳只负责窗口、启动、会话 bootstrap、安装和升级，不实现第二套业务逻辑。
- 桌面、本地 B/S 与远端自托管使用同一 React SPA、Fastify 控制面、Worker、工作区数据、Capability Manifest 和 Gate Registry；本地默认只监听回环地址。
- B/S 与桌面使用同一签名 product payload 和升级状态机；v1.0 不自动检查或下载升级，部署者显式导入本地签名 release set。桌面平台壳与共同 payload 可以分别更新，但必须绑定同一 Release Manifest、阻止混合版本打开工作区，并能回退到升级前的精确签名版本和数据。
- 远端入口的身份认证、HTTPS、访问日志和外层限流由部署者配置的反向代理承担。
- 一套实例对应一个受信工作区。v1.0 不实现用户、组织、RBAC、多租户或逐用户数据归属。
- 完整应用以 Apache-2.0 发布，不设置付费功能锁、许可证服务器、强制官方云账户或默认遥测。
- 数据、模型与基础设施可能产生第三方费用；费用不属于 TickDeck 收费。

## 技术栈约束

| 层级 | 已给定约束 | 后续架构需要回答的问题 |
|---|---|---|
| 语言与仓库 | TypeScript | 浏览器、服务端、沙箱 API 与扩展契约如何共享类型且不泄漏运行时边界 |
| 服务端 | Fastify | 持久化、任务队列、流式 Agent、扩展加载、健康检查和内部 API 边界 |
| 前端 | React、shadcn/ui（Base UI）、Tailwind CSS | 图表工作台布局、可访问性、长任务状态和风险确认交互 |
| Agent | Mastra | 工具注册、审批暂停/恢复、运行快照、幂等重试和模型能力测试 |
| 脚本运行 | TypeScript 沙箱 | 进程级或更强隔离、资源配额、编译产物、允许依赖和运行清单 |
| 部署 | B/S 本地/远端自托管 + Tauri 2 薄桌面客户端 | 双入口共用产品 payload、发行物、迁移、备份、秘密存储、会话 bootstrap 与反向代理参考配置 |

这些是输入约束，不等于已经完成架构设计。PRD 只规定安全、性能和兼容结果；具体组件、进程拓扑、数据库和沙箱技术由后续架构工作决定。

## 市场数据厂商接入现实

### 证据边界

- 以下仅描述厂商官方页面能够验证的接口形态。
- 当前没有真实账号或合同，因此字段、权限、限频、重连、缓存和远端部署均未完成 TickDeck 联调。
- “用户持有账号”只解决访问身份验证的一部分，并不自动获得缓存、展示、再输出、发送给外部模型或公网再分发的授权。
- “免费”只描述获取价格，不自动证明可持续访问、缓存、派生、发送模型、备份或再输出；默认免费路径必须接受与商用路径相同的许可、能力、溯源和契约测试。
- 免费路径不满足参考能力画像时，系统按能力矩阵降级，且不得静默切换到商用源；商用路径只有在部署者主动配置后才参与资格验证。

| 厂商 | 官方可验证形态 | 当前 TickDeck 状态 | 关键未知 |
|---|---|---|---|
| Wind | Client API、Server API/数据接口服务、实时行情服务；不同产品覆盖桌面集成、企业系统和实时行情 | 仅可设计中立契约与 mock，不能标记已支持 | 终端进程依赖、无人值守/容器权限、并发、缓存、远端共享、SDK 再分发 |
| Choice | 公开量化 API/SDK 指南，支持多语言和多平台；另有机构数据库交付 | 仅可设计中立契约与 mock，不能标记已支持 | 是否存在适合服务端集成的正式 HTTP 接口、终端或设备依赖、远端部署、缓存与再分发 |
| iFinD | 官方公开 Windows/Linux/ARM64 SDK 与 HTTP API，披露部分 Token、设备、IP 和 QPS 规则 | 三者中最可能率先获得试用验证，但当前仍未联调 | 免费/试用权限差异、港股深度、资讯全文、缓存、模型发送与公网展示 |

主要官方来源：

- [Wind Client API](https://www.wind.com.cn/portal/zh/ClientApi/index.html)
- [Wind 数据接口服务](https://www.wind.com.cn/mobile/WDS/sapi/zh.html)
- [Wind 实时行情服务](https://www.wind.com.cn/portal/zh/WDS/marketdata.html)
- [Choice 量化 API 官方指南](https://choice.eastmoney.com/choicewebfile/UserGuide.pdf)
- [Choice 数据服务](https://choice.eastmoney.com/product/datacenter)
- [Choice 产品最终用户许可协议](https://choice.eastmoney.com/html/userprotocol/userprotocol.html)
- [iFinD 下载中心](https://quantapi.51ifind.com/gwstatic/static/ds_web/quantapi-web/download.html)
- [iFinD 部署说明](https://quantapi.51ifind.com/gwstatic/static/ds_web/quantapi-web/help-center/deploy.html)
- [iFinD 权限说明](https://quantapi.51ifind.com/gwstatic/static/ds_web/quantapi-web/help-center/permission.html)

交易所一手规则也表明行情使用与再分发需要单独处理：

- [上证信息授权声明](https://www.sseinfo.com/aboutus/authstatement/)
- [港交所 Market Data Vendor Licence](https://www.hkex.com.hk/Services/Market-Data-Services/Real-Time-Data-Services/Data-Licensing/HKEX-IS/Market-Data-Vendor-Licence/Real_Time-Data?sc_lang=en)

### 可能的连接器执行形态

以下是后续架构需比较的机制，不是 PRD 决策：

1. HTTP/Server 型连接器：TickDeck Server 直接调用被授权的正式 HTTP 或 Server API。
2. 本地 SDK/终端型连接器：独立 bridge/sidecar 进程加载厂商 SDK，TickDeck 只调用自己的内部协议。
3. 文件/数据库型连接器：通过受控导入、同步或只读数据库访问获得数据。

无论采用哪种形态，都必须映射到统一能力矩阵、溯源信息、错误语义和健康状态。未经明确许可，不得把厂商二进制打包进 Apache-2.0 发行物。

## 竞品与邻近方案证据

| 产品/项目 | 官方可验证优势 | 与 TickDeck 的关系 | 不能据此推定的内容 |
|---|---|---|---|
| TradingView | 专业图表、筛选、提醒、Pine 指标/策略、策略测试、模拟交易；2026 年 AI Chart Copilot 已能解释图表、汇总数据、筛选和管理提醒 | 产品体验与基础工具对标 | 不代表用户可替换完整数据源/模型，也未证明 Agent 能运行 TickDeck 设想的完整研究与模拟闭环 |
| OpenBB | 可插拔 Provider、Workspace、自有 Agent/MCP 接入、自托管或 VPC 方案 | 数据与 Agent 接入的架构参照 | 不等于拥有 TickDeck 的图表中心、TypeScript 沙箱、回测和模拟组合闭环 |
| QuantConnect/LEAN | 开源事件驱动引擎、研究、回测、模拟与实盘；AI Assistant 可生成、修复和执行回测 | 策略验证、运行清单和 Agent 自动执行参照 | 不证明其对 A/港股个人投资 UX、权威本地数据和 TypeScript 脚本是一等支持 |
| Microsoft Qlib | A 股导向的 AI/量化研究、模型与回测框架 | A 股研究和因子工作流参照 | “AI-oriented”不等于全工具 LLM Agent，也不是完整个人研究工作台 |
| VeighNa | 国内市场接口、策略、回测、风控和本地模拟 | A 股市场语义和本地开发参照 | 核心并非 TradingView 类研究 UX，也未验证通用全工具 Agent |
| RQAlpha | 中国市场回测、事件、撮合、账户、成本和可替换数据源 | A/港股规则与撮合模型参照 | 免费数据和源码可见不等于可用于 TickDeck 的实时数据或无条件商业兼容 |

主要官方来源：

- [TradingView 功能总览](https://www.tradingview.com/features/)
- [TradingView AI Chart Copilot](https://www.tradingview.com/blog/en/tradingview-ai-chart-copilot-beta-57730/)
- [OpenBB Provider 文档](https://docs.openbb.co/odp/python/extensions/providers)
- [OpenBB Agent 集成](https://docs.openbb.co/workspace/developers/agents-integration)
- [QuantConnect LEAN](https://github.com/QuantConnect/Lean)
- [QuantConnect Backtest Assistant](https://www.quantconnect.com/docs/v2/ai-assistance/predefined-assistants/backtest-assistant)
- [Microsoft Qlib](https://github.com/microsoft/qlib)
- [VeighNa](https://github.com/vnpy/vnpy)
- [RQAlpha](https://github.com/ricequant/rqalpha)

截至调研截止日，现有官方资料尚未证明存在同时满足“A/港股优先 + 完整开源自托管 + 用户自带权威数据 + TradingView 类研究闭环 + 可配置模型 + 全工具权限 Agent + TypeScript 沙箱”的现成产品。这是当前差异化假设，不是市场需求已经被验证的证明。

## Agent 执行与审批参考

- OpenBB 展示了按工具启停、工具调用过程和结果引用的产品模式。
- Mastra 支持工具级审批以及运行暂停、拒绝和恢复；审批应视为运行状态，而不是聊天文本中的布尔值。
- TickDeck 需要在工具注册时声明类型、能力条件、风险等级、成本和幂等语义；模型不得自行放宽。

后续架构需要形成单一服务端策略入口：

1. 工具与扩展只声明基础风险，不能声明“无风险”来覆盖系统策略。
2. 最终风险取工具、参数、数据类别、目的端、预算和当前状态中的最高约束。
3. 授权载荷包含主体信息（来自受保护会话或可信代理）、参数哈希、状态版本、nonce、有效期和使用次数。
4. 工具真正执行前重新运行 schema、DataUsePolicy、EgressPolicy、风险和预算检查。
5. 通过 transaction outbox 或等价机制，确保业务副作用与追加式审计在故障恢复后保持一致。

参考：

- [OpenBB MCP Tools](https://docs.openbb.co/workspace/analysts/ai-features/mcp-tools)
- [Mastra Tool Approval](https://mastra.ai/blog/tool-approval)
- [Mastra Workflow Snapshots](https://mastra.ai/en/reference/workflows/snapshots)

## 回测与模拟真实性参考

TradingView Pine 和 QuantConnect 都明确区分历史执行、实时未确认数据、成交模型与真实市场。后续架构和 UX 必须使这些假设可见：

- bar/tick 执行与未确认 K 线语义；
- 手续费、税费、滑点、部分成交和成交粒度；
- A 股 T+1、涨跌停、停牌和市场单位；
- 港股交易单位、币种与费用；
- 数据修订、公司行动和无法完全复现；
- 参数扫描次数、样本内外和过拟合风险。

参考：

- [TradingView Pine Execution Model](https://www.tradingview.com/pine-script-docs/language/execution-model/)
- [TradingView Strategies](https://www.tradingview.com/pine-script-docs/concepts/strategies/)
- [QuantConnect Research Guide](https://www.quantconnect.com/docs/v2/cloud-platform/backtesting/research-guide)
- [QuantConnect Backtest/Live Reconciliation](https://www.quantconnect.com/docs/v2/cloud-platform/live-trading/reconciliation)

## TypeScript 沙箱证据与方案边界

官方资料给出的硬边界：

- Node.js 明确说明 node:vm 不是安全机制，不应用于运行不可信代码。
- Node Permission Model 是降低可信代码误操作的安全带，不保证隔离恶意代码。
- Worker 资源限制不能覆盖所有外部内存或确保宿主进程不受影响。
- SES/Compartment 可提供对象能力隔离，但仍需处理无限循环、内存消耗和宿主注入的能力，因此不能单独替代粗粒度隔离。

参考：

- [Node.js VM](https://nodejs.org/api/vm.html)
- [Node.js Permission Model](https://nodejs.org/api/permissions.html)
- [Node.js Worker Threads](https://nodejs.org/api/worker_threads.html)
- [Endo SES](https://github.com/endojs/endo/blob/master/packages/ses/README.md)

后续架构必须比较进程、容器、轻量虚拟化或其他隔离形态，并以 PRD 的安全结果和对抗测试为验收标准。不得把某个库名称直接当作“沙箱已安全”。

S0 前需要确定受支持的平台和粗粒度隔离方案；每个发布构建都必须在对应平台上运行固定的沙箱合规测试套件。参考默认资源档案为：编译 10 秒；指标预览 5 秒、512 MiB 内存、10 MiB 输出；策略回测 60 秒、1 GiB 内存、50 MiB 输出。架构可以收紧或增加受确认的高成本档案，但不能提供取消硬上限的开关。

## 模型接入边界

- 模型配置档案至少需要包含提供商、Base URL、API Key、Model ID、自定义请求头、超时、重试、上下文长度、计价信息与默认参数。
- 本地模型由部署者自行运行兼容服务；TickDeck v1.0 不承担模型下载、量化、显存管理或推理服务运维。
- 连接测试、对话测试或结构化工具握手测试只允许执行无副作用的单步 R0 查询；完整 Agent 模式需要按精确模型版本、提示版本和工具集通过代表性多步语义、风险、提示注入和取消测试。
- 模型输出不能作为行情或确定性计算来源；模型只规划、调用工具并解释结果。
- 自动回退到另一外部服务会改变成本和数据边界，因此 v1.0 明确不做静默回退。

## 扩展与公共接口取舍

v1.0 的稳定扩展面仅包括数据连接器、模型提供商适配器、Agent 工具和通知渠道；沙箱指标与策略使用独立脚本 API。每个扩展需要：

- 类型化输入、输出和统一错误语义；
- 标识、版本、兼容范围、能力与权限清单；
- 边界校验、演示实现和契约测试；
- 遵循语义化版本，优先采用向后兼容的增量变更，并设置明确的废弃期。

暂不承诺在线插件市场、远程一键安装、公共脚本社区或外部公共 REST API。B/S 与桌面共用的内部接口在 v1.0 以前可以随实现演进，不应由文档或示例暗示为稳定公共合同。

受信扩展的供应链记录至少包括来源、内容哈希、锁定版本、SBOM、权限、秘密引用、兼容范围和安装者确认。升级时必须展示权限差异；来源或哈希变化按新授权处理。运行时需要具备禁用、撤回和回滚路径。官方扩展的发布由 CODEOWNERS 指定的维护者审查。

## 可执行数据与出站策略边界

DataUsePolicy 不是免责声明或单个导出开关。其输入至少包括：

- 连接器和字段的授权用途与到期时间；
- 部署使用范围：单人本地、受信工作区、内网展示、公网展示、API 再输出；
- 数据类别：原始行情、历史缓存、资讯全文、摘要、派生指标、回测、组合、模型上下文；
- 动作：显示、缓存、派生、发送模型、发送 Webhook、导出、备份、清理。

任何未知值、冲突或授权到期默认拒绝。用途与出站约束必须继承至派生物、索引和备份，并维护数据资产清单，以便到期清理和不可复现标记。

EgressPolicy 统一治理模型、Webhook 和自定义端点，至少包含目的地址允许列表、数据最小化、独立凭据、预算、重定向限制，以及 SSRF、DNS rebinding、私网/环回/链路本地/云元数据地址防护。外部内容返回后仍按不可信数据处理，不能携带改变 Agent 权限的指令。

## 应用层访问边界

反向代理仍负责远端入口认证，但应用不能把任意到达上游端口的请求视为可信。浏览器或桌面 WebView 都不能仅凭回环地址获得信任，恶意站点也可以向回环地址发起请求，因此本地模式不能把“只监听 localhost”当成完整认证。所有模式需要：

- 实例级受保护会话；
- Host、Origin、CSRF、WebSocket 握手和 DNS rebinding 防护；
- 首次启动建立本地会话的安全引导。

远端模式额外需要：

- 可信代理来源与转发头校验；
- 上游端口旁路检测或启动阻断；
- 可信代理提供的身份信息仅用于审计；v1.0 不据此引入用户体系或 RBAC。

这一设计保持“无完整用户体系”决策，同时防止反向代理误配置直接暴露拥有全部工作区权限的服务。

## 秘密、备份与数据生命周期

- 普通配置只保存 secret reference，不保存凭据值；秘密管理机制需支持创建、轮换、撤销和失效诊断。
- 默认工作区备份排除秘密值；需要迁移秘密时使用单独加密包和不同恢复流程。
- 恢复后每个 secret reference 都要重新验证，不能因旧备份恢复而自动重新启用外部调用。
- 授权到期清理覆盖原始缓存、派生物、索引和备份；依赖被清理数据的运行清单和研究产物保留元数据，但标记为不可完全复现。

## 开源治理发布门槛

v1.0 RC 前应公开：

- 项目维护者、CODEOWNERS 与关键权限恢复方式；
- RFC、破坏性变更、发布和回滚流程；
- Issue/PR 首响目标与支持版本窗口；
- 安全报告渠道、72 小时确认和 7 天初步分级目标；
- 当前稳定次版本和前一个次版本的严重安全修复窗口。

如果项目维护者无法完成一次发布/安全响应演练，项目可以继续 beta，但不满足 v1.0 的可持续维护承诺。

## 已排除或延期的替代方向

| 方向 | 处理 | 理由 |
|---|---|---|
| 完整复制 TradingView 全球资产与全部工具 | 排除 v1.0 | 对标范围限定为 A/港股股票核心研究任务 |
| ETF、期货、期权、外汇、加密、美股 | 延期 | 避免资产语义和数据授权同时扩张 |
| 实盘下单与券商连接 | 排除 v1.0 | 产品定位是研究与模拟；显著扩大合规和操作风险 |
| 账户、RBAC、多租户 | 排除 v1.0 | 远端入口的身份认证交给反向代理，一实例一受信工作区 |
| 官方托管 SaaS | 排除 v1.0 | 维持本地掌控和零软件费用承诺 |
| 自动多模型路由与多 Agent 编排 | 延期 | 先验证单 Agent 全工具闭环、风险与成本治理 |
| 任意 npm 依赖和 node:vm 沙箱 | 排除 | 无法满足不可信代码安全结果和可复现要求 |
| 公共 REST API 与插件市场 | 延期 | 先限制公共表面，避免过早承担兼容和权限合同 |
