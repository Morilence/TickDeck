# Editorial Prose Review — TickDeck UX Spine Pair

| Item | Read |
|---|---|
| Purpose read | 这组规范帮助架构、story/dev 与 QA（human or AI）在不重新解释产品决策的前提下，随机定位视觉 token、阶段门、组件、状态、执行/风险合同与验收责任，并据此实现或验证 TickDeck。 |
| Reader type | Humans；按随机查阅的规范性 spine pair 审读，不把全文改写成教程或叙事文。 |
| Style guide | Microsoft Writing Style Guide；优先采用直接、明确、可扫描且术语一致的表达。 |
| Dependency | 已读取 `review-editorial-structure.md`。以下只审 surviving location 的 prose：不重复 MOVE/MERGE/CONDENSE/QUESTION，不审 frontmatter、标题层级或表格结构。 |
| Content boundary | 产品决策、阶段、风险含义和技术边界均视为 sacrosanct；修订仅消除歧义、悬空修饰、术语漂移或会改变验收读法的语法问题。 |

## 保留的语体选择

| Choice | Why it stays |
|---|---|
| 规范性中文配合稳定 English identifier | `Trust Strip`、`Risk Gate`、`Context Chips`、ARIA/CSS/API 属性、状态值及 FR/NFR/OQ ID 是可检索的实现词汇，不做同义替换或强行汉化。 |
| “必须 / 不得 / 默认拒绝 / 只允许” | 这些是阶段门、安全与验收合同，不软化为建议口吻。 |
| 表格中的分号、斜线和紧凑字段串 | 在字段集合、状态集合和并列约束中保留高密表达；仅当斜线或修饰范围会产生两种读法时提出修订。 |
| 事实、确定性计算、模型解释、未知项、运行清单的重复命名 | 这是跨表面的稳定证据语言，不视为冗余。 |
| 人名旅程、Climax/失败路径和中文 UI 文案 | 它们为 human reader 提供端到端情境，并不削弱规范性。 |
| 审计字段、状态转换和风险回执的精确列举 | 这些是可核查合同，不为“更顺口”而概括。 |

## Prose findings

