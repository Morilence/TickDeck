# Reviewer Gate — B/S 与 Tauri 桌面双入口对抗分叉审查

**Artifact:** `ARCHITECTURE-SPINE.md`  
**Lens:** Adversarial downstream divergence  
**Focus:** 共享数据形状、权威、bootstrap/session、进程所有权、Capability Gate、生命周期、data-root 锁、安装/升级/回滚与验收证据  
**Verdict:** **FAIL** — “一个业务 payload、两个入口”的方向成立，但当前 AD 仍允许独立实现的 B/S 与桌面单元在共同 data root、附着会话、版本切换和发布证据上产生不兼容分叉。以下问题需要在 AD-30、AD-6、AD-18、AD-20 及 Consistency Conventions 中收紧后再复核。  
**Source mutation:** 无；本报告只记录审查结果。

## 攻击构造

本轮独立构造两个都遵守现有 AD 的交付单元：

- **Unit B — B/S archive：** 从签名 archive 安装到 install root B，使用自己的 `bootstrap + versions/<release-id> + current`，执行 `product-supervisor serve`；本地交互模式采用平台 application-data 缺省目录和 TTY 配对码，远端模式采用显式 data root 与 trusted proxy。
- **Unit D — Tauri desktop：** 从签名桌面 envelope 安装到 install root D，使用自己的 `bootstrap + versions/<release-id> + current`，由 Tauri 启动同 target-triple 的 product-supervisor sidecar；采用平台 application-data 缺省目录、inherited-pipe bootstrap、系统 WebView 和同一 Fastify/SPA。

两者都不建立第二套领域内核、API 或前端，也都使用 AD-18 所列 payload 内容、AD-6 会话和 AD-2 Gate。审查问题不是它们是否“明显违规”，而是它们仍可分别选择合理实现并在同一主机、同一逻辑 workspace 或相邻版本间发生下列分叉。

## Canonical findings JSON

