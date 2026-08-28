---
title: TickDeck UX reconciliation — addendum and formal mockups
status: reconciled
source: /usr/local/src/TickDeck/_bmad-output/planning-artifacts/prds/prd-TickDeck-2026-08-27/addendum.md
design: ./DESIGN.md
experience: ./EXPERIENCE.md
audited: 2026-08-27
---

# Addendum reconciliation

## Verdict

**RECONCILED at UX-document level.** Addendum/memlog 的阶段、范围、部署、安全、数据许可、恢复和外部启发边界均已进入 spines；旧 F-01–F-16 不再构成 reconciliation open action。正式证据只来自 `mockups/`，历史方向稿不再作为当前规范输入。

`DESIGN.md` 与 `EXPERIENCE.md` 已在 Reviewer Gate 归零后晋级为 `final`。本报告关闭的是文档冲突，不是实现、部署、真实连接、沙箱安全、WCAG 实测或发布 Gate。

## Normative priority and pinned baseline

冲突优先级为 addendum/PRD → memlog 已确认决定 → spines → `mockups/`。生产实现必须先使用 shadcn 官方 registry 的 `base-vega` / Base UI 组件、交互语义、默认 variant 和 Tailwind semantic token；TickDeck 只组合领域模式并扩展缺失的金融/数据/风险语义，mock 私有标记、交互或颜色不覆盖官方基础。

`DESIGN.md:10-21,171-181` 自包含定义以下基线：

| 维度 | TickDeck 合同 |
|---|---|
| 组件 | shadcn official default registry；`base-vega` / Base UI |
| 主题 | neutral、CSS variables、`radius=0.625rem` |
| 图标与菜单 | Lucide、`menuColor=default`、`menuAccent=subtle` |

## Former finding ledger

| ID | 状态 | 当前 disposition / evidence |
|---|---|---|
| F-01 | RESOLVED | `EXPERIENCE.md:19-31` 保持 S0-V–S5；0.x 只呈现已过 Gate 能力。 |
| F-02 | RESOLVED | `EXPERIENCE.md:47-56,123` 规定 App Shell 只挂载当前阶段入口；S0-V 无后续 teaser。 |
| F-03 | RESOLVED | `EXPERIENCE.md:41-76` 闭合 Navigation Rail、Context Drawer、Chart Canvas、Agent Panel 与 Review Canvas；Agent 不是一级首页。 |
| F-04 | RESOLVED | `EXPERIENCE.md:335-340`、`DESIGN.md:245-252` 仅保留外部产品交互启发，禁止集成/背书/范围外推。 |
| F-05 | RESOLVED | `EXPERIENCE.md:11-17,33-37` 固定 B/S、自托管、一受信工作区；拓扑选择和 OQ 仍交给架构/上游 Gate。 |
| F-06 | RESOLVED | `EXPERIENCE.md:159-174,261-290` 区分数据性质/可用性、observation/fetched-at/last sync/snapshot、许可继承、事实/计算/模型/未知与清单。 |
| F-07 | RESOLVED | `EXPERIENCE.md:202-256` 是 R0–R3、R2 精确绑定/失效/单次消费、恢复/通知的唯一 UX 权威；不声称 nonce/幂等实现已通过。 |
| F-08 | RESOLVED | `EXPERIENCE.md:290-292,378-402` 保留回测现实性、秘密/恢复、贡献供应链与 S0-V 廉价证伪。 |
| F-09 | RESOLVED | `mockups/key-workbench-dark.html:57` 与 `mockups/key-workbench-light.html:57` 标记 qualified-demo scenario、S4 与非发布声明；不再沿用历史 `v0.8` 全功能暗示。 |
| F-10 | RESOLVED | 深浅工作台结构/信息等价；两文件 `:32-50` 使用 56px rail、scroll-safe R2 与响应式规则，`:76-86` 覆盖 Trust Strip、冻结上下文、运行与 R2。 |
| F-11 | RESOLVED | `EXPERIENCE.md:82-90` 隔离 degraded 与 qualified-demo；connections `:156,205` 保持 NOT QUALIFIED，workbench `:57,76,82-85` 使用独立 qualified-demo，不宣称真实接入。 |
| F-12 | RESOLVED | `DESIGN.md:177-183,211-224` 分离行情、系统状态、数据质量与 R0–R3，并要求非颜色冗余；正式 mock 已加入语义焦点/图表形态修复。 |
| F-13 | RESOLVED | `DESIGN.md:111-159` 的继承值已是机器可读 `var(--*)` / `{path.to.token}`；`:177` 明确 shadcn default token priority，mock 只表达层级。 |
| F-14 | RESOLVED | canonical rail 为 56px（`DESIGN.md:115-118,197,211`）；正式 HTML 修复位于 connections `:125-130`、S0-V `:730-768`、strategy `:570-605`、workbench 双主题 `:32-49`。 |
| F-15 | RESOLVED | 字号合同为 12px 下限、关键文本 13–14px、控件优先 32px（`DESIGN.md:73-90,187,223`）；五份正式 HTML 均有对应 Reviewer Gate override。`EXPERIENCE.md:302-331` 另固定 focus、读屏、图表替代、虚拟化、长文与主题 fixture。 |
| F-16 | RESOLVED | Reviewer Gate 已归零，独立 Finalize 已把两份 spine 晋级为 `status: final`；这不代表实现或发布 Gate 通过。 |
| F-17 | RESOLVED | 基础交互组件来源固定为 shadcn 官方 `base-vega` / Base UI；不并行引入其他 style、第三方 registry 或自写基础 primitive，领域组合只声明增量行为。 |

## Formal mockup disposition

| Formal reference | UX use | Boundary |
|---|---|---|
| `mockups/key-s0v-screening-review.html/png` | S0-V 固定只读筛选、R0、oracle/对照 | 不是 SM-00 通过证据 |
| `mockups/key-connections-health.html/png` | S1 独立 degraded 诊断、target-only future IA | 配置不等于资格；不证明厂商支持 |
| `mockups/key-strategy-lab-backtest.html/png` | S3 demo 策略/回测与清单 | 不证明沙箱平台、安全或可复现已通过 |
| `mockups/key-workbench-dark.html/png` | S4 qualified-demo 合成工作台 | 不证明当前实现、真实行情或模拟成交已联调 |
| `mockups/key-workbench-light.html/png` | 同一 S4 scenario 的主题等价变体 | 不是另一次运行或另一资格状态 |

## Open upstream decisions

UX 未关闭 OQ：`EXPERIENCE.md:33-37` 继续保持 OQ-06 → S0、OQ-03 → S1、OQ-02 → S2；OQ-01、OQ-04、OQ-05、OQ-07 仍按上游 alpha/beta/RC 门关闭。

## Implementation handoff only

后续只剩按规范验收实现：验证 TickDeck 自身的 shadcn `base-vega` 配置与 computed tokens、阶段入口、1280×720/200%/双主题/读屏、R2 不可重放和并发幂等、跨重启恢复、provenance/许可清理、模型资格、真实连接和发布 Gate。缺少这些实现证据不再回写为 UX 文档 open item，但也绝不能由本报告推导为实现或部署通过。
