# EXPERIENCE ↔ TypeScript 6.0.3 / AD-32 Update Reconciliation

- Input: `../../../ux-designs/ux-TickDeck-2026-08-27/EXPERIENCE.md`
- Target: `../ARCHITECTURE-SPINE.md`
- Review scope: only the current TypeScript 6.0.3 pin and AD-32 engineering-quality update
- Verdict: **PASS — no blocking or material consistency finding**
- Severity: **Critical 0 / High 0 / Medium 0 / Low 0**

## Executive verdict

The update is consistent with the final EXPERIENCE contract. TypeScript 6.0.3 and AD-32 constrain repository construction and static quality; they do not alter which UX surfaces are visible by stage, introduce a second desktop UI/runtime, change the authoritative recovery or R1/R2 states, weaken bilingual/accessibility obligations, or make lint/typecheck/build evidence sufficient for UX acceptance. No correction to the spine or EXPERIENCE is required from this reconciliation.

## Findings

### F-01 — Stage visibility and no-teaser behavior remain authoritative

- EXPERIENCE evidence: every 0.x build may show only Gate-passed entries; disabled menus, lock teasers and placeholder pages are forbidden. S0-V exposes only the read-only validation slice and excludes sandbox, alerts, portfolio, R1/R2 and full recovery (`EXPERIENCE.md:19-35`).
- Spine evidence: AD-2 still binds the exact stage ceiling and mounts routes/navigation only after the relevant Gate passes; `locked` and `suspended` remain diagnostic states, not UI teasers (`ARCHITECTURE-SPINE.md:94-128`). AD-32 explicitly says its S0-V skeleton quality contract registers or authorizes no S1–S5 capability (`ARCHITECTURE-SPINE.md:444`).
- Result: **PASS.** Adding a formatter, linter, hook or build check cannot make a future route, Monaco, Risk Gate, notification surface or other later-stage module visible.

### F-02 — Web and desktop still use one SPA, state model and authorization path

- EXPERIENCE evidence: desktop, local B/S and remote B/S must expose the same capabilities, states and Gates through one React SPA; the Tauri shell must not create a second UI or business-interaction contract (`EXPERIENCE.md:13-15`, `EXPERIENCE.md:308-314`).
- Spine evidence: the paradigm and AD-30 still require one product payload and the same `apps/web` SPA, HTTP/SSE/scoped-WS, session, read model and command contract for browser and desktop WebView; desktop cannot add a second renderer, API, state authority or authorization channel (`ARCHITECTURE-SPINE.md:41-46`, `ARCHITECTURE-SPINE.md:364-380`). AD-32 assigns browser globals only to Web and Node globals only to server/worker/tools, without defining a second desktop TypeScript renderer (`ARCHITECTURE-SPINE.md:414`, `ARCHITECTURE-SPINE.md:440`).
- Result: **PASS.** The TypeScript 6.0.3 environment split reinforces the existing process boundary and does not fork the desktop experience.

### F-03 — Recovery and authorization UX states are unchanged

- EXPERIENCE evidence: disconnect, refresh, client close, service restart and R2 expiry have distinct visible results; waiting/paused/recovered and all R1/R2/R3 states are service-authoritative and cannot be granted by client presentation (`EXPERIENCE.md:137-153`, `EXPERIENCE.md:169-178`, `EXPERIENCE.md:216-271`).
- Spine evidence: the fixed execution states still include `WAITING` and `PAUSED`, with `recovered` as provenance and `running-disconnected` as a client projection (`ARCHITECTURE-SPINE.md:140-146`). R1 scope/revocation and the complete R2 binding, invalidation, single-use consumption and audit sequence remain server-owned (`ARCHITECTURE-SPINE.md:148-154`). AD-30 still says closing a desktop window only detaches the client and does not cancel a durable run (`ARCHITECTURE-SPINE.md:368`).
- Result: **PASS.** AD-32 does not redefine these state machines, authorize client-side decisions or collapse recovery/confirmation evidence into a build result.

### F-04 — i18n and accessibility remain behavior and acceptance contracts

- EXPERIENCE evidence: the same SPA must pass dual-language and accessibility acceptance across browser/WebView profiles; WCAG 2.2 AA, focus return, non-color semantics, keyboard equivalents, 200% zoom and pseudo-long fixtures are explicit behavioral evidence (`EXPERIENCE.md:308-345`, `EXPERIENCE.md:368`).
- Spine evidence: AD-17 continues to require packaged `zh-CN`, `en-US` and pseudo-long resources, stable typed keys, explicit language semantics, WCAG 2.2 AA, keyboard/accessibility alternatives, minimum focus contrast and target size (`ARCHITECTURE-SPINE.md:272-278`). AD-20 still requires Storybook/axe, real browsers/system WebViews, keyboard and screen-reader evidence and the delivery-surface/language/theme/viewport/data-state matrix (`ARCHITECTURE-SPINE.md:292-296`).
- Result: **PASS.** Prettier, Stylelint and EditorConfig govern source quality only. Their success cannot satisfy focus, screen-reader, locale expansion, zoom or cross-surface acceptance.

### F-05 — Engineering checks remain additive to UX acceptance

- EXPERIENCE evidence: acceptance depends on observable interaction and failure-state behavior, including stage projection, Risk Gate, recovery, focus, responsive layout, language and real WebView/browser behavior; static mock or code-shape evidence is insufficient (`EXPERIENCE.md:80-92`, `EXPERIENCE.md:316-345`, `EXPERIENCE.md:392-405`).
- Spine evidence: AD-32 adds four independent baseline CI checks—`lint`, `format-check`, `typecheck` and `build`—and explicitly binds AD-20 (`ARCHITECTURE-SPINE.md:406-444`). AD-15's TypeScript 6.0.3 compatibility rule separately requires clean installation/typecheck/build **and** keyboard/a11y regression before the Web starter is accepted (`ARCHITECTURE-SPINE.md:250-258`).
- Result: **PASS.** The four engineering checks are necessary but not sufficient. Existing UX acceptance and exact-bits browser/desktop evidence remain additional Gate inputs.

## Quiet-requirement preservation summary

| Experience invariant checked | Result |
| --- | --- |
| Only passed-stage routes and surfaces mount | Preserved |
| No disabled future navigation, lock teaser or placeholder promise | Preserved |
| Browser and Tauri WebView run the same React SPA and contracts | Preserved |
| Client close/navigation does not cancel durable work | Preserved |
| Waiting, paused, recovered, disconnected and R1/R2/R3 semantics | Preserved |
| `zh-CN` / `en-US` / pseudo-long and stable language behavior | Preserved |
| WCAG 2.2 AA, keyboard, focus, reader, zoom and real-platform evidence | Preserved |
| Lint/format/typecheck/build do not replace UX acceptance | Preserved |

## Handoff note

No architecture correction is required. Downstream SPEC/Epic/Story/sprint refreshes should cite AD-32 and TypeScript 6.0.3 while retaining the existing EXPERIENCE scenario, state, i18n, accessibility and cross-entry acceptance fixtures; this review does not authorize editing those downstream artifacts.