```json
[
  {
    "lens": "adversarial",
    "location": "AD-30 — 发行版布局与 data root（第 362 行）",
    "trigger_condition": "B/S 与 Tauri 都把各自的 platform application-data 目录解释为缺省 data root，但 bundle ID、目录名、大小写、符号链接或 Windows 路径规范化不同。",
    "guard_snippet": "在 packages/contracts 固定 DataRootSpec v1：逐 profile 指定唯一缺省绝对目录、CLI/desktop/service 的同一解析算法、大小写与分隔符规范、symlink/reparse-point/no-follow 规则、目录 file identity、workspace_id、owner/ACL 和拒绝项；必须先解析并验证 canonical root，再读取配置、打开 SQLite 或取得锁。",
    "potential_consequence": "两个入口各自创建看似同名但实际不同的 workspace，或以不同路径指向同一目录却各自认为可以成为写入者。"
  },
  {
    "lens": "adversarial",
    "location": "AD-30 — .tickdeck.lock 与附着语义（第 362 行）",
    "trigger_condition": "锁竞争失败时允许“附着/报告现有实例”，但没有规定可验证的锁记录、实例发现、stale 判定和附着认证协议。",
    "guard_snippet": "固定 WorkspaceInstanceRecord v1 与 attach 握手：记录 workspace_id、canonical data-root file identity、instance nonce、PID+start identity、OS principal、payload/build/protocol digest、mode 和本地 control endpoint；记录只作 discovery，不作信任根，等待者必须经 ACL 保护的 UDS/named-pipe challenge 验证仍持锁的 supervisor。定义进程死亡、PID 复用、损坏记录、版本不兼容和 foreign-principal 时的 fail-closed/stale recovery。",
    "potential_consequence": "B/S 可能信任桌面遗留的端口/PID，桌面可能另起实例，攻击者也可能伪造 lock metadata 引导客户端附着错误服务。"
  },
  {
    "lens": "adversarial",
    "location": "AD-6 与 AD-30 — desktop inherited-pipe bootstrap / existing-instance attach（第 156、360–362 行）",
    "trigger_condition": "桌面只定义了自己新启动 supervisor 时的 inherited-pipe secret；当 data root 已由 B/S supervisor 持锁时，桌面仍须附着，但拿不到现有实例的合法一次性 bootstrap。反向由本地 B/S 附着桌面实例也没有协议。",
    "guard_snippet": "定义 LocalAttachBootstrap v1：只有当前持锁 supervisor 可经 ACL 保护的 control IPC 签发单次、短时、绑定 workspace_generation + instance nonce + client kind + exact loopback origin 的 attach grant；Tauri Rust 用该 grant 发原生 loopback 换 cookie，B/S 仍由 TTY 显示配对码。grant 不得写磁盘、argv、environment、URL 或 Web JS；失败与重放使用稳定错误。",
    "potential_consequence": "入口切换要么无法工作，要么实现者把 bootstrap secret 写入 lock 文件、URL 或环境变量，破坏 AD-6 的会话边界。"
  },
  {
    "lens": "adversarial",
    "location": "AD-6 — loopback origin 与 session cookie（第 156 行）",
    "trigger_condition": "“host-only cookie”未固定 loopback host、端口发现、cookie 名称/路径和多 workspace 命名；浏览器 cookie 不按端口隔离，两个本地实例可合法使用同名 cookie。",
    "guard_snippet": "固定 LocalOriginProfile v1：明确 IPv4/IPv6/localhost 选择、端口分配与发布方式、Host/Origin allowlist、cookie namespace（含公开 instance/workspace discriminator）、Path/SameSite/HttpOnly/Secure 规则、CSRF 绑定、CSP/connect-src 和 WebSocket ticket origin。服务器必须把未知实例 cookie 当无效而不是覆盖或复用，Tauri 只能向握手返回的 exact origin 写入。",
    "potential_consequence": "不同端口或不同 data root 的本地实例互相覆盖 cookie、产生反复登出，或桌面与浏览器对“同一会话”形成不同解释。"
  },
  {
    "lens": "adversarial",
    "location": "AD-3、AD-5、AD-6 — subject/session identity（第 132、148–156 行）",
    "trigger_condition": "OperationIdentity 和 R1/R2 都绑定 subject，但单工作区下 subject 是稳定 workspace operator、每次 session、入口类型还是代理审计 identity 未被规范化。B/S 与桌面可分别选不同合法解释。",
    "guard_snippet": "在 contracts/core 拆分并固定 ActorId、SessionId、AuditAttribution：v1 无用户/RBAC 时 ActorId 的生成、跨入口稳定性和 workspace_generation 关系必须唯一；SessionId 始终短期且不可互换；R1/R2、OperationIdentity、audit 和 idempotency 分别绑定哪一个字段必须逐项声明，proxy identity 只能进入 attribution。增加跨入口同 action/same key 与 grant non-transfer conformance fixtures。",
    "potential_consequence": "同一操作从桌面和浏览器提交时被错误地合并或重复执行，R1/R2 也可能被意外跨会话复用或在入口切换后无故失效。"
  },
  {
    "lens": "adversarial",
    "location": "AD-30 — product-supervisor / Tauri 生命周期（第 360–362 行）",
    "trigger_condition": "桌面窗口关闭只被规定为“分离客户端、不取消 durable run”，但 Tauri sidecar 是随父进程退出、继续作为 daemon、等待任务完成还是转交已有 B/S owner 未被定义。B/S TTY/terminal 消失也同样未定义。",
    "guard_snippet": "固定 SupervisorLifecycle v1 状态机和 owner 规则：STARTING/READY/DRAINING/STOPPING/FAILED、client attach/detach、parent death、last-client disconnect、durable-job presence、idle shutdown、explicit stop、OS logout/shutdown 与 crash recovery的唯一转移；product-supervisor 是所有 product child 的唯一 owner，entrypoint 只持 client lease，不以窗口/TTY 生命周期直接杀子进程。明确何时保持 daemon、何时 drain、何时把 run 标为 INTERRUPTED。",
    "potential_consequence": "桌面关闭会终止 worker 而 B/S 关闭不会，或后台进程永久残留；同一 durable run 的状态和恢复结果因入口而异。"
  },
  {
    "lens": "adversarial",
    "location": "AD-18、AD-30 与 Consistency Conventions/Configuration（第 276、362、378 行）",
    "trigger_condition": "“以 ingress/entrypoint 配置区分”没有固定配置形状、来源和优先级；B/S CLI/config 与桌面 Rust settings 可分别定义端口、模式、data root、proxy 或 feature/Gate 相关开关。",
    "guard_snippet": "固定 RuntimeLaunchManifest v1，拆分 install-scoped、workspace-scoped 和 ephemeral 字段并规定 CLI/config/UI 的唯一 precedence、schema migration 与审计；允许 entrypoint 差异仅限 ingress、bootstrap transport 和 shell lifecycle。manifest 必须显式禁止改变 capability catalog/slice、Gate、domain schema、policy、connector qualification 和 read-model shape；server 启动时校验并记录 digest。",
    "potential_consequence": "两入口加载同 payload 却得到不同 capability、网络暴露或安全策略，桌面配置还可能形成第二份不可审计真值。"
  },
  {
    "lens": "adversarial",
    "location": "AD-18、AD-30 — 一个 payload 与 payload digest（第 276、360、364 行）",
    "trigger_condition": "“相同 payload digest”没有定义目录树边界、路径规范、文件模式、symlink、platform-specific 文件及 envelope/bootstrap 的排除规则；两个 packager 可用不同清单对不同内容声明同一逻辑版本。",
    "guard_snippet": "固定 ReleasePayloadManifest v1：canonical relative path、file kind/mode、length、raw-byte sha256、target triple、component/version/contract digests 和 Merkle/root digest 算法；禁止未列文件与可变 post-install 文件。B/S archive 与 desktop envelope 必须嵌入 byte-identical manifest/root digest，启动前由同一 Rust verifier 校验；envelope/bootstrap 元数据另有明确 digest 边界。",
    "potential_consequence": "B/S 与桌面都声称 release-id/payload digest 相同，实际却携带不同 server、SPA、migration、compiler 或 capability slice。"
  },
  {
    "lens": "adversarial",
    "location": "AD-30 — 两个 install root、一个 data root 与 current pointer（第 362–364 行）",
    "trigger_condition": "B/S archive 和 desktop envelope 各有合法 install root 与 current pointer；它们可顺序打开同一 data root，但一个指向新 release，另一个仍指向旧 release。锁只阻止并发写，不阻止旧入口在稍后启动并读取已迁移 workspace。",
    "guard_snippet": "在 data root 固定 WorkspaceRuntimeBinding v1：记录 active release sequence、payload digest、schema/contract versions、minimum reader/writer、last-known-good 与 workspace generation；任何 supervisor 在取得锁后、打开 SQLite 前必须比对。不同 install root 只能启动 exact active payload，或进入同一个受控 upgrade/rollback transaction；不兼容旧 payload fail closed，不能自行降级读取。",
    "potential_consequence": "桌面升级并迁移数据后，旧 B/S archive 再次启动造成 schema downgrade、状态误读或不可逆损坏。"
  },
  {
    "lens": "adversarial",
    "location": "AD-18、AD-30 — upgrade authority 与串行化（第 276、364 行）",
    "trigger_condition": "Release Manifest/product-supervisor 被称为升级权威，但没有规定 B/S CLI、桌面 UI、OS installer 和正在运行 supervisor 如何竞争、授权并恢复同一升级。",
    "guard_snippet": "固定 UpgradeCoordinator v1 command/state machine，升级 mutation 只能发送给当前持锁 supervisor，并使用 data-root scoped update lock + fsync journal；状态至少包含 REQUESTED/VERIFIED/STAGED/DRAINING/SNAPSHOTTED/MIGRATED/SWITCHED/POSTCHECK/COMMITTED/ROLLING_BACK/FAILED。定义并发请求、进程崩溃、重新附着、R2/操作者确认、Tauri/CLI 状态投影及每状态的唯一 legal next action；installer 不得绕过 coordinator 修改 active payload。",
    "potential_consequence": "桌面 updater 与 B/S CLI 同时 staging/switch，或 OS installer 在服务端 drain 前替换文件，留下半升级状态与不一致 current pointer。"
  },
  {
    "lens": "adversarial",
    "location": "AD-18、AD-30 — 临时 migration、原子切换与数据回滚（第 276、364 行）",
    "trigger_condition": "“临时副本 migration/health → 原子替换 current pointer”只原子切换代码版本，没有定义 SQLite、WAL/SHM、artifact store、audit、Vault metadata 与 workspace generation 如何形成同一可回滚数据代。",
    "guard_snippet": "固定 WorkspaceUpgradeSnapshot v1 与 cutover 算法：列出 snapshot coverage、SQLite checkpoint/backup 方法、artifact pins、Vault/SecretRef 处理、audit continuation、free-space/fsync 要求、migration sandbox 的 egress/side-effect 禁止、health oracle、workspace-slot 或恢复步骤、generation/session/lease 处理及 crash-point recovery table。代码 pointer 与数据 compatibility marker 必须由一个 journaled commit 决定；旧数据/代码保留到 postcheck commit。",
    "potential_consequence": "代码回到旧版本而数据库/工件仍是新格式，或临时 health 通过后真实 data root 未正确迁移，导致回滚不可启动或审计链断裂。"
  },
  {
    "lens": "adversarial",
    "location": "AD-18、AD-30 — desktop envelope 与 payload 的两层回滚（第 276、364 行）",
    "trigger_condition": "B/S archive 可保留 bootstrap 和多个 payload；NSIS/DMG/AppImage 对 Tauri envelope 的替换、回退和只读安装位置各不相同，当前只定义 payload current pointer，没有定义 shell/bootstrap 兼容窗口。",
    "guard_snippet": "固定 EnvelopeCompatibilityManifest v1：声明 bootstrap/shell 最小与最大 payload protocol、可启动的 retained release 集、安装器与 coordinator 的职责边界、OS-level update 的 drain/rollback handshake 及 envelope 失败时的 headless recovery command。Tauri updater不得成为独立信任或状态权威；五 profile 分别给出可执行的 install-root/current-pointer mapping。",
    "potential_consequence": "payload 已成功回滚，但新 Tauri shell 无法启动旧 supervisor，或 desktop installer 删除 last-known-good，而 B/S 仍可恢复，形成交付面差异。"
  },
  {
    "lens": "adversarial",
    "location": "AD-30 — 签名信任、key rotation 与 rollback（第 364 行）",
    "trigger_condition": "签名、SHA-256 和双 key overlap 只证明 artifact 曾获签；没有 release sequence/channel、metadata expiry、撤销、任意旧签名包重放和显式 rollback target 规则。",
    "guard_snippet": "固定签名 ReleaseIndex/UpdateMetadata v1：绑定 product/profile/channel、monotonic release sequence、payload/envelope digests、compatibility、minimum bootstrap、published/expiry、revoked releases/keys 与唯一允许的 last-known-good rollback target；正常升级拒绝 sequence rollback，故障回滚只允许 journal 记录的目标并追加审计。离线升级同样携带可验证 metadata bundle。",
    "potential_consequence": "一个入口接受任意仍有旧签名的过期/撤销版本，另一个只接受最新版本；攻击者或误操作可借重放触发不兼容降级。"
  },
  {
    "lens": "adversarial",
    "location": "AD-2、AD-20、AD-30 — capability/read-model 双入口等价（第 96–124、288、360–364 行）",
    "trigger_condition": "AD-20 要求关键旅程结果等价，但未固定比较输入、完整 capability surface、允许差异和机器判定 oracle；两套测试可分别通过各自挑选的旅程。",
    "guard_snippet": "固定 DeliverySurfaceParitySuite v1：从同一 catalog/Capability Manifest digest、冻结 workspace bundle、RunContext/fixtures 和 deterministic clock 启动 B/S 与 desktop；枚举所有 routes/navigation/API/tools/worker handlers、Gate snapshots、presentation read models、errors 和关键旅程，按 RFC 8785 比较 canonical 输出。只允许显式列出的 ingress/session-id/window-state 差异，任何额外或缺失 capability 均 fail。",
    "potential_consequence": "桌面漏挂 route、B/S 多暴露工具或两入口对 locked/suspended、Trust/Risk 状态显示不同，却都能以自己的 E2E 集合宣称通过。"
  },
  {
    "lens": "adversarial",
    "location": "AD-18、AD-20 — 五平台交付证据（第 276、288 行）",
    "trigger_condition": "安装、启动、升级、恢复和完整矩阵虽被要求，但证据没有明确绑定 exact archive/envelope/payload、测试套件、fixture、OS/libc/WebView/browser 与执行结果，旧证据可被复用于新包。",
    "guard_snippet": "固定 DeliveryEvidenceManifest v1，并由 Gate Registry 按 digest 消费：记录 archive/envelope/payload/Release Manifest/SBOM/test-suite/fixture/oracle digest、profile 与 target triple、真实 OS/libc/system WebView/browser 精确版本、install/data-root mode、起止时间、每 case outcome/artifact 和签署者。任一输入 digest 或环境漂移即 evidence stale；同一 release 的 B/S 与 desktop evidence 必须成对齐全。",
    "potential_consequence": "B/S 新包沿用旧 archive 的通过记录，桌面用 bundled-browser 结果代替真实 WebView，或同名 release 在五个平台实际未验证仍被 Gate 注册。"
  },
  {
    "lens": "adversarial",
    "location": "AD-30 — desktop user 与 B/S service 的 OS principal（第 362 行）",
    "trigger_condition": "同一 data root 可由交互式桌面用户或 headless/service B/S 启动，但只要求“可写”和 OS lock，没有固定 owner、ACL、权限继承与跨 principal 切换规则。",
    "guard_snippet": "在 DataRootSpec/Release Profile 固定 ExecutionPrincipalPolicy：创建 owner、允许的 principal、目录/文件权限与 inheritance、service account mapping、平台 key-store 可达性、foreign-owner 检测和显式迁移流程；不允许 launcher 自动 chmod/chown 或在 Vault 不可达时以另一 principal 降级。attach control IPC、lock、SQLite、artifacts 与 backup 都按同一 policy 验证。",
    "potential_consequence": "桌面创建的 workspace 被 system service 以不同权限部分打开，造成 Vault LOCKED、工件不可读或 ACL 被悄悄放宽；反向切换也可能暴露本地数据。"
  }
]
```

