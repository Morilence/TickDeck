# Addendum ↔ Architecture Spine Reconciliation

- Input: `prds/prd-TickDeck-2026-08-27/addendum.md`
- Target: `architecture-TickDeck-2026-08-27/ARCHITECTURE-SPINE.md`
- Review date: 2026-08-27
- Verdict: **CHANGES_REQUIRED**
- Severity count: **Critical 0 / High 8 / Medium 1 / Low 0**

## Executive verdict

The spine preserves the core topology and most security invariants well: the single-host control-plane ownership boundary, SQLite/artifact split, leases/outbox/recovery semantics, R2 single-use grants, DataUsePolicy/EgressPolicy, protected sessions, Vault/SecretRef, backup/restore reset, and one-shot Wasmtime termination boundary all reconcile with the addendum without material weakening.

Finalize should not pass yet. Eight load-bearing addendum constraints are either absent or only implied. The largest gaps are the S0-V fail-fast build boundary, the fixed Apache/open-source release contract, extension supply-chain lifecycle, model-profile limits, concrete sandbox resource profiles, the deterministic backtest assumption contract, and an incomplete list of excluded/deferred directions. These omissions can let downstream units remain nominally compliant with the ADs while silently expanding scope or producing incompatible behavior.

## High findings

### H-1 — S0-V is ordered but not constrained to its validated minimum or fail-stop outcome

- **Addendum evidence:** lines 15–19 require the same-real-task Agent-on comparison, the full decision metric set and two-week reuse; S0-V is limited to one lawful data path, read-only screening and R0 Agent; it does not require sandbox, reminders, simulated portfolio or full recovery; failure of SM-00 stops platformization.
- **Spine evidence:** AD-2 (lines 54–60) establishes `S0-V → S0 → …` and prevents evidence-free unlocking, but it does not define the S0-V capability allowlist, fail-stop result, or the comparison evidence needed to leave S0-V.
- **Risk:** a downstream plan can tag later platform capabilities as S0-V, or continue implementing the target platform after SM-00 fails, without contradicting the current AD wording.
- **Required reconciliation:** add to AD-2 that S0-V registers only the legal real-data path, read-only screening and constrained R0 Agent; name the frozen task/oracle/comparison evidence and two-week reuse; require SM-00 failure to stop platformization; state that sandbox, reminders, simulation and full recovery are absent from S0-V rather than merely locked in UI.

### H-2 — Fixed Apache-2.0 delivery and open-source sustainability gates are missing

- **Addendum evidence:** lines 21‒28 and 34–41 fix Apache-2.0, prohibit paid feature locks, license servers, mandatory official-cloud accounts and default telemetry; lines 237–247 require primary/backup maintainers, CODEOWNERS and permission recovery, RFC/breaking-change/release/rollback processes, issue/PR support targets, a security channel with 72-hour acknowledgement and 7-day initial triage, the current and previous stable minor security-support window, and a release/security-response exercise before v1.0 RC.
- **Spine evidence:** AD-18 covers packaging and rollback and AD-19 disables default telemetry, while Deferred OQ-07 mentions only a backup maintainer. The fixed license and the rest of the v1.0 RC governance gate are absent.
- **Risk:** a release can satisfy AD-18 while adding a license server, official-account dependency or unsustainable single-maintainer release process, contrary to the source boundary.
- **Required reconciliation:** bind the Apache-2.0/no-feature-lock/no-license-server/no-required-cloud-account rule into the release AD and make every addendum governance item an explicit v1.0 RC Gate; beta may continue when the sustainability gate fails, but v1.0 may not.

### H-3 — Connector support truth and third-party binary redistribution are not fail-closed

- **Addendum evidence:** lines 56–95 state there are no Wind/Choice/iFinD credentials or contracts, none is currently integrated or supported, vendor-specific deployment/caching/redistribution is unknown, and vendor binaries must not be bundled without explicit permission.
- **Spine evidence:** OQ-03 (line 317) correctly blocks S1 and avoids preselecting a provider; AD-9 defines HTTP/file/db adapters and approved sidecars. It does not explicitly forbid claiming a named vendor supported before contract qualification, nor does AD-18 forbid vendor binary redistribution in its self-contained bundle.
- **Risk:** `connectors-official` or the phrase “self-contained bundle” can be interpreted as permission to ship a proprietary SDK or mark a provider supported from mock/manifest evidence alone.
- **Required reconciliation:** state that Wind, Choice and iFinD are unqualified/unsupported until real-account, contract and deployment tests pass; vendor binaries are excluded from Apache artifacts unless redistribution rights are verified; qualification must cover fields, entitlement, rate limits, reconnect, caching, remote deployment and DataUse actions.

