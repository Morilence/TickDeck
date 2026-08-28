# TickDeck PRD 安全与数据治理第二次复审

## Gate verdict

**PASS WITH MEDIUM/LOW FOLLOW-UPS — 0 Critical，0 High。**

本次只回归上一轮唯一剩余 High（本地 loopback 浏览器安全）并扫描最新改动是否引入新的 Critical/High。该 High 已在功能要求、非功能验收、发布门槛和 addendum 四层闭合；未发现新的 Critical 或 High。

## 计数

| 严重度 | 数量 |
|---|---:|
| Critical | 0 |
| High | 0 |
| Medium | 7 |
| Low | 1 |

## 本地 loopback High 回归

### RECHECK-H-001：Closed

- **功能合同：** FR-089（PRD 第 346 行）现在明确要求“本地回环和远端部署”均建立实例级受保护会话并防护 CSRF；FR-090（第 347 行）要求所有模式校验 Host、Origin、WebSocket 握手并防护 DNS rebinding。
- **可验收门槛：** NFR-033（第 454 行）要求本地与远端的未授权状态修改、错误 Host/Origin、CSRF、跨站 WebSocket 和 DNS rebinding 成功率均为 0；SM-14（第 483 行）将这些测试绑定到 v1.0 发布 Gate。
- **交付边界：** addendum 第 206–210 行明确说明恶意网页可攻击回环地址，并要求所有模式具备受保护会话、浏览器来源/DNS rebinding 防护和安全的首次本地会话引导；远端代理校验作为额外要求保留。
- **判定：** 原问题不再依赖“localhost 即安全”的错误假设，且要求已从说明提升为自动化零成功攻击门槛，High 关闭。

## 新 Critical / High 扫描

**None。**

最新改动没有削弱已关闭的 DataUsePolicy、EgressPolicy、Agent 最终风险与不可重放授权、审计/副作用一致性、沙箱固定合规套件、秘密备份隔离或扩展供应链门禁。新增的 FR-066 与 SM-17 还把完整 Agent 资格绑定到精确模型版本、提示版本、工具集以及多步语义、风险、提示注入和取消基准，未形成新的越权通道。

## Remaining Medium / Low

上一轮 8 个 Medium 中，“提示注入没有明确模型资格 Gate”已由 FR-066 与 SM-17 关闭。其余 **7 Medium** 保留：秘密存储后端与 canary 泄漏扫描、扩展最小权限强制、审计最低字段与篡改/删除语义、模拟交易历史更正语义、连接器技术成熟度与 entitlement 分轴、隐私数据流清单、安全报告渠道前移至公开 alpha。

**1 Low** 保留：NFR-018 中“严重”“已知”及漏洞例外的统一判定口径尚待发布测试计划明确。
