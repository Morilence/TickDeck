# Reviewer Gate — AD-31 金融十进制对抗分叉最终复核

**Artifact:** `ARCHITECTURE-SPINE.md`  
**Lens:** Adversarial downstream divergence  
**Attack units:** API、server、Worker、SQLite、sandbox/WIT、Web  
**Verdict:** **PASS** — 逐项重放上一轮全部分叉并回归 resource preflight、wrapper guard precision 与 connector parser budgets 加固后，未构造出仍严格遵守当前 AD-31、却在金融值、量化、排序、摘要、WIT 结果或用户可见金额上产生实质不兼容的实现。  
**Residual findings:** 无。  
**Source mutation:** 无；本报告只记录复核结果。

## Canonical findings JSON

```json
[]
```

## 六单元复攻模型

复核没有假设各单元“善意地做成一样”，而是让它们尽量选择不同实现：

- API 尝试接受不同 decimal token、用自己的 envelope/hash 规则；
- server 尝试在入口、primitive 末尾或业务末尾选择不同舍入点；
- Worker 尝试改变批次、线程、分页与 reduction order；
- SQLite 尝试使用 TEXT order、自定义 sortable key 或不完整 record；
- sandbox 尝试自行 parse/convert/构造金融数值或重实现十进制；
- Web 尝试用 `Number`、`parseFloat`、Intl 或图表坐标回写权威值。

当前 AD-31 对这些路径分别使用 lexical/context manifests、单一 core wrapper、确定性 plan/reduction、opaque WIT resource、SQLite recheck、非权威 Web projection 与同源 conformance Gate 加以阻断。任一攻击若要成功，必须明确违反至少一条现有规则。

## 逐项攻击结果

