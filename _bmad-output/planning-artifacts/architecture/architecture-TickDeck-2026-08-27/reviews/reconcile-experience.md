# EXPERIENCE → Architecture Spine Reconciliation

**Verdict:** `NEEDS_FIX` — 0 critical, 4 high.  The spine preserves the product scope, stage order, OQ boundaries, and most UX authority, but four architecture-level gaps could still permit a compliant-looking implementation to violate the final EXPERIENCE contract.

**Reviewed inputs**

- `ux-designs/ux-TickDeck-2026-08-27/EXPERIENCE.md` (`status: final`)
- `architecture/architecture-TickDeck-2026-08-27/ARCHITECTURE-SPINE.md` (working Finalize draft observed on 2026-08-27)

This reconciliation treats EXPERIENCE as the normative behavior contract and asks a stricter question than keyword coverage: could two teams obey every architecture rule yet produce materially different or unauthorized UX behavior?

## Executive reconciliation

| Required area | Result | Evidence and judgment |
| --- | --- | --- |
| Stage surfaces and no premature authorization | **Partial — H1** | AD-2 preserves `S0-V → S5`, the capability ceilings, OQ-02/OQ-03 blockers, S3 sandbox, S4 notifications/portfolio, S5 extensions, and explicit exclusions. Its component-stage list also mirrors the EXPERIENCE component table. However, `locked`/`suspended` capabilities are not explicitly prohibited from rendering as disabled navigation, teaser, or placeholder, which EXPERIENCE forbids for every 0.x build. |
| Navigation and shell topology | **Partial — H1** | The spine binds all UX contracts and places Context Drawer/Chart/Agent surfaces, but it does not architecturally bind the two navigation groups, the exact primary surfaces, the rule that Agent is not primary navigation, or the exact restoration boundary of Review Canvas. These are not visual preferences; they prevent incompatible shell/routing implementations. |
| Trust Strip and local data states | **Pass** | AD-13 makes the server-authored, versioned read model authoritative; requires a persistent minimum Trust Strip, provenance/source, as-of, nature and availability dimensions, qualification/Gate and impact; and keeps local degradation adjacent. The time convention separately preserves acquired/sync/snapshot identity. AD-7 propagates permission and lineage. EXPERIENCE remains the source for the exact collapsed/expanded field list. |
| Agent and Risk Gate states | **Partial — H3** | AD-13 correctly makes the server read model authoritative, exposes R0–R3, keeps pending R2 uncollapsed and removes R3 override. AD-5 gives R1 scope/revocation/expiry and atomic single-use R2. The persisted R2 binding is nevertheless narrower than the EXPERIENCE binding and invalidation contract; see H3. |
| Async execution and recovery | **Partial — H2** | Lease fencing, immutable RunContext, disconnect-not-cancel, safe replay, `UNCERTAIN`, cancellation ordering and artifact quarantine are strong. The fixed execution enum omits required `waiting` and `paused`, while `recovered` and `running-disconnected` are not defined as projections/provenance. A downstream implementation cannot derive every required UX state without inventing semantics. |
| Notifications | **Partial — H4** | AD-13 correctly says the product notification record is authoritative and Toast is transient; AD-4/AD-8/AD-9 provide outbox, egress and connector controls. It does not require trigger evidence and delivery attempts to be separate identities/state machines, so retry or failure handling can overwrite a successful trigger. |
| Save, revoke, delete and confirmation | **Pass with inherited detail** | AD-15 separates Draft API from formal versions and excludes secrets/auth/R2 from drafts; AD-16 requires expected version and conflict diff; AD-5 makes R1 revocable and R2 single-use. EXPERIENCE remains authoritative for displayed autosave time, delete impact/recoverability, and “overwrite becomes new version or R2.” Add these to acceptance fixtures rather than creating another storage authority. |
| Context freeze and deep links | **Pass with inherited detail** | AD-4 freezes RunContext in the admission transaction; AD-13 keeps it immutable; AD-15 permits only non-sensitive deep-link state and excludes grants/secrets. EXPERIENCE remains authoritative for Context Chip removal/rebind behavior, object/version/error preservation on failed links, and exact Review Canvas return restoration. |
| Model qualification | **Pass** | AD-14 pins provider/model/prompt/toolset, requires full qualification, denies R1/R2 on handshake alone, and keeps deterministic computation outside the model. AD-13 carries qualification/Gate state to presentation. EXPERIENCE still governs the precise degraded message and the allowed no-side-effect single-step R0 fallback. |
| DataUse/Egress disclosure | **Pass** | AD-7 and AD-8 make permission and egress server-enforced, fail closed, inherited by derived/export/backup data, and bound to risk. AD-13 exposes policy impact; AD-5 binds policy digests. EXPERIENCE continues to govern local-download preview versus external-send disclosure wording and fields. |
| Charts, tables and accessibility | **Pass** | AD-16 establishes chart/table adapters, sequence-gap reload, keyboard plus Data Window, semantic/non-virtual table alternatives, stable row IDs, server-side export policy and no browser script execution. AD-17 and AD-20 bind WCAG 2.2 AA, non-color semantics, focus/target floors, pseudo locale, real browsers, manual keyboard/screen-reader evidence and the full UX matrix. Exact focus return, virtual-row pinning, live-region throttling, zoom, and chart shape fixtures remain normative in EXPERIENCE. |
| UJ-1 auditable screening | **Pass, dependent on H1/H3/H4 fixes** | Deterministic screening, immutable evidence context, Trust Strip, S4 reminders and R2 portfolio mutation are all placed in core/server/policy/web boundaries and stage-gated. No model truth or silent source fallback is authorized. |
| UJ-2 strategy validation | **Pass, dependent on H2/H3 fixes** | S3 compiler/sandbox/backtest, source maps, frozen context, deterministic calculations, budget/policy checks, immutable evidence and S4 R2 portfolio connection are represented without weakening the sandbox gate. |
| UJ-3 protected workspace operations | **Pass** | Protected session, proxy/Host/Origin/WS checks, in-product secret configuration, independent Vault, layered health, backup compatibility, generation reset and closed egress after restore support the journey and its failure path. |
| UJ-4 contribution without commercial data | **Pass** | S5-only four-class extension governance, demo-state semantics, typed contracts/manifests, pinned artifacts, SBOM, sandbox/trusted separation and default-deny publishing evidence support the journey. The architecture does not claim a real vendor integration. |