## Findings — Markdown rendering

### 1. 缺少唯一的 data-root identity

- **Location:** AD-30 — 发行版布局与 data root（第 362 行）
- **Trigger:** “平台 application-data 目录”不是可执行的唯一目录合同；B/S 与 Tauri 的 bundle/app identity、大小写、symlink 和 Windows reparse path 都可不同。
- **Guard:** 增加 `DataRootSpec v1`，逐 profile 固定缺省目录和 canonicalization/file-identity/owner/ACL/no-follow 规则，并要求任何文件访问前完成解析、校验和锁定。
- **Consequence:** 两入口可创建两个 workspace，或对同一物理目录取得两个逻辑锁。

### 2. lock 不是可认证的 attach 协议

- **Location:** AD-30 — `.tickdeck.lock` 与附着语义（第 362 行）
- **Trigger:** 锁失败后“附着/报告”的 metadata、stale recovery 和身份校验未定义。
- **Guard:** 增加 `WorkspaceInstanceRecord v1` 与 ACL-protected local-control challenge；PID/port/lock-file 内容只能 discovery，不能作为信任根。
- **Consequence:** stale/PID reuse/伪造 metadata 可导致附着错误实例，或两个入口各自启动写入者。

### 3. attach 到“别人启动的 supervisor”时没有 bootstrap

