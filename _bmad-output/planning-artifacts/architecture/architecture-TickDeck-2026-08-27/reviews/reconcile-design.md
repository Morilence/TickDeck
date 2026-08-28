# DESIGN.md ↔ Architecture Spine Finalize Reconciliation

- Review date: 2026-08-27
- Input: `../../ux-designs/ux-TickDeck-2026-08-27/DESIGN.md`
- Target: `../ARCHITECTURE-SPINE.md`
- Verdict: **CONDITIONAL PASS**
- Severity count: **Critical 0 / High 4 / Medium 3 / Low 0**

## Executive finding

The spine correctly treats `DESIGN.md` as a binding source, binds all UX contracts, and supplies strong architecture for server-authoritative state, stage gating, charts, tables, Agent authority, R2 non-replay, bilingual delivery, accessibility testing, and same-origin frontend delivery. No rule directly authorizes a later-stage capability early.

The remaining problem is under-specification at four load-bearing UI seams. Two downstream teams could obey the current AD wording yet choose different shadcn styles/registries, assign different stage ownership to named UX surfaces, render materially different Trust/Risk contracts, or implement different viewport behavior. The final spine should close those seams without copying all visual tokens from `DESIGN.md`.

## Coverage matrix

| DESIGN contract | DESIGN evidence | Spine evidence | Assessment |
| --- | --- | --- | --- |
| shadcn `base-vega`, Base UI, official default registry, compose-before-extend, Tailwind variables, neutral, Lucide | DESIGN lines 9–21, 175, 213–215, 246–247, 260 | Stack names Tailwind, shadcn CLI, Base UI and Lucide at spine lines 210–213; AD-16 only says tables are wrapped with shadcn/Base UI at lines 146–154 | **Gap / High H-1.** Package selection is present, but the exact style, registry, ownership and no-parallel-primitives rule are not architectural invariants. |
| Shared color/status/theme semantics | DESIGN lines 22–58, 177, 181–187, 250, 256–257 | AD-17 requires non-color cues and WCAG at spine lines 156–160; AD-20 tests theme combinations at lines 174–178 | **Partial / Medium M-1.** Accessibility survives, but red-up/green-down separation, independent status/risk/data semantics, shared-theme-only overrides and light/dark/system parity are only implicit through the source link. |
| Typography, bundled fonts and numeric treatment | DESIGN lines 59–96, 191–193 | AD-15 forbids runtime fonts at lines 140–144; AD-17 centralizes finance formatting at lines 156–160 | **Substantially carried.** Exact typography tokens can remain in DESIGN; no conflicting spine rule exists. |
| Desktop-first responsive boundary | DESIGN lines 195–201 | Mobile acceptance is excluded at spine line 60; AD-20 has an unspecified viewport matrix at lines 174–178 | **Gap / High H-4.** The spine omits the `1280×720` acceptance floor, `1600px` dual-panel behavior, `1280–1599px` drawer behavior, sub-1280 focus mode, and the no-clipping constraint for R2/errors/data status. |
| Named component visual and interaction contracts | DESIGN lines 114–168, 203–235 | AD-13–17 cover data, storage and accessibility behavior but do not identify a canonical UI contract owner | **Partial.** Visual constants may stay in DESIGN, but the spine should explicitly declare DESIGN's component table normative and define where its theme/component composition is owned. |
| Component-level stage assignments | DESIGN lines 217–235 | AD-2 enforces a generic `S0-V → S0 → S1 → S2 → S3 → S4 → S5` registry at spine lines 54–60; Monaco is explicitly S3 at line 154 | **Gap / High H-2.** The mechanism is correct, but the named UI surfaces are not bound to DESIGN's stage table, so a conforming implementation could declare a different stage for Chart Canvas, Context Drawer, Risk Gate, Notification Center or Diagnostic Panel. |
| Trust Strip and data-truth rendering | DESIGN lines 127–130, 181–185, 222, 248, 251, 261 | Server authors `as-of` and Trust Strip state at spine lines 128–132; field-level quality is adjacent in tables at lines 146–152; stage evidence cannot be faked at lines 54–58 | **Partial / High H-3.** Authority is correct, but the required payload and placement are not: source, time, freshness, real/delayed/demo/partial nature, availability and impact phrase must remain together on every data-driven surface; unqualified providers must not appear supported/healthy. |
| Charts and Data Window | DESIGN lines 131–133, 201, 223 | AD-16 fixes Lightweight Charts, TickDeck ChartModel, server/sandbox compute, snapshot/delta sequence recovery, keyboard operation and Data Window/table alternative at spine lines 146–150 | **Strong match.** The only remaining design-level items are visual hierarchy, min width and non-color series cues; these are covered by H-4/M-1 and the normative DESIGN reference. |
| Data tables | DESIGN lines 151–153, 229, 249 | AD-16 fixes TanStack Table/Virtual, semantic small tables, server pagination, stable IDs, accessible pagination and adjacent quality states at spine lines 151–152 | **Strong match.** Exact density and numeric typography may stay in DESIGN. |
| Agent Panel / Run Timeline | DESIGN lines 134–139, 224–225, 258 | AD-14 makes Agent an authority-free orchestrator and records runs/steps/calls at spine lines 134–138; AD-15 scopes panel state to ephemeral Zustand at lines 140–144 | **Partial / Medium M-2.** Security and state ownership are strong; the canonical view model for frozen Context Chips and the five timeline node classes is not stated. This can be included with H-3's server-authored presentation contract. |
| Risk Gate | DESIGN lines 51–58, 140–144, 185, 226 | AD-5 fully defines R1/R2 scope binding, one-shot consumption and no replay at spine lines 76–80; AD-14 prevents R3 tool registration at lines 134–138 | **Partial / High H-3.** The behavioral security contract is strong, but the UI contract lacks a server-authored binding summary, visible one-shot state, non-collapsible R2 region, and explicit `R3 = blocked, no override control`. |
| Bilingual behavior | DESIGN lines 191–193 | AD-17 fixes bundled `zh-CN`/`en-US`, pseudo-long resources, typed keys, `lang`, source text preservation and no online auto-translation at spine lines 156–160 | **Strong match.** |
| WCAG / focus / target sizes | DESIGN lines 183, 187, 193, 231–232 | AD-17 fixes WCAG 2.2 AA, non-color cues and accessible Canvas/virtualization; AD-20 requires axe plus manual keyboard/screen-reader acceptance at spine lines 156–160 and 174–178 | **Partial / Medium M-3.** The spine preserves the standard, but not DESIGN's stricter shared focus-ring and hit-target invariants. Referencing the DESIGN component contract as normative is sufficient if implementation tests explicitly consume it. |
| Mock and future-capability honesty | DESIGN lines 239, 251, 261–262 | AD-2 says mocks/demos/vendor claims cannot close Gates and absent capabilities are not registered at spine lines 54–58 | **Strong match.** |

