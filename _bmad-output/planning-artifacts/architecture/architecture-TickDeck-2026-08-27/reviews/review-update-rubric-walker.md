> [!WARNING]
> **SUPERSEDED（2026-08-28）。** 本文件是首轮 Reviewer Gate，保留其 findings 作为修订历史；当前 verdict 以 `review-update-rubric-final.md` 为准。

# Reviewer Gate — Good-Spine Rubric Walker (TypeScript 6.0.3 / AD-32 Update)

- Target: `../ARCHITECTURE-SPINE.md`
- Review date: 2026-08-28 (Asia/Shanghai)
- Deterministic lint: **PASS** (`0` findings)
- Verdict: **NEEDS FIX — 0 Critical, 2 High, 2 Medium, 2 Low**
- Method: complete-spine walk against `bmad-architecture/references/reviewer-gate.md`; focused conflict check for AD-32 against AD-15, AD-20, the Stack, Structural Seed, source reconciliations and the current review-evidence set

## Gate verdict

The spine still covers the product, data, authorization, process, sandbox, UX, release and operational divergence points comprehensively, and the TypeScript 6.0.3 choice itself is current, compatible and correctly fail-closed. Handoff should pause for two small but load-bearing AD-32 corrections: its current leaf-script wording can exclude the test orchestration required by AD-20 and Story 1.1, and Rust 1.98.0 is not repository-pinned even though rustfmt/Clippy/build results are declared part of one reproducible cross-language quality contract. These are clear architecture autofixes; they do not require a new product decision.

## Good-spine checklist

| Check | Result | Judgment |
| --- | --- | --- |
| Named paradigm | **Pass** | `Hexagonal Modular Monolith + Supervised Execution Plane` leads the document and is reflected in process and package dependency rules. |
| Real divergence points | **Pass with H-01/H-02** | Product-state, data, policy, secrets, side effects, extension, sandbox, UX and release divergence points are fixed. The new engineering-quality dimension still leaves test orchestration and the Rust toolchain able to diverge. |
| Every Rule enforceable and Prevents achieved | **Partial** | AD-1–AD-31 remain enforceable. AD-32 is detailed, but its `only` leaf-script list conflicts with tests and its Rust commands do not bind the compiler/components that execute them. |
| Deferred/open decisions safe | **Pass** | Each unresolved item has a stage/release revisit condition and fails closed; no open item weakens an adopted authority or Gate. Neither H-01 nor H-02 belongs in Deferred because both concern the first skeleton. |
| Named technology current | **Pass with evidence hygiene M-02** | The new npm/TypeScript evidence verifies TypeScript 6.0.3 and all AD-32 packages against official registry metadata and exact probes. Historical TypeScript 7 review files remain ambiguously labelled. |
| Brownfield ratification | **Pass** | The repository still has no application `package.json`, lockfile or Cargo workspace to contradict; this is a pre-first-build greenfield amendment, not migration policy. |
| Source/capability coverage | **Pass** | Focused PRD, addendum, DESIGN and EXPERIENCE update reconciliations all pass; S0-V, Story 1.1, UX acceptance and later Gates remain intact. |
| Parent-spine inheritance | **Not applicable** | This is the feature-level root spine, not an epic spine overriding a parent. |
| State/data/API boundaries | **Pass** | One command/write owner, HTTP snapshot authority, generated contracts, Local RPC, Artifact Service, Secret Broker and market/decimal identities remain coherent. |
| Security/authorization | **Pass** | Session, DataUse/Egress, current dispatch authorization, R1/R2, sandbox and extension boundaries remain fail-closed. |
| Deployment/environment/operations | **Pass with H-02** | Single-host topology, five Release Profiles, packaging, backup/recovery, health, update/rollback and support gates are covered. Rust build-tool reproducibility is the remaining environment seam. |
| Quality/verification | **Partial** | Static engineering gates are detailed and current, but their root/leaf orchestration must explicitly coexist with AD-20's test evidence. |
| Lean altitude | **Partial, non-blocking** | At 32 ADs and 634 lines the spine is dense, although the platform breadth and security stakes justify most detail; see L-02. |

## Critical findings

None.

## High findings

### H-01 — AD-32's leaf-script rule can exclude the tests that AD-20 and Story 1.1 require

**Evidence.** AD-20 requires Vitest/Testing Library, Storybook/axe, Playwright, fault-injection E2E and release matrices (`ARCHITECTURE-SPINE.md:292-296`). AD-15 separately requires keyboard/a11y regression and browser/server validation conformance before starter adoption (`:254-256`). Story 1.1 AC 7 requires component tests and a real-browser smoke test (`epics.md:533-540`). But AD-32 says workspaces **only** implement root-dispatched `typecheck`, `build` and `codegen:check` leaf scripts (`ARCHITECTURE-SPINE.md:422`), and its root/CI list contains no test orchestration (`:424-444`).

**Divergence.** One builder can read `only` literally and omit workspace `test` scripts/workflows; another can add private test commands outside the root quality contract. Both choices conflict with AD-32's stated single-owner purpose, and the former can make all four named checks green without running the UX, browser, security or recovery evidence that the existing spine requires.