## High findings

### H1 — UI Gate semantics can still render forbidden future-capability teasers

**Source contract:** EXPERIENCE lines 21–31 requires each 0.x build to show only passed entries and explicitly forbids disabled menus, lock teasers and placeholder pages. Lines 43–55 fix the shell as Research/System groups, list the primary surfaces and state that Agent is a companion panel, not primary navigation.

**Spine evidence:** AD-2 says capabilities included in the build but lacking evidence remain `locked` or `suspended`, and later lists component stages. AD-15 code-splits by Capability Manifest. Neither rule states that a locked/suspended server capability must be absent from navigation and routing, nor fixes the top-level IA/Agent placement.

**Why this is high:** Team A can hide every unpassed route while Team B renders locked menu items and an Agent route. Both can claim conformance to the current architecture, but Team B violates the final stage and IA contracts and prematurely signals later capability.

**Required fix:** In AD-2 or AD-15, distinguish server registry state from UI surface exposure: a UI route/navigation item is mountable only when its Gate is passed; `locked`/`suspended` may be returned by diagnostics but must not render a disabled entry, teaser or placeholder. Bind the primary shell topology: Research/System groups, exact first-level surfaces by stage, Agent only as companion panel plus run entity, and Review Canvas as a central overlay/view with exact context restoration delegated to the UX contract.

### H2 — Fixed job enum cannot express the required waiting/pause/recovery projections

**Source contract:** EXPERIENCE lines 167–171 requires queued, running, waiting, paused, completed, failed, canceled and interrupted, with browser/navigation disconnect not canceling. Lines 190–202 require S2 `waiting`, `paused`, `recovered`; lines 260–271 require `running-disconnected`, recovered/interrupted differentiation, event cursor and recovery decision visibility.

**Spine evidence:** AD-4 fixes states to `QUEUED | LEASED | RUNNING | SUCCEEDED | FAILED | CANCELED | INTERRUPTED | UNCERTAIN`. It gives correct lease and crash behavior but no authoritative representation for waiting or paused, and does not say whether recovered/disconnected are execution states, recovery provenance, or client projections.

**Why this is high:** One team may overload `RUNNING`, another may stop the lease but call it `FAILED`, and a third may introduce incompatible private states. Resume, notification, audit and UI behavior then diverge even though all teams follow the fixed enum.

