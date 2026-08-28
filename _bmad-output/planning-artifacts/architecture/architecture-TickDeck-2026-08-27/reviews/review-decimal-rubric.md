# Reviewer Gate — Good-spine Rubric Walker（AD-31 权威十进制）

- **评审对象：** `../ARCHITECTURE-SPINE.md`
- **评审日期：** 2026-08-28
- **重点：** AD-31 的可执行性、金融数值覆盖、PRD/UX/SPEC 保留、阶段 Gate 与范围控制
- **机械检查：** `lint_spine.py` PASS，0 findings
- **Gate verdict：** **CHANGES REQUIRED**。AD-31 已正确固定单一库、规范字符串、SQLite/WIT/HTTP 边界、量化规则与跨执行面 oracle，且没有新增产品能力或提前开放阶段；但“34 位运算舍入”与“只在业务边界舍入”互相冲突，外部供应商输入和不可信 TypeScript 脚本仍可在进入规范字符串前经过 binary float，使 Rule 的核心保证尚不可执行。

## Critical / High findings

### H-01 — 34 位 context rounding 与“只在业务边界舍入”是两个不兼容算法

- **位置：** ARCHITECTURE-SPINE.md:382、386、388
- **Rubric：** 每个 Rule 必须可执行并实际阻止其 `Prevents` 所述分叉；同一决策内不能允许两个数值语义。
- **证据：** AD-31 把 `decimal.js` clone 固定为 `precision=34`、`ROUND_HALF_EVEN`，同时规定“舍入只能发生在版本化 `QuantizationRule` 声明的业务边界”。`decimal.js` 官方语义是：所有返回 Decimal 的计算通常都会按 configured significant-digit precision 舍入；加、减、乘也不是无限精度中间值。因此一个实现可以每个运算节点都按 34 位舍入，另一个实现可以保留 guard digits、只在 tick/fee/currency 等业务边界量化，二者都能声称符合当前文字，但在长链、抵消、累计、FX 和组合聚合中给出不同结果。
- **附带分歧：** 即使统一每步 34 位，不同 fold/分组/并行归约顺序也可能产生不同结果；当前没有要求持仓、P&L、收益、FX 和筛选聚合使用稳定排序与固定 evaluation graph。
- **所需处置：** **Discuss / then fix before handoff.** 明确区分并固定：
  - `ContextRounding`：若选择 decimal.js 原生 34 位语义，就明确每个 arithmetic operation 的返回值都按 34 位 half-even；这不是领域量化，任何实现不得保留另一套 guard precision。
  - `DomainQuantization`：只在 `QuantizationRule` 指定的市场/币种/费用/税/公司行动边界执行 scale/increment rounding；不得把 context rounding 误记为 QuantizationRule。
  - 或者反向选择“高 guard precision + 业务边界才舍入”，但必须更改 clone precision/算法并给出唯一 guard policy，不能保留现有两种表述。
  - 对 sum/average/P&L/portfolio/FX 等聚合固定输入排序、fold 算法与 calculation version；禁止依赖 SQL row order、对象枚举顺序或非确定性 parallel reduction。
  - oracle 增加超过 34 位的乘加、灾难性抵消、不同排列归约、正负 tie 和跨币种累计 fixture。
