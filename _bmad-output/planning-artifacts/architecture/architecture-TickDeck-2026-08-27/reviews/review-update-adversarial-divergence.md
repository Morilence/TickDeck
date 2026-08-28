> [!WARNING]
> **SUPERSEDED（2026-08-28）。** 本文件是首轮 adversarial divergence Gate，保留其 findings 作为修订历史；当前 verdict 以 `review-update-adversarial-final.md` 为准。

# Reviewer Gate — Adversarial Downstream Divergence for the AD-32 Update

- Review date: 2026-08-28
- Artifact: `../ARCHITECTURE-SPINE.md`
- Lens: construct two independent Story 1.1 / monorepo skeletons that each plausibly obey AD-32 word for word, then look for incompatible choices in scripts, configuration ownership, scope/ignore behavior, lint-staged, TypeScript module and ambient types, generated code, Rust/CI, and stage Gates
- Deterministic pre-check: `lint_spine.py` passed with 0 findings
- Verdict: **FAIL — divergence remains before the first `bmad-build`**
- Severity count: **Critical 0 / High 3 / Medium 4 / Low 0**

## Gate verdict

AD-32 is materially stronger than the former baseline, but it does not yet converge two independent Story 1.1 implementations. Both mirror implementations below can plausibly claim literal compliance while selecting different workspace members, task traversal, TypeScript environment profiles, generated-output ownership, lint-staged execution, Rust toolchain realization, and CI-enforcement evidence.

No direct semantic weakening of AD-1–AD-31 was found. The new engineering contract repeatedly defers authority to the earlier ADs, and its final sentence correctly prevents a green skeleton from becoming product-stage evidence. The failure is narrower: AD-32 does not always make its stated quality guarantees mechanically unique or executable, so one implementation can fail to enforce an earlier boundary that the other enforces.

## Adversarial mirror implementations

| Surface | Mirror A — explicit profiles and manifests | Mirror B — convention-driven recursive workspace |
| --- | --- | --- |
| pnpm workspace | `packages: ['apps/*', 'packages/*', 'tools/*']`; `includeWorkspaceRoot: false`; root scripts use explicit filters | `packages: ['apps/**', 'packages/**', 'tools/**']`; relies on bare `pnpm -r --if-present`; root inclusion and nested fixture membership follow pnpm settings/defaults |
| TypeScript | Four named bases: Web, neutral shared, Node runtime, tests; every Structural Seed directory is assigned once | Only the three profiles named literally by AD-32 are created: Web, `server/worker/tools`, and `core/contracts/policies`; the remaining adapter packages select their own NodeNext/Bundler/types policy |
| ESLint | Restricted-import rules are generated from the Structural Seed dependency graph | One flat config owns all rules, but each directory block chooses a hand-written subset of restricted imports |
| generated output | Every ignored generated root has one owner, an input/tool digest, an exact output manifest, and a clean-tree compare | Each leaf `codegen:check` validates the files its generator knows; extra files and Rust/WIT generated bindings are left to build/typecheck |
| lint-staged | Normalizes absolute staged paths to repository-relative POSIX paths; function tasks prevent filename appending for `cargo fmt --all` | Object glob tasks repeat the canonical patterns; string task `cargo fmt --all` relies on lint-staged defaults |
| Rust | checked-in `rust-toolchain.toml` pins `1.98.0`, `rustfmt`, and `clippy`; CI and local hooks consume it | CI installs Rust 1.98.0 explicitly; developers use their active rustup toolchain; no repository toolchain/component declaration |
| CI | four stable job/check names plus repository-ruleset evidence make them required | `quality.yml` defines four jobs, but required-check status is configured out of band and no checked evidence binds it |

Both mirrors use the exact Stack versions, root filenames, script names, canonical ignore strings, hook entrypoints, and four CI labels named in the spine. Their remaining differences are not all harmless implementation detail; H-1–H-3 let packages or hooks behave differently before feature code exists.

## High findings

### H-1 — The TypeScript/ESLint environment map omits most Node runtime packages

