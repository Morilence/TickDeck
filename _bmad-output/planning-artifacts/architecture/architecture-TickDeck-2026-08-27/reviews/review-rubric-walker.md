# Reviewer Gate — Rubric Walker (Latest Full Re-run)

- Review date: 2026-08-28
- Target: `../ARCHITECTURE-SPINE.md`
- Deterministic lint: **PASS** (`0` findings)
- Verdict: **PASS WITH NON-BLOCKING POLISH**
- Severity: **Critical 0 / High 0 / Medium 2 / Low 1**

## Gate verdict

The latest spine remains safe for handoff. It retains one authority and one mutation path across domain state, operations, artifacts, secrets, policies, external effects, extensions and sandbox execution; it preserves every source Gate and explicit exclusion; and its new `ajv-errors`/S0 clean-import wording does not widen the canonical schema language or create a browser/server validation fork. No new critical or high rubric issue was introduced.

## Good-spine checklist

| Check | Result | Judgment |
| --- | --- | --- |
| Named paradigm | **Pass** | “Hexagonal Modular Monolith + Supervised Execution Plane” remains first and is reflected in both topology and dependency rules. |
| Real divergence points | **Pass** | State, operation identity, market identity, policy, authorization, secrets, artifacts, sandbox, IPC, extension lifecycle, UI authority and release all have one owner/path. |
| Enforceable `Binds` / `Prevents` / `Rule` | **Pass** | All 29 ADs contain the required fields and state testable fail-closed, single-owner or forbidden outcomes. |
| Diagrams and dependency direction | **Pass** | Process and package diagrams agree with server-owned artifacts, Worker-owned execution/Broker responsibilities and Gateway-mediated sidecar egress. |
| Stack pinning | **Pass for mechanics** | Every named package/runtime has an exact version; lint reports zero findings. Current-version reality is separately covered by the technology lens. |
| Capability mapping | **Pass** | All FR/NFR ranges map to implementation areas and governing ADs; canonical capability slices prevent web/server/worker stage drift. |
| Source and stage preservation | **Pass** | PRD/addendum/DESIGN/EXPERIENCE, A/SM/SM-C, OQ blockers, Stop/Narrow actions, UX visibility, exclusions and non-goals remain binding. No target architecture decision opens a later stage. |
| Shared data/owner/mutation | **Pass** | SQLite/domain writes, operation identity, Artifact Service, Secret Broker, recipient approvals, market snapshots and external dispatch authorization each have one canonical authority. |
| Operational/environmental envelope | **Pass** | Five profiles, single-host process topology, resource/termination controls, recovery, health, upgrade and hard-gated packaging selection are covered. |
| Deferred completeness | **Pass** | Every intentionally unresolved load-bearing choice has a revisit gate and cannot weaken an adopted rule. |
| Lean altitude | **Partial, non-blocking** | The platform breadth warrants detail, but 29 ADs, 478 lines and a large cold-start Stack make the invariants slower to scan; see M1. |
| Handoff readiness | **Pass** | Ready for preservation-safe polish, final status and `bmad-spec` adoption. |

## Latest Ajv / clean-import consistency check