- **外部核验：** [decimal.js README](https://github.com/MikeMcl/decimal.js/) 与 [API reference](https://mikemcl.github.io/decimal.js/) 均说明 calculations 按 constructor 的 `precision` significant digits 和 `rounding` 处理，而不只在除法时舍入。

### H-02 — 外部连接器没有“词法保真”入口，JSON number 可在 AD-31 校验前丢精度

- **位置：** ARCHITECTURE-SPINE.md:178、348、382–384；FR-001–FR-007
- **Rubric：** Rule 必须覆盖真实系统边界；命名的序列化合同不能在到达 validator 前已被破坏。
- **证据：** AD-31 要求所有入口拒绝 JavaScript `number`，只接受 decimal text，并允许保留 raw provider token；但未规定 connector 如何从供应商 HTTP/SDK/file/db 响应中取得该 token。标准 `JSON.parse` 会先把 JSON numeric token 转成 IEEE-754 number，之后 `String(number)` 或 `new Decimal(number)` 不能恢复原始值。供应商 SDK 也可能只返回 number。官方 decimal.js 文档明确展示超过约 15 位、极值或先做 JS arithmetic 时的精度损失。
- **为何是 High：** 这是所有真实行情、基本面、费用和 FX 数据的共同入口。若 adapter A 使用 lossless parser、adapter B 使用普通 JSON/SDK number，二者都会输出合法 `DecimalString`，但第二条路径已经把错误值合法化；下游 schema、SQLite 和 oracle 无法知道它曾丢精度。
- **所需处置：** **Autofix architecture rule.** 在 Connector Broker/contract 中固定一个 `LosslessNumericIngress`：
  - HTTP/file JSON 必须以 source-text-aware/lossless decoder 保留 numeric token，或供应商字段本身提供 decimal string；禁止 `JSON.parse → number → String`。
  - SDK/DB 只有能提供 decimal/string/integer+scale 或可证明安全范围的精确整数时才可获得相应金融字段资格；只返回 binary float 的字段必须标为不合格/未知，不能伪装为精确值。
  - 明确“外部词法 token → 严格解析/规范化 → DecimalString”发生在哪个唯一 adapter boundary；指数 token 是明确拒绝还是以词法方式规范化，不能由 connector 各自选择。
  - connector conformance 增加 `88259496234518.57`、长小数、极值、负零、指数 token 和 SDK-number rejection fixture。

### H-03 — 不可信 TypeScript 可以先用 `number` 算完再返回合法 DecimalString

- **位置：** ARCHITECTURE-SPINE.md:216–220、262、382、388；OQ-06
- **Rubric：** 禁止项必须由边界/工具链执行，不能只靠作者自律；新 AD 不得夸大沙箱能证明的语义。
- **证据：** AD-31 规定沙箱内置同一 `FinanceDecimal` 且“不得用普通 `number` 绕过”，但 WIT 金融输入/输出仍是字符串。普通 TypeScript/JavaScript 代码可以读取 DecimalString，调用 `Number`/`parseFloat`、一元或二元浮点运算，再把结果转成一个语法合法的 DecimalString。边界 validator 只能验证结果格式，无法证明计算路径没有 binary float。
- **为何是 High：** 指标、策略、提醒和回测会消费脚本结果；如果脚本结果被当作 AD-31 权威值，当前合同的核心 `Prevents` 在最不可信的执行面上不可强制执行。OQ-06 的编译/沙箱证据尚未自动解决这一语义问题。
- **所需处置：** **Discuss / then fix before handoff.** 二选一并写成可测机制：
  - 严格路线：金融值在 guest 中使用 opaque branded/host-owned handle，运算只能调用 `FinanceDecimal` host/guest capability；compiler capability check、受限 globals/types 与 post-compile inspection 共同拒绝金融值到 `number` 的 coercion，WIT 不把可任意重解析的 raw string 当作计算对象；固定绕过对抗 fixture。
  - 诚实降级路线：允许用户脚本内部使用 number，但脚本输出必须标为 `user-script numeric artifact`，不得宣称符合权威十进制计算合同；进入提醒、回测或组合前由确定性 core 工具重算/验证，无法重算时保持显式非权威状态。此路线不能继续写“所有 sandbox 金融值均无 binary float”。
  - 无论选择哪条，都保持 OQ-06 及 S3 Gate：架构决策完成不等于编译器/五平台证据已通过。

## Medium findings

### M-01 — 模型价格、Token 成本与预算未明确进入 AD-31

- **位置：** AD-31 Binds:380；Capability map:538；PRD FR-054、FR-062、FR-065、FR-069、FR-091
- **Rubric：** 覆盖 driving SPEC 能力；不能让相邻模块为同类金额另选数值语义。
- **证据：** AD-31 的 Binds 明示 FR-001–FR-064 后跳到 FR-084–FR-096，Capability map 的 FR-065–FR-069 模型配置与资格也未引用 AD-31；但 FR-065 包含 provider pricing，FR-069 展示费用估算，FR-062/FR-091 又使用成本预算和风险。这样 models/Agent risk 可以合理地把单价、累计费用和预算实现为 JS number，而投资金额/税费使用 FinanceDecimal。
- **所需处置：** **Autofix.** 把模型/数据服务单价、预算、累计外部费用及 R2 cost estimate 明确纳入 AD-31，并在 CAP-8 映射 AD-31；若某个 Token/count 字段保留 integer，明确“计数是受范围约束的 integer，金额/单价/预算是 DecimalString”，避免把所有运行计数误做十进制金额。

## Good-spine checklist walk

| Checklist item | Verdict | Notes |
| --- | --- | --- |
| Fixes real divergence points for the level below | **PARTIAL** | 库、封装、序列化、存储、量化和显示已固定；H-01–H-03 仍允许三个入口产生不兼容真值。 |
| Every AD Rule is enforceable and prevents its stated divergence | **FAIL** | core/SQLite/Web 路径可执行；外部 JSON/SDK 与任意 TS 脚本路径尚不能执行“binary float 永不成为权威”。 |
| Nothing deferred can hide a load-bearing decision | **PARTIAL** | OQ-06 正确保留编译器/五平台证据 Gate，但不能用 OQ-06 替代 H-03 所需的 decimal enforcement 机制选择。 |
| Named technology is verified-current | **PASS** | npm registry 于 2026-08-28 确认 `decimal.js` 当前版本为 10.6.0、MIT；精确版本已进入 Stack。 |
| Ratifies rather than contradicts brownfield code | **N/A** | 当前无产品代码，属于 greenfield build substrate。 |
| Covers the driving SPEC capabilities | **PARTIAL** | 行情、图表、筛选、提醒、策略、组合、Agent 工具与风险均覆盖；模型 pricing/cost/budget 映射缺口见 M-01。 |
| Does not weaken earlier ADs | **PASS with caveat** | 与 AD-3、AD-4、AD-10、AD-13、AD-17、AD-23、AD-27、AD-28 一致；H-03 必须继续受 AD-12/OQ-06 证据 Gate，不能以 ADOPTED 标签越过。 |
| Every owned dimension is decided/open | **PARTIAL** | 传输、持久化、显示、规则版本与 corpus 均覆盖；计算舍入层次、外部词法入口和 guest enforcement 尚未闭合。 |

## PRD / UX / SPEC reconciliation

### PRD and addendum

**PASS with M-01 caveat.** AD-31 正确支持 A/港股币种、费用、税、滑点、最小单位、公司行动、多币种现金、收益/回撤、确定性回测与 SM-12 oracle；没有改写数据许可、资产范围、实盘排除或 Agent 决策边界。34 位精度和 half-even 是架构实现选择，不是新增用户能力。

### DESIGN and EXPERIENCE

**PASS.** `FinanceFormatter` 仍只负责显示；数字字体、双语、币种/复权披露、事实/确定性计算/模型解释/未知分区、回测费用/税/滑点披露均被保留。AD-31 不新增页面、导航、交易动作或 UX teaser。

### SPEC and stage gates

**PASS.** SPEC 已将 AD-1–AD-31 作为 adopted architecture companion，contract-index 把十进制“选型”标记 Resolved，同时明确 A/港股/多币种 oracle、WIT/五平台 conformance 仍是对应能力 Gate。AD-31 没有注册任何新 capability，也没有把 S1 数据、S2 Agent、S3 沙箱或 S4 模拟组合提前开放；OQ-03、OQ-06 和全部阶段 ceiling 保持不变。

## Positive observations

- `decimal.js` 被限制在 `packages/core/finance-decimal` 的独立 clone，而不是让各 package 自行配置；方向正确。
- `DecimalString + unit/currency + QuantizationRuleId` 分离避免把显示 scale 混入数值真值。
- HTTP、Local RPC、WIT、RunContext、artifact、audit、digest 与 SQLite TEXT 的同一合同覆盖充分，明确排除了 SQLite REAL/SQL float aggregate。
- `DecimalContextVersion` 与量化规则随 run/回测/订单/组合/报告冻结，符合恢复和重跑不得静默漂移的上游要求。
- Web 禁止 `Number`/`parseFloat` 后再格式化，oracle 覆盖 API→SQLite→WIT→Web 往返，正确保护 UX 只做投影。

## Recommended gate disposition

先关闭 H-01 的唯一运算/舍入语义、H-02 的 lossless connector ingress 和 H-03 的 sandbox enforcement/诚实降级边界，再重跑 rubric walker。M-01 可作为同次映射修复。无需重开“是否采用 decimal.js”这一已采纳选型，也无需改变任何产品阶段或范围。