**Spine evidence.** AD-32 lines 414 and 440 assign browser semantics to Web, Node semantics to `server/worker/tools`, and neutral semantics to `core/contracts/policies`. The Structural Seed at lines 595–606 additionally contains `storage-sqlite`, `artifact-fs`, `connectors-core`, `connectors-official`, `models`, `notifications`, `agent-mastra`, and `testkit`, but none is assigned to a module-resolution, lib, ambient-global, emit, or test profile.

**Mirror A.** Treats all runtime adapters as NodeNext + ES2023 + `types: ['node']`, while keeping only core/contracts/policies neutral. `testkit` gets Node + explicit runner types.

**Mirror B.** Reads the wording narrowly: only `apps/server`, `apps/worker`, and `tools/**` receive the Node base. Adapter packages extend the neutral base and opt into imported Node types piecemeal; `testkit` uses a browser-oriented runner profile because it also serves Web fixtures.

Both avoid giving DOM/Node ambient globals to the three explicitly neutral packages and both give Web/browser and named server/worker/tools the required profiles. Yet their package exports and declaration surfaces are incompatible: an adapter built as NodeNext cannot be consumed like a Bundler/no-ambient package, and shared fixtures compile under different globals.

**AD-1–31 impact.** This does not repeal AD-1, AD-3, AD-15, or the Structural Seed, but Mirror B can fail to enforce their Node/browser/neutral boundary at exactly the packages that implement connectors, models, notifications, artifacts, and storage.

**Disposition:** **autofix.** Add one exhaustive directory→profile table covering every TypeScript-capable Structural Seed directory, including `apps/desktop` configuration code and `packages/testkit`; bind `module`, `moduleResolution`, `target`, `lib`, `types`, JSX, no-emit/build emit ownership, and permitted test overlays. Require ESLint globals to derive from the same profile map.

### H-2 — Workspace membership and recursive root-script coverage are not fixed

**Spine evidence.** The Structural Seed names `pnpm-workspace.yaml` but not its `packages` or execution settings. AD-32 lines 432, 435, and 436 describe recursive dispatch to workspaces under `apps/**`, `packages/**`, and `tools/**`, but give no exact selector, no required workspace inventory, no root-exclusion rule, and no nested fixture policy.

pnpm's official documentation says that omitting `packages` leaves only the root project in the workspace, recursive `run` excludes the root unless `includeWorkspaceRoot=true`, and recursive commands otherwise traverse every selected project with topological sorting by default. Those are material project settings, not universal invariants: [pnpm workspace settings](https://pnpm.io/settings#packages), [pnpm recursive behavior](https://pnpm.io/cli/recursive), [pnpm run behavior](https://pnpm.io/cli/run#--recursive--r).

**Mirror A.** Includes only direct package roots and forces root exclusion; its root scripts filter the three source domains explicitly.

**Mirror B.** Uses recursive globs and a bare `pnpm -r --if-present`. A nested package fixture under `packages/testkit/**` becomes a CI workspace, and enabling `includeWorkspaceRoot` can make a root `typecheck`/`build` participate in the same recursive leaf name it dispatches.

Both honor the named monorepo directories and use `--recursive --if-present`, but they do not run the same task graph. One can omit a real leaf or include a fixture/root task; the other cannot. That makes the four required gates non-equivalent.

**AD-1–31 impact.** No authority rule is weakened, but the build that produces AD-2's Capability Manifest and AD-18's release payload can cover a different package set.

**Disposition:** **autofix.** Fix `pnpm-workspace.yaml` package globs and exclusions; set `includeWorkspaceRoot: false`; define one canonical workspace inventory/selector; give exact `pnpm --filter ... --recursive --if-present run <leaf>` commands for `typecheck:ts`, `codegen:check`, and `build:ts`; state topological/concurrency behavior where output order matters. Add a check that every expected TypeScript workspace has the required leaf scripts and no unexpected workspace is selected.

### H-3 — lint-staged does not uniquely realize “filter first” or “run cargo fmt once”

