---
name: TickDeck
description: A/HK 股研究与模拟闭环的高密、可审计桌面工作台视觉系统
status: final
sources:
  - /usr/local/src/TickDeck/_bmad-output/planning-artifacts/prds/prd-TickDeck-2026-08-27/prd.md
  - /usr/local/src/TickDeck/_bmad-output/planning-artifacts/prds/prd-TickDeck-2026-08-27/addendum.md
updated: 2026-08-27
uiSystem:
  style: 'shadcn base-vega'
  primitiveLibrary: 'Base UI'
  componentRegistry: '@shadcn official default registry'
  componentPolicy: 'official-first; compose-before-extend'
  implementation: 'Tailwind CSS variables'
  baseColor: 'neutral'
  cssVariables: true
  iconLibrary: 'lucide'
  menuColor: 'default'
  menuAccent: 'subtle'
  radius: '0.625rem'
  configOwnership: 'TickDeck'
colors:
  market-up-light: '#C62F3B'
  market-up-dark: '#FF5A67'
  market-down-light: '#07835B'
  market-down-dark: '#3BC690'
  status-success-light: '#006B78'
  status-success-dark: '#4CC9D8'
  status-warning-light: '#8A5700'
  status-warning-dark: '#F2B84B'
  status-info-light: '#3E4C8A'
  status-info-dark: '#AAB8FF'
  data-real-light: '#155EEF'
  data-real-dark: '#6EA8FE'
  data-delayed-light: '#8A5700'
  data-delayed-dark: '#F2B84B'
  data-demo-light: '#635B76'
  data-demo-dark: '#B7AECF'
  data-partial-light: '#9A5B00'
  data-partial-dark: '#FFC15A'
  data-fresh-light: '#5E6670'
  data-fresh-dark: '#A5ACB5'
  data-stale-light: '#8A5700'
  data-stale-dark: '#F2B84B'
  data-missing-light: '#A13B00'
  data-missing-dark: '#FF9559'
  data-unsupported-light: '#5E6670'
  data-unsupported-dark: '#A5ACB5'
  data-unknown-light: '#635B76'
  data-unknown-dark: '#B7AECF'
  risk-r0-light: '#006B78'
  risk-r0-dark: '#4CC9D8'
  risk-r1-light: '#3E4C8A'
  risk-r1-dark: '#AAB8FF'
  risk-r2-light: '#8A5700'
  risk-r2-dark: '#F2B84B'
  risk-r3-light: '#7A2D55'
  risk-r3-dark: '#F09AC6'
typography:
  display:
    fontFamily: 'var(--font-sans)'
    fontSize: '24px'
    fontWeight: 650
    lineHeight: '32px'
    letterSpacing: '-0.02em'
  title:
    fontFamily: 'var(--font-sans)'
    fontSize: '18px'
    fontWeight: 650
    lineHeight: '26px'
  heading:
    fontFamily: 'var(--font-sans)'
    fontSize: '15px'
    fontWeight: 600
    lineHeight: '22px'
  body:
    fontFamily: 'var(--font-sans)'
    fontSize: '14px'
    fontWeight: 400
    lineHeight: '21px'
  compact:
    fontFamily: 'var(--font-sans)'
    fontSize: '13px'
    fontWeight: 450
    lineHeight: '18px'
  micro:
    fontFamily: 'var(--font-sans)'
    fontSize: '12px'
    fontWeight: 500
    lineHeight: '16px'
  numeric:
    fontFamily: 'var(--font-mono)'
    fontSize: '13px'
    fontWeight: 500
    lineHeight: '18px'
    letterSpacing: '-0.01em'
rounded:
  sm: 'calc(var(--radius) * 0.6)'
  md: 'calc(var(--radius) * 0.8)'
  lg: 'var(--radius)'
  xl: 'calc(var(--radius) * 1.4)'
  full: '9999px'
  DEFAULT: 'var(--radius)'
spacing:
  '1': '4px'
  '2': '8px'
  '3': '12px'
  '4': '16px'
  '5': '20px'
  '6': '24px'
  '8': '32px'
  '10': '40px'
  '12': '48px'
