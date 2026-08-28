# Reviewer Gate — AD-31 金融十进制对抗分叉审查

**Artifact:** `ARCHITECTURE-SPINE.md`  
**Lens:** Adversarial downstream divergence  
**Focus:** server / Worker / sandbox / SQLite / API / Web 在严格遵守 AD-31 时是否仍可产生不兼容金融结果  
**Verdict:** **FAIL** — AD-31 已锁定库、基础精度、默认舍入和字符串边界，但尚未唯一锁定输入词法、34 位舍入时点、聚合顺序、非十进制 increment 量化算法、规则快照、SQLite 数值查询键、WIT value envelope 与浏览器有损投影。六个执行面仍可各自合规而得到不同筛选、费用、回测、组合、摘要或图表结果。  
**Source mutation:** 无；本报告只记录审查结果。

## 六单元攻击构造

本轮分别构造以下实现，均不直接导入 `decimal.js`，只经 `packages/core/finance-decimal` 或 AD-31 允许的同源沙箱封装：

- **Server S：** 在 HTTP command 边界严格校验字符串，逐条计算并把规范 TEXT 写入 SQLite。
- **Worker W：** 从 RunContext/Artifact 读取相同字符串，批量聚合并提交结果。
- **Sandbox X：** 通过 WIT string 接收数据，用随工具链内置的同一 `FinanceDecimal` 计算策略。
- **SQLite Q：** 只保存 TEXT；查询时使用可重建 sortable key，不执行 REAL/cast/浮点聚合。
- **API A：** 只传 JSON string，并按 RFC 8785 对参数和结果 envelope 计算摘要。
- **Web V：** Formatter 不调用 `Number`/`parseFloat`；图表 adapter 仍需把数值投影到 Lightweight Charts 可接受的坐标。

它们都可以逐字遵守当前 AD-31，仍发生以下真实分叉。

## Canonical findings JSON

