# BMad Editorial Review — Structure Lens

- Review date: 2026-08-28
- Target: `../ARCHITECTURE-SPINE.md`
- Pass: `structure`
- Reader: human architects, implementers, reviewers, and maintainers
- Word metrics: 13,263 words; longest sections are AD-2 (1,340), AD-9 (778), AD-15 (664), and AD-12 (572)
- Style baseline: Microsoft Writing Style Guide
- Editing constraint: preserve every stage Gate, FR/NFR/OQ binding, exclusion, UX contract, decision ID, and adopted rule; do not authorize a later-stage capability

This document exists to help TickDeck's architects and implementers build one consistent system without weakening the approved product, safety, stage, or UX contracts.

## Chosen structure model

Use **Strategic/Context (Pyramid)** as the primary model because this is the formal decision substrate: the paradigm, current decision status, hard boundaries, and blockers should be visible before supporting detail. Use **Explanation (Conceptual)** as the secondary model inside the body: readers need authority and trust-boundary foundations before implementation-specific stack and repository detail.

## Overall judgment

The spine is complete and internally navigable by AD number, but it is not yet optimally scannable for a human reader. The content itself should remain intact. Finalize needs two preservation-safe structural fixes: surface the unresolved decision status near the top, and add internal signposts to the undifferentiated 29-AD body and its four longest decisions. No architecture decision needs reopening.

## 必须修（Finalize 文档标准；不改变架构）

| Pass | Original Text | Revised Text | Changes |
| --- | --- | --- | --- |
| structure | `§Deferred`（lines 463–478，572 words）位于全文末尾；OQ-02、OQ-03 仍分别阻塞 S2、S1，OQ-06 也还有 S0 证据余项，但读者必须读完全部 AD、Stack 和结构种子后才看到完整状态。 | **MOVE**：把整个表原样移到 `§Design Paradigm` 之后，改名为 `Open Decisions and Revisit Gates` 或等义中文标题；原位置不留重复副本。 | 战略文档应先给“已决定什么、仍被什么阻塞”。仅移动 572 words，净字数 0；不改变任何 OQ 状态或 reopen 条件。 |
| structure | `§Invariants & Rules`（lines 57–315）连续列出 29 个同级 AD；AD-2、AD-9、AD-12、AD-15 各自包含多个逻辑块，但段内没有可扫描路标。 | **CONDENSE / PRESERVE**：在 `§Invariants & Rules` 开头增加一个 5–6 行的 AD 导航索引；只给四个最长 AD 增加粗体段内标签。建议标签：AD-2“Gate authority / 假设与范围 / 阶段矩阵 / UI 投影”；AD-9“Broker 与 sidecar / retry semantics / 用户配置与 Secret Broker / 模型档案与资格”；AD-12“guest 隔离 / 资源档案 / 终止与平台证据”；AD-15“SPA 与设计系统 / 合同验证与状态归属 / viewport envelope”。保留 AD 编号、顺序、Binds、Prevents 和每一句 Rule。 | 解决主要扫描负担，不拆分或重写决策。预计新增 70–110 words，换取明确的信息层级；不得以删减阶段门或安全条件抵消这些字数。 |

## 建议修（高价值、非阻塞）

| Pass | Original Text | Revised Text | Changes |
| --- | --- | --- | --- |
| structure | `§Stack`（lines 332–383，298 words）先于 `§Structural Seed`（lines 385–441，357 words）。读者先看到 46 个版本号，之后才知道这些依赖落在哪些进程、包和方向。 | **MOVE**：先放 `Structural Seed`，再放 `Stack`；把 Stack 标题改为 `Bootstrap Stack — Exact Initial Pins` 或等义中文标题。 | 符合“结构先于实现选择”的依赖顺序。移动 655 words，净字数 0；版本号和锁定规则全部保留。 |
| structure | `§Consistency Conventions`（lines 317–330，463 words）是横跨所有 AD 的规范，但正文没有说明它与各 AD 的关系。 | **MOVE / PRESERVE**：保持当前位置；在 `§Invariants & Rules` 的导航索引中明确“所有 AD 同时受 Consistency Conventions 约束”，并从 AD-3/AD-4/AD-10 的导航项指向 digest、ID、event 和 error conventions。 | 避免把同一规范复制进每条 AD。新增约 15–25 words，净增很小。 |
| structure | AD-3、AD-10、AD-13、AD-20 使用“全部 FR/NFR”等宽范围 Binds，而 `§Capability → Architecture Map` 才提供更细的诊断映射。 | **QUESTION / CONDENSE**：在 `§Capability → Architecture Map` 标题下增加一句“本表是需求追踪的诊断索引；AD 的宽 Binds 表示横切约束，不替代本表”。不要为了变短而缩窄这些 Binds。 | 消除两种追踪粒度的阅读歧义。新增约 20 words；不改变覆盖范围。 |
| structure | AD-2 lines 69–77 与文末 OQ 表都提醒当前 blocker；Stack 开头又说明版本以后由 lockfile/Release Manifest 固定。 | **CONDENSE**：移动 OQ 表后，让 AD-2 只保留一条指向该表的“当前 blocker”句子；Stack 保留一次“bootstrap 后由 lockfile/Cargo.lock/Release Manifest 接管”的说明。只压缩完全相同的状态复述，保留每个 enforcement boundary 自己的禁止语句。 | 可安全减少约 60–120 words（0.5%–0.9%）。若无法证明两句语义完全相同，则 PRESERVE，不做删减。 |