components:
  app-shell:
    canvas: 'var(--background)'
    foreground: 'var(--foreground)'
    divider: 'var(--border)'
  navigation-rail:
    width: '56px'
    surface: 'var(--sidebar)'
    active: 'var(--sidebar-accent)'
  context-drawer:
    minWidth: '240px'
    defaultWidth: '288px'
    maxWidth: '400px'
  trust-strip:
    minHeight: '36px'
    warningLight: '{colors.data-partial-light}'
    warningDark: '{colors.data-partial-dark}'
  chart-canvas:
    minWidth: '640px'
    grid: 'var(--border)'
  agent-panel:
    minWidth: '360px'
    defaultWidth: '420px'
    maxWidth: '560px'
  run-timeline:
    line: 'var(--border)'
  risk-gate:
    r2Light: '{colors.risk-r2-light}'
    r2Dark: '{colors.risk-r2-dark}'
    r3Light: '{colors.risk-r3-light}'
    r3Dark: '{colors.risk-r3-dark}'
  review-canvas:
    readableMaxWidth: '1200px'
    gutter: '{spacing.6}'
  notification-center:
    width: '420px'
    unread: 'var(--accent)'
  data-table:
    rowHeight: '36px'
    headerHeight: '40px'
  command-palette:
    width: '640px'
    maxHeight: '70vh'
  form-control:
    minHeight: '32px'
    focus: 'var(--ring)'
  status-badge:
    height: '22px'
    radius: '{rounded.full}'
  empty-state:
    contentMaxWidth: '520px'
  diagnostic-panel:
    minWidth: '520px'
  theme-control:
    options: 'light,dark,system'
---

# Brand & Style

TickDeck 看起来应像一张正在工作的专业研究台，而不是券商交易入口、社交行情站或聊天机器人首页。视觉人格是冷静、克制、高密和可复核：图表先说话，数据边界始终可见，Agent 只在需要时抬高音量。

TickDeck 的视觉系统固定为 shadcn `base-vega`、Base UI、Tailwind CSS variables、neutral base、Lucide 图标、`menuColor=default`、`menuAccent=subtle` 与 `0.625rem` 基础圆角。交互基础组件采用 shadcn 官方默认 registry 在 `base-vega` 下生成的实现，包括其 anatomy、默认 variant/size、状态属性、键盘行为、焦点管理、浮层关闭与表单语义。该基线是 TickDeck 自身的实现合同，不依赖其他产品或仓库。

品牌强调色用于当前上下文和交互焦点，不用于制造“推荐买入”的暗示。精确数字使用 `{typography.numeric.fontFamily}`；标题和正文使用 `{typography.body.fontFamily}`。目标视觉稿默认展示深色，但浅色是完全等价的一等主题。

# Colors

基础 UI 不重新配色。实现直接消费 TickDeck 主题入口中由 shadcn/Tailwind 默认预设提供的 `--background`、`--foreground`、`--card`、`--popover`、`--primary`、`--secondary`、`--muted`、`--accent`、`--destructive`、`--border`、`--input`、`--ring`、`--chart-1`–`--chart-5` 与 `--sidebar-*`；这些默认 token 的实际值决定最终视觉。浅色使用 `:root`，深色使用 `.dark`；“跟随系统”只解析为其中一套，不产生第三套颜色。mock 的背景、边框和强调色只表达层级关系，不覆盖该预设。

行情固定采用红涨绿跌：`market-up-*` 与 `market-down-*`。所有涨跌同时显示 `+ / −`、箭头、蜡烛方向或文字，不能只依赖颜色。系统成功、警告、危险、数据质量和 R0–R3 必须使用各自 token；尤其不能把“绿色”同时当成下跌和成功。

数据性质：“真实来源”、延时、演示、部分分别使用 `data-real-*`、`data-delayed-*`、`data-demo-*`、`data-partial-*`；当前可用性使用 `data-fresh-*`、`data-stale-*`、`data-missing-*`、`data-unsupported-*`、`data-unknown-*`。性质与可用性可以组合，且必须配文字、图标和影响短语；“真实来源”不等于实时、完整或已获当前用途许可。系统危险态使用 shadcn `var(--destructive)`；不得复用数据缺失、R2 或 R3 的颜色。R2 的琥珀色表示“需要人的决定”，不是错误；R3 的紫红色表示策略阻止且不存在覆盖入口。

正文与基础表面、次要正文与基础表面、焦点环与相邻表面的组合在两套主题下均须达到 WCAG 2.2 AA。`focus-visible` 采用默认 shadcn/Base UI 状态；可见轮廓须等效于至少 `2px` 实线，具有 `2px` offset，并与相邻颜色达到至少 `3:1` 的对比度。若当前预设未满足，在共享 shadcn 主题层修正，不能以页面私有颜色补丁规避。图表网格不得压过数据线；选中、悬停、焦点三种状态不能只靠细微明度区分。