- **Location:** AD-6 与 AD-30（第 156、360–362 行）
- **Trigger:** inherited-pipe secret 只适用于桌面新建 supervisor；TTY code 只适用于 B/S 新建 supervisor。
- **Guard:** 增加 `LocalAttachBootstrap v1`，由当前持锁 supervisor 经受保护 control IPC 签发绑定 instance/origin/client-kind 的单次 grant，再分别走 native loopback 或 TTY 配对。
- **Consequence:** 正常入口切换无法完成，或实现者被迫把 secret 放入 lock、URL、argv/env。

### 4. loopback cookie 没有实例级命名

- **Location:** AD-6（第 156 行）
- **Trigger:** cookie 不按端口隔离；host-only 仍不足以隔离同一主机上的多个 TickDeck 实例。
- **Guard:** 增加 `LocalOriginProfile v1`，固定 host/port discovery、cookie namespace/path/flags、CSRF、Origin、CSP 和 WS ticket 绑定。
- **Consequence:** 多实例 cookie 覆盖、反复登出或跨入口会话解释不同。

### 5. subject 与 session 的含义可分叉

- **Location:** AD-3、AD-5、AD-6（第 132、148–156 行）
- **Trigger:** `subject` 可被分别实现为 workspace operator、session、entrypoint 或 proxy identity。
- **Guard:** 明确 `ActorId`、`SessionId`、`AuditAttribution`，并逐项固定 OperationIdentity、R1/R2、audit 的绑定字段及跨入口 conformance fixture。
- **Consequence:** 幂等操作被错误合并/重复，授权被错误共享或无故失效。

