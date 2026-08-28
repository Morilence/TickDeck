> [!WARNING]
> **SUPERSEDED（2026-08-28，TypeScript 与工程工具 currentness）。** 本文件保留为历史首版证据；其中 TypeScript 7.0.2 结论不得用于 Story 1.1 或任何后续 Gate。当前权威证据是 `review-update-tool-versions-final.md`、`review-update-typescript-6.0.3-final.md` 与新的 update Reviewer Gate。

# Reviewer Gate — Reality & Currentness (complete re-run)

- Reviewed artifact: `ARCHITECTURE-SPINE.md`, current working-tree version
- Review date: 2026-08-28 (Asia/Shanghai)
- Lens: live versions and existence, package/plugin compatibility, starter reality, supported platforms, licenses/notices, and whether committed controls match actual library behavior
- Method: official documentation/source and live npm registry metadata; exact shadcn starter generation/build in a fresh directory; clean pnpm Ajv-resolver import and cross-adapter validation probe
- Verdict: **PASS — 0 Critical, 0 High.**

## Critical

None.

## High

None.

## Closure verification

### ajv-errors 3.0.0 and resolver clean import — closed

The current Stack now pins:

- `@hookform/resolvers@5.9.1`
- `ajv@8.20.0`
- `ajv-formats@3.0.1`
- `ajv-errors@3.0.0`
- `react-hook-form@7.86.0`
- `react@19.2.8`

A fresh pnpm project containing those exact relevant packages loaded:

```js
import { ajvResolver } from "@hookform/resolvers/ajv"
```

successfully. This directly closes the prior `ERR_MODULE_NOT_FOUND: ajv-errors` failure. The live package metadata also confirms that `ajv-errors@3.0.0` exists, is MIT, and accepts `ajv:^8.0.1`; `ajv-formats@3.0.1` exists, is MIT, and accepts `ajv:^8.0.0`. Both fit Ajv 8.20.0.

AD-15 correctly states that `ajv-errors` is a resolver load-time dependency only and keeps `errorMessage` outside the allowed transport-schema keyword set. This avoids accidentally expanding the canonical schema language merely because the adapter registers that keyword internally.

