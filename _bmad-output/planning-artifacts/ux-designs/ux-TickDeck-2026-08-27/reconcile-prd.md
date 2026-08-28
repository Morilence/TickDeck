---
title: TickDeck UX reconciliation — canonical PRD
status: reconciled
source: /usr/local/src/TickDeck/_bmad-output/planning-artifacts/prds/prd-TickDeck-2026-08-27/prd.md
addendum: /usr/local/src/TickDeck/_bmad-output/planning-artifacts/prds/prd-TickDeck-2026-08-27/addendum.md
design: ./DESIGN.md
experience: ./EXPERIENCE.md
audited: 2026-08-27
---

# PRD reconciliation

## Verdict

**RECONCILED at UX-document level.** `DESIGN.md`、`EXPERIENCE.md` 与 `mockups/` 正式文件已承接 UJ-1–UJ-4、S0-V–S5、稳定 `FR-001`–`FR-100`、`NFR-001`–`NFR-040`、范围排除与获批主题覆盖。旧 O-01–O-05 及后续 reviewer 修复项均已进入当前规范或正式视觉参考。

这不是实现、部署、真实数据/模型连接或发布资格通过声明。两份 spine 已在 Reviewer Gate 归零后晋级为 `final`；稳定需求原名与验收文本继续以 PRD/addendum 为权威。

## Audited inputs and precedence

- 上游：`../../prds/prd-TickDeck-2026-08-27/prd.md`、`../../prds/prd-TickDeck-2026-08-27/addendum.md`、`.memlog.md`。
- 规范：`DESIGN.md`、`EXPERIENCE.md`。
- 正式视觉参考：`mockups/key-s0v-screening-review.*`、`mockups/key-connections-health.*`、`mockups/key-strategy-lab-backtest.*`、`mockups/key-workbench-dark.*`、`mockups/key-workbench-light.*`。
- 优先级：PRD/addendum → 已确认 memlog 决定 → spines → mockups。mock 的示例行情、连接、健康、版本和 scenario 不是联调证据。

## UI-system baseline

shadcn 官方 registry 的 `base-vega` / Base UI 组件、默认交互语义、component variant 与 Tailwind semantic token 始终优先。TickDeck 只组合领域模式，并扩展官方预设缺失的行情、数据质量和 R0–R3 语义；不得另造平行基础组件，基础色也不得从 mock 反向提升为生产 token。

基线由 `DESIGN.md:10-21` 自包含定义：

- style / primitive：`base-vega` / Base UI
- registry / policy：shadcn official default / official-first、compose-before-extend
- theme：neutral、CSS variables、Lucide、`menuColor=default`、`menuAccent=subtle`、`radius=0.625rem`

## Former open-action ledger

