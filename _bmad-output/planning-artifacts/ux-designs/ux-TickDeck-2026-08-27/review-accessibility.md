---
title: TickDeck UX Reviewer Gate — Accessibility / Usability Final Recheck
status: complete
reviewed: 2026-08-27
review_type: accessibility-usability-targeted-final-recheck
gate_verdict: pass
ux_finalize_blockers: 0
implementation_or_qa_evidence_assessed: false
---

# TickDeck UX Reviewer Gate — Accessibility / Usability

## Final verdict

**PASS。0 Critical / 0 High / 0 Medium / 0 Low；UX-final blocker = 0。** 上轮最后三项正式视觉参考问题 M-01、M-02、L-01 均已修复并通过本地 Chrome/Playwright 定向复测，没有发现新的 UX 合同或正式视觉参考问题。

本结论只覆盖当前 UX spine 与正式 HTML/PNG 是否足以指导实现。200% 缩放、辅助技术组合、动态 live region、通知、虚拟化、resize 键盘行为、主题/双语/R3 fixture 仍需由未来运行实现按既有合同产生测试证据；它们继续作为 implementation / QA handoff 单列，不计入本轮 UX finding。

## Scope and method

- 定向复核文件：`mockups/key-workbench-dark.html/.png`、`key-workbench-light.html/.png`、`key-strategy-lab-backtest.html/.png`。
- 规范依据：`DESIGN.md:183,195-197`；`EXPERIENCE.md:294-331`，尤其 focus、Tabs、progress、responsive 与 fixture 合同。
- 浏览器视口：每张受影响 HTML 均实测 `1280×720` 与 `1600×1000`；检查 document/client 尺寸、横向溢出、56px rail、字号、控件、R2 Agent 滚动和真实焦点。
- DOM/ARIA：逐一解析两个 tablist 的 roving tabindex、selected 状态、`aria-controls`、tabpanel 和反向 `aria-labelledby`；检查重复 ID 与 progressbar value。
- PNG：逐张以原始 1600×1000 查看，并核对生成时间晚于对应 HTML。

| Severity | Open count | Result |
|---|---:|---|
| Critical | 0 | PASS |
| High | 0 | PASS |
| Medium | 0 | M-01、M-02 RESOLVED |
| Low | 0 | L-01 RESOLVED |
| Implementation / QA handoff | 8 | 非 UX finding，不阻断 UX final |

## Targeted resolution evidence

### M-01 — 工作台常驻伪焦点：RESOLVED

**Static evidence**

- `key-workbench-dark.html:27` 与 `key-workbench-light.html:27` 的 `.action.primary` 已删除常驻 focus-like box-shadow 和“当前键盘焦点”伪元素；只保留主操作的正常边框/前景样式。
- 两文件 `:40` 的真实 `button:focus-visible` 继续使用 `2px solid`、`2px offset`，焦点完全由 DOM focus 驱动。

**Browser evidence**

- 深浅两主题初始加载均为 `:focus-visible = 0`；R2 主按钮 computed `box-shadow: none`，`::after content: none`。
- 首次 Tab 后，深色焦点落在“命令”，outline 为 `rgb(183,208,255) solid 2px`；浅色为 `rgb(30,64,175) solid 2px`。两主题均只有一个 `:focus-visible`，未聚焦的 R2 主按钮仍无 shadow。
- 深色 `1280×720` 从页面起点连续 Tab，第 26 个可见焦点抵达“确认本次模拟”；此时仍只有一个 `:focus-visible`。Agent 自动滚至 `scrollTop=275`，按钮位于视口 `y=594–628`，没有被 composer 遮挡。

**Result:** 真实焦点唯一、可见且与静态主按钮样式不混淆，M-01 关闭。

### M-02 — 策略两个 tablist 语义闭环：RESOLVED

`key-strategy-lab-backtest.html` 当前包含两组完整静态 Tabs 状态：

| Tablist | Tabs | `tabindex=0` | `tabindex=-1` | selected | refs closed | panel visibility |
|---|---:|---:|---:|---:|---|---|
| 策略文件 | 2 | 1 | 1 | 1 | PASS | active visible；inactive hidden |
| 回测审阅视图 | 6 | 1 | 5 | 1 | PASS | active visible；inactive hidden |

具体闭环：

- 每个 tab 都有唯一 ID、`role="tab"`、`aria-selected`、roving `tabindex` 和 `aria-controls`。
- 每个 `aria-controls` 都解析到存在的 `role="tabpanel"`；每个 panel 的 `aria-labelledby` 反向引用对应 tab。
- active panel 可见，inactive panels 使用 `hidden`；全页 17 个 ID 均唯一，没有重复。
- 策略文件组位于 `key-strategy-lab-backtest.html:680-708`；回测审阅组位于 `:726-777`。

**Result:** 两组 tablist 的静态语义、引用与选中状态全部闭合，M-02 关闭。箭头键/Home/End 的运行行为仍按 Base UI Tabs 合同进入 implementation QA，不要求无 JS 的视觉参考伪造交互。