### H-4 — The stable extension surface and supply-chain lifecycle are incomplete

- **Addendum evidence:** lines 188–199 define four stable trusted extension surfaces—data connectors, model adapters, Agent tools and notification channels—plus a separate sandbox script API. Each requires typed I/O/error semantics, identity/version/compatibility/capability/permission manifest, boundary validation, demo and contract tests, semver/deprecation. Trusted supply-chain records include source, content hash, locked version, SBOM, permissions, SecretRefs, compatibility and installer confirmation; permission/source/hash changes require renewed authorization; runtime disable/revoke/rollback and CODEOWNERS review are required.
- **Spine evidence:** AD-9 covers data/model/notification broker manifests but omits Agent tools as a governed extension surface and omits source/hash/SBOM/installer confirmation, permission diff/new authorization, semver/deprecation, disable/revoke/rollback and CODEOWNERS approval. AD-18's release SBOM is not an extension authorization record.
- **Risk:** two extension implementations can both satisfy AD-9 while using incompatible contracts or silently expanding permissions during upgrade; an Agent tool adapter can sit outside the broker/policy lifecycle.
- **Required reconciliation:** extend the trusted-extension rule and structural seed to cover Agent tool adapters explicitly; define the complete manifest, contract-test, semver/deprecation and lifecycle requirements; treat source/hash/permission changes as fresh operator authorization. Preserve the ban on arbitrary runtime npm/plugin loading.

### H-5 — Model-provider configuration and runtime scope boundaries are under-specified

- **Addendum evidence:** lines 180–186 require provider, Base URL, API key, Model ID, custom headers, timeout, retry, context length, pricing and default parameters; local models remain an operator-run compatible service; TickDeck does not download/quantize/manage GPU/inference; handshake tests are R0 only; no silent provider fallback.
- **Spine evidence:** AD-9 line 106 exposes endpoint/API-key management and AD-14 defines qualification, deterministic truth and R0/R1/R2 separation. The complete profile schema, local-inference operational exclusion and no-silent-fallback rule are absent.
- **Risk:** a model adapter may silently route to a different provider, alter cost/DataUse recipients, or grow into model lifecycle/GPU management while still satisfying the current rules.
- **Required reconciliation:** make the minimum model profile fields, exact provider/model/prompt/toolset binding, operator-owned compatible local endpoint, no inference lifecycle management and no automatic external fallback explicit. Fallback must be a separately configured, re-qualified and policy-visible action.

### H-6 — OQ-06 limits name mechanisms but omit the source's bounded default resource profiles

- **Addendum evidence:** lines 160–178 require fixed per-release sandbox conformance and provide default hard bounds: compile 10 s; indicator preview 5 s / 512 MiB / 10 MiB output; strategy backtest 60 s / 1 GiB / 50 MiB output. Profiles may be tightened or explicitly confirmed upward, but no hard-limit-off switch is permitted.
- **Spine evidence:** AD-12 lists memory/table/instance, fuel, epoch, I/O and wall-clock limits and forbids disabling the wall-clock, but gives no operational profiles or revisit gate for exact values.
- **Risk:** implementations can choose materially different limits, including effectively unbounded memory or output, while claiming the named controls exist.
- **Required reconciliation:** put the three baseline profiles in AD-12 or a bound convention; allow only stricter values or explicitly confirmed versioned high-cost profiles; state that every resource dimension is non-disableable and tested on all five release profiles.

### H-7 — Deterministic backtest ownership is stated, but the shared execution-assumption contract is absent

- **Addendum evidence:** lines 142–158 require visible bar/tick and unconfirmed-bar semantics; fees, taxes, slippage, partial fills and fill granularity; A-share T+1, price limits, suspension and market units; HK lots, currencies and fees; revisions/corporate actions/non-reproducibility; parameter-scan and in/out-of-sample overfitting evidence.
- **Spine evidence:** AD-14 assigns calculations to deterministic domain services and the conventions record market time/as-of/incomplete bars, but no versioned `BacktestAssumption`/execution model is frozen in RunContext or emitted into result provenance.
- **Risk:** two downstream backtest units can obey every current AD yet disagree on fill timing, fees, T+1, corporate actions and reproducibility, producing incomparable results.
- **Required reconciliation:** define a single versioned execution-assumption schema owned by `packages/core`, freeze it in RunContext, require every result/report to expose it, and include all addendum market/fill/data-revision/overfitting fields. Qualification fixtures must cover A-share and HK-specific rules.

