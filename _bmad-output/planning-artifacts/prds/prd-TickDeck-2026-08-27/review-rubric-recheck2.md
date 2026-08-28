# PRD Quality Recheck 2 — TickDeck

## Overall verdict

**Gate verdict: HOLD（critical 0，high 1）**。上次 remaining high 中，策略偏差矩阵已经关闭；SM→FR 虚假覆盖只做了部分收窄，且新增 SM-00/SM-01R 继续把“任务指标依赖这些能力”写成“任务指标验证这些要求”，因此仍需一次精确修复。未发现由本轮新增内容造成的其他 critical/high。

## Decision-readiness — strong

新增 S0-V 把产品 thesis 的廉价证伪放到沙箱、提醒和组合平台化建设之前，并以 SM-00 未通过即停止平台化建设为门，进一步强化了依赖顺序和 Stop/Narrow 决策。没有新增 critical/high。

## Substance over theater — strong

偏差矩阵、真实配置成本和模型资格均产生了具体测试后果，不是装饰性补充。没有新增 critical/high。

## Strategic coherence — strong

S0-V 现在只建设一条合法数据路径、只读筛选工具和受限 R0 Agent 来验证时间、漏错和复用，修正了先投入完整平台再验证 thesis 的顺序风险。没有新增 critical/high。

## Done-ness clarity — adequate

上次 high“策略偏差矩阵仍是不存在的验收依赖”已关闭。`§6.4` 现在按未来数据、预热、未确认 K 线、复权/公司行动、幸存者偏差、参数过拟合和成交假设列出默认结果与固定 fixture；`§6.5 S3` 和 `SM-11` 明确在 S3 前冻结并执行矩阵。具体误报/漏报协议仍可在测试 companion 中细化，但已不再阻止下游定义或 Gate 执行。

原有两个 medium 仍在：OQ-02 尚未冻结完整盲审与 benchmark protocol；NFR-002 至 NFR-005 尚未给出完整客户端性能测试画像。二者都有负责人和关闭时点，不升级为 high。

## Scope honesty — strong

真实配置成本通过 SM-01R 单列为 A-02 的验证条件，演示安装不再被用来关闭真实配置假设。没有新增 critical/high。

## Downstream usability — adequate

上次 high“旧 SM 的虚假覆盖声明仍然存在”只部分关闭。SM-09 已明确“不替代 SM-15”，但仍声称贡献数量验证 FR-080、FR-099；SM-01 虽缩小范围，仍用一次演示安装/查询声称验证完整模型能力分级、远端模式边界与诊断；新增 SM-01R 也把一次配置任务写成对秘密保护和整个本地/远端模式的验证。更明显的是，S0-V 明确只有 R0 Agent，而 SM-00 仍声称验证包含 R1/R2 不可重放授权的 FR-092。

### Findings

- **high** SM→FR 映射仍把“依赖/触达”误写成“验证”（SM-00、SM-01、SM-01R、SM-09）— 只读 R0 对照无法验证 FR-092，一次演示或真实配置任务不能验证所列全部模型、远端边界、秘密和诊断要求，贡献者数量也不能验证脚手架或治理规则；这会继续误导 QA 和发布治理对覆盖率的判断。*Fix:* 将这些行的 `验证` 拆成 `测量` 与 `前置依赖`，只保留指标本身直接断言的 FR；把 FR-092、FR-065–FR-076、FR-080/099 的质量验证分别留给 SM-06、SM-13/14/17、SM-15 或明确的独立验收套件。

重复的 `§6.3` 仍是一个 low 机械问题：真实数据参考能力画像与明确非目标编号冲突，但没有升级为 critical/high。

## Shape fit — strong

新增内容仍保持“产品结果与 Gate 在正文、技术机制和证据在 addendum”的分工。没有新增 critical/high。

## Mechanical notes

- 上次 remaining high：偏差矩阵已关闭；SM→FR 覆盖仍未关闭。
- 新增 critical/high：none。
- Carried findings：medium 2，low 1。
- FR-001 至 FR-100、NFR-001 至 NFR-040 未见新增编号断裂；重复的 `§6.3` 仍存在。