```json
[
  {
    "lens": "adversarial",
    "location": "AD-31 — DecimalString 输入与规范化（第 382–384 行）",
    "trigger_condition": "Server 先要求输入已经 canonical，Worker 则先 trim/parse 再用 toFixed() canonicalize；对空白、.5、1.、0.0、-0.0 或 ASCII 之外符号，两者都可引用“只接受十进制文本”与“解析后规范化”而作出不同 accept/reject。",
    "guard_snippet": "固定 DecimalStringLexical v1：以 ASCII byte grammar 给出完整正则/ABNF、是否允许前置负号、小数点两侧最少位数、空白/Unicode/locale separator 的拒绝规则；明确 canonical validator 必须在 decimal.js constructor 前执行，外部 RawDecimalToken 若需转换必须走另一个有来源资格的 core normalizer，不能由各入口 trim/parse。",
    "potential_consequence": "同一 API/Artifact/WIT token 在不同执行面被拒绝、接受或变成不同 idempotency/RunContext digest。"
  },
  {
    "lens": "adversarial",
    "location": "AD-31 — 字段长度/范围与 34 位上下文（第 382 行）",
    "trigger_condition": "Decimal constructor 可精确保留超过 34 位的输入，而 AD-31 只说每个字段受各自 schema 长度/范围约束；Server 可在入口截到 34 位，Worker 可保留 60 位到首次算术，比较操作还可能继续比较未舍入的 60 位值。",
    "guard_snippet": "在 DecimalContextManifest v1 固定全局 coefficient digit、integer digit、fraction scale 与 exponent/result-length 上限，并逐字段只能进一步收紧；明确 parse 是否保留超过 context precision 的精确输入、何时进入 context round，以及 compare/hash/persist 使用 parse value 还是 context-rounded value。超限只能返回稳定错误，禁止截断。",
    "potential_consequence": "筛选阈值比较、排序和首次加减乘对同一 35+ 位输入得到不同结果，且差异会进入持久状态。"
  },
  {
    "lens": "adversarial",
    "location": "AD-31 — decimal.js clone 配置（第 382 行）",
    "trigger_condition": "只锁定 precision 与 rounding，没有锁定 minE/maxE、toExpNeg/toExpPos、modulo、pow precision 或 FinanceDecimal 允许的 operation/error 集；沙箱 bundle 与 server wrapper 可用同版本库但暴露不同配置余项。",
    "guard_snippet": "让 DecimalContextVersion 引用不可变 DecimalContextManifest digest，逐项冻结 decimal.js version/source digest、precision、rounding、minE、maxE、toExpNeg、toExpPos、modulo、powPrecision、允许操作、每操作结果规范化和异常映射；构建时禁止默认值漂移，运行时验证 manifest digest。",
    "potential_consequence": "极小/极大值在一处下溢为零或上溢为 Infinity，在另一处正常；mod/pow/格式化也可能跨执行面不同。"
  },
  {
    "lens": "adversarial",
    "location": "AD-31 — 34 位舍入时点（第 382、386 行）",
    "trigger_condition": "“非终止结果在 34 位舍入”和“业务边界才量化”没有区分 context rounding 与 business quantization，也没有声明每个 primitive operation 后、表达式末尾或持久化前何时应用 34 位精度。",
    "guard_snippet": "固定 ArithmeticEvaluation v1：parse 不舍入或按已拍板规则舍入；每个 FinanceDecimal primitive 的 result 是否立即 context-round；禁止隐式 fused/reassociated 运算；context round 与 QuantizationRule 是两个有不同 event/reason 的步骤。每个 API/WIT op 必须返回已规范化的 post-context value，不能由 caller 再决定一次。",
    "potential_consequence": "a×b+c、FX×price×quantity、收益链乘积在 Server、Worker 与 sandbox 因一次舍入或两次舍入得到不同末位。"
  },
  {
    "lens": "adversarial",
    "location": "AD-31 — 批量聚合与运算顺序（第 382、388 行）",
    "trigger_condition": "34 位有限精度下加法/乘法不再可任意结合；Server 可按交易时间顺序累计，Worker 可分 chunk 并行归并，SQLite 派生流程可按 rowid，三者都只调用 FinanceDecimal 却产生不同和、均值、收益或回撤。",
    "guard_snippet": "为每个权威聚合固定 DeterministicReductionSpec：稳定排序键、duplicate/tie 处理、chunk-independent reduction tree 或禁止并行重排、权重归一顺序、空集语义及中间 context-round 节点；算法版本进入 RunContext/result/audit。不得让数据库行序、线程数或分页边界决定次序。",
    "potential_consequence": "相同交易集合因机器、批大小或恢复路径不同而得到不同组合市值、费用、绩效和结果摘要。"
  },
  {
    "lens": "adversarial",
    "location": "AD-31 — 计算产生的 signed zero（第 382、384 行）",
    "trigger_condition": "入口拒绝负零且边界零只能为 0，但 FinanceDecimal 运算本身可产生 signed zero；一个 wrapper 在每步去符号，另一个只在最终 toFixed 时归一，期间 reciprocal、sign、比较分支或量化方向可不同。",
    "guard_snippet": "明确 signed-zero invariant：每个 primitive result 在进入下一操作前把任意 ±0 归一成 +0，或完整定义内部 signed-zero 语义；禁止暴露 sign-of-zero、1/±0 等可观察分叉。conformance corpus 覆盖负数乘零、相消、极小值量化、除法与序列化。",
    "potential_consequence": "提醒方向、盈亏符号、舍入分支或错误码在某执行面显示 0，在另一执行面按负值路径处理。"
  },
  {
    "lens": "adversarial",
    "location": "AD-31 — minimum increment 量化（第 386 行）",
    "trigger_condition": "对 0.05、0.25、港股 tick 等非 10 的幂 increment，Server 可用 x.div(step).round().mul(step)，sandbox 可用 decimal.js toNearest；前者可能先在 34 位除法处舍入并发生 double rounding，两者仍使用同一规则与 HALF_EVEN。",
    "guard_snippet": "固定 QuantizeToIncrement v1 的单一算法：优先以 DecimalString coefficient/exponent 做 exact integer quotient/remainder 与 tie 判定，或锁定经证明等价的具体 FinanceDecimal primitive；禁止用会先 context-round 的普通 div→round→mul 链。定义负值、exact half、非整 scale increment、极值和结果 scale 规范化。",
    "potential_consequence": "订单价格、费用、税和公司行动在 tick 边界相差一个 increment，并进一步改变成交、风险或组合结果。"
  },
  {
    "lens": "adversarial",
    "location": "AD-31 — QuantizationRule schema（第 386 行）",
    "trigger_condition": "规则可声明 scale“或”increment、rounding mode，但没有可执行 oneOf、scale/increment 范围和 rounding 枚举映射；UP 可被解释为 away-from-zero 或 toward-positive，二者对负数相反。",
    "guard_snippet": "在 packages/contracts 固定 QuantizationRuleSchema v1：scale 与 increment exact-one-of、increment 必须 canonical positive nonzero、scale bounds、允许 rounding enum 到 decimal.js 常量的一一映射、规则不可变 ID+version+digest、冲突定义与稳定错误。禁止自由文本 rounding name 和调用方默认值。",
    "potential_consequence": "同一费用退款、负收益或反向公司行动在不同执行面向零或远离零量化，规则 ID 却看起来相同。"
  },
  {
    "lens": "adversarial",
    "location": "AD-31 — “业务边界”与量化次序（第 386 行）",
    "trigger_condition": "规则没有枚举具体边界；手续费可按每笔 fill 先量化再求和，或汇总后量化；FX 可先量化价格再乘数量，或先算总额再换汇，所有步骤都能声称在一个业务边界舍入。",
    "guard_snippet": "为价格、成交、费用、税、FX、公司行动、现金、持仓、NAV、收益和报告固定版本化 QuantizationPlan：boundary ID、输入单位、运算 DAG、context-round 节点、quantize 节点、per-fill/per-order/per-day/per-report cardinality、输出单位和 rule selector。计划版本/digest进入 RunContext与结果。",
    "potential_consequence": "回测与模拟组合即使使用同一行情、同一费率和同一 QuantizationRuleId，仍产生不同现金、持仓与绩效。"
  },
  {
    "lens": "adversarial",
    "location": "AD-31 — 规则生效区间与重跑冻结（第 386 行）",
    "trigger_condition": "QuantizationRule 有生效区间，但没有规定按 trade time、data time、settlement date、run creation time 还是 report as-of 选规则，也没有区间端点/时区与 overlap/gap 的唯一算法。",
    "guard_snippet": "固定 RuleSelectionContext：每个 boundary 指定唯一 selection timestamp/calendar/timezone，区间统一为 [start,end)，相同 specificity 的 overlap fail closed，gap 的 allowed/not-applicable 状态显式。RunContext 必须冻结 rule-set snapshot digest 与实际 rule versions，不只记录可被重新解释的 ID。",
    "potential_consequence": "跨费率变更日、公司行动日或时区边界的恢复/重跑使用不同规则，历史结果无法复现。"
  },
  {
    "lens": "adversarial",
    "location": "AD-31 与 AD-4 — DecimalContextVersion/QuantizationRuleId 证据（第 138、386 行）",
    "trigger_condition": "RunContext 只要求记录 context version 与“所用”rule ID；动态多市场、多币种、多日期运行可能用多个规则，而且同 ID 后面的内容是否不可变、是否绑定 digest 未明确。",
    "guard_snippet": "把 DecimalEvidence 固定为 RunContext 的 immutable manifest：context manifest digest、quantization plan digest、rule-set snapshot digest及按 boundary/market/currency/effective interval 的 exact rule ID+version+content digest；执行结果附实际使用集合。ID 内容变化必须生成新 version，恢复只能解析冻结 manifest。",
    "potential_consequence": "同一 RunContext digest 在不同时间解析到不同量化内容，或报告只记录一个 ID而遗漏实际影响结果的其他规则。"
  },
  {
    "lens": "adversarial",
    "location": "AD-31 — SQLite TEXT 与 sortable/index key（第 384 行）",
    "trigger_condition": "SQLite 不做 cast/浮点聚合仍可直接以 TEXT collation 做 ORDER BY/range，或各 repository 生成不同 sortable key；派生 key 虽非真值，却直接决定筛选、分页、top-N 和提醒候选。",
    "guard_snippet": "固定 DecimalSortKey v1 的 byte encoding、version、sign/exponent/coefficient normalization、field bounds、BINARY collation与从 canonical value 重建/校验算法；所有权威 numeric order/range/top-N 查询只能使用该 key 后由 FinanceDecimal recheck 边界，禁止直接比较 DecimalString TEXT。key version/digest 随 migration 管理。",
    "potential_consequence": "2、10、-1.2 在 API/SQLite/Worker 中排序和范围筛选不同，导致候选集、分页与提醒结果不一致。"
  },
  {
    "lens": "adversarial",
    "location": "AD-31 — SQLite 持久化 envelope（第 384、386 行）",
    "trigger_condition": "只规定 TEXT 和“独立单位/规则字段”，没有规定 DB CHECK、NULL/missing/unknown 与 0 的 union、rule/context 字段必填关系和 read-time validation；migration/import 可写入语法正确但语义不完整的行。",
    "guard_snippet": "固定 FinancialValueRecord v1 与 SQLite mapping：value、unit、context version、quantization status/rule/plan、provenance ref 的 required/nullable discriminated union；0、missing、unknown、unsupported 不可互换。Repository 每次写入和读取都用同一 core validator，schema 使用 BINARY/CHECK/FK 防止非 canonical text 与 dangling rule，并定义 quarantine 错误。",
    "potential_consequence": "Server 把 NULL 当 unknown，Worker 恢复时当 0；相同 value text 因缺失 unit/rule 元数据被错误合并或计算。"
  },
  {
    "lens": "adversarial",
    "location": "AD-31 与 Digests convention（第 384、396 行）",
    "trigger_condition": "DecimalString 本身 canonical，但没有规定金融摘要究竟只 hash value string，还是同时绑定 unit、context、quantization plan/rule/status；API 与 Artifact 可对同一数值 envelope 产生不同 semantic digest。",
    "guard_snippet": "固定 FinancialValueCanonicalEnvelope 与 domain-separated digest：明确字段名、required/null 语义、unit canonical ID、DecimalContextManifest digest、QuantizationPlan/rule digest、value status和provenance/snapshot引用哪些属于 semantic identity。所有 API、RunContext、Artifact、audit、SQLite receipt 与 WIT 使用同一 schema和测试向量。",
    "potential_consequence": "10 CNY 与 10 HKD、量化前 10 与按规则量化后的 10 可能摘要相同，或同一操作跨 API/Worker 被误判为参数冲突。"
  },
  {
    "lens": "adversarial",
    "location": "AD-31 — WIT DecimalString 边界（第 388 行）",
    "trigger_condition": "WIT 只锁定 string 而未锁定 record shape、长度、unit/context/rule coupling 和双向验证；guest 可返回 canonical value 但伪造/省略元数据，host 也可在验证前把字符串构造成 Decimal。",
    "guard_snippet": "固定版本化 WIT FinancialValue record，使用 string value + canonical unit ID + context manifest digest + quantization status/rule/plan ref；host→guest 与 guest→host 都先执行同一 lexical/length/range/envelope validator，再创建 FinanceDecimal。工具链嵌入同一 finance-decimal source/context manifest digest，handshake 不匹配即拒绝。",
    "potential_consequence": "Sandbox 与 Worker 对同一个策略结果采用不同币种、规则或 precision 解释，恶意/错误 guest 还能绕过入口约束。"
  },
  {
    "lens": "adversarial",
    "location": "AD-31、AD-16 — browser/chart 数值投影（第 256、388 行）",
    "trigger_condition": "FinanceFormatter 禁止 Number/parseFloat，但 Lightweight Charts 接收 JavaScript number；AD-31 没有定义 Web adapter 是否、何时及如何把 DecimalString 有损投影到坐标，两个浏览器可选 parseFloat、缩放整数或相对基准并显示不同 bar/crosshair。",
    "guard_snippet": "固定 non-authoritative ChartNumericProjection v1：server或共享 adapter 从 DecimalString 生成明确标记的 display-only safe coordinate、scale/base、可逆 label source、overflow/precision-loss状态和误差界；crosshair/table/tooltip 始终显示原 canonical string经Formatter生成的文本，selection/alert/calculation绝不读回坐标。五浏览器/系统WebView使用同一投影oracle。",
    "potential_consequence": "同一 K 线在不同浏览器出现不同高低点、crosshair/绘图吸附位置，甚至用户从图上触发的参数被错误回写为浮点权威值。"
  },
  {
    "lens": "adversarial",
    "location": "AD-31 — Web FinanceFormatter（第 388 行）",
    "trigger_condition": "Formatter 知道来源显示精度与量化元数据，但没有规定显示补零、超出 display scale 时是保留还是再次舍入、负数/大数分组和 locale digit policy；不同 Web 实现可显示不同金额而都不回写。",
    "guard_snippet": "固定 FinanceDisplaySpec v1：authoritative value 永不再次业务舍入；每类字段选择 display scale、padding、truncation prohibition、overflow/unknown标记、ASCII canonical source与locale symbol/digit mapping。Intl 只能通过formatToParts对固定安全sentinel提取符号/布局，不能接收金融值。显示文本oracle覆盖zh-CN/en-US、极值和系统WebView。",
    "potential_consequence": "API/审计值相同但 UI、导出或报告显示不同，用户据此确认的 R2 金额或风险影响不一致。"
  },
  {
    "lens": "adversarial",
    "location": "AD-31 与 Errors convention（第 382–388、400 行）",
    "trigger_condition": "输入超限、结果溢出、除零、无效根、inexact、规则缺失、量化冲突和 display projection loss 没有稳定 decimal error taxonomy；各执行面可失败、clamp、返回unknown或继续。",
    "guard_snippet": "固定 FinanceDecimalError v1 codes 与 operation outcome：INVALID_LEXEME、NON_CANONICAL、OUT_OF_FIELD_RANGE、CONTEXT_OVERFLOW、DIVIDE_BY_ZERO、INVALID_OPERATION、RULE_MISSING、RULE_CONFLICT、QUANTIZATION_OVERFLOW、PROJECTION_LOSS 等；逐 code 规定 retryability、是否可持久化、Gate impact和禁止的fallback。禁止 clamp、silent zero、NaN/Infinity string。",
    "potential_consequence": "相同异常数据在 Server fail closed、Worker 产出 0、sandbox FAILED、Web 显示空白，运行状态和证据彼此不兼容。"
  },
  {
    "lens": "adversarial",
    "location": "AD-31 — 跨执行面 oracle corpus（第 388 行）",
    "trigger_condition": "只列测试主题，没有锁定 vector schema、expected intermediate/quantized/envelope/digest/error、实现 artifact digest 和逐执行面消费方式；六个单元可各自维护一套都变绿的 corpus。",
    "guard_snippet": "固定 DecimalConformanceManifest v1：绑定 finance-decimal source/context/plan/rule/WIT/schema/test-vector/oracle digests；每个 vector 包含 lexical outcome、每 primitive intermediate、context-rounded value、quantization evidence、canonical envelope/digest、SQLite sort key、WIT roundtrip、display/projection和stable error。release build从同一manifest生成server/worker/sandbox/API/SQLite/Web tests，任一slice或结果不一致即Gate失败。",
    "potential_consequence": "测试名义覆盖 tie/FX/费用，却遗漏真正发生分叉的中间舍入、摘要或WIT/browser路径，发布后才出现不可复现结果。"
  }
]
```