### H-8 — The explicit scope guardrail list is incomplete and changes deferred items into unstated possibilities

- **Addendum evidence:** lines 249–260 exclude full TradingView/global-asset replication, live brokerage execution, users/RBAC/multitenancy, SaaS, arbitrary npm/node:vm, and defer ETF/futures/options/FX/crypto/US stocks, automatic multi-model routing/multi-Agent orchestration, public REST/plugin market. Lines 183 and 197 also exclude model-host operations, remote one-click extension install and public script community commitments.
- **Spine evidence:** AD-2 line 60 lists several exclusions, but omits global/full-TradingView replication, all deferred asset classes, automatic model routing/multi-Agent orchestration, remote one-click installation, public script community and model-host operations. Node/npm is covered elsewhere, but the distinction between excluded and deferred directions is not complete.
- **Risk:** later-stage teams can interpret unlisted directions as already in S0–S5 target scope, violating the user's instruction not to authorize future capabilities.
- **Required reconciliation:** add a compact, source-faithful `Excluded` versus `Deferred product direction` guardrail. Keep deferred items out of Capability Manifest and API/extension contracts until a new product decision explicitly reopens them.

## Medium finding

### M-1 — Trusted-proxy responsibility and identity use should be made exact

- **Addendum evidence:** lines 34–39 and 214–228 assign remote authentication, HTTPS, access logs and outer rate limiting to the deployment proxy; trusted forwarding headers are accepted only from exact proxy sources; proxy identity is for audit only and must not create users/RBAC.
- **Spine evidence:** AD-6 requires HTTPS or an explicit trusted proxy source, blocks bypass and rejects users/RBAC, but does not explicitly allocate access logging/rate limiting or say forwarded identity is audit-only.
- **Risk:** a later implementation may treat a forwarded user header as an authorization dimension or duplicate an incomplete per-user layer in the app.
- **Required reconciliation:** state proxy responsibilities and restrict verified proxy identity to audit attribution; TickDeck authorization remains single-workspace capability/risk policy only.

## Confirmed reconciliations

| Addendum area | Spine location | Verdict |
| --- | --- | --- |
| B/S local + remote, same single-host product | Design Paradigm, AD-1, AD-18 | Preserved; no cross-host commitment |
| One trusted workspace, no account/RBAC/multitenancy | AD-2, AD-6 | Preserved |
| User-configurable data/model endpoints and secrets | AD-9 | Preserved at the UI/Vault level; model schema gap is H-5 |
| Agent approval/state/policy recheck/outbox | AD-4, AD-5, AD-14 | Preserved |
| DataUse propagation and expiry lifecycle | AD-7, AD-11 | Preserved and fail-closed |
| Egress allowlist, budgets, redirect and SSRF/DNS controls | AD-8 | Preserved; approved internal exception is narrower and audited |
| Local/remote protected sessions and loopback distrust | AD-6 | Preserved; proxy identity precision is M-1 |
| SecretRef, separate Vault, platform root key, `LOCKED` | AD-9 | Preserved |
| Default backup excludes secrets; restore revalidates | AD-11 | Preserved |
| SQLite authority + content-addressed artifact store | AD-3, AD-10 | Preserved |
| Crash recovery, leases/fencing, `UNCERTAIN`, no blind retry | AD-4, AD-11 | Preserved |
| Wasmtime Component, no Node/npm/fs/net, watchdog/process-tree reap | AD-12 | Preserved; numerical resource profiles missing in H-6 |
| No public REST/plugin marketplace | AD-2, AD-13 | Preserved |
| No silent weaker sandbox fallback | AD-12 | Preserved |
| Default telemetry disabled | AD-19 | Preserved |

## Gate recommendation

**Do not mark the architecture final until H-1 through H-8 are either incorporated into the spine or explicitly traced to an equally authoritative bound companion.** M-1 should also be corrected because it is a small wording change that prevents a later access-control scope leak. No current finding requires changing the accepted topology, SQLite choice, Wasmtime isolation decision, DataUse/Egress mechanisms, session model, Vault boundary or recovery semantics.
