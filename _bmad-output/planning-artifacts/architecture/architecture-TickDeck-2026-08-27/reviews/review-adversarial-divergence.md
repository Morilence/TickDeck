# Reviewer Gate — Adversarial Downstream Divergence (Latest Full Re-run)

**Artifact:** `ARCHITECTURE-SPINE.md`  
**Sources checked:** PRD、addendum、DESIGN.md、EXPERIENCE.md  
**Lens:** 构造两个下游单元，使其都逐字遵守当前 AD，却在共享数据形状、实体所有权、状态写入、阶段开放或恢复语义上产生 Critical/High 不兼容。  
**Verdict:** **PASS** — 未构造出真实 Critical/High 合规分叉；最新 `ajv-errors`/S0 clean-import 修订收紧了契约可执行性，没有扩张产品能力或提前授权后续阶段。  
**Counts:** Critical 0 · High 0

## 新增修订专项复核

### `ajv-errors` 没有形成第二套传输 schema

**攻击对：Browser Form Validator vs Fastify Command Validator**

- Browser 通过 `@hookform/resolvers/ajv` 间接加载 `ajv-errors`。
- Fastify 通过 custom validator compiler 使用 `ContractAjvProfile`。

当前 AD-13/AD-15 已把两者锁到同一 JSON Schema Draft 7、同一 Ajv 8.20.0、同一 strict/coercion/default/removal/format 配置和同一 conformance corpus；`errorMessage` 明确不属于允许的传输 schema 关键字，TypeBox JavaScript-only、async/custom 与 later-draft-only construct 同样被禁止。因此前端不能借 `ajv-errors` 扩展 canonical schema，也不能让自定义错误关键字成为服务端必须接受的契约。服务端仍是 mutation 的最终校验权威。未形成共享数据形状或授权分叉。

### S0 resolver clean-import 没有偷跑 S0-V 或 S3 能力

**攻击对：S0 Build/Contract Harness vs Capability/Gate Registry**

- Build harness 在空 lockfile 下验证 resolver 及其运行依赖可导入，再跑浏览器/服务端契约 corpus。
- Gate Registry 只按 canonical capability catalog 和 PRD 阶段证据注册能力。

PRD §6.6 明确把 S0 定义为“统一工具/数据契约、运行清单、风险策略、沙箱与单工作区访问边界”的契约与安全地基；addendum 也把共享类型与运行时边界交给架构决定。clean-import 只是证明已选契约栈能从干净依赖图构建，不是用户能力、供应商资格、沙箱合规通过或产品假设证据。AD-2 仍规定 S0-V 不建设沙箱/提醒/组合，OQ-03 仍阻塞 S1、OQ-02 仍阻塞 S2，沙箱能力仍需五平台 FR-095/NFR-037 才可注册，策略 UX 最早仍是 S3。该修订没有关闭任何产品 Gate，也没有把 Form Control 的存在变成后续功能授权。

### clean-import 与 component compiler 的 S0 工作未混为一项授权

**攻击对：Frontend Contract Toolchain vs TypeScript→Component Toolchain**

- 前者验证 React Hook Form/Ajv/Fastify 对同一 schema 的 accept/reject 与 normalized output。
- 后者只在 S0 spike 锁定 compiler/componentizer、WIT/WASI、imports、source map 与确定性输出。

AD-12 明确 component 构建后拒绝所有非 TickDeck WIT imports，失败时能力保持未注册；AD-15 的 resolver clean-import 只覆盖前端/HTTP schema 依赖。两者都发生在 S0，不代表其中一个通过即可替代另一个，更不能满足 S3 的策略行为、回测或沙箱发布 Gate。未形成证据复用或阶段越权分叉。

## 完整两单元攻击结果

### 1. Capability build vs runtime Gate