## Findings — Markdown rendering

### 1. 输入 grammar 没有唯一 accept/reject 结果

- **Location:** AD-31 第 382–384 行
- **Trigger:** “只接受十进制文本”与“解析后规范化”允许先校验或先 trim/parse 两种实现。
- **Guard:** 增加 ASCII `DecimalStringLexical v1`；canonical validator 必须先于 constructor，供应商原始 token 使用独立、来源限定的 core normalizer。
- **Consequence:** HTTP、Artifact、WIT 对同一 token 的值和 digest 不一致。

### 2. 34 位 precision 没有定义输入精度

- **Location:** AD-31 第 382 行
- **Trigger:** decimal.js constructor 可保留 34 位以上输入，而字段限制没有统一 coefficient/scale 上限与 parse-round 时点。
- **Guard:** 在 `DecimalContextManifest` 固定全局/字段 bounds、parse 保真和首次 context round 语义；超限只能报稳定错误。
- **Consequence:** 比较、首次计算和持久化可分别使用 60 位或 34 位值。

### 3. decimal context 只锁了两个配置项

- **Location:** AD-31 第 382 行
- **Trigger:** `minE/maxE/modulo/powPrecision` 等仍可使用不同默认值或 wrapper API。
- **Guard:** `DecimalContextVersion` 必须引用包含完整 clone config、operation set、source digest 与错误映射的不可变 manifest。
- **Consequence:** 极值、mod/pow 与异常结果跨 server/sandbox 漂移。

