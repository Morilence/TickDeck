# Reality / Currentness Final Rerun — TypeScript 6.0.3 and AD-32

- Review date: 2026-08-28 (Asia/Shanghai)
- Target: `../ARCHITECTURE-SPINE.md`
- Prior review: `review-update-reality-currentness.md`
- Supporting evidence: `review-update-tool-versions-final.md`, `review-update-typescript-6.0.3-final.md`
- Review mode: second bounded final rerun after the Windows portability correction; every prior finding was checked for regression
- Mutation boundary: this report only; the spine, upstream inputs, and downstream artifacts were not modified

## Verdict

**PASS — the current architecture contract is current and implementable.**

The former Windows portability finding is closed. All four recursive pnpm commands now use literal double-quoted direct-directory selectors, and CI places `HUSKY: "0"` in workflow/job YAML `env` instead of using a POSIX inline assignment. The revised dependency-build contract also matches pnpm 11.24 semantics: reviewed `allowBuilds: false` packages are intentionally blocked and therefore legitimately appear in `pnpm ignored-builds`; the required result is an exact match with the reviewed false set, not an always-empty list.

No earlier Reality/Currentness finding regressed. This PASS applies to the **architecture baseline**. It does not claim that the still-absent Story 1.1 skeleton, lockfiles, quality scripts, hooks, Rust workspace, workflow, repository rules, or OQ-06 sandbox chain have already been implemented or executed.

## Evidence refreshed in this rerun

### Exact package pins and peers

Fresh npm registry queries returned the following current versions and compatibility data:

| Package surface | Current result |
| --- | --- |
| pnpm | `11.24.0`; Node engine `>=22.13`. |
| TypeScript | Registry-wide latest is `7.0.2`, while the highest stable 6-series version is exactly `6.0.3`, as required. |
| ESLint / `@eslint/js` | `10.9.1` / `10.0.1`; `@eslint/js` peers on ESLint `^10.0.0`, and ESLint admits Node `>=24`. |
| `typescript-eslint` | `8.68.0`; peers accept ESLint 10 and TypeScript `>=4.8.4 <6.1.0`, including 6.0.3. |
| ESLint companions | `eslint-config-prettier@10.1.8`, `eslint-plugin-react-hooks@7.1.1`, `globals@17.11.0` remain current and admit the selected ESLint/Node baseline. |
| Prettier | `3.9.6`. |
| Commitlint | `@commitlint/cli@21.2.2` and `@commitlint/config-conventional@21.2.2`; Node engine `>=22.12.0`. |
| Stylelint | `stylelint@17.14.1` and `stylelint-config-standard@40.0.0`; the config peers on Stylelint `^17.0.0`. |
| Husky / lint-staged | `9.1.7` / `17.4.1`; lint-staged requires Node `>=22.22.1`, satisfied by Node 24.20.0. |

The spine's exact engineering pins at `ARCHITECTURE-SPINE.md:506-520` therefore remain current and mutually compatible. EditorConfig remains correctly represented by a root `.editorconfig`, not a fabricated npm dependency. Node 24.20.0 and Rust 1.98.0 remain the explicit runtime/toolchain pins.

`eslint-plugin-import-x` is **deliberately dropped**. It is absent from Stack, AD-32 explicitly excludes it (`ARCHITECTURE-SPINE.md:410`), and the boundary authority is instead generated from `workspace-policy.mjs` into ESLint core `no-restricted-imports`, manifests, and positive/negative fixtures. The previous `unrs-resolver` lifecycle-build edge is therefore not silently reintroduced.

### Windows portability closure

The current spine contains no `--filter './…'` selector and no `HUSKY=0 command` form.

- `typecheck:ts`, `codegen:check`, `build:ts`, and `test:unit` all use `--filter "./apps/*" --filter "./packages/*" --filter "./tools/*"` (`ARCHITECTURE-SPINE.md:462`, `465-466`, `469`). Double quotes are consumed correctly by POSIX shells, Windows `cmd.exe`, and PowerShell rather than becoming literal selector characters.
- A fresh pnpm 11.24.0 execution of that exact selector union in the existing isolated five-project probe selected all four non-root workspaces and completed every declared `typecheck` leaf with exit 0.
- CI now requires workflow/job-level `env: { HUSKY: "0" }`, followed separately by `pnpm install --frozen-lockfile` (`ARCHITECTURE-SPINE.md:478`). This is valid GitHub Actions environment syntax and preserves Husky's documented `HUSKY=0` disable mechanism without depending on runner shell syntax: [GitHub workflow `env`](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#env) · [Husky CI guidance](https://typicode.github.io/husky/how-to.html#ci-server-and-docker).

The architecture therefore supplies a cross-shell serialization for root scripts and a shell-independent CI environment contract. Actual Windows and POSIX workflow runs remain Story 1.1 implementation evidence, not prerequisites for an architecture-only PASS.

### pnpm 11.24 lifecycle-build contract

The revised rule at `ARCHITECTURE-SPINE.md:410` is faithful to pnpm 11.24:

- `strictDepBuilds: true` makes an unreviewed dependency build fail installation.
- `allowBuilds` accepts explicit boolean decisions: `true` permits the lifecycle build and `false` intentionally blocks it.
- packages absent from `allowBuilds` remain unreviewed; pnpm may add placeholders, which AD-32 explicitly rejects.
- `dangerouslyAllowAllBuilds: false` preserves the fail-closed posture.
- `pnpm ignored-builds` prints packages whose build scripts were blocked, including explicitly denied `allowBuilds: false` packages. Therefore an empty list is valid only when the reviewed false set is empty.

These semantics are documented by pnpm's current [build settings](https://pnpm.io/settings/build) and [`ignored-builds` command](https://pnpm.io/cli/ignored-builds).

A fresh pnpm `11.24.0` scratch probe used `esbuild@0.25.12`, `strictDepBuilds: true`, and `allowBuilds: { esbuild: false }`:

```text
pnpm install --frozen-lockfile
Already up to date
Done ... using pnpm v11.24.0
exit 0

pnpm ignored-builds
Explicitly ignored package builds (via allowBuilds):
  esbuild
exit 0
```

This validates the correction from the former “ignored-builds must be empty” wording. The planned `dependency-build-check.mjs` has an executable invariant: derive the reviewed false set from lockfile plus policy, normalize the CLI's actual blocked package set, and require exact equality while rejecting missing decisions, placeholders, and extra blocks (`ARCHITECTURE-SPINE.md:410`, `455`, `478`). Exact lockfile-specific decisions properly remain part of Story 1.1 because no TickDeck dependency graph exists yet.

## Prior-finding regression matrix

| Prior finding | Current architecture closure | Rerun result |
| --- | --- | --- |
| C-1 pnpm lifecycle approvals / ignored builds | Strict fail-closed settings, explicit true/false review, exact expected-vs-actual blocked set, placeholder rejection, no interactive approval prerequisite; import-x removed. | **Closed; pnpm 11.24 false-set probe passed.** |
| H-1 recursive workspace coverage | A 16-member machine inventory and stage-aware `workspace-check.mjs` precede the exact direct-directory recursive commands; `--if-present` cannot hide a required missing leaf. | **Closed; selector union rerun passed, and quoting is now cross-shell.** |
| H-2 TypeScript profiles / shared ESM | Exhaustive Web, Node runtime, neutral shared, Node config, and test-overlay profiles; ESM `type`, `.js` runtime imports, exports/types, explicit ambient types, and shared NodeNext declarations. | **Closed; no regression.** |
| H-3 Tailwind v4 / shadcn Stylelint | Web-only scope, exact Tailwind directive exceptions, remaining unknown-at-rule enforcement, decimal OKLCH/shadcn fixture, and Prettier-compatible representative CSS. | **Closed; no regression.** |
| H-4 Rust toolchain / gates | Root `rust-toolchain.toml` pins 1.98.0 minimal plus rustfmt/clippy; Edition 2024 formatting and all-target/all-feature/locked gates remain explicit. | **Closed at architecture level; execution remains Story 1.1 evidence.** |
| M-1 lint-staged / ignore boundaries | Absolute-to-repository-relative POSIX normalization, `.mts/.cts`, non-overlap, filename-free once-only Rust check, partial-staging fixtures, canonical ignores, lockfile ownership, and generated Rust confinement remain present. | **Closed; no regression.** |
| M-2 Husky / CI | Husky only dispatches local hooks; independent CI checks remain authoritative; CI disables hook installation through YAML `env`. | **Closed, including Windows shell portability.** |
| Final rerun portability finding | Double-quoted pnpm selectors and YAML `env: { HUSKY: "0" }`. | **Closed.** |

## Architecture baseline versus pending implementation

The repository still has no application skeleton. The current spine correctly prescribes, rather than pretends to contain, the root manifests/configs, 16 workspace members, lockfiles, quality validators, fixtures, hooks, Rust files, and `.github/workflows/quality.yml`.

The first `bmad-build` / Story 1.1 must still materialize and execute this contract, including:

1. actual lockfile-derived `allowBuilds` decisions and exact-set validation;
2. clean and frozen installs on the supported CI profiles;
3. the recursive coverage, dependency-edge, Tailwind/shadcn, lint-staged, generated-output, TypeScript shared-consumer, and Rust fixtures, plus root-script execution on supported CI profiles;
4. independent `lint`, `format-check`, `typecheck`, `build`, and current-stage `test` checks plus external repository-rules verification;
5. S0-V, AD-20, SM-00, OQ-06, and later release evidence at their existing Gates.

Those pending executions do not weaken this verdict: the current document is an implementable pre-build architecture baseline, and it does not falsely mark skeleton/CI or later product capabilities complete.

## Final determination

**PASS.** The Windows portability defect is closed, the revised pnpm allow/deny/ignored-build exact-set rule is correct for pnpm 11.24, the exact engineering pins and peer ranges remain current, import-x remains intentionally excluded, and every prior Reality/Currentness finding stays closed without altering TickDeck's product scope or staged Gates.
