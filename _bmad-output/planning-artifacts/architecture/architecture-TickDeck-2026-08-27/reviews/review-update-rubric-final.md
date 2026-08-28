# Reviewer Gate — Good-Spine Rubric Final Rerun

- Review date: 2026-08-28
- Target: `../ARCHITECTURE-SPINE.md`
- Intent: final bounded rerun after closing the contracts consumer/runtime-edge conflict
- Method: deterministic spine lint; complete Good-Spine rubric walk; closure audit of all earlier rubric findings; focused mirror attack on AD-32; AD-1–AD-31 and S0-V–S5 non-regression check
- Mutation boundary: this report only; the spine and every upstream/downstream artifact remained read-only

## Verdict

**PASS — handoff-safe architecture substrate.**

Severity: **Critical 0 / High 0 / Medium 0 / Low 0**.

The final contracts-edge correction is unambiguous: `apps/web`, `apps/server` and `apps/worker` consume `packages/contracts` through their existing Structural Seed `runtime` edges and `dependencies`; generated-manifest consumer/export fields record generation provenance only and do not create a second `build/codegen` package edge. The last semantic blocker is closed, all previous AD-32 findings remain closed, and no new Good-Spine defect or AD-1–AD-31/stage regression was found.

## Deterministic gate

Command:

```text
uv run .agents/skills/bmad-architecture/scripts/lint_spine.py \
  --workspace _bmad-output/planning-artifacts/architecture/architecture-TickDeck-2026-08-27
```

Result: `ok: true`, `total_findings: 0`. The spine has 32 unique AD IDs, complete `Binds`/`Prevents`/`Rule` fields, no template residue or placeholders, and pinned Stack versions.

## Final H-01 closure

The prior rubric found that the app→contracts relation could be read simultaneously as a runtime edge in `dependencies` and a build/codegen edge restricted to `devDependencies` and non-production surfaces.

That conflict is now **CLOSED**:

- the `runtime` class continues to own every solid pnpm-package arrow, including `apps/web|server|worker → packages/contracts`; it permits production source/declaration/bundle use and requires `dependencies` (`ARCHITECTURE-SPINE.md:418`, `:576`, `:579`, `:584`);
- the `build/codegen` class is limited to `packages/connectors-official → packages/testkit` for demo-fixture construction and `tools/component-compiler → wit/tickdeck-sandbox` for compiler/WIT build input (`:420`, `:601`, `:603`); and
- the three apps are explicitly only consumer/export metadata in the generated manifest; their package relation remains the existing runtime edge and cannot be reclassified as build/codegen (`:420`).

Two independent builders can no longer choose incompatible manifest placements or production-import rules for `packages/contracts`. The policy, package manifests, ESLint restrictions and production declaration/bundle checks now have one projection.

## Complete prior-finding closure matrix

| Finding or seam | Final status | Current closure evidence |
| --- | --- | --- |
| Tests could be omitted from the root quality contract | **CLOSED** | Stage-required `test:*` leaves are policy checked; root unit/component/E2E/test orchestration and Story 1.1 real-browser requirement are explicit (`:423`, `:469-472`, `:478`). Static checks cannot replace AD-20, SM-00, OQ-06 or release evidence (`:480`). |
| Rust compiler/rustfmt/Clippy were not repository-pinned | **CLOSED** | `rust-toolchain.toml` fixes Rust 1.98.0 minimal with rustfmt and Clippy, `rustfmt.toml` fixes formatting, and CI asserts the selected tools before locked Cargo commands (`:448`, `:478`, `:616-617`). |
| Recursive commands / CI context mapping were ambiguous | **CLOSED** | Root commands contain exact direct-directory filters, leaf command names and preflight validation; `lint`, `format-check`, `typecheck`, `build` map one-to-one to root commands (`:450-472`, `:478`). |
| Historical TypeScript 7 evidence could be mistaken for current evidence | **CLOSED** | Historical TS7-based reviews carry `SUPERSEDED` banners; the operative spine and current compatibility evidence use TypeScript 6.0.3. No `7.0.2` or `TS7` baseline remains in the spine. |
| AD-32 lacked navigation/capability trace | **CLOSED** | Navigation names AD-32, and the Capability Map traces engineering quality to AD-20/AD-32 while expressly labelling it non-product (`:86`, `:684`). |
| Reviewed `allowBuilds: false` contradicted an empty ignored-builds check | **CLOSED** | `dependency-build-check.mjs` derives the reviewed false set, normalizes `pnpm ignored-builds` and requires exact set equality; missing decisions, placeholders and extra blocks fail (`:410`, `:455`, `:478`). Empty is no longer falsely required. |
| Workspace introduction stage and membership were inferable | **CLOSED** | Story 1.1/S0-V requires exactly 16 named direct members, each with `package.json`; the validator requires exact equality (`:412-423`). Presence is explicitly not capability registration. |
| `tools/quality` could become an accidental workspace | **CLOSED** | It is root-owned, non-workspace, has no `package.json`, uses `node-config-only`, and is invoked only by root scripts; the validator enforces that form (`:412`, `:423`, `:432`). |
| Dependency edges were untyped | **CLOSED** | Runtime, type-only, build/codegen and test/dev classes have exact initial edges, manifest placement, source/bundle/declaration rules and class-aware fixtures (`:414-423`); solid and dashed Structural Seed arrows now have explicit meanings (`:574-606`). |
| POSIX-only filter quoting / CI environment assignment | **CLOSED** | Recursive filters are double quoted for POSIX/Windows, and CI uses workflow/job `env: { HUSKY: "0" }` rather than an inline POSIX assignment (`:462`, `:465-469`, `:478`). |
| Overall spine density | **ACCEPTED, NON-BLOCKING** | This was a future-polish observation, not a correctness finding. The AD-32 detail is retained because it fixes real first-build divergence and is machine-projectable. |