Web/server/worker 不能各自产生自己的 stage 定义：`packages/contracts` canonical capability catalog 是唯一来源，release build 是唯一 producer，三个 slice digest 不一致即 build/release fail；服务端 Gate Registry 仍是 runtime 权威。mock、编译成功、clean-import 或 vendor claim 均不能关闭 Gate。未形成阶段分叉。

### 2. HTTP/stream/cache state

React cache、SSE 与 WebSocket 都只能通知/缓存；HTTP snapshot 与控制面 command handler 是权威。序号缺口必须重新取 snapshot，Zustand/URL/localStorage 不能保存业务真值、secret、session 或 Grant。两个前端单元无法合法建立第二状态机。

### 3. Command handler vs Worker result

每类 mutable domain data 只有一个控制面 handler；所有入口先进入 canonical action registry 与 `OperationIdentity`，SQLite 事务同时提交 state/audit/outbox/job。Worker 只持 lease/fencing epoch 并提交结果，旧 epoch 结果被拒绝。两条合法写路径无法并存。

### 4. Run factories

Backtest、Agent、alert 或 recovery 不能各自定义 RunContext：core 只有一个版本化 discriminated schema和一个控制面 factory/validator，mutable reference 必须携带 snapshot/version，RFC 8785 digest 被 R2/audit/job/artifact/recovery 共用。未形成复现身份分叉。

### 5. R2 tabs/retry vs outbox recovery

R2 Grant 的完整参数、snapshot、状态、policy、cost/egress/portfolio impact 与单次消费在 `BEGIN IMMEDIATE` 中原子绑定；提交后即便失败仍 consumed。outbox 只能续跑同一 operation，外部效果不确定即 `UNCERTAIN`，新尝试必须重新确认。UI 双击、HTTP retry 和 recovery 无法合法创建第二个高风险 operation。

### 6. Secret settings vs Worker/sidecar use

控制面 Secret Broker 是 Vault、platform key store 和 plaintext resolution 的唯一 owner；Worker 只获 operation-scoped、version/epoch/expiry 绑定的内存 lease，sidecar 只获单次短期注入。rotate/revoke 后旧 epoch queued work 被拒绝，不能由 connector pool 保留旧 secret。

### 7. Policy admin vs Egress Gateway

每个外部 attempt 在 dial 前通过控制面单一 SQLite 事务校验当前 DataUse/Egress/Risk/R1/recipient/connector/budget/secret epochs，创建并消费 `ExecutionAuthorization`，同时置 `DISPATCHING`；该事务是明确线性化点。冻结 RunContext 只作证据，不决定当前授权。线性化前后的撤销语义已唯一，Worker 不能合法使用旧 policy 继续拨号。

### 8. Broker retry vs SDK retry

Connector manifest 固定 `EffectSemantics`、provider key 和 reconcile evidence；Broker 是唯一 retry owner。不能关闭的 SDK retry 必须逐 sub-attempt 上报并复用同一 key，否则不得获得 effectful qualification。sent-without-ack 统一转 `UNCERTAIN`。两个 retry loop 无法同时作为合法权威。

### 9. Artifact Service vs Worker/sidecar

控制面是 Artifact Service 唯一 owner；canonical 状态只有 `STAGING → VERIFIED_UNCOMMITTED → COMMITTED → QUARANTINED | DELETED`，领域与 backup 只引用 `COMMITTED`。`ArtifactCapability` 绑定 peer、operation/RunContext、workspace generation、input digests/output slots、verbs、quota、DataUse、expiry 与 fencing epoch；裸 digest/operation ID 无权访问。实际 reads 进入 usage ledger并由控制面生成 lineage。未形成文件/Manifest 双真值或越权读取分叉。

### 10. Market connector vs chart/backtest/portfolio

core 唯一定义 Instrument/Listing/Calendar/Snapshot/CorporateAction/Currency identity 与 canonical mapper；所有能力引用同一 SnapshotRef/digest，裸 symbol 和 mutable `latest` 被禁止。ExecutionAssumption 又统一成交、费用、市场规则和 revision 语义。两个计算单元不能合法用不同经济事实冒充同一结果。