# Typography

界面字体由 Tailwind 默认 `--font-sans` 预设决定，不在 UX 规格内强制替换；数字与代码使用默认 `--font-mono`。不下载强制网络字体。数字、时间戳、证券代码、价格、百分比和哈希使用 `{typography.numeric.fontFamily}`。正文不得低于 `{typography.micro.fontSize}`，`micro` 只用于辅助元数据；需要连续阅读的内容至少使用 `{typography.body.fontSize}`。

中文和英文共享字号级别，不通过缩小字号解决英文或中文溢出。列标题允许截断但必须可查看全称；风险、许可、数据状态和确认文案不得截断。

# Layout & Spacing

采用 4px 基础节奏。常规控件内部使用 `{spacing.2}` / `{spacing.3}`，面板使用 `{spacing.4}`，中央审阅产物使用 `{spacing.6}`。高密并不等于拥挤：行情表压缩纵向空白，解释性内容保留可扫描分组。

桌面验收最低为 `1280×720`，最佳为 `1440×900` 及以上。`≥1600px` 可同时展开上下文抽屉和 Agent；`1280–1599px` 默认收起上下文抽屉；低于 1280px 进入单面板专注布局但不构成 v1 移动验收。

全局导航轨使用 `{components.navigation-rail.width}`。左侧上下文抽屉和右侧 Agent 可调宽并记忆；中央图表不得低于 `{components.chart-canvas.minWidth}`。R2、错误和数据状态在任何支持宽度下都不能被裁切。

# Elevation & Depth

默认使用边框和表面明度分层。只有命令面板、模态确认、悬浮工具提示和拖拽预览使用阴影；不为普通卡片堆叠阴影。遮罩后仍应看见原工作上下文，但不得与确认面板争夺对比度。

# Shapes

继承 `base-vega` 的紧凑几何与 `{rounded.DEFAULT}`。表格、图表、停靠面板使用 `{rounded.sm}` 或直角相接；弹出层和审阅卡使用 `{rounded.lg}`。药丸只用于短状态标签、筛选项和上下文项，不用于主要按钮或长文案。

# Components

基础交互组件必须先选用 shadcn 官方 registry 中与当前 `components.json`、`base-vega` 和 Base UI 兼容的实现。Button、Input、Label/Field、Checkbox、Select、Tabs、Dialog、Sheet、Popover、Dropdown Menu、Tooltip、Command、Collapsible、Sidebar、Table、Skeleton 等不得以 mock 标记、自写 headless primitive、Radix/New York 变体或第三方 registry 作为平行基础。当前仓库尚未生成的组件，在实现阶段通过同一官方 registry 和项目 `components.json` 添加。

下表中的 TickDeck 组件是领域组合，而不是另一套基础组件库。Trust Strip、Risk Gate、Run Timeline、Chart Canvas、Agent Panel 等可以组合官方 primitive 并增加金融领域状态；其内部按钮、输入、菜单、Tabs、Dialog、Tooltip、Sheet、表单和焦点行为仍使用官方 `base-vega` 组件。只有官方组件确实没有所需能力时才允许扩展；扩展必须记录缺口、保留上游可访问语义，并经过相同 Reviewer Gate，不能静默替换基础库。