### 4. context rounding 与业务量化没有分层

- **Location:** AD-31 第 382、386 行
- **Trigger:** 34 位舍入可能发生在每 primitive、表达式末或持久化前。
- **Guard:** 固定 `ArithmeticEvaluation v1`，逐 primitive 声明 result round/normalize；单独记录 context round 与 quantization。
- **Consequence:** `a×b+c`、FX、收益链在不同执行面末位不同。

### 5. 批量 reduction 顺序未固定

- **Location:** AD-31 第 382、388 行
- **Trigger:** Worker 并行 chunk、Server 时间顺序与恢复 row order 均调用同一 wrapper，却因有限精度非结合而不同。
- **Guard:** 为权威聚合固定排序键、reduction tree、tie/duplicate、空集和算法版本。
- **Consequence:** 组合市值、费用、绩效随线程数或分页变化。

### 6. 运算产生的负零仍可影响后续步骤

- **Location:** AD-31 第 382–384 行
- **Trigger:** 只拒绝输入负零，未规定内部 primitive result 的 signed-zero normalization。
- **Guard:** 每 primitive 后归一 ±0，禁止 sign-of-zero 可观察分支，并加入相消/量化/除法 vectors。
- **Consequence:** 盈亏符号、提醒方向和错误结果漂移。

