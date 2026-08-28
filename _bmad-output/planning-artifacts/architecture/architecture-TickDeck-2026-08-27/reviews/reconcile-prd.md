# PRD ↔ Architecture Spine Finalize Reconciliation

- Input: `../../../prds/prd-TickDeck-2026-08-27/prd.md`
- Target: `../ARCHITECTURE-SPINE.md`
- Verdict: **CHANGES REQUIRED**
- Severity: **2 Critical, 7 High**
- Method: FR-001–FR-100, NFR-001–NFR-040, S0-V–S5, SM/SM-C, OQ-01–OQ-07, assumptions and explicit exclusions were checked against the spine as rendered for Finalize.

## Executive finding

The spine has strong coverage of state ownership, SQLite/outbox consistency, recovery, R2 non-replay, DataUse/Egress, sessions, Wasmtime isolation and the frontend contract. OQ-06's platform, isolation and process-tree termination decision is now structurally actionable without silently authorizing the capability. The remaining release-blocking gaps are not broad missing sections: they are two places where a downstream implementation could still obey every existing AD and violate the finalized PRD—the exact Gate/Stop semantics and the install/runtime contract for all four trusted extension classes.

## Critical findings

### C-01 — The Gate Registry does not yet inherit the PRD's exact Go and Stop/Narrow contract

**Source:** PRD current status and §6.6 define not only order but the exact vertical scope, Go evidence and failure action for each stage. A-01–A-05 remain unverified product assumptions; SM-00 failure stops platformization; S5 requires the full v1 SM/NFR set. The architecture frontmatter binds FR/NFR/OQ/stages but omits assumptions, SM and anti-metrics. AD-2 fixes ordering and a registration ceiling, but its stage table is a paraphrase without the Go and Stop/Narrow columns.

**Conflict/omission:**

- `S0` omits the PRD's demo data, unified tool/data contract, Run Manifest, risk policy and recovery baseline, while listing target architecture/UX work that the PRD already permits before S0 implementation.
- `S2` says “完整单 Agent、R0–R3”; without saying “only tools whose own stage is open” this can be read as registering S3/S4 tools early.
- No machine rule fixes the exact Go predicates or the mandatory Stop/Narrow result. An implementation could therefore use different evidence, keep building after SM-00 failure, or turn a failed gate into a warning while still conforming to AD-2's current prose.
- SM-08 and SM-C01–SM-C08 are not carried; AD-20's SM list silently skips SM-08 and all anti-metrics. A-01–A-05 and their failure actions do not appear at all.

**Required fix:** Make the PRD §6.6 Gate matrix (vertical ceiling, exact Go evidence, exact Stop/Narrow action) a versioned immutable input to the Gate Registry, and reproduce it losslessly or cite it normatively. State that “full Agent” at S2 means orchestration over `stage <= S2` tools only. Add A/SM/SM-C to the source bindings or a product-evidence section: architecture completion must not mark them validated. Preserve the current permission boundary: S0-V execution plus S0 architecture/UX/Epic work is allowed; S0 implementation is enabled only after OQ-06's decision **and required evidence**, and no later capability is authorized by being present in this target spine.

### C-02 — Four trusted extension types are promised, but only three connector types have a runtime boundary

**Source:** FR-077 formally supports data connectors, model provider adapters, Agent tools and notification channels. FR-078–FR-083 require typed manifests, contribution scaffolding, an explicit trusted-extension boundary, compatibility/deprecation rules and deployer installation without an online marketplace. FR-097 and SM-15 require source/hash/SBOM/permission diff, disable/withdraw/rollback and one official example per class.

**Conflict/omission:** AD-9 provides Broker/sidecar rules only for data/model/notification calls and restricts sidecars to vendor-SDK cases. AD-14 describes product tool registration, not third-party Agent-tool installation or execution. At the same time AD-9 prohibits arbitrary runtime npm/plugin loading. The structural seed has no Agent-tool extension port, installer/registry or lifecycle owner. A downstream unit can therefore legitimately choose “Agent tools are compile-time only” while another chooses “local sidecars”; either choice changes the security and compatibility model, and compile-time-only support is difficult to reconcile with FR-081/FR-097's deployer-installed trusted code.

