# Reviewer Gate — Good-spine Rubric Walker（AD-30 桌面更新）

- **评审对象：** `../ARCHITECTURE-SPINE.md`
- **评审日期：** 2026-08-28
- **重点：** AD-30 的 B/S + Tauri 2 双入口、安装、bootstrap、单例、升级与回滚；并核对 PRD、addendum、EXPERIENCE、SPEC/contract-index
- **机械检查：** `lint_spine.py` PASS，0 findings
- **Gate verdict：** **CHANGES REQUIRED**。AD-30 已正确固定“同一 SPA、同一业务内核、同一 Capability/Gate”的产品边界，也与上游合同一致；但桌面签名外壳与可变 payload 的升级边界、已有实例的附着协议仍未闭合，两个独立实现可以作出不兼容且有安全影响的选择。

## Critical / High findings

### H-01 — 桌面外壳与 payload 的安装/升级边界没有形成可执行状态机

- **位置：** ARCHITECTURE-SPINE.md:360–364；AD-18:272–276
- **Rubric：** Rule 必须可执行并实际阻止其 `Prevents` 所述分叉；Deferred/open item 不得隐藏承重分歧；运维/发行环境必须闭合。
- **证据：** AD-30 同时规定：
  1. 桌面发行物是 AppImage、NSIS、signed+notarized DMG app；
  2. 发行布局是 `bootstrap + versions/<release-id>/<profile payload> + atomic current pointer`；
  3. `product-supervisor` 是安装/升级唯一状态机；
  4. Tauri desktop envelope 含同一 payload，但未说明 `versions/` 与 `current` 的物理根目录，也未区分“更新 product payload”和“更新 Tauri/bootstrap 外壳”。
- **为何是 High：** 这三个桌面格式的激活语义不同。macOS 签名 app bundle 不能在签名后被原位改写；AppImage 是作为完整映像运行；Windows NSIS 更新通常替换安装内容。Tauri 官方 updater 也分别生成完整 AppImage、macOS app archive、NSIS/MSI 更新物，而不是只交换 app 内部的任意 `current` 指针。当前 Rule 允许至少三种互不兼容实现：在签名/只读 envelope 内写 `versions/`；首次启动把 payload 解压到外部可写根目录并独立升级；或每次替换整个桌面 envelope。它也没有规定 Tauri shell/bootstrap 与 payload 的兼容范围和二者版本不同时的恢复权威。
- **所需处置：** **Discuss / then fix before handoff.** 明确两个物理/信任域及唯一升级协议：
  - `desktopEnvelope`：Tauri executable、bootstrap、初始 payload/installer metadata；是不可变、签名、由平台安装器或受信 native updater 整体替换的单位。
  - `payloadStoreRoot`：若允许独立 payload 更新，必须位于签名 envelope 与 `workspaceDataRoot` 之外，固定权限、目录、配额和清理规则；每个 payload 先验签/摘要/兼容性，再进入版本目录与原子指针。
  - Release Manifest 必须同时绑定 envelope digest、payload digest、bootstrap/product-supervisor 版本及 compatibility range。
  - 桌面外壳升级若需要完整 envelope replacement，逻辑状态机仍可共用 drain/backup/migrate/health，但激活步骤必须交给平台 installer adapter，重启后由新外壳完成 post-start commit/rollback；不得假装五个平台都只需交换同一种文件指针。
  - 明确卸载时 envelope/payload store/workspace data 三者各自保留或删除的规则，并纳入 AD-18 的五平台证据矩阵。