**Disposition: AUTOFIX BEFORE HANDOFF.** Keep the four user-requested engineering checks as independent baseline required checks, but state explicitly that they are not exhaustive of AD-20/stage/release tests. Permit only root-dispatched test leaf scripts and fix root-owned names/owners for at least unit/component/E2E (or one root `test` family with stage/profile selection). Story 1.1 must have a required component + real-browser smoke check; later full matrices remain stage/release checks rather than being forced into every pre-commit hook.

### H-02 — Rust 1.98.0 is declared but not pinned by the project skeleton

**Evidence.** The Stack declares Rust 1.98.0 (`ARCHITECTURE-SPINE.md:466-506`), and AD-32 makes rustfmt, Clippy, `cargo check` and `cargo build` part of the cross-language gate (`:415`, `:418`, `:428-438`). Yet the Structural Seed lists `Cargo.toml` and `Cargo.lock` but no `rust-toolchain.toml` or equivalent (`:571-589`). `Cargo.lock` pins crates, not `rustc`, Cargo, rustfmt or Clippy.

**Divergence.** Developers and CI can execute the exact same AD-32 commands with different Rust compiler/rustfmt/Clippy versions and obtain different formatting, warnings or builds while each claims conformance to the Stack. This directly violates AD-32's stated prevention of Rust taking a different CI path.

**Disposition: AUTOFIX BEFORE HANDOFF.** Add a root `rust-toolchain.toml` to the required skeleton, pin `channel = "1.98.0"`, include `rustfmt` and `clippy` components, and make CI assert the selected toolchain before the Rust gates. Keep target installation/profile details tied to the existing five-platform release workflows; no product scope change is needed.

## Medium findings

### M-01 — The CI check name does not explicitly map to the root format script

AD-32 defines root script `format:check`, then names the required CI check `format-check` (`ARCHITECTURE-SPINE.md:431`, `:444`; Structural Seed `:588-589`). A GitHub Actions job may legitimately be named `format-check`, but the Rule never states that it executes `pnpm format:check`; an implementer can instead try the nonexistent `pnpm format-check` or create a second alias.

**Disposition: AUTOFIX.** Bind each required check to one command, especially `format-check → pnpm format:check`; likewise make the pnpm recursive commands syntactically complete (`pnpm --recursive --if-present run <script>` plus the intended workspace filters) so the table is directly executable rather than partly prose.

### M-02 — Superseded TypeScript 7 reviews remain labelled as current/pass evidence

The operative spine and companions correctly use TypeScript 6.0.3, and `review-update-typescript-6.0.3-final.md` explicitly supersedes the old probes. However, the same `reviews/` directory still contains `review-reality-currentness.md` with “complete re-run,” `PASS`, and TypeScript 7.0.2 currentness claims, plus decimal review files whose compile evidence is TypeScript 7.0.2. A consumer searching evidence rather than frontmatter companions can still select the contradictory files.

**Disposition: EVIDENCE HYGIENE BEFORE HANDOFF.** Preserve history, but prepend a clear `SUPERSEDED` banner or move/list those files under an explicitly historical index that points to `review-update-typescript-6.0.3-final.md`. Do not reuse their TypeScript conclusions for Story 1.1 or any Gate. This does not require editing the spine's decisions.

## Low findings

### L-01 — AD-32 is missing from the navigation index and capability trace tail

The navigation sentence ends at AD-31 (`ARCHITECTURE-SPINE.md:86`), and all Capability Map governance ranges end at AD-31 (`:620-634`). AD-32 is cross-cutting rather than a product capability, so the map is not semantically wrong, but the update is less discoverable than every earlier AD.

**Disposition: OPTIONAL POLISH.** Add AD-32 to the navigation index and either add one “Project skeleton / engineering quality” trace row or state that the Capability Map intentionally maps product capabilities while AD-32 applies repository-wide.

### L-02 — The spine is no longer lean, though the detail is mostly load-bearing

The document is 634 lines and AD-31 alone contains implementation-level numeric detail. This slows cold-start use, but current detail closes demonstrated data-integrity, security and cross-platform divergence rather than acting as generic tutorial prose.

**Disposition: IGNORE FOR THIS UPDATE / FUTURE POLISH ONLY.** Do not compress while resolving AD-32. A later preservation-safe distillation may move proof rationale and probe detail into companions, but must keep every owner, fail-closed rule, Gate and stable AD ID.

## Confirmed non-findings for the current update

- TypeScript 6.0.3 is the latest stable 6.x release under the user's chosen major line; Web, Node, shared neutral packages, numeric ingress and typed ESLint have exact compatibility probes.
- The normal CI correctly rejects TypeScript's migration-only `stableTypeOrdering`; no operative TypeScript 7 compiler assumption remains in the spine.
- AD-32's browser/Node/shared ambient-type split reinforces AD-1/AD-3/AD-15 rather than weakening them.
- Web-only Stylelint, generated-output `codegen:check`, authored shadcn source linting, Husky and lint-staged scopes do not change product stages or UX acceptance.
- Root quality configuration remains an S0-V skeleton concern and does not register sandbox, Monaco, notifications, portfolio or any S1–S5 capability.
- Open platform, connector, Vault and sandbox-combination evidence remains fail-closed behind explicit S0/S1/release gates; no Deferred item lets two units silently choose incompatible authority.

## Exit condition

Resolve H-01 and H-02, apply the direct M-01 mapping fix, and mark the contradictory TypeScript 7 evidence as superseded. Then rerun deterministic lint and the update consistency/currentness lenses. No PRD, UX, stage or product decision needs to reopen.