**Spine evidence.** AD-32 line 418 requires canonical ignores to be filtered first and says any staged Rust file triggers one `cargo fmt --all`, but it does not bind repository-relative path normalization or require a filename-free function task.

lint-staged's official README states that matched staged filenames are absolute and are appended to normal string tasks; it also documents function tasks as the way to return a complete command without appended filenames. It may chunk long argument lists, causing a normal task to run more than once: [lint-staged configuration and task semantics](https://github.com/lint-staged/lint-staged/blob/main/README.md).

**Mirror A.** Converts absolute filenames to root-relative POSIX form before applying the canonical ignores and returns `() => 'cargo fmt --all'` for Rust.

**Mirror B.** Applies root-relative ignore strings directly to absolute input paths and configures `'**/*.rs': 'cargo fmt --all'`. lint-staged appends paths and may chunk the command, so `cargo fmt --all` is no longer guaranteed to execute once or with valid cargo-fmt arguments.

Both configurations visibly contain the required matchers and commands, but one protects `_bmad-output/**` and formats the workspace once while the other can pass ignored files to tools or invoke cargo-fmt with appended filenames. The local contract is therefore neither portable nor convergent.

**AD-1–31 impact.** No product authority changes, but generated evidence and planning artifacts can enter a formatter path that AD-32 says must exclude, and Rust commits can be blocked or formatted differently from CI.

**Disposition:** **autofix.** Specify root-relative POSIX normalization and the exact JS function-task shape; require `() => 'cargo fmt --all'` for the Rust trigger; define whether overlapping globs execute sequentially; and test representative staged sets including ignored artifacts, shadcn TSX, Web CSS, root config, partially staged files, and multiple Rust files.

## Medium findings

### M-1 — Canonical generated directories lack an owner and exact-output manifest

AD-32 line 442 globally exempts every `**/generated/**` path from lint/format/staged rewriting and says `codegen:check` owns determinism/staleness. It does not require every such root to declare a generator, inputs, tool version/digest, complete output file set, or consumer/export mapping. Mirror A rejects any extra or missing generated file; Mirror B validates only known files, so an extra authored file can hide inside an ignored generated tree while still typechecking/building. Rust/WIT bindings also have no stated route into the pnpm leaf-script dispatcher.

**Disposition:** **autofix.** Define an allowlist of generated roots and one manifest per root; `codegen:check` must reproduce into a clean temporary directory and compare the exact path set plus bytes, rejecting extras. Bind Rust/WIT generation to an explicit root command rather than assuming a pnpm workspace owns it.

### M-2 — `per-directory restricted imports` does not encode the Structural Seed graph

AD-32 line 414 requires restricted imports but does not list the allowed edges or require the ESLint rules to be derived from lines 539–567. Mirror A generates exact allowed edges from the graph; Mirror B prohibits only obvious app→app/core→adapter imports. Both have per-directory restrictions, but only A mechanically blocks every adapter→adapter edge and keeps the desktop shell out of domain ports.

The earlier ADs still prohibit illegal dependencies, so this is not a new authority path. It is nevertheless a configuration-divergence hole in the skeleton whose stated purpose is to keep independent workspaces from choosing incompatible boundaries.

**Disposition:** **autofix.** Make the Structural Seed dependency graph the normative allowlist and require an automated fixture/test proving every allowed and forbidden representative edge. Additional workspace-local restrictions may only narrow an edge with an explicit architecture decision.

### M-3 — Rust 1.98.0 is named but repository-local selection and components are not owned