- **外部核验：** [Tauri Updater](https://v2.tauri.app/plugin/updater/) 描述的平台完整更新物；[Tauri AppImage](https://v2.tauri.app/distribute/appimage/) 描述 AppImage 的打包/运行约束；[Apple notarization guidance](https://developer.apple.com/documentation/security/resolving-common-notarization-issues) 明确签名后修改 bundle 会使签名无效。

### H-02 — 锁竞争后的“附着/报告”是两个不同产品行为，且缺少安全 bootstrap 协议

- **位置：** ARCHITECTURE-SPINE.md:156、360–362；FR-071；EXPERIENCE UJ-3
- **Rubric：** 修复下一层真实分歧；Rule 必须 enforceable；不得让桌面壳绕过会话或形成第二条授权路径。
- **证据：** AD-30 规定无法取得 `${dataRoot}/.tickdeck.lock` 时“只附着/报告现有实例”，但没有选择究竟是附着还是拒绝，也没有规定如何发现和验证现有实例的随机 `<instance>.tickdeck.localhost:<port>` origin、PID/start identity、workspace generation、build/manifest digest 与协议版本。AD-6 又要求桌面只能通过 inherited pipe 的单次秘密完成 HttpOnly cookie bootstrap；已有实例并不是新桌面的子进程，因此该 inherited-pipe 路径不存在。
- **为何是 High：** 两个实现可以分别选择“桌面透明附着现有 B/S”“报错要求关闭 B/S”“另开端口/另建 data root”。若选择附着，又可能通过可伪造 lockfile/端口、复用旧 bootstrap、把 token 写入文件或信任任意 localhost 服务，直接破坏 AD-6。若只报错，UX 与恢复行为也和透明附着完全不同，必须明确。
- **所需处置：** **Discuss / then fix before handoff.** 固定一个 deterministic state machine：
  - `LOCK_ACQUIRED -> OWNER_START -> PUBLISH_VERIFIED_DESCRIPTOR`；
  - `LOCK_HELD -> VERIFY_OWNER` 后只能进入明确的 `ATTACH` 或 `REFUSE_WITH_STABLE_CODE`，不能由平台实现自行选择。
  - 若允许 ATTACH：现有 product-supervisor 通过权限收紧的 Local RPC/control socket 提供 instance descriptor 与一次性 attach bootstrap；新桌面必须校验 PID/start token、data-root identity、workspace generation、build/manifest compatibility、精确 origin 和 peer credential，再换取绑定 origin 的 session cookie。lockfile 只可作为锁/定位信息，不能存明文 session/bootstrap secret；过期或不匹配 fail closed。
  - 若选择 REFUSE：明确桌面显示的稳定错误、恢复步骤及不会偷偷创建新 data root，并把该行为写入 UJ-3/五平台验收。

## Medium findings

### M-01 — 升级包如何取得尚未与 AD-8 的“所有外部流量”规则对齐

- **位置：** AD-8:164–170；AD-30:360、364
- **Rubric：** 新 AD 不得削弱既有 AD；运维与网络边界不能留空。
- **证据：** AD-30 说升级事件由受信 Rust/product-supervisor 处理，却未说明升级包是操作者本地导入还是由产品联网获取。AD-8 明确“其他进程不得开启任意外部 socket”。因此 Tauri updater、product-supervisor 或 bootstrap 自行检查/下载更新会与 AD-8 冲突；完全本地导入则不冲突，但当前没有写明。
- **所需处置：** **Autofix after product choice.** v1 最小闭环可明确为“只接受操作者显式提供的本地签名 release artifact，不自动检查/下载”；若要联网更新，必须新增窄化的 Release Fetcher 决策，明确固定 recipient、无 workspace payload、预算/重定向/代理、审计和签名验证，并同步修订 AD-8，而不是让 Tauri/plugin 获得任意 HTTP 权限。

### M-02 — “版本已核验为当前”存在一项可复现漂移

- **位置：** Stack:384–435，尤其 ARCHITECTURE-SPINE.md:425
- **Rubric：** named tech 必须 verified-current。
- **证据：** 2026-08-28 通过 npm registry 复核时，`@testing-library/react` 的当前版本为 `16.3.3`，spine 固定为 `16.3.2`；其余抽查的 npm stack 与记录一致。Tauri 官方 release index 也确认 AD-30 的 Tauri core `2.11.5`、CLI `2.11.4`、bundler `2.9.4` 是当前发布版本。
- **所需处置：** **Autofix.** 若目标是“当前版本”，更新并跑 compatibility/lockfile 验证；若有意停留 `16.3.2`，把声明改为“经验证的精确 pin”并记录不升级理由，不能继续声称全部为当前版本。
- **外部核验：** [Tauri ecosystem releases](https://v2.tauri.app/release/)；npm registry `npm view @testing-library/react version`。

## Good-spine checklist walk

| Checklist item | Verdict | Notes |
| --- | --- | --- |
| Fixes the real divergence points for the level below | **PARTIAL** | AD-1–AD-29 覆盖广；AD-30 正确固定共享 SPA/控制面/Gate，但 H-01/H-02 仍让发行与附着分叉。 |
| Every AD Rule is enforceable and prevents its stated divergence | **PARTIAL** | AD-30 的“同内核/无 Tauri 业务 IPC/关闭窗口不取消 run”可执行；安装根、envelope 更新与 attach/bootstrap 尚不可执行。 |
| Nothing under Deferred/open items can cause hidden divergence | **PASS with caveat** | 平台最低版本、Vault、十进制、适配清单都有 revisit Gate；原“B/S + 桌面发布/bootstrap”被标为 RESOLVED 后仍遗留 H-01/H-02，因此应补决策，不应重新泛化为开放需求。 |
| Named technology is verified-current | **PARTIAL** | AD-30 三个 Tauri 版本通过官方核验；npm stack 有 M-02 的单点漂移。 |
| Ratifies rather than contradicts brownfield code | **N/A** | 仓库当前没有产品代码；这是 greenfield build substrate。 |
| Covers the driving SPEC capabilities | **PASS** | CAP-9、CAP-11 与 FR-070–076/088–090/096、阶段 Gate 均有明确落点；桌面仅为 S0 发行表面，没有提前授权 S1–S5。 |
| Does not weaken inherited/earlier ADs | **PARTIAL** | 与 AD-1/2/3/6/18 的主边界一致；升级包联网取得若未限定会与 AD-8 冲突（M-01）。 |
| Every owned dimension is decided, deferred, or open | **PASS with caveat** | 拓扑、状态、数据、安全、部署、五平台、运行、恢复、审计和供应链均有覆盖；AD-30 的 envelope/payload 生命周期需要补足才算运维闭环。 |

## Reconciliation / preservation check

### PRD and addendum

**PASS.** AD-30 保留了：v1.0 同时提供 B/S 与 Tauri 2；桌面、本地 B/S、远端 B/S 共用 React SPA、Fastify、Worker、工作区、Capability Manifest/Gate Registry；桌面不形成第二套业务逻辑；回环默认、远端 proxy、单工作区、无 RBAC/多租户、Apache-2.0/无付费锁/无强制云登录均未被放宽。

### EXPERIENCE / DESIGN

**PASS.** 同一 SPA、五个系统 WebView profile、同一核心旅程/阶段/双语/无障碍验收、关闭浏览器或桌面窗口不取消 durable run、S0 只交付双入口壳等合同均已落入 AD-2、AD-13–18 与 AD-30。AD-30 还补充了精确 origin、navigation/new-window/CSP 边界，没有新增 UX 能力。

### SPEC / contract-index

**PASS.** SPEC 的 CAP-9、双入口约束及 AD-1–AD-30 companion 引用与 architecture 一致；contract-index 已把该机制标为 2026-08-28 Resolved，并保持五平台证据 Gate。没有恢复 retired OQ-07/SM-09，也没有改变活跃假设、OQ-03–OQ-06 或 stage ceiling。未发现阶段能力提前授权。

## Positive observations

- “桌面是同一 SPA 的薄壳”被写成依赖与权限规则，而不是口号：无第二 renderer/API/领域状态/授权通道，Web 内容无 shell/filesystem/updater/domain IPC。
- AD-6 的随机 `.localhost` origin、精确 Host allowlist、HttpOnly cookie bootstrap，加上 AD-30 的 navigation/new-window/CSP 限制，方向上正确处理了 loopback 不等于信任。
- Tauri sidecar、Linux ARM64 AppImage 与五平台 bundling 具备官方支持路径；最低 OS/libc/system WebView 继续由 S0 证据 Gate 冻结是合理 Deferred，而非缺失。
- Capability/Gate 与发行表面分离清楚：桌面进入 S0 不会使 S1–S5 业务能力自动注册。

## Recommended gate disposition

在 H-01 与 H-02 固定为可执行的发行/附着状态机，并处理 M-01 的更新来源边界后，重新运行 lint + rubric walker；M-02 可随同一次机械更新修复。无需改写产品范围，也不需要重开“是否支持桌面客户端”这一已采纳决策。