### 7. 非十进制 increment 可 double-round

- **Location:** AD-31 第 386 行
- **Trigger:** `div→round→mul` 与 `toNearest` 对 0.05/tick 边界不保证等价。
- **Guard:** 固定 `QuantizeToIncrement v1`，使用 exact quotient/remainder tie 判定或唯一被证明等价的 primitive。
- **Consequence:** 订单/费用/税相差一个 tick。

### 8. QuantizationRule 不是可执行的唯一 schema

- **Location:** AD-31 第 386 行
- **Trigger:** scale/increment one-of、范围和 UP/DOWN 等 rounding 语义未锁定。
- **Guard:** 固定规则 schema、枚举到 decimal.js constant 的一一映射、不可变 ID/version/digest 和 stable conflict error。
- **Consequence:** 负数退款或收益向相反方向量化。

### 9. “业务边界”没有运算 DAG

- **Location:** AD-31 第 386 行
- **Trigger:** per-fill 先量化后汇总与订单汇总后量化都可声称正确。
- **Guard:** 为价格、成交、费税、FX、公司行动、现金、NAV 等固定版本化 `QuantizationPlan` 与 boundary/cardinality/order。
- **Consequence:** 同规则 ID 仍得到不同现金、持仓、回测与绩效。

### 10. 有效规则选择时间不唯一