### 11. Live alert vs poll/recovery

`AlertTriggerIdentity` 规范绑定 workspace、alert/version、condition/evaluator、SnapshotRef、window 与 transition，并受数据库唯一约束；level-trigger cadence/window 属于版本化配置。不同入口即使使用不同 HTTP idempotency key，也只能得到已有 Trigger。

### 12. Extension Manager vs Extension Supervisor

Extension Manager 只负责 admission/record/disable/rollback，Supervisor 只启动受监督 sidecar；代码不能动态加载进 server/worker。四类扩展通过 class-specific RPC 与 Broker 的 Gate/DataUse/Egress/Secret/budget/audit 校验，不能自建 DB、artifact path、session、peer connector 或 Agent write path。source/hash/permission/destination 变化按新授权处理。

### 13. Browser session vs proxy identity

本地 bootstrap、远端 workspace admin secret、host-only cookie、CSRF/Host/Origin、trusted proxy source 与 single-use WS ticket 已分工；代理 identity 只作审计归因，不能变成第二套用户/RBAC 授权。会话丢失不取消已提交任务，恢复后旧 generation 的 session/grant/lease/result 全失效。

### 14. Backup builder vs retention sweeper

backup pin 与逻辑 snapshot 在同一 SQLite 事务建立，并带 generation/lease；GC 只删无 committed reference/live pin 的对象，DataUse 强制清理优先且保留 non-reproducible marker。恢复在临时 workspace 校验后原子切换并重置 generation，ambiguous dispatch 保持 `UNCERTAIN`。未形成 pin/GC 或旧授权复活分叉。

### 15. Sandbox compiler vs runner/supervisor

compiler 与 runner 都是一请求一次性受监督子进程；guest 只能使用 TickDeck WIT，构建后 import allowlist 是明确 fail-closed 检查。Wasmtime resource limits、whole-process budget、wall clock、进程树 kill/reap 与五 profile 同版套件分别覆盖 runtime、host 与终止；某 profile 失败即不支持，不能回退到弱隔离。S0 锁定工具链仍只是实施证据，S3 能力不会提前注册。

### 16. Release slices vs supported platform

Release Manifest 锁定版本/hash/SBOM/schema/redistribution/sandbox evidence；五 profile 各自通过安装、升级、恢复、终止和保留数据测试。未通过平台不能靠同名 bundle 或 silent fallback 宣称支持；Windows ARM、跨主机、容器依赖仍明确排除。

## Source and stage preservation verdict

- `ajv-errors` 是现有 resolver 的显式锁定运行依赖，不是新的产品功能、扩展面或公开契约；`errorMessage` 被禁止进入 canonical transport schema。
- S0 clean-import 与 contract corpus直接服务于 PRD 的“统一契约与安全地基”，不替代 S0-V 的 SM-00 产品证据，不关闭 OQ-02/OQ-03，也不满足 S1–S5 任一能力 Gate。
- 最新修订没有引入用户/组织/RBAC、多租户、SaaS、跨主机、公共 REST、在线市场、实盘交易、任意 npm、移动验收、原生桌面壳或离线模式。
- EXPERIENCE 的 Form Control 可在 S0-V 出现仍只是当前阶段表单 primitive；resolver/build 证据不使 S1+ 页面、Risk Gate、Monaco、提醒或组合进入 Capability Manifest。

## Gate recommendation

Adversarial downstream-divergence Reviewer Gate 通过。具体 schema error 文案映射、`ajv-formats` fixture 枚举、capability token wire encoding 和各 provider conformance case 可进入后续 SPEC/测试细化；当前 spine 已固定它们不能改变的 owner、authority、stage、identity 与 fail-closed 结果，因此不构成 Critical/High 架构空洞。