The Stack pins Rust 1.98.0, while AD-32 invokes `cargo`, `rustfmt`, and Clippy but does not name `rust-toolchain.toml`, `rustfmt.toml`, required components, or a CI version assertion. Rustup resolves commands from command overrides, environment, directory overrides/toolchain files, then the global default; `rustfmt` and Clippy are optional components. A checked-in toolchain file is the repository mechanism for convergence: [rustup override precedence and toolchain files](https://rust-lang.github.io/rustup/overrides.html), [rustup components](https://rust-lang.github.io/rustup/concepts/components.html).

Mirror A and Mirror B can both run 1.98.0 in CI, yet local Husky and editor behavior can use different active toolchains or lack components. CI remains authoritative, so this is Medium rather than High, but it contradicts the claim of one cross-language local/CI contract.

**Disposition:** **autofix.** Add `rust-toolchain.toml` with exact channel `1.98.0`, minimal profile, and `rustfmt`/`clippy`; add the chosen edition/style edition in workspace manifests or `rustfmt.toml`; assert `rustc`, `cargo fmt`, and Clippy versions at CI setup.

### M-4 — `quality.yml` cannot by itself prove the four checks are required

AD-32 line 444 and the Structural Seed line 589 require stable checks named `lint`, `format-check`, `typecheck`, and `build`, but required-check enforcement belongs to repository rules/branch protection, not merely job definitions. Mirror A stores/verifies a ruleset or an external setup receipt; Mirror B has identical workflow jobs but leaves them optional. The repository artifact alone cannot distinguish them.

**Disposition:** **discuss or autofix.** Name the authoritative repository-rules owner and evidence/verification command. Keep job/check names stable and map `format-check` explicitly to root `format:check`; fail the release workflow if required-check protection cannot be verified, or document this as a pre-build external setup gate rather than source-controlled behavior.

## AD-1–31 non-regression audit

| Earlier invariant | Adversarial result |
| --- | --- |
| AD-1 / AD-3 owner and write boundaries | **No direct weakening.** Linters/build scripts do not create a second state owner or write path. H-1/M-2 concern enforcement coverage, not a textual authorization to violate these ADs. |
| AD-2 stage Gate and Capability Manifest | **Preserved.** AD-32 explicitly says the S0-V skeleton does not register or authorize S1–S5. Compiling `--all-features`, generating code, or passing four checks is not Gate evidence. H-2 can make build coverage inconsistent, so the task graph must be closed before relying on manifest output. |
| AD-12 sandbox compiler/componentizer evidence | **Preserved.** TypeScript 6.0.3 tooling and `codegen:check` do not close OQ-06 or satisfy five-platform sandbox evidence. M-1 only leaves ownership of generated WIT bindings underspecified. |
| AD-13 shared contracts | **Preserved semantically.** Browser/server still share the locked Draft 7/Ajv profile and conformance corpus. M-1 allows different generated-artifact pipelines, not a second canonical schema authority. |
| AD-15 UI primitive/source ownership | **Preserved.** `apps/web/src/components/ui/**` is explicitly treated as TickDeck-owned source and remains linted/formatted; generated ignores cannot classify it as disposable. |
| AD-18 / AD-20 reproducible release and exact-bits testing | **No textual weakening.** Rust/CI realization gaps can make evidence non-reproducible across developers or omit checks from branch protection, but they do not relax release-manifest or exact-bits acceptance rules. |
| AD-31 finance decimal authority | **Preserved.** ESLint/TypeScript choices do not authorize direct `decimal.js` imports or binary-float authority outside `finance-decimal`. The restricted-import map should mechanically enforce that prohibition. |

## Stage-Gate attack

- Mirror A and Mirror B may compile empty/future-stage packages, but AD-2 distinguishes presence in source/build from runtime registration and evidence. No premature S1–S5 authorization was found.
- A green `lint`, `format-check`, `typecheck`, or `build` check cannot close SM-00, OQ-02, OQ-03, OQ-06, connector qualification, sandbox evidence, or any later Gate.
- AD-32's classification as an S0-V skeleton is therefore safe. The Reviewer Gate fails because the skeleton can be assembled incompatibly, not because it changes the product stage ceiling.

## Gate recommendation

Do not hand AD-32 to the first `bmad-build` unchanged. Close H-1–H-3 in the spine/memlog, then re-run this lens. M-1–M-3 are cheap to close in the same pass; M-4 may be recorded as an explicit repository-operations handoff if ruleset management is intentionally outside Story 1.1. None of these corrections requires changing the PRD, UX contract, product scope, or S0-V–S5 Gate semantics.