**Required fix:** Decide one explicit local, operator-controlled packaging/discovery/execution path for **all four** extension classes that does not reintroduce arbitrary npm loading. Bind the owner of install/upgrade/disable/withdraw/rollback, permission diff, source/hash/SBOM verification, protocol compatibility, SecretRef access, Egress/DataUse enforcement and Gate registration. Add the Agent Tool Extension port and its composition point to the seed. Keep “no online market / no remote one-click install” and do not make the mere presence of the port an enabled-stage capability.

## High findings

### H-01 — Product assumptions and success/anti-metric evidence are not fully bound

The spine calls every architecture decision adopted, but it does not explicitly preserve that A-01–A-05 are unverified and cannot be closed by document completion. SM-08 is absent from AD-20 and all SM-C anti-metrics are absent. This is separate from implementation test coverage: the architecture must prevent a finalized document or green test suite from being treated as market, adoption or legal-data proof. Carry each assumption's owner, closing evidence and failure action, or normatively bind the PRD's assumption/metric sections from AD-2.

### H-02 — The explicit non-goal boundary is incomplete

AD-2 excludes users/RBAC/multitenancy, SaaS, multi-host, live and unattended trading, public REST, marketplace, mobile acceptance and several UX/deployment choices. It omits PRD exclusions that generic connector/model/Agent ports could otherwise enable: first-class ETF and non-A/HK markets; broker connections, copy trading and advisory services; social/live/course/public-script community; built-in/resold/bypassed Wind/Choice/iFinD data; automatic multi-model routing, multi-Agent orchestration, model hosting and local-model download management. It also does not preserve FR-070's Apache-2.0/no paid feature lock/no license server/no mandatory official-cloud-login release contract. Add these as exclusions, not Deferred items.

### H-03 — FR-092 binds both R1 and R2, but AD-5 binds only R2 precisely

AD-5 says R1 is scoped/revocable/expiring, then gives session/subject, tool/action, canonical parameter digest, state version, nonce, expiry and use-count semantics only for R2. FR-058 and FR-092 require R1 to bind the protected subject, tool/object/scope, parameter/state constraints and validity too; NFR-035 applies replay defenses to Agent authorization generally. The architecture must define how reusable scope authorization and per-operation exact binding compose. It must also preserve FR-059's canonical R2 classes and the confirmation evidence from §8.2 (object, parameters, cost, external-send scope, portfolio impact, expiry and revocability), so a policy implementation cannot silently downgrade a listed action to R1.

### H-04 — Demo data and compatibility-test-model architecture is only a prohibition, not a path

AD-2 correctly says demo evidence cannot close production Gates and Deferred preserves OQ-01, but no rule owns the demo connector/test-model path required by FR-005 and NFR-025. S0 needs clearly labeled non-current demo data; UJ-3/UJ-4 and the core UI, Agent, backtest and extension tests must work without commercial data or an external model. Add a deterministic demo connector and compatibility-test-model capability/fixture boundary (it may live in existing adapter/testkit packages), with provenance labels and an invariant that it never satisfies SM-10 or production maturity.

### H-05 — Diagnostic export and health-category rules do not land

FR-076 and NFR-015 require an operator-visible, pre-listed, automatically redacted diagnostic bundle; NFR-020 requires health to distinguish TickDeck itself, data connectors and model providers. AD-9 mentions connector health and AD-18 mentions supervisor health, but there is no authoritative diagnostic-bundle owner, DataUse/secret filter or stable health aggregation contract. Add a server-owned diagnostic manifest/export path using the same SecretRef and DataUse redaction boundaries; keep runtime logs non-authoritative.

### H-06 — Public extension compatibility policy is missing despite broad Binds claims

The spine versions schemas and protocols, but does not carry FR-082's SemVer policy, at least one minor-version deprecation warning/migration period and “only one current major” support boundary. It also omits NFR-027's invariant that public contract, migration notes and contract tests ship together. This is exactly a cross-unit consistency decision and should be a Rule, not left to package authors.

### H-07 — Release supply-chain and governance Gates are referenced but not enforced