### L-01 — 策略运行进度 programmatic value：RESOLVED

`key-strategy-lab-backtest.html:783` 的视觉进度轨当前为：

- `role="progressbar"`
- accessible name：`确定性回测运行进度`
- `aria-valuemin="0"`
- `aria-valuemax="100"`
- `aria-valuenow="100"`
- `aria-valuetext="已完成，100%"`
- 内部纯视觉 fill 为 `aria-hidden="true"`

浏览器解析到唯一一个 progressbar，所有 value 与屏幕文字 `100% · 42.8s` 一致。L-01 关闭。

## PNG refresh evidence

三张正式 PNG 均为 RGB `1600×1000`，且修改时间晚于对应 HTML：

| PNG | HTML modified | PNG rendered | Visual check |
|---|---|---|---|
| `key-strategy-lab-backtest.png` | 20:27:04 | 20:30:52 | 进度、tabs、三栏布局完整 |
| `key-workbench-dark.png` | 20:31:23 | 20:31:51 | 无“当前键盘焦点”伪标注；R2 双操作完整 |
| `key-workbench-light.png` | 20:31:23 | 20:31:53 | 无“当前键盘焦点”伪标注；R2 双操作完整 |

视觉参考继续保持相同 scenario、阶段、Trust Strip、数据状态和 R2 风险含义；本轮语义修复没有改变产品范围或安全边界。

## Responsive regression check

| HTML | Viewport | Document | Overflow X | Rail | Min visible font | Min control axes |
|---|---:|---:|---:|---:|---:|---:|
| Workbench dark | 1280×720 | 1280×720 | 0px | 56px | 12px | 32px / 32px |
| Workbench light | 1280×720 | 1280×720 | 0px | 56px | 12px | 32px / 32px |
| Strategy lab | 1280×720 | 1280×1000 | 0px | 56px | 12px | 44px / 32px |
| Workbench dark | 1600×1000 | 1600×1000 | 0px | 56px | 12px | 24px / 29px |
| Workbench light | 1600×1000 | 1600×1000 | 0px | 56px | 12px | 24px / 29px |
| Strategy lab | 1600×1000 | 1600×1000 | 0px | 56px | 12px | 44px / 32px |

策略屏在 720px 高度继续使用页面纵向滚动而非裁切；工作台继续使用 Agent 独立滚动。三屏均无横向布局回归，最小可见字号仍为 12px，可见控件两轴仍不低于 24px。

## Explicit PASS

1. 真实焦点唯一；R2 主按钮不再常驻伪焦点。
2. R2 在 `1280×720` 仍可由 Tab 自动滚动抵达且未被遮挡。
3. 两个策略 tablist 的 roving state、selected state、controls/panel 双向引用及 visibility 全部闭合。
4. 完成进度具有 programmatic role、name、min/max/now/text，视觉 fill 不重复进入可访问树。
5. 三张 PNG 已随 HTML 修复重新渲染，仍为 1600×1000，未残留旧焦点示意。
6. `1280×720` 与 `1600×1000` 均保持 0px 横向溢出、56px rail、12px 最小可见字号和 ≥24px 控件目标。
7. 没有新增外链、脚本、产品能力、阶段暗示或与 spine 冲突的交互状态。

## Implementation / QA handoff — not UX findings

| Handoff | Authoritative UX contract | Future evidence |
|---|---|---|
| 200% 与 reflow | `EXPERIENCE.md:294-300,329-331` | 1280×720 @ 200%、browser zoom、R2 全路径无核心裁切/双向滚动 |
| 动态 focus 与回返 | `EXPERIENCE.md:306-311` | Drawer/Dialog/Command Palette/错误/通知/R2 完成和拒绝后的真实焦点轨迹 |
| Agent/live/progress | `EXPERIENCE.md:313-318` | 去重 live summary；失败、恢复、R2 pending/expired；确定/不确定进度 |
| Notification Center / Toast | `EXPERIENCE.md:242-257,319` | 焦点、读屏、未读/action-required/delivery-failed、Toast 暂停/关闭/去重 |
| Keyboard routing | `EXPERIENCE.md:198-200,323` | IME → modal → scoped surface → global；Tabs 箭头/Home/End；R2/R3 无快捷绕过 |
| Virtualized data | `EXPERIENCE.md:321-325` | rowcount/index、排序、focus pin、加载边界和读屏位置 |
| Resize | `EXPERIENCE.md:325` | Arrow/Home/End、重置、值播报、焦点保留与 24px hit area |
| Theme / bilingual / R3 fixtures | `EXPERIENCE.md:327-331` | light/dark/system × zh/en/pseudo-long × 100/200%；R3 无覆盖按钮 |

这些项目在真实实现完成前不能被宣称“产品已通过 WCAG 2.2 AA”，但合同明确、可直接转为验收用例，因此不计为 UX-final finding。

## Gate

**PASS。Critical 0 / High 0 / Medium 0 / Low 0。** M-01、M-02、L-01 全部 `RESOLVED`；当前 Accessibility / usability Reviewer Gate 不再保留 UX finding。