| Question | Result | Evidence and judgment |
| --- | --- | --- |
| Does `ajv-errors` expand the transport schema language? | **No** | AD-13 limits contracts to reviewed JSON Schema Draft 7 standard keywords and forbids custom/async/JavaScript-only constructs. AD-15 explicitly says `ajv-errors` is only a resolver runtime dependency and excludes `errorMessage` from the allowed transport keyword set. Plugin presence therefore does not authorize schemas to use its keyword. |
| Can browser and Fastify silently use different validation semantics? | **No** | The versioned `ContractAjvProfile` fixes Ajv version, strictness, coercion/default/removal behavior, format validation, `$data` and async behavior. React Hook Form and Fastify are both required to use that profile and the same format set. |
| Does clean-import substitute for contract behavior evidence? | **No** | S0 first tests importability from an empty lockfile, then separately runs a conformance corpus for coercion, defaults, additional properties, formats, nullable unions, tuples, `$ref`, error normalization, runtime accept/reject, normalized output and inferred types. Import success alone cannot close the contract Gate. |
| Could a resolver dependency failure silently weaken validation? | **No** | `ajv-errors` is pinned in the Stack, and the empty-lockfile clean-import is a prerequisite. Failure prevents starter/contract adoption; there is no permissive fallback or later-stage authorization. |
| Does adding `allErrors: true` conflict with security semantics? | **No** | It changes error collection, not acceptance. Coercion, defaults, unknown-property removal, custom keywords and async validation remain disabled, and stable error normalization is source-owned by the contract layer. |
| Does the revision conflict with the no-runtime-network/no-floating-source rules? | **No** | Dependencies are pinned and bundled. S0 clean install is build/qualification work, while the shipped product still forbids runtime CDN/fonts/registry retrieval and floating `latest` sources. |

## Previously blocking seams remain closed

| Seam | Result | Current evidence |
| --- | --- | --- |
| Local IPC/RPC | **Closed** | AD-27 defines one protocol, owner, handshake, auth, IDs, deadlines, limits, streaming, backpressure, cancellation and recovery semantics. |
| Artifact ownership | **Closed** | AD-10 makes the control plane sole Artifact Service/`artifact-fs` caller and grants only operation/RunContext/policy/quota/fencing-bound capabilities. |
| Extension contracts/topology | **Closed** | Shared contracts are neutral; runtime Broker remains Worker-owned; sidecar egress crosses Gateway. |
| Native packaging/bootstrap | **Closed by hard deferral** | S0 five-profile evidence must select launcher, layout, locking, data root, managed runtime assembly, signing trust and upgrade staging before implementation/release commitment. |
| External-effect TOCTOU | **Closed** | AD-29 authorizes and consumes one current epoch-bound dispatch token at the SQLite linearization point immediately before dial. |
| Duplicate alert business facts | **Closed** | AD-26 canonicalizes trigger identity across live, poll, recovery and manual replay, with database uniqueness and separate delivery attempts. |
| Digest divergence | **Closed** | RFC 8785/raw-byte canonicalization, domain-separated SHA-256 and one text encoding apply across artifacts, contexts, policies, audit, releases and extensions. |

## Critical findings

None.

## High findings

None.

## Medium findings

### M1 — The spine is comprehensive but no longer especially lean

At 29 ADs and 478 lines, source-owned stage, UX, accessibility, notice and governance detail plus a large leaf-dependency Stack makes the durable cross-unit invariants slower to scan. The recent Ajv contract clauses are load-bearing because they prevent frontend/backend schema drift; the remaining weight is mainly duplicated acceptance prose.

**Disposition:** **Polish only.** Preserve every Gate, exclusion, owner, contract profile and behavioral rule. Shorten only source-duplicated prose where a stable section/ID remains enforceable; label cold-start Stack pins as lockfile/Release-Manifest-owned after bootstrap.

### M2 — Broad Binds remain less diagnostic than the Capability Map

AD-3, AD-10 and AD-13 still bind all FRs, and AD-20 binds all FR/NFR. These are genuinely cross-cutting, but the broad labels provide less requirement-audit precision than the Capability Map.

**Disposition:** **Optional autofix.** Mark them as cross-cutting and point to the Capability Map as the diagnostic trace source, or narrow the ranges without changing AD IDs.

## Low finding

### L1 — Single-host availability promise could be explicit

The topology excludes cross-host coordination, but one sentence that local and remote modes share one host/data-root failure domain and v1 makes no HA promise would reduce deployment-document drift.

**Disposition:** **Optional polish; non-blocking.**

## Exit judgment

Rubric Gate passes. The `ajv-errors` and S0 clean-import revision is internally consistent and fail-closed. Apply only preservation-safe polish, rerun lint after edits, then finalize; no architecture or product decision needs to reopen.