## Complete Good-Spine rubric

| Rubric dimension | Result | Evidence and judgment |
| --- | --- | --- |
| Real divergence points fixed for the level below | **PASS** | AD-1–AD-31 fix product/data/process/security/UX/release divergence. AD-32 now fixes exact workspace inventory, lifecycle approvals, typed dependency edges, language profiles, generated roots, root configuration, hooks, scripts, tests and CI without an overlapping edge interpretation (`:406-480`). |
| Every Rule is enforceable and prevents its stated divergence | **PASS** | AD-32 assigns each rule to concrete root files and machine checks. Exact-set comparisons, exact member inventory, class-specific manifest/source fixtures, generated path+byte checks, pinned tools and exact CI commands make the contract executable. Existing AD Rules remain fail closed. |
| Deferred/open items do not permit incompatible implementation | **PASS** | Remaining OQ/platform/vault/provider items have explicit revisit Gates and cannot register capability before evidence (`:67-82`). Implementation execution remains pending, but no pending item can silently redefine the skeleton or close AD-20/SM-00/OQ-06/release Gates (`:478-480`). |
| Named technology is current | **PASS** | TypeScript 6.0.3 and every engineering tool are exact-pinned in Stack and supported by current official metadata/peer evidence in `review-update-tool-versions-final.md` and strict compatibility probes in `review-update-typescript-6.0.3-final.md`. |
| Brownfield conventions are ratified rather than contradicted | **PASS / N/A for application code** | This update precedes the first `bmad-build`; no application implementation or migration surface exists. The rules prescribe the initial skeleton and make no legacy-compatibility claim. |
| Source/spec capability coverage | **PASS** | Focused PRD, addendum, DESIGN and EXPERIENCE reconciliations pass. The Capability Map still covers FR-001–FR-100 and NFR-001–NFR-040, plus an explicit cross-cutting engineering row (`:665-684`). |
| Inherited parent invariants are preserved | **PASS / no separate parent spine** | There is no inherited parent spine. Within this artifact AD-32 explicitly binds AD-1, AD-3, AD-15 and AD-20 and enforces, rather than overrides, their authority and acceptance boundaries (`:408`). |
| Every owned structural and operational dimension is decided/deferred/open | **PASS** | Topology, dependency direction, state/data ownership, transactions/recovery, authorization/session/secrets/egress, persistence, sandbox, UX, extensions/RPC, release/operations, tests, toolchains, workspace inventory, generated sources and CI are all decided or explicitly gated. |

## Focused mirror result

Two independent Story 1.1 builders must now converge on all load-bearing AD-32 outputs:

1. the same exact 16 direct pnpm members and non-workspace `tools/quality` form;
2. the same Web, Node-runtime, neutral, config-only and test-overlay profiles;
3. the same typed runtime/type-only/build/test edges and package/source/declaration/bundle projections;
4. the same reviewed allowed/blocked lifecycle-build decision set;
5. the same root quality owners, canonical ignores, hooks and lint-staged match behavior;
6. the same generated-root registry, path+byte comparison and Rust/WIT output boundary;
7. the same cross-shell root commands, pinned Rust gates and stable CI contexts; and
8. the same rule that skeleton/build presence cannot register a product capability.

Remaining differences in internal implementation style are non-normative and cannot change those interfaces or Gate outcomes.

## AD-1–AD-31 and stage non-regression

- **Authority/state/process (AD-1–AD-4, AD-27):** exact workspace and edge policies enforce the existing control-plane, core/contracts and IPC directions; no second owner, write path or protocol was added.
- **Authorization/security/external effects (AD-5–AD-12, AD-25–AD-29):** dependency approvals, hooks and CI create no runtime authorization or egress path. R1/R2, secrets, policy and fresh single-use `ExecutionAuthorization` remain unchanged.
- **Client/UX/testing/delivery (AD-13–AD-22, AD-30):** TypeScript profiles preserve one React SPA and browser/Node/desktop boundaries. Component/a11y/browser tests add evidence without replacing UX acceptance; Rust/generated controls support reproducible release inputs without claiming release proof.
- **Domain semantics (AD-23–AD-24, AD-31):** no execution-assumption, demo qualification, finance-decimal, numeric-ingress, WIT or sandbox Gate semantics changed.
- **Stages:** all 16 skeleton packages exist at S0-V, but AD-2 remains the only capability-registration authority and AD-32 expressly forbids early S1–S5 authorization (`:412`, `:480`).

No AD-1–AD-31 ID was renumbered, retired or relaxed; no product scope, UX state, quiet requirement or Gate criterion changed.

## Final disposition

**PASS.** There is no remaining Critical, High, Medium or Low correction for the Good-Spine rubric. The current spine is safe for final architecture-consistency aggregation and the requested downstream re-derivation sequence. This verdict does not claim that Story 1.1, CI/repository rules, product Gates or OQ-06 evidence have already been implemented or passed.
