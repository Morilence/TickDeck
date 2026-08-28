> [!WARNING]
> **SUPERSEDED（2026-08-28）。** 本文件是首轮 Reality/Currentness Gate，保留其 findings 作为修订历史；当前 verdict 以 `review-update-reality-currentness-final.md` 为准。

# Reality / Currentness Review — TypeScript 6.0.3 and AD-32

- Review date: 2026-08-28 (Asia/Shanghai)
- Target: `../ARCHITECTURE-SPINE.md`
- Evidence reviewed: `review-update-tool-versions-final.md`, `review-update-typescript-6.0.3-final.md`
- Review mode: independent current-source verification plus clean scratch-workspace probes
- Mutation boundary: this report only; the spine and existing evidence files were not modified

## Verdict

**FAIL — UPDATE REQUIRED before the first `bmad-build`.**

The selected versions are current and mutually compatible at the declared Node/TypeScript peer ranges, and the TypeScript 6.0.3 Web/Node split is directionally correct. However, AD-32 is not yet an executable skeleton contract: pnpm 11.24.0's default dependency-build policy blocks the exact lint dependency tree unless the repository commits an explicit decision; recursive scripts can silently skip TypeScript workspaces; shared TypeScript packages have no fixed module-resolution/emit mode; the Tailwind/Stylelint rule description does not pass representative official Tailwind syntax; and the Rust version is not enforced with the required `clippy`/`rustfmt` components.

No conclusion from the superseded TypeScript 7.0.2 review was used. All TypeScript assertions below come from TypeScript 6.0.3 metadata, TypeScript 6.0 documentation, the two new repository evidence files, and fresh probes.

## Currentness and peer/engine audit

Official metadata was re-read on 2026-08-28. TypeScript registry `latest` is now 7.0.2, but the highest stable `6.0.x` is exactly 6.0.3; therefore the requested **latest stable 6 series** pin is correct rather than stale.