**Required fix:** Define a single canonical projection. Either add durable `WAITING`/`PAUSED` states with legal transitions, or explicitly model them as orthogonal `wait_reason`/`pause_state` fields with no active lease. Define `recovered` as recovery provenance/event over the resulting execution state and `running-disconnected` as a client connectivity projection over authoritative `RUNNING`; preserve last event cursor and last-success timestamp. Keep `UNCERTAIN` distinct and non-retryable without a fresh decision.

### H3 — Persisted R2 binding does not name all UX-required invalidators

**Source contract:** EXPERIENCE lines 230–254 defines exact Risk Gate states, audit transitions, race behavior and a non-collapsible R2 summary. The binding includes subject/session, run ID, `tool@version`, parameter hash, snapshot/manifest ID, data nature/freshness/completeness, portfolio version, both policy judgments, estimated cost/egress/portfolio impact, expiry and single use. A change to tool version, snapshot/data state, portfolio version, subject/session or policy must invalidate confirmation.

**Spine evidence:** AD-5 binds subject, workspace, action/tool, normalized parameter digest, generic state version, policy digests, nonce and expiry. AD-13 calls the read-model summary immutable, but the grant contract does not explicitly bind run ID, tool version, snapshot/manifest and data state, portfolio version or expected impact/cost.

**Why this is high:** A new tool build, revised snapshot or changed portfolio may still match the generic action/parameter digest. An implementation can therefore consume an old confirmation against materially changed evidence while technically satisfying the current AD-5 field list.

**Required fix:** Extend the authoritative grant binding and invalidation check with the EXPERIENCE fields. If some are encoded in canonical parameters or aggregate state, name that canonical closure explicitly and test each field-change fixture. Preserve separate audit events for presented, confirmed, invalidated/expired, blocked, consumed, result and recovery; do not collapse them into one success event.

### H4 — Reminder trigger and channel delivery are not separate durable lifecycles

**Source contract:** EXPERIENCE lines 256–271 says Notification Center is authoritative, Toast is not, reminder trigger success and channel delivery result are separate, and delivery retry/failure must not erase trigger evidence. It also names the audit fields for trigger ID, channel, attempt, policy and error.

**Spine evidence:** AD-4 supplies outbox and retry/uncertainty rules; AD-9 routes notification adapters; AD-13 makes in-product notification records authoritative. No rule gives trigger and delivery separate IDs/status transitions or constrains retries to a delivery attempt under the original trigger.

**Why this is high:** Two conforming implementations can either preserve a successful market-condition trigger or overwrite it with `delivery-failed`. This changes research evidence, alert correctness and recovery semantics.

**Required fix:** Declare a durable `AlertTrigger` record and one-to-many `NotificationDeliveryAttempt` records (or equivalent canonical aggregates), each with independent state/version/IDs. The center must show both; retry only delivery under policy/egress/risk revalidation and never recompute or overwrite trigger evidence. Keep this capability absent before S4.

## Non-blocking trace notes

These are already normative through the `sources` binding and do not justify duplicating the whole UX document into the lean spine, but downstream SPEC/story acceptance must link them explicitly:

1. Exact Context Drawer/Agent Panel/Review Canvas focus and restoration behavior, deep-link failure object/version/error preservation, and Command Palette scope/escape ordering.
2. Autosave timestamp, versioned-overwrite/new-version behavior, delete impact/recoverability disclosure and diagnostics local-download versus external-send preview.
3. Exact Trust Strip collapsed/expanded fields, Agent result five-way partition, strategy/backtest disclosure fields and qualification-degraded copy.
4. Full surface-state fixture table, 200% zoom, pseudo-long, live-region coalescing, focused virtual-row pinning, resize keyboard semantics and Notification Center focus return.

## Scope and authorization check

No architecture rule authorizes users/orgs/RBAC, multitenancy, SaaS control plane, cross-host operation, live trading, unattended trading, multiple Agents, automatic model fallback, public REST, marketplace/remote install, mobile acceptance, native shell, full offline behavior or default telemetry. OQ-02 and OQ-03 remain blocking; OQ-06 is closed only as a technical architecture choice and still requires the five-profile compliance evidence before registration. The Wasmtime decision therefore does not authorize S3 behavior in S0/S1.

## Exit condition

After H1–H4 are made explicit in the spine, this input reconciliation can move to `PASS`; the remaining UX detail should stay in EXPERIENCE and be enforced through source-linked SPECs, stories and acceptance fixtures rather than copied verbatim into the architecture spine.