| Divergence class | Adversarial construction | Closing contract in current AD-31 | Result |
| --- | --- | --- | --- |
| Lexical input | API 先 trim/parse，Worker 先 canonical validate；分别接受 `.5`、`1.`、`0.0`、Unicode digit 或负零 | `DecimalStringLexical v1` 固定 ASCII grammar、符号、整数/小数结构和全部拒绝项；validator 必须在 constructor 前运行 | Closed |
| Lossless external ingress | connector 经 `JSON.parse`/SDK number 后转 string，Broker 从原始 token 解析 | 只有 `LosslessNumericIngress v1` 可进入；锁定 `lossless-json` artifact，或使用 decimal string / integer+scale；binary float 字段不得获得资格 | Closed |
| Connector parser budgets | adapter 使用 unlimited parser 或先完整构造深层/超大 JSON，再让 Broker 检查 | connector manifest 固定 response bytes、nesting depth 与 token count；Broker 必须在完整解析前执行，adapter 不得使用 unlimited default | Closed |
| 34-digit input bounds | server 接受 35 位后先舍入，Worker 保留到首次计算 | 非零输入最多 34 个有效数字，最高位指数 `[-6176,6144]`，超限必须报错，禁止截断或舍入 | Closed |
| Decimal context configuration | server/sandbox 使用相同库但让 `minE/maxE/modulo` 等默认值不同 | `DecimalContextManifest v1` 以 digest 冻结 library integrity、允许操作和完整 clone config；不符即拒绝启动 | Closed |
| Context-round timing | server 在表达式末舍入，Worker 每 primitive 舍入，sandbox/wrapper 跨 primitive 保留额外 guard digits | 每个 `FinanceDecimal` primitive 返回时立即执行一次 34 位 half-even；禁止 caller/wrapper 跨 primitive 的 guard precision、fused operation、重排或二次决定时点，同时明确允许 decimal.js 在单个 primitive 内部使用其正确舍入所需的临时精度 | Closed |
| Decimal resource preflight | API/Worker 在 constructor、指数展开、`toFixed()`、BigInt 或 pow/quantize 分配后才发现超限，造成某执行面崩溃而另一处返回错误 | wrapper 在分配前统一校验 6212-byte lexeme、5-digit exponent segment/adjusted exponent、integerPower exponent/result estimate、quantizeScale 与 12355-digit scratch coefficient；超限统一 `RESOURCE_LIMIT`，字段/fuel/heap 只能更严 | Closed |
| Signed zero | 某执行面保留运算生成的 `-0` 并让 sign/branch 观察它 | 每个 primitive result 在比较、分支、hash 或下一运算前先归一成 `0` | Closed |
| Reduction order | Worker 按 chunk/tree 归并，server left-fold，恢复流程按 DB row order | 每个聚合绑定 `DeterministicReductionSpec`，固定稳定排序、tie/duplicate、空集、权重归一、逐项 left-fold 和每节点 context round；其他 tree 必须版本化并进 oracle | Closed |
| Scale quantization | 一处使用 wrapper `quantizeScale`，另一处自行 `toFixed`/round | 只有 manifest 允许的 `quantizeScale` operation 与 `QuantizationPlan` 节点可执行；其他 package不能获得 library instance | Closed |
| Increment quantization | server 用 `div→round→mul`，sandbox 用 nearest，0.05/tick 发生 double-round | 必须提升到同 scale 的 exact integer coefficient，以 quotient/remainder 与 `2×remainder` 判 tie，一次重建；显式禁止 `div→round→mul` | Closed |
| Quantization rule shape | scale 与 increment 同时存在；`UP` 分别解释为 away-from-zero / ceil | `QuantizationRuleSchema v1` 使用 exact-one-of，并把九种 rounding mode 一一映射至 decimal.js 0–8；gap/overlap/conflict fail closed | Closed |
| Quantization boundary plan | 费用 per-fill 先量化或 per-order 汇总后量化；FX 改变运算顺序 | `QuantizationPlan v1` digest 固定 boundary、单位、运算 DAG、context/quantize nodes、cardinality、selector 与输出 envelope | Closed |
| Rule selection time | 按 trade time、settlement date、run time 或 report as-of 选择不同规则 | 每个 plan 固定 timestamp、calendar/timezone 和 `[start,end)`；gap、同优先级 overlap 或 conflict 拒绝 | Closed |
| Decimal evidence | 同一 rule ID 日后内容变化，恢复流程重新查询最新规则 | `DecimalEvidence v1` 在 RunContext 冻结 context/plan/rule-set snapshot 及实际 boundary/market/currency/rule ID+version+content digest；恢复不得重新解释 | Closed |
| SQLite ordering | Q 使用 canonical TEXT lexical order 或另一种 sortable key，Worker 用数值 compare | `DecimalSortKey v1` 给出完整 40-byte BINARY encoding；禁止直接按 DecimalString TEXT 比较，候选查询后仍由 `FinanceDecimal` recheck | Closed |
| SQLite persistence record | DB 把 NULL/missing/unknown 当 0，或保存 value 但缺 unit/rule/context | `FinancialValueRecord v1` 使用 BINARY canonical TEXT、envelope FK/CHECK，并在 read/write 同时调用 core validator；`known/missing/unknown/unsupported` 明确分离 | Closed |
| Digest envelope | API 只 hash value，Artifact 连 unit/context/rule 一起 hash | `FinancialValueEnvelope v1` 固定字段/null 语义与 domain-separated RFC 8785 + SHA-256；value、unit、context、quantization status/plan/rule digest 属于 semantic identity | Closed |
| WIT enforcement | guest parse 动态 string/number、自建 decimal 或返回不同 context 的 value | WIT 使用 host-issued opaque `financial-value` resource；guest 无 parse/render/number coercion/constructor；常量仅编译期 literal + digest manifest，handle 绑定 invocation/context | Closed |
| Chart projection | Web 用 `parseFloat` 或从 chart coordinate 回写提醒/绘图/筛选参数 | `ChartNumericProjection v1` 仅为非权威派生，使用 canonical base + decimal scale + safe integer/error bound；不能读回计算，超界稳定 degraded | Closed |
| Finance display | 不同浏览器用 Intl/Number 重新舍入、补零或格式化金额 | `FinanceDisplaySpec v1` 版本化 display scale/padding/rounding/loss markers；Formatter 只用字符串，Intl 仅对固定 sentinel 取符号和布局，完整 canonical value 可访问 | Closed |
| Error taxonomy | overflow/resource/rule gap/divide-by-zero 分别 crash、clamp、写 0、unknown 或不同 retry | `FinanceDecimalError v1` 固定含 `RESOURCE_LIMIT` 的错误集合及 retryability、持久化/隔离和 Gate 影响；AD-31 同时禁止 clamp、silent zero 和 fallback | Closed |
| Shared oracle | 六个执行面各自维护一套可单独变绿的 fixture | 单一 `DecimalConformanceManifest v1` 绑定 source/context/schema/plan/rule/WIT/sort/display/projection/vector/oracle digests；六面消费同一 vectors，artifact/result 不同即不能过 Gate | Closed |

