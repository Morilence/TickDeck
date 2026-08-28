# Reviewer Gate Rerun — AD-31 Final Rubric

- **Target:** `../ARCHITECTURE-SPINE.md`
- **Date:** 2026-08-28
- **Scope:** AD-31 and closure of every prior Critical/High/Medium finding
- **Architecture lint:** **PASS — 0 findings**
- **Verdict:** **PASS — 0 Critical, 0 High, 0 Medium.**

## Prior finding closure

| Prior finding | Verdict | Current evidence |
| --- | --- | --- |
| Context rounding vs business quantization | **CLOSED** | `ContextRounding` is mandatory after every primitive and is distinct from `DomainQuantization`; operation DAG, quantize nodes, deterministic ordering and left-fold semantics are frozen. |
| Lossless external numeric ingress | **CLOSED** | `LosslessNumericIngress v1` pins `lossless-json` 4.3.1 with integrity, preserves source-text numeric tokens, rejects binary-float SDK fields and `number → String`, and subjects model/data prices and monetary budgets to AD-31. |
| Opaque sandbox enforcement | **CLOSED** | WIT `financial-value` is a host-issued opaque resource with no guest render, runtime parse, number coercion or arbitrary constructor; only compiler-verified literals can become handles, while OQ-06/S3 still blocks registration until evidence passes. |
| CAP-8/model costs | **CLOSED** | AD-31 binds model/data service prices, estimates and monetary budgets; the Architecture Capability Map includes AD-31 for FR-065–FR-069, while non-monetary counts remain bounded integers. |
| Value envelope and semantic bounds | **CLOSED** | `FinancialValueEnvelope v1`, canonical lexical rules, context/quantization/provenance identity, 34-digit value limits, exponent limits, canonical length ceiling, stable errors, persistence/sort/display/projection contracts and a shared conformance manifest are frozen. |
| Pre-allocation/pre-computation resource bounds | **CLOSED** | Every wrapper now preflights without allocating a large coefficient: raw/canonical lexemes are capped at 6212 ASCII bytes; exponent segments at five digits; adjusted exponent is checked with bounded integers before expansion; `integerPower` is capped at `[-10000,10000]` with result-exponent pre-estimation; `quantizeScale` is capped at `[0,6176]`; scratch coefficients are capped at 12355 digits. Violations return `RESOURCE_LIMIT` before constructor, `toFixed()`, `BigInt`, `pow` or quantize execution. Field schema, run fuel and heap may only tighten these limits. |

## Focused adversarial result

The former Medium finding is closed. Short hostile exponent tokens cannot trigger unbounded lexical expansion, and huge power/scale/coefficient requests cannot reach amplifying library operations before deterministic rejection. The new `RESOURCE_LIMIT` error and required exponent/value/resource-bound conformance vectors make the behavior testable across API, server, Worker, SQLite, sandbox and Web execution surfaces.

The apparent wording that a normalizer may lexically expand a provider exponent is governed by the earlier universal wrapper preflight: expansion is permitted only after raw length, exponent-digit and adjusted-exponent checks succeed. It therefore does not reopen the former gap.

## Good-spine rubric disposition

- **Decision coverage and enforceability:** PASS. Runtime owners, versioned manifests, hard preconditions, stable failures and shared vectors are explicit.
- **Boundary and invariants:** PASS. Authoritative finance values cannot cross execution, persistence, sandbox or display boundaries as binary float or JSON number.
- **Determinism and failure semantics:** PASS. Rounding moments, reduction order, quantization, resource rejection and retry/persistence consequences are frozen or delegated to named versioned contracts.
- **Capability and stage gates:** PASS. AD-31 selects numerical implementation semantics only; S1–S4 gates and OQ-03/OQ-06 remain intact, with no capability registration authorized early.
- **PRD/addendum/DESIGN/EXPERIENCE/SPEC preservation:** PASS. Required assets, fees/tax/FX/corporate actions, deterministic calculations, model-cost disclosure, facts/calculation/model/unknown separation, accessibility and UX display distinctions are preserved. No new asset, trading, provider or product capability is introduced.

## Gate disposition

**PASS.** No Critical, High or Medium finding remains. AD-31 is sufficiently bounded and enforceable to remain in the adopted architecture spine without authorizing any downstream capability ahead of its existing gate.