### 6. supervisor 的持久生命周期没有状态机

- **Location:** AD-30（第 360–362 行）
- **Trigger:** 窗口、Tauri 父进程、TTY 或最后一个 client 消失后，product processes 是否继续、drain 或中断未定义。
- **Guard:** 增加 `SupervisorLifecycle v1`，把 child ownership、client lease、durable job、idle shutdown、explicit stop、parent death 和 crash recovery 固定为唯一状态机。
- **Consequence:** 桌面关闭杀 worker 而 B/S 不杀，或残留 daemon；run 恢复语义随入口改变。

### 7. ingress/entrypoint 配置可偷偷改变产品语义

- **Location:** AD-18、AD-30、Consistency Conventions/Configuration（第 276、362、378 行）
- **Trigger:** B/S CLI/config 与 desktop Rust settings 没有共享 schema、scope 和 precedence。
- **Guard:** 增加 `RuntimeLaunchManifest v1`；允许差异只限 ingress、bootstrap transport、shell lifecycle，明确禁止改变 capability/Gate/schema/policy/qualification/read model。
- **Consequence:** 同 payload 在两个入口运行成不同权限或能力产品。

### 8. “相同 payload digest”没有可重算的树合同

- **Location:** AD-18、AD-30（第 276、360、364 行）
- **Trigger:** packager 可用不同目录边界、path/mode/symlink 规则对不同内容声明同一逻辑 payload。
- **Guard:** 增加 `ReleasePayloadManifest v1`，逐文件绑定 canonical path/kind/mode/size/raw digest，并用同一 Rust verifier 计算 root digest；明确 bootstrap/envelope 排除边界。
- **Consequence:** B/S 与桌面同 release-id 下实际运行不同 server、SPA、migration 或 capability slice。

