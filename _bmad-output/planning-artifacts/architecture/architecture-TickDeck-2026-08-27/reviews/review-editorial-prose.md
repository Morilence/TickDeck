# BMad Editorial Review — Prose Lens

- Review date: 2026-08-28
- Target: `../ARCHITECTURE-SPINE.md`
- Pass: `prose`（dependent on `review-editorial-structure.md`）
- Reader: human architects, implementers, reviewers, and maintainers
- Word metrics: 13,509 words after the accepted structure edits
- Structure model inherited from the preceding pass: Strategic/Context (Pyramid), with Explanation (Conceptual) inside the decision body
- Style baseline: Microsoft Writing Style Guide
- Editing constraint: preserve every stage Gate, FR/NFR/OQ binding, exclusion, UX contract, decision ID, and adopted rule; do not authorize a later-stage capability

This document exists to help TickDeck's architects and implementers build one consistent system without weakening the approved product, safety, stage, or UX contracts.

## Style, tone, and voice to preserve

The document intentionally uses a formal, enforcement-centered architecture voice. Chinese connective prose is mixed with English identifiers, enum values, protocol names, library names, and exact contract tokens. Preserve those tokens because they support implementation and review. Also preserve the repeated `Binds / Prevents / Rule` shape and repeated local statements about Gate, R2, `UNCERTAIN`, policy, and retry behavior: these repeats enforce different boundaries and are not editorial duplication.

The prose is dense but mostly controlled. It does not need a broad rewrite or terminology translation. The highest-value edits are small: clarify one support-window antecedent, split two overloaded sentences, replace three malformed or opaque phrases, and fix two missing spaces.

## High-value micro-edits

| Pass | Original Text | Revised Text | Changes |
| --- | --- | --- | --- |
| prose | **AD-21** — “当前稳定 minor 及前一个 minor 在后者发布后 90 天内获得 severe 安全修复。” | **Consider:** “当前稳定 minor 持续获得 severe 安全修复；前一个 minor 在当前稳定 minor 发布后的 90 天内同样获得修复。”? | “后者”在并列项中通常指“前一个 minor”，使 90 天从何时起算不清楚。修订按常见维护窗口解释；应用前应确认这确实是原意。 |
| prose | **AD-2** — “`packages/contracts` 的 canonical capability catalog 是唯一 capability ID/stage/schema 来源；release build 是 Capability Manifest 的唯一 producer，并从同一 catalog 生成 web/server/worker slices。Release Manifest 记录 catalog 与三份 slice digest；缺失、额外或 digest 不一致时 build/release fail，不能靠运行期降级掩盖。” | “`packages/contracts` 中的 canonical capability catalog 是 capability ID、stage 和 schema 的唯一来源。release build 是 Capability Manifest 的唯一生成方，并从同一 catalog 生成 web、server 和 worker slices。Release Manifest 记录 catalog 与三份 slice 的 digest。任一 slice 缺失、包含额外 capability 或 digest 不一致时，构建与发布必须失败；不得以运行期降级掩盖。” | 把一个中英混杂的复合句拆成依赖顺序；明确“缺失、额外”修饰 slice/capability，不改变唯一 producer 或 fail-closed 规则。 |
| prose | **AD-4** — “权威命令在一个串行 SQLite 写事务中完成状态/Gate/授权校验、唯一 operation 与幂等键占位、领域变更、不可变审计及 outbox/job 写入后提交；事务内禁止外部副作用。” | “权威命令必须在一个串行 SQLite 写事务中完成以下操作后提交：校验状态、Gate 和授权；占用唯一 operation 与幂等键；写入领域变更、不可变审计和 outbox/job。事务内禁止外部副作用。” | 把六项事务职责分成三个平行短语；保留同一事务和禁止副作用两项不变量。 |
| prose | **AD-5** — “任一绑定字段变化都原子 invalidates 为 `r2-state-changed`。” | “任一绑定字段变化时，必须在同一事务中将 Grant 标记为 `r2-state-changed` 并使其失效。” | 修复英文动词直接嵌入中文谓语造成的语法错误；明确“原子”指同一事务。 |
| prose | **AD-9** — “并为后 3 类声明 provider key 来源/传输位置/scope/retention、reconcile endpoint 与证据。” | “并为 `IDEMPOTENT_WITH_KEY`、`RECONCILABLE` 和 `NON_IDEMPOTENT` 声明 provider key 的来源、传输位置、scope、retention、reconcile endpoint 与证据。” | 用枚举名替代要求读者回数的“后 3 类”；补出所属关系，不改变三类义务。 |
| prose | **AD-17** — “共享 focus-visible 等效 2px、offset 2px、与相邻色至少 3:1；交互目标至少 `24×24px`。” | “共享的 `focus-visible` 指示样式至少等效于 2 px，offset 为 2 px，且与相邻颜色的对比度至少为 3:1；交互目标至少为 `24×24px`。” | 补齐计量对象和比较关系；消除“focus-visible 等效 2px”的歧义。 |
| prose | **AD-12** — “每个 compile/run 由一次性 `sandbox-host` supervisor 进程包住。” | “每次 compile/run 都由一个一次性 `sandbox-host` supervisor 进程托管。” | 用准确的进程关系替换口语化“包住”；不改变 one-shot supervisor 边界。 |
| prose | **AD-23** — “每个回测、比较、模拟订单、产物与报告必须显示其摘要和完整深链。” | “每个回测、比较、模拟订单、产物与报告必须显示其摘要，并提供指向完整内容的深链。” | 说明“完整”修饰链接目标，而不是未定义的“深链”类型。 |
| prose | **AD-15** — “优先使用官方组件并 compose-before-extend，只有记录 capability gap 且保持上游无障碍语义时才可扩展” | “优先组合官方组件，必要时再扩展（compose-before-extend）；只有记录 capability gap 且保持上游无障碍语义时才可扩展” | 先用中文表达策略，再保留英文策略名；避免把英文短语直接当中文谓语。 |
| prose | **AD-12 / AD-27** — “非 TickDeck WIT import并通过……”；“cancel endpoint并遵循 AD-4” | “非 TickDeck WIT import，并通过……”；“cancel endpoint，并遵循 AD-4” | 补两个缺失空格；纯机械修复。 |

## Preserve as written

- Preserve exact identifiers and enum values such as `RunContext`, `ExecutionAuthorization`, `ExternalRecipientId`, `DISPATCHING`, `UNCERTAIN`, `LOCKED`, `RESOURCE_LIMIT_*`, and `EffectSemantics`. Translating them would weaken code-to-document traceability.
- Preserve the repeated prohibitions around R2 replay, connector retries, dispatch authorization, and `UNCERTAIN`. They appear at different enforcement points and should not be merged for brevity.
- Preserve the five-platform OQ-06 wording, every resource limit, the process-tree termination rules, and the “no weaker fallback” rule. These are executable boundaries, not explanatory repetition.
- Preserve all stage matrices, UI visibility rules, v1 exclusions, reopen conditions, and unresolved OQ rows. None is a prose simplification target.

## Summary

- Recommendations: 10 high-value micro-edits.
- Estimated net reduction if all definite edits are accepted: about 15–30 words, less than 0.3% of 13,509 words.
- No length target was provided.
- Comprehension trade-off: none for the nine definite edits. The AD-21 support-window edit requires intent confirmation because the original antecedent is ambiguous.
- No broad terminology normalization or deduplication is recommended. The remaining density is appropriate for a binding architecture spine and protects downstream implementation from inference.
