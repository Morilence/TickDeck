> [!WARNING]
> **SUPERSEDED（2026-08-28，TypeScript compatibility）。** 本文件保留为历史探针记录；其中 TypeScript 7.0.2 兼容性结论不得继续作为当前证据。当前权威证据是 `review-update-typescript-6.0.3-final.md`。

# Reviewer Gate — Decimal Reality, Versions & Supply Chain

- Reviewed artifact: `ARCHITECTURE-SPINE.md`, current working-tree version, especially AD-31 and Stack
- Review date: 2026-08-28 (Asia/Shanghai)
- Lens: `decimal.js` version/currentness, clone and rounding semantics, canonical `toFixed()` behavior, TypeScript fit, license/supply chain, and the relationship to the TC39 Decimal proposal
- Method: official npm metadata and tarball, upstream source/docs, an exact-package runtime probe, an exact TypeScript 7.0.2 compile probe, and official TC39 proposal records
- Verdict: **FAIL — 0 Critical, 1 High, 0 Medium.** The package/version/API selection is real and suitable, but AD-31 does not yet define a closed and bounded authoritative value domain around `precision=34` and `toFixed()`.

## Critical

None.

## High

### H-01 — `precision=34` does not constrain parsed values, and bare `toFixed()` does not apply that precision

**Where:** AD-31 at `ARCHITECTURE-SPINE.md:382-384`.

`decimal.js` defines `precision` as the maximum significant digits of a **calculation result**. Constructing a Decimal from a string does not round it to the configured precision. Likewise, `toFixed()` without a decimal-place argument emits the stored value in normal notation; it does not first round to the constructor's `precision`. This behavior is intentional and documented: calculations use the configured precision, while `toFixed()` is a rendering operation. [decimal.js upstream README](https://github.com/MikeMcl/decimal.js), [official API reference](https://mikemcl.github.io/decimal.js/)

An exact `decimal.js@10.6.0` probe with an independent `precision=34`, `ROUND_HALF_EVEN` clone produced:

| Probe | Result |
| --- | --- |
| `1 / 3` | `0.3333333333333333333333333333333333` — 34 significant digits |
| parse 35-digit integer, then `toFixed()` | all 35 digits preserved |
| parse `1e+100`, then `toFixed()` | 101-character normal-form integer |
| mutate the default Decimal constructor after clone creation | clone remained at precision 34 / half-even |

The architecture rejects exponent-form input and says every field has length/range constraints, which helps at ingress, but it does not specify:

- whether an authoritative `DecimalString` may contain more than 34 significant digits;
- whether a value accepted with more than 34 digits is compared exactly but rounded when any arithmetic operation occurs;
- a global exponent/result bound for intermediate values;
- a maximum canonical-output length before calling `toFixed()`; or
- the required failure when an operation overflows to Infinity or underflows under the clone's exponent settings.

This leaves a material semantic split: the same 35-digit value can remain exact through parse/compare/serialize, then change precision after an otherwise innocuous arithmetic step. It also leaves `toFixed()` able to expand a large exponent into a very large string. The default decimal.js exponent range is far wider than Decimal128, so `precision=34` alone is not a resource or value-domain bound.

**Required closure:** AD-31 must choose one explicit contract:

1. **Bounded 34-digit value domain:** reject authoritative inputs and post-operation results exceeding 34 significant digits, define exponent/canonical-length bounds, and fail closed on non-finite/underflow outcomes before serialization; or
2. **Arbitrary input domain with 34-digit operation context:** state that canonical values and comparisons may exceed 34 digits, define exactly when arithmetic first rounds, and still impose exponent/result/output bounds.

Rejecting an out-of-domain value is compatible with the existing rule that business rounding happens only at a `QuantizationRule` boundary; the wrapper need not silently round ingress. The chosen policy must be in the oracle corpus, including 34/35-digit boundaries, exponent extremes, no-op arithmetic, overflow/underflow and canonical-output limits.

Until this is fixed, the phrase “34 位有效数字” is true for decimal.js calculation results but incomplete as TickDeck's authoritative financial-value contract.

## Confirmed technology fit

### Version and current status — PASS

As of 2026-08-28, `decimal.js@10.6.0` exists and remains npm's `latest` release. It was published on 2025-07-06. The Stack pin and AD-31 pin agree. [npm package/version history](https://www.npmjs.com/package/decimal.js?activeTab=versions), [upstream changelog](https://github.com/MikeMcl/decimal.js/blob/master/CHANGELOG.md)

The exact npm artifact has integrity:

```text
sha512-YpgQiITW3JXGntzdUmyUR1V812Hn8T1YVXhCu+wO3OpS4eU9l4YdD3qjyiKdV6mvV29zapkMeD390UVEf2lkUg==
```

The repository's future lockfile and Release Manifest should preserve that exact registry integrity rather than only the semver text. [npm registry metadata](https://registry.npmjs.org/decimal.js/10.6.0)

### Independent clone and `ROUND_HALF_EVEN` — PASS

