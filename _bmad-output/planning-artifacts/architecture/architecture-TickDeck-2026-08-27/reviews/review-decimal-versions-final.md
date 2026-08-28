> [!WARNING]
> **SUPERSEDED（2026-08-28，TypeScript compatibility）。** 本文件保留为历史最终记录；其中 TypeScript 7.0.2 兼容性结论已由 TypeScript 6.0.3 复核替代，不得用于 Story 1.1 或后续 Gate。当前权威证据是 `review-update-typescript-6.0.3-final.md`。

# Reviewer Gate — Decimal Reality, Versions & Supply Chain (final re-run)

- Reviewed artifact: `ARCHITECTURE-SPINE.md`, current working-tree version, especially AD-31 and Stack
- Review date: 2026-08-28 (Asia/Shanghai)
- Lens: exact decimal/lossless-JSON packages, bounded 34-digit semantics, canonical output, stable failures, TypeScript fit, licenses/supply chain, and TC39 claim discipline
- Method: official npm registry metadata and exact tarballs, upstream source/docs, exact-package runtime probes, TypeScript 7.0.2 strict compile probe, npm audit, and official TC39 records
- Verdict: **PASS — 0 Critical, 0 High, 0 Medium.** The previous missing-value-envelope High is closed.

## Critical

None.

## High

None.

## Medium

None.

## Previous High closure

### Closed — parsed values, operation results and canonical output now share a bounded contract

AD-31 no longer treats `precision=34` or bare `toFixed()` as a complete value-domain guard. It now independently fixes:

- at most 34 significant digits for every non-zero `DecimalString`;
- highest-significant-digit exponent `[-6176, 6144]`;
- canonical ASCII output at no more than 6212 bytes including sign;
- rejection, rather than rounding, of out-of-domain input;
- one 34-digit half-even context rounding at every wrapper primitive result;
- immediate post-result value-domain validation;
- normalization of negative zero before comparison/hash/next operation; and
- fail-closed handling for non-finite, divide-by-zero, invalid, overflow, underflow and resource-limit outcomes.

This closes the earlier semantic split where a greater-than-34-digit value could remain exact through parse/compare/serialize and then change precision only after arithmetic.

The output bound is internally correct. An exact package probe produced:

| Boundary value | Bare `toFixed()` length |
| --- | --- |
| negative, 34 significant digits, highest digit exponent `-6176` | 6212 bytes |
| positive, 34 significant digits, highest digit exponent `6144` | 6145 bytes |