## Why no compliant divergence remains

当前闭合不是只靠“大家使用 decimal.js”：

1. **计算 owner 唯一。** `packages/core/finance-decimal` 独占库与 mutable instance，server/Worker/API/SQLite adapter 不能各自重实现。
2. **算法输入唯一。** canonical lexical grammar、封闭 34 位值域与 lossless ingress 把进入 wrapper 前的值固定下来。
3. **运算轨迹唯一。** primitive context round、量化 DAG、规则 snapshot 和 deterministic reduction 消除时点与重排自由度。
4. **跨语言权威不复制。** sandbox 只操作 host-issued opaque handle，不能形成 Rust/Wasm/JS 第二 decimal engine。
5. **存储和查询不替代计算。** SQLite record/key 都是受验证的持久化/候选索引，最终边界由同一 FinanceDecimal recheck。
6. **浏览器只投影。** 文本与图表坐标均不可回写为权威输入；超出安全投影范围必须降级。
7. **证据同源。** 六执行面、源代码、配置、schema、WIT、sort key、显示、vectors 和 oracle 都被同一 manifest digest 绑定。

因此，任一单元若要重新获得独立的 parsing、rounding、quantization、sorting、hashing 或 numeric projection 决策权，就会直接违反 AD-31，而不再属于“合规分叉”。

## Post-review hardening regression

### Resource preflight 与 `RESOURCE_LIMIT`

- **Allocation order:** lexeme、exponent、power、scale 与 scratch coefficient 均在 constructor、`toFixed()`、BigInt 或 pow/quantize 分配前检查；无法再构造“server 稳定拒绝、Worker/sandbox 先耗尽资源”的合规路径。
- **Stable outcome:** 超限统一进入 `RESOURCE_LIMIT`，并由 `FinanceDecimalError v1` 固定 retryability、持久化/隔离与 Gate 影响；clamp、zero 或 fallback 仍被禁止。
- **No rounding drift:** preflight 只决定是否允许执行，不改变任何获准输入的 coefficient、primitive round 或 quantization 结果；字段 schema、run fuel 与 heap 只能更严且仍是 fail closed。

### Wrapper guard precision clarification

- **Cross-primitive freedom removed:** caller 与 wrapper 不能跨 primitive 保存额外 digits、融合运算或改变舍入点。
- **Correct primitive behavior preserved:** decimal.js 在单个 primitive 内部为产生正确 34 位 half-even 结果使用临时精度仍被允许；这不是第二个公开 context，也不会被 caller 观察或复用。
- **Shared proof unchanged:** library integrity、wrapper source/context manifest 与逐 primitive vectors 仍由同一 `DecimalConformanceManifest` 绑定。

### Connector parser size/depth/token budgets

- **Owner fixed:** 每个 connector manifest 声明 response bytes、JSON depth 与 token count，Broker 在完整解析前统一执行；adapter 不能选择 unlimited defaults。
- **Numeric fidelity preserved:** 预算检查发生在 lossless token 抽取外围，不授权 `JSON.parse`、binary-float SDK 或 `number → String` 路径。
- **Divergence result:** 同一 connector/version/manifest 的所有尝试共享相同预算；超限稳定拒绝，不会让一个执行面得到被截断的数值、另一个得到完整数值。

## Remaining evidence gates — not findings

- `DecimalContextManifest`、schema、plan、rule、WIT、sort key、display/projection 与 conformance vectors 仍需在实现中生成并由 release build 验证；架构 PASS 不等于实现已完成。
- sandbox opaque resource、constant manifest 与五平台行为仍受 OQ-06/S3 Gate；证据通过前不得注册该能力。
- 各领域 `QuantizationPlan` 和 `DeterministicReductionSpec` 必须随实际阶段能力逐项落地；缺失即 fail closed，不能用默认规则提前启用。

这些是已保留的实施/证据门，不是当前 Architecture Spine 允许两个合规实现得出不同金融结果的开放口。

## Gate recommendation

AD-31 adversarial downstream-divergence Reviewer Gate 通过。保持当前单一 authority、opaque WIT、fail-closed 与 manifest-digest 约束；后续 SPEC/实现只能填充这些合同的 exact schema、vectors 和领域 plan，不得放宽为调用方可选行为。