The official API supports `Decimal.clone({ precision, rounding })`; cloned constructors have independent configuration. `ROUND_HALF_EVEN` is a supported rounding mode and has constant value 6. The exact-package probe confirmed the expected ties:

| Input rounded to integer | Result |
| --- | --- |
| `2.5` | `2` |
| `3.5` | `4` |
| `-2.5` | `-2` |
| `-3.5` | `-4` |

This fits AD-31's requirement provided the cloned constructor never escapes `finance-decimal`, no other package directly imports decimal.js, and no exported operation exposes a mutable Decimal constructor/instance. [decimal.js clone/config documentation](https://github.com/MikeMcl/decimal.js), [10.6.0 source defaults and rounding modes](https://github.com/MikeMcl/decimal.js/blob/master/decimal.mjs)

### `toFixed()` canonical rendering — PASS within an explicit value bound

The library's `toFixed()` always returns normal notation, unlike `Number.prototype.toFixed`, which can switch to exponent notation for large values. With no decimal-place argument it also removes insignificant input trailing zeroes; the exact probe returned `1.23` for `001.2300`, and `0` for a Decimal negative zero. [official decimal.js API](https://mikemcl.github.io/decimal.js/)

That makes bare `toFixed()` a good final canonical renderer after AD-31's grammar and bounds are enforced. It must not itself be treated as the 34-digit validator or resource bound, which is the subject of H-01.

### TypeScript 7 — PASS

The npm package includes `decimal.d.ts`, ESM and CommonJS entry points, and both default and named Decimal exports. An exact TypeScript 7.0.2 compile probe using `moduleResolution: bundler`, strict checking, `Decimal.clone`, `ROUND_HALF_EVEN`, arithmetic and `toFixed()` completed with no diagnostics. [10.6.0 npm metadata](https://registry.npmjs.org/decimal.js/10.6.0), [upstream TypeScript declarations](https://github.com/MikeMcl/decimal.js/blob/master/decimal.d.ts)

The upstream `Decimal.Value` type intentionally accepts `string | number | bigint | Decimal`. AD-31's narrower string-only rule therefore must be enforced by TickDeck's wrapper/runtime schema; the upstream TypeScript type will not enforce it automatically.

## TC39 Decimal relationship

The current TC39 Decimal proposal is still **Stage 1**. The official draft dated 2026-06-30 uses the IEEE 754-2019 Decimal128 data model, including up to 34 significant digits. Stage 1 means the committee is exploring the problem and solution space; it is not a standard or a deployable engine baseline. [TC39 Decimal draft](https://tc39.es/proposal-decimal/), [official proposal repository](https://github.com/tc39/proposal-decimal)

The value `precision=34` is therefore a reasonable forward-looking choice, but `decimal.js` with that precision is **not** a Decimal128/TC39 polyfill:

- decimal.js is arbitrary precision with independently configurable exponent limits;
- its constructor accepts arbitrary-length decimal strings;
- TC39's proposed Decimal includes NaN, infinities and negative zero, while TickDeck deliberately rejects them; and
- the proposal can still change at Stage 1.

This is not a blocker. AD-31 does not currently promise native TC39 interchange or migration. The proposal should remain rationale only; a future native Decimal adoption would require a new architecture decision and full oracle migration evidence.

## License and supply chain

### License — PASS

`decimal.js@10.6.0` is MIT licensed. The tarball includes `LICENCE.md`, and the distributed JavaScript retains the license header. MIT is compatible with TickDeck's Apache-2.0 distribution provided the copyright and permission notice is preserved in third-party notices/bundles. [upstream license](https://github.com/MikeMcl/decimal.js/blob/master/LICENCE.md), [10.6.0 source header](https://github.com/MikeMcl/decimal.js/blob/master/decimal.mjs)

### Package surface — PASS with concentration advisory

The exact npm package has:

- zero runtime dependencies;
- no install/postinstall hook;
- six tarball files;
- ESM and CommonJS exports; and
- built-in TypeScript declarations.

This is a small, auditable supply-chain surface. The npm package currently lists one maintainer, so compromise/continuity concentration remains a non-blocking risk. Exact lockfile integrity, release-manifest hash, direct-import enforcement, license retention and reviewed upgrades are the appropriate controls. Stack pinning alone is not enough.

## Gate disposition

**FAIL for the decimal reality/version lens until H-01 is resolved.**

`decimal.js@10.6.0`, the independent clone, `precision=34`, `ROUND_HALF_EVEN`, bare `toFixed()`, TypeScript 7 declarations, MIT license and zero-dependency package are all real and fit the selected architecture. The single blocker is the missing authoritative value envelope: decimal.js does not make parsed values 34-digit values merely because calculation precision is 34, and `toFixed()` is not a precision guard. Close that semantic and resource boundary, then retain the existing cross-surface oracle Gate.
> [!WARNING]
> **SUPERSEDED（2026-08-28，TypeScript compatibility）。** 本文件保留为历史探针记录；其中 TypeScript 7.0.2 兼容性结论不得继续作为当前证据。当前权威证据是 `review-update-typescript-6.0.3-final.md`。
