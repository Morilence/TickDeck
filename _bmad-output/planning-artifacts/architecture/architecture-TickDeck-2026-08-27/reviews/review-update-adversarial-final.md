# Reviewer Gate — AD-32 Adversarial Downstream Divergence Final Re-run

- Date: 2026-08-28
- Reviewed artifact: `../ARCHITECTURE-SPINE.md` (current working-tree version)
- Review mode: two independent Story 1.1 / monorepo implementations, each constrained to follow AD-32 literally
- Prior finding source: `review-update-adversarial-divergence.md`
- Deterministic precheck: `lint_spine.py` — PASS (`0` findings)
- Verdict: **PASS**
- Findings: High `0`, Medium `0`, Low `0`

## Executive verdict

Two independently authored Story 1.1 implementations can still differ in non-normative implementation style, but the current spine forces them to converge on every load-bearing choice tested by this gate: workspace membership and dispatch, quality-config ownership, TypeScript/ESLint profiles, typed dependency-edge projections, lifecycle-build policy, generated-output manifests, lint-staged behavior, Rust toolchain and checks, CI contexts, branch-rule evidence, and stage authorization.

The four findings from the prior final review are closed. No new contradiction was found, and AD-32 does not weaken AD-1 through AD-31.

## Adversarial construction

### Unit A — policy-generated skeleton

Unit A treats the AD-32 tables as source data and generates the root configuration, package projections, fixtures, and validation inputs from them. It uses the prescribed recursive pnpm dispatch and derives the expected blocked lifecycle-build set from the resolved lockfile packages plus the reviewed policy.

### Unit B — independently hand-authored skeleton

Unit B authors each package and root configuration independently, then runs the mandatory workspace, dependency, generated-output, Rust, lint-staged, and CI-policy checks. It does not reuse Unit A's generators or intermediate files.

### Convergence result

Both units are forced to produce the same externally relevant result:

1. The same exact sixteen direct pnpm workspace members exist, with no nested or unexpected members.
2. `tools/quality` remains root-owned infrastructure without a `package.json` and therefore is not a workspace package.
3. Every TypeScript source-bearing member resolves to one exhaustive TS/ESLint profile and the same module, ambient-type, emit, and lint boundaries.
4. Every initial package dependency belongs to exactly one typed edge class and receives the prescribed package-manifest and fixture projection; generated-export consumer metadata does not create a second package edge.
5. The resolved lifecycle-build blocked set equals the reviewed `allowBuilds: false` set after normalization; neither an empty set nor an undocumented extra/missing package can pass.
6. Generated paths, ownership, committed-status rules, and manifest bytes are identical.
7. Root scripts, leaf scripts, filter selectors, lint-staged commands, Rust checks, CI contexts, and branch-rule evidence are identical at their normative interfaces.
8. Scaffolding all sixteen members at S0-V does not register or authorize S1–S5 capabilities.

## Prior H/M finding closure

### H1 — lifecycle-build policy could accept divergent blocked sets: CLOSED

AD-32 now specifies a reviewed decision for every resolved lifecycle-script package and requires `tools/quality/dependency-build-check.mjs` to derive the expected blocked set from the lockfile and reviewed policy. It normalizes `pnpm ignored-builds` output and performs exact set equality against reviewed `allowBuilds: false` packages. Missing decisions, placeholders, missing blocked packages, and unreviewed extras all fail. The text explicitly rejects the prior assumption that the empty set is the only valid state.

Unit A and Unit B therefore cannot select different lifecycle-build results while remaining compliant. A policy change is an architecture change and cannot be hidden in package-manager state.

### H2 — dependency classes lacked a unique initial graph/projection: CLOSED

AD-32 now defines four exhaustive edge classes and their package projections:

- Runtime edges are exactly the Structural Seed solid pnpm arrows plus `packages/testkit` to `packages/core`, `packages/contracts`, and `packages/policies`; production imports/declarations/bundles must match `dependencies`.
- Type-only edges have no additional initial edge; a future type-only edge must use `import type`, avoid runtime emit/bundle linkage, and still use `dependencies` when its declarations expose the target.
- Build/codegen edges are only the fixed official-connector to testkit demo-fixture edge and component compiler to WIT input. The pnpm generator edge uses `devDependencies` without production runtime import; the non-pnpm WIT input is the stated exception. The generated manifest must still record input, consumer/export, and command.
- `apps/web`, `apps/server`, and `apps/worker` consume generated exports from `packages/contracts`, but this does not create a build/codegen package edge: each package relation is solely the Structural Seed `runtime` edge in `dependencies`, while consumer identity remains enforceable manifest metadata.
- Test/dev edges are limited to the named server, worker, adapter, and compiler packages using testkit only from test/config/fixture surfaces; they use `devDependencies`, while Web, neutral packages, and production source are forbidden consumers.

The class-aware checks must derive fixtures from this policy and prove manifest placement plus forbidden emitted, bundled, declaration, production-import, and testkit-leakage cases. The Structural Seed uses solid pnpm arrows only for runtime edges and labels dotted arrows as build or lifecycle relations, so its semantics agree with the table rather than creating a second graph.

### M1 — Story 1.1 workspace coverage was not exact: CLOSED

AD-32 names all sixteen direct members required at Story 1.1 / S0-V:

1. `apps/web`
2. `apps/desktop`
3. `apps/server`
4. `apps/worker`
5. `packages/contracts`
6. `packages/core`
7. `packages/policies`
8. `packages/storage-sqlite`
9. `packages/artifact-fs`
10. `packages/connectors-core`
11. `packages/connectors-official`
12. `packages/models`
13. `packages/notifications`
14. `packages/agent-mastra`
15. `packages/testkit`
16. `tools/component-compiler`

`workspace-check` must prove exact membership, reject nested/unexpected workspaces, verify profile/tsconfig ownership, and verify the required S0-V leaf scripts. Consequently, both units must scaffold the same surface, while the explicit rule that source/build presence does not register capability preserves the later stage gates.

### M2 — `tools/quality` could become an accidental workspace package: CLOSED

AD-32 explicitly defines `tools/quality` as root-owned, non-workspace infrastructure with no `package.json`, using the `node-config-only` profile. The exact-membership check also requires it to be absent from the workspace member set. Its scripts can be called by root commands without becoming another recursive pnpm leaf.

## Regression sweep of earlier closure areas

### TypeScript and ESLint profiles

The profile table exhaustively maps Web, Node runtime, neutral shared packages, root/config-only files, and test overlays. It fixes ESM/module resolution, target, library, ambient types, JSX, emit, and ESLint environment per surface. Browser packages cannot inherit Node globals, neutral packages cannot inherit browser or Node ambient types, and test globals enter only through the overlay.

### Scripts, dispatch, and coverage

The root scripts and exact recursive filters are normative. All sixteen members have explicit S0-V leaf-script expectations, and validation rejects missing, duplicate, nested, or unexpected workspace packages. Root-only quality scripts are outside recursive workspace selection.

### lint-staged normalization and filename-free Rust

Candidate paths are normalized from absolute input to repository-relative POSIX paths before canonical ignore checks and non-overlapping file-class routing. The Rust match uses a filename-free function command for `cargo fmt --all --check`, so lint-staged cannot append incompatible filenames.

### Generated outputs

The owner, source, output path, committed-status rule, and manifest bytes are normative. Story 1.1 uses the exact empty registry where no outputs exist. Rust/WIT build products remain under `OUT_DIR`/`target` and do not become committed generated sources.

### Dependency fixtures

Fixtures are derived from the normative typed-edge policy and test both allowed projections and forbidden runtime, bundle, declaration, production-source, or testkit-leakage cases. A compliant unit cannot substitute a looser hand-maintained example graph.

### Generated-contract edge classification

The contracts consumers are no longer double-classified. `apps/web → packages/contracts`, `apps/server → packages/contracts`, and `apps/worker → packages/contracts` each appear once as Structural Seed `runtime` edges and therefore use `dependencies`. Generated manifests separately bind those workspaces as consumers of the generated exports, together with input, export, command, outputs, owner, and artifact digest. `generated-check.mjs` enforces those manifest facts and exact regenerated paths/bytes without inventing a second dependency class or moving the runtime dependency into `devDependencies`.

### Rust and CI

The Rust toolchain and components are pinned, formatting/lint commands and manifest flags are fixed, and CI records the installed versions. The mandatory lint, format-check, typecheck, build, and test flows run under the declared install/build-script policy. Branch protection must require the exact four named quality contexts, with provider API/CLI evidence archived; a green workflow alone is not accepted as proof of enforcement.

## Structural Seed consistency and new-contradiction attack

No new contradiction was found.

- Every solid pnpm edge in the Structural Seed is accounted for by the runtime-edge definition, including testkit's three runtime dependencies.
- The official connector to testkit and component compiler to WIT arrows are explicitly build/codegen relations, not production-import permission.
- Desktop to product supervisor is a release-lifecycle relation, not a pnpm runtime edge.
- Generated-contract consumers are recorded as manifest metadata without reclassifying their already-authorized contracts runtime dependencies as build/codegen edges.
- The tree places `tools/quality` under the root tooling surface and omits a package manifest, matching its non-workspace ownership.
- Exact Story 1.1 membership does not imply capability registration: AD-2 remains the sole registry authority, and AD-32 expressly denies S1–S5 authorization.

Two attempted divergent implementations therefore fail mechanically: one cannot omit a listed package or add a quality workspace, and the other cannot relabel a build/test dependency as runtime or change the lifecycle blocked set without failing the prescribed checks.

## AD-1 through AD-31 non-regression

AD-32 remains an implementation and verification projection of the existing architecture. It does not change product scope, trust boundaries, authority ownership, data contracts, adapter purity, generated-code ownership, lifecycle behavior, or stage meaning. In particular:

- all capability registration still flows through AD-2;
- adapter and runtime boundaries remain those of the earlier decisions;
- generated-code rules strengthen enforcement without transferring source ownership;
- S0-V scaffolding and quality gates do not satisfy AD-20, SM-00, OQ-06, release authorization, or any S1–S5 gate.

## Final recommendation

**PASS — no corrective architecture edit is required for this reviewer lens.**

This verdict establishes that the current architecture text converges independent implementations at the source-contract level. The future Story 1.1 build must still provide the prescribed executable fixtures, CI output, and branch-rule evidence; this review is not implementation or deployment evidence.