The lexical validator runs before the decimal.js constructor, and bounds are checked before canonical rendering. Bare `toFixed()` is therefore only the final non-exponent renderer, not the precision or resource guard. [decimal.js API reference](https://mikemcl.github.io/decimal.js/)

### Closed — stable identity and failures

`FinancialValueEnvelope v1` now makes the value, unit/currency, decimal context, quantization status/plan/rule evidence and provenance part of semantic identity. Missing/unknown/unsupported are explicit no-value states, not aliases for zero.

`FinanceDecimalError v1` fixes stable codes for lexical/canonical/range, context overflow/underflow, divide-by-zero, invalid operation, rule failure, quantization overflow and projection loss; retryability, persistence/isolation and Gate impact are required per code. The conformance manifest binds the source, context, schema, plans/rules, WIT, sort key, display/projection and vector/oracle digests. Its corpus explicitly covers 34/35-digit and exponent boundaries, intermediate values, signed zero and stable failures.

That is sufficient architecture-level error semantics. Implementation evidence remains correctly gated; adoption of AD-31 does not itself authorize sandbox or later-stage capability.

## Exact package verification

### `decimal.js@10.6.0` — PASS

As of 2026-08-28, 10.6.0 remains npm `latest`. The Stack version, AD-31 version and npm artifact agree. [npm package](https://www.npmjs.com/package/decimal.js?activeTab=versions)

AD-31 records the correct npm integrity:

```text
sha512-YpgQiITW3JXGntzdUmyUR1V812Hn8T1YVXhCu+wO3OpS4eU9l4YdD3qjyiKdV6mvV29zapkMeD390UVEf2lkUg==
```

[Exact npm registry metadata](https://registry.npmjs.org/decimal.js/10.6.0)

The exact package accepted all frozen clone settings:

| Setting | Observed |
| --- | --- |
| `precision` | 34 |
| `rounding` | `ROUND_HALF_EVEN`, numeric value 6 |
| `minE` / `maxE` | `-9000000000000000` / `9000000000000000` |
| `toExpNeg` / `toExpPos` | `-7` / `21` |
| `modulo` | `ROUND_DOWN`, numeric value 1 |
| `crypto` | `false` |

Independent clone configuration is supported, all calculations return according to the clone's significant-digit precision/rounding, and bare `toFixed()` always emits normal notation. [upstream README/configuration](https://github.com/MikeMcl/decimal.js), [10.6.0 source](https://github.com/MikeMcl/decimal.js/blob/master/decimal.mjs)

The architecture correctly prevents other packages from receiving the mutable constructor/instances and binds the exact package artifact plus allowed wrapper operations in `DecimalContextManifest v1`.

### `lossless-json@4.3.1` — PASS

As of 2026-08-28, 4.3.1 exists and is npm `latest`. The Stack and AD-31 agree. [npm package](https://www.npmjs.com/package/lossless-json?activeTab=versions)

AD-31 records the correct npm integrity:

```text
sha512-SqD/Bg3ZfltBJ2Z14hJ/BihnvtV553WO4g9/ePtlp4lrnl9jF3AdIJt53A/Wkg/0Li+LMfxaBqgx1MiFZdQlpQ==
```

[Exact npm registry metadata](https://registry.npmjs.org/lossless-json/4.3.1)

The selected library fits `LosslessNumericIngress v1`. Its parser preserves numeric text in `LosslessNumber`, and its `parseNumber` callback receives the raw numeric token as a string. An exact 4.3.1 probe returned these callback inputs unchanged:

```text
2.370
9123372036854000123
2.3e+500
-0
```

No JavaScript `number` conversion occurred. The architecture then performs lexical exponent expansion and the same 34-digit/exponent/output validation, or rejects the field. That is consistent with the upstream API. [lossless-json upstream documentation](https://github.com/josdejong/lossless-json)

The architecture also correctly refuses any SDK/field that exposes only binary float with no raw token or exact integer representation; `number → String` is not accepted as recovery.

## TypeScript/toolchain fit

### PASS

Both exact packages include TypeScript declarations and ESM entry points. An isolated TypeScript 7.0.2 strict probe with `moduleResolution: bundler` successfully compiled:

- default `Decimal` import;
- the complete frozen clone configuration;
- `ROUND_HALF_EVEN` and `ROUND_DOWN` constants;
- `lossless-json` `parse`, `ParseOptions` and string-valued `parseNumber`; and
- `toFixed()` canonical output typing.

There were no diagnostics. The runtime probes also completed under the selected Node 24 line. No package requires TypeScript compiler APIs removed in TypeScript 7.

## License and supply chain

### PASS

Both packages are MIT licensed and compatible with TickDeck's Apache-2.0 distribution when their copyright/permission notices are retained. [decimal.js license](https://github.com/MikeMcl/decimal.js/blob/master/LICENCE.md), [lossless-json license](https://github.com/josdejong/lossless-json/blob/main/LICENSE)

Both exact npm artifacts have zero runtime dependencies and no install/postinstall hook. The exact isolated install reported no npm-audit vulnerability on 2026-08-28. Decimal.js contains six published files; lossless-json contains 68. Exact integrity, lockfile, Release Manifest artifact hash, third-party notices and reviewed upgrades remain necessary and are already required by the architecture.

Each npm package currently has one listed maintainer. This is a non-blocking concentration advisory, not an incompatibility. The pinned artifact digest, import confinement, SBOM/NOTICE, clean-install and conformance controls are proportionate mitigations.

## TC39 / Decimal128 claim discipline

### PASS

AD-31 explicitly states that its custom contract is **not** a TC39 Decimal or Decimal128 compatibility claim. This is correct.

The current TC39 Decimal proposal remains Stage 1 and is based on the IEEE Decimal128 data model, but Stage 1 is not a deployable standard baseline. Decimal.js is arbitrary precision with configurable exponent behavior and is not a TC39/Decimal128 polyfill. TickDeck's chosen 34-digit custom value envelope, special-value rejection, exponent range and operation-rounding contract must therefore stand on its own vectors, as the updated architecture now requires. [official TC39 Decimal draft](https://tc39.es/proposal-decimal/), [proposal repository/status](https://github.com/tc39/proposal-decimal)

No future native Decimal migration is implied or pre-authorized.

## Final clarification confirmation

The two previous non-blocking advisories are now closed in the current AD-31:

1. **Guard precision scope — closed:** the rule explicitly prohibits only caller/wrapper use of extra guard precision across declared primitive operations, fused operations or expression reordering. It expressly permits `decimal.js` to use temporary internal precision to correctly round one primitive. This matches the pinned implementation and removes the prior wording ambiguity without weakening the per-primitive 34-digit half-even contract.
2. **Ingress resource envelope — closed:** each Connector manifest must now set finite response-byte, JSON-nesting-depth and token-count limits; the Broker enforces them before complete lossless parsing, and unlimited adapter defaults are forbidden. This closes the in-memory parser resource-control gap at the architecture boundary.

There are no residual Critical, High or Medium findings. The one-listed-maintainer concentration for each package remains an informational supply-chain observation already mitigated by exact integrity, import confinement, SBOM/NOTICE, clean-install and conformance controls; it does not block this Gate.

## Gate disposition

**PASS for the final reality/version/supply-chain lens.**

The exact decimal.js and lossless-json pins, integrities, APIs, TypeScript fit, licenses and supply-chain shape are verified. The 34-digit domain now closes ingress, resource-bounded lossless parsing, each primitive result, canonical output, persistence/digest, stable failures and cross-surface conformance. Caller/wrapper guard-precision semantics are explicit, and the architecture makes no false TC39/Decimal128 promise. Remaining work is implementation evidence behind the existing Gates, not an unresolved architecture/currentness defect.
> [!WARNING]
> **SUPERSEDED（2026-08-28，TypeScript compatibility）。** 本文件保留为历史最终记录；其中 TypeScript 7.0.2 兼容性结论已由 TypeScript 6.0.3 复核替代，不得用于 Story 1.1 或后续 Gate。当前权威证据是 `review-update-typescript-6.0.3-final.md`。