| Pass | Location | Original Text | Revised Text | Why |
|---|---|---|---|---|
| prose | `DESIGN.md:181`，§Colors | “系统危险使用 shadcn `var(--destructive)`，不得复用数据缺失色、R2 或 R3。” | “系统危险态使用 shadcn `var(--destructive)`；不得复用数据缺失、R2 或 R3 的颜色。” | “系统危险”像主语而不是状态名；后半句也把“色”只挂在“数据缺失”上，容易误读复用禁令的范围。 |
| prose | `DESIGN.md:183`，§Colors；`EXPERIENCE.md:289`，§焦点、语义与回返 | “至少 2px 等效实线、2px offset、与相邻颜色至少 3:1 的可见轮廓”；“至少 2px 实线或等面积轮廓、2px offset，并与相邻颜色达到 3:1” | 两处统一为：“可见轮廓须等效于至少 `2px` 实线，具有 `2px` offset，并与相邻颜色达到至少 `3:1` 的对比度。” | 当前并列项把线宽、offset 和对比度写成同一种名词成分，`3:1` 也缺少“对比度”宾语；统一后不改变 AA 门槛。 |
| prose | `DESIGN.md:218`，§Components > Risk Gate | “R2 琥珀确认卡内不可折叠显示绑定摘要和一次性状态” | “R2 琥珀确认卡以不可折叠区域显示绑定摘要和一次性状态” | “不可折叠显示”可被读成“不可以折叠显示”，也可被读成“不可以显示”；补出“区域”消除句法歧义。 |
| prose | `EXPERIENCE.md:13`，§Foundation | “§Foundation — previous external-workspace wording” | “TickDeck v1.0 是桌面优先、自托管、在同一受信工作区内共享状态的 B/S Web 产品。UI 基于 React、shadcn/ui `base-vega`（Base UI）和 Tailwind CSS；视觉身份以 [DESIGN.md](./DESIGN.md) 为准。最终实现采用 TickDeck 自身 shadcn 配置所解析的官方 `base-vega` 组件、默认 variant、交互语义和 Tailwind/shadcn 语义 token 预设。UX 只定义官方组件之上的行为差异，以及预设未覆盖的行情、数据质量和 R0–R3 语义。本地与远端自托管提供相同的产品能力；不承诺原生桌面壳、移动端验收、官方托管、完整离线或多租户。” | 外部参考已内化为 TickDeck 自身的 UI 合同；拆句后各项边界清晰，且不产生跨仓依赖。 |
| prose | `EXPERIENCE.md:37`，§应用壳 | “Agent 不占一级导航，而是右侧伴随面板与‘运行历史’中的任务实体。” | “Agent 不占一级导航；其交互入口是右侧伴随面板，其运行实例是‘运行历史’中的任务实体。” | 原句把 Agent 同时等同于面板和任务实体，未说明一个是入口、一个是运行实例。 |
| prose | `EXPERIENCE.md:120`，§Component Contracts > Agent Panel | “S0-V 只有 R0，waiting/paused/recovery 从 S2 进入” | “S0-V 只有 R0；`waiting`、`paused`、`recovered` 从 S2 起可用。” | 同一行的关键状态列使用 `recovered`，正文却使用 `recovery`；统一 machine-readable state 可避免实现出第二个状态名。 |
| prose | `EXPERIENCE.md:118,153`，§Component Contracts > Trust Strip；§数据状态 | 关键状态为 “`real`”；正文为“`real-source`、`delayed`、`demo`、`partial` 是来源性质” | 保留关键状态 `real`，并把正文改为：“`real`、`delayed`、`demo`、`partial` 是来源性质；界面显示‘真实来源’，避免孤立的‘真实’暗示实时、完整或许可已确认。” | 同一来源性质出现两个英文 identifier；修订保留既有中文显示文案，同时只留下一个可实现的状态值。若 `real-source` 才是代码侧 canonical 值，则应反向统一两处，但不能并存。 |
| prose | `EXPERIENCE.md:217`，§Risk Gate 状态与转换 | “不再次消费或重试产生第二副作用” | “不得再次消费；重试不得产生第二次副作用。” | 原句中“重试”既可能与“再次消费”并列，也可能修饰“产生”；拆开后两条禁止条件的作用域明确。 |
| prose | `EXPERIENCE.md:220`，§Risk Gate 状态与转换 | “呈现与确认、失效、阻止、消费、恢复分别成事件” | “呈现、确认、失效、阻止、消费和恢复分别记录为独立事件” | “与”造成错误分组，“成事件”缺少记录动作；修订明确每一步都是独立审计事件。 |
| prose | `EXPERIENCE.md:224`，§Risk Gate 状态与转换 > 绕过/竞态用例 | “pending 仍需完整确认，expired/changed 只可新建确认” | “`r2-pending` 仍需完整确认；`r2-expired` / `r2-state-changed` 只可生成新确认。” | 简写与权威状态表中的 canonical 状态不一致，`changed` 还可能被理解为任意变化；使用完整状态名可直接对应实现和验收。 |
| prose | `EXPERIENCE.md:270`，§Data, Model, Risk & Audit Contract | “完整 Agent 模式只使用运行清单中已通过代表性资格测试的精确 `model + prompt hash + toolset`；资格 manifest 与运行共同保存。” | “完整 Agent 模式只能使用运行清单中已通过代表性资格测试的精确 `model + prompt hash + toolset` 组合；资格 manifest 与该次运行一并保存。” | “精确”缺少被修饰的中心词，“与运行共同保存”也未说明是该次运行记录；补词后资格绑定关系明确。 |
| prose | `EXPERIENCE.md:276,278`，§Responsive & Platform | “`<1280px` 进入一次只展开一个伴随面板的专注布局并提示不在 v1 验收范围”；“R2 对象、绑定摘要、影响、有效期和确认/拒绝在 `1280×720` 及 200% 缩放下均可依次到达。” | “`<1280px` 时进入专注布局：一次只展开一个伴随面板，并提示该布局不在 v1 验收范围。”“在 `1280×720` 及 200% 缩放下，用户仍可按顺序到达 R2 对象、绑定摘要、影响、有效期，以及确认和拒绝操作。” | 第一处的“并提示”修饰对象不清；第二处省略执行者且把字段和操作用斜线并列，影响响应式与键盘验收读法。 |
| prose | `EXPERIENCE.md:309`，§文本、主题与 fixture | “风险、许可、数据状态、Gate、错误、长 model/provider ID 不用 ellipsis 或仅 `title` 隐藏，允许换行或可聚焦展开/copy，并保留完整 accessible name。” | “风险、许可、数据状态、Gate、错误和长 model/provider ID 不得以 ellipsis 截断，也不得只在 `title` 中提供完整文本。应允许换行，或提供可聚焦的展开/复制控件，并保留完整 accessible name。” | 原句可能被读成“既不用 ellipsis，也不用仅 `title` 隐藏”，但没有明确禁止只依赖 `title`；“展开/copy”也未指出必须是控件。 |
| prose | `EXPERIENCE.md:341`，§UJ-3 | “外部调用和 secret reference 必须重新验证，不会自动重启。” | “恢复后，外部调用不会自动重启；secret reference 必须重新验证。” | 原句会让读者误以为“外部调用”也要被“重新验证”，同时“不自动重启”的主语不明；修订把两个恢复边界分别落到正确对象。 |

## Verdict

| Result | Read |
|---|---|
| Prose pass | 14 条去重后的可执行修订；其中 2 条合并了跨文件或跨位置的同类问题。没有提出内容变更，也没有重复 structure findings。除表中问题外，规范性中文、稳定 English identifier 和审计式高密表达均 **PASS**。 |