**Evidence:** [resolver 5.9.1 source and unconditional adapter imports](https://github.com/react-hook-form/resolvers/blob/v5.9.1/ajv/src/ajv.ts), [ajv-errors 3.0.0](https://www.npmjs.com/package/ajv-errors/v/3.0.0), [ajv-formats 3.0.1](https://www.npmjs.com/package/ajv-formats/v/3.0.1).

### ContractAjvProfile and S0 conformance language — closed

AD-13 now fixes the canonical transport language to JSON Schema Draft 7 and excludes later-draft-only, TypeBox JavaScript-only, async and custom-keyword contracts. The versioned `ContractAjvProfile` is shared by the browser and Fastify command-body validator and locks the material drift points:

- Ajv version and common strictness settings;
- `allErrors: true`;
- `coerceTypes: false`;
- `useDefaults: false`;
- `removeAdditional: false`;
- `validateFormats: true`;
- `$data: false`;
- no async/custom contract keywords; and
- the same `ajv-formats` set.

AD-15 then requires both `ajvResolver` and Fastify's custom validator compiler to use that same profile. URL query/path parsing is explicitly separate, so HTTP parameter coercion cannot silently change canonical JSON body semantics.

A clean probe instantiated server Ajv and `ajvResolver` with this profile and compared four representative inputs against one schema:

| Case | Server Ajv | Form resolver | Normalized result |
| --- | --- | --- | --- |
| valid number + valid email | accept | accept | equal |
| numeric string with coercion disabled | reject | reject | equal |
| invalid email format | reject | reject | equal |
| additional property with removal disabled | reject | reject | equal |

The S0 wording is now strong enough to prevent this narrow probe from becoming a false proof: it requires a fresh-lockfile clean import plus a corpus covering coercion, defaults, `additionalProperties`, formats, nullable unions, tuples, `$ref`, error normalization, accept/reject parity, normalized-output parity and inferred types.

This closes the former validator-semantics High.

**Evidence:** [Fastify Ajv defaults and custom validator compiler](https://fastify.dev/docs/latest/Reference/Validation-and-Serialization/), [Ajv Draft 7 default and 2020-12 separation](https://ajv.js.org/json-schema.html), [Ajv options](https://ajv.js.org/options.html), [TypeBox current version/capability matrix](https://github.com/sinclairzx81/typebox).

### Exact shadcn starter — closed

The exact AD-15 command, including `font=inter`, was executed with `shadcn@4.19.0` in a new empty directory. After the expected project-name prompt it:

1. created the Vite project;
2. wrote `components.json` with `style: base-vega`;
3. resolved and installed the registry/dependencies;
4. generated source files;
5. imported `@fontsource-variable/inter`; and
6. completed `pnpm build` under Vite 8.2.2.

The build emitted local Inter `.woff2` assets, so the selected font path fits AD-15's no-runtime-font-network rule. The architecture also requires committing the resolved preset and item digests, forbids `latest`/floating registry fetches in CI, and makes future updates reviewed source diffs. That closes both the invalid-preset and mutable-registry findings.

The generated upstream starter currently uses TypeScript 6 and looser semver ranges. This does not contradict the adopted seed because AD-15 explicitly requires replacing those live starter defaults with the exact Stack, omitting `baseUrl`, using TS7-compatible paths/aliases, and passing a clean TypeScript 7/Vite build before adoption.

**Evidence:** [live valid init payload](https://ui.shadcn.com/init?base=base&style=vega&baseColor=neutral&theme=neutral&iconLibrary=lucide&font=inter&menuAccent=subtle&menuColor=default&radius=default&template=vite), [official Vite workflow](https://ui.shadcn.com/docs/installation/vite), [official CLI create/init behavior](https://ui.shadcn.com/docs/cli), [official registry font behavior](https://ui.shadcn.com/docs/registry/examples).

## Currentness and compatibility

Live npm registry metadata on 2026-08-28 confirmed that every exact npm version in Stack exists and every one currently matches its package's `latest` dist-tag. The load-bearing compatibility checks remain green:

| Area | Result |
| --- | --- |
| Node/toolchain | Node 24.20.0 is the selected LTS and satisfies pnpm 11, Fastify 5, Vite 8, Mastra and better-sqlite3 engine requirements. TypeScript 7.0.2 is real/current; AD-15 handles removed `baseUrl` and compiler-API assumptions. [Node releases](https://nodejs.org/en/about/previous-releases), [TypeScript 7 announcement](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/), [Vite 8 requirements](https://v8.vite.dev/blog/announcing-vite8) |
| TypeBox/Fastify | `@fastify/type-provider-typebox@6.1.0` requires `typebox:^1.0.13`; `typebox@1.3.19` satisfies it and supports the TS 6–7 generation. The old scoped package/resolver mismatch is absent. [provider repository](https://github.com/fastify/fastify-type-provider-typebox), [TypeBox repository](https://github.com/sinclairzx81/typebox) |
| Frontend core | React 19.2.8, Vite 8.2.2, plugin-react 6.1.0, Tailwind 4.3.3, `@tailwindcss/vite@4.3.3`, shadcn 4.19.0, Base UI 1.7.0, Lucide 1.34.0 and local Inter 5.3.0 exist and fit the selected peers. |
| State/forms | Router 1.170.32, Query 5.102.8, Zustand 5.0.15, React Hook Form 7.86.0, resolvers 5.9.1, Ajv 8.20.0, formats 3.0.1 and errors 3.0.0 all exist; the clean adapter probe passes. |
| Test tooling | Testing Library React 16.3.2 has the present DOM 10.4.1 peer; Storybook React/Vite and addon-a11y match Storybook 10.5.10; Vitest 4.1.11, Playwright 1.62.1 and MSW 2.15.0 fit Node 24/Vite 8/React 19. |
| Fastify plugins | Static 10.1.3, cookie 11.1.2, websocket 11.3.0 and csrf-protection 8.0.1 exist and fit Fastify 5. [static compatibility](https://github.com/fastify/fastify-static), [cookie compatibility](https://github.com/fastify/fastify-cookie), [websocket source](https://github.com/fastify/fastify-websocket), [csrf compatibility](https://github.com/fastify/csrf-protection) |
| SQLite/native profiles | better-sqlite3 13.0.3 targets Node >=22 and publishes/tests builds for Linux x64/ARM64, Darwin x64/ARM64 and Windows x64, matching the five single-host release profiles. [package metadata](https://github.com/WiseLibs/better-sqlite3/blob/master/package.json), [build workflow](https://github.com/WiseLibs/better-sqlite3/blob/master/.github/workflows/build.yml) |
| Wasmtime/Rust | Wasmtime 48.0.1 is the selected 48 LTS patch and Rust 1.98 exceeds its MSRV. Component Model, fuel, epoch interruption, resource limiting and named x64/ARM64 hosts exist. AD-12 records ARM64's lower upstream tier and requires TickDeck's own five-profile evidence. [release policy](https://docs.wasmtime.dev/stability-release.html), [platform support](https://docs.wasmtime.dev/stability-platform-support.html), [resource limiter scope](https://docs.wasmtime.dev/api/wasmtime/trait.ResourceLimiter.html) |

## Platform and isolation reality

The earlier whole-process-memory overclaim remains closed. AD-12 distinguishes guest linear memory from total process memory, bounds source/component/input and runtime objects, specifies Windows Job Object process/job limits and kill-on-close, uses proven Unix OS limits plus measured RSS sampling, records sampling interval and maximum overshoot, and refuses platform support when bounded overshoot cannot be demonstrated. It also requires process-tree termination and adversarial compile/runtime memory fixtures.

The fixed five-platform promise therefore remains a release-profile evidence obligation, not an assertion that Wasmtime's Store limiter alone controls host RSS. ARM64 upstream Tier 2 is explicitly visible and cannot weaken TickDeck's own evidence.

**Evidence:** [Wasmtime ResourceLimiter scope/non-coverage](https://docs.wasmtime.dev/api/wasmtime/trait.ResourceLimiter.html), [StoreLimits per-memory semantics](https://docs.wasmtime.dev/api/wasmtime/struct.StoreLimitsBuilder.html), [Windows Job Object limits](https://learn.microsoft.com/en-us/windows/win32/api/winnt/ns-winnt-jobobject_extended_limit_information), [Job Objects and kill-on-close](https://learn.microsoft.com/en-us/windows/win32/procthread/job-objects).

## Licenses and notices

Live top-level package metadata remains compatible with an Apache-2.0 TickDeck distribution:

- npm runtime/tooling packages are MIT, ISC or Apache-2.0, except the locally bundled Inter font, which is OFL-1.1;
- Wasmtime is Apache-2.0 WITH LLVM exception;
- Lightweight Charts 5.2.1 is Apache-2.0 and its tagged NOTICE/TradingView attribution is explicitly required in bundles and the About/Licenses UI;
- Mastra use is restricted to its Apache package/source boundary and excludes repository `ee/` code.

No named top-level license incompatibility was found. AD-18 correctly keeps full transitive SBOM, artifact hashes, redistribution evidence and third-party notices as a fail-closed release gate.

**Evidence:** [Lightweight Charts 5.2.1 NOTICE](https://github.com/tradingview/lightweight-charts/blob/v5.2.1/NOTICE), [Lightweight Charts license](https://github.com/tradingview/lightweight-charts/blob/v5.2.1/LICENSE), [Mastra licensing map](https://github.com/mastra-ai/mastra), [Inter variable package](https://www.npmjs.com/package/@fontsource-variable/inter/v/5.3.0).

## Advisory / deferred evidence

- The repository still contains no application dependency manifest, lockfile, Cargo lockfile, built bundle or SBOM. This review verifies the architecture's selected top-level reality and gates; it is not a transitive vulnerability or final redistribution audit.
- Fastify warns that `allErrors: true` can increase denial-of-service exposure. The shared profile is semantically consistent, but S0 should retain request-size/property-count limits and adversarial validation fixtures.
- The generated shadcn/Vite seed emitted a non-fatal warning that its `__dirname` config usage is incompatible with a possible future native config-loader default. It builds with pinned Vite 8.2.2; normalizing to `import.meta.dirname` during the reviewed seed adoption is prudent.
- TypeScript-to-Component compiler/componentizer selection remains deliberately behind S0. The current spine does not claim that an experimental compiler is production-proven; it requires import inspection, exact WIT/WASI pinning, deterministic/source-map evidence and full platform fixtures before registering the capability.

## Gate disposition

**PASS for the Reality/Currentness lens.** The prior TypeBox, process-memory, TypeScript 7 starter, missing peer/plugin, notices, mutable registry, shadcn preset, validator-parity and `ajv-errors` findings are closed in the current spine. No Critical or High currentness/compatibility blocker remains. Deferred lockfile, bundle, SBOM, compiler and five-profile evidence stays fail-closed at S0/release and does not authorize any later-stage capability.
> [!WARNING]
> **SUPERSEDED（2026-08-28，TypeScript 与工程工具 currentness）。** 本文件保留为历史首版证据；其中 TypeScript 7.0.2 结论不得用于 Story 1.1 或任何后续 Gate。当前权威证据是 `review-update-tool-versions-final.md`、`review-update-typescript-6.0.3-final.md` 与新的 update Reviewer Gate。
