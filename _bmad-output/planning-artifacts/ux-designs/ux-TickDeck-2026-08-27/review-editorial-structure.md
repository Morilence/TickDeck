# Editorial Structure Review — TickDeck UX Spine Pair

| Item | Read |
|---|---|
| Purpose read | 这组规范帮助架构、story/dev 与 QA（human or AI）在不重新解释产品决策的前提下，随机定位视觉 token、阶段门、组件、状态、执行/风险合同与验收责任，并据此实现或验证 TickDeck。 |
| Reader type | Humans；优化随机查阅、扫描和从总则到权威细节的路径，同时保留旅程与示例提供的理解支架。 |
| Style guide | Microsoft Writing Style Guide；结构上采用前置关键结论、短而可预测的标题、一个规则一个权威落点。 |
| `DESIGN.md` model | **Reference/Database**。frontmatter token map、固定主题章节和组件表构成稳定随机访问结构；当前结构 **clean**。 |
| `EXPERIENCE.md` model | **Reference/Database**。它是实现/验收行为索引，不是教程；当前信息完整，但部分权威表的位置与父级分类不够 MECE。 |
| Metrics | `DESIGN.md` 2,703 words；`EXPERIENCE.md` 9,962 words；pair total 12,665 words。均由 `word_metrics.py` 分别实测。 |

| Pass | Original Text | Revised Text | Changes |
|---|---|---|---|
| structure | `EXPERIENCE.md` §Stable Requirement Traceability（338 words，`:361-381`）与 §Open Questions and Handoff Boundaries（134 words，`:383-387`）位于全文末尾。 | **MOVE**：把 Open Questions 紧接 §阶段合同；把 Stable Requirement Traceability 放在 §Information Architecture 之后。 | 阻塞项应与阶段门一起前置，稳定 ID 路由应在读者进入详细组件/状态前可查。迁移 472 words；删除 0。 |
| structure | `EXPERIENCE.md` §保存、撤销与确认、§Risk Gate 状态与转换、§通知、§长任务、恢复与通知事件序列（合计 1,557 words，`:194-245`）全部嵌在 §Interaction Primitives 下。 | **MOVE**：新建同级 `# Execution, Risk, Recovery & Notifications`，把这四节整体移入；§Interaction Primitives 只保留上下文/深链与键盘/命令。 | Gate 状态机、竞态、恢复和通知是生命周期合同，不是 primitive。形成清晰的“基础交互”与“执行生命周期”两类；迁移 1,557 words；删除 0。 |
| structure | `EXPERIENCE.md` §Inspiration & Anti-patterns（195 words）和 §Voice and Tone（431 words，`:88-107`）位于 IA 与可执行组件合同之间。 | **MOVE**：合并为一个后置的 `# Design and Content Guidance` 组，放到 §Accessibility Floor 之后、§Key Flows 之前；保留两个现有子标题。 | 两节有用但不是架构/实现查找路径的前置依赖；后移后，主干成为 Foundation → IA → Components → States → Interaction/Execution。迁移 626 words；删除 0。 |
| structure | `EXPERIENCE.md` §Data, Model, Risk & Audit Contract（569 words，`:247-272`）在一个连续区块内混合 Trust Strip 时点字段、Agent 结果分区、模型资格和策略/回测披露；Risk 又已有独立权威状态机。 | **MOVE**：保留同一顶级合同，但拆成 `Trust Strip identity`、`Agent result and manifest`、`Model qualification`、`Strategy/backtest disclosure` 四个 H2；标题去掉会与执行状态机重叠的 “Risk”，或明确 Risk 只引用前一权威节。 | Reference/Database 需要一致、可命中的条目边界；仅分组与交叉引用，不改变规则。重组 569 words；删除 0。 |
| structure | `EXPERIENCE.md` §保存、撤销与确认中的 R2 绑定字段/失效条件（`:198`）随后在 §Risk Gate 状态与转换的状态表、审计字段和竞态表（`:206-228`）再次完整展开；前节共 298 words，后节 806 words。 | **MERGE**：以 Risk Gate 状态表为唯一权威清单；前节保留保存/删除/本地导出边界，并把 R2 段压成一句交叉引用：“R2 的绑定、失效与单次消费以 §Risk Gate 状态与转换为准。” | 消除同一字段清单的双源维护风险，所有安全含义不变。预计减少约 85 words（基于 298-word 段与 806-word 权威节）。 |
| structure | `EXPERIENCE.md` §键盘与命令（141 words，`:190-192`）已经定义 IME → modal → scope → global、Escape 回返和 R2/R3 禁令；§Accessibility Floor > 键盘、虚拟化与调宽首条（`:303`）再次复述。 | **CONDENSE**：Accessibility 首条改为对 §键盘与命令的验收交叉引用，仅保留“可见等价入口、焦点回返、R2/R3 无快捷确认”这些 QA 观察点。 | 一个位置定义行为，一个位置定义如何验收；避免两套优先级漂移。预计减少约 30 words（基于 178-word accessibility 子节）。 |
| structure | `EXPERIENCE.md` 9,962 words，顶层没有面向三类消费者的入口路径；读者需自行从 37 个 heading 判断先看哪里。 | **QUESTION**：是否在 §Foundation 后增加约 75-word `## Reader routes`，只列三条路径：Architecture、story/dev、QA，并分别链接 DESIGN、阶段/OQ、IA/components、states/execution、accessibility/traceability。 | 这是随机访问 scaffolding，不新增要求。若 Markdown 宿主始终提供稳定 TOC，可不加；word impact `+~75`。 |
| structure | `DESIGN.md` 的 canonical 顺序、frontmatter token map、Components 表和末尾 §Do's and Don'ts（425 words）存在少量有意复述。 | **PRESERVE**：保持当前 2,703-word Reference/Database 结构，不做 CUT/MERGE/MOVE/CONDENSE。 | §Do/Don't 是人类实现者的快速 guardrail，不是正文重复；frontmatter 与 prose 分别服务机器和人。`DESIGN.md` 结构 clean；word impact 0。 |
| structure | `EXPERIENCE.md` §Visual References and Mock Coverage（450 words）、§Accessibility Floor（1,031 words）与 §Key Flows（1,141 words）看似可压缩或外移。 | **PRESERVE**：保留原文和表格；只随上述 MOVE 调整相对位置。 | Visual fixtures 为 QA 身份边界，Accessibility 是验收合同，Key Flows 为 human reader 的端到端心智模型；删减会牺牲可实现性或理解支架。保留 2,622 words；word impact 0。 |

| Summary | Result |
|---|---|
| Recommendations | 7 actionable：4 MOVE、1 MERGE、1 CONDENSE、1 QUESTION；另有 2 PRESERVE。**CUT：none。** |
| Gross reduction | 约 115 words：`EXPERIENCE.md` 的 1.2%，pair total 的 0.9%。 |
| Net impact if Reader routes is accepted | 约减少 40 words：`EXPERIENCE.md` 的 0.4%，pair total 的 0.3%；主要收益是权威落点与随机访问，而非缩短篇幅。 |
| Relocation/reclassification | 约 3,224 words 被前置、后移或重新分组，不改变内容。 |
| Length target | 未提供；不以任意字数目标驱动删除。 |
| Comprehension trade-off | 重排会降低从 IA 到品牌/语气的线性叙事感，但保留 Visual References、Accessibility 与 Key Flows，足以维持 human reader 的理解和验收路径。 |