## 无需修（明确保留）

| Pass | Original Text | Revised Text | Changes |
| --- | --- | --- | --- |
| structure | `Design Paradigm` 的运行拓扑图与 `Structural Seed` 的包依赖图。 | **PRESERVE**：两张图分别回答“进程怎么协作”和“代码可以依赖谁”，不是重复图。 | 对人类读者是必要的双层心智模型；删任一张都会降低理解。 |
| structure | 每条 AD 都重复 `Binds / Prevents / Rule` 的固定形状。 | **PRESERVE**：保持统一 schema。 | 这是随机访问和审查所需的结构化重复，不是冗余。 |
| structure | AD-2 的完整阶段矩阵、v1 排除项、重新开放条件、UI 表面阶段和 route 可见性规则。 | **PRESERVE**：只加段内标签，不拆到附录，不用 PRD 链接替代正文。 | 这些是防止后续阶段被提前授权的核心合同；压缩会造成实质风险。 |
| structure | AD-12 的 guest capability、资源上限、进程级终止、五平台矩阵和“无弱化 fallback”条款。 | **PRESERVE**：只加内部路标；不得缩写为“使用 Wasmtime sandbox”。 | OQ-06 的结论依赖完整隔离和终止边界，摘要不能替代可执行规则。 |
| structure | AD-4/AD-5/AD-9/AD-29 对 `UNCERTAIN`、单次授权、retry owner 和不可重放的交叉强调。 | **PRESERVE**：这些语句分别位于事务、授权、连接器和拨号边界。 | 看似重复，实际是不同失败点的局部强制条件；合并会留下绕过路径。 |
| structure | `Capability → Architecture Map`（333 words）和移动后的完整 Open Decisions 表（572 words）。 | **PRESERVE**：前者保留需求追踪，后者保留状态与 revisit gate。 | 两表服务不同检索任务，不应合并。 |

## 最小调整方案

按最小风险顺序执行：

1. 原样上移 `Deferred` 表并改成“Open Decisions and Revisit Gates”。
2. 在 `Invariants & Rules` 开头增加 AD 分组索引，不移动或重编号 AD。
3. 给 AD-2、AD-9、AD-12、AD-15 加粗体段内标签，不删规则。
4. 将 `Structural Seed` 放到 `Stack` 前；其余主体顺序保持不变。
5. 只在逐句确认完全重复时压缩 60–120 words；否则不减字。

建议的 AD 导航分组只作阅读索引，不新增架构层级：

- AD-1–AD-4：authority、state、transaction、recovery execution
- AD-5–AD-11：risk、session、data use、egress、connectors、persistence、restore
- AD-12：sandbox isolation and termination
- AD-13–AD-17：client authority、Agent boundary、frontend/UX contracts
- AD-18–AD-22：release、audit、verification、maintenance、extensions
- AD-23–AD-29：domain semantics、demo/health/alert、RPC、market identity、dispatch authorization

## Reduction summary

- Recommendations: 6 actionable changes, of which 2 are required for Finalize-level human readability.
- Estimated reduction if every safe condensation is accepted: **60–120 words**, about **0.5%–0.9%** of 13,263 words.
- Net result after navigation labels: likely near word-neutral, because this document's length is driven by binding contracts rather than removable explanation.
- No length target was provided.
- Comprehension trade-off: reductions beyond this range are likely to remove enforcement detail or force readers back to four source documents. For this artifact, preserving self-contained Gate, OQ, safety, and UX contracts is more valuable than reaching an arbitrary shorter length.