### 9. 两个 install root 可以顺序降级同一 data root

- **Location:** AD-30（第 362–364 行）
- **Trigger:** B/S 与 desktop 各自维护 `current pointer`；锁只阻止并发，不阻止旧 install 后续打开新 schema。
- **Guard:** 在 data root 增加 `WorkspaceRuntimeBinding v1`，锁定 active payload/release sequence/schema min reader-writer/last-known-good；不匹配只能进入同一 upgrade/rollback transaction。
- **Consequence:** 桌面升级后旧 B/S 重新启动，造成 schema downgrade 或数据损坏。

### 10. upgrade 没有 data-root scoped 单一协调者

- **Location:** AD-18、AD-30（第 276、364 行）
- **Trigger:** CLI、desktop UI、OS installer 与 supervisor 都可能合法发起或替换升级内容。
- **Guard:** 增加 journaled `UpgradeCoordinator v1` 和完整状态机；所有入口只向当前持锁 supervisor 发命令，installer 不得绕过 coordinator。
- **Consequence:** 并发 stage/switch 或未 drain 就替换文件，留下半升级状态。

### 11. 临时 migration 与真实 workspace cutover 未闭合

- **Location:** AD-18、AD-30（第 276、364 行）
- **Trigger:** 只说临时副本 migration/health 和代码 pointer 切换，没有把 DB/WAL/artifacts/audit/Vault metadata 绑定为一个数据代。
- **Guard:** 增加 `WorkspaceUpgradeSnapshot v1`、snapshot coverage、fsync/pin、无副作用 health、数据 cutover、generation/session/lease 和 crash-point recovery 表。
- **Consequence:** 代码回滚但数据未回滚，或新代码启动时真实 data root 没有通过同一 health。

### 12. 桌面 envelope 与 payload 是两个兼容层

- **Location:** AD-18、AD-30（第 276、364 行）
- **Trigger:** NSIS/DMG/AppImage 对 shell/bootstrap 的替换方式不同，而 current pointer 只覆盖 payload。
- **Guard:** 增加 `EnvelopeCompatibilityManifest v1`，锁定 shell/bootstrap↔payload protocol window、installer/coordinator 边界、OS update handshake 和 headless recovery。
- **Consequence:** payload 能回滚但新桌面壳不能启动它，desktop 丢失 last-known-good 而 B/S 尚可恢复。