## High-severity findings

### H-1 — The exact frontend primitive contract is not binding in an AD

**Risk.** The Stack table proves dependency intent, not implementation policy. A team could use shadcn with another style, Radix primitives, a third-party registry, or hand-written parallel Button/Dialog/Table components and still plausibly claim compliance with AD-15/16. That would violate DESIGN lines 175 and 213–215.

**Required spine correction.** Add a concise UI-system rule (preferably in AD-15) that fixes:

- `components.json` and the shared theme layer as TickDeck-owned implementation authority;
- shadcn `base-vega` + Base UI + official default registry;
- Tailwind CSS variables, neutral base and Lucide;
- official-first, compose-before-extend;
- no Radix/New York/third-party registry or hand-written parallel primitives;
- extensions require a recorded capability gap and preserved upstream accessibility semantics.

Do not duplicate DESIGN's full token table in the spine; declare the DESIGN token/component contract normative.

### H-2 — Named UX surfaces are not bound to their fixed stage assignments

**Risk.** AD-2 requires each UI entry to declare a stage but does not state that the declaration must equal DESIGN lines 217–235. A downstream implementation can therefore declare Chart Canvas or Diagnostic Panel too early without textually contradicting AD-2.

**Required spine correction.** Make DESIGN's component-stage table an input to Capability Manifest generation and validation. At minimum, fix these assignments in the rule or a compact map:

- S0-V: App Shell, Navigation Rail, Trust Strip, Agent Panel shell, Run Timeline, Review Canvas, Data Table, Form Control, Status Badge, Empty State, Theme Control;
- S1: Context Drawer, Chart Canvas, Command Palette, Diagnostic Panel;
- S2: Risk Gate;
- S4: Notification Center;
- S3: Monaco editor, already explicit in AD-16.