| ID | 旧问题 | 状态 | 当前证据 |
|---|---|---|---|
| O-01 | `运行与健康` 阶段过宽 | RESOLVED | `EXPERIENCE.md:48,128-130,182` 分别限定 S0-V 的 R0/最小失败、S1 分层健康、S2 waiting/paused/recovered 与 Risk Gate。 |
| O-02 | 数据 token 不闭合 | RESOLVED | `DESIGN.md:29-46,181` 提供 real/delayed/demo/partial/fresh/stale/missing/unsupported/unknown 深浅成对 token；`EXPERIENCE.md:126,159-174` 定义组合与默认影响。 |
| O-03 | 正式视觉参考字号过小 | RESOLVED | `DESIGN.md:73-90,187` 固定 12px 下限；正式 HTML 已加入 ≥12px 覆盖与 13–14px 关键文案，例如 `mockups/key-s0v-screening-review.html:674-720`、`key-strategy-lab-backtest.html:511-557`、`key-workbench-dark.html:29`、`key-workbench-light.html:29`、`key-connections-health.html:34-124`。 |
| O-04 | S1 屏未来导航歧义 | RESOLVED | `mockups/key-connections-health.html:156,163-171` 将 S3–S5 标为 disabled / `TARGET IA ONLY`，并持久说明其不出现在 S1 build。 |
| O-05 | 正式视觉参考未索引 | RESOLVED | `DESIGN.md:229-231` 与 `EXPERIENCE.md:78-92` 索引全部正式 HTML/PNG、阶段、主题、scenario 与覆盖边界。 |
| O-06 | 继承 token 不是机器可读值 | RESOLVED | `DESIGN.md:111-159` 使用合法 CSS `var(--*)` 或 `{path.to.token}`；正文 `:177-183` 明确默认 preset 优先。 |
| O-07 | mock rail 与 canonical 56px 冲突 | RESOLVED | `DESIGN.md:115-118,197,211`；正式修复见 connections `:125-130`、S0-V `:730-768`、strategy `:570-605`、workbench 双主题 `:32-49`。 |
| O-08 | degraded 与 qualified-demo 场景可被拼接 | RESOLVED | `EXPERIENCE.md:82-90` 固定视觉 scenario 身份并声明为不同工作区状态/不同运行；connections `:156` 与 workbench 双主题 `:57` 也分别标记 degraded / qualified-demo。 |
| O-09 | R2、获取时间与 a11y 行为合同不足 | RESOLVED | `EXPERIENCE.md:202-256` 为 R0–R3、R2 绑定/失效/单次消费、恢复/通知唯一权威；`:261-290` 分离 observation、fetched-at、last sync、snapshot 与 model qualification；`:302-331` 固定可访问行为/fixture。 |
| O-10 | 1280×720 下 R2 被裁切 | RESOLVED | `DESIGN.md:195-197`、`EXPERIENCE.md:294-300` 禁止裁切；工作台双主题 `:38,48-50` 使用可滚动 Agent body、56px rail 与高度压缩规则，R2 字段/确认/拒绝保持可达。 |
| O-11 | 基础交互组件来源不够明确 | RESOLVED | `DESIGN.md` 的 UI system 与 Components、`EXPERIENCE.md` 的 Interaction primitive inheritance 明确以 shadcn 官方 registry 的 `base-vega` / Base UI 组件为唯一默认基础；领域组件采用组合优先、最小扩展。 |

## Journeys, stages and stable boundaries

| Contract | UX disposition | 状态 |
|---|---|---|
| `UJ-1：周岚完成一次可审计的选股研究` | `EXPERIENCE.md:358-367`；S0-V 筛选到 S4 R2 闭环，含 Climax/失败路径 | RESOLVED |
| `UJ-2：陈宇把策略想法变成可信验证` | `EXPERIENCE.md:368-377`；S3 策略/回测到 S4 模拟组合，含 Climax/失败路径 | RESOLVED |
| `UJ-3：赵琪安全部署并维护一个受信工作区` | `EXPERIENCE.md:378-386`；会话/代理/连接/诊断/恢复，含 Climax/失败路径 | RESOLVED |
| `UJ-4：林舟在没有商用数据时完成开源贡献` | `EXPERIENCE.md:387-395`；demo、受信扩展与供应链边界，含 Climax/失败路径 | RESOLVED |
| S0-V–S5 | `EXPERIENCE.md:19-31` 与组件 earliest-stage；0.x 只挂载已过 Gate 能力 | RESOLVED |
| `FR-001`–`FR-100` | `EXPERIENCE.md:94-115` 保持连续稳定路由，不重写名称/验收 | RESOLVED BY REFERENCE |
| `NFR-001`–`NFR-040` | 同表保持连续路由；数值与安全门仍回指 PRD | RESOLVED BY REFERENCE |

## Scope and theme disposition

- 一实例一受信工作区；无用户/组织/RBAC/多租户。
- 无实盘、券商连接、投资建议、无人值守自动交易、提醒直接下单。
- 无多 Agent、自动外部模型回退、在线市场、远程一键安装、公共脚本社区或公共 REST API。
- 未验证连接器/模型/数据不得显示为 supported/healthy；demo 不等于真实资格。
- light/dark/system 是已获批 UX override，不是新增稳定 FR。两主题信息、风险和可访问性必须等价；Theme Control 不改变当前阶段可见范围。

## Open upstream decisions

UX 未关闭任何上游开放问题：`EXPERIENCE.md:33-37` 继续保持 OQ-06 → S0、OQ-03 → S1、OQ-02 → S2；OQ-01、OQ-04、OQ-05、OQ-07 仍按 PRD 的 alpha/beta/RC 门关闭。

## Implementation handoff only

剩余工作不是 UX 文档缺口：实现/QA 仍须按 spines 验证阶段挂载、computed shadcn token、1280×720/200%、双主题与读屏、R2 不可重放/幂等/恢复、数据 provenance/许可、模型资格、真实连接与发布 Gate。没有这些证据时，不得把本报告解释为实现、部署、真实连接或上线通过。
