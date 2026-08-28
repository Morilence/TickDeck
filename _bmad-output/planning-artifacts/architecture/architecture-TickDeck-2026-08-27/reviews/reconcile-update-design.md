# DESIGN.md ↔ Architecture Spine TypeScript 6.0.3 / AD-32 Update Reconciliation

- Review date: 2026-08-28
- Input: `../../ux-designs/ux-TickDeck-2026-08-27/DESIGN.md`
- Target: `../ARCHITECTURE-SPINE.md`
- Review scope: the TypeScript 6.0.3 and AD-32 engineering-quality update only, with focused checks on the Web UI baseline, token/source ownership, Web-only Stylelint, generated-source boundaries, and stage surfaces
- Verdict: **PASS**
- Severity count: **Critical 0 / High 0 / Medium 0 / Low 0**

## Executive finding

The updated spine remains consistent with `DESIGN.md`. TypeScript 6.0.3 and AD-32 add implementation-quality constraints without changing the React/Tailwind/shadcn Base UI product contract, visual semantics, responsive envelope, or stage availability. No design requirement was dropped, weakened, or promoted to an earlier product stage.

The former high-severity design seams are now closed: AD-15 makes the exact frontend primitive contract and TickDeck ownership binding; AD-2 carries the named component-stage projection; AD-13/15/17 carry presentation, theme, accessibility, and viewport invariants; AD-32 explicitly distinguishes authored shadcn source from machine-generated output and limits Stylelint to Web styles.

## Findings

### F-1 — React/Tailwind/shadcn Base UI baseline is preserved and made buildable

**DESIGN evidence.** `DESIGN.md` lines 9–21 and 173–177 fix shadcn `base-vega`, Base UI, the official default registry, Tailwind CSS variables, neutral base, Lucide, `menuColor=default`, `menuAccent=subtle`, compose-before-extend, and TickDeck configuration ownership. Lines 213–215 and 260 prohibit Radix/New York variants, third-party registries, and parallel hand-written primitives.

**Spine evidence.** AD-15 lines 246–254 binds the same Vite React SPA, `base-vega` + Base UI, Tailwind variables, neutral base, Lucide, exact shadcn 4.19.0 preset, committed `components.json` and registry source digests, local font packaging, official-first composition, recorded capability-gap extensions, and `DESIGN.md` as the normative token/component/interaction contract. The Stack lines 494–502 lock the corresponding React, Vite, Tailwind, shadcn, Base UI, Lucide, and font packages.

**Assessment.** **Match.** The TypeScript 6.0.3 tsconfig rules in AD-15/AD-32 affect compilation and module resolution only; they do not substitute a different UI starter, primitive library, style, registry, theme mechanism, or component policy.

### F-2 — Token and source ownership has one unambiguous authority

**DESIGN evidence.** `DESIGN.md` lines 21, 175, 181–187, and 246–262 make the UI baseline a TickDeck-owned contract, require shared shadcn/Tailwind semantic tokens, and treat official registry output as the source from which domain composition is built rather than as an external runtime dependency or mock authority.

**Spine evidence.** AD-15 line 252 makes the TickDeck shared theme/component layer authoritative, requires the resolved preset, `components.json`, generated source, and registry-item source digests to be committed, and permits upgrades only as reviewed source diffs. AD-32 line 442 explicitly states that committed `apps/web/src/components/ui/**` is TickDeck-owned shadcn source, not an ignored generated directory, and subjects it to ESLint and Prettier.

**Assessment.** **Match.** The update closes the common ambiguity between "registry-generated once, then project-owned" UI source and disposable machine-generated artifacts. Exact visual tokens remain in `DESIGN.md`, while the spine fixes ownership and enforcement rather than duplicating the token table.

### F-3 — Web-only Stylelint does not leak into Node, Rust, or generated artifacts

**DESIGN evidence.** `DESIGN.md` assigns Tailwind CSS variables and Web component/style behavior to the React UI surface; it does not impose CSS semantics on server, Worker, Rust, WIT, or repository-generated artifacts.