The early Agent Panel is only its stage-appropriate shell and visible registered tools; it must not imply access to later-stage tools. The generic server Gate and absent-registration rules remain authoritative.

### H-3 — Server authority is defined, but the Trust/Risk/Agent presentation contract is not

**Risk.** `server-authored Trust Strip state` is too broad. Independent UIs could omit impact phrases, collapse the R2 binding summary, present R3 with an override, mark an unqualified connector healthy, or derive Agent timeline categories locally while still obeying the existing state-authority rule.

**Required spine correction.** Define a versioned server-authored presentation/read-model contract:

- Trust status includes provenance/source, as-of/data time, freshness, data nature (`real | delayed | demo | partial`), availability (`fresh | stale | missing | unsupported | unknown`), qualification/Gate state, and localized impact parameters;
- the minimum Trust Strip is always present on data-driven surfaces, with field-adjacent degradation where relevant;
- Risk Gate read model includes R0–R3, immutable binding summary, expiry/consumption state and next legal action; R2 is non-collapsible while pending and R3 exposes no override action;
- Agent view model includes frozen Context Chips and stable timeline node kinds (`plan | current-step | tool-event | gate | result`);
- connector/model health shown to users is server-qualified, never inferred from installation or a mock.

The client localizes labels but may not synthesize or relax these states.

### H-4 — Desktop and responsive acceptance boundaries are absent

**Risk.** The current `viewport matrix` wording allows incompatible layouts and does not prevent clipping critical risk/data state at the minimum supported size.

**Required spine correction.** Add the DESIGN boundaries to AD-15 or AD-20: desktop acceptance starts at `1280×720`; `≥1600px` may show Context Drawer and Agent together; `1280–1599px` defaults the Context Drawer closed; `<1280px` uses single-panel focus mode and is not v1 mobile acceptance. Enforce a `640px` chart minimum and no clipping/truncation of R2, errors, permission, or data-status content at supported viewports. Drawer/Agent widths are user-adjustable UI preferences, never authoritative state.

## Medium findings

### M-1 — Theme and financial color semantics rely only on transitive source binding

Preserve in the architectural UI-system rule that light, dark and system are first-class; red-up/green-down cannot double as success/failure; data nature, availability, system status and R0–R3 are distinct semantic token families; all meanings require non-color cues. Exact hex values stay in DESIGN.

### M-2 — Agent visual contract is not represented as a stable read model

Resolve through H-3. This is not an Agent authority defect: AD-14 correctly prevents Mastra/model ownership and hidden tool exposure.

### M-3 — Stricter focus and hit-target requirements are not connected to acceptance tests

Keep WCAG 2.2 AA in AD-17 and add contract tests sourced from DESIGN for the shared `focus-visible` rule (`2px` equivalent, `2px` offset, `3:1` adjacent contrast), minimum `24×24` targets, non-truncated risk/permission/data/confirmation text, and keyboard behavior inherited from Base UI. These are shared-component tests, not page patches.

## Stage-authority audit

- **No direct premature authorization found.** Spine lines 54–60 make the server Gate Registry authoritative, require absent capabilities not to register, reject mocks/demos/vendor claims as evidence, and retain OQ-03/OQ-02 blockers.
- **Frontend storage cannot bypass stages.** Spine lines 140–144 limit Router, Query, Zustand and local storage to non-authoritative roles.
- **Chart transport remains stage-scoped.** Spine lines 128–132 allow high-frequency WebSocket only behind stage/protection gates.
- **Editor is explicitly S3.** Spine line 154 does not expose browser execution and keeps server/sandbox authority.
- **Risk behavior is not prematurely enabled by being specified.** AD-5 defines target semantics; H-2 is needed to make the S2 UI assignment mechanically unambiguous.
- **Future mockups remain non-authoritative.** AD-2 blocks mock evidence, matching DESIGN lines 251 and 261–262.

## Finalize acceptance condition

Finalize can pass this input reconciliation after H-1–H-4 are represented as lean AD rules or explicit normative bindings. The full visual token, typography, spacing, radius and mock details should remain in `DESIGN.md`; the spine only needs to eliminate architectural and stage ambiguity and name DESIGN's component contract as normative.