- **Location:** AD-31 第 386 行
- **Trigger:** trade time、settlement date、data time 或 report as-of 都可能选择不同生效区间。
- **Guard:** 固定 timestamp/calendar/timezone、`[start,end)`、overlap/gap 语义，并冻结 rule-set snapshot digest。
- **Consequence:** 跨规则变更日的恢复/重跑不可复现。

### 11. RunContext 没冻结完整 decimal evidence

- **Location:** AD-4 第 138 行、AD-31 第 386 行
- **Trigger:** 多市场运行使用多条规则，但只记录 context version 与“所用 ID”。
- **Guard:** 冻结 context/plan/rule-set manifests 及实际 rule ID+version+digest 集合。
- **Consequence:** 相同 RunContext digest 日后解析出不同量化内容。

### 12. SQLite TEXT 排序仍会改变金融结果

- **Location:** AD-31 第 384 行
- **Trigger:** 禁止 cast/REAL 不等于禁止 lexical ORDER BY；sortable key 又没有唯一 encoding。
- **Guard:** 固定 `DecimalSortKey v1`、BINARY collation、migration/version，并在边界由 FinanceDecimal recheck。
- **Consequence:** range、top-N、分页与提醒候选集不同。

### 13. 持久化 record 没区分 missing 与 zero

- **Location:** AD-31 第 384、386 行
- **Trigger:** value/unit/rule 是“独立字段”，但 required/null/discriminated union 与 DB constraints 未定义。
- **Guard:** 固定 `FinancialValueRecord v1`、repository read/write validator、CHECK/FK 与 quarantine 语义。
- **Consequence:** NULL 被一处视为 unknown、另一处视为 0，或 dangling rule 被继续计算。

