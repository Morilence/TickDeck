# Reviewer Gate — Desktop Delivery, Bootstrap & Current Technology

- Reviewed artifact: `ARCHITECTURE-SPINE.md`, current working-tree version, especially AD-30 and Stack
- Review date: 2026-08-28 (Asia/Shanghai)
- Lens: exact Tauri versions, cross-package compatibility, sidecar and remote-WebView fit, system WebViews, package formats, platform signatures, and whether the claimed bootstrap/update design is implementable with the named technology
- Evidence policy: official Tauri documentation/source, crates.io/npm registries, Apple Developer, Microsoft Learn, and AppImage project documentation only
- Verdict: **FAIL — 0 Critical, 2 High, 1 Medium.** The Tauri versions and thin-shell approach are current and technically compatible; the adopted cross-platform bootstrap/update topology and custom trust protocol are not yet sufficiently specified to be treated as resolved.

## Critical

None.

## High

### H-01 — The common `bootstrap + versions + current pointer` updater is not compatible as written with all three selected desktop envelopes

**Where:** AD-30, especially `ARCHITECTURE-SPINE.md:362-364`.

AD-30 simultaneously fixes:

1. `bootstrap + versions/<release-id>/<profile payload> + atomic current pointer` as the distribution layout;
2. AppImage, signed/notarized macOS DMG app, and Windows NSIS as the desktop envelopes;
3. `product-supervisor` as the only install/update state machine; and
4. the same payload digest inside both headless and desktop artifacts.

Items 1-4 can preserve one logical release contract, but they cannot use one unexplained writable on-disk layout across the selected desktop formats:

- An AppImage mounts its embedded filesystem read-only when executed. A `versions/` store inside it cannot be staged or switched in place. [AppImage runtime architecture](https://docs.appimage.org/introduction/software-overview.html)
- Apple states that signed bundles must be treated as read-only; modifying nested code or resources after signing breaks the signature seal. A writable `versions/` directory inside `TickDeck.app` is therefore not a valid update store for a signed/notarized DMG installation. [Apple TN2206](https://developer.apple.com/library/archive/technotes/tn2206/_index.html)
- A standard Windows user cannot normally write into `Program Files`; an NSIS machine-wide install cannot assume the running app can stage and atomically replace arbitrary contents there without installer/elevation semantics. [Microsoft UAC guidance](https://learn.microsoft.com/en-us/windows/win32/dxtecharts/user-account-control-for-game-developers)
- Tauri's official updater does not expose a generic cross-platform `versions/current` mechanism. It updates platform artifacts: AppImage on Linux, an app archive on macOS, and MSI/NSIS installers on Windows; Windows exits the application and launches the installer. [Tauri updater](https://v2.tauri.app/plugin/updater/)

If the versioned executable payload is instead stored outside the signed envelope, AD-30 must say so and define the new trust boundary: the external managed Node, server, worker and Rust executables are no longer automatically covered by the outer macOS app seal or Windows installer signature. The current text only says the **workspace data root** is outside the install directory; it does not locate or secure the executable version store.

**Required closure:** choose and document one implementable topology before AD-30 is considered fully resolved. The lowest-risk fit with the selected Tauri formats is:

- keep the product payload content-addressed and digest-identical across B/S and desktop;
- let headless B/S use a stable bootstrap plus external `versions/current` store;
- treat the desktop envelope as immutable signed code and replace the whole signed envelope with platform updater/installer semantics;
- let trusted Rust orchestrate drain, backup and health around that replacement, without exposing updater IPC to Web content; and
- define where rollback artifacts live and how macOS/Windows signatures are revalidated after rollback.

An external desktop payload store is still possible, but it needs an explicit per-executable signing, notarization/quarantine, writable-location, atomic-switch and relaunch design plus S0 evidence on all five profiles. The present artifact supplies none of that evidence.

### H-02 — The custom release-signature and key-rotation protocol is asserted without a concrete, verifiable technology contract

**Where:** AD-30 at `ARCHITECTURE-SPINE.md:364` and the Stack.

The architecture requires an embedded public key, mandatory signature verification, SHA-256, and old/new-key overlap, but it does not name:

- the signature scheme and verification crate;
- the exact signed bytes or canonical manifest representation;
- how release ID, target profile, payload digest, artifact digest, bootstrap compatibility and key epoch are bound together;
- anti-rollback/downgrade behavior;
- signature/key IDs and revocation behavior; or
- whether the desktop envelope, the inner payload, the Release Manifest, or all three carry independently verified signatures.

Tauri's updater cannot be cited as implicit proof of this custom protocol. Its official implementation requires a non-disableable update signature and currently verifies artifacts with `minisign_verify`, but AD-30 explicitly gives update authority to `product-supervisor` and also covers headless B/S archives that Tauri bundler does not manage. [Tauri updater signing contract](https://v2.tauri.app/plugin/updater/), [official updater source](https://github.com/tauri-apps/plugins-workspace/blob/v2/plugins/updater/src/updater.rs)

SHA-256 alone proves integrity only after an authentic digest is known; it does not authenticate the artifact. “Old/new key overlap” also does not by itself prevent a valid old signed manifest from being replayed.

**Required closure:** adopt an exact signed Release Manifest protocol and verifier shared by bootstrap/product-supervisor. It must bind the target profile and every artifact/payload digest, reject mix-and-match, define monotonic release/key policy and make downgrade an explicit recovery action. If the Tauri updater's Minisign artifacts are reused for desktop, state that boundary explicitly and separately define how the same release identity authenticates headless archives. Pin the verifier in Cargo.lock and prove corrupt, wrong-profile, old-key, rollback and partial-download fixtures before enabling update.

## Medium

### M-01 — Linux ARM64 AppImage is feasible, but the build path is a real release prerequisite rather than a generic cross-compile

AD-30 names Linux x64 and ARM64 AppImage. Tauri supports this output, but the official documentation states that the underlying `linuxdeploy` path does not cross-compile ARM AppImages; ARM64 requires an ARM machine/runner or emulation. It also requires building on the oldest intended Linux baseline that supplies WebKitGTK 4.1 to avoid accidentally raising the glibc floor. [Tauri AppImage limitations](https://v2.tauri.app/distribute/appimage/)

**Required closure:** the S0 Release Profile must name a native ARM64 runner (or an explicitly accepted emulator path), base image, WebKitGTK package source and glibc floor. “Five profiles in CI” is not enough evidence until the ARM64 AppImage is built and run on the frozen minimum profile.

## Confirmed current technology fit

### Exact Tauri versions and compatibility — PASS

Live official registry metadata on 2026-08-28 confirms:

| Component | AD-30 / Stack | Official current stable | Fit |
| --- | --- | --- | --- |
| `tauri` core | 2.11.5 | 2.11.5 | PASS |
| `@tauri-apps/cli` / `tauri-cli` | 2.11.4 | 2.11.4 | PASS |
| `tauri-bundler` | 2.9.4 | 2.9.4 | PASS |

The official crates.io dependency metadata for `tauri-cli@2.11.4` requires `tauri-bundler ^2.9.4`, so the exact 2.9.4 pin is within the CLI's declared compatibility range. The differing patch numbers are not evidence of a mismatch. [tauri 2.11.5](https://crates.io/crates/tauri/2.11.5), [tauri-cli 2.11.4](https://crates.io/crates/tauri-cli/2.11.4), [tauri-bundler 2.9.4](https://crates.io/crates/tauri-bundler/2.9.4), [tauri-cli dependency metadata](https://crates.io/api/v1/crates/tauri-cli/2.11.4/dependencies)

These pins still need Cargo.lock and artifact hashes once code exists. Registry currentness does not substitute for a built five-profile envelope or transitive security audit.

### Target-triple sidecar — PASS with packaging evidence deferred

Tauri officially supports embedding external binaries through `bundle.externalBin`; each architecture uses a binary named with the Rust target-triple suffix. That directly fits the decision to package `product-supervisor` as a target-specific sidecar and avoids requiring a system Node/Wasmtime/compiler. [Tauri external binaries](https://v2.tauri.app/develop/sidecar/)

The source artifact must still prove that the sidecar contains or can locate the **same canonical product payload digest** as the headless archive. Tauri only guarantees sidecar bundling/naming; it does not prove TickDeck's payload equivalence, process-tree supervision or update state machine.

### Loopback SPA with no Tauri IPC — PASS in principle

Tauri can navigate a WebView to an HTTP URL, and its capability model keeps APIs restricted to bundled code unless remote access is explicitly granted. Therefore a loopback-served SPA with no remote capability can remain an ordinary HTTP client while trusted Rust owns window/bootstrap events. [Tauri capabilities and remote API access](https://v2.tauri.app/security/capabilities/), [Tauri WebView API](https://docs.rs/tauri/2.11.5/tauri/webview/struct.Webview.html)

Tauri 2.11.5 also exposes Rust-side `Webview::set_cookie` and `navigate`, so AD-6's native handoff of an HttpOnly loopback cookie is not relying on a nonexistent API. The API documentation notes platform-specific behavior and cookie-API stability caveats, so S0 must test host-only, HttpOnly, SameSite=Strict, expiry/revocation and JavaScript invisibility on all five system WebViews. No remote capability file should match the loopback origin.

### System WebViews — PASS, with one installer configuration still to freeze

The architecture is correct that Tauri uses system WebViews: WebView2 on Windows, WKWebView on macOS and WebKitGTK on Linux. Tauri does not give the five profiles one identical browser engine, so the existing real-system-WebView test matrix is necessary. [Tauri WebView versions](https://v2.tauri.app/reference/webview-versions/)

For Windows NSIS, the architecture must freeze `webviewInstallMode` and `minimumWebview2Version`. Tauri's default installer downloads and runs the WebView2 bootstrapper when needed; `embedBootstrapper`, `offlineInstaller`, `fixedVersion` and `skip` have materially different network, size and maintenance behavior. Since TickDeck excludes offline product mode, the default may be acceptable, but it must not remain an implicit installer side effect. [Tauri Windows installer](https://v2.tauri.app/distribute/windows-installer/)

### Package formats and platform signatures — PASS as available outputs, not as a common updater proof

- Tauri supports Linux AppImage, Windows NSIS and macOS DMG outputs. [Tauri distribution overview](https://v2.tauri.app/distribute/)
- macOS direct distribution requires code signing and notarization; a DMG is a supported wrapper. [Tauri DMG](https://v2.tauri.app/distribute/dmg/)
- Windows NSIS code signing is supported, but ordinary code signing does not guarantee an immediate clean SmartScreen reputation; AD-30 does not currently overclaim that outcome. [Tauri Windows signing](https://v2.tauri.app/distribute/sign/windows/)
- AppImage signing is available, but Linux execution does not thereby gain the same OS-enforced trust behavior as macOS notarization. Bootstrap-level signature verification is still required. [Tauri Linux signing](https://v2.tauri.app/distribute/sign/linux/)

These facts establish that the selected envelope formats exist. They do not close H-01 or H-02.

## Named technology fit asserted without present evidence

The following claims are design intentions, not capabilities established by Tauri or by current repository evidence:

1. one cross-platform `atomic current pointer` primitive with correct crash semantics;
2. `product-supervisor` as the sole installer/updater across AppImage, NSIS and signed macOS app replacement;
3. a common signature/key-overlap protocol for both headless and desktop artifacts;
4. byte/digest equivalence of the payload after Tauri sidecar resource placement;
5. all-five-WebView bootstrap-cookie behavior; and
6. Linux ARM64 AppImage CI/build feasibility on the eventual selected runner.

There is currently no `apps/desktop`, Cargo manifest/lockfile, Tauri configuration, sidecar artifact, signed package, release manifest or bootstrap spike in the repository to prove these claims. They must remain S0 evidence obligations and cannot authorize S1-S5 capability.

## Gate disposition

**FAIL for the current-technology/desktop-update lens until H-01 and H-02 are resolved in the architecture contract.**

The selected Tauri core/CLI/bundler pins, thin shell, target-triple sidecar, loopback SPA, denied remote IPC, system WebViews and chosen package formats are all credible. The failure is narrower but load-bearing: AD-30 currently treats an unchosen executable-store/update topology and an unspecified custom signature protocol as an adopted, cross-platform implementation contract. Correct those boundaries, then require real install, bootstrap, update, rollback, recovery, signature-failure and uninstall-retain-data evidence on all five Release Profiles.