**Spine evidence.** AD-32 lines 412–420 scopes `stylelint.config.mjs` to `apps/web/**/*.{css,pcss}`, permits only the named Tailwind v4 at-rules/package imports, and keeps unknown at-rule checking enabled. Its root `lint:style` and lint-staged CSS matcher use the same Web-only glob (lines 418 and 424–431). Rust remains under rustfmt/Clippy, while JS/TS/TSX is handled by ESLint/Prettier.

**Assessment.** **Match.** Stylelint enforces the DESIGN-owned Tailwind surface without treating Node code, Rust crates, WIT, or non-Web packages as CSS domains. The separate ESLint ambient-global profiles also prevent browser assumptions from leaking into server/worker/tools or neutral shared packages.

### F-4 — Generated-output exclusion does not exempt authored design-system source

**DESIGN evidence.** `DESIGN.md` lines 213–215 require official components to be added through the project `components.json` and then used as the implementation baseline; lines 246–260 require their props, slots, state, keyboard, focus, and form semantics to remain under normal review.

**Spine evidence.** AD-32 line 442 excludes `**/generated/**` and other dependency/build/cache/report output from lint, formatting, and staged rewriting, delegates deterministic drift detection to `codegen:check`, and then explicitly includes `apps/web/src/components/ui/**` in ESLint/Prettier. AD-13 separately identifies generated TypeScript/JSON Schema as a shared transport-contract product, and AD-32 lines 435–438 make generated drift part of the build gate.

**Assessment.** **Match.** Machine-generated contract/release artifacts are protected from formatter rewrites but must pass deterministic generation checks; shadcn UI source is reviewed as authored TickDeck code. No source class falls through both paths.

### F-5 — Stage surfaces and UX honesty remain unchanged

**DESIGN evidence.** The component table at `DESIGN.md` lines 217–235 assigns S0-V to App Shell, Navigation Rail, Trust Strip, Agent Panel, Run Timeline, Review Canvas, Data Table, Form Control, Status Badge, Empty State, and Theme Control; S1 to Context Drawer, Chart Canvas, Command Palette, and Diagnostic Panel; S2 to Risk Gate; and S4 to Notification Center. Lines 251 and 261–262 prohibit mocks or unqualified capabilities from appearing as implemented/healthy.

**Spine evidence.** AD-2 lines 94–128 preserves the server-authoritative `S0-V → S0 → S1 → S2 → S3 → S4 → S5` Gate and reproduces the same UI surface-stage mapping, with Monaco added at S3 from the broader UX contract. It keeps absent capabilities unregistered and rejects mock/demo/vendor claims as Gate evidence. AD-32 line 444 explicitly classifies the engineering-quality contract as an S0-V skeleton concern that does not register or authorize any S1–S5 product capability.

**Assessment.** **Match.** Introducing TypeScript 6.0.3, lint/format/type/build gates, or a generated UI starter cannot be interpreted as capability evidence and does not promote Chart Canvas, Risk Gate, Monaco, Notification Center, or any later-stage behavior.

## TypeScript 6.0.3 impact on DESIGN

`DESIGN.md` contains no TypeScript-version-specific assertion and therefore has no TypeScript 7-only UX evidence to retire. The update's TypeScript-specific rules are confined to build/module boundaries: Web uses Bundler resolution and explicit browser libs/types; Node uses NodeNext; neutral packages receive no browser/Node ambient globals; and every TypeScript workspace typechecks without emit under 6.0.3. These constraints reinforce, rather than alter, the DESIGN separation between the React Web surface, server/Worker code, and shared contracts.

The locally bundled Inter decision is also consistent: DESIGN delegates `--font-sans` to the selected Tailwind preset and forbids mandatory network fonts; AD-15 selects the Inter-bearing preset and packages `@fontsource-variable/inter` locally, without creating a runtime font dependency.

## Final verdict

**PASS.** No corrective edit to `ARCHITECTURE-SPINE.md` or `DESIGN.md` is required for this input reconciliation. The current TypeScript 6.0.3 + AD-32 update preserves the DESIGN contract, gives the design-system source a clear owner, applies Stylelint only to Web CSS, keeps generated-output enforcement separate from authored shadcn source, and leaves every product-stage surface under the existing Gate authority.