### 14. 金融值摘要没有统一 envelope

- **Location:** AD-31 第 384 行、Digests 第 396 行
- **Trigger:** API 可只 hash value，Artifact 可连 unit/rule/context 一起 hash。
- **Guard:** 固定 domain-separated `FinancialValueCanonicalEnvelope`，明确 semantic identity 中的 unit/context/plan/rule/status/provenance。
- **Consequence:** CNY/HKD 或量化前后相同文本误碰撞，幂等冲突跨执行面不同。

### 15. WIT string 没绑定金融元数据

- **Location:** AD-31 第 388 行
- **Trigger:** guest 可返回 canonical string，但 host/guest 对 unit、context、rule 和 length/range 的验证不同。
- **Guard:** 固定 WIT `FinancialValue` record、双向同一 validator 和 finance-decimal/context source digest handshake。
- **Consequence:** sandbox 结果被 Worker 用另一币种或量化规则解释。

### 16. 图表需要有损 number，但规则未定义

- **Location:** AD-16 第 256 行、AD-31 第 388 行
- **Trigger:** Formatter 禁止 Number，Lightweight Charts 却需要 numeric coordinate；不同 adapter 会自行 parseFloat/scale。
- **Guard:** 固定 display-only `ChartNumericProjection v1`，带 scale/base/loss 状态与误差界；tooltip/table 永远来自原 canonical value，坐标不得回写。
- **Consequence:** 浏览器/WebView 图形、crosshair 和绘图吸附位置不一致。

### 17. Formatter 的显示精度仍可分叉

- **Location:** AD-31 第 388 行
- **Trigger:** 补零、超 display scale、负数/极值和 locale digits 的处理未锁定。
- **Guard:** 固定 `FinanceDisplaySpec v1`；Intl 只对固定 sentinel 取符号/布局，金融文本由字符串算法渲染并有双语 oracle。
- **Consequence:** R2 确认金额、报告和 UI 展示不同，虽未回写仍会改变用户决定。

### 18. 错误与 corpus 不能保证六面同结果

- **Location:** AD-31 第 382–388 行、Errors 第 400 行
- **Trigger:** overflow、invalid op、rule gap、projection loss 可被分别处理；测试主题也未绑定唯一 vector/oracle manifest。
- **Guard:** 固定 `FinanceDecimalError v1` 与 `DecimalConformanceManifest v1`，包含每步中间值、量化证据、envelope/digest、SQLite key、WIT/Web结果和 exact artifact digests。
- **Consequence:** 六个执行面各自测试全绿，生产中却以 fail、0、unknown 或不同末位结束。

## Exact tightening set

建议把收紧项合并为以下八个承重合同，不新增产品能力：

1. `DecimalStringLexical v1` + `FinancialValueRecord v1`；
2. `DecimalContextManifest v1` + `FinanceDecimalError v1`；
3. `ArithmeticEvaluation v1` + 各领域 `DeterministicReductionSpec`；
4. `QuantizationRuleSchema v1` + `QuantizeToIncrement v1` + `QuantizationPlan`；
5. immutable `DecimalEvidence`（context/plan/rule-set snapshots 与 digests）；
6. `DecimalSortKey v1` + `FinancialValueCanonicalEnvelope`；
7. WIT `FinancialValue` record + `ChartNumericProjection v1` + `FinanceDisplaySpec v1`；
8. `DecimalConformanceManifest v1`，由 release build 生成六执行面同源测试 slice。

这些合同应由 `packages/core/finance-decimal`、`packages/contracts` 与 `packages/testkit` 共同承载；SQLite、WIT、API、Worker、sandbox 和 Web 只能消费生成物。它们不会授权任何 S1–S5 能力提前开放，只会让已经获 Gate 的金融计算具有唯一可复现语义。

## Re-review condition

只有当输入 grammar、context manifest、运算/聚合顺序、量化 DAG、规则快照、DB key/envelope、WIT record、浏览器投影及同源 oracle 都形成可执行且可摘要的唯一合同后，才能重新构造六单元并判定本专项 Gate 是否转为 PASS。