### 13. 签名有效不等于版本仍可安装

- **Location:** AD-30（第 364 行）
- **Trigger:** 没有 sequence/channel/expiry/revocation/replay 与唯一 rollback target；旧签名包仍可能一直有效。
- **Guard:** 增加签名 `ReleaseIndex/UpdateMetadata v1`，固定 monotonic sequence、profile/channel、expiry/revocation、minimum bootstrap 和 journal-authorized rollback target。
- **Consequence:** 两入口采用不同降级政策，或旧但有效签名包被重放到不兼容 workspace。

### 14. 双入口“等价”没有机器可判定 oracle

- **Location:** AD-2、AD-20、AD-30（第 96–124、288、360–364 行）
- **Trigger:** 各自 E2E 可以选择不同关键旅程和断言，仍声称结果等价。
- **Guard:** 增加 `DeliverySurfaceParitySuite v1`，对同一 manifest/workspace/run fixture 枚举 routes/API/tools/handlers/Gate/read models/errors，并 canonical compare；只允许明列的 ingress/session/window 差异。
- **Consequence:** 某入口漏能力、多暴露能力或使用不同 Trust/Risk 投影仍可发布。

### 15. 发布证据没有绑定 exact bits 与 exact environment

- **Location:** AD-18、AD-20（第 276、288 行）
- **Trigger:** 五平台证据未形成 Gate 可消费、对 archive/envelope/payload/test suite/环境逐项绑定的 manifest。
- **Guard:** 增加 `DeliveryEvidenceManifest v1`，记录所有 artifact/suite/fixture digest、真实 OS/libc/WebView/browser 版本、case outcomes 和签署者；输入变化即 stale，B/S/desktop evidence 必须成对。
- **Consequence:** 新包复用旧证据，或桌面以 bundled browser 冒充系统 WebView 通过。

### 16. desktop user 与 B/S service 的 OS principal 没有共同规则

- **Location:** AD-30（第 362 行）
- **Trigger:** 两种入口可由不同 OS principal 运行同一 data root，但 owner、ACL、key-store 可达性和切换程序未固定。
- **Guard:** 在 `DataRootSpec`/Release Profile 增加 `ExecutionPrincipalPolicy`；foreign owner 默认拒绝，显式迁移须覆盖 Vault、IPC、lock、DB、artifact 和 backup 权限，禁止自动 chmod/chown 降级。
- **Consequence:** 入口切换导致 Vault 锁死、部分文件不可读或 ACL 被静默放宽并暴露数据。

## Exact tightening set

在不新增产品能力的前提下，建议把以上 guard 收敛为九个承重合同，并由现有组件实现：

1. `DataRootSpec v1`（含 `ExecutionPrincipalPolicy` 与 canonical file identity）；
2. `WorkspaceInstanceRecord v1` + authenticated local attach protocol；
3. `LocalAttachBootstrap v1` + `LocalOriginProfile v1`；
4. `SupervisorLifecycle v1` + `RuntimeLaunchManifest v1`；
5. `ReleasePayloadManifest v1` + `WorkspaceRuntimeBinding v1`；
6. `UpgradeCoordinator v1` + `WorkspaceUpgradeSnapshot v1`；
7. `EnvelopeCompatibilityManifest v1` + signed `ReleaseIndex/UpdateMetadata v1`；
8. `DeliverySurfaceParitySuite v1`；
9. `DeliveryEvidenceManifest v1`。

这些合同应落在 `packages/contracts`、`crates/product-supervisor`、release tooling 与 `packages/testkit`，而不是引入桌面领域 API。它们只让 B/S 与桌面被迫共享已经采纳的 authority、Gate、状态与发布语义，不授权 S1–S5 能力提前开放，也不引入用户/RBAC、SaaS 控制面、跨主机协调、离线模式或第二套 UI。

## Re-review condition

只有当上述合同的 owner、canonical shape、状态机、fail-closed 分支和 exact evidence binding 被写回 Architecture Spine，并能再次构造 Unit B/Unit D 而无法产生合规分叉时，本专项 Reviewer Gate 才可转为 PASS。