| 组件 | 视觉合同 | 阶段 |
|---|---|---|
| App Shell | neutral 画布、56px 导航轨、细边框分区；研究与系统只做导航分组，不做权限分组 | S0-V |
| Navigation Rail | Lucide 线性图标 + 文字提示；当前项使用 shadcn `--sidebar-accent`，焦点使用 `--ring` | S0-V |
| Context Drawer | 自选、对象树、数据窗口的停靠容器；可折叠、调宽、记忆状态 | S1 |
| Trust Strip | 常驻来源、数据时间、新鲜度与真实来源/延时/演示/部分标签；fresh/unknown 均有文字、图标与影响短语 | S0-V |
| Chart Canvas | 最大视觉面积；价量、指标、绘图保持同一坐标语言；上涨/下跌和多序列具有非颜色形态；Data Window 是其 shadcn 子模式 | S1 |
| Agent Panel | 右侧伴随面板；冻结 Context Chips、分层时间线、摘要和输入框；Context Chips 是其 shadcn 子模式 | S0-V |
| Run Timeline | 计划、当前步骤、工具事件、Gate、结果五类节点；异常节点对比增强 | S0-V |
| Risk Gate | R0–R3 独立 badge；R2 琥珀确认卡以不可折叠区域显示绑定摘要和一次性状态；R3 阻止态无覆盖按钮 | S2 |
| Review Canvas | 中央结构化产物；事实、计算、解释、未知与清单使用稳定分区 | S0-V |
| Notification Center | 持久抽屉；未读使用 accent soft，不用红点表达所有优先级；Toast 是其瞬时 shadcn 子模式且不能成为权威记录 | S4 |
| Data Table | 等宽数字、固定表头、行焦点与排序状态；涨跌同时显示符号 | S0-V |
| Command Palette | 居中浮层、分组命令、作用域和快捷键尾注；危险动作不直接执行 | S1 |
| Form Control | Base UI 行为；32px 视觉高度，交互目标至少 24×24；拖拽分隔线使用 ≥24px 透明命中区与可见 grip | S0-V |
| Status Badge | 短文本 + 图标/形态；禁止仅凭颜色 | S0-V |
| Empty State | 说明为什么为空、当前数据边界和合法下一步；允许“零候选”成为成功结果 | S0-V |
| Diagnostic Panel | 连接器、模型、沙箱、队列、通知和存储的脱敏诊断呈现 | S1 |
| Theme Control | 三项单选：浅色、深色、跟随系统；预览当前解析主题 | S0-V |

## Visual References

视觉参考覆盖 [S0-V 冻结筛选审阅 HTML](./mockups/key-s0v-screening-review.html) / [PNG](./mockups/key-s0v-screening-review.png)、[深色工作台 HTML](./mockups/key-workbench-dark.html) / [PNG](./mockups/key-workbench-dark.png)、[浅色工作台 HTML](./mockups/key-workbench-light.html) / [PNG](./mockups/key-workbench-light.png)、[策略实验室 HTML](./mockups/key-strategy-lab-backtest.html) / [PNG](./mockups/key-strategy-lab-backtest.png)，以及[连接与健康 HTML](./mockups/key-connections-health.html) / [PNG](./mockups/key-connections-health.png)。阶段和使用边界见 [EXPERIENCE.md 的 Visual References and Mock Coverage](./EXPERIENCE.md#visual-references-and-mock-coverage)。

# Do's and Don'ts

## Do

- 让图表、证据和状态比品牌装饰更醒目。
- 先使用 shadcn/Base UI 组件的默认 variant 与 Tailwind 语义 token；只有缺失的金融/数据/风险语义才扩展。
- 用官方 `base-vega` primitive 组合 TickDeck 领域组件；保留其 props、slots、`data-*` 状态、键盘和焦点合同。
- 在每个数据驱动表面常驻最小信任条，并把缺失、陈旧、超额贴近受影响内容。
- 用等宽数字、稳定列宽和对齐小数点帮助比较。
- 让深色与浅色主题在层级、焦点、数据状态和风险意义上完全等价。
- 明确标注 mock、演示、部分和未知；目标 v1.0 视觉不得冒充已通过 Gate 的 0.x 产品。

## Don't

- 不使用券商式买卖按钮、收益庆祝动效、社交热度或“AI 推荐”光效。
- 不把行情红绿复用于成功/失败，不用颜色作为唯一信息载体。
- 不在深色主题中使用纯黑大块吞没层级，也不在浅色主题中依赖极浅灰区分关键边界。
- 不把 Agent 做成占据首页的巨大输入框，不把复杂产物压进窄侧栏。
- 不以像素级复刻 TradingView、Codex、Claude 或 Kimi；只借鉴经批准的交互机制。
- 不为已有 shadcn 官方组件另造平行 Button、Input、Dialog、Tabs、Menu、Tooltip、Sheet、Field 或 Table，不混入其他 shadcn style 或第三方 registry 作为基础层。
- 不显示未经授权验证的连接器、模型或真实行情为“已支持/健康”。
- 不把 mock 中的手写颜色、阴影或控件细节提升为实现覆盖；与 shadcn 默认 variant 冲突时，以 DESIGN.md 的语义要求和 shadcn 默认 token 预设共同决定，实现不得以 mock 像素值为准。