AD-18 records SBOM/hash but does not require NFR-018's zero known severe dependency vulnerabilities or the ability to suspend an affected capability. AD-9/AD-18 do not state the PRD §8.1 prohibition on bundling unlicensed vendor SDKs, binaries, field dictionaries or example data. AD-9 and AD-19 claim FR-099 bindings without encoding CODEOWNERS/RFC/release/support/security-response requirements; OQ-07 only defers the backup maintainer. Add release-Gate evidence for vulnerability status, redistribution rights and FR-099/NFR-040 governance exercise. These are evidence Gates; they must not be portrayed as already satisfied.

## Coverage summary

| Requirement area | Result | Notes |
| --- | --- | --- |
| FR-001–FR-007 data/capability | Partial | Broker, provenance, DataUse and fail-closed behavior land; demo/test path and redistribution boundary do not. |
| FR-008–FR-024 research workbench | Covered | State authority, chart/table adapters, provenance/status and server export policy are structurally placed. Exact product catalog remains a PRD acceptance contract. |
| FR-025–FR-028 alerts | Covered | Notification adapter, outbox, evidence and controlled egress have owners; stage remains S4. |
| FR-029–FR-043 script/backtest | Covered | WIT-only guest, per-request compile/run processes, resource defaults, process-tree termination and five-profile evidence land. |
| FR-044–FR-051 paper portfolio | Covered | Deterministic core, single write path, R2, outbox, idempotency and recovery semantics land; stage remains S4. |
| FR-052–FR-064 Agent/risk | Partial | Orchestration authority and deterministic tools land; R1 exact binding/R2 policy mapping and S2 wording require correction. |
| FR-065–FR-069 models | Covered | User configuration, qualification, no silent fallback and credential boundary are placed. |
| FR-070–FR-076 self-hosting | Partial | Single-host sessions, persistence, backup/recovery and releases land; diagnostic bundle and open/free distribution clauses do not. |
| FR-077–FR-083 extensions | Not safe to hand off | Four-class installation/execution/lifecycle and compatibility model remains unresolved. |
| FR-084–FR-100 qualification/governance | Partial | DataUse/Egress/session/R2/outbox/sandbox/supply-chain primitives land; exact Gate, compatibility and governance evidence do not. |
| NFR-001–NFR-012 | Covered by source binding and test owners | Quantitative targets remain authoritative in the PRD; architecture does not weaken them. |
| NFR-013–NFR-020 | Partial | Core security/isolation/audit are strong; diagnostic and severe-vulnerability release gate are missing. |
| NFR-021–NFR-025 | Partial | Browser, a11y and UI bilingual contract land; bilingual installation/data/security/contribution docs and no-external-model test path are not explicit. |
| NFR-026–NFR-040 | Partial | Ports, tests, policy, recovery, sandbox and platform evidence land; public compatibility and governance release rules are missing. |
| OQ-01–OQ-07 | Covered | Owners and revisit gates are preserved; OQ-06 is correctly split into adopted technical choice plus unresolved implementation evidence. |
| SM/SM-C and A-01–A-05 | Partial | Most SM IDs are cited; exact Gate/failure semantics, SM-08, anti-metrics and unvalidated assumptions are not fully inherited. |
| Explicit exclusions | Partial | Several major PRD exclusions are missing; no prohibited capability is explicitly enabled, but generic ports leave room for drift. |

## Lower-severity cleanup before final status

- FR-072's user-facing warning that everyone admitted through the proxy shares the same permission and data should be explicit in the session/workspace Rule, not only implied by one admin secret.
- NFR-023 requires bilingual installation, data authorization, security and contribution guides; AD-17 currently governs only runtime i18n and accessibility.
- Preserve the PRD investment boundary in the Trust Strip: fact, deterministic calculation, model explanation and unknown must remain distinguishable; no promise of return or claim that TickDeck makes the final decision.
- Broad `Binds` entries such as “FR-001–FR-100” should not substitute for a real owner/rule. After the fixes, tighten mappings where a requirement is only transitively related.

## Finalize recommendation

Do not set `status: final` until C-01 and C-02 are resolved in the spine. Apply H-01–H-07 in the same revision because they are all preservation issues, not new product scope. Re-run deterministic lint and Reviewer Gate afterward; no PRD decision needs to be reopened to fix C-01, H-01, H-02, H-04–H-07, while C-02 and the R1 composition in H-03 require an explicit architecture choice consistent with the already-approved “no arbitrary runtime npm/plugin loading” boundary.
