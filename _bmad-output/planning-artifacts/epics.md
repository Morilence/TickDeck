---
stepsCompleted:
  - step-01-validate-prerequisites
  - step-02-design-epics
  - step-03-create-stories
  - step-04-final-validation
inputDocuments:
  - _bmad-output/specs/spec-tickdeck/SPEC.md
  - _bmad-output/specs/spec-tickdeck/contract-index.md
  - _bmad-output/planning-artifacts/prds/prd-TickDeck-2026-08-27/prd.md
  - _bmad-output/planning-artifacts/prds/prd-TickDeck-2026-08-27/addendum.md
  - _bmad-output/planning-artifacts/ux-designs/ux-TickDeck-2026-08-27/DESIGN.md
  - _bmad-output/planning-artifacts/ux-designs/ux-TickDeck-2026-08-27/EXPERIENCE.md
  - _bmad-output/planning-artifacts/architecture/architecture-TickDeck-2026-08-27/ARCHITECTURE-SPINE.md
---

# TickDeck - Epic 与 Story 分解

## Overview

本文档把 TickDeck 的 SPEC、PRD、补充材料、UX 合同与架构合同分解为可实施、可测试、可验收的 Epic 和 Story。阶段 Gate、开放项、范围排除和上游稳定 ID 均为承重合同。

## Requirements Inventory

### Functional Requirements

FR-001: 配置数据连接器。部署者可以创建、测试、启用、停用和诊断多个数据连接器；凭据不得回显给浏览器或 Agent。
FR-002: 声明能力矩阵。每个连接器必须声明市场、标的类型、实时或延时状态、K 线周期、历史起点、盘口深度、基本面、资讯、配额、健康状态和许可用途。
FR-003: 标记连接器成熟度。系统必须区分仅骨架、试用验证、正式授权验证和允许再分发；未联调连接器不得显示为可用。
FR-004: 附带数据溯源信息。图表、筛选、指标、回测、Agent 和模拟组合使用的数据必须可查看来源、时间、时区、币种、复权、完整性和新鲜度。
FR-005: 提供演示数据。无论是否配置默认免费或可选商用真实数据，部署者和贡献者都能使用固定版本、固定种子的确定性合成数据完成核心界面、Agent、回测、模拟组合和扩展测试；数据必须明确标记 `demo/non-current`，不得打包第三方真实历史行情，也不得冒充默认免费真实路径或生产资格。
FR-006: 显式降级。数据缺失、陈旧、超额、断连或不支持时，系统必须显示相应状态并降级、拒绝或返回零结果，不得静默补值或换源。
FR-007: 处理 A/港股市场语义。相关功能必须识别交易日历、币种、复权、停牌、涨跌停、T+1、最小交易单位、费用和公司行动差异。
FR-008: 搜索与切换标的。用户可以按代码、名称和市场搜索支持的股票与指数，并看到当前连接器支持状态。
FR-009: 展示行情图形。用户可以查看 K 线和常用价格图形；可用周期和盘中深度必须服从能力矩阵。
FR-010: 管理窗格与叠加。用户可以在主图或独立窗格添加价格比较、成交量、内置指标和沙箱指标。
FR-011: 比较标的与基准。用户可以在统一时间和币种口径说明下比较多个股票或指数。
FR-012: 检查单点数据。十字光标和数据检查器必须显示时间、OHLC、成交信息、指标值、数据状态和未完成 K 线状态。
FR-013: 使用核心绘图工具。用户可以创建、编辑、隐藏和删除常用趋势、水平、区间和测量类绘图。
FR-014: 保存研究布局。用户可以保存、复制、恢复和删除图表布局，并从 Agent 产物或其他研究模块打开关联布局。
FR-015: 管理自选列表。用户可以创建多个自选列表，增删和排序标的，并查看可配置行情与研究列。
FR-016: 构建组合筛选。用户可以使用行情、技术、基本面、市场和连接器支持的字段，组合筛选条件、排序规则和排除项。
FR-017: 保存并复跑筛选器。用户可以保存筛选定义、数据口径和排序，基于后续时点的数据复跑并比较结果变化。
FR-018: 展示匹配证据。每个筛选结果必须展示命中条件、未满足或未知条件、关键数值、数据溯源信息和进入标的工作台的入口。
FR-019: 支持零候选与受控导出。系统允许返回零候选；导出结果必须尊重数据许可和部署配置，不得默认开放批量再输出。
FR-020: 展示公司资料。用户可以查看由当前连接器提供的公司、行业、上市地和证券基础资料。
FR-021: 展示财务与关键指标。用户可以按报告期查看财务报表和关键指标，系统必须区分原始字段与派生计算。
FR-022: 展示公司行动。分红、送转、拆并股、停复牌和其他可用公司行动必须与图表、复权和模拟组合处理关联。
FR-023: 聚合公告与新闻。用户可以按标的和时间查看连接器允许展示的公告与新闻，并进入对应图表时间点。
FR-024: 处理缺失和许可限制。无权限、无全文、延时或仅有摘要时，系统必须明确标记，不得以模型补写原文。
FR-025: 创建提醒。用户可以基于价格、指标、筛选条件或策略信号创建提醒，并设置标的范围、频率和有效期。
FR-026: 管理提醒生命周期。用户可以查看、暂停、恢复、编辑、测试和删除提醒；编辑后必须保留版本和后续生效时间。
FR-027: 发送通知。v1.0 至少支持产品内通知和部署者配置的 Webhook；失败必须重试受控并可诊断。
FR-028: 记录触发证据。每次触发必须保存条件、数据时间、计算版本、结果和通知状态；提醒本身不得提交模拟订单。
FR-029: 提供内置指标。v1.0 提供覆盖趋势、动量、波动和成交量的常用指标，具体发布目录在 alpha 前冻结。
FR-030: 提供 TypeScript 编辑体验。用户可以创建指标或策略，获得类型提示、格式化、错误定位、运行日志和只读运行上下文说明。
FR-031: 暴露窄化脚本 API。沙箱脚本只能访问版本化、类型化的市场数据、指标和回测 API，不能直接访问服务端环境或存储。
FR-032: 编译与试运行。系统必须在正式运行前完成编译、类型校验、能力校验和受限试运行，并把诊断关联到源码位置。
FR-033: 强制资源与依赖限制。每次运行必须强制执行 CPU、内存、实际经过时间、输出、数据请求和并发配额；只允许使用版本锁定的内置 API 和明确列入允许范围的依赖。
FR-034: 版本化脚本。保存或覆盖脚本时必须创建可追踪版本，记录作者来源为手动或 Agent、源码哈希、依赖和兼容范围。
FR-035: 连接图表与信号。指标输出可视化到图表；策略信号可用于回测、提醒和经确认的模拟组合接入，但不能直接访问组合存储。
FR-036: 建立策略契约。运行前必须明确市场、标的范围、周期、信号、仓位、风控、基准和执行假设；关键缺口阻止运行。
FR-037: 冻结运行输入。每次回测必须生成运行清单，记录脚本、参数、数据范围、数据源、复权、引擎、费用和成交模型。
FR-038: 模拟 A/港股执行。回测按适用市场处理交易日历、停牌、涨跌停、T+1、最小单位、手续费、税费、滑点和公司行动。
FR-039: 输出完整报告。报告至少包含累计与年化收益、基准比较、最大回撤、波动、换手、交易明细、持仓变化和成本影响。
FR-040: 检查常见偏差。系统必须检测或警示未来函数、前视偏差、未确认 K 线、数据泄漏、预热不足、幸存者偏差风险和明显参数过拟合。
FR-041: 支持样本外与敏感性验证。用户可以划分样本内外，并对关键参数和成本假设执行受预算控制的敏感性分析。
FR-042: 比较和复跑。用户可以比较多个回测运行，并从运行清单复跑；数据或版本不可得时必须说明不可完全复现。
FR-043: 管理长时运行。回测和参数扫描必须显示进度、资源与成本，允许取消；超预算任务需遵循 Agent R2 或用户手动确认。
FR-044: 管理模拟组合。用户可以创建、重命名、归档、复制和重置多个模拟组合。
FR-045: 管理多币种现金。组合可以记录人民币和港币现金、换汇假设、费用和总资产估值口径。
FR-046: 提交模拟订单。用户可以提交受支持的市价单或限价单，也可以撤单或变更订单数量；Agent 提交每笔订单必须逐次确认。
FR-047: 执行模拟撮合。撮合必须遵循当前数据粒度、市场时间、停牌、涨跌停、T+1、最小单位、费用和成交模型，并披露无法模拟的现实因素。
FR-048: 记录订单与成交。订单、确认、拒绝、部分成交、撤单、费用和重试必须形成不可混淆的历史记录。
FR-049: 核算持仓与绩效。组合必须确定性计算持仓、成本、已实现与未实现盈亏、现金、收益、回撤和币种影响。
FR-050: 处理公司行动。分红、拆并股、送转和其他当前数据支持的公司行动必须以可审计方式影响现金与持仓。
FR-051: 接入策略信号。用户可以把已保存策略接入模拟组合；启用、停用和每次 Agent 订单仍遵循风险确认，不构成无人值守自动交易。
FR-052: 接受自然语言目标。Agent 可以在图表、标的、筛选器、脚本、回测或组合上下文中接受任务，并明确当前使用的上下文范围。
FR-053: 规划并调用产品工具。Agent 可以组合调用查询、筛选、计算、图表、资讯、脚本、回测、提醒和模拟组合工具；不存在的能力不得由模型模拟。
FR-054: 展示执行过程。Agent 运行必须显示计划、当前阶段、工具名、参数摘要、来源、耗时、费用、状态和失败原因，并允许用户查看结果引用。
FR-055: 完成可审计选股。对选股任务，Agent 必须结构化条件、检查能力、用确定性工具筛选、返回候选证据与不确定项、允许零候选，并把最终判断留给用户。
FR-056: 完成可信策略验证。对策略任务，Agent 必须形成策略契约、生成可编辑 TypeScript、完成沙箱检查、运行受控回测、检查偏差并生成运行清单。
FR-057: 执行 R0 自动操作。只读查询、确定性计算、预算内单次回测和临时草稿可自动执行，但必须留痕。
FR-058: 执行 R1 范围授权。可撤销的低风险持久化操作需首次确认；授权必须限定工具、对象、范围和有效期。
FR-059: 执行 R2 逐次确认。覆盖或删除产物、启用外部通知、高成本运行、向新外部服务发送数据、启用策略和模拟订单必须逐次展示影响并确认。
FR-060: 阻止 R3 操作。Agent 不得执行实盘下单、输出密钥、绕过数据许可、让沙箱脚本获得宿主权限或绕过风险策略。
FR-061: 绑定确认状态。确认必须绑定精确工具、参数、运行 ID、数据或组合状态、工具版本和有效期；相关状态变化后必须重新确认。
FR-062: 管理预算与取消。部署者和用户可以设置数据、模型、运行时间和并发预算；运行显示消耗并支持取消，未经批准不得超预算。
FR-063: 暂停、恢复与幂等。等待确认、断线或故障后的 Agent 运行可以安全恢复；持久化工具和模拟订单不得因重试重复执行。
FR-064: 生成可追溯产物。Agent 结论必须引用工具结果与数据溯源信息，明确事实、计算、模型解释和未知项；模型不得把建议描述为确定收益或替用户拍板。
FR-065: 管理模型配置档案。部署者可以配置提供商、Base URL、API Key、Model ID、请求头、超时、重试、上下文、价格和默认参数。
FR-066: 测试模型能力。系统必须针对精确的模型版本、提示版本和工具集组合，验证连接、流式输出、结构化输出、工具调用、上下文长度、取消能力、多步语义正确性和提示注入抵抗，并保存最近测试结果。
FR-067: 分级 Agent 模式。仅通过连接和结构化调用握手的模型最多使用无副作用的单步 R0 查询工具；只有通过代表性多步语义、风险与注入基准的精确模型/提示/工具集组合才能进入完整 Agent 模式。
FR-068: 选择模型且不静默回退。用户可以设置默认模型并在任务前切换；系统不得未经确认自动切换到另一外部提供商。
FR-069: 披露模型使用。每个 Agent 运行必须展示模型、上下文范围、Token 与费用估算；凭据和完整提示默认不得写入普通日志。
FR-070: 提供完整 B/S 与桌面发行物。Apache-2.0 发行必须提供 B/S 入口和桌面客户端，两者复用同一图表、Agent、回测、模拟组合、工作区数据与 Capability/Gate 合同，不得建立第二套桌面业务实现，也不使用付费功能锁、许可证服务器或强制官方云登录。
FR-071: 支持桌面、本地 B/S 与远端 B/S 模式。桌面客户端封装受保护的本地回环实例；本地 B/S 默认只监听回环地址；远端 B/S 提供反向代理、HTTPS 和认证配置指南，但不内置完整用户体系。三种入口不得产生能力、数据语义或授权差异。
FR-072: 明示单工作区边界。产品必须说明所有通过代理进入实例的人共享同一权限和数据，不提供用户归属、RBAC 或多租户隔离。
FR-073: 持久化核心产物。配置、自选、布局、筛选器、提醒、脚本、回测、模拟组合和审计记录必须持久保存并具有一致标识。
FR-074: 备份、恢复与迁移。部署者可以备份和恢复完整工作区；升级前可检查兼容性，迁移失败不得破坏现有可恢复数据。
FR-075: 保护秘密。数据与模型凭据只保存在服务端秘密存储，不进入浏览器、Agent 上下文、普通日志、导出或模拟记录。
FR-076: 提供健康与诊断。部署者可以查看连接器、模型、沙箱、任务队列、通知和存储健康状态，并导出脱敏诊断包。
FR-077: 支持四类受信扩展。v1.0 正式支持数据连接器、模型提供商适配器、Agent 工具和通知渠道扩展。
FR-078: 提供类型化扩展契约。每个扩展必须声明标识、版本、兼容范围、能力、权限、配置结构、输入输出和统一错误语义。
FR-079: 验证外部边界。第三方配置、响应和内容必须经过结构与内容校验；资讯或工具结果中的指令性文本不得改变 Agent 权限或系统行为。
FR-080: 提供贡献脚手架。项目必须提供演示实现、生成模板、契约测试和无商用密钥的验证路径。
FR-081: 区分脚本与受信扩展。产品和文档必须明确沙箱脚本受限运行，而服务端扩展是部署者主动安装并承担权限风险的受信代码。
FR-082: 版本化与废弃。v1.0 后公共扩展契约遵循语义化版本，优先采用向后兼容的增量变更；废弃能力至少跨一个次版本提供警告和迁移说明，只维护一个当前主版本。
FR-083: 限制公共表面。v1.0 不提供在线插件市场、公共脚本社区、远程一键安装或受支持的外部 REST API；应用内部接口不得宣传为公共契约。
FR-084: 实施参考能力画像。系统必须以机器可读契约验证 §6.4 的真实 A 股和港股数据路径；演示数据不能满足生产资格。
FR-085: 阻止无真实数据发布。v1.0 发布检查必须确认至少一条 A 股和一条港股路径处于正式授权验证状态，并保存授权用途、验证证据和到期时间。
FR-086: 执行数据使用策略。服务端必须从连接器授权、部署使用范围、数据类别和目标动作编译默认拒绝的数据使用策略，统一裁决缓存、派生、模型发送、导出、通知、备份和清理。
FR-087: 管理数据生命周期。系统必须维护原始缓存、派生数据、索引、研究产物和备份的数据资产清单；授权到期或撤销时执行清理或标记不可复现，并保留不含受限数据的审计证据。
FR-088: 执行统一出站策略。模型、Webhook 和自定义端点调用必须经过目的地址允许列表、数据分类与最小化、凭据隔离、预算和重定向检查，并阻止服务器端请求伪造（SSRF）、DNS 重绑定（DNS rebinding）和跨主机凭据转发。
FR-089: 建立应用层受保护会话。本地回环和远端部署都必须建立实例级受保护会话并防护 CSRF；代理身份可用于审计，但不形成 v1.0 用户/RBAC。
FR-090: 验证浏览器、桌面 WebView、代理与网络边界。所有部署模式必须校验 Host、Origin 和 WebSocket 握手并防护 DNS rebinding；桌面 WebView 不得绕过应用会话或获得独立业务授权路径；远端模式还必须配置可信代理来源、校验转发头，并提供上游端口旁路检测或启动阻断。
FR-091: 统一计算最终风险。最终风险等级由服务端策略引擎依据工具、参数、数据类别、目的端、成本和状态计算；扩展或模型只能提高，不能降低风险。
FR-092: 使用不可重放授权。R1/R2 授权必须绑定受保护会话或可信代理主体、工具和参数哈希、状态版本、一次性随机数（nonce）、有效期和使用次数。
FR-093: 保证审计与副作用一致。批准、状态修改、模拟订单和审计记录必须通过事务发件箱（transaction outbox）或等价机制形成可恢复的一致结果；审计记录采用追加式数据结构（schema）。
FR-094: 验证 Agent 语义。选股任务必须生成可审核的规范化条件树并以 oracle 数据计算 precision/recall；策略任务必须通过信号、持仓、市场规则陷阱和多步工具行为基准，编译成功不足以通过。
FR-095: 执行沙箱合规套件。支持平台必须运行固定版本的逃逸、宿主对象、依赖投毒、网络/文件访问、无限循环、内存和输出耗尽测试；资源配置档案和测试证据随发布保存。
FR-096: 管理秘密生命周期。所有凭据使用秘密引用（secret reference），支持创建、轮换、撤销和失效诊断；默认备份排除秘密，可选秘密备份必须独立加密并在恢复时重新确认。
FR-097: 治理受信扩展供应链。安装与升级必须记录来源、哈希、锁定版本、软件物料清单（SBOM）、权限差异和秘密访问；支持禁用、撤回和回滚，官方扩展必须经过代码所有者审查。
FR-098: 执行 Parity Rubric。v1.0 发布必须在真实 A/港股路径上完成 §6.5 的版本化任务量表，不能以静态页面、占位数据或单元测试替代端到端验收。
FR-099: 发布开源治理规则。v1.0 RC 前必须公开项目维护者、CODEOWNERS、RFC 与发布流程、支持窗口、贡献首响目标和安全报告/响应时限。
FR-100: 强制切片 Gate。构建计划、版本说明和发布检查必须引用 §6.6 当前切片；前一切片未 Go 时，后续能力只能实验，不能进入 v1.0 承诺。

### Non-Functional Requirements

NFR-001: 服务冷启动不超过 30 秒。
NFR-002: 应用工作台可交互时间 p95 不超过 3 秒。
NFR-003: 已缓存标的切换和图表呈现 p95 不超过 1 秒。
NFR-004: 载入 10,000 根 K 线后，常规缩放和平移保持不低于 45 FPS。
NFR-005: 对 10,000 个标的和 30 个已准备字段执行普通筛选，p95 不超过 5 秒。
NFR-006: 长时筛选、回测和 Agent 运行持续显示进度、耗时、成本并可取消；不设置脱离任务复杂度的统一完成时限。
NFR-007: 相同运行清单在相同引擎版本上产生数值等价的确定性结果。
NFR-008: 数据源或模型故障不得破坏已保存产物；降级或换源必须显式。
NFR-009: 所有持久化工具和模拟订单具备幂等键与明确重试语义。
NFR-010: 保存、升级和迁移失败不得留下无法识别或无法恢复的半写入状态。
NFR-011: 备份恢复覆盖配置、研究产物、脚本、回测、模拟组合和审计记录。
NFR-012: 未完成 K 线、数据修订、连接器版本变化和无法完全复现的条件必须可见。
NFR-013: 所有外部输入、第三方响应和扩展配置在系统边界进行类型与内容校验。
NFR-014: 日志默认结构化并脱敏，不记录秘密或完整提示上下文。
NFR-015: 诊断包在导出前列出内容并自动脱敏。
NFR-016: 沙箱执行与主服务形成可验证的故障和权限隔离。
NFR-017: 风险确认、拒绝、超时、恢复、工具执行和模拟订单形成可查询审计记录。
NFR-018: 发布版本不得包含已知的严重级依赖项漏洞；发现严重问题时可以禁用受影响能力并发布修复指引。
NFR-019: v1.0 默认不启用遥测，不要求实例向官方服务回连。
NFR-020: 健康页区分 TickDeck 自身状态、数据连接器状态和模型提供商状态。
NFR-021: 核心旅程达到 WCAG 2.2 AA，包括完整键盘操作、可见焦点、非纯颜色表达和屏幕阅读器标签。
NFR-022: v1.0 桌面优先；B/S 支持当前及前两个主要版本的 Chrome、Edge、Firefox 和 Safari，桌面客户端在五个固定 Release Profile 的系统 WebView 上通过同一核心旅程、可访问性和阶段表面验收；移动端不进入验收。
NFR-023: 界面提供简体中文和英文；安装、数据授权、安全和贡献指南提供双语版本。
NFR-024: 代码、公共类型、扩展清单和错误代码使用一致的英文命名。
NFR-025: 没有合格真实数据路径或外部模型时，演示数据与兼容测试模型仍能完成 UJ-3、UJ-4 和核心界面验收；演示数据不影响默认免费源的优先级，也不能通过真实数据资格 Gate。
NFR-026: 功能模块只能依赖已声明的类型化契约，外部可观察但未承诺的行为不得写入扩展文档。
NFR-027: 公共扩展契约、迁移说明和契约测试与实现同时发布。
NFR-028: 数据连接器、模型、Agent 工具、通知和脚本 API 都能报告自身版本与兼容范围。
NFR-029: 关键计算和权限策略具有自动化回归基准，不依赖模型输出来判定测试通过。
NFR-030: alpha 调整性能或成功指标时必须保留原基线、测试环境、变更理由和新目标。
NFR-031: 参考能力画像的字段、许可、限频、断线、重连、复权和历史/实时一致性契约测试通过率为 100%。
NFR-032: 数据使用策略对未知许可、未知数据类别、未知目标动作和授权到期状态均默认拒绝，并具有属性测试。
NFR-033: 本地与远端模式的未授权状态修改、错误 Host/Origin、CSRF、跨站 WebSocket 和 DNS rebinding 攻击或绕过尝试的成功率必须为 0；远端模式的伪造转发头和上游端口旁路尝试的成功率也必须为 0。
NFR-034: 出站测试必须覆盖私网与云元数据 SSRF、DNS rebinding、危险重定向和跨主机凭据转发；攻击或绕过尝试的成功率必须为 0。
NFR-035: 已使用、过期、参数不匹配或状态版本过期的 Agent 授权重放成功率为 0。
NFR-036: 在进程崩溃、网络中断和重试注入测试下，业务副作用与追加式审计记录最终一致，重复模拟订单为 0。
NFR-037: 每个支持平台和发布构建必须通过同一固定版本沙箱合规套件，并保存测试环境、用例版本和结果。
NFR-038: 默认备份不得包含秘密值；加密秘密备份在无正确解密材料时恢复成功率为 0，恢复后必须重新验证所有 secret reference。
NFR-039: 官方和受信扩展发行物必须生成 SBOM、来源和哈希；缺少锁定版本或权限清单时安装默认拒绝。
NFR-040: v1.0 RC 前治理、支持与安全响应政策必须公开并由项目维护者完成一次演练。

### Additional Requirements

CAP-1 — 数据与能力治理：部署者可配置和替换数据连接器，系统仅按实际能力、许可与溯源为 A/港股任务供数；成功条件为 FR-001–FR-007、FR-084–FR-087、SM-10、NFR-031–NFR-032 全部通过。
CAP-2 — 图表工作台：用户可在统一工作台搜索、打开、检查、比较、绘制和保存 A/港股及基准行情上下文；成功条件为 FR-008–FR-014、Parity 任务 1–5、SM-11 及关联性能与无障碍合同通过。
CAP-3 — 自选、筛选与研究证据：用户可管理自选、组合筛选并审阅基本面、公司行动、公告新闻和逐项证据，允许零候选；成功条件为 FR-015–FR-024、SM-02、SM-04 通过且无静默补值、换源或许可绕过。
CAP-4 — 提醒与通知证据：用户可创建和管理价格、指标、筛选与策略提醒，并分别追踪触发证据和通知投递；成功条件为 FR-025–FR-028、SM-16 及 AD-26 状态合同通过。
CAP-5 — TypeScript 策略与可信回测：用户和 Agent 可创作受限 TypeScript 指标或策略，并执行可复现、偏差可见的确定性回测；成功条件为 FR-029–FR-043、SM-03、SM-05、SM-07、SM-11 通过。
CAP-6 — 模拟组合：用户可在不连接券商的模拟组合中管理多币种现金、订单、成交、持仓、绩效与公司行动；成功条件为 FR-044–FR-051、SM-12、SM-16 通过且每笔 Agent 模拟订单均逐次确认。
CAP-7 — 可审计 Agent 与风险 Gate：Agent 可把自然语言目标编排为可审计、可取消和可恢复的产品工具运行，但不拥有权限、计算真值或投资决定；成功条件为 FR-052–FR-064、FR-091–FR-094、SM-00、SM-04、SM-06、SM-17 通过。
CAP-8 — 可替换模型与资格分级：部署者可配置可替换模型端点，并按精确 `model + prompt + toolset` 资格决定可用 Agent 模式；成功条件为 FR-065–FR-069、SM-01R、SM-17 通过且不存在静默 provider 回退。
CAP-9 — 双入口自托管工作区生命周期：部署者可通过桌面、本地 B/S 或远端 B/S 运行同能力的受保护单工作区，并持久化、备份、恢复、迁移和诊断；成功条件为 FR-070–FR-076、FR-088–FR-090、FR-096、SM-01、SM-01R、SM-13、SM-14 通过。
CAP-10 — 开源扩展与供应链治理：贡献者可用演示路径开发四类受信扩展，部署者可核验其合同、来源、权限、SBOM、禁用与回滚；成功条件为 FR-077–FR-083、FR-097、FR-099、SM-15、NFR-039–NFR-040 通过，且不以外部贡献人数判定成功。
CAP-11 — 阶段与发布资格：系统和发布流程只注册当前阶段已获证据授权的能力，并在 Stop/Narrow 条件发生时停止或收窄；成功条件为 FR-098、FR-100、AD-2 的 Capability/Release Manifest 一致性及 S0-V→S5 全部 Gate 规则通过。

AR-STARTER-01: Epic 1 Story 1 必须采用架构指定的 starter：pnpm/Cargo workspace、同源 Vite React SPA、Fastify 控制面、Worker 与 Rust crate 结构，并以架构锁定的 `shadcn@4.19.0 create --preset "https://ui.shadcn.com/init?base=base&style=vega&baseColor=neutral&theme=neutral&iconLibrary=lucide&font=inter&menuAccent=subtle&menuColor=default&radius=default&template=vite" --template vite` 初始化 UI；提交 resolved preset、digest、`components.json` 与 registry source digests。初始构建不引入 Nx/Turborepo。
AR-AD-01: Fastify 控制面是会话、命令、状态机、Gate、策略、持久化、审计、outbox 与任务准入的唯一权威；Worker 仅通过受认证、版本化的同主机 IPC 执行，v1 不引入跨主机拓扑或外部消息代理。
AR-AD-02: Gate Registry 必须按 `S0-V → S0 → S1 → S2 → S3 → S4 → S5` 顺序，以带 source digest 的 PRD 阶段矩阵和 canonical capability catalog 生成一致的 web/server/worker Capability Manifest；未通过 Gate 的能力不得注册或挂载，`locked`/`suspended` 仅可出现在诊断中。
AR-AD-03: `packages/core` 唯一定义领域模型和命令，`packages/contracts` 唯一定义传输 schema、事件和错误；每类可变领域数据只有一条控制面写路径，并以 `OperationIdentity`、RFC 8785 参数 digest、幂等键和 expected state version 防止分叉与重放。
AR-AD-04: 权威命令必须在单个串行 SQLite 事务内完成校验、幂等占用、领域变更、审计与 outbox/job；RunContext 创建后不可变，任务使用租约和 fencing epoch，外部效果不明进入 `UNCERTAIN`，取消、恢复和状态投影遵循架构固定状态机。
AR-AD-05: R1 是受范围、对象、状态、策略与期限约束的可撤销授权；R2 是服务端签发、绑定完整运行与状态摘要、单次消费且不可重放的 Grant，所有呈现、确认、失效、阻止、消费、结果与恢复分别审计。
AR-AD-06: 单工作区仍必须建立受保护会话；本地 B/S、桌面与远端分别遵循精确 Host/Origin、CSRF、WebSocket、DNS rebinding、代理与一次性 bootstrap 合同，秘密不得进入 URL/argv/environment/log/Web JS，并通过 owner-only IPC 和 WorkspaceIdentity 安全接管既有实例。
AR-AD-07: DataUsePolicy 必须把连接器授权、部署范围、数据类别、动作和到期编译为服务端 `ALLOW | DENY`，未知/冲突/过期默认拒绝，并把最严格限制传播到派生物、索引、回测、模型、导出和备份。
AR-AD-08: 模型、Webhook、自定义端点和外部数据连接器的全部出站都必须经过 Worker Egress Gateway，执行精确 recipient/allowlist、DNS/IP、重定向、凭据、数据最小化与预算校验；v1 不自动联网检查或下载更新。
AR-AD-09: Connector Broker 统一供应商 capability、policy、重试、健康、错误与 provenance；SDK 只能在获批 trusted sidecar 中运行。秘密进入独立 Vault，Worker 仅取得绑定 operation/version/epoch 的短期 lease；模型档案与资格按精确 provider/model/prompt/toolset 锁定且不得静默回退。
AR-AD-10: SQLite WAL 是唯一数据库，控制面是数据库和同主机内容寻址 Artifact Service 的唯一访问者；工件严格遵循 `STAGING → VERIFIED_UNCOMMITTED → COMMITTED → QUARANTINED | DELETED`，并以短期 ArtifactCapability、usage ledger 与 lineage 约束读写。
AR-AD-11: 备份必须来自一致 SQLite 快照，只包含已提交工件并受 DataUsePolicy 过滤；默认排除秘密和授权。恢复先在临时工作区验证后原子切换并增加 workspace generation，使旧会话、Grant、租约和 Worker 结果失效。
AR-AD-12: 用户 TypeScript 必须编译为 WebAssembly Component，在一次性 `sandbox-host`/Wasmtime 进程和平台级进程树终止边界中运行，只暴露版本化 TickDeck WIT；所有资源上限、稳定错误、五平台矩阵和 FR-095/NFR-037 证据必须通过，不得降级到较弱沙箱。
AR-AD-13: HTTP snapshot 是客户端状态权威，SSE/受限 WebSocket 只通知变化且序号缺口必须重取快照；浏览器与 Fastify 使用同一 Draft 7 schema 和锁定 Ajv profile，错误、Trust/Risk/Agent/通知 read model 由服务端版本化提供。
AR-AD-14: Mastra Agent 只通过端口编排当前 Gate 注册的工具，不得直接访问 DB、文件、网络、秘密或连接器；每次工具调用重新校验 schema、DataUse、Egress、risk、budget 和 state，确定性代码拥有金融计算真值，结果必须分离事实、计算、模型解释和未知。
AR-AD-15: 前端必须是由 Fastify 同源提供的 Vite React SPA，不使用 SSR、独立前端服务、CDN、运行期字体或 service worker；路由/Query/Zustand/Form 各守状态边界，敏感或权威状态不得进入 URL/localStorage/IndexedDB，并通过锁定 resolver conformance corpus。
AR-AD-16: 图表固定通过 Lightweight Charts 5.2.1 的 TickDeck adapter，表格通过 TanStack Table/Virtual 的领域适配层，Monaco 仅在 S3 懒加载；第三方序列化、Canvas 坐标、浏览器脚本执行均不得成为领域或计算权威，并须提供键盘及非 Canvas/非虚拟化等价路径。
AR-AD-17: 双语、格式化与 WCAG 2.2 AA 是共享合同；服务端只返回稳定英文 code/参数，`FinanceFormatter` 统一展示，light/dark/system、红涨绿跌、data/risk/health token、焦点、命中区和不截断要求必须跨页面一致。
AR-AD-18: 每个 Release Profile 必须生成自包含、签名且可回退的同 digest product payload，并同时进入 B/S archive 和桌面 envelope；Release Manifest 固定依赖、SBOM、兼容、再分发、NOTICE 与沙箱证据，五平台不得依赖系统另装 Node/Wasmtime/compiler。
AR-AD-19: Audit Ledger 与运行日志分离，使用连续序号和哈希链形成可验篡改的追加账本；只保存脱敏结构，不夸大为可抵抗主机 root 的 tamper-proof，默认遥测关闭。
AR-AD-20: 验收必须组合 Vitest/Testing Library、Storybook+axe、MSW 和 Playwright，并覆盖真实 B/S 浏览器、五个系统 WebView、双入口 exact-bits 等价、故障注入、键盘/读屏与完整发布矩阵；模型输出和覆盖率数字不能替代 oracle。
AR-AD-21: v1.0 发行与项目使用 Apache-2.0，不得包含付费锁、license server、强制官方云账户或默认遥测；双语指南、维护者、CODEOWNERS、RFC/发布/回滚、支持窗口和安全响应演练是 RC Gate。
AR-AD-22: 稳定受信扩展仅为 data connector、model adapter、Agent tool adapter、notification channel；扩展以本地不可变 bundle 安装，必须声明类型、版本、权限、来源、hash、SBOM、SecretRef 与 destination，任何来源/hash/权限变化都按重新授权处理。
AR-AD-23: 回测、比较和模拟组合必须共享一个版本化 `ExecutionAssumption` 并冻结进 RunContext，明确成交时点、费用税费、滑点、市场规则、公司行动、修订、样本内外和敏感性；unknown 必须警告或阻止。
AR-AD-24: 官方 demo connector 只能使用固定版本/种子的确定性合成数据并常驻 `demo/non-current`；必须覆盖 A/港股关键 fixture 与 UI/contract 测试，但永不计入真实数据资格、生产成熟度或完整模型资格。
AR-AD-25: 控制面必须提供分层 Health Snapshot 和 Diagnostic Manifest，分开运行健康与 qualification/Gate；诊断导出前展示内容，统一执行 SecretRef、session/grant、DataUse 和 payload 脱敏并写入审计。
AR-AD-26: 提醒触发证据与通知投递必须作为独立 aggregate 持久化；TriggerIdentity 唯一化同一业务事实，delivery 重试只能在重新校验策略后追加 attempt，不能重算或覆盖触发证据。
AR-AD-27: server↔worker、worker↔sidecar 统一使用 TickDeck Local RPC v1，固定 HTTP/1.1 over UDS/named pipe、handshake、schema/error、1 MiB 控制体上限、受限 artifact stream、deadline、并发/背压、显式取消和无隐式重试语义。
AR-AD-28: `InstrumentId`、`ListingId`、`MarketCalendarRef`、`MarketDataSnapshotRef`、`CorporateActionBasis` 和 `CurrencyAmount` 必须由 core 唯一定义；所有能力、RunContext、R2、审计和工件引用同一 snapshot digest，不得以裸 symbol 或 mutable latest 代替。
AR-AD-29: 每次外部效果在拨号前必须由控制面基于最新 policy/risk/R1/recipient/connector/secret/budget epoch 原子签发并消费单次 `ExecutionAuthorization`；撤销竞态与不确定在途效果按既定成功/失败/reconcile/UNCERTAIN 语义处理。
AR-AD-30: 一个签名 product payload 同时服务 B/S 与 Tauri 2 薄桌面入口；桌面不得建立第二套 renderer/API/领域/授权路径。WorkspaceIdentity、data root 锁、版本单调性、双重签名、本地 staged release set 和 UpgradeCoordinator/rollback 状态机必须按 AD-30 全部执行。
AR-AD-31: 全产品权威金融数值必须完整实现 AD-31：`finance-decimal` 独占 decimal.js 10.6.0、34 位 half-even context、规范 DecimalString/FinancialValueEnvelope、lossless ingress、DomainQuantization/DecimalEvidence/DeterministicReductionSpec、SQLite DecimalSortKey、opaque WIT resource、非权威 Web/chart projection、稳定错误和单一跨边界 conformance manifest；任何 binary float 或格式化文本不得成为权威。
AR-AD-32: 首次 `bmad-build` 与 Story 1.1 必须完整实现 AD-32 的单一跨语言工程质量合同：根级精确工具版本和 lockfile、16 个直接 pnpm member、非 workspace 的 `tools/quality`、逐包 lifecycle-build allow/deny 与实际 blocked 集精确比较、typed runtime/type-only/build-codegen/test-dev edges、Web/node-runtime/neutral-shared/node-config-only/test-overlay 五类 TypeScript profile、根级 ESLint/Prettier/Web-only Stylelint/Commitlint/Husky/lint-staged/EditorConfig/rustfmt/Clippy、canonical ignores、workspace/dependency/generated validators、Rust 1.98.0 locked checks、独立 CI required contexts 及外部 branch-rules 证据；工程骨架存在不注册任何产品 capability，也不关闭 OQ-06。
AR-CON-01: AD-1–AD-32 必须共同遵守 Consistency Conventions：规范命名、稳定 ID/version、RFC 8785 + domain-separated SHA-256、UTC 与市场时点分离、统一 command/event/error、脱敏日志与哈希链审计、版本化配置、WorkspaceIdentity、Release/Upgrade、确定性测试，以及由 AD-32 根级配置唯一拥有并调度的工程质量约定。
AR-STACK-01: 实现必须采用 `ARCHITECTURE-SPINE.md#Stack` 中截至 2026-08-28 锁定的全部精确版本，特别是 Node.js 24.20.0、pnpm 11.24.0、TypeScript 6.0.3、Rust 1.98.0 以及 AD-32 列出的精确 ESLint、Prettier、Stylelint、Commitlint、Husky、lint-staged、types 和测试工具 pin，并以 `pnpm-lock.yaml`、`Cargo.lock` 与 Release Manifest artifact hash 固定；旧 TypeScript 7.0.2/“TS7-compatible”证据已被取代，不得使用 latest、版本范围、替代版本或省略适用依赖。
AR-STRUCT-01: 仓库必须遵循 Structural Seed 的 `apps/web|desktop|server|worker`、`packages/contracts|core|policies|storage-sqlite|artifact-fs|connectors-*|models|notifications|agent-mastra|testkit`、`wit/tickdeck-sandbox`、`crates/product-supervisor|sandbox-host`、`tools/component-compiler` 及单向依赖边界。
AR-GATE-01: S0-V–S5 的 registration ceiling、Go 与 Stop/Narrow 必须作为每个 Story 的阶段前置与验收边界；前一 Gate 未 Go 时，后续 Story 只能保留为 blocked/未授权计划，不能实施或挂载。
AR-BLK-01: S0-V 开始前必须冻结唯一合法真实数据路径、任务、oracle、现有工具链基线、只读/R0 边界和实验记录方式；A-01 未由 SM-00 关闭前不得视为产品 thesis 已验证。
AR-BLK-02: S0 沙箱能力注册受 OQ-06 证据余项阻塞：必须先锁定 compiler/componentizer/source-map、WIT/WASI 版本、确定性输出并在五个平台通过 FR-095/NFR-037；接口或 AD-12 已采纳不等于能力可用。
AR-BLK-03: S0 Release Profile 受五平台最低 OS/libc/system WebView 开放项阻塞；必须通过实际 B/S archive、桌面 envelope、安装/启动/升级/回滚与 CI 证据后才能宣称相应平台支持。
AR-BLK-04: S0 秘密管理就绪受 Vault 加密算法/库/KDF/轮换迁移/headless secret-file 格式开放项阻塞；在安全评审锁定并验证前必须保持 `LOCKED`/fail-closed。
AR-BLK-05: S1 受 OQ-03 阻塞：必须分别选择并独立验证合法免费 A 股和港股路径；不合格时收窄市场或保持 beta，不能静默使用商用源替代。
AR-BLK-06: S2 受实际 alpha 招募和有效 SM-00 证据阻塞；OQ-02 只关闭了实验协议，至少 12 名合格用户、冻结条件和有效结果未满足时不得进入 S2。A-02/A-05 仍须按各自 SM 关闭。
AR-BLK-07: OQ-04 的法律文本必须在公开 beta 前依据实际数据源、模型和通知路径核对；OQ-05 只可在首轮 alpha 后保留原基线、环境、结果和理由再调整 NFR-001–NFR-006。
AR-BLK-08: 精确模型、通知渠道和官方连接器必须在各自阶段按许可、版本、权限、来源、hash、健康、manifest 与 Gate 逐项登记；adapter 或接口存在不构成授权。
AR-SCOPE-01: Story 不得引入实盘/券商/无人值守交易、ETF/基金/债券/期货/期权/外汇/加密/美股等新一等资产、用户/组织/RBAC/多租户、官方 SaaS、跨主机、移动验收、完整离线、社交/课程/公共脚本社区、在线市场/远程安装、公共 REST API、多 Agent、自动模型路由或模型托管；重开项必须先有新产品决策。

### UX Design Requirements

UX-DR-001: UI 基础必须使用项目锁定的 shadcn `base-vega`、Base UI、Tailwind CSS variables、neutral base、Lucide、官方默认 registry 和 official-first/compose-before-extend 策略；不得平行引入 Radix/New York、第三方 registry 或自写基础 primitive。
UX-DR-002: 必须实现 DESIGN.md 的完整 token 合同：默认 shadcn 语义 token、行情/数据/风险专用颜色、字体层级、4px spacing、圆角和组件尺寸；mock 像素值不得覆盖正式 token 或默认 variant。
UX-DR-003: A/港股使用红涨绿跌，但涨跌、success/warning/danger、data nature/availability 与 R0–R3 必须使用互不混淆的文字、图标和形态；任何语义都不得只靠颜色。
UX-DR-004: 浅色、深色、跟随系统是等价主题；首次跟随系统，显式选择只按客户端保存，切换不得重置图表、任务、焦点或 Gate，并尊重 reduced motion。
UX-DR-005: App Shell 只挂载当前 Gate 已通过的表面，Navigation Rail 只分研究/系统任务域；不得使用 disabled menu、lock teaser 或 placeholder 暗示未授权能力，Agent 只能作为右侧伴随面板。
UX-DR-006: 桌面布局必须为 Navigation Rail、可折叠 Context Drawer、中央 Chart Canvas、可折叠 Agent Panel；面板可调宽并仅本地记忆，中央图表最小 640px，Review Canvas 关闭后精确恢复对象、时间范围、缩放、宽度、展开项和滚动位置。
UX-DR-007: 响应式合同必须覆盖 `≥1600px` 双侧展开、`1280–1599px` 默认收起 Context Drawer、`<1280px` 单面板 focus mode；正式验收下限 1280×720，空间不足时不得裁切 R2、错误、权限或数据状态。
UX-DR-008: Trust Strip 必须常驻每个数据驱动表面，折叠态显示 source、data time、nature/availability、snapshot ID，展开态显示 fetched-at、last sync、时区、币种、复权、完整性、connector version/hash、许可用途/到期和影响范围。
UX-DR-009: Trust Strip 必须独立组合 `real|delayed|demo|partial` 与 `fresh|stale|missing|unsupported|unknown`，并以文字、图标和影响短语说明当前动作的降级/拒绝；真实来源不得暗示实时、完整或许可已确认。
UX-DR-010: Chart Canvas 必须支持行情图形、窗格/叠加、绘图、键盘平移缩放、十字光标同步 Data Window、未完成/修订 K 线可见和非颜色多序列表达；Canvas 之外必须提供同步可访问的数据表。
UX-DR-011: Context Drawer 必须承载自选、对象树和 Data Window，支持折叠、调宽和本地记忆；切换抽屉内容不得改变 Agent 已冻结上下文。
UX-DR-012: Agent Panel 必须以可移除的 Context Chips 准备上下文，提交时冻结快照；页面切换不得改变运行输入，S0-V 仅出现 R0，`waiting|paused|recovered` 只能从 S2 起出现，完整产物不得塞入窄侧栏。
UX-DR-013: Run Timeline 必须区分计划、当前步骤、工具事件、Gate、结果；高风险、失败、重试和降级自动展开，S0-V 只显示 R0 过程，预算、待确认和暂停/恢复从 S2 起出现。
UX-DR-014: Risk Gate 必须实现合同列出的 R0/R1/R2/R3 全部状态与合法转换；pending R2 的完整绑定摘要不可折叠，R3 只能显示原因、策略来源、审计 ID 和安全替代路径且绝无覆盖入口。
UX-DR-015: R2 界面必须显示 subject/session、run ID、tool@version、参数 hash、snapshot/manifest、数据状态、portfolio version、DataUse/Egress judgment、成本/出站/组合影响、有效期、single-use 与剩余次数；任一绑定变化必须失效并展示差异。
UX-DR-016: Risk Gate 必须覆盖刷新/后退/重开、通知深链、快捷键/直接 URL、服务重启、并发标签页和网络重试竞态；只有首次匹配消费可产生副作用，其余返回 consumed/conflict/state-changed 而不重复执行。
UX-DR-017: Review Canvas 必须稳定分区呈现事实、确定性计算、模型解释、未知项和运行清单，支持来源深链，并覆盖 loading/ready/partial/not-reproducible/error。
UX-DR-018: Notification Center 是持久权威记录，必须支持 unread/read/action-required/delivery-failed、筛选与深链；Toast 仅作不抢焦点的瞬时提示，相同 run 更新合并且重要事件必须落入中心。
UX-DR-019: 提醒 UX 必须把条件触发证据与通知投递状态分开显示；Webhook 失败只能追加可诊断重试，不得覆盖或重新计算既有触发事实，提醒不能直接提交订单。
UX-DR-020: Data Table 必须提供等宽数字、稳定列、排序/筛选/列设置、字段级数据状态和键盘操作；虚拟化必须保持 row identity/focus/读屏上下文，并提供非虚拟化可访问分页模式。
UX-DR-021: Command Palette 使用 `Ctrl/⌘+K`、分组命令、作用域和快捷键尾注；危险动作只能导航到完整确认界面，不能由命令或快捷键直接确认/执行。
UX-DR-022: Form Control 必须继承 Base UI 表单语义，错误贴近字段，secret 只显示已设置而不回显；视觉高度 32px，控件/label 与 resize separator 的命中区至少 24×24px。
UX-DR-023: Status Badge 必须使用短文本、图标/形态和可访问名称；Empty State 必须解释 first-use、zero-result、no-capability、no-license 的原因、数据边界和合法下一步，零候选是可接受成功态。
UX-DR-024: Diagnostic Panel 必须分开 TickDeck、连接器、模型、沙箱、队列、通知与存储健康，并列出 enabled/blocked capability；导出前预览字段和脱敏结果，本地下载与外部发送是两个独立动作。
UX-DR-025: Theme Control 必须提供 light/dark/system 三项单选并预览解析主题；语言偏好同样仅按客户端保存。
UX-DR-026: 所有一级表面必须覆盖 EXPERIENCE.md 的状态矩阵：筛选、工作台、运行与健康、连接与模型、策略实验室、提醒、模拟组合、通知中心和扩展的 first-use/loading/partial/error/blocked 等适用状态不得遗漏。
UX-DR-027: 通用异步 UX 必须使用不伪造数据的稳定 skeleton，超过基线显示耗时和取消/诊断；错误保留最近已验证内容及时间，断网显示最后同步和受影响动作，不冒充完整离线。
UX-DR-028: Agent、回测和其他长任务必须统一显示 queued/running/waiting/paused/completed/failed/canceled/interrupted 及恢复 provenance；刷新、导航或关闭客户端不取消任务，只有显式停止请求才终止。
UX-DR-029: 长任务事件必须保存并呈现 run ID、manifest/version、步骤/进度、cursor、耗时/成本、subject/session、policy/risk、重试/幂等 ID、最后成功时间和错误；高频更新可合并但不得抹去状态转换。
UX-DR-030: 深链必须定位 Trust Strip、时间线节点、通知和报告来源；失败时保留对象 ID、版本和原因，不得无解释跳回首页。Context Chips 重新绑定必须生成新清单版本并记录差异。
UX-DR-031: 键盘事件优先级固定为 IME/原生输入 → modal → editor/table/chart scope → global；Escape 逐层关闭并正确回返焦点，所有快捷键必须有菜单/按钮等价入口，R2/R3 不得有确认或覆盖快捷键。
UX-DR-032: 草稿可自动保存并显示时间；正式版本覆盖必须产生新版本或进入 R2，删除必须说明影响与可恢复性，R1 必须显示范围/有效期/撤销，R3 必须显示安全替代。
UX-DR-033: Agent 结果的运行清单必须包含冻结上下文、tool@version、参数/hash、snapshot/manifest、精确 model、prompt hash、toolset、qualification manifest、费用和 policy/risk 状态；不得混写事实、计算、解释与未知。
UX-DR-034: 完整 Agent 模式只允许通过资格测试的精确 `model + prompt hash + toolset`；失败/到期/不匹配时只能降到合同允许的单步无副作用 R0，并显示原因，禁止静默切换 provider/model/prompt/toolset。
UX-DR-035: 策略/回测界面必须披露市场、周期、信号、仓位、风控、基准、执行假设、费用税费、滑点、未确认 K 线、样本内外、偏差、成本和复现状态；模拟组合披露无法模拟的现实因素。
UX-DR-036: 受保护会话失效时 App Shell 必须保存安全草稿并转入重新验证；首次引导必须说明桌面/本地 B/S/远端 B/S 共享一个工作区、同一 Capability/Gate 且没有用户/RBAC 隔离。
UX-DR-037: UI 必须支持 `zh-CN`、`en-US` 和 pseudo-long；根 `lang` 随界面更新，来源内容保留原语言标记，Agent 默认跟随界面但任务可指定语言，代码/类型/manifest/error code 保持英文。
UX-DR-038: 中文、英文和 1.5× 伪本地化必须在 100%/200% 缩放下通过；风险、许可、数据状态、Gate、错误及长 model/provider ID 不得截断，需换行或提供可聚焦展开/复制并保留完整 accessible name。
UX-DR-039: 核心旅程必须达到 WCAG 2.2 AA：正确原生/Base UI 语义、`aria-current`、Tabs roving tabindex、装饰 SVG 隐藏、命名 region、焦点回返和顺序均按合同实现。
UX-DR-040: focus-visible 必须至少等效 2px 实线、2px offset、与相邻颜色 3:1，并有非颜色形态；滚动容器需 scroll padding，R2 出现时焦点进入 Gate，完成/拒绝后回到触发动作。
UX-DR-041: 图表必须以蜡烛形态、正负号/箭头、线型/marker 和文字图例提供非颜色表达；键盘进入时播报名称/范围/帮助，逐点只播当前点且可退出。
UX-DR-042: 动态状态只使用一个简短去重的 polite live summary；失败、R2 待确认/到期、恢复和 Trust 实质变化单独播报，不能朗读每条工具日志或用虚假百分比表示未知进度。
UX-DR-043: Notification Center、Dialog、Command、Drawer、虚拟化表格和 resize separator 必须实现合同规定的进入/关闭焦点、rowcount/index、focused row pin、排序后焦点、方向键/Home/End 与重置行为。
UX-DR-044: 验收 fixture 至少覆盖 `light/dark/system × zh-CN/en-US/pseudo-long × 1280×720/1440×900/1600×1000 × 100%/200%`，并检查正文/辅助文字、焦点、状态、行情涨跌、数据状态、R0–R3、通知和图表；R3 需另测长原因与无覆盖。
UX-DR-045: 文案必须专业、直接、可核查，先说明结果和影响，再说明细节；错误必须包含发生了什么、影响什么、系统做了什么和用户可做什么，禁止模型补值、收益承诺、强迫放宽条件或管理员绕过措辞。
UX-DR-046: UJ-1 必须闭合“条件→规范化树→能力/DataUse 检查→确定性筛选→候选/零候选证据→工作台研究→S4 提醒→R2 模拟组合决定”，所有降级、拒绝和不确定项可见。
UX-DR-047: UJ-2 必须闭合“策略契约→可编辑 TypeScript→编译/能力/沙箱诊断→冻结清单→回测→样本外/敏感性→比较→R2 策略信号接入”，失败时保留诊断并以新清单复跑。
UX-DR-048: UJ-3 必须闭合三入口引导、远端代理/网络校验、连接器/模型秘密和资格、分层健康、签名本地 release set、升级/回退、诊断、备份恢复与 SecretRef 重验；失败必须阻止混合版本并保留可恢复状态。
UX-DR-049: UJ-4 必须让无商用数据贡献者通过 demo/test model、四类扩展脚手架、类型/契约/安全/文档测试及来源/hash/SBOM/权限检查完成可复现贡献，并明确受信扩展与受限脚本的风险差异。
UX-DR-050: S0-V 必须只呈现冻结任务、唯一合法真实数据路径、只读筛选、受限 R0 Agent、oracle、对照指标和两周复用观察；样本/任务/数据权利无效时显示实验无效并阻止进入 S1，绝不出现沙箱、提醒、组合、R1/R2 或后续导航 teaser。
UX-DR-051: Visual References 只用于布局、密度、层级与状态关系；正式规范以 DESIGN.md/EXPERIENCE.md 为准。各 scenario 必须保持独立运行/工作区身份，target v1.0 mock 不得被解释为当前 0.x 能力或真实供应商资格。
UX-DR-052: App Shell、Navigation Rail、Agent Panel/Run Timeline、Trust Strip、Review Canvas、Data Table、Form Control、Status Badge、Empty State、Theme Control 最早为 S0-V；Context Drawer/Chart Canvas/Command Palette/Diagnostic Panel 最早 S1；Risk Gate S2；Monaco S3；Notification Center S4，所有表面必须遵守该最早阶段。

### FR Coverage Map

FR-001: Epic 3 - 配置数据连接器
FR-002: Epic 3 - 声明能力矩阵
FR-003: Epic 3 - 标记连接器成熟度
FR-004: Epic 3 - 附带数据溯源信息
FR-005: Epic 2 - 提供演示数据
FR-006: Epic 3 - 显式降级
FR-007: Epic 3 - 处理 A/港股市场语义
FR-008: Epic 3 - 搜索与切换标的
FR-009: Epic 3 - 展示行情图形
FR-010: Epic 3 - 管理窗格与叠加
FR-011: Epic 3 - 比较标的与基准
FR-012: Epic 3 - 检查单点数据
FR-013: Epic 3 - 使用核心绘图工具
FR-014: Epic 3 - 保存研究布局
FR-015: Epic 3 - 管理自选列表
FR-016: Epic 3 - 构建组合筛选
FR-017: Epic 3 - 保存并复跑筛选器
FR-018: Epic 3 - 展示匹配证据
FR-019: Epic 3 - 支持零候选与受控导出
FR-020: Epic 3 - 展示公司资料
FR-021: Epic 3 - 展示财务与关键指标
FR-022: Epic 3 - 展示公司行动
FR-023: Epic 3 - 聚合公告与新闻
FR-024: Epic 3 - 处理缺失和许可限制
FR-025: Epic 6 - 创建提醒
FR-026: Epic 6 - 管理提醒生命周期
FR-027: Epic 6 - 发送通知
FR-028: Epic 6 - 记录触发证据
FR-029: Epic 5 - 提供内置指标
FR-030: Epic 5 - 提供 TypeScript 编辑体验
FR-031: Epic 5 - 暴露窄化脚本 API
FR-032: Epic 5 - 编译与试运行
FR-033: Epic 5 - 强制资源与依赖限制
FR-034: Epic 5 - 版本化脚本
FR-035: Epic 5 - 连接图表与信号
FR-036: Epic 5 - 建立策略契约
FR-037: Epic 5 - 冻结运行输入
FR-038: Epic 5 - 模拟 A/港股执行
FR-039: Epic 5 - 输出完整报告
FR-040: Epic 5 - 检查常见偏差
FR-041: Epic 5 - 支持样本外与敏感性验证
FR-042: Epic 5 - 比较和复跑
FR-043: Epic 5 - 管理长时运行
FR-044: Epic 6 - 管理模拟组合
FR-045: Epic 6 - 管理多币种现金
FR-046: Epic 6 - 提交模拟订单
FR-047: Epic 6 - 执行模拟撮合
FR-048: Epic 6 - 记录订单与成交
FR-049: Epic 6 - 核算持仓与绩效
FR-050: Epic 6 - 处理公司行动
FR-051: Epic 6 - 接入策略信号
FR-052: Epic 4 - 接受自然语言目标
FR-053: Epic 4 - 规划并调用产品工具
FR-054: Epic 4 - 展示执行过程
FR-055: Epic 1 - 完成可审计选股
FR-056: Epic 4 - 完成可信策略验证
FR-057: Epic 1 - 执行 R0 自动操作
FR-058: Epic 4 - 执行 R1 范围授权
FR-059: Epic 4 - 执行 R2 逐次确认
FR-060: Epic 4 - 阻止 R3 操作
FR-061: Epic 4 - 绑定确认状态
FR-062: Epic 4 - 管理预算与取消
FR-063: Epic 4 - 暂停、恢复与幂等
FR-064: Epic 4 - 生成可追溯产物
FR-065: Epic 4 - 管理模型配置档案
FR-066: Epic 4 - 测试模型能力
FR-067: Epic 4 - 分级 Agent 模式
FR-068: Epic 4 - 选择模型且不静默回退
FR-069: Epic 4 - 披露模型使用
FR-070: Epic 8 - 提供完整 B/S 与桌面发行物
FR-071: Epic 2 - 支持桌面、本地 B/S 与远端 B/S 模式
FR-072: Epic 2 - 明示单工作区边界
FR-073: Epic 2 - 持久化核心产物
FR-074: Epic 8 - 备份、恢复与迁移
FR-075: Epic 2 - 保护秘密
FR-076: Epic 2 - 提供健康与诊断
FR-077: Epic 7 - 支持四类受信扩展
FR-078: Epic 7 - 提供类型化扩展契约
FR-079: Epic 7 - 验证外部边界
FR-080: Epic 7 - 提供贡献脚手架
FR-081: Epic 7 - 区分脚本与受信扩展
FR-082: Epic 7 - 版本化与废弃
FR-083: Epic 7 - 限制公共表面
FR-084: Epic 3 - 实施参考能力画像
FR-085: Epic 3 - 阻止无真实数据发布
FR-086: Epic 2 - 执行数据使用策略
FR-087: Epic 6 - 管理数据生命周期
FR-088: Epic 2 - 执行统一出站策略
FR-089: Epic 2 - 建立应用层受保护会话
FR-090: Epic 2 - 验证浏览器、桌面 WebView、代理与网络边界
FR-091: Epic 2 - 统一计算最终风险
FR-092: Epic 2 - 使用不可重放授权
FR-093: Epic 2 - 保证审计与副作用一致
FR-094: Epic 1 - 验证 Agent 语义
FR-095: Epic 2 - 执行沙箱合规套件
FR-096: Epic 2 - 管理秘密生命周期
FR-097: Epic 7 - 治理受信扩展供应链
FR-098: Epic 8 - 执行 Parity Rubric
FR-099: Epic 8 - 发布开源治理规则
FR-100: Epic 8 - 强制切片 Gate

## Epic List

### Epic 1: 用真实只读任务证伪 Agent 选股价值
Alpha 用户可以在唯一冻结的合法真实数据路径上完成同任务对照，获得可审计的条件树、候选或零候选证据与运行记录；产品维护者可以依据 SM-00 作出 Go/Stop，而不先建设完整平台。
**阶段：** S0-V
**FRs covered:** FR-055、FR-057、FR-094
**CAP 覆盖：** CAP-7、CAP-11（S0-V 限定切片）
**依赖与 Gate：** 开始前须冻结合法数据路径、任务、oracle、现有工具链基线、样本协议和只读/R0 边界；SM-00 未通过即 Stop/Narrow，不启动 Epic 2。
**实施与 UX 边界：** Epic 1 Story 1 使用 AR-STARTER-01；产品表面仅含 S0-V 获准的 App Shell、筛选、Trust Strip、R0 Agent Panel/Run Timeline、Review Canvas、Data Table、Empty State 与对照记录，不出现沙箱、提醒、组合、R1/R2 或后续导航 teaser。

### Epic 2: 安全启动并维护可复现的受信工作区
自托管部署者可以通过受保护的本地 B/S、远端 B/S 或 Tauri 薄桌面入口启动同一工作区内核，使用明确标记的演示路径，并检查会话、Gate、策略、任务恢复、沙箱证据、秘密与诊断状态。
**阶段：** S0
**FRs covered:** FR-005、FR-071–FR-073、FR-075–FR-076、FR-086、FR-088–FR-093、FR-095–FR-096
**CAP 覆盖：** CAP-9、CAP-11；为其余 CAP 提供共同运行底座但不授权后续能力
**依赖与 Gate：** 仅在 Epic 1 / SM-00 Go 后启动；OQ-06 证据余项、五平台最低基线和 Vault 精确方案继续作为 blocker，未关闭前相关能力保持未注册或 `LOCKED`。
**实施与 UX 边界：** 交付统一控制面/执行面、Capability/Gate、RunContext、SQLite/Artifact、DataUse/Egress/Risk、会话、双入口壳、恢复与诊断；只挂载 S0 已通过表面，不显示 S1+ 业务能力。

### Epic 3: 在合格 A/港股数据上完成图表—筛选—证据研究
用户可以配置并验证合法 A 股与港股真实数据路径，在同一工作台搜索标的、查看和比较图表、管理自选与筛选，并审阅基本面、公司行动、公告新闻及逐项数据证据。
**阶段：** S1
**FRs covered:** FR-001–FR-004、FR-006–FR-024、FR-084–FR-085
**CAP 覆盖：** CAP-1、CAP-2、CAP-3
**依赖与 Gate：** Epic 2 的 S0 Gate 通过且 OQ-03 独立资格调研关闭；任一市场没有合法合格路径时必须收窄市场或保持 beta，不得静默改用商用源。
**实施与 UX 边界：** 新增 Context Drawer、Chart Canvas、Command Palette、Diagnostic Panel 和连接/模型诊断；研究闭环不依赖完整 Agent、策略、提醒或组合，所有数据面常驻 Trust Strip 并允许显式降级和零候选。

### Epic 4: 让单 Agent 生成可保存、可复跑的选股证据
用户可以在已合格的双市场研究上下文中，以自然语言形成可审核的规范化条件树，由通过资格的单 Agent 编排当前阶段工具，并在 R0–R3、预算、取消、恢复和审计约束下保存与复跑证据产物。
**阶段：** S2
**FRs covered:** FR-052–FR-054、FR-056、FR-058–FR-069
**CAP 覆盖：** CAP-7、CAP-8；产品化 CAP-3 的 Agent 旅程
**依赖与 Gate：** Epic 3 / S1 Go；OQ-02 只关闭协议，实际合格招募、有效 SM-00 证据及 A-02/A-05 对应前置未满足时不得进入 S2。
**实施与 UX 边界：** 完整 Agent Panel/Run Timeline、Risk Gate、模型资格、冻结 Context Chips、事实/计算/解释/未知分区、不可重放授权与恢复；仍禁止多 Agent、自动模型回退和任何 S3+ 工具注册。

### Epic 5: 创作 TypeScript 策略并完成可信验证
量化开发者可以编写和版本化受限 TypeScript 指标或策略，在已通过证据门的 Wasmtime Component 沙箱中编译、试运行和回测，并审阅偏差、样本外、敏感性、成本及复现清单。
**阶段：** S3
**FRs covered:** FR-029–FR-043
**CAP 覆盖：** CAP-5
**依赖与 Gate：** Epic 4 / S2 Go；compiler/componentizer/source-map、WIT/WASI、确定性输出和五平台 FR-095/NFR-037 证据必须已允许沙箱能力注册。
**实施与 UX 边界：** 新增懒加载 Monaco、策略实验室与回测 Review Canvas；共享 ExecutionAssumption、金融十进制和 snapshot/manifest 权威，编译成功不能替代语义、偏差与行为 oracle。

### Epic 6: 把研究转成提醒与模拟组合闭环
用户可以把价格、指标、筛选或策略条件变成可追踪提醒，并在不连接券商的模拟组合中管理多币种现金、订单、成交、持仓、绩效和公司行动；每笔 Agent 模拟订单都由人逐次确认。
**阶段：** S4
**FRs covered:** FR-025–FR-028、FR-044–FR-051、FR-087
**CAP 覆盖：** CAP-4、CAP-6
**依赖与 Gate：** Epic 5 / S3 Go；不能证明副作用一致性、市场规则 oracle、应用/出站安全和数据生命周期正确时，不启用 Agent 模拟交易。
**实施与 UX 边界：** 新增提醒、Notification Center、模拟组合与完整 R2 组合影响；触发证据和通知投递分离，Toast 不作权威记录，提醒不得直接下单，实盘和无人值守交易保持 R3/范围外。

### Epic 7: 安全开发和治理本地受信扩展
贡献者可以在无商用数据和密钥的演示环境中开发数据、模型、Agent 工具和通知四类扩展；部署者可以核验其合同、来源、权限、SBOM、SecretRef 和目的端，并安全安装、禁用、撤回和回滚。
**阶段：** S5
**FRs covered:** FR-077–FR-083、FR-097
**CAP 覆盖：** CAP-10
**依赖与 Gate：** Epic 6 / S4 Go；每个精确官方或第三方扩展必须逐项取得许可、版本、来源、hash、兼容、权限、健康和阶段资格。
**实施与 UX 边界：** 扩展仅通过操作者控制的本地不可变 bundle 和受监督 sidecar 进入；不提供在线市场、远程一键安装、公共脚本社区或公共 REST API。

### Epic 8: 以可验证的双入口发行物发布 v1.0
部署者可以安装、升级、回退、备份和恢复自包含的 B/S 与桌面发行物；维护者可以依据真实 A/港股 Parity、双入口等价、双语、可访问性、安全、供应链和治理证据决定是否发布 v1.0。
**阶段：** S5 / v1.0 Release Gate
**FRs covered:** FR-070、FR-074、FR-098–FR-100
**CAP 覆盖：** CAP-11，并对 CAP-1–CAP-10 做最终发布资格汇总
**依赖与 Gate：** Epic 7 及全部前序 Epic 完成；OQ-04 等发布前置、全部适用 SM/SM-C、NFR、五平台与 Reviewer Gate 均通过。任一未通过项保持 beta。
**实施与 UX 边界：** 生成同 digest product payload、签名 B/S archive 与 Tauri envelope，验证 UpgradeCoordinator/rollback、恢复、About/Licenses、完整浏览器/WebView/语言/主题/viewport/a11y 矩阵；不得用静态页面、占位数据、单元测试或“代码完成”替代发布资格。

## Epic 1: 用真实只读任务证伪 Agent 选股价值

Alpha 用户可以在唯一冻结的合法真实数据路径上完成同任务对照，获得可审计的条件树、候选或零候选证据与运行记录；产品维护者可以依据 SM-00 作出 Go/Stop，而不先建设完整平台。

**阶段：** S0-V
**FRs covered:** FR-055、FR-057、FR-094
**完成 Gate：** 真实 SM-00 证据全部通过才可 Go；未通过则 Stop/Narrow，不启动 Epic 2。

### Story 1.1: 建立锁定的 S0-V 项目骨架与阶段壳

As a TickDeck 项目维护者,
I want 建立可重复构建、仅暴露 S0-V 已授权表面的共同产品骨架,
So that 后续真实任务实验可以在不提前建设或展示后续能力的前提下实施和验收.

**对应需求：** AR-STARTER-01、AR-AD-01、AR-AD-02、AR-AD-13、AR-AD-15、AR-AD-17、AR-AD-20、AR-AD-32、AR-CON-01、AR-STACK-01、AR-STRUCT-01、AR-GATE-01、NFR-001、NFR-019、NFR-021、NFR-023、NFR-024、NFR-026；为 FR-055、FR-057、FR-094 提供执行底座，但不声称本 Story 已完成这些 FR。
**阶段：** S0-V
**依赖：** 无；当前仓库经核对尚无 pnpm、Cargo 或应用实现骨架。
**Blocker：** 无新增开放问题；本 Story 只建立 S0-V 最小骨架，不构成真实实验、SM-00 或后续 Gate 资格。
**架构约束：** Hexagonal Modular Monolith + Supervised Execution Plane；Fastify 同源提供 Vite SPA；pnpm/Cargo workspace；完整执行 AD-32 的单一跨语言工程质量合同和 TypeScript 6.0.3 profile，不得另建 package 级规则权威。只声明本 Story 实际使用的工程与运行依赖；不得建立领域数据表、跨主机服务、第二前端或未授权业务能力。工程骨架、编译探针和静态检查均不注册 capability，也不关闭 OQ-06。
**UX 约束：** UX-DR-001–UX-DR-005、UX-DR-025、UX-DR-039–UX-DR-040、UX-DR-052；只呈现真实可用的 S0-V 壳层和最小运行健康，不显示未来导航、禁用菜单、锁形 teaser 或占位页面。

**Acceptance Criteria:**

#### AC 1：建立精确且锁定的跨语言 workspace

**Given** 当前仓库没有应用实现骨架
**When** 维护者完成本 Story
**Then** 根 `package.json` 使用无 `^`/`~` 的 AD-32 精确 devDependencies，并声明 `packageManager: pnpm@11.24.0`、`engines.node: 24.20.0`、`prepare: husky`；提交 `pnpm-lock.yaml`、根 `Cargo.toml`、`Cargo.lock`、`rust-toolchain.toml`、`rustfmt.toml` 和 `tsconfig.base.json`
**And** `pnpm-workspace.yaml` 只接纳直接成员 `apps/*`、`packages/*`、`tools/*`，设置 `includeWorkspaceRoot: false`、`strictDepBuilds: true`、`dangerouslyAllowAllBuilds: false`
**And** 16 个直接 pnpm member 必须逐项且仅为 `apps/web`、`apps/desktop`、`apps/server`、`apps/worker`、`packages/contracts`、`packages/core`、`packages/policies`、`packages/storage-sqlite`、`packages/artifact-fs`、`packages/connectors-core`、`packages/connectors-official`、`packages/models`、`packages/notifications`、`packages/agent-mastra`、`packages/testkit`、`tools/component-compiler`，每项都有 `package.json`
**And** `tools/quality` 是根拥有的非 workspace utility，必须没有 `package.json`；Cargo/WIT 结构只建立 `crates/product-supervisor`、`crates/sandbox-host` 与 `wit/tickdeck-sandbox` 的必要骨架。

#### AC 2：冻结安装并逐包裁决 lifecycle build

**Given** 根 workspace 和精确 dependency graph 已声明
**When** 在干净 checkout 安装 JavaScript 与 Rust 依赖
**Then** JavaScript 只使用 `pnpm install --frozen-lockfile`，Cargo 的 check/build/clippy 一律使用 `--locked`，lockfile 漂移或缺失立即失败
**And** `allowBuilds` 把 lockfile 中每个带 lifecycle build 的 package name 显式映射为经审查的 `true` 或 `false`，不允许缺失、placeholder、交互式 `approve-builds` 或全局放行
**And** `tools/quality/dependency-build-check.mjs` 从 lockfile 与 policy 导出预期 `false` 集，规范化 `pnpm ignored-builds` 的实际 package 集并要求精确相等；额外阻断、缺失阻断和未裁决项全部失败
**And** 不安装本 Story 尚未使用的 Monaco、Mastra、Wasmtime、连接器、通知、组合或其他后续 capability runtime；Structural Seed 的空 package 不得用伪 runtime 或伪生成物冒充能力实现。

#### AC 3：落实 typed dependency edges 与 TypeScript 6.0.3 profiles

**Given** 16 个 pnpm member 已存在
**When** `workspace-policy.mjs` 校验 package manifest、source、声明、bundle、fixture 与 tsconfig
**Then** 每条依赖边都按 AD-32 标记为 `runtime | type-only | build/codegen | test/dev`，并投影到正确的 dependencies/devDependencies、source surface 及正反 fixture；初始 runtime 边只允许 Structural Seed 实线边和 `testkit → core/contracts/policies`
**And** 初始不存在超出 runtime 集的 type-only 边；build/codegen 只允许 `connectors-official → testkit` 的 demo fixture 与 `component-compiler → wit/tickdeck-sandbox`；test/dev 只允许 `apps/server`、`apps/worker`、`storage-sqlite`、`artifact-fs`、`connectors-core`、`connectors-official`、`models`、`notifications`、`agent-mastra`、`component-compiler` 在 test/config/fixture surface 指向 `testkit`，Web、neutral package 和任何 production source 不得导入 testkit
**And** TypeScript 精确使用 6.0.3，所有 package 为 ESM；`apps/web` 使用 ES2022 + ESNext/Bundler + DOM/DOM.Iterable + `vite/client` 的 web profile；`apps/server`、`apps/worker`、`storage-sqlite`、`artifact-fs`、`connectors-core`、`connectors-official`、`models`、`notifications`、`agent-mastra`、`testkit`、`component-compiler` 使用 ES2023 + NodeNext + Node types 的 node-runtime profile；`core`、`contracts`、`policies` 使用 ES2022 + NodeNext + `types: []` 的 neutral-shared profile
**And** `apps/desktop` 的 Node/Tauri CLI 配置、根 `*.config.mjs`、`tools/quality/**/*.mjs` 使用 ES2023 + NodeNext + explicit Node types + noEmit 的 node-config-only profile；colocated tests、Storybook、MSW、Playwright 及 contract/security fixtures 使用继承被测目录后再显式增加 runner/browser/Node types 的 test-overlay，测试 ambient 不得进入生产声明
**And** 每个 profile 显式设置 target/lib/module/moduleResolution/rootDir/types；共同启用 AD-32 的 strict、unchecked、exact optional、unknown catch、side-effect import、verbatim module、isolated module 与 `skipLibCheck: false`，禁止 `baseUrl`、node/node10/classic resolution、`types: ["*"]`、`ignoreDeprecations` 和正常 CI 的 `stableTypeOrdering`
**And** 共享 package 只通过精确 package exports/types 和 `.js` 相对 runtime import 互引，Vite alias 与 Web relative paths 完全一致，paths 不得伪装运行时解析；只有 `tools/component-compiler` 可导入 TypeScript compiler API。

#### AC 4：采用唯一的根级工程质量规则

**Given** TypeScript profiles 与 dependency policy 已冻结
**When** 运行 lint、format 或本地 Git hooks
**Then** 根 `eslint.config.mjs` 使用 flat/type-aware 配置、React Hooks 与 policy 生成的 per-directory `no-restricted-imports`，覆盖 apps/packages/tools/root JS/TS，且 warning 在 CI 中失败
**And** 根 `prettier.config.mjs` 固定 `printWidth=100`、2-space、LF、semi、single quote、trailing comma、`proseWrap=preserve`；Web-only `stylelint.config.mjs` 精确采用 AD-32 的 Tailwind v4/shadcn 例外，并让固定 `tools/quality/fixtures/tailwind-v4.css` 通过而未知 at-rule 继续失败
**And** `commitlint.config.mjs` 只接受 AD-32 列出的 Conventional Commit type；`.editorconfig`、`rustfmt.toml` 与根配置分别按合同拥有编辑器、Rust 和 authored text 规则
**And** `.husky/pre-commit` 仅执行 `pnpm exec lint-staged`，`.husky/commit-msg` 仅执行 `pnpm exec commitlint --edit "$1"`；`lint-staged.config.mjs` 把 absolute path 规范成 repository-relative POSIX path 后过滤 canonical ignores，matcher 不重叠，多个 Rust 文件只产生一次 filename-free `cargo fmt --all --check`
**And** canonical ignores 完整覆盖 AD-32 的 dependency/build/cache/report/generated、`_bmad`、`_bmad-output`、`.agents`、`.playwright-cli` 集，并仅把 `pnpm-lock.yaml` 加入 Prettier/staged formatter 排除；已提交的 shadcn `apps/web/src/components/ui/**` 源码仍必须通过 ESLint/Prettier。

#### AC 5：执行 workspace、generated 与 Rust validators

**Given** workspace 和根规则已提交
**When** 运行根级 validators
**Then** `workspace-check.mjs` 要求实际直接 member 与 16 项精确相等、`tools/quality/package.json` 不存在、没有嵌套或意外 workspace，并验证每个 TypeScript member 的 profile/tsconfig、stage-aware leaf scripts 和四类依赖边覆盖
**And** `generated-check.mjs` 只接受 `tools/quality/generated-manifests/*.json` 注册的 generated root，在干净临时目录重建并比较 exact paths + bytes；Story 1.1 没有生成输出时 manifest registry 必须为空，Rust/WIT binding 只进入 Cargo `OUT_DIR`/`target`
**And** `rust-toolchain.toml` 固定 Rust 1.98.0、minimal profile、rustfmt 与 clippy，Cargo/rustfmt 使用 Edition/style Edition 2024、LF 与 100 columns
**And** `cargo fmt --all --check`、`cargo clippy --workspace --all-targets --all-features --locked -- -D warnings`、`cargo check --workspace --all-targets --all-features --locked` 和 `cargo build --workspace --all-targets --all-features --locked` 全部通过。

#### AC 6：采用可审计的官方 UI starter

**Given** UI 基线尚未生成
**When** 初始化 `apps/web`
**Then** 使用 AR-STARTER-01 指定的 `shadcn@4.19.0` 命令和 `base-vega` preset
**And** 提交 resolved preset、preset digest、`components.json`、实际生成的源码及每个 registry item 的 source digest
**And** CI 拒绝 `shadcn@latest`、浮动 registry 或未审阅的重新生成结果
**And** 不引入 Radix/New York、第三方 registry 或平行基础 primitive。

#### AC 7：提供同源、可启动的最小产品纵切

**Given** workspace 已安装依赖并完成构建
**When** 启动本 Story 的开发或生产模式
**Then** Fastify 控制面同源提供 React SPA、版本化健康快照和当前 Capability Manifest
**And** Worker 通过声明的受认证本地端口完成启动握手与健康上报，但不注册任何业务任务 handler
**And** 浏览器不需要独立前端服务器、CDN、运行期字体或 service worker
**And** 参考环境中的服务冷启动满足 NFR-001 的 30 秒上限。

#### AC 8：只注册 S0-V 已实现表面

**Given** 当前构建处于 S0-V
**When** release build 从 canonical capability catalog 生成 web、server 和 worker slices
**Then** 三份 slice 与 Release Manifest 中的 catalog digest 一致
**And** UI 只挂载本 Story 已实现的 App Shell、最小“运行与健康”表面和 Theme Control
**And** 筛选、Agent、沙箱、图表、提醒、模拟组合、扩展及 S1–S5 导航均不注册、不加载、不显示
**And** 任一 slice 出现额外、缺失或 digest 不一致时构建失败。

#### AC 9：实现基础视觉、主题和无障碍合同

**Given** 用户打开最小产品壳
**When** 使用键盘、读屏或主题控制进行操作
**Then** 界面采用 DESIGN.md 的 shadcn 语义 token、字体、间距、圆角和焦点合同
**And** 支持 light、dark、system 三态，切换只保存非敏感客户端偏好且不重置页面状态
**And** 导航和表单使用原生或 Base UI 语义，具有正确的可访问名称、焦点顺序和焦点回返
**And** focus-visible 至少等效 2px 实线、2px offset，并与相邻颜色达到 3:1
**And** 最小壳层提供 `zh-CN`、`en-US` 和 pseudo-long 测试资源，服务端仅返回稳定英文 code 与参数。

#### AC 10：保持领域和状态边界为空而明确

**Given** 本 Story 只建立可运行骨架
**When** 检查代码和持久化结构
**Then** `packages/core` 不依赖 React、Fastify、SQLite、供应商 SDK 或 Rust host
**And** Web、Worker 和 Rust crate 不直接形成领域状态权威
**And** 不存在筛选器、Agent run、连接器、脚本、提醒、组合或其他未来实体的数据表和伪实现
**And** localStorage/IndexedDB 不保存行情、模型、会话、SecretRef、Grant 或其他权威状态
**And** 默认无遥测、无官方服务回连。

#### AC 11：通过统一根脚本和独立 CI contexts

**Given** workspace、规则、validators 与最小产品纵切已提交
**When** 本地或 CI 执行 AD-32 根脚本
**Then** `workspace:check`、`dependencies:check`、`lint:eslint`、`lint:style`、`lint:rust`、`lint`、`format`、`format:check`、`typecheck:ts`、`typecheck:rust`、`typecheck`、`codegen:check`、`build:ts`、`build:rust`、`build`、`test:unit`、`test:component`、`test:e2e` 与 `test` 均使用 AD-32 的完整命令和 workspace coverage，不允许递归 `if-present` 静默跳过必需 leaf
**And** CI 在 workflow/job 级设置 `HUSKY: "0"`，以 frozen install、`dependencies:check`、Rust 1.98.0 工具断言和 Cargo `--locked` 为前置
**And** `lint`、`format-check`、`typecheck`、`build` 是命令一一绑定的四个独立 required contexts，Story 1.1 的 unit/component/真实浏览器 smoke `test` 也是 required；任一 warning、格式/生成漂移、非法边、blocked-build 差异、类型、Clippy、build 或 test 错误均失败
**And** 首次 merge 前使用平台 API/CLI 归档查询日期、repository、ruleset ID/digest 与查询结果，独立证明四个稳定 context 和当前 `test` 已设为 required；不得从 workflow 文件或本地 Husky 状态推断外部 branch rules 已生效。

#### AC 12：通过干净环境、真实浏览器与证据边界验证

**Given** 一个没有 `node_modules`、构建缓存或预装项目依赖的干净 checkout
**When** 执行锁定安装、类型检查、构建和测试
**Then** `pnpm install --frozen-lockfile`、`pnpm dependencies:check`、`pnpm lint`、`pnpm format:check`、`pnpm typecheck`、`pnpm build` 与 `pnpm test` 全部通过，并确认为 TypeScript 6.0.3、Vite production build 和 Rust locked toolchain 的实际结果
**And** 组件测试覆盖 App Shell、Capability 投影、主题和键盘行为
**And** 真实浏览器 smoke test 能打开 Fastify 同源页面、读取健康快照、切换主题并验证不存在未来导航
**And** 测试不依赖模型输出、外部云服务或未冻结的网络资源
**And** TypeScript 6.0.3 typecheck、Vite build 或 compiler API 探针只证明相应编译兼容性，不证明 TypeScript→Component、componentizer、source-map、WIT/WASI、五平台沙箱、SM-00 或任何 S1–S5 Gate 已通过。

### Story 1.2: 冻结并校验 S0-V 实验合同

As a TickDeck 产品维护者,
I want 把 S0-V 的真实数据路径、任务、oracle、基线、样本协议和能力上限冻结为可验证合同,
So that 无效或被修改的实验不能产生看似可信的产品 Go 结论.

**对应需求：** FR-094（oracle 与语义验证前置）、SM-00、A-01、OQ-02 已决协议、AR-AD-02、AR-AD-03、AR-AD-13、AR-AD-19、AR-AD-20、AR-AD-28、AR-CON-01、AR-GATE-01、AR-BLK-01、NFR-013、NFR-024、NFR-029、NFR-030。
**阶段：** S0-V
**依赖：** Story 1.1。
**Blocker：** 实际 S0-V 合法真实数据路径及其授权证据尚未在合同中给出；不得自行选择厂商或伪造资格。缺少该输入时，机制可以实现和测试，但真实实验必须保持 `blocked`。
**架构约束：** 实验合同使用版本化传输 schema、RFC 8785 canonical serialization 和带用途分隔的 SHA-256 digest；Gate Registry 只读取冻结合同，不允许 UI、模型或运行时修改。仅建立本 Story 所需的实验 manifest，不创建筛选、Agent、提醒或组合实体。
**UX 约束：** UX-DR-005、UX-DR-023、UX-DR-045、UX-DR-050、UX-DR-052；界面只显示合同是否完整、阻塞原因和允许的下一步，不展示后续能力或把“合同已冻结”表达为“实验已通过”。

**Acceptance Criteria:**

#### AC 1：定义完整的实验合同

**Given** 维护者准备创建 S0-V 实验合同
**When** 提交 `S0VExperimentManifest`
**Then** manifest 必须包含稳定 experiment ID、schema/version、阶段 `S0-V`、任务定义、目标用户资格规则、样本目标、执行顺序、oracle 引用及 digest、盲审规则、现有工具链基线及 digest、唯一真实数据路径引用、授权证据引用、数据用途、只读/R0 capability allowlist、预算和指标定义
**And** 样本协议固定为至少 12 名合格用户，整体覆盖合法 A/港股数据使用者，每人按冻结协议完成同类真实任务和两周复用观察
**And** 指标明确包含任务时间、实质错误或遗漏、人工修正、证据核查成本、主动二次复用和数据许可/越权违规
**And** 缺少任何承重字段时返回稳定错误并保持未冻结。

#### AC 2：拒绝不合格或未定的数据路径

**Given** manifest 引用的真实数据路径不存在、授权证据缺失、用途未知、已经到期，或引用了多个未冻结路径
**When** 执行 manifest 校验
**Then** 返回 `S0V_DATA_PATH_UNRESOLVED`、`S0V_DATA_AUTH_UNKNOWN`、`S0V_DATA_AUTH_EXPIRED` 或其他对应稳定英文错误码
**And** Gate Registry 不注册筛选或 Agent 能力
**And** 系统不得用 demo、未授权接口、默认免费源或商用源静默替代
**And** “接口存在”“厂商宣称支持”或测试 fixture 均不能关闭该 blocker。

#### AC 3：生成不可混淆的冻结身份

**Given** manifest 的全部字段和外部引用均通过校验
**When** 维护者执行冻结
**Then** 系统以 RFC 8785 canonical serialization 和 domain-separated SHA-256 生成 manifest digest
**And** 冻结结果记录 manifest version、schema version、source digests、冻结时间和维护者操作来源
**And** 相同内容产生相同 digest，不同承重内容必然产生不同 digest
**And** 冻结后不能原地修改；任何变更必须创建新版本和新 digest，旧版本保留用于审计和实验归因。

#### AC 4：强制 S0-V 能力上限

**Given** 一个已冻结且有效的 S0-V manifest
**When** release build 和 Gate Registry 计算当前允许能力
**Then** 合同最多允许唯一真实数据路径、只读筛选、受限 R0 Agent、冻结 oracle 和实验记录
**And** 沙箱、提醒、组合、R1/R2、完整恢复及 S1–S5 能力均保持未注册
**And** manifest allowlist 不能扩大 canonical capability catalog，也不能覆盖代码尚未实现的能力
**And** 冻结合同只表示实验前置完整，不表示 SM-00、A-01 或 S0-V Gate 已通过。

#### AC 5：提供只读合同状态

**Given** 维护者打开最小“运行与健康”表面
**When** 查看 S0-V 实验状态
**Then** 服务端 read model 显示 manifest ID/version/digest、冻结状态、数据路径资格摘要、任务/oracle/基线摘要、样本目标、允许能力和 blocker
**And** 浏览器只能读取，不能编辑、冻结或替换合同
**And** 秘密、受限数据、完整授权文档和参与者身份不得出现在 read model、URL 或普通日志
**And** 错误文案说明发生了什么、阻塞什么、系统采取了什么动作以及维护者需要补充什么。

#### AC 6：区分合同状态与实验结果

**Given** 合同已成功冻结但尚无真实用户观察
**When** 查询 S0-V Gate
**Then** 状态显示为“实验可开始”或等价非成功状态，而不是 `passed`
**And** 不得生成 Go、不得进入 S0、不得关闭 A-01
**And** 演示 fixture、自动化测试、正面访谈或一次产品演示不能作为 SM-00 结果。

#### AC 7：通过确定性合同测试

**Given** 固定的有效、缺字段、digest 漂移、无授权、过期授权、多路径、demo 冒充真实路径和越权 capability fixtures
**When** 浏览器、Fastify 和构建工具使用同一合同校验 corpus
**Then** 各执行面具有完全一致的 accept/reject、规范化输出、digest 和稳定错误码
**And** 测试断言任何非法 fixture 都不能注册 S0-V 能力
**And** 调整协议或指标时必须创建新版本，并保留原基线、环境、结果、理由和新目标。

### Story 1.3: 准入冻结的真实数据快照

As a TickDeck 实验操作者,
I want 从实验合同指定的唯一合法数据路径生成经过许可、溯源和精度校验的冻结快照,
So that 后续筛选与 Agent 对照使用同一份可复现数据，且缺失或不合格的数据不会被静默替代.

**对应需求：** S0-V 阶段门、SM-00 数据许可或越权违规为 0；FR-004、FR-006 的 S0-V 薄切片（不关闭其 S1 完整验收）；AR-AD-07、AR-AD-09、AR-AD-13、AR-AD-24、AR-AD-28、AR-AD-31、AR-CON-01、AR-BLK-01；NFR-007、NFR-008、NFR-012、NFR-013、NFR-014、NFR-029、NFR-032。
**阶段：** S0-V
**依赖：** Story 1.2。
**Blocker：** Story 1.2 所需的实际合法数据路径、精确 connector/profile 和授权证据仍未给出。不得自行选择厂商、接口或许可证。机制可通过确定性 fixture 测试，但本 Story 只有在真实路径及授权证据通过准入后才能验收；该路径也不得用于关闭 OQ-03 或 SM-10。
**架构约束：** 只实现冻结任务所需的单路径、只读数据准入，不建设 S1 多连接器矩阵或动态换源。所有输入经 Connector Broker、DataUsePolicy、规范市场身份、不可变 `MarketDataSnapshotRef` 和 AD-31 lossless numeric ingress；若路径需要外部拨号，还须执行 AD-8/AD-29，离线授权快照不得借此引入拨号能力。
**UX 约束：** UX-DR-008、UX-DR-009、UX-DR-023、UX-DR-027、UX-DR-045、UX-DR-050；Trust Strip 只呈现真实状态和影响，不把“真实来源”表达成实时、完整、许可已确认或 S1 已通过。

**Acceptance Criteria:**

#### AC 1：只准入冻结合同指定的数据路径

**Given** Story 1.2 已冻结有效的 `S0VExperimentManifest`
**When** 操作者请求准入实验数据
**Then** Worker 只能调用 manifest 引用的精确 connector/profile/version
**And** 只读取冻结任务、oracle 和筛选所需的对象、区间与字段
**And** 不注册第二数据源、动态 provider 选择、通用连接管理或 S1 能力
**And** manifest 路径与运行路径不一致时返回稳定错误并拒绝生成快照。

#### AC 2：许可与用途必须先通过

**Given** 数据路径带有授权证据、用途、到期时间、数据类别和部署范围
**When** DataUsePolicy 对本次只读实验动作作出判断
**Then** 只有明确、可验证且未到期的 `ALLOW` 才能继续
**And** 未知、冲突、不可验证或到期一律返回 `DENY(reason)`
**And** 判断、策略版本、摘要及证据引用写入快照清单
**And** 秘密、完整授权文件和受限原始内容不得进入普通日志或前端 read model。

#### AC 3：金融数据必须无损进入权威数值合同

**Given** 数据响应包含价格、成交量、金额、比例或其他金融数值
**When** Connector Broker 解析原始响应
**Then** JSON 从受限原始字节保留 numeric token，或接收合法 decimal string；CSV/数据库输入使用文本或 integer-plus-scale
**And** 所有权威值进入 AD-31 的 `FinancialValueEnvelope v1`
**And** 任何经过 JavaScript `number`、binary float 或 `number → String` 恢复的字段均被拒绝
**And** missing、unknown 和 unsupported 保持独立状态，绝不转换为零。

#### AC 4：生成不可变且可复现的快照身份

**Given** 数据、许可和 schema 校验全部通过
**When** 系统冻结本次实验数据
**Then** `MarketDataSnapshotRef` 绑定 canonical instrument/listing、connector/version、原始工件 digest、normalization/schema、日历、时区、币种、复权/公司行动口径、区间、as-of、freshness、completeness 和 revision
**And** 快照以带用途分隔的 RFC 8785 + SHA-256 身份保存
**And** 相同输入和版本产生相同 identity，任何承重变化产生新 identity
**And** 后续筛选、Agent、oracle 和实验记录只能引用该 identity，不得引用裸 symbol 或 mutable `latest`。

#### AC 5：所有异常显式降级或拒绝

**Given** 数据缺失、陈旧、部分、断连、超额、不支持、身份歧义或许可未知
**When** 系统评估冻结任务的可执行性
**Then** 按冻结策略返回明确的降级、排除或拒绝结果
**And** 保留最后成功同步时间、受影响字段和合法下一步
**And** 不补值、不由模型推断、不静默换源，也不回退到 demo
**And** 无法证明实验数据有效时，实验状态保持 `blocked`。

#### AC 6：通过 Trust Strip 展示最小可信上下文

**Given** 操作者查看数据准入结果或依赖该数据的 S0-V 表面
**When** Trust Strip 加载服务端 presentation read model
**Then** 折叠态显示 source、data time、nature/availability 和 snapshot ID
**And** 展开态显示 fetched-at、last-successful-sync、时区、币种、复权、完整性、connector version/hash、许可用途、到期时间和影响范围
**And** `real|delayed|partial` 与 `fresh|stale|missing|unsupported|unknown` 分维呈现，并使用文字、图标和影响短语
**And** 状态区域具有可访问名称，许可、错误和数据状态不得被截断或仅靠颜色表达。

#### AC 7：用确定性证据验证准入边界

**Given** 有效、陈旧、缺失、部分、未知许可、过期许可、身份歧义、revision 漂移、demo 冒充真实路径、binary-float-only 和超限输入 fixtures
**When** Broker、policy、HTTP read model 与 Web 使用同一契约测试 corpus
**Then** 各执行面产生一致的 accept/reject、snapshot digest、Trust 状态和稳定错误码
**And** 测试证明任何非法 fixture 都不能生成合格快照或解锁筛选/Agent
**And** 实际路径还必须附带真实授权与准入记录，fixture、厂商宣传或接口可调用均不能替代
**And** 模型输出不得参与验收判定。

### Story 1.4: 执行规范化只读筛选与 oracle 校验

As a TickDeck 实验操作者,
I want 对冻结数据快照执行确定性的规范化条件树筛选，并与独立冻结的 oracle 比较,
So that S0-V 使用可复现、可量化正确性的筛选结果，而不是依赖模型判断或主观验收.

**对应需求：** FR-055、FR-057、FR-094；FR-016、FR-018、FR-019 的 S0-V 薄切片（不关闭其 S1/S2 完整验收）；SM-00；AR-AD-02、AR-AD-03、AR-AD-07、AR-AD-13、AR-AD-14、AR-AD-16、AR-AD-19、AR-AD-20、AR-AD-28、AR-AD-31、AR-CON-01；NFR-005、NFR-007、NFR-012、NFR-013、NFR-029。
**阶段：** S0-V
**依赖：** Story 1.3。
**Blocker：** 冻结任务的实际条件语义、oracle 数据与 digest 尚未提供；不得自行定义字段、算子、null/time 语义或 precision/recall 通过阈值。机制可用确定性 fixture 验证，但真实筛选验收必须等待这些输入及 Story 1.3 的合格真实快照。
**架构约束：** `packages/core` 是筛选语义与计算的唯一权威，`packages/contracts` 定义版本化条件树、工具输入输出和错误 envelope；Worker 只调用领域端口，浏览器与模型均不得计算或修改结果。所有金融比较遵守 AD-31，所有对象引用 Story 1.3 的 `MarketDataSnapshotRef`，不得使用裸 symbol 或 mutable `latest`。
**UX 约束：** UX-DR-008、UX-DR-009、UX-DR-017、UX-DR-020、UX-DR-023、UX-DR-045、UX-DR-050、UX-DR-052；本 Story 产出可供 Review Canvas/Data Table 消费的服务端 read model，完整审阅交互留给 Story 1.6，不以其作为本 Story 计算验收的未来依赖。

**Acceptance Criteria:**

#### AC 1：注册唯一的 S0-V 只读筛选工具

**Given** 当前 build 处于 S0-V，实验合同和数据快照均有效
**When** Gate Registry 生成可用工具集
**Then** 只注册一个服务于冻结任务的版本化筛选工具
**And** 工具声明 `R0`、只读、无外发、无领域写入及其精确 schema、版本、成本和 capability 前置条件
**And** 未注册保存筛选器、自选、导出、图表、提醒、组合、脚本或通用 S1/S2 筛选能力
**And** manifest、snapshot 或 Gate 无效时工具保持 `locked`，不能由 UI 或调用参数覆盖。

#### AC 2：严格校验规范化条件树

**Given** 调用方提交规范化条件树
**When** 服务端校验工具输入
**Then** 条件树明确表达冻结任务允许的字段、算子、布尔组合、单位、比较值、时间口径、null/unknown 语义、排序和排除规则
**And** 只接受实验合同及 oracle 已冻结的语义子集
**And** 未知字段、未知算子、类型不匹配、歧义时间、单位冲突或隐式类型转换均返回稳定错误
**And** 规范化结果使用 RFC 8785 与 domain-separated SHA-256 形成不可混淆的条件树 digest
**And** 不完整输入不得由模型、默认值或宽松 parser 自动补齐。

#### AC 3：在冻结快照上确定性执行

**Given** 条件树、DataUsePolicy 和 `MarketDataSnapshotRef` 均通过校验
**When** Worker 执行筛选
**Then** 所有条件判断、派生计算、排序和集合操作由 `packages/core` 的确定性服务完成
**And** 金融值只通过 AD-31 的 `FinanceDecimal`、envelope 和规定的稳定排序语义参与计算
**And** 相同条件树 digest、snapshot digest、算法版本和环境产生数值等价且顺序稳定的结果
**And** 运行期间不得重新读取 mutable `latest`、更换来源或使用浏览器/模型计算结果。

#### AC 4：为每个结果生成条件级证据

**Given** 筛选执行完成
**When** 生成结果 read model
**Then** 每个对象按冻结语义记录 candidate、excluded 或 unknown 结果
**And** 每个条件显示 matched、not-matched 或 unknown、使用的权威值、单位、计算版本及 provenance 引用
**And** 结果引用条件树 digest、snapshot digest、Trust 状态和算法版本
**And** 事实、确定性计算和 unknown 分开；本 Story 不产生模型解释
**And** 零候选是带完整证据的成功结果，不提示用户放宽条件。

#### AC 5：使用独立冻结 oracle 计算正确性

**Given** 实验合同引用了独立冻结的 oracle 数据、规则和 digest
**When** 对筛选结果执行 oracle 校验
**Then** 系统计算并保存 candidate-level precision、recall、差异集合和条件级 mismatch
**And** oracle 不得由被测筛选实现生成、覆盖或根据结果调整
**And** 是否通过只读取冻结 manifest 中的阈值；阈值缺失时返回 blocker，不自行采用 SM-04 或其他默认门槛
**And** 任何 digest 漂移、不可比较对象或语义不一致均使该次实验输入无效，而不是被计为通过。

#### AC 6：留下最小、完整的 R0 运行记录

**Given** 筛选成功、失败、拒绝或返回零候选
**When** 运行结束
**Then** 记录 run ID、`tool@version`、规范化参数摘要与 digest、manifest/snapshot/oracle identity、策略判断、开始/结束时间、耗时、状态、错误码及结果引用
**And** R0 记录不得升级为保存筛选器、外发数据或其他持久业务副作用
**And** 日志保持结构化和脱敏，不记录受限原始数据或秘密
**And** 该记录只满足 S0-V 留痕，不宣称完整 S0–S5 审计与恢复能力已通过。

#### AC 7：通过确定性、性能与真实路径验收

**Given** 覆盖布尔组合、null/unknown、时间边界、精度边界、稳定排序、零候选、部分数据、许可拒绝、snapshot 漂移和 oracle mismatch 的固定 corpus
**When** core、Worker、HTTP contract 和 read model 运行同一测试向量
**Then** 各执行面产生一致的 accept/reject、条件树 digest、候选集合、证据、precision/recall 和稳定错误码
**And** 参考环境中对 10,000 个对象和不超过 30 个已准备字段的普通筛选，p95 不超过 NFR-005 规定的 5 秒，并保存环境与原始测量证据
**And** 测试证明模型输出、对象枚举顺序、分页或并发分块不能改变权威结果
**And** 最终验收还必须在 Story 1.3 的合格真实快照和实际冻结 oracle 上通过；fixture 不能替代真实实验资格。

### Story 1.5: 编排受限的 R0 Agent 运行

As a TickDeck 实验参与者,
I want 用冻结任务启动一个只能结构化条件并调用唯一只读筛选工具的 Agent,
So that 我可以验证 Agent 是否改善真实选股任务，同时不让模型取得计算真值、额外工具或后续阶段权限.

**对应需求：** FR-055、FR-057、FR-094；FR-052、FR-053、FR-054、FR-062、FR-064、FR-066–FR-069 的 S0-V 受限薄切片（不关闭其 S2 或完整 Agent 验收）；SM-00；AR-AD-02、AR-AD-03、AR-AD-07–AR-AD-09、AR-AD-13–AR-AD-15、AR-AD-19、AR-AD-20、AR-AD-29、AR-AD-31、AR-CON-01、AR-BLK-08；NFR-006、NFR-007、NFR-013、NFR-014、NFR-017、NFR-019、NFR-020、NFR-028、NFR-029、NFR-034。
**阶段：** S0-V
**依赖：** Story 1.4。
**Blocker：** S0-V 使用的精确 provider、model、prompt、toolset、endpoint 和资格证据尚未给出。不得自行选择模型或把兼容接口、测试替身、连接成功视为真实资格；缺少实际组合及合法凭据时，机制可以测试，但真实 Agent 实验保持 `blocked`。
**架构约束：** `packages/agent-mastra` 只实现编排端口，不能直接访问数据库、文件、网络、秘密或 connector。当前 toolset 只能包含 Story 1.4 的单个 R0 工具；每次调用重新通过 schema、DataUse、Egress、risk、budget 和 state 校验。模型输入输出均是不可信内容，模型不得生成行情、计算筛选结果或更改 Gate。
**UX 约束：** UX-DR-005、UX-DR-012、UX-DR-013、UX-DR-017、UX-DR-023、UX-DR-027、UX-DR-033、UX-DR-034、UX-DR-045、UX-DR-050、UX-DR-052；S0-V Agent Panel/Run Timeline 只显示 R0 过程，不出现 R1/R2、Risk Gate、暂停/恢复、多 Agent、长期记忆或后续能力 teaser。

**Acceptance Criteria:**

#### AC 1：只接受精确且受限的模型组合

**Given** 维护者提交 S0-V Agent 资格记录
**When** 系统校验该记录
**Then** 记录绑定精确 provider、Base URL、Model ID、prompt version/hash、toolset version/digest、结构化输出 schema、连接配置版本、资格时间和到期状态
**And** toolset 只能包含 Story 1.4 的只读筛选工具
**And** 资格测试至少证明连接、结构化条件树输出、单个 R0 工具调用、结果引用和取消行为符合合同
**And** 测试替身只能验证机制，不能取得真实实验资格
**And** 组合缺失、漂移、过期或 digest 不一致时 Agent 能力保持 `locked`。

#### AC 2：为每次运行冻结不可变上下文

**Given** 实验合同、数据快照、oracle、筛选工具和模型组合均有效
**When** 用户启动 Agent 任务
**Then** 服务端创建不可变 RunContext，绑定 experiment/task ID、用户输入、manifest、snapshot、oracle、条件 schema、`tool@version`、model、prompt hash、toolset、qualification manifest、DataUse/Egress judgment 和预算
**And** RunContext 使用规范 digest 标识，创建后不能原地修改
**And** 页面切换、数据更新、模型配置变化或 provider 状态变化不得改变运行输入
**And** 任一绑定变化都必须创建新 run，不能继续使用旧结果冒充同一次实验。

#### AC 3：把冻结任务转换为可审核条件树

**Given** 用户输入属于实验合同冻结的任务范围
**When** Agent 处理该目标
**Then** 模型只能生成 Story 1.4 schema 允许的规范化条件树和必要的受限说明
**And** 条件树在工具调用前经过同一服务端 schema、能力、字段、时间、单位和 null/unknown 语义校验
**And** Agent Panel 显示条件树、使用的数据快照和任何未知口径
**And** 任务越界、语义歧义或所需字段不受支持时明确拒绝或标记 unknown
**And** 不允许模型补字段、改写冻结任务、改变 oracle 或自行放宽条件。

#### AC 4：最多执行一次受控 R0 工具调用

**Given** 规范化条件树已经通过校验
**When** Agent 请求执行筛选
**Then** 调用重新进入 schema、DataUsePolicy、适用的 EgressPolicy、risk、budget、snapshot 和 Gate 校验
**And** 只有 Story 1.4 的精确 `tool@version` 可以执行，且一次 run 最多产生一次该工具调用
**And** 工具结果直接来自确定性筛选服务，模型不能修改候选集、条件证据、precision/recall 或错误状态
**And** 模型提出不存在的工具、第二次调用、写入、导出、通知、脚本、组合或其他能力时返回稳定拒绝
**And** 不创建 R1/R2 授权，也不存在客户端或维护者覆盖入口。

#### AC 5：控制模型出站与回退

**Given** Agent 使用外部模型 endpoint
**When** 系统准备发送模型请求
**Then** 只发送完成冻结任务所需的最小载荷，并在拨号前重新执行 DataUsePolicy、EgressPolicy、目的地址、凭据和预算检查
**And** 未知、冲突、到期或不允许外发的数据默认拒绝
**And** SecretRef 只在受控边界解析，秘密不得进入提示、运行工件、日志或工具结果
**And** provider 失败时显示失败及影响，不得静默切换模型、provider、prompt 或 toolset
**And** SSRF、DNS rebinding、危险重定向和跨主机凭据转发尝试均被阻止。

#### AC 6：显示可取消、可追溯的 R0 过程

**Given** Agent run 处于 draft、running、done、failed 或 canceled 状态
**When** 用户查看 Agent Panel 或 Run Timeline
**Then** 时间线显示计划、当前步骤、R0 工具事件和结果，并披露 run ID、模型、prompt/toolset、参数摘要、数据来源、耗时、Token/费用估算、状态和失败原因
**And** 长时运行持续显示真实阶段、耗时和成本，用户可以显式取消，未知进度不得伪造百分比
**And** 取消后不再发起模型或工具调用，并记录已完成步骤和取消原因
**And** S0-V 不显示 waiting、paused、recovered、Risk Gate 或后台恢复能力
**And** 刷新或页面切换不会改变权威 run 状态，但本 Story不宣称完整恢复合同已实现。

#### AC 7：保持结果真值与模型解释分离

**Given** 确定性筛选返回候选、零候选、部分结果、拒绝或失败
**When** Agent 形成运行结果
**Then** read model 分开保存事实、确定性计算、模型解释、unknown 和运行清单
**And** 候选、证据、oracle 指标和 Trust 状态只能引用 Story 1.4 的权威结果
**And** 模型解释必须明确标记，不能表达为确定收益、投资建议或替用户作最终判断
**And** 模型输出与工具结果冲突时保留工具结果，并把冲突记录为 Agent 错误或未知项
**And** 零候选保持成功态，不要求用户放宽条件。

#### AC 8：通过边界与对抗验收

**Given** 正常任务、越界任务、歧义条件、伪造工具、第二次调用、prompt injection、schema 逃逸、context 漂移、provider fallback、数据外泄和取消 fixtures
**When** orchestrator、server、Worker 和 Web 运行同一测试 corpus
**Then** 所有非法请求均被稳定拒绝，且不能改变 Gate、工具集、候选结果或数据边界
**And** 测试断言模型输出不能决定验收通过、筛选计算或 oracle 指标
**And** 真实浏览器能够完成“输入冻结目标→查看条件树→执行一次 R0 筛选→查看结果或明确失败→取消运行”的 S0-V 旅程
**And** 最终真实实验仍须使用已批准的精确模型组合、合法数据快照和冻结任务；mock、demo 或一次演示不能替代 SM-00 证据。

### Story 1.6: 审阅可追溯的筛选证据

As a TickDeck 实验参与者,
I want 在只读 Review Canvas 中核查条件、候选、未知项、oracle 差异和完整运行清单,
So that 我能判断 Agent 结果是否可信，而不是依赖摘要或“看起来正确”的主观印象.

**对应需求：** FR-055、FR-057、FR-094；FR-018、FR-019、FR-054、FR-064 的 S0-V 薄切片（不关闭其 S1/S2 完整验收）；SM-00；AR-AD-02、AR-AD-03、AR-AD-07、AR-AD-13–AR-AD-17、AR-AD-20、AR-AD-28、AR-AD-31；NFR-007、NFR-012、NFR-013、NFR-021–NFR-024、NFR-029。
**阶段：** S0-V
**依赖：** Story 1.5。
**Blocker：** 真实审阅必须依赖 Story 1.5 产生的合格 Agent run、Story 1.4 的 oracle 结果和 Story 1.3 的合法数据快照。fixture 只能验收界面与协议；实际运行或数据权利无效时必须显示 `not-reproducible` 或实验无效，不能形成真实实验证据。
**架构约束：** Review Canvas 只消费服务端版本化 presentation read model，不在浏览器重新计算、拼接或放宽结果。所有条件、候选、数值、oracle、Trust 和运行清单引用同一 run/manifest/snapshot identity；SSE 只通知变化，HTTP snapshot 是权威。
**UX 约束：** UX-DR-001–UX-DR-005、UX-DR-008、UX-DR-009、UX-DR-017、UX-DR-020、UX-DR-023、UX-DR-026、UX-DR-030、UX-DR-037–UX-DR-040、UX-DR-042、UX-DR-044、UX-DR-045、UX-DR-050–UX-DR-052；以 `SCN-S0V-EVIDENCE-01` 作为布局和信息层级参考，但正式合同仍以 DESIGN.md 与 EXPERIENCE.md 为准。

**Acceptance Criteria:**

#### AC 1：只打开指定运行的只读证据

**Given** 用户从 Story 1.5 的 Agent 结果打开审阅
**When** Review Canvas 请求运行证据
**Then** 服务端 read model 绑定精确 experiment、task、run、manifest、condition tree、snapshot、oracle 和 result identity
**And** 任一引用缺失、digest 不匹配或不属于同一运行时返回稳定错误
**And** Review Canvas 不能编辑条件、重跑工具、修改 oracle、替换数据或写入研究对象
**And** 打开审阅不会产生新的 Agent 或筛选运行。

#### AC 2：按五类合同稳定分区

**Given** 运行证据完整或部分可用
**When** Review Canvas 呈现结果
**Then** 固定分区显示事实、确定性计算、模型解释、未知项和运行清单
**And** 每条内容标明所属分区，模型文字不能混入事实或计算
**And** 没有模型解释或未知项时显示明确的空状态，而不是隐藏该合同边界
**And** 模型解释不得覆盖候选、oracle 指标或工具错误，也不得替用户作投资判断。

#### AC 3：审阅条件、候选和 oracle 差异

**Given** Story 1.4 已产生规范化条件树和 oracle 校验结果
**When** 用户展开筛选证据
**Then** 可以查看条件树版本/digest、字段、算子、单位、时间和 null/unknown 语义
**And** 每个 candidate、excluded 或 unknown 对象显示逐条件 matched、not-matched 或 unknown 证据
**And** 页面显示 precision、recall、差异集合、条件级 mismatch 和采用的冻结阈值
**And** oracle 或阈值缺失、漂移或不可比较时明确标记实验输入无效
**And** 不使用主观评分、模型自评或视觉相似度代替 oracle。

#### AC 4：常驻展示数据可信上下文

**Given** Review Canvas 展示任何数据驱动结果
**When** 用户查看或展开 Trust Strip
**Then** 折叠态显示 source、data time、nature/availability 和 snapshot ID
**And** 展开态显示 fetched-at、last-successful-sync、时区、币种、复权、完整性、connector version/hash、许可用途、到期时间和影响范围
**And** 字段级缺失、陈旧、部分、不支持或未知状态贴近对应条件与结果
**And** “真实来源”不得暗示实时、完整、许可已确认或已通过 S1
**And** 数据权利到期或源数据已清理时保留合法元数据和清单，并显示 `not-reproducible`。

#### AC 5：提供可访问的证据 Data Table

**Given** 结果包含候选、排除对象或未知对象
**When** 用户通过鼠标、键盘或读屏审阅表格
**Then** 表格提供稳定 row identity、固定表头、等宽金融数字、总数、当前位置和明确排序状态
**And** 数值文本来自权威 envelope/FinanceFormatter，不从显示坐标或 JavaScript number 重建
**And** 虚拟化路径暴露正确的 `aria-rowcount`、`aria-rowindex` 和必要的 `aria-colindex`，focused row 不因卸载而丢失
**And** 同时提供非虚拟化的可访问分页模式
**And** 排序或筛选只改变当前展示，不修改权威候选集、oracle 或运行工件。

#### AC 6：支持可解释的来源深链与状态恢复

**Given** 条件证据、Trust Strip、时间线或运行清单包含来源引用
**When** 用户打开来源深链
**Then** 定位到对应对象、版本、snapshot、tool call 或 provenance 记录
**And** 深链失败时保留对象 ID、版本和具体原因，不跳回无说明首页
**And** 关闭来源详情或 Review Canvas 后，焦点回到触发器
**And** 关闭 Review Canvas 后恢复进入前的任务、面板宽度、展开项和滚动位置
**And** 深链不能绕过 Gate 或挂载工作台、图表及其他 S1+ 表面。

#### AC 7：完整覆盖成功、降级和失败状态

**Given** 运行可能产生候选、零候选、partial、拒绝、失败或不可复现结果
**When** Review Canvas 加载相应 read model
**Then** 覆盖 `loading`、`ready`、`partial`、`not-reproducible` 和 `error` 状态
**And** 零候选显示为包含条件和数据时点的可信成功态，不要求放宽条件
**And** partial、拒绝和错误说明发生了什么、影响什么、系统做了什么以及用户可采取的合法下一步
**And** 最近已验证内容保留其时间，不因断线冒充当前或完整离线结果
**And** 页面不提供保存筛选器、导出、自选、图表、提醒、组合、R1/R2 或 Go/Stop 决策入口。

#### AC 8：通过真实浏览器与无障碍验收

**Given** 候选、零候选、partial、unknown、oracle mismatch、长标识和深链失败 fixtures
**When** 在真实浏览器中运行组件与端到端测试
**Then** 用户可仅用键盘完成打开运行、遍历五个分区、检查表格、展开 Trust Strip、访问来源和关闭返回
**And** Review Canvas、Trust Strip 和状态摘要具有命名 region，动态更新使用简短去重的 polite live summary
**And** light/dark/system、`zh-CN`/`en-US`/pseudo-long、1280×720 至 1600×1000、100%/200% 的适用矩阵通过
**And** 状态、风险、许可和错误不依赖颜色、不被截断，focus-visible 与焦点回返满足 UX 合同
**And** 测试断言浏览器展示不能改变服务端候选、digest、oracle 指标或 Gate 状态。

### Story 1.7: 记录同任务对照与两周复用证据

As a TickDeck 产品维护者,
I want 按冻结协议记录参与者的现有工具链对照、TickDeck 运行、盲审结果和两周内主动复用,
So that SM-00 可以基于真实、配对且不可事后改写的观察证据判定，而不是依赖访谈、演示或选择性样本.

**对应需求：** SM-00、A-01、A-02、A-05、OQ-02 已决协议；FR-055、FR-057、FR-094；AR-AD-02–AR-AD-04、AR-AD-07、AR-AD-13、AR-AD-19、AR-AD-20、AR-AD-28、AR-AD-31、AR-CON-01、AR-GATE-01；NFR-007、NFR-009、NFR-010、NFR-013、NFR-014、NFR-017、NFR-029、NFR-030。
**阶段：** S0-V
**依赖：** Story 1.6。
**Blocker：** 至少 12 名合格 alpha 用户尚未招募，真实基线任务、盲审记录和两周主动复用观察也尚不存在。不得生成参与者、补录虚构任务、把测试 fixture 当作真实观察，或在观察完成前声称 SM-00 有效。
**架构约束：** 实验观察通过版本化 command/schema 写入控制面，带 idempotency key、expected state version 和追加式审计；Web、Agent 与导入工具不能直接写数据库。参与者引用是实验用不透明标识，不是产品用户、账户、RBAC 或工作区授权主体。
**UX 约束：** UX-DR-005、UX-DR-017、UX-DR-023、UX-DR-026、UX-DR-029、UX-DR-030、UX-DR-037–UX-DR-040、UX-DR-042、UX-DR-045、UX-DR-050、UX-DR-052；S0-V 表面只显示脱敏的实验进度、证据完整性和 blocker，不展示参与者身份，也不生成 Go/Stop 结论。

**Acceptance Criteria:**

#### AC 1：按冻结资格规则登记真实参与者

**Given** 维护者准备登记一名实验参与者
**When** 提交参与者资格观察
**Then** 系统只接受 `S0VExperimentManifest` 中冻结的资格字段、判定规则和证据引用
**And** 使用稳定、不透明的 experiment participant reference，不创建产品账户、用户、组织或权限角色
**And** 样本进度区分合格、待补证据和不合格，不得为满足人数静默放宽规则
**And** 样本整体的 A/港股合法数据使用覆盖按冻结协议验证
**And** 参与者真实身份和敏感资格材料不得进入普通日志、URL、Agent 上下文或脱敏 read model。

#### AC 2：建立不可混淆的配对任务记录

**Given** 合格参与者开始冻结的同类真实选股任务
**When** 创建一次对照观察
**Then** 记录 participant ref、experiment/task/protocol version、执行顺序、arm、任务实例、开始/结束事件、数据路径、证据引用和有效性状态
**And** `existing-toolchain` 与 `tickdeck-r0` arm 使用 manifest 冻结的任务族、顺序和比较规则
**And** TickDeck arm 必须引用 Story 1.5/1.6 的精确 run、manifest、snapshot、condition tree、oracle 和 review identity
**And** 现有工具链 arm 只接受冻结基线协议允许的证据引用，不伪造第三方集成或自动补齐
**And** 同一观察不能同时属于两个 arm，重复提交由幂等键返回原结果。

#### AC 3：按冻结边界记录时间与人工成本

**Given** 一个 arm 的任务过程已经发生
**When** 系统形成任务观察
**Then** 仅使用 manifest 定义的开始、暂停、结束、证据核查和人工修正事件边界计算耗时
**And** 记录端到端任务时间、人工修正、证据核查成本及协议要求的其他观察字段
**And** 缺失、顺序冲突、客户端时钟异常或无法证明来源的事件标记为无效或待核查
**And** 不自行删除离群值、更改计时边界或为改善结果重算
**And** 任何指标定义变化都创建新协议版本，并保留原基线、环境、结果、理由和新目标。

#### AC 4：记录独立盲审与 oracle 结果

**Given** 两个 arm 已提交可审阅产物
**When** 按冻结盲审规则录入评审结果
**Then** 评审记录绑定匿名 arm artifact、review protocol/version、reviewer reference、实质错误、遗漏、理由和证据引用
**And** 评审材料在协议要求的盲态下不得暴露 arm、模型或产品提示
**And** TickDeck arm 同时引用 Story 1.4 的 precision、recall 和 mismatch，不由盲审主观判断替代 oracle
**And** 评审冲突、缺失或解盲违规按冻结协议标为待裁决或无效
**And** 已提交评审不得原地覆盖；更正必须追加新版本并保留前值和理由。

#### AC 5：记录两周内的主动二次复用

**Given** 参与者已完成协议规定的首次 TickDeck 真实任务
**When** 发生第二次同类真实任务或两周观察窗口结束
**Then** 记录首次完成时间、观察窗口、第二次 run identity、任务资格和主动发起证据
**And** 只有满足 manifest 中“主动复用”定义的真实 TickDeck run 才计入复用
**And** 提醒演示、维护者代跑、测试 fixture、打开页面或重复查看旧结果不得计入
**And** 尚未到窗口终点显示 `pending-observation`，窗口结束且无合格复用时记录实际未复用结果
**And** 不提前把 pending 参与者排除或计为成功。

#### AC 6：显式记录违规和实验失效条件

**Given** 数据许可、越权、任务、样本、盲审或协议条件发生异常
**When** 系统接收对应证据或审计事件
**Then** 记录 violation/invalidity 类型、来源、时间、影响范围、证据引用和处理状态
**And** 数据许可或越权违规不能被删除、改名为普通错误或从分母中静默移除
**And** 数据路径、授权、snapshot 或 protocol digest 漂移时，所有受影响观察明确标记
**And** 实验无效状态阻止该证据集进入 Story 1.8 的有效 Gate 计算
**And** 系统不提供忽略、管理员覆盖或手工改绿入口。

#### AC 7：生成确定性的脱敏证据集

**Given** 存在零个或多个参与者、任务、盲审和复用观察
**When** 系统生成 S0-V evidence dataset
**Then** 数据集绑定 experiment/protocol/manifest 及全部 source digest，并区分 valid、pending、invalid 和 violated 记录
**And** 确定性派生配对任务时间、错误/遗漏、人工修正、核查成本和复用观察所需的统计输入
**And** 所有百分比、比率和聚合遵守冻结算法及 AD-31 数值合同
**And** 相同有效输入产生相同 evidence digest，观察补充或更正产生新版本而不覆盖旧版本
**And** 本 Story 只生成证据与测量值，不判断 Go、Stop、Narrow，也不关闭 A-01、A-02 或 A-05。

#### AC 8：展示完整性而不泄露或暗示结论

**Given** 维护者查看 S0-V 实验进度
**When** 加载脱敏 evidence read model
**Then** 显示合格样本数、市场覆盖、配对任务完整度、盲审状态、两周窗口状态、违规数、无效记录和缺失证据
**And** 每项可深链到脱敏 observation、run、review 或 blocker，失败时保留对象 ID、版本和原因
**And** pending、invalid、violation 和 complete 使用文字、图标及影响说明，不依赖颜色
**And** 页面不展示参与者身份、受限数据、完整评审材料或外部服务秘密
**And** 页面明确说明“证据收集中”或“证据集完整”，不得显示 SM-00 已通过、阶段 Go 或后续导航。

#### AC 9：通过幂等、篡改与样本完整性测试

**Given** 正常配对、重复提交、缺失 arm、计时冲突、盲审解盲、无效任务、pending 窗口、伪复用、违规和更正 fixtures
**When** command handler、统计投影和 Web read model 运行同一 corpus
**Then** 重试不产生重复观察，冲突不留下半写状态，旧版本和审计链保持可验证
**And** 统计结果不受输入顺序、分页、并发或模型输出影响
**And** 删除违规、篡改 digest、放宽资格或把 pending 排除出分母的尝试全部失败
**And** fixture 只能验收机制；Story 1.8 所需的有效 evidence dataset 仍必须来自真实合格参与者和完成的两周观察。

### Story 1.8: 生成不可伪造的 SM-00 Go/Stop 决策

As a TickDeck 产品维护者,
I want 由 Gate Registry 根据冻结协议和完整真实证据确定 S0-V 的 Go 或 Stop/Narrow 结果,
So that 产品 thesis 不能被模型、界面、选择性样本或事后调整指标错误放行.

**对应需求：** SM-00、A-01、A-02、A-05、CAP-11、S0-V 阶段门；FR-055、FR-057、FR-094；AR-AD-02–AR-AD-04、AR-AD-13、AR-AD-19、AR-AD-20、AR-AD-28、AR-AD-31、AR-CON-01、AR-GATE-01；NFR-007、NFR-010、NFR-013、NFR-014、NFR-017、NFR-029、NFR-030、NFR-036。
**阶段：** S0-V
**依赖：** Story 1.7。
**Blocker：** 当前没有 Story 1.7 所要求的完整真实 evidence dataset。样本、配对任务、盲审、两周观察或数据权利证据未完成时只能返回 `blocked/not-evaluable`，不得生成 Go，也不得把不完整证据解释为 Stop。
**架构约束：** Gate Registry 是唯一判定权威，只读取带 source digest 的冻结 Gate 规范和不可变 evidence dataset；模型、Web、实验操作者及构建参数均不能修改阈值或结果。决策记录按 AD-19 提供可验篡改证据，但不宣称能够抵御拥有主机 root 权限者的篡改。
**UX 约束：** UX-DR-005、UX-DR-017、UX-DR-023、UX-DR-026、UX-DR-030、UX-DR-037–UX-DR-040、UX-DR-042、UX-DR-045、UX-DR-050、UX-DR-052；结果只在 S0-V“运行与健康”及证据审阅表面出现，不挂载 S0–S5 导航或能力 teaser。

**Acceptance Criteria:**

#### AC 1：先验证证据是否可判定

**Given** Gate Registry 收到一个 S0-V evidence dataset
**When** 开始 SM-00 评估
**Then** 校验 experiment、protocol、manifest、dataset、task、baseline、snapshot、oracle、model qualification 和全部 source digest
**And** 校验至少 12 名合格参与者、协议要求的市场覆盖、每人规定的配对真实任务、完整盲审和已经结束的两周观察窗口
**And** pending、无法裁决、非法排除、digest 漂移或其他证据缺口使结果保持 `blocked/not-evaluable`
**And** 已确认的数据许可或越权违规属于有效失败证据，而不是证据缺失
**And** fixture、demo、正面访谈、一次演示或模型总结不能使证据完整。

#### AC 2：按冻结算法确定性计算 SM-00

**Given** evidence dataset 完整且可判定
**When** 计算 SM-00 指标
**Then** 只使用冻结 manifest 中的样本、分母、配对、计时、盲审、复用、舍入和异常处理规则
**And** 计算端到端任务时间中位数降低比例、实质错误或遗漏率降低比例、两周主动二次复用比例和数据许可/越权违规数
**And** 所有金融式比率和百分比遵守 AD-31，计数和排序遵守确定性约定
**And** 相同规范输入产生完全相同的指标、判定和 decision digest
**And** 指标缺少算法或阈值时返回 blocker，不使用代码默认值补齐。

#### AC 3：只有全部阈值同时满足才能 Go

**Given** SM-00 指标已经确定性计算
**When** Gate Registry 判断 Go
**Then** 必须同时满足：合格参与者不少于 12 名
**And** 每名参与者完成冻结协议要求的同类真实任务和现有工具链/TickDeck 对照
**And** 端到端任务时间中位数降低至少 30%
**And** 经盲审确认的实质错误或遗漏率降低至少 25%
**And** 至少 60% 参与者在两周内主动用 Agent 完成第二个合格真实任务
**And** 数据许可或越权违规数为 0
**And** 任一条件未满足时都不能通过多数表决、人工豁免或其他指标补偿。

#### AC 4：失败时执行 Stop/Narrow 规则

**Given** evidence dataset 完整但任一 SM-00 条件未满足
**When** Gate Registry 形成失败结果
**Then** 结果明确为停止平台化建设并要求进行 Stop/Narrow 决策
**And** A-01 记录为未获支持或已被当前实验否证，并引用失败指标与证据
**And** 系统不得自动选择新的产品范围、辅助入口设计或替代 thesis
**And** 收窄方向必须作为新的上游产品决策另行批准，不能由本 Story 推断
**And** 失败结果不能通过重新命名指标、移除违规、排除不利参与者或修改旧 dataset 转为 Go。

#### AC 5：生成不可混淆且可验篡改的决策记录

**Given** 评估结果为 Go、Stop/Narrow 或 blocked/not-evaluable
**When** 系统保存 `S0VGateDecision`
**Then** 记录 decision ID/version、规范版本、evidence digest、全部指标与阈值、逐项 pass/fail/block、原因、生成时间、Gate 前后状态和证据引用
**And** 使用 RFC 8785、domain-separated SHA-256 和追加式审计生成不可混淆 identity
**And** 决策不可原地覆盖；补充证据或协议变更产生新 dataset、新决定和新 digest
**And** 旧决定及其当时输入、状态和审计引用继续保留
**And** UI、日志和文档准确描述其为 tamper-evident，不声称对主机 root tamper-proof。

#### AC 6：严格限制 Gate 与能力影响

**Given** `S0VGateDecision` 已形成
**When** Gate Registry 应用结果
**Then** 只有有效 Go 可以把 S0-V 前置条件标记为 passed
**And** Go 仅表示允许考虑下一阶段，不注册、构建、挂载或启用任何 S0–S5 能力
**And** S0 的实际能力仍须满足自身实现、证据和 OQ-06 等 blocker；S1 仍受 OQ-03 阻塞
**And** Stop/Narrow 或 blocked 状态下，后续阶段能力继续不注册且不显示 teaser
**And** Gate 状态变更与 decision/audit 在同一权威事务中保持一致，失败不能留下半更新状态。

#### AC 7：准确呈现结论、证据和假设影响

**Given** 维护者查看 S0-V Gate 状态
**When** 加载决策 read model
**Then** 首先显示 Go、Stop/Narrow 或 blocked/not-evaluable 及其直接影响
**And** 显示每个 SM-00 指标的实际值、冻结阈值、判定和证据深链
**And** blocked 状态列出缺失证据和合法下一步，Stop/Narrow 状态列出失败指标但不提供“改绿”操作
**And** Go 时只关闭 A-01；A-02 仍需 SM-01R，A-05 仍需 SM-02 和 SM-11，不能被 SM-00 单独关闭
**And** 页面不泄露参与者身份、受限数据、秘密或完整盲审材料。

#### AC 8：通过边界值、并发与篡改测试

**Given** 完整通过、单项失败、违规数大于零、恰好达到阈值、指标略低于阈值、证据缺失、pending 窗口、digest 漂移、并发评估和审计篡改 fixtures
**When** Gate evaluator、事务写入和 Web read model 运行同一 corpus
**Then** 每个 fixture 产生唯一、稳定且符合合同的 Go、Stop/Narrow 或 blocked/not-evaluable 结果
**And** 精度、舍入、边界值、输入顺序、并发和重试不能改变判定
**And** 模型输出、客户端参数、直接数据库写入或旧 decision replay 均不能解锁后续能力
**And** 事务故障不会留下 decision、Gate 状态和审计互相矛盾的半写状态
**And** 测试 fixture 不能形成真实 Go；实际 S0-V 通过仍必须引用 Story 1.7 的完整真实 evidence dataset。

## Epic 2: 安全启动并维护可复现的受信工作区

自托管部署者可以通过受保护的本地 B/S、远端 B/S 或 Tauri 薄桌面入口启动同一工作区内核，使用明确标记的演示路径，并检查会话、Gate、策略、任务恢复、沙箱证据、秘密与诊断状态。

### Story 2.1: 建立唯一工作区身份与持久化真值

As a TickDeck 自托管部署者,
I want 每个 data root 只对应一个受保护、可验证且可重启恢复的工作区真值,
So that 配置、运行和工件不会因路径变化、并发实例或多套存储权威而分叉.

**对应需求：** FR-073 的 S0 共同持久化底座（后续领域对象仍须在所属阶段独立验收）；CAP-9、S0 阶段门；AR-AD-01–AR-AD-03、AR-AD-10、AR-AD-11、AR-AD-13、AR-AD-27、AR-AD-30、AR-AD-31、AR-CON-01；NFR-008、NFR-010、NFR-012、NFR-013、NFR-026、NFR-029。
**阶段：** S0
**依赖：** Epic 1 / Story 1.8 的有效 S0-V Go。
**Blocker：** 当前不存在完整真实 SM-00 evidence dataset 或有效 S0-V Go。不得使用 fixture、手工改库或构建参数取得实际 S0 实施授权；fixture 只能验收本 Story 的机制。
**架构约束：** SQLite WAL 是唯一数据库，Fastify 控制面是数据库和 Artifact Service 的唯一访问者；大工件进入同主机内容寻址文件库。工作区身份由持久 UUID、`workspace_generation`、owner principal 和 OS file identity 决定，路径字符串只用于定位。
**UX 约束：** UX-DR-005、UX-DR-023、UX-DR-026、UX-DR-037–UX-DR-040、UX-DR-045、UX-DR-052；只在现有“运行与健康”表面显示脱敏存储状态，不挂载 Diagnostic Panel 或任何 S1+ 业务入口。

**Acceptance Criteria:**

#### AC 1：强制 S0-V Go 前置条件

**Given** 启动请求指向尚未获得有效 S0-V Go 的工作区
**When** product-supervisor 尝试初始化或升级到 S0 schema
**Then** Gate Registry 返回稳定 blocker，并拒绝创建或迁移 S0 领域存储
**And** 已有 S0-V 证据保持只读、可检查且不被删除
**And** fixture Go 只能用于隔离测试环境，不能写入真实工作区或 Release Manifest
**And** 客户端、环境变量和直接数据库修改不能覆盖该前置条件。

#### AC 2：安全解析并创建 data root

**Given** S0-V Go 有效且部署者提供 data root
**When** product-supervisor 解析工作区位置
**Then** 显式路径先绝对化并解析既有祖先，拒绝 symlink/reparse traversal
**And** 拒绝安装目录、临时目录、network filesystem、owner 不匹配或无法证明可靠锁语义的位置
**And** 新建目录使用 Unix owner-only mode 或 Windows owner-only DACL
**And** 路径错误返回稳定英文 code、影响和合法下一步，不回退到其他目录
**And** 不使用 `$HOME`、当前工作目录或临时目录作为静默替代。

#### AC 3：生成稳定且不可混淆的工作区身份

**Given** data root 已通过安全校验
**When** 首次初始化工作区
**Then** `${dataRoot}/workspace.id` 持久保存随机 workspace UUID、owner UID/SID、格式版本和 `workspace_generation`
**And** 运行身份同时绑定 workspace UUID 与 Unix device/inode 或 Windows volume/file ID
**And** 路径重命名不改变已验证的同文件系统身份
**And** 身份不匹配、复制目录、跨 OS 或跨文件系统移动默认拒绝
**And** 跨边界移动只能通过后续正式 restore 流程，本 Story 不实现或冒充恢复。

#### AC 4：保证一个工作区只有一个活动实例

**Given** 一个实例已经持有 `${dataRoot}/.tickdeck.lock`
**When** 第二个进程尝试打开同一工作区
**Then** product-supervisor 使用 `flock` 或 `LockFileEx` 的非阻塞 OS 文件锁拒绝第二个权威实例
**And** 错误说明工作区正在使用且不破坏现有实例
**And** 不通过另建数据库、复制 data root、随机端口或只读写分流形成第二权威
**And** 异常退出后 OS 释放锁，下一次启动仍须重新验证身份和存储完整性。

#### AC 5：初始化唯一的 SQLite WAL 真值

**Given** 工作区身份和独占锁均有效
**When** 控制面初始化持久化层
**Then** `packages/storage-sqlite` 创建唯一版本化 SQLite schema，并启用 WAL
**And** SQLite 保存当前阶段的工作区元数据、配置、Capability/Gate 引用、operation 元数据、运行引用和 Artifact Manifest
**And** schema 迁移具有明确版本、兼容范围和校验结果
**And** 迁移失败不得提交半迁移状态，旧数据仍可识别并保持可恢复
**And** 不实现 PostgreSQL、远程数据库、网络文件系统或可替换数据库抽象。

#### AC 6：以内容寻址 Artifact Service 持有大工件

**Given** 控制面需要持久保存一个不可变工件
**When** 经 `packages/artifact-fs` 执行 stage、verify 和 commit
**Then** Artifact Manifest 记录 digest、size、media/schema、sensitivity、retention 和 workspace generation
**And** 状态严格遵循 `STAGING → VERIFIED_UNCOMMITTED → COMMITTED → QUARANTINED | DELETED`
**And** 服务端完成临时写入、digest/size 校验、durable flush 和 atomic promote 后，领域事务才可引用 `COMMITTED` 工件
**And** 有 manifest 无 blob 时 fail closed 并 quarantine；promote 后未提交的 blob 只能作为 verified candidate 或 orphan
**And** Worker、Web、connector、sidecar 和 sandbox 均不能直接访问数据库或工件路径。

#### AC 7：不提前创建后续领域能力

**Given** 本 Story 只建立 S0 共同持久化真值
**When** 检查 schema、API、Capability Manifest 和 UI
**Then** 不存在自选、通用筛选器、图表、提醒、脚本、回测、模拟组合、扩展或其他 S1–S5 command handler 与导航
**And** 仅定义后续领域聚合必须使用的稳定 ID、版本、repository port 和 Artifact Manifest 合同
**And** 浏览器缓存、localStorage、IndexedDB、Worker 文件和 artifact 内容都不成为状态权威
**And** FR-073 中每类未来产物仍须在所属阶段证明其领域持久化，不因本 Story 自动视为完成。

#### AC 8：提供脱敏的只读存储状态

**Given** 部署者打开当前阶段的“运行与健康”表面
**When** 查询 workspace/storage read model
**Then** 显示 workspace ID 的安全缩略、generation、schema version、SQLite/Artifact 状态、最近完整性检查及 blocker
**And** 不显示完整本地路径、owner 标识、文件内容或受限 payload
**And** 浏览器只能读取，不能编辑 workspace identity、generation、schema 或工件状态
**And** 错误说明发生了什么、影响什么、系统采取了什么动作和部署者可以做什么。

#### AC 9：通过重启、故障和路径安全测试

**Given** 覆盖首次创建、正常重启、并发打开、身份漂移、路径穿越、网络文件系统、迁移中断、缺失 blob、orphan 和损坏 digest 的 fixtures
**When** product-supervisor、Fastify、SQLite 和 Artifact Service 运行同一恢复 corpus
**Then** 每种情况产生稳定、确定且 fail-closed 的状态和错误
**And** 故障不会产生两个权威工作区、半迁移 schema 或引用未提交工件
**And** 干净重启后 workspace identity、generation、schema 和 committed artifact identity 保持一致
**And** 测试断言 Web、Worker 和直接文件写入不能绕过控制面
**And** 实际 S0 运行仍须引用真实 S0-V Go，测试 fixture 不能关闭该 blocker。

### Story 2.2: 保证命令、任务、审计与恢复一致

As a TickDeck 自托管部署者,
I want 所有状态修改和后台任务在重试、断线或进程崩溃后保持同一个权威结果,
So that 工作区不会产生重复操作、丢失审计或被旧 Worker 覆盖.

**对应需求：** FR-073、FR-093 的 S0 一致性底座（提醒、模拟订单等领域副作用仍须在所属阶段独立验收）；CAP-9、S0 阶段门；AR-AD-01、AR-AD-03、AR-AD-04、AR-AD-10、AR-AD-13、AR-AD-19、AR-AD-27、AR-CON-01；NFR-006–NFR-010、NFR-013、NFR-014、NFR-017、NFR-026、NFR-028、NFR-029、NFR-036。
**阶段：** S0
**依赖：** Story 2.1。
**Blocker：** Story 2.1 及其真实 S0-V Go 前置未满足时，只能运行隔离的协议与故障 fixture，不得在真实工作区注册 S0 command、job 或 Worker handler。
**架构约束：** Fastify 控制面是命令、状态、Gate、审计、outbox 和任务准入的唯一权威；Worker 只经 TickDeck Local RPC v1 获取租约和提交结果。事务内禁止外部副作用，所有运行绑定唯一不可变 RunContext。
**UX 约束：** UX-DR-005、UX-DR-013、UX-DR-023、UX-DR-027–UX-DR-030、UX-DR-037–UX-DR-040、UX-DR-042、UX-DR-045、UX-DR-052；S0 只在“运行与健康”展示当前阶段任务及恢复来源，不挂载 S2 的 Risk Gate、等待授权或暂停/恢复交互。

**Acceptance Criteria:**

#### AC 1：统一所有命令身份与幂等语义

**Given** HTTP、内部调度器或恢复流程提交一个状态修改意图
**When** 控制面接收命令
**Then** 所有入口先映射到 canonical action registry 中的同一 action
**And** `OperationIdentity` 绑定 workspace generation、subject、canonical action ID、idempotency key 和 RFC 8785 参数 digest
**And** 相同 identity 与相同 digest 返回首次 operation/result
**And** 相同 identity 与不同 digest 返回稳定 conflict，不创建第二 operation
**And** 每个 mutation 必须携带 expected state version，版本不匹配时 fail closed。

#### AC 2：在单一事务中提交状态、审计与 outbox

**Given** 命令已通过 schema、Gate、状态版本和当前适用策略校验
**When** 控制面提交命令
**Then** 在一个串行 SQLite 写事务中占用 operation/idempotency identity、写入当前阶段领域变化、追加审计并创建 outbox/job
**And** 任一步失败时整个事务回滚，不留下半写领域状态、孤立 job 或缺失审计
**And** 事务提交前不得调用 Worker、网络、模型、connector、sidecar 或 sandbox
**And** outbox dispatcher 只处理已经提交的记录
**And** Web、Worker 和直接文件写入不能建立平行 mutation 路径。

#### AC 3：冻结唯一的 RunContext

**Given** 一个当前阶段任务即将入队
**When** 控制面创建 RunContext
**Then** 使用 `packages/core` 唯一的版本化 discriminated schema 和唯一 factory/validator
**And** common envelope 绑定 workspace generation、build/capability/Gate、subject、locale/timezone、data snapshot、policy/risk、budget 和授权引用
**And** 当前 run kind 对 execution assumption、script/compiler/WIT、model/prompt/toolset 和 portfolio 等字段明确标记 required 或 not-applicable
**And** RunContext 以 RFC 8785 和 domain-separated SHA-256 形成不可变 digest
**And** job、audit、artifact、recovery 和未来授权只能引用该 digest，不得各自复制或重解释运行输入。

#### AC 4：建立受认证的 Local RPC 边界

**Given** server 与 Worker 进程启动
**When** Worker 连接 TickDeck Local RPC v1
**Then** Linux/macOS 使用权限收紧的 Unix domain socket，Windows 使用带 ACL 的 named pipe
**And** 首次 handshake 校验协议范围、peer role、build/capability/manifest digest 和每次启动轮换的 bearer credential
**And** 无共同版本、身份不匹配或 credential 无效时 fail closed
**And** control body、artifact stream、并发、队列和 deadline 遵守 AD-27 的固定上限与背压语义
**And** 传输层不隐式重试，断线后只能通过 operation identity 和权威 HTTP snapshot 恢复。

#### AC 5：用租约和 fencing 阻止旧 Worker 写回

**Given** Worker 领取一个已提交 job
**When** 控制面签发执行租约
**Then** 租约绑定 operation、RunContext digest、workspace generation、Worker instance、deadline 和单调递增 fencing epoch
**And** Worker 只能在有效租约内报告心跳、进度和结果
**And** 租约过期后重新领取会产生更高 epoch
**And** 旧 epoch、错误 RunContext、错误 generation 或错误 Worker identity 的结果全部拒绝
**And** Worker 不得直接修改领域表、audit、outbox 或 Artifact Manifest。

#### AC 6：明确取消、崩溃和不确定结果

**Given** 任务正在执行、等待分派或外部效果状态不明
**When** 用户取消、进程崩溃、租约过期或网络断开
**Then** 取消请求先持久化，再向执行进程发送信号
**And** 浏览器或会话断开不等于取消
**And** 纯计算可在同一 operation、同一 RunContext 下创建新 attempt 并重新排队
**And** 已 dispatch 但未取得可信结果的外部效果进入 `UNCERTAIN`，不得盲目重发
**And** 恢复记录保留前一 attempt、最后成功步骤/时间、判定理由和新 fencing epoch
**And** 当前 S0 UI 不提供 S2 的 waiting、paused 或交互式恢复入口。

#### AC 7：维护独立且可验篡改的 Audit Ledger

**Given** 命令、任务、恢复、取消、Gate 或 Artifact 状态发生变化
**When** 控制面追加审计事件
**Then** 每条记录包含连续 seq、前一条 digest、规范 event digest、当前 digest、operation/run 引用、原因和脱敏结果
**And** 运行日志与 Audit Ledger 分离，日志轮转不能删除权威审计
**And** 审计不包含秘密、完整提示或受限 payload
**And** 启动及明确检查时验证哈希链，断链使相关资格和写入路径 fail closed
**And** 产品准确声明 tamper-evident，不声称可以抵御主机 root 篡改。

#### AC 8：通过权威快照呈现运行状态

**Given** 当前阶段存在 queued、running、succeeded、failed、canceled、interrupted 或 uncertain 任务
**When** 用户查看“运行与健康”
**Then** HTTP snapshot 显示 run ID、manifest/version、RunContext digest、状态、步骤/进度、事件 cursor、耗时、成本、最后成功时间、恢复来源和稳定错误
**And** SSE 仅通知变化并携带 event ID；序号缺口或重连必须重新取得 HTTP snapshot
**And** 未知进度只显示阶段和耗时，不伪造百分比
**And** 高频进度可以合并，但状态转换、失败、取消和恢复事件不能丢失
**And** read model 不暴露 bearer credential、IPC 路径、秘密或受限 payload。

#### AC 9：通过故障注入与重复执行测试

**Given** 重复命令、参数冲突、提交前崩溃、提交后分派前崩溃、执行中断线、过期租约、旧 fencing 结果、取消竞态、SSE 缺口、审计断链和 uncertain 外部效果 fixtures
**When** server、Worker、SQLite、outbox、Local RPC 和 Web 运行同一恢复 corpus
**Then** 每个 logical operation 只有一个权威身份和最终状态
**And** 重试不产生重复领域变化，旧 Worker 不能覆盖新结果
**And** 状态变化、outbox 和审计不存在互相矛盾的半写结果
**And** 测试结果不依赖模型输出、进程时序或客户端投影
**And** 当前测试只验证 S0 一致性底座，不注册提醒、模拟订单或其他后续领域 handler。

### Story 2.3: 建立受保护的单工作区会话

As a TickDeck 自托管部署者,
I want 本地和远端访问都经过同一实例级受保护会话,
So that localhost、代理头或桌面壳不能被误当作身份与授权。

**对应需求：** FR-072、FR-089；AR-AD-02、AR-AD-03、AR-AD-06、AR-AD-13、AR-AD-19、AR-AD-30；NFR-013–NFR-015、NFR-017、NFR-033。
**阶段：** S0
**依赖：** Story 2.1。
**Blocker：** 继承 Epic 2 的真实 S0-V Go 前置；缺少 Go 时只能使用隔离会话 fixture。
**架构约束：** 一实例一受信工作区，没有用户、组织、RBAC 或多租户；session、bootstrap、CSRF 与 WebSocket ticket 只由控制面签发和校验。
**UX 约束：** UX-DR-005、UX-DR-036–UX-DR-040、UX-DR-045、UX-DR-052；首次引导必须直说所有获准进入实例的人共享权限和数据。

**Acceptance Criteria:**

#### AC 1：明示单工作区信任边界

**Given** 用户首次进入本地或远端实例
**When** App Shell 完成会话 bootstrap
**Then** 界面说明该实例共享一个工作区、权限和数据
**And** 不出现用户归属、角色、组织或租户设置
**And** 代理 identity 仅作审计归因，不参与权限决策。

#### AC 2：安全完成本地配对

**Given** 本地 B/S 实例只监听 loopback
**When** 用户通过随机 `<instance>.tickdeck.localhost:<port>` origin 配对
**Then** TTY 只显示一次性配对码，页面以 body 提交且秘密不进入 URL
**And** 成功后签发绑定精确 origin 的 host-only、HttpOnly、SameSite=Strict cookie
**And** bootstrap 材料不进入 argv、environment、日志或 Web JavaScript。

#### AC 3：安全完成远端会话

**Given** 远端实例位于 HTTPS 或明确 trusted proxy 后
**When** workspace admin secret 建立会话
**Then** 仅接受精确可信代理来源的转发头并签发 Secure cookie
**And** 上游端口旁路、伪造代理 identity 或未受信来源全部拒绝
**And** 部署指南明确代理承担 TLS、外层 access log 与 rate limit。

#### AC 4：保护所有可变请求与 WebSocket

**Given** 客户端发起 mutation 或 WebSocket 握手
**When** 控制面校验请求
**Then** mutation 同时校验 session、CSRF、Host 与 Origin
**And** WebSocket 使用短期单次 ticket 并校验 Origin
**And** idle/absolute expiry、撤销或主体不匹配时 fail closed
**And** 会话失效不取消已经提交的 durable task。

#### AC 5：通过会话与来源攻击测试

**Given** 错误 Host/Origin、CSRF、跨站 WebSocket、DNS rebinding、伪造转发头、上游旁路和 bootstrap 泄漏 fixtures
**When** 本地与远端会话套件运行
**Then** 未授权状态修改成功数为 0
**And** 日志、URL、前端 bundle 和审计均不含原始会话或 bootstrap secret
**And** 测试不会创建用户/RBAC 或提前注册桌面业务通道。

### Story 2.4: 实现独立 Vault 与 SecretRef 生命周期

As a TickDeck 自托管部署者,
I want 凭据只以可轮换、可撤销的 SecretRef 被产品使用,
So that 秘密不会进入数据库业务表、浏览器、Agent、日志或工件。

**对应需求：** FR-075、FR-096；AR-AD-02、AR-AD-06、AR-AD-09、AR-AD-11、AR-AD-19、AR-AD-25、AR-AD-29；NFR-013–NFR-015、NFR-020、NFR-038。
**阶段：** S0
**依赖：** Story 2.1。
**Blocker：** Vault 的精确加密库、算法、KDF、轮换/迁移格式及 headless secret-file 权限规则仍未决定；不得自行选择。缺少经批准的 `VaultProfile` 时必须保持 `LOCKED`。
**架构约束：** 独立 Vault 持有密文，SQLite 只存 SecretRef 元数据；控制面 Secret Broker 是 mutation、平台 key-store 和 plaintext resolution 的唯一 owner。
**UX 约束：** UX-DR-005、UX-DR-022、UX-DR-023、UX-DR-036–UX-DR-040、UX-DR-045、UX-DR-052；S0 只显示已设置/LOCKED/失效状态，不挂载 S1“连接与模型”配置页。

**Acceptance Criteria:**

#### AC 1：未锁定方案时拒绝启用

**Given** 工作区没有经批准且 digest 匹配的 VaultProfile
**When** 服务启动或收到秘密操作
**Then** Vault 状态为 `LOCKED`，秘密创建、解析和外部拨号全部拒绝
**And** 不使用明文文件、环境变量或弱化算法回退
**And** blocker 显示缺少的决策与证据，不声称秘密管理就绪。

#### AC 2：使用外部根密钥解锁独立 Vault

**Given** VaultProfile 已由上游决策锁定
**When** 操作者解锁 Vault
**Then** 根 wrapping/unlock key 只来自 Windows Credential Manager、macOS Keychain、Linux Secret Service 或获批 headless secret source
**And** SQLite、Artifact、日志、outbox 和 job 均不保存根密钥或明文秘密
**And** owner、权限、profile digest 或迁移状态不符时 fail closed。

#### AC 3：版本化创建、轮换与撤销

**Given** 操作者创建、轮换或撤销凭据
**When** Secret Broker 提交命令
**Then** 每次创建/轮换生成不可变 SecretVersion 并原子切换 active pointer
**And** rotate/revoke 单调增加 secret epoch
**And** SQLite 只记录 SecretRef、版本、epoch、scope、状态和脱敏审计
**And** 已撤销或旧 epoch 的新调用不能解析明文。

#### AC 4：只签发单次最小秘密租约

**Given** 当前 operation 已通过 policy、risk 和目的校验
**When** Worker 请求解析 SecretRef
**Then** 返回只存在内存、绑定 operation、SecretVersion、epoch 与 expiry 的最小 lease
**And** lease 不得跨 operation、connector pool 或持久介质缓存
**And** sidecar 只能接收本次调用的短期注入，不能访问 Vault 或平台 key store。

#### AC 5：验证泄漏、备份与失效边界

**Given** 创建、轮换、撤销、旧队列、默认备份、无密钥恢复和诊断导出 fixtures
**When** Vault 合规套件运行
**Then** 浏览器、Agent、日志、artifact、outbox、默认备份和诊断中秘密值出现次数为 0
**And** 无正确材料时秘密恢复成功率为 0，恢复后所有 SecretRef 必须重验
**And** fixture 只能验证机制，不能关闭未决 VaultProfile blocker。

### Story 2.5: 编译默认拒绝的 DataUsePolicy

As a TickDeck 自托管部署者,
I want 系统按数据授权和目标动作统一裁决每一种使用方式,
So that 合法取得的数据不会被误当作可任意派生、外发、导出或备份。

**对应需求：** FR-086；AR-AD-02、AR-AD-03、AR-AD-07、AR-AD-10、AR-AD-11、AR-AD-13、AR-AD-31；NFR-008、NFR-012–NFR-015、NFR-029、NFR-032、NFR-038。
**阶段：** S0
**依赖：** Story 2.1、Story 2.2。
**Blocker：** 继承 Epic 2 的真实 S0-V Go 前置；本 Story不自行解释任何具体供应商许可。
**架构约束：** `packages/policies` 是无 DB、网络或秘密访问的纯函数编译器，输出仅为版本化 `ALLOW | DENY(reason)`；模型、connector 与扩展只能收紧不能放宽。
**UX 约束：** UX-DR-005、UX-DR-008、UX-DR-009、UX-DR-023、UX-DR-037–UX-DR-040、UX-DR-045、UX-DR-052；只显示裁决、影响与证据，不提供免责式覆盖。

**Acceptance Criteria:**

#### AC 1：编译完整策略输入

**Given** connector authorization、用途/到期、deployment scope、数据类别和目标 action 已提供
**When** DataUsePolicy 编译器运行
**Then** 生成版本、摘要、输入证据引用和明确 `ALLOW` 或 `DENY(reason)`
**And** 未知、冲突、不可验证、到期或未知 action 一律拒绝
**And** 策略不得包含可执行脚本或客户端规则。

#### AC 2：传播最严格的数据限制

**Given** 产物引用一个或多个来源
**When** 创建索引、筛选、报告、模型输入、导出或备份 lineage
**Then** 下游策略取全部来源的最严格交集
**And** provenance、lineage、expiry 与 downstream refs 写入资产清单
**And** 派生、摘要或格式转换不能解除来源限制。

#### AC 3：在执行时重新校验

**Given** RunContext 已冻结旧策略证据
**When** 实际 action 即将执行
**Then** 控制面使用当前授权、expiry 与策略 epoch 重新裁决
**And** 旧 RunContext 只用于复现，不授权当前动作
**And** 策略变化后的 queued work 被拒绝并返回合法下一步。

#### AC 4：显式呈现拒绝与不可复现

**Given** 授权到期、撤销或动作不允许
**When** 用户查看受影响状态
**Then** read model 显示策略版本、拒绝原因、影响范围和可采取动作
**And** 清理或隔离后保留非敏感 provenance 与 `not-reproducible` 标记
**And** 不以免责声明、Toast 或模型说明替代执行拒绝。

#### AC 5：通过默认拒绝属性测试

**Given** 未知许可、未知类别、未知 action、到期、冲突、多来源和派生链 fixtures
**When** 浏览器、server、Worker 和策略测试使用同一 corpus
**Then** accept/reject、摘要和稳定原因完全一致
**And** 非法 case 获得 ALLOW 的数量为 0
**And** 模型输出、connector manifest 或客户端参数不能放宽裁决。

### Story 2.6: 执行受控出站与拨号前授权

As a TickDeck 自托管部署者,
I want 所有外部请求在每次拨号前重新验证目的、数据、凭据、预算和授权,
So that 模型、数据连接器或 Webhook 不能绕过策略访问危险地址或泄露凭据。

**对应需求：** FR-088；AR-AD-02、AR-AD-04、AR-AD-07–AR-AD-09、AR-AD-27、AR-AD-29；NFR-013–NFR-015、NFR-017、NFR-029、NFR-034。
**阶段：** S0
**依赖：** Story 2.3、Story 2.4、Story 2.5。
**Blocker：** Story 2.4 的 VaultProfile 未关闭时，需凭据的真实出站保持 `LOCKED`；测试不得用明文凭据绕过。
**架构约束：** 只有 Worker Egress Gateway 可打开外部 socket；server、product-supervisor、Tauri、sidecar 和 sandbox 不得形成第二出站路径。
**UX 约束：** UX-DR-005、UX-DR-023、UX-DR-026、UX-DR-037–UX-DR-040、UX-DR-045、UX-DR-052；S0 仅在健康表面显示出站资格与 blocker，不提前挂载 endpoint 配置 UI。

**Acceptance Criteria:**

#### AC 1：规范化外部接收方身份

**Given** 一个外部 destination 需要登记
**When** 控制面创建 ExternalRecipientId
**Then** identity 绑定 scheme、canonical host、effective port、destination class、provider/profile、tenant/path scope、credential scope 与 redirect policy
**And** DNS/IP 只作为每次拨号证据，不作为稳定 identity
**And** adapter 不得自行把新地址视为已批准接收方。

#### AC 2：每次请求执行完整策略检查

**Given** Worker 准备发送外部请求
**When** Gateway 校验 attempt
**Then** 同时检查 DataUsePolicy、精确 allowlist、数据最小化、credential scope、请求/字节/时间/成本预算与风险授权
**And** 响应按不可信输入进行 schema 与内容校验
**And** 审计只记录脱敏 destination、policy 与结果元数据。

#### AC 3：阻止危险网络目标与重定向

**Given** DNS 解析、重定向或连接目标发生变化
**When** Gateway 准备连接
**Then** 默认拒绝 loopback、private、link-local、reserved 与云元数据地址
**And** 连接已验证 IP，每次受限重定向重新解析和校验
**And** credential 不得跨 host 转发
**And** 内网例外必须引用另行批准的 recipient 与风险证据。

#### AC 4：消费单次 ExecutionAuthorization

**Given** 所有 policy、recipient、secret 和 budget 都可能在 RunContext 后变化
**When** attempt 即将拨号
**Then** Gateway 调用控制面 `authorize-dispatch`
**And** 控制面原子校验当前 epochs、创建并消费 `max_uses=1` 的 ExecutionAuthorization、标记 `DISPATCHING` 并追加审计
**And** 线性化前任一变化都拒绝；线性化后不明结果按 Story 2.2 进入 `UNCERTAIN`。

#### AC 5：通过出站对抗套件

**Given** SSRF、DNS rebinding、云元数据、危险重定向、跨主机凭据、过期授权、预算超限和第二 socket 路径 fixtures
**When** Gateway 与进程边界测试运行
**Then** 攻击或绕过成功率为 0
**And** 未经批准的在线更新检查、遥测或官方回连不存在
**And** 同主机认证 IPC 被明确区分为非 egress，不能借此转发外部流量。

### Story 2.7: 计算统一风险并签发不可重放授权

As a TickDeck 自托管部署者,
I want 高风险意图由服务端统一评级并绑定不可重放授权,
So that 模型、扩展、重试或多标签页不能降低风险或重复产生副作用。

**对应需求：** FR-091、FR-092；AR-AD-02–AR-AD-05、AR-AD-07–AR-AD-09、AR-AD-13、AR-AD-19、AR-AD-29；NFR-009、NFR-013、NFR-017、NFR-029、NFR-035、NFR-036。
**阶段：** S0
**依赖：** Story 2.2、Story 2.3、Story 2.5、Story 2.6。
**Blocker：** 继承 Epic 2 的真实 S0-V Go；本 Story只交付服务端合同与测试，不授权任何尚未进入阶段的 R1/R2 工具。
**架构约束：** 最终风险取工具、参数、数据类别、目的、预算和状态中的最高约束；模型与扩展只能提高风险。R2 数据库只存高熵 opaque token 摘要。
**UX 约束：** UX-DR-005、UX-DR-014–UX-DR-016、UX-DR-023、UX-DR-045、UX-DR-052；Risk Gate 最早 S2，本 Story不得挂载其 UI。

**Acceptance Criteria:**

#### AC 1：确定性计算最终风险

**Given** 一个 canonical action 及其完整上下文
**When** RiskPolicy 计算等级
**Then** 依据 tool/action、参数、数据类别、recipient、成本、状态和当前策略输出 R0–R3
**And** 未知或冲突输入 fail closed
**And** 模型、extension 或调用方声明不能降低服务端等级。

#### AC 2：约束 R1 范围授权

**Given** 一个未来 R1 action 进入合同测试
**When** 服务端创建 scope grant
**Then** 绑定 subject/workspace、tool/action、object/scope、参数/状态约束、策略摘要和有效期
**And** 每次使用重新校验当前状态、预算和 revocation
**And** R1 永远不能覆盖删除、外部通知、新接收方、高成本运行、启用策略或模拟订单等 R2 类别。

#### AC 3：签发单次 R2 Grant

**Given** 一个未来 R2 action 的绑定上下文完整
**When** 服务端签发 Grant
**Then** 绑定 session subject、workspace、run/object、tool/version、参数 digest、snapshot/manifest、状态版本、policy judgment、影响、nonce、expiry 和 `max_uses=1`
**And** 数据库只存 token 摘要
**And** Grant 不进入 URL、日志、artifact 或通知。

#### AC 4：原子消费并阻止重放

**Given** R2 Grant 已使用、过期或任一绑定状态变化
**When** 再次尝试消费
**Then** 在单一写事务中返回 consumed、expired、state-changed 或 conflict
**And** 只有首次完全匹配的消费可创建 operation、audit 与 outbox
**And** 执行失败不恢复已消费 Grant，不明效果不得盲重试。

#### AC 5：验证能力上限与攻击边界

**Given** 重放、参数替换、状态漂移、并发标签页、风险降级和未注册工具 fixtures
**When** policy 与授权套件运行
**Then** 绕过成功率为 0，审计事件保持分离且可查询
**And** S0 Capability Manifest 中不存在实际 R1/R2 业务 handler 或 Risk Gate route
**And** 测试合同存在不等于后续能力已经授权。

### Story 2.8: 提供确定性的 demo/non-current 路径

As a TickDeck 部署者或贡献者,
I want 在没有真实数据或外部模型时使用明确标记的确定性演示路径,
So that 核心合同可以复现测试而不冒充真实数据与生产资格。

**对应需求：** FR-005；AR-AD-02、AR-AD-07、AR-AD-09、AR-AD-13、AR-AD-20、AR-AD-24、AR-AD-28、AR-AD-31；NFR-007、NFR-012、NFR-013、NFR-025、NFR-029、NFR-031。
**阶段：** S0
**依赖：** Story 2.5、Story 2.7。
**Blocker：** 无新增开放问题；但 demo 永远不能关闭 OQ-03、SM-10、真实模型资格或任何真实数据 Gate。
**架构约束：** `packages/testkit` 生成固定版本/种子合成数据，`packages/connectors-official` 只提供审计过的 demo adapter，`packages/models` 提供本地 compatibility-test model。
**UX 约束：** UX-DR-003、UX-DR-008、UX-DR-009、UX-DR-017、UX-DR-023、UX-DR-037–UX-DR-045、UX-DR-050–UX-DR-052；所有表面常驻 `demo/non-current` 与限制。

**Acceptance Criteria:**

#### AC 1：生成固定且不含第三方行情的 fixture

**Given** 指定 generator version、fixture version 和 seed
**When** testkit 生成演示数据
**Then** 相同输入产生 byte-identical 数据与 digest
**And** 数据全部为合成内容，不打包第三方真实历史行情
**And** manifest 记录 version、seed、provenance、as-of 和限制。

#### AC 2：覆盖承重市场语义与数据状态

**Given** demo fixture bundle 已生成
**When** 运行领域与 UI 合同测试
**Then** 覆盖 A/港股日线/分钟线、停牌、涨跌停、T+1、港股手数、多币种和公司行动
**And** 同时覆盖 missing、stale、partial、unknown 与 revision
**And** 所有金融值遵守 AD-31，不通过 binary float 建立权威结果。

#### AC 3：提供受限 demo connector 与测试模型

**Given** 未配置真实服务
**When** 构建 S0 测试环境
**Then** 只注册 `demo/non-current` connector 与 compatibility-test model
**And** manifest、Trust Strip 和 Run Manifest 始终显示 demo 身份
**And** 不静默切换到真实、免费或商用来源。

#### AC 4：区分界面验收与真实资格

**Given** demo 路径通过核心契约与界面测试
**When** Gate Registry 计算数据或模型资格
**Then** demo 不计入 SM-10、参考能力画像、生产 connector maturity 或完整 Agent qualification
**And** 目标 v1 mock、编译成功或测试全绿不能提升资格
**And** S1+ route 和工具仍按 Gate 保持未注册。

#### AC 5：验证复现与误标防护

**Given** seed 漂移、版本漂移、真实标记冒充、第三方 payload 和静默 fallback fixtures
**When** build、server、Worker 与 Web 使用同一 bundle
**Then** digest 或标记不一致时构建/运行失败
**And** demo 身份在主题、语言、深链和导出元数据中均不丢失
**And** 任何 fixture 都不能形成真实发布资格证据。

### Story 2.9: 锁定 TypeScript→Component 工具链与资源档案

As a TickDeck 架构与安全维护者,
I want 把受限 TypeScript 的精确编译链、WIT/WASI 和资源档案冻结为可验证 manifest,
So that 沙箱能力不会因浮动工具、隐式 import 或平台差异产生不可复现的安全边界。

**对应需求：** FR-095 的工具链前置、OQ-06 实施证据余项；AR-AD-02、AR-AD-12、AR-AD-18、AR-AD-20、AR-AD-23、AR-AD-31；NFR-007、NFR-013、NFR-016、NFR-018、NFR-029、NFR-037、NFR-039。
**阶段：** S0
**依赖：** Story 2.7。
**Blocker：** 精确 TypeScript compiler、componentizer、source-map、WIT/WASI 组合尚未由上游决定；不得自行选型。缺少批准的 `SandboxToolchainProfile` 时能力保持未注册。Story 1.1 的 TypeScript 6.0.3 typecheck、Vite build 或 compiler API 兼容探针均不能替代该决定或五平台 FR-095/NFR-037 证据。
**架构约束：** 用户 TypeScript 只能编译为 WebAssembly Component；构建后只允许版本化 TickDeck WIT import，禁止 Node、任意 npm、WASI 网络/文件/环境或系统能力。
**UX 约束：** UX-DR-005、UX-DR-023、UX-DR-024、UX-DR-035、UX-DR-045、UX-DR-052；S0 只显示工具链资格/blocker，不挂载 Monaco 或策略实验室。

**Acceptance Criteria:**

#### AC 1：要求完整且经批准的工具链档案

**Given** 维护者提交 SandboxToolchainProfile
**When** 控制面校验
**Then** profile 固定 compiler、componentizer、source-map、WIT/WASI、Wasmtime compatibility、artifact hashes、source 和许可
**And** 任一版本、hash、import schema 或来源缺失时拒绝
**And** interface 预留、编译成功或未经批准的候选不能关闭 OQ-06。

#### AC 2：确定性生成 Component 工件

**Given** 相同 source、compiler profile、constant manifest 和 WIT
**When** 编译两次
**Then** 输出 component、diagnostic、source map 和 manifest digest 一致
**And** 输入或工具链任一承重字段变化产生新 digest
**And** 不读取运行期网络、用户全局 npm cache 或系统浮动工具。

#### AC 3：拒绝未授权 import 与动态金融常量

**Given** component 已生成
**When** import/ABI 审计运行
**Then** 只允许获批 TickDeck WIT capability
**And** Node、filesystem、network、environment、process、system 或未知 import 全部拒绝
**And** 金融常量只能来自编译期 ASCII string literal 与带 digest constant manifest，动态 string/number 不能获得金融 handle。

#### AC 4：冻结五平台资源档案

**Given** 支持矩阵为 Linux x64/ARM64、Windows x64、macOS Intel/Apple Silicon
**When** 为每个 Release Profile 定义 sandbox resources
**Then** 固定 source/component/input、linear memory、table/instance、compile artifact、host-call、process memory、wall clock、fuel、epoch 和 output 硬上限
**And** Linux/macOS 记录 RSS sampling interval 与实测 overshoot，Windows 固定 Job Object 限制
**And** 无法证明有界资源行为的 profile 不得声明支持。

#### AC 5：保留 blocker 并验证漂移

**Given** 浮动版本、额外 import、非确定输出、source-map 漂移、资源维度缺失和未批准 profile fixtures
**When** 工具链资格套件运行
**Then** 全部非法 case 保持 capability `locked`
**And** build/Release Manifest 记录 exact profile 与 digests
**And** fixture 不能替代上游对精确组合的批准或五平台真实执行证据。

### Story 2.10: 在一次性 Wasmtime 子进程中通过沙箱合规套件

As a TickDeck 自托管部署者,
I want 不可信策略只在可强制终止的一次性 Wasmtime 进程中运行,
So that 逃逸、资源耗尽或任务取消不会危及 server、Worker 与工作区。

**对应需求：** FR-095；AR-AD-01、AR-AD-02、AR-AD-04、AR-AD-12、AR-AD-20、AR-AD-27、AR-AD-31；NFR-007、NFR-013、NFR-016、NFR-018、NFR-029、NFR-037、NFR-039；SM-07 前置证据。
**阶段：** S0
**依赖：** Story 2.9。
**Blocker：** Story 2.9 的 OQ-06 工具链选择与五平台真实 runner 证据未完成前，沙箱能力不得注册或宣称可用。
**架构约束：** `sandbox-host` 是唯一加载 Wasmtime 和 guest 的 Rust binary；product-supervisor、Tauri、server 与 Worker 不得执行 guest 或取得其权限。
**UX 约束：** UX-DR-005、UX-DR-023、UX-DR-024、UX-DR-027、UX-DR-035、UX-DR-045、UX-DR-052；只在健康表面显示资格、资源档案与失败证据。

**Acceptance Criteria:**

#### AC 1：每次运行使用一次性隔离进程

**Given** 已资格化的 component 和 RunContext
**When** Worker 请求 sandbox 执行
**Then** 为本次 compile/run 启动独立 sandbox-host supervisor/runner
**And** guest 无 Node、filesystem、network、environment、process、DB、Secret 或 Artifact path
**And** 只能通过绑定 invocation/context 的 WIT opaque capabilities 交互。

#### AC 2：强制执行全部资源上限

**Given** profile 定义 wall clock、memory、table、instance、fuel、epoch、host-call、I/O 与 output 上限
**When** guest 接近或超过任一维度
**Then** host 返回稳定 `RESOURCE_LIMIT_*` 分类并停止接受输出
**And** 不能通过高成本 profile 关闭任何硬上限
**And** server/worker 保持存活且不持有残留 guest resource。

#### AC 3：终止并回收整个进程树

**Given** guest 超时、超内存、无限循环或忽略取消
**When** watchdog 触发
**Then** Linux/macOS 终止独立 process group/session 并 wait/reap
**And** Windows 终止带 `KILL_ON_JOB_CLOSE` 的 Job Object 并等待完成
**And** grace period 后不存在残留子进程、句柄或可继续写回的 lease。

#### AC 4：运行固定五平台合规套件

**Given** 同一 suite/version、fixture bundle 和 profile manifest
**When** 在五个实际平台 profile 运行
**Then** 覆盖逃逸、宿主对象、依赖投毒、网络/文件、无限循环、内存、输出、解析/实例化放大和 host allocation
**And** 已知逃逸或宿主影响成功数为 0，超限强制终止率为 100%
**And** 保存实际环境、suite/version、结果、overshoot 与 artifact digest。

#### AC 5：失败时不提供较弱回退

**Given** 任一 profile、终止或 conformance 证据失败/过期/漂移
**When** Gate Registry 构建能力目录
**Then** 该 profile 的 sandbox capability 不注册
**And** 不回退到 Node VM、语言超时、容器假设或更弱隔离
**And** UI 只显示 blocker 与证据，不显示可运行 teaser。

### Story 2.11: 交付同一内核的桌面、本地与远端 B/S 入口

As a TickDeck 自托管部署者,
I want 从桌面、本地浏览器或远端代理进入同一个受保护工作区内核,
So that 入口差异不会改变数据、会话、能力或授权语义。

**对应需求：** FR-071、FR-090；AR-AD-01、AR-AD-02、AR-AD-06、AR-AD-13、AR-AD-18、AR-AD-20、AR-AD-30；NFR-001、NFR-002、NFR-013、NFR-022、NFR-033、NFR-040。
**阶段：** S0
**依赖：** Story 2.2–Story 2.7、Story 2.10。
**Blocker：** 五个平台最低 OS/libc/system WebView 版本尚未由真实 release spike 固定；未完成实际安装、启动与边界证据的 profile 不得宣称支持。
**架构约束：** 一个 product payload、一个 Fastify/Worker 内核和一个 React SPA；Tauri 2 只负责窗口、启动、bootstrap 与发行生命周期，不建立第二 API、状态或授权路径。
**UX 约束：** UX-DR-004–UX-DR-007、UX-DR-036–UX-DR-045、UX-DR-048、UX-DR-052；三入口呈现相同当前阶段表面与会话失效行为。

**Acceptance Criteria:**

#### AC 1：构建单一 product payload

**Given** 一个 S0 build 和 Release Profile
**When** 构建本地 B/S、远端 B/S 与桌面测试发行面
**Then** 三入口引用同一 payload、web/server/worker slice、Capability/Gate catalog 和 schema digest
**And** 任一 slice 多出、缺失或 digest 不同使构建失败
**And** 本 Story不声称已完成 FR-070 的 v1.0 正式发行物。

#### AC 2：实现本地与远端 B/S 模式

**Given** product-supervisor 以 serve 模式启动
**When** 选择 local 或 remote profile
**Then** local 只绑定随机精确 loopback origin并使用 Story 2.3 配对
**And** remote 要求显式 data root、HTTPS/trusted proxy 配置与上游旁路阻断
**And** Host、Origin、CSRF、forwarded headers 和 WebSocket 均使用同一服务端合同。

#### AC 3：保持 Tauri 薄壳

**Given** 桌面入口启动
**When** product-supervisor 健康且 bootstrap 完成
**Then** 单一 WebView 导航到精确随机 loopback origin并运行同一 SPA
**And** Web 内容无 shell/filesystem/updater/domain IPC，其他导航拒绝或交给系统浏览器
**And** 关闭窗口只分离客户端，不取消 durable run。

#### AC 4：安全接管已有本地实例

**Given** 同一工作区已有 supervisor 持锁
**When** 新 B/S launcher 或桌面壳尝试 attach
**Then** owner-only IPC 校验 peer UID/SID、protocol/release digest、workspace UUID、boot nonce 与健康
**And** 完全匹配时只签发新的单次 bootstrap
**And** principal、release 或健康不匹配时稳定拒绝且不启动第二写入者。

#### AC 5：通过入口等价与网络对抗测试

**Given** 同一只读 seed 克隆、exact payload 和 fixture bundle
**When** 三入口分别运行核心 S0 旅程
**Then** API/read model、command/event/audit、Capability/Gate 和关键 UI 结果等价
**And** 错误 Host/Origin、跨站 WS、DNS rebinding、伪造代理和桌面 IPC 绕过成功数为 0
**And** 未固定平台基线或缺失真实系统证据的 profile 保持未支持。

### Story 2.12: 提供分层健康与脱敏诊断

As a TickDeck 自托管部署者,
I want 区分产品、依赖服务、资格和运行健康并安全导出诊断,
So that 我可以定位 blocker 而不泄露秘密或把握手成功误认为能力合格。

**对应需求：** FR-076；AR-AD-02、AR-AD-09、AR-AD-13、AR-AD-19、AR-AD-25、AR-AD-30；NFR-013–NFR-015、NFR-017、NFR-020、NFR-029。
**阶段：** S0
**依赖：** Story 2.2–Story 2.11。
**Blocker：** 继承 Vault、OQ-06 与平台基线 blocker；诊断只能报告，不能关闭或覆盖它们。
**架构约束：** 控制面拥有版本化 Health Snapshot 与 Diagnostic Manifest；运行日志非权威，qualification/Gate 与 runtime health 必须分栏。
**UX 约束：** UX-DR-005、UX-DR-023、UX-DR-026、UX-DR-037–UX-DR-045、UX-DR-052；S0 使用“运行与健康”表面，Diagnostic Panel route 仍保持到 S1。

**Acceptance Criteria:**

#### AC 1：分层报告健康与资格

**Given** 工作区各组件处于任意状态
**When** 生成 Health Snapshot
**Then** 分别报告 TickDeck、connector、model、sandbox、queue、notification、storage 与 Vault 的 `healthy|degraded|down|unknown`
**And** qualification/Gate 与 runtime health 分栏
**And** 未注册组件显示阶段/blocker，不显示为已安装但可用。

#### AC 2：提供稳定的健康来源与刷新

**Given** 健康事件发生或 SSE 重连
**When** Web 更新“运行与健康”
**Then** HTTP snapshot 始终是权威，事件只通知刷新
**And** 显示最近成功时间、证据版本、影响和合法下一步
**And** 断线保留最后验证时间，不冒充当前状态。

#### AC 3：导出前预览 Diagnostic Manifest

**Given** 操作者请求诊断包
**When** 系统准备导出
**Then** 先列出每个文件/字段、来源、敏感级别和 redaction 结果
**And** 默认只含脱敏结构化日志、版本、health、config schema 摘要与审计验证结果
**And** 本地下载与任何未来外发是两个独立 action。

#### AC 4：统一执行脱敏与审计

**Given** manifest 包含 SecretRef、session/grant、DataUse 或受限 payload 引用
**When** 控制面生成包
**Then** 原始秘密、token、完整提示、受限数据和 participant identity 全部排除或脱敏
**And** 导出 operation 与结果追加审计
**And** 各模块不能绕过控制面自行打包日志。

#### AC 5：通过泄漏与误报测试

**Given** 长 ID、secret-like payload、未知资格、握手成功但 Gate locked、日志注入和过期健康 fixtures
**When** Health/Diagnostic 套件运行
**Then** 秘密泄漏数为 0，资格和健康不会互相提升
**And** 双语、主题、键盘和 200% 缩放下 blocker 不被截断
**And** 诊断成功不改变 Gate 或 capability 状态。

### Story 2.13: 生成 S0 Gate 资格决定

As a TickDeck 产品维护者,
I want 依据契约、安全、恢复、沙箱和三入口等价证据决定 S0 是否通过,
So that 不安全或不可复现的共同运行时不能成为后续产品能力底座。

**对应需求：** Epic 2 全部 FR、CAP-9、CAP-11、S0 阶段门；AR-AD-01–AR-AD-31、AR-CON-01、AR-GATE-01；全部适用 NFR，重点 NFR-007–NFR-020、NFR-022、NFR-026–NFR-040。
**阶段：** S0
**依赖：** Story 2.1–Story 2.12。
**Blocker：** VaultProfile、OQ-06 精确工具链/五平台沙箱证据和五平台最低 OS/libc/WebView 基线任一未关闭时只能返回 `blocked/not-evaluable`；不得降级或删减矩阵。
**架构约束：** Gate Registry 只读取冻结规范、Capability/Release Manifest 和不可变证据；UI、模型、编译成功或单平台测试不能决定 Gate。
**UX 约束：** UX-DR-005、UX-DR-017、UX-DR-023、UX-DR-026、UX-DR-030、UX-DR-037–UX-DR-045、UX-DR-052；只在“运行与健康”展示 Go/Stop/blocked 与证据。

**Acceptance Criteria:**

#### AC 1：验证 S0 证据完整性

**Given** S0 evidence bundle 已提交
**When** Gate evaluator 开始
**Then** 校验工作区、持久化、事务/outbox、会话、Vault、DataUse/Egress/Risk、demo、sandbox、三入口和诊断的 exact digests
**And** 校验真实故障、安全、恢复、入口等价和五平台 evidence
**And** 缺失、过期、漂移或模拟替代真实证据时保持 blocked。

#### AC 2：只在全部共同运行时条件通过时 Go

**Given** evidence bundle 完整
**When** 计算 S0 Gate
**Then** 契约、权限、受保护会话、数据/出站策略、秘密、审计、恢复、沙箱和三入口等价必须全部通过
**And** 任一承重条件失败则 Stop，无法判断则 blocked
**And** 指标之间不能补偿，也没有人工改绿入口。

#### AC 3：生成不可变 Gate 决策

**Given** 结果为 Go、Stop 或 blocked
**When** 保存 `S0GateDecision`
**Then** 绑定规范、evidence、Capability/Release Manifest、逐项判定、原因和 source digests
**And** 决策与 Gate 状态、审计在同一权威事务提交
**And** 新证据产生新版本，旧决定不可覆盖。

#### AC 4：不提前授权 S1+

**Given** S0 Gate 为 Go
**When** 生成下一构建能力目录
**Then** Go 只满足 S1 的阶段前置，不注册任何 S1–S5 API、工具或 UI
**And** OQ-03 继续阻塞 S1 双市场真实数据路径
**And** demo、sandbox 和桌面壳不能被解释为图表、完整 Agent、提醒或组合可用。

#### AC 5：通过 Gate 绕过与边界测试

**Given** 单项失败、缺证据、digest 漂移、旧 decision replay、客户端篡改、模型输出和直接数据库写入 fixtures
**When** Gate/Capability 构建套件运行
**Then** 只有 exact 完整通过 bundle 可产生 Go
**And** Stop/blocked 时后续 route 不存在且健康页给出证据化原因
**And** fixture 不能在真实工作区形成 S0 Go。

## Epic 3: 在合格 A/港股数据上完成图表—筛选—证据研究

研究用户可以在分别通过资格验证的真实 A 股与港股数据路径上搜索标的、查看和保存图表、自选与筛选，并从逐项证据进入公司资料、财务、公司行动、公告和新闻；任何缺失、陈旧或许可限制均显式可见。

### Story 3.1: 资格化真实 A 股与港股连接器路径

As a TickDeck 部署者,
I want 配置并独立验证一条合法 A 股路径和一条合法港股路径,
So that S1 研究能力只使用已证明的真实数据能力与许可。

**对应需求：** FR-001、FR-002、FR-003、FR-084、FR-085；CAP-1、CAP-11；NFR-008、NFR-013、NFR-028、NFR-031。
**阶段：** S1
**依赖：** Story 2.13 的有效 S0 Go。
**Blocker：** OQ-03 尚未关闭；必须分别选定并验证合法免费 A 股和港股路径、许可用途、限频和真实能力。任一路径不合格时应收窄市场或保持 beta，不得假设供应商、静默改用商用源或用 demo 取得资格。
**架构约束：** AR-AD-02、AR-AD-07–AR-AD-10、AR-AD-13、AR-AD-27、AR-AD-28、AR-AD-31、AR-BLK-05、AR-BLK-08、AR-GATE-01；全部 SDK 只能在获批 trusted sidecar 中由 Connector Broker 调用。
**UX 约束：** UX-DR-005、UX-DR-008–UX-DR-009、UX-DR-022–UX-DR-024、UX-DR-026、UX-DR-037–UX-DR-045、UX-DR-052；S1 才挂载“连接与模型”中的真实数据连接器表面。

**Acceptance Criteria:**

#### AC 1：管理连接器但不暴露秘密

**Given** 部署者打开连接器配置
**When** 创建、测试、启用、停用或诊断 A/港股连接器
**Then** 输入按版本化 schema 校验，凭据只保存为 SecretRef 且浏览器只见“已设置”状态
**And** 配置、状态变化和测试结果通过控制面唯一写路径与审计提交
**And** 未登记的 SDK、目的端或秘密不能被 Worker 或 Agent 直接访问。

#### AC 2：发布机器可读能力与成熟度

**Given** 连接器完成一次真实端到端测试
**When** Connector Broker 生成 capability profile
**Then** profile 声明市场、标的、时效、周期、历史起点、深度、基本面、资讯、配额、健康与许可用途
**And** 成熟度只能是 skeleton、trial-validated、production-authorized 或 redistribution-allowed 的合同值
**And** 未联调、证据过期或配置漂移的连接器不得显示为可用。

#### AC 3：独立验证两条参考路径

**Given** 已选定 A 股和港股候选路径
**When** 运行 §6.4 参考能力画像契约套件
**Then** 字段、许可、限频、断线、重连、复权及历史/实时一致性测试分别达到 100%
**And** 每条证据绑定 connector version/hash、配置摘要、测试环境、授权用途和到期时间
**And** 一条市场通过不能替代另一条市场通过。

#### AC 4：默认拒绝不合格与过期路径

**Given** 许可未知、用途冲突、证据过期、健康失败或能力不支持
**When** 研究请求解析数据路径
**Then** DataUsePolicy 和 Connector Broker 拒绝或显式降级并返回稳定原因
**And** 不静默换源、补值、降低成熟度门槛或使用商业端点
**And** demo 始终标记 `demo/non-current` 且不计入生产资格。

#### AC 5：形成 S1 数据资格证据

**Given** 两条真实路径均通过
**When** 保存 qualification evidence
**Then** Gate Registry 可验证每条路径的 exact manifest、测试摘要、许可范围和到期时间
**And** 任一必要证据缺失时 FR-085 发布检查保持 blocked
**And** 本 Story 只授权 S1 数据路径，不授权 S2 Agent、S3 沙箱或后续能力。

### Story 3.2: 统一市场语义、数据溯源与显式降级

As a TickDeck 研究用户,
I want 所有研究数据使用同一 A/港股身份、时间、币种、复权和质量语义,
So that 图表、筛选和证据不会因隐式换源或浮点差异得出矛盾结果。

**对应需求：** FR-004、FR-006、FR-007；CAP-1、CAP-2、CAP-3；NFR-007、NFR-008、NFR-012、NFR-029、NFR-031、NFR-032。
**阶段：** S1
**依赖：** Story 3.1。
**Blocker：** Story 3.1 的两条真实路径和 OQ-03 未通过时只能用明确标记的 demo fixture 验证合同，不能把 S1 研究表面注册到真实工作区。
**架构约束：** AR-AD-03、AR-AD-07、AR-AD-09、AR-AD-10、AR-AD-13、AR-AD-23、AR-AD-28、AR-AD-31、AR-CON-01；裸 symbol、mutable latest、binary float 与格式化文本均不得成为权威输入。
**UX 约束：** UX-DR-003、UX-DR-008–UX-DR-010、UX-DR-017、UX-DR-020、UX-DR-023、UX-DR-027、UX-DR-030、UX-DR-045。

**Acceptance Criteria:**

#### AC 1：规范化市场身份与快照

**Given** Connector Broker 接收 A 股或港股响应
**When** 数据进入核心领域
**Then** 使用唯一 InstrumentId、ListingId、MarketCalendarRef、MarketDataSnapshotRef、CurrencyAmount 和 CorporateActionBasis
**And** snapshot 绑定来源、data/fetched-at、时区、币种、复权、完整性、新鲜度、连接器版本与许可
**And** 同一快照 digest 被图表、筛选、审计和工件引用。

#### AC 2：确定性处理 A/港股语义

**Given** 数据包含交易日、停牌、涨跌停、T+1、最小单位、费用或公司行动
**When** 生成标准化序列和派生字段
**Then** 依据版本化市场日历与规则执行，并用 AD-31 decimal 合同计算
**And** 原始值、派生值、量化规则与 DecimalEvidence 可追踪
**And** 未知规则必须警告或阻止，不能套用另一市场默认值。

#### AC 3：组合数据性质与可用状态

**Given** 任一数据驱动表面读取快照
**When** 生成 Trust Strip/read model
**Then** 独立显示 `real|delayed|demo|partial` 与 `fresh|stale|missing|unsupported|unknown`
**And** 用文字、图标和影响短语说明当前动作可继续、降级或拒绝
**And** 真实来源不被暗示为实时、完整或许可已确认。

#### AC 4：禁止静默补值或换源

**Given** 数据缺失、陈旧、超额、断连或不支持
**When** 图表、筛选或研究查询执行
**Then** 返回零结果、部分结果或稳定拒绝，并保留最近已验证内容及时间
**And** 不由模型、浏览器插值或备用源填补权威值
**And** 任何显式重试或换源都产生新快照与审计。

#### AC 5：通过跨模块数值与降级 corpus

**Given** A/港股边界日、公司行动、修订、未知许可、陈旧和断线 fixtures
**When** core、connector、筛选和 UI adapter 运行同一 corpus
**Then** 身份、数值、状态、digest 与用户影响在各模块一致
**And** 结果不依赖浏览器 locale、binary float 或模型输出
**And** 属性测试证明未知/冲突/过期策略默认拒绝。

### Story 3.3: 搜索标的并检查基础行情图形

As a TickDeck 研究用户,
I want 搜索合格标的并查看可核查的 K 线、价格和单点数据,
So that 我能在真实市场上下文中开始研究。

**对应需求：** FR-008、FR-009、FR-012；CAP-2；NFR-002–NFR-004、NFR-012、NFR-021–NFR-024。
**阶段：** S1
**依赖：** Story 3.2。
**Blocker：** 仅可查询 Story 3.1 已资格化且当前健康的能力；能力缺失或许可限制不得由 demo、模型或隐藏备用源补齐。
**架构约束：** AR-AD-13、AR-AD-15–AR-AD-17、AR-AD-20、AR-AD-28、AR-AD-31；图表仅经 Lightweight Charts 5.2.1 TickDeck adapter，HTTP snapshot 是权威。
**UX 约束：** UX-DR-001–UX-DR-012、UX-DR-020–UX-DR-023、UX-DR-026–UX-DR-027、UX-DR-031、UX-DR-037–UX-DR-045、UX-DR-052。

**Acceptance Criteria:**

#### AC 1：按能力搜索与切换标的

**Given** 用户输入代码、名称或市场
**When** 搜索合格 A/港股股票或指数
**Then** 结果显示规范身份、市场、当前连接器支持和数据状态
**And** 重名、跨市场代码和不支持对象不可混淆
**And** 选择结果以 ListingId 打开，不把裸 symbol 写入 URL 作为权威。

#### AC 2：按能力显示行情图形

**Given** 标的与周期受当前 capability profile 支持
**When** 打开 Chart Canvas
**Then** 显示 K 线或合同允许的常用价格图形、成交信息和常驻 Trust Strip
**And** 可用周期、盘中深度与历史起点严格服从连接器能力
**And** 未完成或已修订 K 线以非颜色方式明确标记。

#### AC 3：检查单点权威数据

**Given** 用户移动十字光标或使用键盘选择数据点
**When** Data Window 同步更新
**Then** 展示市场时间、OHLC、成交、可用指标、数据状态与未完成状态
**And** 数值通过 FinanceFormatter 投影但保留可追踪 DecimalEvidence
**And** Canvas 外同步提供可访问数据表与逐点播报。

#### AC 4：满足核心性能与交互基线

**Given** 缓存标的与 10,000 根 K 线的固定性能环境
**When** 切换标的、首次呈现、缩放和平移
**Then** 工作台 p95、切换 p95 和不低于 45 FPS 分别满足 NFR-002–NFR-004
**And** 若 alpha 调整基线，保留原环境、结果和理由
**And** 性能降级不隐藏数据或取消可访问等价路径。

#### AC 5：通过主题、语言、尺寸和键盘矩阵

**Given** UX-DR-044 的主题、语言、视口和缩放 fixtures
**When** 完成搜索、打开、检查与返回旅程
**Then** Trust、行情方向、焦点、错误和长标识不截断且不只靠颜色
**And** 1280×720 及三档布局遵守中央画布最小宽度和 focus mode
**And** 所有图表操作有键盘与非 Canvas 等价入口。

### Story 3.4: 组合窗格、指标、比较与基准

As a TickDeck 研究用户,
I want 在统一口径下叠加指标并比较股票或指数,
So that 我能看到关系而不混淆时间、币种和数据状态。

**对应需求：** FR-010、FR-011；CAP-2；NFR-003、NFR-004、NFR-007、NFR-012、NFR-021。
**阶段：** S1
**依赖：** Story 3.3。
**Blocker：** S1 只允许内置且已注册的确定性指标；沙箱指标属于 S3，必须保持不注册且不显示 teaser。
**架构约束：** AR-AD-02、AR-AD-13、AR-AD-16、AR-AD-17、AR-AD-28、AR-AD-31、AR-GATE-01；比较计算使用同一版本化时间对齐与币种说明。
**UX 约束：** UX-DR-003、UX-DR-006–UX-DR-012、UX-DR-020、UX-DR-031、UX-DR-041、UX-DR-045、UX-DR-052。

**Acceptance Criteria:**

#### AC 1：管理主图和独立窗格

**Given** 用户已打开一个支持的行情图形
**When** 添加、排序、隐藏或移除成交量与 S1 内置指标
**Then** 每个序列绑定精确版本、参数、snapshot 和单位
**And** 主图与独立窗格共享可验证时间轴但不共享错误单位
**And** 变化仅修改布局草稿，不改变源数据或冻结的 Agent 上下文。

#### AC 2：比较多个标的与基准

**Given** 用户选择股票、指数或基准进行比较
**When** 系统对齐序列
**Then** 明示共同时间范围、交易日差异、币种与归一化口径
**And** 缺口、停牌、不同新鲜度和不支持周期分别可见
**And** 不用插值或最新值填补权威空缺。

#### AC 3：保持非颜色可辨识

**Given** 多条价格与指标序列同时存在
**When** 用户通过图表或图例检查
**Then** 使用线型、marker、正负号和文字图例共同区分
**And** 键盘可进入每个序列并播报名称、范围和当前点
**And** 同步表格提供相同时间点的可访问值。

#### AC 4：显式处理能力变化

**Given** 某个比较对象、周期或指标在当前连接器不可用或变陈旧
**When** 刷新权威快照
**Then** 只降级受影响序列并说明对比较的影响
**And** 旧内容保留最近验证时间，不冒充当前值
**And** 不静默切换连接器或删除失败对象。

#### AC 5：通过确定性与性能测试

**Given** 固定多市场、多币种和缺口 corpus
**When** 重复构建相同 pane/overlay/compare 定义
**Then** 序列、对齐、派生数值、图例和 digest 数值等价
**And** 10,000 根 K 线的常规交互仍满足 NFR-004
**And** 浏览器绘制坐标不成为研究结果真值。

### Story 3.5: 创建绘图并版本化研究布局

As a TickDeck 研究用户,
I want 绘制技术标记并保存、复制、恢复研究布局,
So that 可重复打开同一研究上下文而不丢失对象状态。

**对应需求：** FR-013、FR-014、FR-073 的布局持久化；CAP-2；NFR-008–NFR-010、NFR-021、NFR-026。
**阶段：** S1
**依赖：** Story 3.3。
**Blocker：** 无新增开放问题；仍受 Story 3.1 的合格数据路径及 S1 registration ceiling 约束。
**架构约束：** AR-AD-03、AR-AD-04、AR-AD-10、AR-AD-13、AR-AD-15–AR-AD-17、AR-AD-28；Canvas 坐标只能通过 adapter 转换为版本化领域绘图定义。
**UX 约束：** UX-DR-006–UX-DR-011、UX-DR-021、UX-DR-027、UX-DR-030–UX-DR-032、UX-DR-039–UX-DR-045。

**Acceptance Criteria:**

#### AC 1：编辑核心绘图对象

**Given** 图表处于可编辑布局草稿
**When** 创建、选择、移动、隐藏或删除趋势、水平、区间和测量绘图
**Then** 每个对象使用稳定 ID、类型化参数、时间/价格锚点和版本
**And** 键盘、菜单和指针均可完成核心操作
**And** 删除或覆盖不由全局快捷键直接确认。

#### AC 2：保存与复制布局版本

**Given** 用户保存当前图表、窗格、比较和绘图状态
**When** 控制面提交布局命令
**Then** 以幂等 operation 和 expected version 持久保存不可混淆的新版本
**And** 记录对象、snapshot 引用、视口及兼容范围，不保存 Canvas 像素为真值
**And** 保存失败不留下半布局或覆盖旧版本。

#### AC 3：恢复完整研究上下文

**Given** 已保存布局存在且依赖仍兼容
**When** 用户打开、复制或从关联研究产物深链进入
**Then** 恢复标的、范围、缩放、窗格、序列、绘图、面板宽度、展开项和滚动位置
**And** 数据快照变化时明确显示新旧差异及不可完全复现条件
**And** Review Canvas 关闭后精确返回进入前状态。

#### AC 4：安全删除和冲突处理

**Given** 布局被其他标签页更新或被产物引用
**When** 用户尝试覆盖或删除
**Then** expected version 冲突时拒绝并展示差异
**And** 删除说明引用影响和可恢复性并保留审计
**And** 本阶段不引入 S2 Agent R2；需 R2 的 Agent 覆盖能力保持未注册。

#### AC 5：通过重启与兼容测试

**Given** 正常重启、保存中断、旧版本、缺失指标和断线 fixtures
**When** 重开布局
**Then** 可兼容部分确定恢复，不兼容部分显式标记且旧版本不损坏
**And** 双语、主题、键盘和 200% 缩放下均可操作
**And** 浏览器本地状态不能覆盖服务端布局真值。

### Story 3.6: 管理多份自选列表

As a TickDeck 研究用户,
I want 创建、排序和配置多份自选列表,
So that 可以快速切换研究对象并看清每列的数据边界。

**对应需求：** FR-015、FR-073 的自选持久化；CAP-3；NFR-008–NFR-010、NFR-021、NFR-026。
**阶段：** S1
**依赖：** Story 3.2。
**Blocker：** 无新增开放问题；列表字段只能来自当前已资格化连接器能力，未知字段不得由模型补写。
**架构约束：** AR-AD-03、AR-AD-04、AR-AD-10、AR-AD-13、AR-AD-28、AR-AD-31；以 ListingId 和字段版本保存，服务端提供权威排序/更新 read model。
**UX 约束：** UX-DR-006、UX-DR-011、UX-DR-020、UX-DR-023、UX-DR-026–UX-DR-027、UX-DR-031–UX-DR-032、UX-DR-037–UX-DR-045。

**Acceptance Criteria:**

#### AC 1：创建并维护多个列表

**Given** 用户位于 Context Drawer 的自选表面
**When** 创建、重命名、复制、删除或切换列表
**Then** 每份列表具有稳定 ID、版本、名称和排序规则
**And** 所有 mutation 使用幂等键和 expected version
**And** 删除说明影响并保留可审计结果。

#### AC 2：增删和排序标的

**Given** 一个可编辑自选列表
**When** 添加、移除或重排支持标的
**Then** 以 ListingId 去重并保留用户显式顺序
**And** 跨市场同代码不会互相覆盖
**And** 冲突或重复请求不会创建重复项目。

#### AC 3：配置可用研究列

**Given** 当前连接器声明行情与研究字段
**When** 用户选择列、排序或筛选
**Then** 只提供实际支持字段并显示字段级数据状态、单位和时间
**And** 数字等宽且使用确定性 FinanceFormatter
**And** 不支持、无许可或缺失值以状态呈现而非空白误导。

#### AC 4：保持可访问表格身份

**Given** 大列表启用虚拟化
**When** 用户键盘导航、排序或切换列
**Then** row identity、焦点、rowcount/index 与读屏上下文保持正确
**And** 提供非虚拟化分页模式
**And** 激活标的打开 Story 3.3 工作台且不改变冻结 Agent 上下文。

#### AC 5：通过恢复与降级测试

**Given** 重启、断线、字段撤回、连接器降级和并发编辑 fixtures
**When** 重新加载自选
**Then** 列表结构保持，受影响值显式降级并显示最后验证时间
**And** 已保存版本不因数据故障损坏
**And** 双语、主题和 200% 缩放下关键状态不截断。

### Story 3.7: 构建、保存并复跑证据化筛选器

As a TickDeck 研究用户,
I want 组合筛选条件并审查每个候选或零候选的逐项证据,
So that 筛选结论可复跑、可比较且不由模型替我拍板。

**对应需求：** FR-016、FR-017、FR-018、FR-019、FR-073 的筛选器持久化；CAP-3；NFR-005–NFR-010、NFR-012、NFR-029。
**阶段：** S1
**依赖：** Story 3.2、Story 3.6。
**Blocker：** 条件字段仅限当前两条资格化路径真实支持的能力；许可、字段或快照未知时必须拒绝、标 unknown 或返回零结果。
**架构约束：** AR-AD-03、AR-AD-04、AR-AD-07、AR-AD-10、AR-AD-13、AR-AD-28、AR-AD-31；规范化条件树与 oracle 使用确定性代码，不能由模型或客户端计算真值。
**UX 约束：** UX-DR-008–UX-DR-009、UX-DR-017、UX-DR-020、UX-DR-023、UX-DR-026–UX-DR-032、UX-DR-045–UX-DR-046。

**Acceptance Criteria:**

#### AC 1：构建规范化组合条件

**Given** 用户选择行情、技术、基本面、市场或连接器支持字段
**When** 添加条件、分组、排序和排除项
**Then** 控制面生成版本化规范条件树并校验类型、单位、市场和 capability
**And** 等价表达规范化为相同 digest
**And** 未知字段、隐式单位或无许可动作在运行前阻止。

#### AC 2：执行确定性筛选

**Given** 条件树、标的全集和 MarketDataSnapshotRef 已冻结
**When** 执行普通筛选
**Then** 由确定性筛选器计算命中、未满足和 unknown，不调用模型裁决
**And** 10,000 个标的、30 个准备字段的 p95 满足 NFR-005
**And** 运行可取消，取消不产生伪完整结果。

#### AC 3：呈现候选与零候选证据

**Given** 筛选已完成
**When** 打开结果表或 Review Canvas
**Then** 每项显示命中、未满足/未知条件、关键数值、snapshot、来源和工作台入口
**And** 零候选是成功态，解释条件与数据边界而不强迫放宽
**And** partial/error 与 ready 不能混淆。

#### AC 4：保存、复跑并比较版本

**Given** 用户保存筛选定义、数据口径与排序
**When** 在后续时点复跑
**Then** 创建新运行清单和结果版本，保留旧 snapshot 与差异
**And** 数据或字段版本不可得时说明不可完全复现
**And** 重试使用同一 operation identity，不重复写入结果。

#### AC 5：受控导出

**Given** 用户请求导出筛选结果
**When** DataUsePolicy 根据许可、类别、动作和范围裁决
**Then** 只导出允许字段并记录清单、策略决定和审计
**And** 未明确允许时默认拒绝批量再输出
**And** 导出不包含秘密、受限 payload 或模型补写内容。

#### AC 6：通过正确性与边界测试

**Given** oracle、零候选、unknown、修订、陈旧、许可拒绝和取消 corpus
**When** 重复运行相同条件树与 snapshot
**Then** 候选、排序、逐项证据和 digest 数值等价
**And** 不同浏览器或 locale 不改变结果
**And** 客户端无法篡改命中判定或导出许可。

### Story 3.8: 审阅公司、财务、行动与资讯证据

As a TickDeck 研究用户,
I want 从标的工作台审阅公司资料、财务、公司行动、公告和新闻,
So that 可以把筛选结果放回有来源、有限制的基本面与事件上下文。

**对应需求：** FR-020、FR-021、FR-022、FR-023、FR-024；CAP-3；NFR-008、NFR-012–NFR-014、NFR-021、NFR-026。
**阶段：** S1
**依赖：** Story 3.2、Story 3.3。
**Blocker：** 展示范围服从 Story 3.1 的真实能力与许可；没有全文、只有摘要或未提供字段时不得补写或假设。
**架构约束：** AR-AD-07、AR-AD-09、AR-AD-10、AR-AD-13、AR-AD-28、AR-AD-31；第三方内容作为不受信输入校验，指令性文本不能改变系统行为。
**UX 约束：** UX-DR-008–UX-DR-009、UX-DR-017、UX-DR-020、UX-DR-023、UX-DR-026–UX-DR-027、UX-DR-030、UX-DR-037–UX-DR-045。

**Acceptance Criteria:**

#### AC 1：展示基础资料与字段来源

**Given** 当前连接器提供公司、行业、上市地和证券资料
**When** 用户打开标的研究表面
**Then** 每个字段展示来源、报告/生效时间和数据状态
**And** 跨市场同主体与不同 listing 不混淆
**And** 缺失字段明确标为 missing/unsupported。

#### AC 2：区分原始财务与派生指标

**Given** 用户按报告期查看财务报表和关键指标
**When** 加载字段
**Then** 原始字段与 TickDeck 派生计算使用不同标签并显示单位、币种、期间与版本
**And** 派生值由 AD-31 确定性计算并保留 DecimalEvidence
**And** 修订或口径变化生成新版本且可见。

#### AC 3：关联公司行动与行情口径

**Given** 存在分红、送转、拆并股、停复牌或其他可用行动
**When** 用户检查事件
**Then** 显示事件来源、生效日、支持状态和 CorporateActionBasis
**And** 可深链到对应图表时间点并说明复权/比较影响
**And** 未支持行动不得被推定已处理。

#### AC 4：安全呈现公告与新闻

**Given** 连接器允许展示公告、新闻、摘要或链接
**When** 用户按标的和时间浏览
**Then** 保留原语言、来源、发布时间、许可状态和对应图表深链
**And** 无全文、延时或仅摘要分别标记
**And** 内容中的提示或指令不能触发 Agent 工具、改变权限或被模型补写为原文。

#### AC 5：显式处理许可与故障

**Given** 内容无权限、过期、撤回、断线或校验失败
**When** 生成 research read model
**Then** 保留可合法展示的最近验证元数据并隐藏受限 payload
**And** 说明影响和合法下一步，不静默换源
**And** 深链失败保留对象 ID、版本与原因。

#### AC 6：通过可访问与安全 corpus

**Given** 多语言、长标题、恶意指令文本、缺失全文、修订财务和公司行动 fixtures
**When** 在三主题和规定视口/缩放下浏览
**Then** 表格、来源、状态和深链均可键盘及读屏访问
**And** 不受信内容不能改变样式、脚本、权限或工具调用
**And** 任何结果都不构成收益承诺或替用户判断。

### Story 3.9: 生成 S1 双市场研究 Gate 决定

As a TickDeck 产品维护者,
I want 用真实 A/港股端到端证据决定 S1 Go、Stop 或 blocked,
So that 未通过资格的数据或占位研究表面不能进入后续阶段。

**对应需求：** FR-001–FR-024、FR-084、FR-085 的 S1 Gate 汇总；CAP-1–CAP-3、CAP-11；SM-10、SM-11 及 S1 阶段门；NFR-002–NFR-005、NFR-021、NFR-031–NFR-032。
**阶段：** S1 Gate
**依赖：** Story 3.1–Story 3.8。
**Blocker：** OQ-03 必须以两条分别合格的真实路径关闭；任一市场缺失、许可/证据过期、Parity 关键旅程不通过或使用 demo/占位替代时不得 Go。
**架构约束：** AR-AD-02、AR-AD-07、AR-AD-18–AR-AD-20、AR-AD-28、AR-AD-31、AR-BLK-05、AR-GATE-01、AR-CON-01；Gate 决定绑定 exact evidence/source digests。
**UX 约束：** UX-DR-005、UX-DR-008–UX-DR-012、UX-DR-017、UX-DR-020、UX-DR-023、UX-DR-026、UX-DR-044–UX-DR-046、UX-DR-052。

**Acceptance Criteria:**

#### AC 1：收集真实端到端 evidence bundle

**Given** S1 候选构建完成
**When** Gate evaluator 收集证据
**Then** 分别包含 A/港股资格、许可、能力、数据语义、降级、搜索、图表、比较、布局、自选、筛选和研究证据
**And** 性能、WCAG、双语、主题和确定性结果均绑定环境与版本
**And** 静态页面、占位数据、demo 或单元测试不能替代真实旅程。

#### AC 2：验证关键研究旅程

**Given** 两个市场的合格 snapshot
**When** 执行版本化 S1 任务量表
**Then** 用户可从搜索完成图表检查、比较、筛选候选/零候选和来源审阅
**And** 所有缺失、许可、修订与新鲜度影响可见
**And** 计算结果由确定性 oracle 判定而非人工观感或模型输出。

#### AC 3：生成不可变 Gate 决定

**Given** evidence bundle 已校验
**When** 计算 S1 Gate
**Then** 每项为 pass/fail/blocked 并生成 Go、Stop 或 blocked
**And** 决定绑定 Capability Manifest、connector qualification、任务量表和 source digests
**And** 结果与审计原子提交，新证据只能产生新版本。

#### AC 4：执行 Stop/Narrow 而不掩盖失败

**Given** 某市场或关键能力不合格
**When** Gate 结果非 Go
**Then** 保持相关能力未注册，明确是 Stop、收窄市场还是继续 beta
**And** 不静默使用商业路径、demo、模型补值或降低量表
**And** 已通过的 S0 能力和研究证据保持可检查。

#### AC 5：不提前授权 S2+

**Given** S1 Gate 为 Go
**When** 生成下一阶段计划状态
**Then** 只满足 S2 的一个前置条件，不注册完整 Agent、Risk Gate、Monaco、提醒或组合
**And** AR-BLK-06 的真实 alpha 招募、有效 SM-00 与 A-02/A-05 证据继续阻塞 S2
**And** UI 不出现后续能力 teaser 或绕过入口。

## Epic 4: 让单 Agent 生成可保存、可复跑的选股证据

研究用户可以在精确模型资格、冻结上下文、预算和服务端风险策略约束下，让单 Agent 调用当前阶段真实存在的工具生成可追溯选股产物；授权、暂停、恢复、取消和所有未知项均可审核。

### Story 4.1: 配置并资格化精确模型档案

As a TickDeck 部署者,
I want 配置可替换模型并按精确模型、提示与工具集组合授予模式,
So that Agent 能力不会因兼容接口或静默回退被夸大。

**对应需求：** FR-065、FR-066、FR-067、FR-068、FR-069；CAP-8；NFR-008、NFR-013、NFR-014、NFR-020、NFR-028、NFR-029。
**阶段：** S2
**依赖：** Story 3.9 的有效 S1 Go、Story 2.4–Story 2.8。
**Blocker：** AR-BLK-06 的实际 alpha 招募和有效 SM-00 尚未满足时不得进入 S2；精确 provider/model/prompt/toolset、价格和正式测试端点仍须按 AR-BLK-08 登记，不能自行选择或以兼容模型假定合格。
**架构约束：** AR-AD-02、AR-AD-07–AR-AD-09、AR-AD-13、AR-AD-14、AR-AD-19、AR-AD-28、AR-BLK-06、AR-BLK-08；资格键必须精确绑定 provider/model/prompt/toolset 与 manifest digest。
**UX 约束：** UX-DR-005、UX-DR-008–UX-DR-009、UX-DR-022–UX-DR-024、UX-DR-026–UX-DR-027、UX-DR-033–UX-DR-034、UX-DR-037–UX-DR-045、UX-DR-052。

**Acceptance Criteria:**

#### AC 1：管理模型档案且隔离秘密

**Given** 部署者创建模型配置
**When** 填写 provider、Base URL、SecretRef、Model ID、请求头、超时、重试、上下文、价格和默认参数
**Then** 版本化 schema 校验全部字段并禁止秘密回显到浏览器、Agent、普通日志或导出
**And** 目的端、请求头与 SecretRef 纳入 DataUse/Egress 校验
**And** 配置修改产生新版本、审计和资格失效。

#### AC 2：执行连接与基础能力测试

**Given** 一个精确模型档案
**When** 运行 qualification suite
**Then** 验证连接、流式输出、结构化输出、工具调用、上下文长度和取消
**And** 保存精确版本、prompt hash、toolset、环境、结果、耗时和到期时间
**And** 只通过握手的组合最多获得单步无副作用 R0。

#### AC 3：执行完整语义与注入基准

**Given** 候选组合申请完整 Agent 模式
**When** 运行代表性多步语义、风险与提示注入 corpus
**Then** 用确定性 oracle 判定工具选择、参数、状态处理和拒绝行为
**And** 第三方内容中的指令不能扩大权限或改变系统提示/工具集
**And** 编译成功、格式正确或人工观感不能替代语义通过。

#### AC 4：按资格分级并在漂移时降级

**Given** 资格通过、过期、失败或任一绑定不匹配
**When** Agent run 准入
**Then** 只为 exact 合格组合启用合同允许的完整模式
**And** 失败/到期组合降到允许的单步 R0 或 blocked，并展示原因
**And** 不静默切换 provider、model、prompt 或 toolset。

#### AC 5：披露每次模型使用

**Given** 用户准备或检查 Agent run
**When** 显示模型 read model
**Then** 展示精确模型、冻结上下文范围、Token/费用估算、资格状态与 manifest
**And** 完整提示和凭据默认不进入普通日志
**And** 长 provider/model ID 在双语和 200% 缩放下可展开、复制且不截断关键信息。

### Story 4.2: 冻结自然语言目标并编排当前阶段工具

As a TickDeck 研究用户,
I want 在明确上下文中提交目标并看到 Agent 的计划与工具过程,
So that 页面变化或模型想象不会改变实际运行输入。

**对应需求：** FR-052、FR-053、FR-054；CAP-7；NFR-006、NFR-008、NFR-012–NFR-014、NFR-017、NFR-028。
**阶段：** S2
**依赖：** Story 4.1、Story 2.2、Story 3.7、Story 3.8。
**Blocker：** 只有 Story 4.1 exact 组合具备相应资格时才能进入完整模式；未通过 AR-BLK-06 的真实 S2 前置时仅可运行隔离 fixture，不能注册生产 Agent route。
**架构约束：** AR-AD-02–AR-AD-04、AR-AD-13、AR-AD-14、AR-AD-19、AR-AD-28、AR-AD-31；Mastra 仅经端口调用当前 Gate catalog 工具，不得直访 DB、文件、网络、秘密或连接器。
**UX 约束：** UX-DR-005–UX-DR-009、UX-DR-012–UX-DR-013、UX-DR-017、UX-DR-027–UX-DR-030、UX-DR-033–UX-DR-034、UX-DR-037–UX-DR-045、UX-DR-052。

**Acceptance Criteria:**

#### AC 1：明确并冻结任务上下文

**Given** 用户在图表、标的、筛选器或其他当前阶段表面输入目标
**When** 提交 Agent run
**Then** Context Chips 列出可移除的对象、版本、snapshot 和数据状态
**And** 提交后形成不可变 RunContext 与 digest，页面切换不能改变输入
**And** 重新绑定上下文必须生成新 manifest 版本并记录差异。

#### AC 2：只规划已注册工具

**Given** RunContext、资格和 Capability Manifest 已冻结
**When** Agent 生成计划
**Then** 工具名、版本、参数 schema 和阶段均来自 canonical action registry
**And** 不存在、未通过 Gate 或权限不足的能力返回 blocked，而非由模型模拟
**And** 每次工具调用前重新校验 schema、DataUse、Egress、risk、budget 和 state。

#### AC 3：显示可审核执行过程

**Given** run 处于 queued、running、waiting、paused 或终态
**When** 用户查看 Run Timeline
**Then** 分开显示计划、当前步骤、工具名、参数摘要、来源、耗时、费用、状态和失败原因
**And** 高风险、失败、重试和降级自动展开
**And** 未知进度只显示阶段和耗时，不伪造百分比或逐条朗读日志。

#### AC 4：保持权威快照与深链

**Given** SSE 断线、序号缺口、刷新或导航
**When** 客户端恢复 run
**Then** 重新获取 HTTP snapshot 并按 run ID/cursor 恢复
**And** 结果引用可深链到 Trust Strip、筛选证据、时间线节点和来源
**And** 深链失败保留对象 ID、版本和原因。

#### AC 5：通过不存在能力与上下文漂移测试

**Given** 页面切换、修改筛选器、过期 snapshot、伪造工具、恶意内容和旧 manifest fixtures
**When** 执行 Agent run
**Then** 原 run 继续使用冻结输入或因绑定失效进入明确状态
**And** 未注册工具调用成功率为 0
**And** 模型输出不能改变能力、风险、数据或确定性计算真值。

### Story 4.3: 授予并撤销 R1 范围授权

As a TickDeck 研究用户,
I want 对低风险持久化动作授予可撤销的窄范围授权,
So that Agent 无需逐次打断也不能越过对象、状态或期限。

**对应需求：** FR-058；CAP-7；NFR-009、NFR-013、NFR-017、NFR-029、NFR-035。
**阶段：** S2
**依赖：** Story 4.2、Story 2.7。
**Blocker：** 仅可覆盖 canonical risk registry 明确评为 R1 的当前阶段动作；提醒、策略启用和模拟组合等未注册能力不得预授权。
**架构约束：** AR-AD-03–AR-AD-05、AR-AD-13、AR-AD-14、AR-AD-19、AR-AD-29；R1 必须绑定 subject/session、工具、对象、范围、状态、策略与期限。
**UX 约束：** UX-DR-014、UX-DR-021–UX-DR-023、UX-DR-026、UX-DR-031–UX-DR-032、UX-DR-040、UX-DR-042、UX-DR-045、UX-DR-052。

**Acceptance Criteria:**

#### AC 1：呈现精确授权范围

**Given** Agent 首次请求一个 R1 动作
**When** Risk Gate 展示授权
**Then** 显示 subject/session、tool@version、对象、范围、状态版本、策略、有效期和撤销方式
**And** 不能折叠或省略影响范围
**And** 命令面板和快捷键只能导航到该界面，不能直接批准。

#### AC 2：签发可撤销 R1 授权

**Given** 用户确认且所有绑定仍有效
**When** 控制面签发 R1 authorization
**Then** authorization 绑定受保护会话、canonical action、scope digest、state version、policy epoch 和 expiry
**And** 签发、展示和确认分别进入审计
**And** 浏览器 token 或模型文本不能自行构造授权。

#### AC 3：在每次使用时重新校验

**Given** Agent 后续请求命中已授权范围
**When** 工具准备执行
**Then** 重新校验 session、object、scope、state、policy、budget 和 expiry
**And** 任一漂移立即拒绝并说明差异
**And** R1 只能满足风险准入，不能绕过 DataUse、Egress 或工具 Gate。

#### AC 4：撤销后阻止新使用

**Given** 用户撤销或授权到期
**When** Agent 再次请求同动作
**Then** 新执行被阻止并进入可查询审计
**And** 已完成结果不被删除，未拨号任务不得取得 ExecutionAuthorization
**And** 在途不确定效果遵循 reconcile/UNCERTAIN 而非盲重试。

#### AC 5：通过越权和竞态测试

**Given** 不同对象、扩展范围、旧状态、过期、撤销竞态、跨会话和直接 URL fixtures
**When** 尝试复用 R1
**Then** 范围外或失效授权成功率为 0
**And** 合法范围内重试仍保持幂等
**And** UI 与审计显示同一拒绝原因和授权版本。

### Story 4.4: 执行 R2 单次授权并永久阻止 R3

As a TickDeck 研究用户,
I want 高影响动作逐次确认且禁止危险动作,
So that 任何副作用都绑定我实际看到的精确状态。

**对应需求：** FR-059、FR-060、FR-061；CAP-7；NFR-009、NFR-013、NFR-017、NFR-029、NFR-035、NFR-036。
**阶段：** S2
**依赖：** Story 4.2、Story 2.7。
**Blocker：** S2 只能为当前已注册的高成本运行、新外部模型发送等动作签发 R2；策略启用、提醒外发和模拟订单须等待 S3/S4 Gate，不能通过预制 Grant 提前授权。
**架构约束：** AR-AD-03–AR-AD-05、AR-AD-13、AR-AD-14、AR-AD-19、AR-AD-29；R2 Grant 单次消费、不可重放，扩展/模型只能提高不能降低服务端风险。
**UX 约束：** UX-DR-014–UX-DR-016、UX-DR-021、UX-DR-031、UX-DR-040、UX-DR-042、UX-DR-044–UX-DR-045、UX-DR-052。

**Acceptance Criteria:**

#### AC 1：展示完整 R2 绑定摘要

**Given** 服务端计算最终风险为 R2
**When** Risk Gate 进入 pending
**Then** 不可折叠显示 subject/session、run、tool@version、参数 hash、snapshot/manifest、数据状态、状态版本、policy、成本、出站影响、有效期、single-use 和剩余次数
**And** 焦点进入 Gate，R2 无确认快捷键
**And** 参数、数据或状态变化时展示差异并失效旧 pending。

#### AC 2：签发并原子消费单次 Grant

**Given** 用户确认且绑定仍完全匹配
**When** 控制面签发并执行 R2
**Then** Grant 绑定 nonce、精确摘要、expiry 和一次使用
**And** 首次匹配消费与 operation/outbox/audit 在权威事务中一致
**And** 刷新、后退、重开、并发标签页和网络重试不能产生第二副作用。

#### AC 3：返回明确失效与冲突状态

**Given** Grant 已用、过期、参数不匹配或状态过期
**When** 再次提交
**Then** 返回 consumed、expired、conflict 或 state-changed 稳定状态
**And** 不自动重新弹出或签发新 Grant
**And** 用户可查看差异、审计 ID 和安全下一步。

#### AC 4：永久阻止 R3

**Given** 请求涉及实盘下单、输出密钥、许可绕过、宿主权限、风险绕过或其他 R3
**When** 风险引擎分类
**Then** 服务端拒绝且不存在 Grant、管理员覆盖、配置开关或扩展降级路径
**And** UI 只显示原因、策略来源、审计 ID 和安全替代
**And** 模型、扩展和客户端均不能降低风险。

#### AC 5：通过重放和绕过攻击 corpus

**Given** nonce 重放、跨会话、跨 run、旧 tool version、旧 snapshot、并发消费、直接 URL、快捷键和客户端篡改 fixtures
**When** 运行授权套件
**Then** 无效 R2 重放成功率为 0，R3 成功率为 0
**And** 合法首次执行至多产生一个业务副作用
**And** 审计链可重建展示、确认、消费、拒绝与结果。

### Story 4.5: 管理预算、取消、暂停与幂等恢复

As a TickDeck 研究用户,
I want 控制 Agent 的数据、模型、时间和并发预算并安全恢复,
So that 长任务不会失控、断线或重试后重复产生副作用。

**对应需求：** FR-062、FR-063；CAP-7；NFR-006、NFR-008–NFR-010、NFR-014、NFR-017、NFR-036。
**阶段：** S2
**依赖：** Story 4.2、Story 4.3、Story 4.4、Story 2.2。
**Blocker：** 无新增开放问题；预算上限必须来自部署/用户配置与当前运行复杂度，高成本越限仍需 R2，不能自行设定放宽值。
**架构约束：** AR-AD-03–AR-AD-05、AR-AD-13、AR-AD-14、AR-AD-19、AR-AD-27、AR-AD-29；恢复沿用 OperationIdentity、RunContext 与 fencing，外部效果未知进入 UNCERTAIN。
**UX 约束：** UX-DR-013–UX-DR-016、UX-DR-027–UX-DR-030、UX-DR-042、UX-DR-045、UX-DR-052。

**Acceptance Criteria:**

#### AC 1：配置并冻结多维预算

**Given** 部署者和用户有适用预算
**When** Agent run 创建
**Then** 冻结数据、模型、运行时间、并发与成本上限及来源
**And** 冲突时采用更严格值并记录 policy epoch
**And** 未经批准不得超过，不能由模型修改预算。

#### AC 2：持续显示消耗与可信进度

**Given** run 正在执行
**When** 使用数据、Token、时间、并发或费用
**Then** Run Timeline 显示累计消耗、剩余预算、阶段和耗时
**And** 未知总工作量不显示虚假百分比
**And** 超过基线时提供取消和诊断入口。

#### AC 3：持久化显式取消

**Given** run queued、running、waiting 或 paused
**When** 用户请求取消
**Then** 先持久化 cancellation intent，再向执行者发送取消
**And** 刷新、导航、关闭客户端或会话断开不等于取消
**And** 取消结果和最后成功步骤可审计。

#### AC 4：安全暂停与恢复

**Given** run 等待确认、断线、崩溃或租约过期
**When** 用户重新进入或系统恢复
**Then** HTTP snapshot 显示 waiting/paused/interrupted、恢复 provenance、manifest 和 last-success
**And** 纯计算在同一 operation/RunContext 下创建新 attempt
**And** 持久化动作不得因重试重复执行，UNCERTAIN 效果先 reconcile。

#### AC 5：通过故障与预算竞态测试

**Given** 预算耗尽、确认过期、取消竞态、断线、旧 Worker、重复提交和不确定外部效果 fixtures
**When** 恢复 corpus 运行
**Then** 每个 logical operation 只有一个权威状态和至多一个副作用
**And** 超预算未经 R2 的执行成功率为 0
**And** UI、审计、outbox 与 run 状态最终一致。

### Story 4.6: 生成事实分层且可追溯的 Agent 产物

As a TickDeck 研究用户,
I want Agent 结论明确区分事实、计算、解释和未知,
So that 我能从结果复核来源并自行作出判断。

**对应需求：** FR-064；CAP-7；NFR-007、NFR-008、NFR-012、NFR-014、NFR-017、NFR-029。
**阶段：** S2
**依赖：** Story 4.2、Story 4.5。
**Blocker：** 产物只能引用当前 Gate 已注册工具的真实结果；来源缺失或不可复现时必须保留 unknown/not-reproducible，不能让模型补齐。
**架构约束：** AR-AD-10、AR-AD-13、AR-AD-14、AR-AD-19、AR-AD-28、AR-AD-31；确定性代码拥有金融计算真值，工件经 Artifact Service commit。
**UX 约束：** UX-DR-008–UX-DR-009、UX-DR-017、UX-DR-027–UX-DR-030、UX-DR-033–UX-DR-034、UX-DR-042、UX-DR-045。

**Acceptance Criteria:**

#### AC 1：构建版本化运行清单

**Given** Agent run 形成结果
**When** 创建 artifact manifest
**Then** 包含冻结上下文、tool@version、参数/hash、snapshot、精确 model、prompt hash、toolset、qualification、费用和 policy/risk
**And** 所有引用使用稳定 ID/digest
**And** 清单缺少承重字段时工件不能进入 COMMITTED。

#### AC 2：分离四类结论

**Given** 工具结果与模型说明同时存在
**When** 生成 Review Canvas
**Then** 稳定分区展示事实、确定性计算、模型解释和未知项
**And** 模型不得改写工具数值为事实或隐藏相反证据
**And** 每项可深链到来源、时间线节点和 snapshot。

#### AC 3：披露不确定与复现状态

**Given** 数据 partial/stale、来源撤回、版本缺失或 run 未完成
**When** 用户检查产物
**Then** 显示 partial/not-reproducible/error 与影响范围
**And** 保留最近成功内容及时间但不冒充当前完整结果
**And** 复跑必须创建新 manifest，不覆盖旧证据。

#### AC 4：禁止投资承诺和代用户拍板

**Given** 模型生成结论文本
**When** 内容进入产品表面
**Then** 不把建议描述为确定收益、自动决策或用户授权
**And** 零候选和未知项保持合法结果
**And** 文案先说明结果与影响，再给证据和下一步。

#### AC 5：通过篡改与可访问测试

**Given** 引用丢失、digest 篡改、模型数值冲突、长来源和双语 fixtures
**When** 打开或导出产物
**Then** 篡改或缺失引用 fail closed/quarantine
**And** 四类内容和完整标识在键盘、读屏与 200% 缩放下可辨识
**And** 导出服从 DataUsePolicy 并不包含秘密或受限 payload。

### Story 4.7: 产品化可审计选股 Agent 运行

As a TickDeck 研究用户,
I want Agent 把自然语言选股目标转换为确定性筛选和可保存证据,
So that 我能复跑研究而不把模型当作筛选真值。

**对应需求：** FR-052、FR-053、FR-054、FR-055、FR-057、FR-058、FR-062、FR-063、FR-064；CAP-7；SM-02、SM-04；NFR-005–NFR-010、NFR-029。
**阶段：** S2
**依赖：** Story 4.1–Story 4.6、Story 3.7、Story 3.8。
**Blocker：** AR-BLK-06 的真实 alpha 证据、A-02/A-05 对应成功指标与合格模型组合未关闭时不得把 S0-V 实验提升为 S2 产品能力。
**架构约束：** AR-AD-02–AR-AD-05、AR-AD-07、AR-AD-13、AR-AD-14、AR-AD-19、AR-AD-28、AR-AD-31；规范条件树与候选由确定性筛选器计算。
**UX 约束：** UX-DR-008–UX-DR-009、UX-DR-012–UX-DR-017、UX-DR-023、UX-DR-027–UX-DR-030、UX-DR-033–UX-DR-034、UX-DR-045–UX-DR-046。

**Acceptance Criteria:**

#### AC 1：规范化目标并检查能力

**Given** 用户提交选股目标和冻结上下文
**When** Agent 解释条件
**Then** 生成可审核、可编辑的规范条件树、单位、市场、排序和排除项
**And** 在执行前显示歧义、未知字段、DataUse 与 capability 结果
**And** 未解决的关键歧义阻止运行，不能由模型猜测。

#### AC 2：调用确定性筛选与研究工具

**Given** 条件树通过校验
**When** Agent 执行计划
**Then** 只调用 Story 3.7/3.8 当前注册工具并在每步重校验
**And** 候选、排序、数值和命中证据由 deterministic engine 产生
**And** R0/R1 行为按精确风险与授权留痕。

#### AC 3：支持候选和零候选完成态

**Given** 筛选运行完成
**When** 打开 Review Canvas
**Then** 候选或零候选均展示逐项证据、未知、来源、清单和工作台入口
**And** Agent 不要求放宽条件或制造候选
**And** 最终判断明确留给用户。

#### AC 4：保存、恢复和复跑

**Given** 运行已提交或在中途断线
**When** 用户恢复或从旧产物复跑
**Then** 恢复原 run/manifest 或以新 snapshot 创建新版本
**And** 显示条件、数据、模型、工具和 policy 差异
**And** 重试不重复创建筛选器、布局或其他持久化产物。

#### AC 5：通过真实任务与 oracle 验收

**Given** S2 冻结选股任务集、两条合格真实数据路径和 exact 模型组合
**When** 运行端到端任务
**Then** precision/recall、证据完整性、零候选、风险、取消和复跑按预定 oracle 判定
**And** fixture 结果、模型文采或人工改绿不能替代真实证据
**And** 失败时保留证据并触发 Stop/Narrow 而非降低标准。

### Story 4.8: 锁定可信策略验证的 Agent 编排合同

As a TickDeck 策略研究用户,
I want Agent 的策略任务只能沿“契约—源码—沙箱—回测—偏差—清单”路径运行,
So that 后续 S3 能接入真实工具而不会由模型伪造验证。

**对应需求：** FR-056；CAP-7 对策略任务的编排合同；NFR-007、NFR-013、NFR-016、NFR-028、NFR-029、NFR-037。
**阶段：** S2 合同；实际工具激活受 S3 Gate 约束
**依赖：** Story 4.2、Story 4.4–Story 4.6、Story 2.10。
**Blocker：** S3 的 TypeScript、沙箱、回测和偏差工具尚未获阶段授权；本 Story 的独立完成条件仅是类型化编排合同与当前 S2 fail-closed 验收，不依赖任何未来 Story，不得注册、模拟或宣称 FR-056 端到端可用。
**架构约束：** AR-AD-02、AR-AD-12–AR-AD-14、AR-AD-23、AR-AD-28、AR-AD-31、AR-GATE-01；每一步只通过未来已注册端口，模型不能执行代码或金融计算。
**UX 约束：** UX-DR-005、UX-DR-012–UX-DR-017、UX-DR-028–UX-DR-035、UX-DR-047、UX-DR-052；S3 前不得挂载 Monaco 或策略实验室。

**Acceptance Criteria:**

#### AC 1：定义完整策略任务状态机

**Given** FR-056 的已定稿合同
**When** 编译 Agent workflow schema
**Then** 依次要求策略契约、可编辑 TypeScript、编译/能力/沙箱诊断、冻结清单、回测、偏差检查和结果工件
**And** 每步声明输入、输出、错误、risk 与 required capability
**And** 缺失承重步骤不能跳过或由模型文本替代。

#### AC 2：在 S3 前保持能力不可调用

**Given** Capability Manifest 最高为 S2
**When** Agent 请求策略验证
**Then** 返回稳定 `CAPABILITY_NOT_REGISTERED` 与 S3 Gate blocker
**And** 不生成伪源码、伪编译、伪回测或虚构 manifest
**And** App Shell、工具目录与命令面板不显示策略入口 teaser。

#### AC 3：验证未来端口的类型与风险边界

**Given** 使用 test doubles 的合同测试
**When** 每个步骤返回成功、失败、取消、R2 或不确定状态
**Then** workflow 只接受版本化 schema 和匹配 RunContext digest
**And** R2 不能预签发给未来工具或跨状态复用
**And** 脚本源码、sandbox 结果和 backtest manifest 通过 ArtifactRef 传递而非模型内存。

#### AC 4：封存合同而不激活未来能力

**Given** 编排 schema 与当前阶段 fail-closed suite 已通过
**When** 本 Story 在 S2 独立完成
**Then** 只保存版本化、未注册的 workflow contract 与测试证据
**And** 任何后续激活仍须另有有效 S3 Gate、exact tool manifests 并重新运行全部资格套件
**And** 本 Story 不依赖、替代或预先授权该未来 Gate，也不构成 S3 或发布资格。

#### AC 5：通过缺步骤与伪工具攻击测试

**Given** 模型伪称已编译、跳过偏差、替换工具、旧 manifest 或直接注入结果 fixtures
**When** workflow validator 执行
**Then** 所有伪造/缺步骤运行被拒绝或标 incomplete
**And** 只有真实已注册工具 artifact 可推进状态
**And** 审计能说明失败步骤、影响和合法下一步。

### Story 4.9: 生成 S2 单 Agent 与风险 Gate 决定

As a TickDeck 产品维护者,
I want 用真实 alpha、模型语义和端到端选股证据决定 S2 Go、Stop 或 blocked,
So that 未证明有价值或不安全的 Agent 不会进入策略阶段。

**对应需求：** FR-052–FR-069 的 S2 Gate 汇总；CAP-7、CAP-8、CAP-11；SM-02、SM-04、SM-10、SM-17 及 S2 阶段门；NFR-006、NFR-029、NFR-033–NFR-036。
**阶段：** S2 Gate
**依赖：** Story 4.1–Story 4.8。
**Blocker：** 至少 12 名合格 alpha 用户、冻结任务/条件、有效 SM-00 与 A-02/A-05 对应证据尚未真实满足时必须 blocked；OQ-02 仅关闭实验协议，不等于结果通过。
**架构约束：** AR-AD-02、AR-AD-05、AR-AD-14、AR-AD-19、AR-AD-20、AR-BLK-06、AR-GATE-01、AR-CON-01；Gate 只接受 exact evidence/source digests。
**UX 约束：** UX-DR-005、UX-DR-012–UX-DR-017、UX-DR-026–UX-DR-034、UX-DR-044–UX-DR-046、UX-DR-052。

**Acceptance Criteria:**

#### AC 1：核验真实 S2 前置证据

**Given** S2 候选 evidence bundle
**When** Gate evaluator 读取 alpha、SM-00、A-02/A-05 和用户资格证据
**Then** 校验样本量、冻结条件、排除、环境、source digest 与结果有效性
**And** 缺失、事后改条件、fixture 或过期证据保持 blocked
**And** 指标之间不能互相补偿。

#### AC 2：核验 Agent、模型与风险旅程

**Given** exact 合格模型与真实 A/港股数据
**When** 执行版本化任务量表
**Then** 自然语言上下文、计划、工具、选股证据、R1、R2、R3、预算、取消、恢复和追溯全部通过
**And** 注入、重放、未注册工具和状态漂移绕过成功率为 0
**And** 结果由 oracle 与审计判定，不依赖模型自评。

#### AC 3：正确处理 FR-056 阶段边界

**Given** 策略编排合同存在但 S3 工具未授权
**When** 计算 S2 Gate
**Then** 只验证 fail-closed 合同和未注册状态
**And** 不把 TypeScript、沙箱或回测能力计为 S2 已完成
**And** FR-056 的端到端激活继续由 S3 evidence 决定。

#### AC 4：生成不可变 Gate 决定

**Given** 全部承重证据已评估
**When** 提交 S2GateDecision
**Then** 每项形成 pass/fail/blocked、原因、manifest 与 source digests
**And** Go/Stop/blocked 与 Gate Registry、Capability Manifest、审计原子一致
**And** 新证据只能生成新版本，不能覆盖旧结论。

#### AC 5：不提前授权 S3+

**Given** S2 Gate 为 Go
**When** 准备下一阶段
**Then** 只解除 S3 计划前置，不注册 Monaco、sandbox strategy tool、回测、提醒或组合
**And** OQ-06/S0 沙箱证据漂移会重新阻塞依赖能力
**And** UI 不出现 S4/S5 能力或绕过 Gate 的入口。

## Epic 5: 创作 TypeScript 策略并完成可信验证

策略研究用户可以创建版本化 TypeScript 指标或策略，在固定工具链和一次性沙箱中编译试运行，以冻结的 A/港股执行假设完成确定性回测、偏差检查、样本外与敏感性分析，并比较和复跑可追溯报告。

### Story 5.1: 冻结并实现内置指标目录

As a TickDeck 研究用户,
I want 使用版本明确、计算确定的常用内置指标,
So that 图表、筛选和回测共享同一趋势、动量、波动和成交量结果。

**对应需求：** FR-029；CAP-5；NFR-004、NFR-007、NFR-012、NFR-028–NFR-030。
**阶段：** S3
**依赖：** Story 4.9 的有效 S2 Go、Story 3.2、Story 3.4。
**Blocker：** FR-029 要求的 alpha 前精确发布目录尚须由上游产品决策冻结；不得自行选择具体指标、参数默认值或以第三方库目录代替合同。
**架构约束：** AR-AD-02、AR-AD-03、AR-AD-16、AR-AD-23、AR-AD-28、AR-AD-31、AR-GATE-01；确定性核心独占计算，图表只消费非权威 projection。
**UX 约束：** UX-DR-003、UX-DR-010、UX-DR-020、UX-DR-023、UX-DR-026、UX-DR-035、UX-DR-041、UX-DR-045、UX-DR-052。

**Acceptance Criteria:**

#### AC 1：以版本化目录声明指标

**Given** 精确 v1 指标目录已由授权产品决策冻结
**When** 构建 indicator catalog
**Then** 每项声明稳定 ID、版本、类别、输入、参数、warm-up、输出、单位和兼容范围
**And** 目录至少覆盖已定范围的趋势、动量、波动和成交量类别
**And** 未冻结项目保持 blocked，不能隐式加入发布目录。

#### AC 2：执行权威 decimal 计算

**Given** 版本化指标、参数和 MarketDataSnapshotRef
**When** 计算指标序列
**Then** 使用 finance-decimal、DomainQuantization 与 DeterministicReductionSpec
**And** 未完成 K 线、缺口、修订和 warm-up 状态作为结果元数据
**And** binary float、Canvas 或格式化文本不成为权威值。

#### AC 3：跨表面复用同一结果合同

**Given** 相同指标定义与 snapshot
**When** 图表、筛选和回测请求计算
**Then** 返回相同版本、参数 digest、序列 digest 与 DecimalEvidence
**And** 不允许各模块自建同名计算
**And** 不兼容版本显式拒绝或标不可复现。

#### AC 4：呈现指标状态与可访问等价

**Given** 指标 ready、warming、partial、stale 或 error
**When** 添加到主图、独立窗格或数据表
**Then** 使用文字、图标、线型和状态说明，不只靠颜色
**And** 可查看版本、参数、数据时间和影响
**And** Canvas 外提供同步可访问数值表。

#### AC 5：通过 oracle 与性能回归

**Given** 边界值、缺口、修订、跨市场和长序列 corpus
**When** 在各支持平台重复计算
**Then** 结果与冻结 oracle 数值等价并满足适用图表性能
**And** 结果不依赖 locale、线程顺序或模型
**And** 性能基线调整保留原环境、结果和理由。

### Story 5.2: 提供版本化 TypeScript 编辑与窄化 API

As a TickDeck 策略研究用户,
I want 创建和编辑具有类型提示的受限 TypeScript 指标或策略,
So that 源码可读、可诊断、可版本化且不能直接接触宿主。

**对应需求：** FR-030、FR-031、FR-034；CAP-5；NFR-010、NFR-013、NFR-014、NFR-016、NFR-026–NFR-028。
**阶段：** S3
**依赖：** Story 5.1、Story 2.9、Story 2.10。
**Blocker：** OQ-06 的 exact compiler/componentizer/source-map、WIT/WASI、确定性输出及五平台证据必须保持有效；任一漂移时编辑可保留草稿，但编译/运行能力必须 LOCKED。TypeScript 6.0.3 的应用 typecheck、Vite build 或 compiler API 兼容探针不构成上述工具链或跨平台运行证据。
**架构约束：** AR-AD-02、AR-AD-03、AR-AD-10、AR-AD-12、AR-AD-15、AR-AD-16、AR-AD-28、AR-AD-31；Monaco 仅 S3 懒加载，脚本只见版本化 TickDeck WIT。
**UX 约束：** UX-DR-005、UX-DR-021–UX-DR-023、UX-DR-026–UX-DR-032、UX-DR-035、UX-DR-037–UX-DR-045、UX-DR-047、UX-DR-052。

**Acceptance Criteria:**

#### AC 1：创建受限源码草稿

**Given** 用户进入 S3 策略实验室
**When** 创建指标或策略
**Then** 选择已注册模板、kind 和兼容 API 版本并生成稳定 script ID
**And** Monaco 提供类型提示、格式化、源码位置诊断和只读运行上下文说明
**And** 草稿自动保存时间可见且不自动成为正式版本。

#### AC 2：只暴露窄化版本化 API

**Given** 脚本导入 TickDeck API
**When** 类型检查和能力检查运行
**Then** 只允许版本锁定的市场数据、指标、策略和回测接口
**And** 不暴露服务端环境、数据库、文件、网络、秘密、时钟或随机宿主对象
**And** 未列入 allowlist 的依赖和动态加载被拒绝。

#### AC 3：保存不可混淆脚本版本

**Given** 用户保存或覆盖源码
**When** 控制面提交命令
**Then** 创建新版本并记录 manual/Agent 来源、source hash、依赖、WIT/API 与兼容范围
**And** expected version 冲突时拒绝并显示差异
**And** 保存失败不损坏旧版本或留下半提交 artifact。

#### AC 4：安全显示诊断与日志

**Given** 类型、格式或能力错误
**When** 编辑器呈现诊断
**Then** 错误定位到源码范围并提供稳定英文 code 与本地化说明
**And** 运行日志结构化、脱敏且不含秘密/完整 Agent 上下文
**And** 键盘作用域优先于全局快捷键，Escape 与焦点回返符合合同。

#### AC 5：通过安全与兼容测试

**Given** 宿主访问、动态 import、依赖投毒、旧 API、超长源码和恶意注释 fixtures
**When** 编辑与保存测试运行
**Then** 不允许的能力在编译前被阻止
**And** 注释/内容中的指令不能改变 Agent 权限或工具行为
**And** 双语、伪本地化和 200% 缩放下关键诊断不截断。

### Story 5.3: 编译并在一次性沙箱中受限试运行

As a TickDeck 策略研究用户,
I want 在正式运行前编译、校验并受限试运行源码,
So that 错误、越权和资源耗尽在主服务之外被确定地阻止。

**对应需求：** FR-032、FR-033；CAP-5；NFR-006、NFR-016、NFR-018、NFR-028、NFR-037。
**阶段：** S3
**依赖：** Story 5.2、Story 2.9、Story 2.10。
**Blocker：** AR-BLK-02/OQ-06 与 FR-095/NFR-037 的 exact 五平台证据必须通过且未漂移；不得降级到浏览器 JS、Node VM、长期复用进程或较弱沙箱。
**架构约束：** AR-AD-04、AR-AD-10、AR-AD-12、AR-AD-19、AR-AD-20、AR-AD-27、AR-AD-31；TypeScript 编译为 WebAssembly Component，在一次性 sandbox-host/Wasmtime 进程运行。
**UX 约束：** UX-DR-013、UX-DR-017、UX-DR-027–UX-DR-030、UX-DR-035、UX-DR-042、UX-DR-045、UX-DR-047、UX-DR-052。

**Acceptance Criteria:**

#### AC 1：执行固定编译流水线

**Given** 已保存脚本版本与锁定工具链
**When** 请求编译
**Then** 依次完成 TypeScript 类型、dependency/capability、componentizer、WIT 和 artifact 校验
**And** 输出绑定 source、toolchain、WIT/WASI、Release Profile 和 deterministic digest
**And** 诊断通过 source-map 关联精确源码位置。

#### AC 2：在一次性进程中试运行

**Given** VERIFIED_UNCOMMITTED Component artifact
**When** 启动受限试运行
**Then** supervisor 创建一次性 sandbox-host/Wasmtime 进程并只授予所需 WIT resource
**And** 进程无网络、文件、环境、秘密或宿主对象访问
**And** 完成、失败或取消后终止完整进程树且不复用实例。

#### AC 3：强制所有资源上限

**Given** 运行档案声明 CPU、内存、elapsed、输出、数据请求和并发配额
**When** 脚本达到任一上限
**Then** 以稳定错误终止且主服务/Worker 保持健康
**And** 输出截断状态与已消费资源可审计
**And** 模型、脚本和客户端不能提高上限。

#### AC 4：提交可信编译与试运行工件

**Given** 编译和试运行均通过
**When** Artifact Service verify/commit
**Then** manifest 记录 hashes、兼容范围、资源档案、诊断和 sandbox evidence
**And** 缺失 blob/digest 不匹配时 quarantine/fail closed
**And** 只有 COMMITTED artifact 可进入后续回测。

#### AC 5：复跑固定沙箱合规套件

**Given** 逃逸、宿主对象、依赖投毒、网络/文件、无限循环、内存、输出和进程树 fixtures
**When** 在五个 Release Profile 构建上测试
**Then** 全部攻击被阻止且结果绑定环境、用例和构建 digest
**And** 严重依赖漏洞使能力 suspended/blocked
**And** 任一平台失败时不得宣称该平台 S3 支持。

### Story 5.4: 将指标与策略信号接回图表

As a TickDeck 策略研究用户,
I want 把沙箱指标和策略信号作为可核查图层查看,
So that 能在行情上下文中检查输出而不让脚本直接修改组合。

**对应需求：** FR-035；CAP-5；NFR-007、NFR-008、NFR-012、NFR-016、NFR-021。
**阶段：** S3
**依赖：** Story 5.3、Story 3.4。
**Blocker：** 脚本必须通过当前 exact sandbox/toolchain qualification；提醒与模拟组合属于 S4，只能显示未来可消费的类型化信号工件，不得注册接入动作。
**架构约束：** AR-AD-02、AR-AD-10、AR-AD-12、AR-AD-13、AR-AD-16、AR-AD-28、AR-AD-31；信号只通过不可变 ArtifactRef/typed port，不得直接访问组合存储。
**UX 约束：** UX-DR-003、UX-DR-008–UX-DR-010、UX-DR-017、UX-DR-031、UX-DR-035、UX-DR-041、UX-DR-045、UX-DR-047、UX-DR-052。

**Acceptance Criteria:**

#### AC 1：可视化沙箱指标输出

**Given** 已提交的指标运行工件
**When** 用户添加到图表
**Then** adapter 以稳定 series ID、script/version、参数、snapshot 和单位渲染
**And** 结果与可访问数据表使用同一权威序列
**And** 缺失、warm-up、partial 和错误点显式可见。

#### AC 2：显示策略信号证据

**Given** 策略产生时间化信号
**When** 叠加到行情图表
**Then** marker、文字和图例显示 signal kind、时间、价格基准、版本和来源
**And** 未确认 K 线或修订影响独立标记
**And** 信号不被描述为成交或确定收益。

#### AC 3：保持跨视图快照一致

**Given** 用户从图表进入脚本、回测或 Review Canvas
**When** 深链解析
**Then** 保留相同 script、run、MarketDataSnapshotRef 和 ExecutionAssumption
**And** 绑定变化产生新清单而非修改旧图层
**And** 深链失败保留 ID、版本和原因。

#### AC 4：禁止组合与通知副作用

**Given** S3 Capability Manifest
**When** 脚本或用户尝试把信号连接到提醒/模拟组合
**Then** 返回 S4 未注册 blocker
**And** 脚本 API 中不存在组合写入、订单或通知端口
**And** 不显示 disabled teaser、快捷执行或预授权入口。

#### AC 5：通过等价与可访问测试

**Given** 多信号、长序列、partial、主题和键盘 fixtures
**When** 图表和表格呈现同一工件
**Then** 点位、状态、版本和来源一致
**And** 非颜色表达和读屏路径可区分每条信号
**And** Canvas 坐标或浏览器 float 不改变权威结果。

### Story 5.5: 冻结策略契约、运行清单与 A/港股执行假设

As a TickDeck 策略研究用户,
I want 在回测前明确策略契约并冻结全部执行输入,
So that 结果可以复跑且不会隐式套用错误市场规则。

**对应需求：** FR-036、FR-037、FR-038；CAP-5；NFR-007、NFR-008、NFR-012、NFR-029。
**阶段：** S3
**依赖：** Story 5.3、Story 3.2。
**Blocker：** 策略缺少市场、范围、周期、信号、仓位、风控、基准或执行假设时必须阻止；未知市场规则不得自行补默认值。
**架构约束：** AR-AD-03、AR-AD-10、AR-AD-12、AR-AD-23、AR-AD-28、AR-AD-31；回测、比较和未来组合共享唯一版本化 ExecutionAssumption。
**UX 约束：** UX-DR-008–UX-DR-009、UX-DR-017、UX-DR-022–UX-DR-023、UX-DR-032、UX-DR-035、UX-DR-045、UX-DR-047。

**Acceptance Criteria:**

#### AC 1：校验完整策略契约

**Given** 用户准备回测一个脚本版本
**When** 填写策略契约
**Then** 明确市场、标的范围、周期、信号、仓位、风控、基准和执行假设
**And** 字段使用类型化 ID、单位和版本
**And** 关键缺口、歧义或不支持能力阻止运行并指出修复项。

#### AC 2：冻结不可变运行清单

**Given** 策略契约完整
**When** 创建 backtest RunContext
**Then** 清单绑定 script/version/hash、参数、数据范围/source/snapshot、复权、引擎、费用、滑点和成交模型
**And** 记录 build、WIT、calendar、corporate-action、policy 和 assumption digests
**And** 运行后任何修改只能创建新清单。

#### AC 3：执行 A/港股市场规则

**Given** 已冻结市场与时间范围
**When** backtest engine 处理订单/成交模拟
**Then** 按适用日历、停牌、涨跌停、T+1、最小单位、费用税费、滑点和公司行动计算
**And** 使用同一 ExecutionAssumption 与 decimal 量化
**And** 无法模拟或 unknown 规则警告或阻止。

#### AC 4：保持数据修订与复权可见

**Given** 数据、公司行动或复权版本变化
**When** 用户复跑旧契约
**Then** 默认引用原 snapshot；不可得时说明不可完全复现并列出差异
**And** 不静默切换到 mutable latest
**And** 新 run 与旧 run 分别保存 lineage。

#### AC 5：通过市场规则 oracle

**Given** A/港股停牌、涨跌停、T+1、最小单位、费用、除权和边界日 corpus
**When** engine 重复执行相同清单
**Then** 成交、拒绝、现金、持仓和成本与冻结 oracle 数值等价
**And** 不同线程/平台不得改变确定性结果
**And** 错误规则不会被图表或模型解释掩盖。

### Story 5.6: 生成完整回测报告并检查常见偏差

As a TickDeck 策略研究用户,
I want 同时看到绩效、交易、成本和偏差警告,
So that 不会把漂亮收益曲线误当作可信策略。

**对应需求：** FR-039、FR-040；CAP-5；NFR-007、NFR-008、NFR-012、NFR-021、NFR-029。
**阶段：** S3
**依赖：** Story 5.5。
**Blocker：** 偏差检查或承重报告项缺失时结果只能标 incomplete/blocked，不得以模型摘要或部分指标替代完整报告。
**架构约束：** AR-AD-10、AR-AD-13、AR-AD-14、AR-AD-23、AR-AD-28、AR-AD-31；全部绩效与偏差判定由确定性代码生成。
**UX 约束：** UX-DR-008–UX-DR-009、UX-DR-017、UX-DR-020、UX-DR-023、UX-DR-027–UX-DR-030、UX-DR-035、UX-DR-045、UX-DR-047。

**Acceptance Criteria:**

#### AC 1：计算完整绩效报告

**Given** backtest 达到可报告终态
**When** 生成 report artifact
**Then** 包含累计/年化收益、基准比较、最大回撤、波动、换手、交易、持仓变化和成本影响
**And** 每项声明公式版本、单位、币种、期间和 DecimalEvidence
**And** 缺失输入使受影响指标 unknown 而非补零。

#### AC 2：关联交易与权益曲线

**Given** 用户检查任一收益或回撤区间
**When** 从报告深链
**Then** 可定位到权益曲线、持仓、订单/成交模拟和源行情时间点
**And** 显示 snapshot、ExecutionAssumption 和费用/滑点贡献
**And** 图形外提供可访问数据表。

#### AC 3：检测常见偏差

**Given** strategy run inputs 与信号序列
**When** bias checker 执行
**Then** 检测或警示未来函数、前视、未确认 K 线、数据泄漏、预热不足、幸存者偏差风险和明显参数过拟合
**And** 每项给出证据位置、严重度、影响和处置
**And** blocker 级问题阻止可信完成态。

#### AC 4：明确事实与模型说明边界

**Given** Agent 为报告生成解释
**When** Review Canvas 呈现
**Then** 指标和偏差事实保持确定性区域，模型文字只在解释区域
**And** 不承诺收益、不淡化偏差或替用户批准策略
**And** unknown 与不可复现状态保持可见。

#### AC 5：通过公式与偏差 oracle

**Given** 已知收益、费用、回撤和各类偏差陷阱 corpus
**When** 重复生成报告
**Then** 指标与 bias findings 精确匹配 oracle
**And** UI、导出和 Agent 引用使用同一 report digest
**And** 模型输出不参与通过判定。

### Story 5.7: 执行样本外、敏感性、比较与长时运行

As a TickDeck 策略研究用户,
I want 对关键参数和成本做受预算验证并比较复跑,
So that 能识别脆弱策略并了解哪些结果不可完全复现。

**对应需求：** FR-041、FR-042、FR-043；CAP-5；NFR-006–NFR-010、NFR-012、NFR-017、NFR-029。
**阶段：** S3
**依赖：** Story 5.5、Story 5.6、Story 4.4、Story 4.5。
**Blocker：** 参数扫描规模和成本超过冻结预算时须用户手动确认或有效 R2；不得自行扩大预算、选择“最好”结果或事后移动样本边界。
**架构约束：** AR-AD-03–AR-AD-05、AR-AD-10、AR-AD-13、AR-AD-23、AR-AD-28、AR-AD-31；每个子运行具有不可变清单，聚合不改变原结果。
**UX 约束：** UX-DR-013–UX-DR-017、UX-DR-027–UX-DR-030、UX-DR-033、UX-DR-035、UX-DR-042、UX-DR-045、UX-DR-047。

**Acceptance Criteria:**

#### AC 1：冻结样本内外划分

**Given** 用户定义训练/研究与样本外区间
**When** 创建验证计划
**Then** 保存时间边界、市场日历、数据 snapshot、选择时点和理由
**And** 运行开始后不能修改原划分
**And** 新划分产生新 plan/version 并可比较。

#### AC 2：运行受预算敏感性分析

**Given** 用户选择关键参数和成本假设范围
**When** 估算扫描
**Then** 显示组合数量、资源、数据/模型费用和预算影响
**And** 预算内可执行，超预算须 R2 或手动缩小
**And** 并发与资源上限由服务端强制。

#### AC 3：比较多个运行

**Given** 两个或更多 committed backtest reports
**When** 用户比较
**Then** 并列显示契约、清单、数据、版本、绩效、偏差、样本外和敏感性差异
**And** 不同口径不可直接排序时明确阻止或标注
**And** 比较计算确定且保留来源深链。

#### AC 4：从清单复跑并披露差异

**Given** 用户复跑旧 manifest
**When** 依赖仍可用或部分缺失
**Then** exact 可用时产生数值等价结果；缺失时列出不可完全复现条件
**And** 不静默使用新脚本、latest data 或新引擎
**And** 新 run 不覆盖原报告。

#### AC 5：管理长任务生命周期

**Given** 回测或参数扫描运行中
**When** 用户查看、取消、断线或恢复
**Then** 显示进度/阶段、资源、成本、run ID、last-success 和恢复 provenance
**And** 取消先持久化且旧 Worker 结果被 fencing 拒绝
**And** 重试不重复子运行或聚合工件。

#### AC 6：通过过拟合与恢复 corpus

**Given** 样本泄漏、事后边界、成本敏感、参数峰值、取消和崩溃 fixtures
**When** 验证计划执行
**Then** 已知脆弱性被确定性标记且不能被模型压低严重度
**And** 恢复后子运行集合和聚合 digest 一致
**And** 超预算未授权执行成功率为 0。

### Story 5.8: 完成 Agent 策略验证并生成 S3 Gate 决定

As a TickDeck 产品维护者,
I want 以语义、沙箱、回测和偏差证据决定 S3 Go、Stop 或 blocked,
So that 只有真正可复现的策略验证链才能进入提醒与模拟组合阶段。

**对应需求：** FR-029–FR-043 的 S3 Gate 汇总，并完成 FR-056 的真实 S3 工具激活；CAP-5、CAP-7、CAP-11；SM-03、SM-05、SM-07、SM-11 及 S3 阶段门；NFR-006、NFR-007、NFR-016、NFR-029、NFR-037。
**阶段：** S3 Gate
**依赖：** Story 5.1–Story 5.7、Story 4.8。
**Blocker：** 精确指标目录、OQ-06/五平台沙箱证据、有效 S2 Go、真实策略任务与全部 SM 证据缺一不可；接口、编译成功、demo 或模型自评不能替代语义/市场规则验收。
**架构约束：** AR-AD-02、AR-AD-12–AR-AD-14、AR-AD-18–AR-AD-20、AR-AD-23、AR-AD-28、AR-AD-31、AR-BLK-02、AR-GATE-01、AR-CON-01。
**UX 约束：** UX-DR-005、UX-DR-008–UX-DR-010、UX-DR-012–UX-DR-017、UX-DR-026–UX-DR-035、UX-DR-044–UX-DR-047、UX-DR-052。

**Acceptance Criteria:**

#### AC 1：核验完整策略 evidence bundle

**Given** S3 候选构建与真实任务集
**When** Gate evaluator 收集证据
**Then** 包含目录、编辑/API、编译、沙箱、信号、契约、运行清单、执行规则、报告、偏差、样本外、敏感性、比较和恢复
**And** 每项绑定 exact source/build/toolchain/WIT/snapshot/assumption digests
**And** 任一承重证据缺失、过期或漂移时 blocked。

#### AC 2：运行策略语义和市场陷阱基准

**Given** 冻结策略、信号、持仓、市场规则和多步工具 corpus
**When** 用户与 Agent 分别执行端到端验证
**Then** 结果匹配确定性 oracle，偏差陷阱按预期阻止或警告
**And** Agent 必须沿 Story 4.8 的完整工作流调用真实工具
**And** 编译成功、收益为正或模型解释流畅均不足以通过。

#### AC 3：复验五平台沙箱与复现性

**Given** exact Release Profile 候选
**When** 运行固定合规套件和相同 manifest 复跑
**Then** 每个平台隔离攻击成功率为 0且确定性结果数值等价
**And** 环境、用例、资源档案和结果随 Gate 保存
**And** 任一平台失败只可收窄支持范围或 Stop，不得降级沙箱。

#### AC 4：生成不可变 Gate 决定

**Given** 所有证据已评估
**When** 保存 S3GateDecision
**Then** 逐项 pass/fail/blocked 与 Go/Stop/blocked 绑定 Capability/Release Manifest 和 source digests
**And** Gate、审计和能力注册原子一致
**And** 新证据产生新决定，旧运行及报告不被覆盖。

#### AC 5：不提前授权 S4+

**Given** S3 Gate 为 Go
**When** 构建下一阶段计划
**Then** 只满足 S4 前置，不注册提醒、Webhook、模拟组合、订单或扩展
**And** 策略信号仍只是不可变研究工件，不能产生通知或组合副作用
**And** 后续入口在 Capability Manifest Go 前不存在。

## Epic 6: 把研究转成提醒与模拟组合闭环

研究用户可以把价格、指标、筛选或策略信号转成有版本、有效期和证据的提醒，并在不连接券商的模拟组合中管理现金、模拟订单、成交、持仓和绩效；触发事实、通知投递与 Agent 逐单确认互不混淆。

### Story 6.1: 创建并版本化提醒生命周期

As a TickDeck 研究用户,
I want 创建、测试、暂停、恢复、编辑和删除提醒,
So that 价格、指标、筛选或策略条件只在明确范围和有效期内生效。

**对应需求：** FR-025、FR-026、FR-073 的提醒持久化；CAP-4；NFR-009、NFR-010、NFR-012、NFR-017、NFR-026。
**阶段：** S4
**依赖：** Story 5.8 的有效 S3 Go、Story 3.7、Story 5.4。
**Blocker：** 只可使用当前已注册的价格、内置/沙箱指标、筛选与策略信号；能力、数据许可或信号版本未知时不得激活提醒。
**架构约束：** AR-AD-02–AR-AD-04、AR-AD-07、AR-AD-10、AR-AD-13、AR-AD-26、AR-AD-28、AR-AD-31；提醒 definition 是版本化 aggregate，触发/投递另行持久化。
**UX 约束：** UX-DR-005、UX-DR-008–UX-DR-009、UX-DR-018–UX-DR-023、UX-DR-026–UX-DR-032、UX-DR-045、UX-DR-046、UX-DR-052。

**Acceptance Criteria:**

#### AC 1：创建类型化提醒定义

**Given** 用户从工作台、筛选器或策略信号创建提醒
**When** 配置条件、标的范围、频率和有效期
**Then** 控制面校验字段、单位、MarketDataSnapshotRef、source capability 与 DataUsePolicy
**And** 保存稳定 alert ID、definition version、计算版本和生效时间
**And** 关键缺口、未知许可或不支持信号阻止启用。

#### AC 2：管理完整生命周期

**Given** 已保存提醒
**When** 查看、暂停、恢复、编辑或删除
**Then** 所有 mutation 使用幂等键、expected version 和审计
**And** 编辑生成新版本并明确后续生效时间，既有触发事实不被改写
**And** 删除说明历史保留与后续影响。

#### AC 3：提供无副作用测试

**Given** 用户请求测试提醒
**When** evaluator 使用显式选择的冻结 fixture/snapshot
**Then** 返回会否触发、逐项条件、数据状态和计算版本
**And** 结果标记为 test，不创建真实 TriggerEvidence 或发送通知
**And** 测试绝不创建模拟订单。

#### AC 4：显式处理暂停、过期与能力漂移

**Given** 提醒 paused、expired、数据/脚本版本失效或许可撤回
**When** 调度器准备评估
**Then** 不执行条件并记录稳定状态与原因
**And** 恢复前重新校验精确版本、policy 和状态
**And** 不静默换源、换脚本或延长有效期。

#### AC 5：通过并发与恢复测试

**Given** 并发编辑、重复提交、服务重启、过期竞态和失效 signal fixtures
**When** 提醒生命周期 corpus 运行
**Then** 每个版本只有一个权威状态且旧版本不能覆盖新版本
**And** 重启后调度状态和生效时间确定恢复
**And** UI 与审计显示相同版本、状态和原因。

### Story 6.2: 生成不可重复的提醒触发证据

As a TickDeck 研究用户,
I want 每次提醒触发都保存独立可核查的条件事实,
So that 通知重试或后续数据变化不会重算、覆盖既有触发。

**对应需求：** FR-028；CAP-4；NFR-007–NFR-010、NFR-012、NFR-017、NFR-029、NFR-036。
**阶段：** S4
**依赖：** Story 6.1、Story 2.2、Story 3.2。
**Blocker：** 提醒 definition、计算版本、数据 snapshot 或适用 policy 不完整时不得产生触发；外部通知渠道是否可用不影响触发事实本身。
**架构约束：** AR-AD-03、AR-AD-04、AR-AD-07、AR-AD-10、AR-AD-19、AR-AD-26、AR-AD-28、AR-AD-31；TriggerIdentity 唯一化同一业务事实。
**UX 约束：** UX-DR-008–UX-DR-009、UX-DR-018–UX-DR-020、UX-DR-023、UX-DR-027–UX-DR-030、UX-DR-042、UX-DR-045。

**Acceptance Criteria:**

#### AC 1：冻结触发计算输入

**Given** 一个 active alert 到达合法评估时点
**When** evaluator 创建 TriggerContext
**Then** 绑定 definition/version、范围、时间、MarketDataSnapshotRef、计算版本、policy 和 workspace generation
**And** 使用市场日历与 AD-31 decimal 规则
**And** mutable latest 或浏览器时钟不能成为触发输入。

#### AC 2：确定性计算条件事实

**Given** TriggerContext 完整
**When** 计算价格、指标、筛选或策略条件
**Then** 保存每项输入、运算、true/false/unknown、结果和影响
**And** unknown 或禁止数据不得转为 true
**And** 模型不参与触发判定。

#### AC 3：唯一提交 TriggerEvidence

**Given** 同一 alert/version、业务时点和 snapshot 被重复调度
**When** 控制面提交触发结果
**Then** TriggerIdentity 与事务幂等确保至多一个权威 evidence
**And** evidence 记录条件、数据时间、计算版本和结果
**And** audit/outbox 与触发记录原子一致。

#### AC 4：与通知状态彻底分离

**Given** TriggerEvidence 已提交
**When** 通知 queued、sent、failed 或 retrying
**Then** 只追加 delivery attempt，不重算或覆盖触发事实
**And** UI 分栏显示条件触发与投递状态
**And** TriggerEvidence 本身不能提交模拟订单。

#### AC 5：通过重复调度与修订测试

**Given** 重复 tick、崩溃、旧 Worker、数据修订、通知失败和策略信号重复 fixtures
**When** 触发 corpus 运行
**Then** 同一业务事实 evidence 数量为 1
**And** 新数据修订只可形成新 TriggerIdentity/版本化事实
**And** 已有 evidence digest 和时间不会被投递重试改变。

### Story 6.3: 投递产品内通知与受控 Webhook

As a TickDeck 研究用户,
I want 在产品内收到持久通知，并可由部署者配置 Webhook,
So that 投递失败可诊断且不会丢失原触发证据。

**对应需求：** FR-027；CAP-4；NFR-008、NFR-009、NFR-013–NFR-015、NFR-017、NFR-020、NFR-034、NFR-036。
**阶段：** S4
**依赖：** Story 6.2、Story 2.6、Story 2.7。
**Blocker：** 精确官方通知渠道、版本、目的端和许可须按 AR-BLK-08 登记；v1 至少实现产品内通知和部署者配置的 Webhook，不得自行增加其他渠道。OQ-04 法律文本须在公开 beta 前按实际路径核对。
**架构约束：** AR-AD-04、AR-AD-07–AR-AD-09、AR-AD-13、AR-AD-19、AR-AD-26、AR-AD-29、AR-BLK-07、AR-BLK-08；外部拨号前消费单次 ExecutionAuthorization。
**UX 约束：** UX-DR-014–UX-DR-019、UX-DR-023–UX-DR-024、UX-DR-026–UX-DR-031、UX-DR-040、UX-DR-042–UX-DR-045、UX-DR-052。

**Acceptance Criteria:**

#### AC 1：写入持久 Notification Center

**Given** TriggerEvidence 已提交
**When** 创建产品内通知
**Then** 以稳定 notification ID 保存 unread/read、action-required 或 delivery-failed 状态与 evidence 深链
**And** 相同 run/trigger 更新可合并但重要状态转换不丢失
**And** Toast 仅作不抢焦点提示，不能成为唯一记录。

#### AC 2：配置受控 Webhook

**Given** 部署者创建 Webhook destination
**When** 校验 URL、SecretRef、允许数据类别和预算
**Then** 配置通过 Egress allowlist、SSRF/DNS rebinding、redirect 和 credential-scope 检查
**And** 启用新外部通知属于 R2 且绑定精确目的端与 payload class
**And** 秘密不进入 URL、日志、浏览器或通知内容。

#### AC 3：在拨号前重新授权

**Given** delivery attempt 即将调用 Webhook
**When** Worker 请求 ExecutionAuthorization
**Then** 控制面按最新 policy/risk/R1/recipient/secret/budget epoch 原子签发并消费单次授权
**And** 目的地址解析与每次重定向重新检查
**And** 撤销或状态漂移阻止新拨号。

#### AC 4：受控重试且不覆盖触发

**Given** Webhook timeout、拒绝、5xx 或结果不确定
**When** delivery state machine 处理
**Then** 按明确 retry policy 追加 attempt、耗时、状态和稳定错误
**And** 不确定在途效果进入 UNCERTAIN/reconcile，不盲重发
**And** 原 TriggerEvidence 保持不变。

#### AC 5：通过通知安全与可访问测试

**Given** 私网/元数据地址、DNS rebinding、危险重定向、跨主机凭据、失败重试、深链和读屏 fixtures
**When** 通知 corpus 运行
**Then** 出站绕过成功率为 0，重复投递服从幂等/不确定语义
**And** Notification Center 支持筛选、键盘、焦点回返和状态播报
**And** 提醒或通知路径不存在订单提交能力。

### Story 6.4: 管理数据资产生命周期与许可撤回

As a TickDeck 部署者,
I want 清点并清理原始、派生、索引、研究和备份数据,
So that 授权到期或撤销后受限数据不会继续被使用或导出。

**对应需求：** FR-087；CAP-1；NFR-008、NFR-010–NFR-015、NFR-017、NFR-026、NFR-032。
**阶段：** S4
**依赖：** Story 3.2、Story 2.5、Story 2.12。
**Blocker：** 清理规则必须来自实际连接器许可和部署范围；未知 retention、派生权利或备份处理默认拒绝，不能自行假设可永久保存。
**架构约束：** AR-AD-07、AR-AD-10、AR-AD-11、AR-AD-19、AR-AD-25、AR-AD-28；lineage 与 usage ledger 决定清理/隔离影响，审计不保留受限 payload。
**UX 约束：** UX-DR-008–UX-DR-009、UX-DR-014–UX-DR-017、UX-DR-023–UX-DR-024、UX-DR-026–UX-DR-027、UX-DR-045、UX-DR-048。

**Acceptance Criteria:**

#### AC 1：建立数据资产清单

**Given** 数据进入缓存、派生、索引、研究工件或备份
**When** Artifact/Data Lifecycle Service 记录 lineage
**Then** 清单包含资产 ID/digest、类别、来源许可、用途、到期、派生关系、位置状态和引用
**And** 不复制秘密或受限 payload 到审计
**And** 未登记资产不能被后续工具使用。

#### AC 2：计算到期与撤回影响

**Given** 授权到期、撤销或用途改变
**When** policy epoch 更新
**Then** 遍历 lineage 计算原始、派生、索引、报告和备份影响
**And** 未知/冲突按最严格限制处理
**And** 生成可预览的清理或不可复现计划。

#### AC 3：原子执行清理或隔离

**Given** 计划通过适用风险确认
**When** 执行 cleanup operation
**Then** 先阻止新访问，再将工件标 QUARANTINED/DELETED 或删除允许范围内 blob
**And** 领域引用同步标不可复现而不留下悬空“可用”状态
**And** 中断后可确定恢复且不产生半清理权威。

#### AC 4：保留不含受限数据的审计证据

**Given** 清理完成或失败
**When** 查看 lifecycle audit
**Then** 显示规则版本、资产 digest、动作、数量、时间、结果和失败原因
**And** 不包含被清理内容、秘密或可重建受限 payload 的值
**And** 用户可从受影响研究产物看到 not-reproducible 原因。

#### AC 5：通过撤权、备份和故障注入

**Given** 授权过期、派生链、索引、备份、并发读取和中途崩溃 fixtures
**When** 生命周期 corpus 运行
**Then** 到期后受限访问、导出、模型发送与通知成功率为 0
**And** 清理后健康/诊断与实际资产状态一致
**And** 合法保留的最小审计不泄露受限数据。

### Story 6.5: 管理模拟组合与多币种现金

As a TickDeck 研究用户,
I want 创建多个模拟组合并管理人民币、港币现金与估值口径,
So that 能在不连接券商的前提下记录研究假设。

**对应需求：** FR-044、FR-045、FR-073 的模拟组合持久化；CAP-6；NFR-007–NFR-010、NFR-012、NFR-017、NFR-029。
**阶段：** S4
**依赖：** Story 5.8 的有效 S3 Go、Story 3.2、Story 2.7。
**Blocker：** 仅为模拟组合，不得连接券商、导入实盘权限或承诺现实成交；FX、费用和估值口径缺失时必须明确 unknown 或阻止。
**架构约束：** AR-AD-03–AR-AD-05、AR-AD-10、AR-AD-13、AR-AD-19、AR-AD-23、AR-AD-28、AR-AD-31；portfolio 是版本化 aggregate，现金使用 CurrencyAmount。
**UX 约束：** UX-DR-003、UX-DR-014–UX-DR-017、UX-DR-020、UX-DR-023、UX-DR-026–UX-DR-035、UX-DR-045–UX-DR-046、UX-DR-052。

**Acceptance Criteria:**

#### AC 1：管理多个模拟组合

**Given** 用户进入模拟组合表面
**When** 创建、重命名、归档、复制或重置组合
**Then** 每个组合具有稳定 ID、版本、基准币种、状态和 creation provenance
**And** mutation 使用 expected version、幂等键和审计
**And** 归档/重置说明历史影响且不删除审计。

#### AC 2：记录多币种现金

**Given** 组合使用人民币和港币
**When** 记录初始现金、调整、费用或换汇假设
**Then** 每笔账目保存 CurrencyAmount、类型、时间、原因和版本
**And** 权威计算使用 AD-31 decimal/quantization
**And** Agent 修改持久现金至少服从适用 R1/R2，不能静默执行。

#### AC 3：披露 FX 与总资产口径

**Given** 用户查看总资产估值
**When** 把多币种现金换算为基准币种
**Then** 显示 FX 来源、时间、方向、费用、snapshot 与 stale/unknown 状态
**And** 不可用时不补值并标明无法给出完整总资产
**And** 新汇率只影响新估值版本，不改写历史账目。

#### AC 4：保持组合持久化一致

**Given** 保存中断、重复命令、并发标签页或重启
**When** 恢复 portfolio aggregate
**Then** 组合、现金账目、版本和审计一致且无半写
**And** 浏览器缓存不能成为余额真值
**And** 旧 state version 的修改被拒绝并显示差异。

#### AC 5：明确模拟边界

**Given** 用户或 Agent 查看组合
**When** 显示状态与操作
**Then** 始终标注模拟、无券商连接和无法模拟的现实因素
**And** 不提供 API key、实盘账户、自动交易或无人值守入口
**And** R3 请求被 Risk Gate 永久阻止。

### Story 6.6: 提交模拟订单并确定性撮合

As a TickDeck 研究用户,
I want 提交、变更或撤销模拟订单并查看真实市场约束下的撮合历史,
So that 模拟结果不会冒充可执行实盘成交。

**对应需求：** FR-046、FR-047、FR-048；CAP-6；NFR-007–NFR-010、NFR-012、NFR-017、NFR-029、NFR-036。
**阶段：** S4
**依赖：** Story 6.5、Story 5.5、Story 2.2、Story 4.4。
**Blocker：** 模拟撮合所需数据粒度、市场规则或 ExecutionAssumption unknown 时必须警告或阻止；每笔 Agent 模拟订单必须取得新的精确 R2，不能批量预授权。
**架构约束：** AR-AD-03–AR-AD-05、AR-AD-10、AR-AD-19、AR-AD-23、AR-AD-28、AR-AD-29、AR-AD-31；订单/outbox/audit 原子一致且撮合为确定性代码。
**UX 约束：** UX-DR-014–UX-DR-017、UX-DR-020–UX-DR-023、UX-DR-026–UX-DR-035、UX-DR-040、UX-DR-042、UX-DR-045–UX-DR-047。

**Acceptance Criteria:**

#### AC 1：校验模拟订单意图

**Given** 用户提交市价/限价单或请求变更/撤单
**When** 控制面校验命令
**Then** 绑定 portfolio/version、ListingId、side、type、quantity/price、snapshot 和 ExecutionAssumption
**And** 检查现金、持仓、交易时段、T+1、最小单位和当前 capability
**And** 缺失或无效参数在写入前拒绝。

#### AC 2：逐笔确认 Agent 订单

**Given** 订单意图来源为 Agent
**When** Risk Engine 计算风险
**Then** 每一笔创建独立 R2 pending，显示组合状态、参数、费用/现金/持仓影响和 single-use 绑定
**And** 参数、行情、组合版本或策略变化使 Grant 失效
**And** 不存在“以后都允许”、批量或无人值守确认。

#### AC 3：确定性执行模拟撮合

**Given** 订单获准且到达可撮合市场时点
**When** matching engine 处理
**Then** 遵循数据粒度、市场时间、停牌、涨跌停、T+1、最小单位、费用和成交模型
**And** 产生确认、拒绝、部分成交、成交或撤单状态
**And** 披露延迟、盘口深度及其他无法模拟因素。

#### AC 4：保存不可混淆历史

**Given** 订单经历提交、重试、变更、成交或撤销
**When** 查看历史
**Then** 每个 order、revision、fill、fee、rejection 和 retry 具有稳定 ID、顺序、版本与来源
**And** operation/outbox/audit 在故障后最终一致
**And** 不确定外部效果不适用于纯本地撮合，未知状态须由权威事务恢复。

#### AC 5：通过规则与重复执行 corpus

**Given** A/港股边界、部分成交、重复提交、过期 Grant、旧 Worker、取消竞态和崩溃 fixtures
**When** 订单套件运行
**Then** 撮合结果与 oracle 数值等价，重复 Agent 订单为 0
**And** 无效 R2 或旧 portfolio version 成功率为 0
**And** UI、ledger、portfolio 与审计最终一致。

### Story 6.7: 核算持仓、绩效与公司行动

As a TickDeck 研究用户,
I want 确定地查看持仓、成本、盈亏、现金、收益、回撤和公司行动影响,
So that 模拟组合的每个数字都能追溯到订单、数据和口径。

**对应需求：** FR-049、FR-050；CAP-6；NFR-007–NFR-010、NFR-012、NFR-017、NFR-029。
**阶段：** S4
**依赖：** Story 6.5、Story 6.6、Story 3.8。
**Blocker：** 公司行动数据或 FX/市场口径不可得时必须标 unknown/not-reproducible 或阻止完整绩效，不得模型补写或静默忽略。
**架构约束：** AR-AD-03、AR-AD-10、AR-AD-13、AR-AD-23、AR-AD-28、AR-AD-31；portfolio ledger append-only 派生权威状态，图表/表格只读投影。
**UX 约束：** UX-DR-003、UX-DR-008–UX-DR-009、UX-DR-017、UX-DR-020、UX-DR-023、UX-DR-026–UX-DR-030、UX-DR-035、UX-DR-045–UX-DR-047。

**Acceptance Criteria:**

#### AC 1：从账本派生持仓与成本

**Given** 组合现金、订单、成交和费用账目
**When** portfolio engine 重建状态
**Then** 确定性计算数量、成本基础、已实现/未实现盈亏和现金
**And** 每个值可追溯到 ledger sequence、snapshot 和 DecimalEvidence
**And** 浏览器排序或格式化不改变权威值。

#### AC 2：计算收益、回撤与币种影响

**Given** 版本化估值 snapshot 和 FX assumption
**When** 生成 portfolio performance
**Then** 计算总资产、期间收益、回撤、费用与币种贡献
**And** 显示公式、时间、币种、FX 来源和 stale/unknown 影响
**And** 不完整输入不产生伪精确总值。

#### AC 3：应用公司行动

**Given** 当前数据支持分红、拆并股、送转或其他行动
**When** 行动在组合时间线上生效
**Then** 以独立可审计 ledger event 调整现金、数量和成本基础
**And** 绑定 CorporateActionBasis、来源和版本
**And** 修订产生 reversal/correction 事件，不修改历史记录。

#### AC 4：提供可核查组合报告

**Given** 用户查看组合
**When** 打开绩效、持仓或现金表
**Then** 可从任一数字深链到订单、成交、费用、公司行动、行情与运行假设
**And** 表格支持键盘、字段状态和非虚拟化等价路径
**And** 始终披露模拟限制和不可复现条件。

#### AC 5：通过重建与修订 oracle

**Given** 多币种、部分成交、费用、公司行动、修订、缺失 FX 和重启 corpus
**When** 从空状态重放 ledger
**Then** 持仓、现金、成本、收益和回撤与冻结 oracle 数值等价
**And** 重放多次结果 digest 相同
**And** unknown 输入不会被零值或模型解释掩盖。

### Story 6.8: 经逐次确认把策略信号接入模拟组合

As a TickDeck 策略研究用户,
I want 启用或停用已保存策略信号并逐笔确认 Agent 模拟订单,
So that 可以验证信号到组合的链路而不形成无人值守交易。

**对应需求：** FR-051；CAP-6、CAP-7；NFR-009、NFR-012、NFR-017、NFR-029、NFR-035、NFR-036。
**阶段：** S4
**依赖：** Story 5.4、Story 5.8、Story 6.5–Story 6.7、Story 4.4。
**Blocker：** 只有已保存、S3 合格且依赖可复现的策略可接入；启用、停用和每一笔 Agent 模拟订单均须当前状态的 R2，不得授权自动执行或连接券商。
**架构约束：** AR-AD-02–AR-AD-05、AR-AD-10、AR-AD-14、AR-AD-19、AR-AD-23、AR-AD-28、AR-AD-29、AR-AD-31；策略只提交类型化 signal/intention，不能访问组合存储。
**UX 约束：** UX-DR-014–UX-DR-017、UX-DR-021、UX-DR-028–UX-DR-035、UX-DR-040、UX-DR-042、UX-DR-045–UX-DR-047。

**Acceptance Criteria:**

#### AC 1：检查策略接入资格

**Given** 用户选择已保存策略和模拟组合
**When** 准备接入
**Then** 显示 script/run/manifest、snapshot、ExecutionAssumption、偏差、复现状态和 portfolio version
**And** 不合格、过期、不可复现或假设冲突时阻止
**And** 不自动调整策略或组合口径。

#### AC 2：逐次确认启用或停用

**Given** 接入配置完整
**When** 用户启用或停用
**Then** Risk Gate 生成绑定策略、参数、组合、状态和 policy 的 single-use R2
**And** 任何变化使 pending Grant 失效
**And** 成功后产生版本化 binding 与审计。

#### AC 3：把信号转换为订单意图而非订单

**Given** active binding 产生新信号
**When** Agent/adapter 处理
**Then** 生成包含来源、时间、目标、建议数量和假设的 draft order intention
**And** 不写入订单表、不占用现金且不自动发送
**And** 用户拒绝或忽略不改变策略运行事实。

#### AC 4：每笔模拟订单重新 R2

**Given** 用户选择执行某个 draft intention
**When** 转为模拟订单命令
**Then** 按 Story 6.6 重新计算当前数据、portfolio、费用和风险并要求独立 R2
**And** 旧信号或旧 Grant 不能复用
**And** 首次合法消费至多创建一个模拟订单。

#### AC 5：阻止自动与实盘路径

**Given** 请求批量确认、无人值守、券商连接、实盘下单或脚本直写组合
**When** 服务端准入
**Then** 全部按 R3/范围排除拒绝且无覆盖入口
**And** UI 说明安全替代为逐笔模拟确认
**And** 攻击与重复执行 corpus 中绕过成功率为 0。

### Story 6.9: 生成 S4 提醒与模拟组合 Gate 决定

As a TickDeck 产品维护者,
I want 以触发、通知、生命周期和模拟撮合证据决定 S4 Go、Stop 或 blocked,
So that 只有安全且确定的研究闭环才可进入扩展与发布阶段。

**对应需求：** FR-025–FR-028、FR-044–FR-051、FR-087 的 S4 Gate 汇总；CAP-4、CAP-6、CAP-11；SM-06、SM-12、SM-13、SM-14、SM-16 及 S4 阶段门；NFR-009、NFR-032、NFR-034–NFR-036。
**阶段：** S4 Gate
**依赖：** Story 6.1–Story 6.8。
**Blocker：** 精确通知路径、OQ-04 适用法律文本、真实触发/投递证据、逐单 R2、市场规则 oracle 和数据生命周期结果缺一不可；无效或未决时不得 Go。
**架构约束：** AR-AD-02、AR-AD-05、AR-AD-07–AR-AD-11、AR-AD-18–AR-AD-20、AR-AD-23、AR-AD-26、AR-AD-29、AR-AD-31、AR-BLK-07、AR-BLK-08、AR-GATE-01。
**UX 约束：** UX-DR-005、UX-DR-008–UX-DR-009、UX-DR-014–UX-DR-020、UX-DR-026–UX-DR-035、UX-DR-044–UX-DR-047、UX-DR-052。

**Acceptance Criteria:**

#### AC 1：核验提醒与通知 evidence bundle

**Given** S4 候选构建
**When** Gate evaluator 收集提醒证据
**Then** 包含定义/版本、TriggerIdentity、条件事实、产品内通知、Webhook 授权、重试/UNCERTAIN 和安全测试
**And** 触发与投递状态分离且重复触发事实为 0
**And** 精确通知渠道/目的端/法律文本未登记时 blocked。

#### AC 2：核验模拟组合 evidence bundle

**Given** 冻结 A/港股组合任务与 oracle
**When** 执行现金、订单、撮合、历史、持仓、绩效、公司行动和策略接入旅程
**Then** 数值与市场规则 oracle 等价，每笔 Agent 订单有独立 R2
**And** 重试/崩溃下重复模拟订单为 0
**And** 无券商、实盘或无人值守路径存在。

#### AC 3：核验数据撤权与恢复

**Given** 许可到期/撤销和故障注入 corpus
**When** 数据生命周期执行
**Then** 受限访问/出站成功率为 0，受影响产物标不可复现
**And** 最小审计不泄露被清理数据
**And** 健康、通知、组合和工件状态最终一致。

#### AC 4：生成不可变 Gate 决定

**Given** 所有承重证据已评估
**When** 保存 S4GateDecision
**Then** 逐项 pass/fail/blocked 形成 Go、Stop 或 blocked，并绑定 exact manifests/source digests
**And** Gate、Capability Manifest、审计和状态原子一致
**And** 新证据只能生成新版本。

#### AC 5：不提前授权 S5

**Given** S4 Gate 为 Go
**When** 准备 S5 计划
**Then** 不自动注册受信扩展、安装/升级、备份迁移或发布能力
**And** 扩展清单和 release artifacts 仍须各自 blocker、供应链与 Gate 证据
**And** 在线市场、远程安装、公共 API、实盘和范围外资产继续排除。

## Epic 7: 安全开发和治理本地受信扩展

贡献者可以使用 demo/test 路径开发数据连接器、模型适配器、Agent 工具和通知渠道四类受信扩展，部署者可以在本地核验不可变 bundle、权限、来源、hash、SBOM、SecretRef 和目的端，并安全禁用或回滚。

### Story 7.1: 定义四类受信扩展的类型化合同

As a TickDeck 扩展贡献者,
I want 为四类扩展实现稳定、窄化且可测试的 manifest 与接口,
So that 扩展能力、权限和错误不会依赖内部实现细节。

**对应需求：** FR-077、FR-078、FR-083；CAP-10；NFR-013、NFR-024、NFR-026–NFR-028。
**阶段：** S5（受信扩展切片）
**依赖：** Story 6.9 的有效 S4 Go、Story 2.2、Story 2.6。
**Blocker：** 精确官方扩展实例、版本和许可须按 AR-BLK-08 登记；本 Story只定义四类稳定合同，不得自行增加扩展类别或把接口存在视为官方实例已授权。
**架构约束：** AR-AD-02、AR-AD-03、AR-AD-08、AR-AD-09、AR-AD-14、AR-AD-22、AR-AD-27、AR-CON-01；稳定类别仅 data connector、model adapter、Agent tool adapter、notification channel。
**UX 约束：** UX-DR-005、UX-DR-022–UX-DR-026、UX-DR-037–UX-DR-045、UX-DR-049、UX-DR-052；扩展表面只在 S5 Gate 候选中挂载。

**Acceptance Criteria:**

#### AC 1：声明统一扩展 manifest

**Given** 任一四类扩展 bundle
**When** 读取 manifest
**Then** 必须声明稳定 ID、版本、兼容范围、类别、能力、权限、配置 schema、输入输出和统一错误
**And** 声明 SecretRef、destination、数据类别、资源与 sidecar 需求
**And** 未知字段按版本合同处理，缺少承重字段默认拒绝。

#### AC 2：为每类提供窄化类型接口

**Given** manifest 类别确定
**When** 生成/校验接口绑定
**Then** data、model、Agent tool 和 notification 各自只暴露所属端口与稳定英文命名
**And** 接口使用 packages/contracts schema 与 TickDeck Local RPC v1
**And** 不暴露数据库、工件路径、宿主网络、Vault 值或内部未承诺行为。

#### AC 3：明确能力与风险声明

**Given** 扩展声明动作或出站
**When** 构建 capability/risk descriptor
**Then** 工具、对象、数据类别、目的端、成本和最低风险逐项列出
**And** 服务端可提高但扩展不能降低最终风险
**And** 未声明能力不可调用。

#### AC 4：限制公共表面

**Given** v1 extension documentation 与导出类型
**When** 生成发布包
**Then** 只承诺四类合同、manifest、错误、兼容和契约测试
**And** 不宣传内部 HTTP、应用 schema 或 IPC 为公共 REST API
**And** 不包含在线市场、公共脚本社区、远程一键安装或新扩展类别。

#### AC 5：通过四类契约 corpus

**Given** 合法、缺字段、未知权限、错误版本和越类调用 fixtures
**When** contract suite 运行
**Then** 合法 bundle 在声明范围内通过，不合法 bundle fail closed
**And** server、worker、sidecar 与文档类型一致
**And** 结果不依赖扩展实现语言或模型输出。

### Story 7.2: 在受信 sidecar 边界校验外部输入

As a TickDeck 部署者,
I want 第三方扩展只在受监督 sidecar 中运行且所有边界内容被校验,
So that 受信代码的权限风险明确，外部指令不能改变 Agent 行为。

**对应需求：** FR-079；CAP-10；NFR-008、NFR-013、NFR-014、NFR-017、NFR-026、NFR-029。
**阶段：** S5（受信扩展切片）
**依赖：** Story 7.1、Story 2.5–Story 2.7。
**Blocker：** 每个实际扩展的进程、目的端、秘密和权限必须逐项登记；未登记或 manifest 漂移时不能启动 sidecar。
**架构约束：** AR-AD-01、AR-AD-07–AR-AD-09、AR-AD-13、AR-AD-14、AR-AD-22、AR-AD-27、AR-AD-29；SDK 只能在获批 trusted sidecar 中，Worker 通过 broker/Local RPC 调用。
**UX 约束：** UX-DR-014–UX-DR-017、UX-DR-022–UX-DR-024、UX-DR-026–UX-DR-030、UX-DR-042、UX-DR-045、UX-DR-049。

**Acceptance Criteria:**

#### AC 1：受监督启动本地 sidecar

**Given** 已核验 bundle 与 manifest
**When** supervisor 启动扩展
**Then** 进程绑定 workspace generation、bundle hash、角色、权限和 owner-only Local RPC credential
**And** handshake 校验协议、build、manifest 和兼容范围
**And** 失败、退出或版本不匹配时能力 blocked 且不会启动替代实现。

#### AC 2：校验配置、响应与内容

**Given** 配置或外部响应进入边界
**When** broker 解析
**Then** 同时执行结构 schema、大小、类型、内容、数据分类和许可校验
**And** unknown/invalid 内容拒绝或隔离并返回稳定错误
**And** 不把第三方数据直接写入 DB 或 committed artifact。

#### AC 3：抵抗指令性内容

**Given** 新闻、工具结果或 provider 响应包含命令、提示注入或伪系统文本
**When** 进入 Agent 上下文
**Then** 作为不受信 data 标记、最小化并保持来源边界
**And** 不改变 system policy、toolset、risk、DataUse 或 Egress
**And** 安全 corpus 中权限提升成功率为 0。

#### AC 4：按 manifest 限制秘密与出站

**Given** sidecar 请求 SecretRef 或外部拨号
**When** Worker/控制面授权
**Then** 只签发绑定 operation/version/epoch 的短期 secret lease 和单次 ExecutionAuthorization
**And** 目的端、payload、预算和重定向重新校验
**And** 秘密不跨主机转发或进入扩展日志。

#### AC 5：故障隔离与诊断

**Given** sidecar 崩溃、超时、恶意 payload、旧 credential 或不确定外部效果
**When** supervisor 和 broker 恢复
**Then** 主服务与已保存产物保持完整，旧实例结果被 fencing 拒绝
**And** 外部不确定效果进入 UNCERTAIN/reconcile
**And** 健康页显示扩展自身状态、影响能力和脱敏诊断。

### Story 7.3: 提供四类扩展贡献脚手架与演示验证

As a TickDeck 扩展贡献者,
I want 使用无商用密钥的模板、示例和契约测试开发扩展,
So that 可以在本地复现贡献流程并证明合同兼容。

**对应需求：** FR-080；CAP-10；NFR-019、NFR-023、NFR-026–NFR-028。
**阶段：** S5（受信扩展切片）
**依赖：** Story 7.1、Story 7.2、Story 2.8。
**Blocker：** 脚手架只能使用确定性 demo/test model 与本地 fixtures；不得打包第三方真实数据、商用密钥或把 demo 测试解释为生产资格。
**架构约束：** AR-AD-21、AR-AD-22、AR-AD-24、AR-STRUCT-01、AR-CON-01；生成物遵守 monorepo 单向依赖与锁定工具链。
**UX 约束：** UX-DR-023–UX-DR-026、UX-DR-037–UX-DR-045、UX-DR-049；贡献旅程双语并明确 trusted extension 风险。

**Acceptance Criteria:**

#### AC 1：生成四类最小项目

**Given** 贡献者选择一种稳定扩展类别
**When** 运行本地生成模板
**Then** 生成 manifest、类型接口、配置 schema、示例实现、测试和双语 README
**And** lockfile/版本与当前公共合同一致
**And** 不生成远程安装、公共 REST API 或额外类别代码。

#### AC 2：提供确定性演示依赖

**Given** 无真实数据或外部模型/渠道凭据
**When** 运行示例
**Then** 使用固定 demo connector、兼容 test model、fake recipient 和无密钥 fixtures
**And** 所有结果标明 demo/non-current/test-only
**And** 不访问网络或官方服务。

#### AC 3：运行契约与安全测试

**Given** 扩展实现完成
**When** 执行贡献验证
**Then** 覆盖 manifest、schema、错误、兼容、权限、DataUse、Egress、SecretRef、注入与故障场景
**And** 缺失权限、来源或锁定版本时失败
**And** 输出机器可读报告与本地复现命令。

#### AC 4：生成本地不可变 bundle

**Given** 全部测试通过
**When** 构建候选扩展
**Then** 产出规范 archive、manifest digest、source hash、SBOM 和权限清单
**And** 构建不嵌入 secret、真实受限 payload 或环境绝对路径
**And** 相同输入产生可核对的 bundle identity。

#### AC 5：闭合 UJ-4 贡献旅程

**Given** 新贡献者仅有仓库与支持工具链
**When** 按双语指南完成生成、实现、测试和 bundle
**Then** 四类示例各可无商用密钥完成
**And** 失败说明发生、影响、系统动作和修复步骤
**And** demo 通过不把扩展标为 official/production-authorized。

### Story 7.4: 强制区分受限脚本与受信扩展

As a TickDeck 部署者和贡献者,
I want 产品、代码和文档清楚区分沙箱脚本与服务端受信扩展,
So that 不会误以为两者具有相同隔离或权限风险。

**对应需求：** FR-081；CAP-5、CAP-10；NFR-013、NFR-016、NFR-023、NFR-026。
**阶段：** S5（受信扩展切片）
**依赖：** Story 7.1–Story 7.3、Story 5.3。
**Blocker：** 无新增开放问题；任何实现若混用 WIT sandbox 与 trusted sidecar 入口必须视为合同失败，而不是文档问题。
**架构约束：** AR-AD-12、AR-AD-22、AR-AD-27、AR-GATE-01；脚本运行在一次性 Wasmtime，扩展是部署者主动安装的本地主机受信代码。
**UX 约束：** UX-DR-003、UX-DR-014、UX-DR-022–UX-DR-024、UX-DR-037–UX-DR-045、UX-DR-047、UX-DR-049。

**Acceptance Criteria:**

#### AC 1：使用不同合同与运行入口

**Given** script artifact 与 extension bundle
**When** 系统注册能力
**Then** script 只能进入 sandbox-host/WIT，extension 只能进入 supervisor/trusted sidecar/broker
**And** 两者 manifest、权限、错误和健康类型不可互换
**And** 脚本不能声明 extension 权限，扩展不能冒充沙箱隔离。

#### AC 2：在安装和编辑表面披露风险

**Given** 用户查看脚本或扩展
**When** 显示详情
**Then** 用文字、图标和风险说明分别标记受限运行与部署者信任代码
**And** 扩展显示主机权限、秘密、目的端与供应链责任
**And** 任何语义不只靠颜色或“安全”模糊词。

#### AC 3：阻止跨边界导入与调用

**Given** 脚本尝试加载扩展模块，或扩展请求脚本宿主对象
**When** 编译/注册/运行
**Then** 在最早边界拒绝并返回稳定错误
**And** 不提供兼容桥、fallback 或管理员绕过
**And** 审计记录请求、边界和影响但不含源码秘密。

#### AC 4：发布双语安全文档

**Given** v1 扩展与策略文档
**When** 生成用户/贡献指南
**Then** 解释安装责任、隔离强度、权限、SecretRef、更新与撤回差异
**And** 不声称 trusted extension 被 sandbox 或抵御主机 root
**And** 提供安全替代与最小权限建议。

#### AC 5：通过错误归类测试

**Given** 混淆标签、越界 manifest、恶意 bundle 和无障碍 fixtures
**When** 产品与文档验收
**Then** 运行时阻止所有越界且 UI 能正确说明风险
**And** 用户在双语/200% 缩放下可区分两类
**And** 测试不依赖读者自行推断。

### Story 7.5: 版本化、废弃并限制公共扩展表面

As a TickDeck 扩展贡献者,
I want 公共合同按语义化版本演进并有明确废弃窗口,
So that 可以在一个当前主版本内安全迁移而不依赖未承诺接口。

**对应需求：** FR-082、FR-083；CAP-10；NFR-024、NFR-026–NFR-028。
**阶段：** S5（受信扩展切片）
**依赖：** Story 7.1、Story 7.3。
**Blocker：** v1 后变更必须基于实际已发布公共合同；本 Story 不预设未来版本内容，也不承诺永久兼容或多个主版本并行维护。
**架构约束：** AR-AD-03、AR-AD-18、AR-AD-21、AR-AD-22、AR-CON-01；只维护一个当前主版本，Release Manifest 固定兼容矩阵。
**UX 约束：** UX-DR-022–UX-DR-024、UX-DR-037–UX-DR-045、UX-DR-049；废弃警告说明影响、期限和迁移路径。

**Acceptance Criteria:**

#### AC 1：执行语义化版本规则

**Given** 公共 manifest、schema、类型或错误发生变更
**When** 运行 compatibility classifier
**Then** 按增量兼容、废弃或破坏性变更确定版本影响
**And** 优先采用向后兼容增量
**And** 破坏性变更不能伪装为 patch/minor。

#### AC 2：提供至少一个次版本废弃窗口

**Given** 当前能力计划废弃
**When** 发布首个 warning 版本
**Then** manifest、运行诊断和双语迁移文档包含替代、截止版本和影响
**And** 至少跨一个次版本继续接受旧能力并明确警告
**And** 到期后的拒绝使用稳定错误而非静默忽略。

#### AC 3：只维护当前主版本

**Given** 新主版本实际获准并发布
**When** 构建支持矩阵
**Then** 只承诺一个当前主版本，旧主版本按公开窗口退出
**And** 不在代码中建立未批准的多主版本长期分支
**And** 安装/升级基于 exact compatibility range。

#### AC 4：阻止内部接口成为公共承诺

**Given** 生成 SDK、文档和示例
**When** 扫描公共 exports
**Then** 只包含批准的四类合同及测试
**And** 内部 HTTP/IPC/schema、应用 routes 和可观察实现不对外承诺
**And** 不出现公共 REST API、市场、社区或远程安装说明。

#### AC 5：同步发布合同与测试

**Given** 任一公共合同变更
**When** 构建发行物
**Then** 实现、类型、迁移说明和契约测试在同一 release set
**And** 缺少任一项时 Release Gate 拒绝
**And** examples 对当前兼容范围全部通过。

### Story 7.6: 治理本地扩展安装、升级、撤回与回滚

As a TickDeck 部署者,
I want 核验并本地安装不可变扩展 bundle，查看权限差异并可禁用或回滚,
So that 供应链和秘密访问变化不会静默进入工作区。

**对应需求：** FR-097；CAP-10；NFR-013、NFR-017、NFR-018、NFR-039。
**阶段：** S5（受信扩展切片）
**依赖：** Story 7.1–Story 7.5、Story 2.4、Story 2.7。
**Blocker：** 只能处理部署者已放置到本地 staging 的 bundle；v1 不提供在线市场、远程下载或一键安装。官方扩展必须有实际 code-owner 审查证据，不能自行标记 official。
**架构约束：** AR-AD-02、AR-AD-05、AR-AD-10、AR-AD-18、AR-AD-19、AR-AD-21、AR-AD-22、AR-AD-30；来源/hash/权限变化均按重新授权。
**UX 约束：** UX-DR-014–UX-DR-017、UX-DR-021–UX-DR-024、UX-DR-026–UX-DR-032、UX-DR-040、UX-DR-045、UX-DR-049。

**Acceptance Criteria:**

#### AC 1：核验本地不可变 bundle

**Given** 部署者选择本地 staged bundle
**When** 安装前检查
**Then** 验证来源、archive/hash、锁定版本、签名/审查（如适用）、SBOM、兼容和权限清单
**And** 检查 SecretRef 与 destination 声明
**And** 任一缺失、篡改或不兼容时默认拒绝。

#### AC 2：呈现并确认权限差异

**Given** 首次安装或升级候选
**When** Risk Gate 展示 diff
**Then** 明示新增/移除能力、主机权限、数据类别、秘密、目的端和供应链变化
**And** 来源、hash 或权限变化要求新的精确授权
**And** 无快捷键、批量信任或“以后都允许”绕过。

#### AC 3：原子安装并注册能力

**Given** bundle 合格且授权有效
**When** UpgradeCoordinator 安装
**Then** 先 staged/verify，再原子切换本地版本并更新 extension/Capability Manifest
**And** sidecar 只以新 hash/permission epoch 启动
**And** 失败保留旧可运行版本且不形成混合状态。

#### AC 4：支持禁用、撤回和回滚

**Given** 扩展故障、漏洞、许可撤回或升级失败
**When** 部署者禁用、撤回或选择本地已验证旧版本
**Then** 阻止新调用、撤销 secret lease/authorization 并停止 sidecar
**And** 在途效果按 reconcile/UNCERTAIN 处理，已保存产物保持可检查
**And** 回滚只到兼容且已核验 bundle，不远程获取内容。

#### AC 5：通过供应链与恢复攻击测试

**Given** hash 篡改、缺 SBOM、权限升级、旧签名、秘密扩大、崩溃和回滚 fixtures
**When** 安装生命周期 corpus 运行
**Then** 不合格安装成功率为 0，混合版本状态为 0
**And** 官方候选无 code-owner evidence 时拒绝
**And** 审计可重建来源、diff、授权、切换、禁用和回滚。

### Story 7.7: 生成 S5 受信扩展治理 Gate 决定

As a TickDeck 产品维护者,
I want 用四类贡献、边界和供应链证据决定受信扩展切片 Go、Stop 或 blocked,
So that 未核验 bundle 或扩大公共表面的实现不能进入 v1 发布候选。

**对应需求：** FR-077–FR-083、FR-097 的受信扩展 Gate 汇总；CAP-10、CAP-11；SM-15；NFR-018、NFR-026–NFR-028、NFR-039。
**阶段：** S5（受信扩展切片 Gate）
**依赖：** Story 7.1–Story 7.6。
**Blocker：** 精确官方扩展列表、许可、版本、来源、code-owner 审查与真实 bundle 证据须全部登记；接口、模板、demo 或第三方自报不能替代。
**架构约束：** AR-AD-02、AR-AD-18–AR-AD-22、AR-BLK-08、AR-GATE-01、AR-CON-01；Gate 绑定 exact public-contract/bundle/source digests。
**UX 约束：** UX-DR-005、UX-DR-014–UX-DR-017、UX-DR-022–UX-DR-026、UX-DR-044–UX-DR-045、UX-DR-049、UX-DR-052。

**Acceptance Criteria:**

#### AC 1：核验四类合同与贡献旅程

**Given** S5 扩展候选构建
**When** Gate evaluator 运行 UJ-4 与 contract suite
**Then** 四类模板、demo/test 路径、类型、错误、安全和双语文档全部可复现
**And** 受限脚本与受信扩展边界明确且运行时不可跨越
**And** demo 结果不计入生产资格。

#### AC 2：核验真实供应链生命周期

**Given** 每类实际候选 bundle
**When** 执行安装、升级、权限变化、禁用、撤回和回滚
**Then** 来源、hash、锁定版本、SBOM、权限、SecretRef、destination 和审查证据完整
**And** 篡改/缺项/越权成功率为 0且无混合版本
**And** 精确官方列表未决时保持 blocked。

#### AC 3：核验公共表面没有越界

**Given** release exports、文档和 routes
**When** 扫描公共承诺
**Then** 仅包含四类受信扩展当前主版本及契约测试
**And** 无在线市场、公共社区、远程安装、公共 REST API 或未批准类别
**And** 内部可观察行为未被宣传为稳定合同。

#### AC 4：生成不可变切片决定

**Given** 所有 evidence 已评估
**When** 保存 TrustedExtensionGateDecision
**Then** 逐项 pass/fail/blocked 形成 Go、Stop 或 blocked 并绑定 manifests/source digests
**And** Gate、能力注册、审计和 release candidate 状态一致
**And** 新证据只能生成新版本。

#### AC 5：只解锁发布计划而非发布资格

**Given** 扩展切片为 Go
**When** 准备 Epic 8
**Then** 只满足 v1 release planning 的一个前置
**And** 备份、Parity、五平台、治理、法律与全部前序 Gate 仍须独立通过
**And** 不因扩展 Go 自动宣称 S5 或 v1 发布可用。

## Epic 8: 以可验证的双入口发行物发布 v1.0

部署者可以获得自包含、Apache-2.0、同一签名 payload 的 B/S archive 与 Tauri 薄桌面 envelope，安全备份、恢复、升级和回退完整工作区；维护者用真实 A/港股 Parity、五平台矩阵、治理与全部阶段证据决定是否发布 v1.0。

### Story 8.1: 构建同一 payload 的 B/S 与桌面发行物

As a TickDeck 部署者,
I want 从同一签名 product payload 获得 B/S 和桌面入口,
So that 两种发行物共享图表、Agent、回测、模拟组合、数据与 Gate 语义。

**对应需求：** FR-070；CAP-9、CAP-11；NFR-001、NFR-002、NFR-018、NFR-019、NFR-022–NFR-024、NFR-026。
**阶段：** S5（v1 发行切片）
**依赖：** Story 7.7 的有效受信扩展切片 Go、Story 2.11、Story 6.9。
**Blocker：** 只有全部前序阶段实际 Go 后才能构建 v1 候选；S5 Release Profile 的精确五平台最低 OS/libc/system WebView 仍受 AR-BLK-03 阻塞，不能自行填写或宣称支持。
**架构约束：** AR-AD-02、AR-AD-15、AR-AD-18、AR-AD-20、AR-AD-21、AR-AD-30、AR-BLK-03、AR-GATE-01；一个签名 payload 同时进入 B/S archive 与 Tauri 2 envelope。
**UX 约束：** UX-DR-001–UX-DR-007、UX-DR-025–UX-DR-026、UX-DR-036–UX-DR-045、UX-DR-048、UX-DR-051–UX-DR-052。

**Acceptance Criteria:**

#### AC 1：生成自包含签名 product payload

**Given** exact lockfile、Cargo.lock、Web assets、server/worker/supervisor、sandbox/toolchain 和 manifests
**When** 构建 Release Profile
**Then** 生成固定内容 digest、签名、版本、兼容和 artifact inventory
**And** 包含运行所需 Node/Wasmtime/compiler bits，不依赖系统额外安装或运行期 CDN/字体
**And** 相同 release set 不使用 latest 或未锁定依赖。

#### AC 2：从同一 payload 派生两种 envelope

**Given** 已签名 product payload
**When** 打包 B/S archive 与 Tauri 桌面客户端
**Then** 两者嵌入/引用 exact 同 digest payload
**And** 桌面仅启动并封装受保护本地实例，不建立第二 renderer、API、领域或授权路径
**And** 任一 envelope digest/签名不匹配时拒绝启动。

#### AC 3：保持三种运行入口等价

**Given** 桌面、本地 B/S 与远端 B/S 启动同一工作区版本
**When** 执行当前 v1 核心旅程
**Then** Capability/Gate、数据语义、风险、工件和持久化结果一致
**And** 入口差异只限 bootstrap、网络和壳层配置
**And** 不出现桌面独有业务能力或 Web 旁路。

#### AC 4：遵守开源与自托管边界

**Given** 用户检查许可、网络和产品功能
**When** 首次启动与离线网络审计
**Then** 发行物采用 Apache-2.0，无付费功能锁、license server、强制官方云登录或默认遥测
**And** 不自动联网检查或下载更新
**And** 无官方 SaaS、模型托管或跨主机运行依赖。

#### AC 5：通过 exact-bits 与安全启动测试

**Given** 两种 envelope 与三种入口候选
**When** 运行 binary/assets/manifest diff、签名、Host/Origin/session 和核心旅程测试
**Then** 业务 payload exact-bits 等价且安全边界绕过成功率为 0
**And** 冷启动和工作台交互满足 NFR-001/NFR-002 的固定环境基线
**And** 静态页面、mock 或开发服务器不能替代发行物验收。

### Story 8.2: 备份、恢复并迁移完整工作区

As a TickDeck 部署者,
I want 生成一致备份、预检迁移并在临时工作区验证恢复,
So that 升级失败不会破坏现有可恢复数据或复活旧授权。

**对应需求：** FR-074；CAP-9；NFR-008–NFR-012、NFR-015、NFR-017、NFR-038。
**阶段：** S5（v1 发行切片）
**依赖：** Story 8.1、Story 2.1、Story 2.4、Story 6.4。
**Blocker：** Vault 的精确加密算法/库/KDF/轮换迁移/headless secret-file 格式若仍未安全评审锁定，则可交付默认排除秘密的备份，但可选秘密备份必须保持 LOCKED，不得自行选型。
**架构约束：** AR-AD-03、AR-AD-07、AR-AD-10、AR-AD-11、AR-AD-19、AR-AD-25、AR-AD-30、AR-BLK-04；恢复原子切换并增加 workspace generation。
**UX 约束：** UX-DR-014–UX-DR-017、UX-DR-022–UX-DR-024、UX-DR-026–UX-DR-032、UX-DR-036–UX-DR-045、UX-DR-048。

**Acceptance Criteria:**

#### AC 1：生成一致且受策略过滤的备份

**Given** 工作区处于可备份状态
**When** Backup Service 创建备份
**Then** 从一致 SQLite snapshot 获取配置、研究、脚本、回测、组合和审计引用
**And** 只包含 COMMITTED artifacts，并按 DataUsePolicy/lineage 过滤受限资产
**And** manifest 记录 workspace/version/schema、内容 digest、排除和不可复现项。

#### AC 2：默认排除秘密和授权

**Given** 用户使用默认备份
**When** 枚举内容
**Then** Secret values、session、R1/R2 Grant、lease、nonce 和 bootstrap 材料全部排除
**And** SecretRef 仅作为待重新绑定的脱敏引用保存
**And** 内容预览与审计证明排除结果。

#### AC 3：严格约束可选秘密备份

**Given** 精确 Vault/secret-backup 合同已获安全评审并启用
**When** 用户显式选择秘密备份
**Then** 使用独立加密材料、版本化 envelope 和强制内容预览
**And** 无正确解密材料恢复成功率为 0
**And** 恢复后每个 SecretRef 仍须重新确认和连接测试；未锁定合同时该入口不存在。

#### AC 4：在临时工作区预检和恢复

**Given** 备份 archive 与目标 release
**When** 执行 compatibility、schema、digest、DataUse 和 artifact 校验
**Then** 先恢复到安全临时 data root 并运行完整性/迁移检查
**And** 全部通过后才原子切换，增加 workspace generation
**And** 旧 session、Grant、lease、Worker result 和桌面 bootstrap 全部失效。

#### AC 5：迁移失败可安全回退

**Given** schema 不兼容、blob 缺失、政策拒绝、磁盘故障或中途崩溃
**When** 恢复/迁移失败
**Then** 原工作区保持未修改且可重开
**And** 临时候选被隔离并给出稳定诊断，不形成两个权威实例
**And** 不通过手工改库或复制部分文件“修复”。

#### AC 6：通过完整恢复 corpus

**Given** 全领域数据、默认无秘密、加密秘密失败、许可撤回、跨版本和 crash fixtures
**When** 备份恢复套件运行
**Then** 允许内容、标识、审计和 committed artifacts 可验证恢复
**And** 受限/排除内容不出现，SecretRef 重验状态正确
**And** 双入口打开的是同一新 generation 工作区。

### Story 8.3: 在真实 A/港股路径执行 Parity Rubric

As a TickDeck 产品维护者,
I want 用版本化任务量表在真实 A/港股发行候选上验收端到端等价,
So that v1 资格不会由静态页面、占位数据或单元测试代替。

**对应需求：** FR-098；CAP-11；NFR-002–NFR-007、NFR-012、NFR-021–NFR-023、NFR-029–NFR-031。
**阶段：** S5（v1 发行切片）
**依赖：** Story 8.1、Story 8.2、Story 3.9、Story 4.9、Story 5.8、Story 6.9。
**Blocker：** 必须使用当前 production-authorized 的真实 A 股与港股路径、exact release payload 和冻结 §6.5 rubric；任一路径、许可或任务证据无效时不得运行通过判定。
**架构约束：** AR-AD-02、AR-AD-18、AR-AD-20、AR-AD-23、AR-AD-28、AR-AD-31、AR-GATE-01；量表、oracle、环境和 artifact digests 一起版本化。
**UX 约束：** UX-DR-001–UX-DR-052 的适用 v1 状态；重点继承 UX-DR-008–UX-DR-020、UX-DR-026–UX-DR-049。

**Acceptance Criteria:**

#### AC 1：冻结可复现 Parity run

**Given** v1 release candidate 与两条合格真实路径
**When** 创建 rubric run
**Then** 冻结 rubric version、任务、用户角色、环境、payload、connector/model/tool manifests、snapshots 和 expected oracle
**And** 记录 B/S/desktop entry、平台、语言、主题、视口和缩放
**And** run 开始后不能修改通过条件。

#### AC 2：覆盖端到端核心旅程

**Given** 冻结任务量表
**When** 在候选发行物执行
**Then** 覆盖图表任务 1–5、筛选证据、Agent、策略/回测、提醒、模拟组合、扩展和工作区生命周期的适用任务
**And** A/港股市场规则、数据许可、风险、失败和恢复状态均实际触发
**And** 结果由 oracle、artifact 和审计判定。

#### AC 3：比较双入口和平台等价

**Given** 相同 workspace backup/fixture 与 exact payload
**When** 在 B/S archive 和桌面 envelope 执行同任务
**Then** 能力、数值、工件、风险、错误和审计语义一致
**And** 入口特有网络/bootstrap 差异按预定 rubric 单独验收
**And** 不允许桌面或某平台跳过失败任务。

#### AC 4：覆盖无障碍与可视状态矩阵

**Given** 主题、双语/pseudo-long、三视口、100%/200% 和键盘/读屏 fixtures
**When** 执行所有一级旅程
**Then** Trust、R0–R3、通知、图表、表格、错误和 Gate 达到 WCAG 2.2 AA 合同
**And** 数据、风险和行情语义不只靠颜色
**And** R3 长原因无覆盖入口且不截断。

#### AC 5：拒绝替代性证据

**Given** 静态页面、mock、demo、placeholder、单元测试、录屏或人工勾选
**When** 尝试计入 rubric
**Then** evaluator 拒绝并保持任务未通过
**And** only exact release artifact 的真实端到端 evidence 可计分
**And** 失败任务保留证据且不能被其他高分补偿。

#### AC 6：保存不可变量表结果

**Given** rubric run 完成或中断
**When** 提交结果
**Then** 每任务保存 pass/fail/blocked、证据、环境、耗时、版本和 source digests
**And** 汇总结果不覆盖逐项事实
**And** 新 candidate 必须新建 run，不能改绿旧结果。

### Story 8.4: 发布并演练开源治理与安全响应

As a TickDeck 用户和贡献者,
I want 在 RC 前看到明确维护、贡献、支持、发布和安全响应规则,
So that 开源发行物的责任与处理时限可核查。

**对应需求：** FR-099；CAP-10；NFR-018、NFR-023、NFR-027、NFR-040。
**阶段：** S5（v1 发行切片）
**依赖：** Story 7.7、Story 8.1。
**Blocker：** 项目维护者、CODEOWNERS、实际支持窗口、贡献首响目标和安全响应时限必须由授权维护者确认；不得自行填姓名、承诺 SLA 或伪造演练。OQ-04 法律文本同时须按实际路径核对。
**架构约束：** AR-AD-18、AR-AD-21、AR-BLK-07、AR-CON-01；治理文件与 Release Manifest/RC Gate 同版本发布。
**UX 约束：** UX-DR-037–UX-DR-045、UX-DR-048–UX-DR-049；安装、数据授权、安全和贡献指南必须双语、直接且可核查。

**Acceptance Criteria:**

#### AC 1：公开维护与所有权

**Given** 授权维护者已确认角色
**When** 生成 RC governance set
**Then** 公开维护者、CODEOWNERS、决策/RFC 与升级路径
**And** 说明官方与社区贡献边界及 code-owner 审查要求
**And** 不写入未经确认的人员或组织承诺。

#### AC 2：公开发布、支持与回滚流程

**Given** v1 发行流程获批准
**When** 发布双语文档
**Then** 描述版本、RC、签名、SBOM、Release Profile、升级、回滚和支持窗口
**And** 记录贡献首响目标及适用范围
**And** 不承诺官方云、自动更新或范围外平台。

#### AC 3：公开安全报告与响应时限

**Given** 安全政策由维护者确认
**When** 发布 security policy
**Then** 提供私密报告渠道、确认/分级/缓解/修复时限和披露流程
**And** 覆盖严重依赖、扩展撤回、能力禁用和修复指引
**And** 不暴露真实漏洞细节或凭据。

#### AC 4：完成一次可审计演练

**Given** 冻结的模拟安全事件
**When** 维护者执行响应演练
**Then** 记录接收、分级、code-owner 协调、能力禁用、公告、修复与回滚时点
**And** 实际结果对照公开时限并记录偏差/处置
**And** 仅真实参与证据可满足 NFR-040。

#### AC 5：验证治理包自包含且一致

**Given** RC 文档与 repository metadata
**When** lint/link/ownership/release checks 运行
**Then** 中英文指南、CODEOWNERS、RFC、支持、安全和发布内容一致且链接有效
**And** 不含外部项目依赖、私有路径、未授权供应商承诺或晦涩绕过措辞
**And** 缺项时 RC Gate blocked。

### Story 8.5: 强制切片 Gate 与 Capability/Release Manifest 一致

As a TickDeck 产品维护者,
I want 构建、版本说明和发布检查只声明已通过当前切片的能力,
So that 后续实验不会被包装成 v1 承诺。

**对应需求：** FR-100；CAP-11；NFR-008、NFR-010、NFR-017–NFR-019、NFR-026、NFR-028。
**阶段：** S5（v1 发行切片）
**依赖：** Story 1.8、Story 2.13、Story 3.9、Story 4.9、Story 5.8、Story 6.9、Story 7.7、Story 8.1。
**Blocker：** 前一切片未 Go 时后续能力只能实验且不得进入 v1 build/release notes；任何 Gate source digest、catalog 或 evidence 不一致都必须 fail closed。
**架构约束：** AR-AD-02、AR-AD-18、AR-AD-19、AR-AD-21、AR-AD-30、AR-GATE-01、AR-CON-01；Gate Registry 从权威阶段矩阵与 canonical capability catalog 生成三端一致 manifest。
**UX 约束：** UX-DR-005、UX-DR-023–UX-DR-024、UX-DR-026、UX-DR-045、UX-DR-050–UX-DR-052；未授权表面不存在，不使用 disabled teaser。

**Acceptance Criteria:**

#### AC 1：加载权威阶段矩阵与目录

**Given** SPEC source digests、阶段矩阵和 canonical capability catalog
**When** 构建 Gate Registry
**Then** 顺序固定为 S0-V→S0→S1→S2→S3→S4→S5
**And** 每项能力声明最早阶段、依赖、evidence 和状态
**And** source digest 不匹配时构建/发布失败。

#### AC 2：统一 web/server/worker manifests

**Given** 当前 Gate decisions
**When** 生成 Capability Manifest
**Then** web、server、worker 共享同一 manifest digest 与注册集合
**And** 未通过能力没有 route、handler、tool、job、navigation 或 sidecar
**And** locked/suspended 仅可出现在诊断，不形成可调用入口。

#### AC 3：约束构建与版本说明

**Given** release build 或 release notes 候选
**When** 检查声明能力
**Then** 每项必须引用当前通过切片、manifest 和真实 evidence
**And** 实验能力明确排除于 v1 承诺和默认 payload
**And** 文案不得把接口、mock、demo 或计划描述为已交付。

#### AC 4：执行 Stop/Narrow 与失效传播

**Given** 前序 Gate 失效、证据过期或严重漏洞
**When** registry 重算
**Then** 依赖能力变为 blocked/suspended 并阻止新执行
**And** 已保存产物保持可检查，旧 Grants/leases 不再可用
**And** Release Manifest 与诊断说明影响和恢复条件。

#### AC 5：通过越权注册测试

**Given** 客户端篡改、直接 URL、旧 manifest、环境变量、构建 flag、模型输出和数据库修改 fixtures
**When** 尝试启用后续能力
**Then** 未授权注册成功率为 0
**And** 三端 manifest 不一致时启动/发布阻断
**And** 所有拒绝有稳定 code、审计和合法下一步。

### Story 8.6: 验证五平台安装、升级、回滚与等价

As a TickDeck 部署者,
I want 在每个正式支持平台安装、升级和回滚同一 release set,
So that 平台声明由真实发行物证据支持且失败不会产生混合版本。

**对应需求：** FR-070、FR-074 的五平台发行验收；CAP-9、CAP-11；NFR-001、NFR-002、NFR-010–NFR-012、NFR-018、NFR-022、NFR-037。
**阶段：** S5（v1 发行切片）
**依赖：** Story 8.1、Story 8.2、Story 8.5。
**Blocker：** 五个精确 Release Profile 的最低 OS/libc/system WebView 开放项必须先由真实环境与维护者锁定；未锁定平台保持 unsupported，不得自行推定版本或以 CI 模拟器宣称支持。
**架构约束：** AR-AD-11、AR-AD-12、AR-AD-18、AR-AD-20、AR-AD-30、AR-BLK-02、AR-BLK-03；签名本地 release set、版本单调、双重签名与 UpgradeCoordinator 状态机不可省略。
**UX 约束：** UX-DR-024、UX-DR-026–UX-DR-030、UX-DR-036–UX-DR-045、UX-DR-048；失败必须阻止混合版本并保留可恢复状态。

**Acceptance Criteria:**

#### AC 1：冻结五个 Release Profile

**Given** 维护者提供实际最低 OS/libc/WebView 决策与环境证据
**When** 生成 profile catalog
**Then** 每个 profile 声明 OS/arch、libc（适用时）、WebView、签名、sandbox termination 和兼容范围
**And** 绑定真实 runner/device 与验证日期
**And** 未冻结 profile 不进入支持列表。

#### AC 2：安装同一签名 release set

**Given** 每个支持平台的 B/S archive 与桌面 envelope
**When** 执行全新安装与启动
**Then** 校验双重签名、payload digest、workspace identity 和版本单调性
**And** 两入口使用同一 bits 并完成受保护 bootstrap
**And** 不依赖系统另装 Node/Wasmtime/compiler 或联网下载。

#### AC 3：执行升级与迁移

**Given** 支持的前一版本工作区和本地 staged 新 release set
**When** UpgradeCoordinator 升级
**Then** 先预检兼容、空间、备份、签名和 migration，再原子切换
**And** server、worker、web、desktop、sandbox 和 manifests 不形成混合版本
**And** 旧 session/Grant/lease/result 随 generation 失效。

#### AC 4：安全回滚

**Given** 启动、健康、迁移或核心旅程失败
**When** 执行 rollback
**Then** 回到本地已签名兼容 release set 与可恢复工作区
**And** 保留失败诊断、审计和候选隔离状态
**And** 不远程下载、降级 schema 或丢弃新数据来强行回退。

#### AC 5：运行平台等价与沙箱套件

**Given** 五个 exact profiles
**When** 执行同一核心旅程、WCAG、网络边界、恢复与 sandbox corpus
**Then** 业务语义、数值、风险、工件和错误等价，沙箱攻击成功率为 0
**And** 保存环境、用例版本、payload 和结果 digests
**And** 任一平台失败只可移出支持范围或阻止发布。

#### AC 6：验证性能与诊断

**Given** 每个平台固定性能环境
**When** 冷启动、工作台与图表/筛选基线运行
**Then** 满足适用 NFR-001–NFR-005 或按 OQ-05 合法保留原基线与调整证据
**And** 健康页区分产品、平台、WebView、sandbox 和资格状态
**And** 诊断包预览并脱敏。

### Story 8.7: 生成最终 S5 与 v1.0 发布决定

As a TickDeck 产品维护者,
I want 以全部阶段、真实 Parity、五平台、治理和法律证据决定 v1.0 Go、Stop 或 blocked,
So that 发行资格是可审计的事实而不是计划完成度或人工乐观判断。

**对应需求：** FR-070、FR-074、FR-098、FR-099、FR-100 的最终发行 Gate；CAP-1–CAP-11；FR-001–FR-100、NFR-001–NFR-040、全部 SM/SM-C、S0-V–S5 阶段门与范围排除。
**阶段：** S5 / v1.0 Release Gate
**依赖：** Story 8.1–Story 8.6，以及 Story 1.8、Story 2.13、Story 3.9、Story 4.9、Story 5.8、Story 6.9、Story 7.7 的有效决定。
**Blocker：** 任一开放问题（含精确真实数据、模型、通知、官方扩展、Vault、五平台 baseline、OQ-04 法律文本及适用成功指标证据）未关闭，或任一前序 Gate 非有效 Go 时，最终决定必须 blocked/Stop；不得自行假设答案。
**架构约束：** AR-AD-01–AR-AD-31、AR-CON-01、AR-STACK-01、AR-STRUCT-01、AR-GATE-01、AR-BLK-01–AR-BLK-08、AR-SCOPE-01 全部适用；Release Manifest 是最终机器可读合同。
**UX 约束：** UX-DR-001–UX-DR-052 全部适用；目标 v1 mock 不能替代实际实现、资格或发布证据。

**Acceptance Criteria:**

#### AC 1：验证全部前序 Gate 链

**Given** 候选 Release Manifest
**When** final evaluator 解析 S0-V、S0、S1、S2、S3、S4 与受信扩展/S5 decisions
**Then** 每个决定必须是当前、签名/可验 digest、依赖连续且 source contract 一致的 Go
**And** 任一 Stop、blocked、过期、漂移或缺失立即阻止发布
**And** 后阶段证据不能补偿前阶段失败。

#### AC 2：验证 FR/NFR/CAP/SM 完整追踪

**Given** 最终 traceability matrix
**When** 对照 SPEC 与全部 companions
**Then** FR-001–FR-100、NFR-001–NFR-040、CAP-1–CAP-11、全部 SM/SM-C 均映射到真实 evidence 与结果
**And** 每项状态为 pass/fail/blocked 且无 orphan、重复主责或未解释豁免
**And** 模型输出、覆盖率或文档声明不能替代验收。

#### AC 3：验证真实发行物与 Parity

**Given** exact B/S archive、desktop envelope 和五平台 evidence
**When** 校验签名、SBOM、许可、安装/升级/回滚、真实 A/港股 Parity 和 WCAG
**Then** 所有承重任务通过且双入口 exact payload/语义等价
**And** demo、placeholder、mock、开发服务或单元测试未被计入真实资格
**And** 性能、沙箱、安全攻击和恢复指标达到合同。

#### AC 4：验证开放问题、法律与治理

**Given** open-question register、数据/模型/通知/扩展清单和治理包
**When** 发布前审查
**Then** 所有必须关闭项包含 owner、实际决定、证据、日期和影响
**And** OQ-04 文本与实际路径一致，治理/安全演练真实完成
**And** 任何未知、未确认或自行推定项保持 blocker。

#### AC 5：验证范围排除与自托管承诺

**Given** release bits、routes、manifests、文档和网络行为
**When** 扫描产品范围
**Then** 不存在实盘/券商/无人值守、范围外资产、用户/RBAC/多租户、官方 SaaS、跨主机、移动验收、公共社区/市场、远程安装、公共 REST、多 Agent、自动模型路由或托管
**And** 无付费锁、license server、强制云登录、默认遥测或自动联网更新
**And** 重开范围项必须有新产品决策，不能在本 Gate 临时放行。

#### AC 6：生成不可变最终决定

**Given** 所有检查完成
**When** 保存 FinalReleaseDecision
**Then** 逐项结果汇总为 Go、Stop 或 blocked，绑定 SPEC/companion、source、evidence、payload 和 manifest digests
**And** decision、Release Manifest、公开版本说明与审计一致
**And** 只有全部承重项通过才可为 Go，且无人工改绿或指标补偿。

#### AC 7：在非 Go 时安全收窄

**Given** 最终结果为 Stop 或 blocked
**When** 发布流程收口
**Then** 不生成或发布 v1.0 资格声明
**And** 保留可验证候选、失败证据和上一个安全 release set，明确 Stop/Narrow/补证条件
**And** 不破坏用户工作区、不删除审计，也不提前授权任何后续能力。