| Item | Pin | Current official result |
| --- | --- | --- |
| Node.js | 24.20.0 | Current LTS on the [official Node download page](https://nodejs.org/en/download). |
| pnpm | 11.24.0 | Registry latest; engine `>=22.13`, satisfied by Node 24.20.0. [registry](https://registry.npmjs.org/pnpm/11.24.0) |
| TypeScript | 6.0.3 | Highest stable 6.0 patch; engine `>=14.17`. [registry](https://registry.npmjs.org/typescript/6.0.3) |
| ESLint / `@eslint/js` | 10.9.1 / 10.0.1 | Current; ESLint engine `^20.19.0 || ^22.13.0 || >=24`; `@eslint/js` peer is ESLint `^10`. [ESLint](https://registry.npmjs.org/eslint/10.9.1) · [`@eslint/js`](https://registry.npmjs.org/@eslint/js/10.0.1) |
| `typescript-eslint` | 8.68.0 | Current; peers accept ESLint 8.57/9/10 and TypeScript `>=4.8.4 <6.1.0`, so 6.0.3 is in range. [registry](https://registry.npmjs.org/typescript-eslint/8.68.0) |
| ESLint auxiliaries | pins in spine | `eslint-config-prettier@10.1.8`, `eslint-plugin-import-x@4.17.1`, `eslint-plugin-react-hooks@7.1.1`, and `globals@17.11.0` are current; their declared Node/ESLint peers admit the selected stack. [`import-x`](https://registry.npmjs.org/eslint-plugin-import-x/4.17.1) |
| Prettier | 3.9.6 | Current; Node engine `>=14`. [registry](https://registry.npmjs.org/prettier/3.9.6) |
| Commitlint | 21.2.2 | CLI and conventional config are current; Node engine `>=22.12.0`. [CLI](https://registry.npmjs.org/@commitlint/cli/21.2.2) |
| Stylelint | 17.14.1 / standard 40.0.0 | Current; both require Node `>=20.19.0`; standard peers on Stylelint `^17`. [Stylelint](https://registry.npmjs.org/stylelint/17.14.1) · [standard](https://registry.npmjs.org/stylelint-config-standard/40.0.0) |
| Husky / lint-staged | 9.1.7 / 17.4.1 | Current; engines `>=18` and `>=22.22.1`, respectively. [Husky](https://registry.npmjs.org/husky/9.1.7) · [lint-staged](https://registry.npmjs.org/lint-staged/17.4.1) |
| EditorConfig | root file | Correctly treated as a repository standard rather than an npm runtime. Current [EditorConfig spec 0.17.2](https://spec.editorconfig.org/) supports all named keys and glob rules. |
| Rust | 1.98.0 | Current stable release dated 2026-08-20. [official Rust release notes](https://doc.rust-lang.org/stable/releases.html) |

The version-selection portion of `review-update-tool-versions-final.md` is therefore corroborated. The failure verdict concerns executable configuration and coverage, not version freshness.

## Independent probes

A clean six-project pnpm workspace was created outside the repository using `corepack pnpm@11.24.0`. It contained `apps/web`, `apps/server`, `packages/core`, `packages/no-script`, `tools/component-compiler`, and the root. No TickDeck application file was created or changed.

### Probe A — exact engineering dependency install

Installed the exact AD-32 package set: TypeScript, ESLint, `@eslint/js`, `typescript-eslint`, `eslint-config-prettier`, `eslint-plugin-import-x`, React Hooks plugin, globals, Prettier, Commitlint, Stylelint, Husky, and lint-staged.

Observed:

```text
[ERR_PNPM_IGNORED_BUILDS] Ignored build scripts: unrs-resolver@1.12.2
Run "pnpm approve-builds" to pick which dependencies should be allowed to run scripts.
```

`unrs-resolver` is a transitive dependency of the exact `eslint-plugin-import-x@4.17.1` pin and declares a `postinstall`. With pnpm 11.24.0, `strictDepBuilds` defaults to `true`; an unreviewed build exits non-zero, and pnpm writes an unresolved placeholder to `pnpm-workspace.yaml`. Subsequent `pnpm exec eslint`, Prettier, Stylelint, Commitlint, lint-staged, and tsc commands all failed at dependency verification until the scratch workspace explicitly set `allowBuilds.unrs-resolver` to a boolean. This behavior is the documented default in [pnpm Build Settings](https://pnpm.io/settings/build).

After explicitly denying that one build in the scratch workspace, the six named CLIs reported the expected exact versions. This does **not** decide that denial is correct for TickDeck; the full locked graph, including native/runtime packages, must be reviewed and probed before choosing each boolean.

### Probe B — recursive pnpm coverage

The directory-filter union correctly selected projects under `apps/**`, `packages/**`, and `tools/**`. Four workspaces declared `typecheck`; one TypeScript-shaped package intentionally omitted it.

Observed:

```text
Scope: 5 of 6 workspace projects
... four typecheck scripts ran and exited 0 ...
```

The selected `packages/no-script` workspace was silently skipped. Selecting only that package with `--if-present` also exited 0 with no work. This matches pnpm's official behavior: recursive `run` skips packages without the script, and `--if-present` suppresses failure when the script is undefined ([pnpm run](https://pnpm.io/cli/run)); directory filters only choose packages and do not validate their manifests ([pnpm filtering](https://pnpm.io/filtering)).

### Probe C — Tailwind v4 under the stated Stylelint baseline

Using exact `stylelint@17.14.1` + `stylelint-config-standard@40.0.0`, the config kept `at-rule-no-unknown` enabled and ignored only the nine Tailwind at-rules named by AD-32. A representative file used syntax from the current [Tailwind directives reference](https://tailwindcss.com/docs/functions-and-directives):

```css
@import "tailwindcss";
@theme { --color-canvas: oklch(0.99 0 0); }
@source "../../../packages/core/src";
@custom-variant dark (&:where(.dark, .dark *));
@utility tab-4 { tab-size: 4; }
```

Observed:

```text
Expected "tailwindcss" to be url("tailwindcss")  import-notation
Expected "0.99" to be "99%"                      lightness-notation
Expected "0" to be "0deg"                        hue-degree-notation
Expected empty line before at-rule                 at-rule-empty-line-before
```

The Tailwind at-rule exception itself works, but it is insufficient to make official Tailwind/shadcn-style CSS pass the stated standard config. The repository evidence file's statement that a Tailwind probe exited 0 is not reproducible from the documented config because it does not preserve the exact config or fixture that passed.

### Probe D — generated lockfile formatting

A fresh pnpm 11.24.0 lockfile failed `prettier@3.9.6 pnpm-lock.yaml --check`. AD-32's staged YAML matcher includes `pnpm-lock.yaml`, and the canonical ignore set does not exclude it. This can be made executable by deliberately declaring Prettier ownership of the generated lockfile, but that choice conflicts with the broader statement that generated/package-manager output is not rewritten and creates formatting churn after dependency operations. The contract must choose one behavior explicitly.

### Probe E — Rust availability

The official 1.98.0 pin is current, but the current workspace has no `cargo`, `rustc`, `rustfmt`, or `clippy`. That is expected before Story 1.1 and is not itself a failure. It does show that the repository currently has no executable Rust evidence. More importantly, `cargo fmt` is an external optional tool and Clippy is optional in minimal rustup profiles; the official [rustup toolchain-file contract](https://rust-lang.github.io/rustup/overrides.html) supports pinning both components, and the [Clippy installation guide](https://doc.rust-lang.org/stable/clippy/installation.html) confirms minimal profiles omit Clippy.

## Findings

### Critical

#### C-1 — pnpm 11.24.0 dependency-build policy is missing from the root contract

- **Evidence:** `ARCHITECTURE-SPINE.md:410` pins pnpm and lockfiles, but neither AD-32 nor Structural Seed defines `pnpm-workspace.yaml` build approvals. The clean exact-dependency probe failed with `ERR_PNPM_IGNORED_BUILDS` for `unrs-resolver@1.12.2`.
- **Impact:** the mandated `pnpm install --frozen-lockfile` and every subsequent `pnpm exec` quality command can fail before lint/typecheck/build begins. Native packages later in the stack make an implicit allow-all especially unsafe.
- **Required correction:** make `pnpm-workspace.yaml` part of AD-32's quality authority; keep `strictDepBuilds: true` and `dangerouslyAllowAllBuilds: false`; commit an explicitly reviewed `allowBuilds` boolean for every locked package with lifecycle builds; require a clean-install check that `pnpm ignored-builds` reports none. Values must be decided from the complete Story 1.1 lockfile and runtime probes, not inferred from package names.

### High

#### H-1 — root TypeScript dispatch cannot enforce “every workspace” and is not an exact command

- **Evidence:** `ARCHITECTURE-SPINE.md:422-438` says TypeScript workspaces must implement `typecheck`/`build`, but describes `pnpm --recursive --if-present` rather than giving complete filter/run commands. Official pnpm behavior and Probe B show recursive run skips a selected package missing the script; `--if-present` can turn “zero checks ran” into success.
- **Impact:** a new `apps/**`, `packages/**`, or `tools/**` TypeScript workspace can bypass both typecheck and build while all four required CI checks remain green.
- **Required correction:** add an exact deterministic `workspace:check` script that enumerates pnpm workspace manifests, classifies TypeScript workspaces, and fails when required leaf scripts/configs are absent. Then define literal filtered invocations using all three quoted directory filters plus `--fail-if-no-match`; do not treat `--if-present` as coverage validation. Apply the same manifest rule to code generators that exist.

#### H-2 — shared TypeScript packages have no fixed module/emit contract

- **Evidence:** `ARCHITECTURE-SPINE.md:254` correctly fixes Web as ESNext/Bundler and Node services/tools as NodeNext/NodeNext. `:440` gives `core/contracts/policies` neutral ambient types but does not fix their `module`, `moduleResolution`, package `type`, exports, emit/declaration, or relative-import convention.
- **Impact:** two shared packages can independently choose Bundler versus NodeNext and produce types that pass one consumer while their JavaScript fails in Node. Package exports alone do not decide compiler resolution or ESM extension behavior. TypeScript's official module theory says NodeNext and Bundler model different runtime resolution rules ([TypeScript modules](https://www.typescriptlang.org/docs/handbook/modules/theory.html)).
- **Required correction:** choose one shared-package contract explicitly. A viable default is ESM packages with `type: module`, NodeNext/NodeNext, explicit runtime-safe relative extensions, reviewed `exports`/`types`, and declarations consumed by Vite; another design is acceptable only if it fixes equivalent runtime and declaration invariants.

#### H-3 — Tailwind v4 + Stylelint is under-specified and the documented baseline does not pass

- **Evidence:** `ARCHITECTURE-SPINE.md:416` names Tailwind at-rules and “package `@import`” conflicts but does not name exact rule overrides or a conformance fixture. Probe C failed valid current Tailwind syntax under the exact selected standard config.
- **Impact:** the initial Web stylesheet generated/adapted from shadcn can fail `lint:style`, or two implementers can disable different broad rule sets, defeating AD-32's single configuration authority.
- **Required correction:** preserve an exact `apps/web` Tailwind CSS fixture (including the actual shadcn global theme output), name the minimal per-rule overrides or mandated canonical rewrites for `import-notation`, OKLCH lightness/hue, and Tailwind directives, and require unknown non-Tailwind at-rules still fail. Record the fixture command and output in the compatibility evidence.

#### H-4 — Rust 1.98.0 is listed but not enforceably pinned with gate components

- **Evidence:** `ARCHITECTURE-SPINE.md:428-438` requires `cargo clippy` and `cargo fmt`; Stack lists Rust 1.98.0; Structural Seed omits `rust-toolchain.toml`. Official rustup docs make `rustfmt` and `clippy` optional components and allow them to be pinned in that file.
- **Impact:** developer and CI machines can run different stable compilers, or a minimal CI profile can lack the exact commands that define two required checks.
- **Required correction:** add root `rust-toolchain.toml` with `channel = "1.98.0"`, an explicit profile, and `components = ["rustfmt", "clippy"]`; include its validation in CI. Decide whether `build:rust` intentionally builds only default deliverables or must mirror `--all-targets --all-features`, and state the reason so `check/clippy/build` coverage is not accidental.

### Medium

#### M-1 — lint-staged and ignore boundaries have executable edge gaps

- The JS/TS matcher omits `.mts` and `.cts`, even though NodeNext permits those extensions. Either forbid them repository-wide or include them in ESLint/Prettier staged matches.
- For staged Rust, a plain string task causes lint-staged to append file arguments. To guarantee exactly one `cargo fmt --all`, `lint-staged.config.mjs` must use a function that returns the complete command; the [lint-staged documentation](https://github.com/lint-staged/lint-staged/blob/main/README.md) distinguishes these semantics.
- Decide whether `pnpm-lock.yaml` is package-manager-owned and added to `.prettierignore`, or intentionally normalized by Prettier after every dependency change. The current matcher/ignore combination silently chooses the latter while the prose suggests generated outputs are not reformatted.
- `**/generated/**` cannot be claimed outside Rust formatting merely through JS/CSS ignore lists: `cargo fmt --all` follows crate modules. Generated Rust must either live outside rustfmt's traversed module tree, be emitted already canonical, or have a separately validated stable exclusion mechanism.

#### M-2 — CI should explicitly suppress Husky installation while retaining the four real gates

`prepare: husky` and the two hook commands are valid for the repository root. Official Husky guidance recommends `HUSKY=0` on CI; AD-32 currently says only that CI starts with install. Set `HUSKY=0` for CI dependency installation so a hook bootstrap is not mistaken for a quality gate and cannot depend on Git checkout details. Keep `lint`, `format-check`, `typecheck`, and `build` unchanged as required checks. [Husky CI guidance](https://typicode.github.io/husky/how-to.html)

## Confirmed TypeScript 6.0.3 conclusions

- TypeScript 6.0.3 is the correct requested pin and `typescript-eslint@8.68.0` explicitly supports it.
- Explicit `types`, `rootDir`, `target`, and `lib` are required and correctly called out by AD-32. TypeScript 6.0's current release notes confirm `types: []`, fixed tsconfig-root `rootDir`, modern module-resolution migration, and floating default changes ([TypeScript 6.0 release notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-6-0.html)).
- Web ESNext/Bundler and Node NodeNext/NodeNext are valid pairs. The remaining defect is the unbound shared-package mode, not those two choices.
- The existing compatibility evidence correctly keeps the full TypeScript-to-Component compiler/componentizer/source-map/WIT/WASI chain behind OQ-06/S0. Nothing in this review closes that Gate.
- The only `6→7` mention in the spine rejects `stableTypeOrdering` from normal CI. It is not a stale TypeScript 7 binding.

## Acceptance conditions for a PASS rerun

1. AD-32 fixes pnpm lifecycle-build approvals and a clean frozen-install/no-ignored-build check.
2. Root scripts are literal and paired with a workspace manifest coverage validator.
3. Shared TS packages receive one explicit module/emit/package-exports contract.
4. The exact Tailwind/shadcn CSS fixture passes the committed Stylelint configuration without broad unknown-rule suppression.
5. `rust-toolchain.toml` pins 1.98.0 plus rustfmt/clippy; Rust gate coverage and generated-Rust formatting ownership are explicit.
6. lint-staged extension, function-command, lockfile, Husky-CI, and canonical-ignore edges are resolved and reprobed.

Until these are satisfied, the tool versions can remain selected, but AD-32 should not be handed to `bmad-build` as an executable green baseline.
