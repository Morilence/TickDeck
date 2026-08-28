import { createHash } from 'node:crypto'
import { readFileSync, statSync } from 'node:fs'
import { basename, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const validatorPath = fileURLToPath(import.meta.url)
const here = dirname(validatorPath)
const root = resolve(here, '../../..')
const files = {
  prd: resolve(root, '_bmad-output/planning-artifacts/prds/prd-TickDeck-2026-08-27/prd.md'),
  addendum: resolve(root, '_bmad-output/planning-artifacts/prds/prd-TickDeck-2026-08-27/addendum.md'),
  design: resolve(root, '_bmad-output/planning-artifacts/ux-designs/ux-TickDeck-2026-08-27/DESIGN.md'),
  experience: resolve(root, '_bmad-output/planning-artifacts/ux-designs/ux-TickDeck-2026-08-27/EXPERIENCE.md'),
  architecture: resolve(root, '_bmad-output/planning-artifacts/architecture/architecture-TickDeck-2026-08-27/ARCHITECTURE-SPINE.md'),
  architectureReview: resolve(root, '_bmad-output/planning-artifacts/architecture/architecture-TickDeck-2026-08-27/reviews/review-update-architecture-consistency-final.md'),
  toolVersionReview: resolve(root, '_bmad-output/planning-artifacts/architecture/architecture-TickDeck-2026-08-27/reviews/review-update-tool-versions-final.md'),
  typescriptReview: resolve(root, '_bmad-output/planning-artifacts/architecture/architecture-TickDeck-2026-08-27/reviews/review-update-typescript-6.0.3-final.md'),
  downstreamChecklist: resolve(root, '_bmad-output/planning-artifacts/architecture/architecture-TickDeck-2026-08-27/DOWNSTREAM-UPDATE-CHECKLIST.md'),
  epics: resolve(root, '_bmad-output/planning-artifacts/epics.md'),
  sprintStatus: resolve(root, '_bmad-output/implementation-artifacts/sprint-status.yaml'),
  spec: resolve(here, 'SPEC.md'),
  index: resolve(here, 'contract-index.md'),
  validator: validatorPath,
}

const validRounds = new Set(['coherence', 'preservation', 'reviewer-gate'])
const round = process.argv[2]
if (!validRounds.has(round)) {
  console.error(JSON.stringify({ error: 'invalid_round', usage: 'node validate-spec.mjs coherence|preservation|reviewer-gate' }))
  process.exit(2)
}

const commonKeys = ['prd', 'addendum', 'design', 'experience', 'architecture', 'spec', 'index', 'validator']
const evidenceKeys = ['architectureReview', 'toolVersionReview', 'typescriptReview', 'downstreamChecklist']
const roundKeys = {
  coherence: commonKeys,
  preservation: [...commonKeys, ...evidenceKeys],
  'reviewer-gate': [...commonKeys, ...evidenceKeys, 'epics', 'sprintStatus'],
}
const snapshots = {}
try {
  for (const key of roundKeys[round]) {
    if (!statSync(files[key]).isFile()) throw new Error(`${key} is not a regular file: ${files[key]}`)
    const bytes = readFileSync(files[key])
    snapshots[key] = {
      bytes,
      text: new TextDecoder('utf-8', { fatal: true }).decode(bytes),
      digest: createHash('sha256').update(bytes).digest('hex'),
    }
  }
} catch (error) {
  console.error(JSON.stringify({ round, verdict: 'FAIL', error: 'input_unreadable', detail: String(error) }, null, 2))
  process.exit(1)
}

const text = Object.fromEntries(Object.entries(snapshots).map(([key, snapshot]) => [key, snapshot.text]))
const count = (value, pattern) => (value.match(pattern) || []).length
const digest = (key) => snapshots[key].digest
const stripQuotes = (value) => value.replace(/^(['"])(.*)\1$/, '$2')
const parseFrontmatter = (value) => {
  const lines = value.split('\n')
  if (lines[0] !== '---') throw new Error('missing frontmatter opener')
  const end = lines.indexOf('---', 1)
  if (end < 0) throw new Error('missing frontmatter closer')
  const result = {}
  let listKey = null
  for (const line of lines.slice(1, end)) {
    const list = line.match(/^\s+-\s+(.+)$/)
    if (list) {
      if (!listKey || !Array.isArray(result[listKey])) throw new Error(`orphan frontmatter list item: ${line}`)
      result[listKey].push(stripQuotes(list[1].trim()))
      continue
    }
    const field = line.match(/^([A-Za-z][A-Za-z0-9_-]*):(?:\s*(.*))?$/)
    if (!field) throw new Error(`invalid frontmatter line: ${line}`)
    const [, key, raw = ''] = field
    if (Object.hasOwn(result, key)) throw new Error(`duplicate frontmatter key: ${key}`)
    result[key] = raw ? stripQuotes(raw.trim()) : []
    listKey = raw ? null : key
  }
  return result
}
const frontmatterOrNull = (value) => {
  try {
    return parseFrontmatter(value)
  } catch {
    return null
  }
}
const topLevelFrontmatterScalar = (value, key) => {
  const lines = value.split('\n')
  const end = lines[0] === '---' ? lines.indexOf('---', 1) : -1
  if (end < 0) return null
  const matches = lines.slice(1, end).map((line) => line.match(new RegExp(`^${key}:\\s*(.+)$`))).filter(Boolean)
  return matches.length === 1 ? stripQuotes(matches[0][1].trim()) : null
}
const section = (value, heading) => {
  const marker = `${heading}\n`
  const start = value.indexOf(marker)
  if (start < 0) return ''
  const level = heading.match(/^#+/)?.[0].length || 1
  const rest = value.slice(start + marker.length)
  const next = rest.search(new RegExp(`^#{1,${level}}\\s`, 'm'))
  return next < 0 ? rest : rest.slice(0, next)
}
const exact = (actual, expected) =>
  actual.length === expected.length && actual.every((value, index) => value === expected[index])
const numberRange = (prefix, from, to, width = 0) =>
  Array.from({ length: to - from + 1 }, (_, index) => `${prefix}${String(from + index).padStart(width, '0')}`)
const parseDigestTable = (value, heading, expectedHeader) => {
  const lines = section(value, heading).split('\n')
  const start = lines.indexOf(expectedHeader)
  const tableLines = start < 0 ? [] : lines.slice(start, start + lines.slice(start).findIndex((line, index) => index > 1 && !line.startsWith('|')))
  const rows = []
  let valid = tableLines[0] === expectedHeader && /^\|[-|]+\|$/.test((tableLines[1] || '').replace(/ /g, ''))
  for (const line of tableLines.slice(2)) {
    const match = line.match(/^\| `([^`]+)` \| `([a-f0-9]{64})` \|$/)
    if (!match) valid = false
    else rows.push({ name: match[1], hash: match[2] })
  }
  const names = rows.map(({ name }) => name)
  valid &&= new Set(names).size === names.length
  return { valid, rows, values: Object.fromEntries(rows.map(({ name, hash }) => [name, hash])) }
}
const firstContentLine = (value, heading) => section(value, heading).split('\n').map((line) => line.trim()).find(Boolean) || ''
const reviewVerdictToken = (value) => {
  if (count(value, /^## Verdict$/gm) !== 1) return null
  const line = firstContentLine(value, '## Verdict')
  const match = line.match(/^(\*\*.+?\*\*)/)
  const remainder = line.slice(match?.[1].length || 0)
  if (!match || /\*\*(?:FAIL|BLOCKED|SUPERSEDED)\b|(?:^|[.;。；]\s*)(?:FAIL|BLOCKED|SUPERSEDED)\b/i.test(remainder)) return null
  return match[1]
}
const isRegularFile = (path) => {
  try {
    return statSync(path).isFile()
  } catch {
    return false
  }
}
const ordered = (value, terms) => {
  let cursor = 0
  for (const term of terms) {
    const next = value.indexOf(term, cursor)
    if (next < 0) return false
    cursor = next + term.length
  }
  return true
}
const assertAll = (round, checks) => {
  const failed = Object.entries(checks).filter(([, passed]) => !passed).map(([name]) => name)
  const artifactDigests = Object.fromEntries(
    ['spec', 'index', 'validator'].filter((key) => snapshots[key]).map((key) => [basename(files[key]), digest(key)]),
  )
  console.log(JSON.stringify({ round, verdict: failed.length ? 'FAIL' : 'PASS', artifactDigests, checks, failed }, null, 2))
  if (failed.length) process.exitCode = 1
}

const expectedSpecCompanions = [
  'contract-index.md',
  '../../planning-artifacts/prds/prd-TickDeck-2026-08-27/prd.md',
  '../../planning-artifacts/prds/prd-TickDeck-2026-08-27/addendum.md',
  '../../planning-artifacts/ux-designs/ux-TickDeck-2026-08-27/DESIGN.md',
  '../../planning-artifacts/ux-designs/ux-TickDeck-2026-08-27/EXPERIENCE.md',
  '../../planning-artifacts/architecture/architecture-TickDeck-2026-08-27/ARCHITECTURE-SPINE.md',
]
const expectedArchitectureCompanions = [
  'reviews/review-update-architecture-consistency-final.md',
  'reviews/review-update-tool-versions-final.md',
  'reviews/review-update-typescript-6.0.3-final.md',
  'DOWNSTREAM-UPDATE-CHECKLIST.md',
]
const expectedStages = ['S0-V', 'S0', 'S1', 'S2', 'S3', 'S4', 'S5']
const expectedCapabilities = numberRange('CAP-', 1, 11)
const specFrontmatter = frontmatterOrNull(text.spec)
const designFrontmatter = frontmatterOrNull(text.design)
const experienceFrontmatter = frontmatterOrNull(text.experience)
const architectureFrontmatter = frontmatterOrNull(text.architecture)
const capabilityText = section(text.spec, '## Capabilities')
const capabilityStarts = [...capabilityText.matchAll(/^- \*\*(CAP-\d+) —/gm)]
const capabilityBlocks = capabilityStarts.map((match, index) => ({
  id: match[1],
  body: capabilityText.slice(match.index, capabilityStarts[index + 1]?.index ?? capabilityText.length),
}))
const assumptionIds = [...section(text.spec, '## Assumptions').matchAll(/^- \*\*(A-\d{2}):\*\*/gm)].map((match) => match[1])
const stageRows = [...section(text.index, '## Stage Gate matrix').matchAll(/^\| (S0-V|S[0-5]) \|/gm)].map((match) => match[1])

const evaluateCoherence = () => {
  const open = text.spec.split('## Open Questions')[1] || ''
  const nonGoals = (text.spec.split('## Non-goals')[1] || '').split('## Success signal')[0] || ''
  return {
    kernel_capabilities: exact(capabilityBlocks.map(({ id }) => id), expectedCapabilities),
    capability_intent_success_pairs: capabilityBlocks.every(
      ({ body }) => count(body, /^  - \*\*intent:\*\*/gm) === 1 && count(body, /^  - \*\*success:\*\*/gm) === 1,
    ),
    dependency_order:
      exact(stageRows, expectedStages) &&
      [text.spec, text.prd, text.architecture].every((value) => ordered(value, expectedStages)),
    active_assumptions: exact(assumptionIds, ['A-01', 'A-02', 'A-05']),
    active_open_items:
      count(open, /^- \*\*/gm) === 7 &&
      ['OQ-03', 'OQ-04', 'OQ-05', 'OQ-06', '平台基线', 'Vault', '适配清单'].every((item) => open.includes(item)) &&
      !open.includes('十进制'),
    retired_items_preserved:
      ['Retired A-03', 'Retired A-04 / SM-09', 'OQ-07 备份维护者 | **Retired'].every((item) => text.index.includes(item)),
    free_source_is_default:
      [text.prd, text.addendum, text.spec, text.index].every((value) => value.includes('免费') && value.includes('默认')),
    dual_entrypoint_scope:
      [text.prd, text.addendum, text.experience, text.architecture, text.spec, text.index].every(
        (value) => value.includes('B/S') && value.includes('桌面'),
      ),
    desktop_not_excluded: !nonGoals.includes('桌面客户端'),
    no_later_stage_authorization:
      [text.prd, text.experience, text.architecture, text.spec, text.index].every(
        (value) => value.includes('S0') && value.includes('S5'),
      ) && text.spec.includes('不提前授权 S1–S5 能力'),
    release_and_attach_contract:
      ['UpgradeCoordinator', 'WorkspaceIdentity', 'UpgradeIntent'].every((term) => text.architecture.includes(term)) &&
      text.addendum.includes('本地签名 release set') &&
      text.experience.includes('不自动联网检查或下载'),
    decimal_contract:
      ['AD-31', '`decimal.js` 10.6.0', '`lossless-json` 4.3.1', 'precision=34', 'ROUND_HALF_EVEN(6)', 'FinancialValueEnvelope v1', 'ContextRounding', 'DomainQuantization', 'DecimalSortKey v1', 'host-issued opaque resource'].every((term) =>
        text.architecture.includes(term),
      ) && text.index.includes('权威十进制实现 | **Resolved 2026-08-28**'),
    engineering_quality_contract:
      [
        'AD-32',
        'Node.js LTS | 24.20.0',
        'pnpm | 11.24.0',
        'TypeScript | 6.0.3',
        '16 个直接 pnpm member',
        'runtime',
        'type-only',
        'build/codegen',
        'test/dev',
        'canonical ignore',
        'workspace-check.mjs',
        'dependency-build-check.mjs',
        'generated-check.mjs',
        'Rust | 1.98.0',
      ].every((term) => text.architecture.includes(term)) &&
      ['AD-1–AD-32', 'TypeScript 6.0.3', '根级跨语言工程质量', 'workspace policy', 'canonical ignores', 'validators', 'required checks', '不等于注册产品 capability', '不关闭 OQ-06'].every((term) =>
        text.spec.includes(term),
      ) &&
      [
        'AR-AD-32',
        'AR-STACK-01',
        'Node.js 24.20.0',
        'pnpm 11.24.0',
        'TypeScript 6.0.3',
        'Rust 1.98.0',
        'apps/web',
        'tools/component-compiler',
        'tools/quality',
        'node-runtime',
        'neutral-shared',
        'node-config-only',
        'test-overlay',
        'workspace-check.mjs',
        'dependency-build-check.mjs',
        'generated-check.mjs',
        '`lint`',
        '`format-check`',
        '`typecheck`',
        '`build`',
        '`test`',
        'Story 2.9/5.2',
      ].every((term) => text.index.includes(term)),
    final_ux_and_architecture:
      topLevelFrontmatterScalar(text.design, 'status') === 'final' &&
      topLevelFrontmatterScalar(text.experience, 'status') === 'final' &&
      architectureFrontmatter?.status === 'final',
    typescript_version_unambiguous: text.spec.includes('TypeScript 6.0.3') && !text.spec.includes('TypeScript 7'),
  }
}

const coherence = () => assertAll('Coherence', evaluateCoherence())

const evaluatePreservation = () => {
  const sourceNames = ['prd.md', 'addendum.md', 'DESIGN.md', 'EXPERIENCE.md', 'ARCHITECTURE-SPINE.md']
  const sourceTable = parseDigestTable(text.index, '## Frozen source snapshot', '| Adopted companion | SHA-256 |')
  const sourceActual = {
    'prd.md': digest('prd'),
    'addendum.md': digest('addendum'),
    'DESIGN.md': digest('design'),
    'EXPERIENCE.md': digest('experience'),
    'ARCHITECTURE-SPINE.md': digest('architecture'),
  }
  const evidenceNames = [
    'review-update-architecture-consistency-final.md',
    'review-update-tool-versions-final.md',
    'review-update-typescript-6.0.3-final.md',
    'DOWNSTREAM-UPDATE-CHECKLIST.md',
  ]
  const evidenceTable = parseDigestTable(
    text.index,
    '### Architecture update evidence snapshot',
    '| Architecture-owned file | SHA-256 |',
  )
  const evidenceActual = {
    'review-update-architecture-consistency-final.md': digest('architectureReview'),
    'review-update-tool-versions-final.md': digest('toolVersionReview'),
    'review-update-typescript-6.0.3-final.md': digest('typescriptReview'),
    'DOWNSTREAM-UPDATE-CHECKLIST.md': digest('downstreamChecklist'),
  }
  const fr = [...text.prd.matchAll(/^- \*\*(FR-\d{3})\b/gm)].map((match) => match[1])
  const nfr = [...text.prd.matchAll(/^- \*\*(NFR-\d{3})\b/gm)].map((match) => match[1])
  const ad = [...text.architecture.matchAll(/^### (AD-\d+) —/gm)].map((match) => match[1])
  const reviewedSpineDigest = text.architectureReview.match(/更新后 spine SHA-256：`([a-f0-9]{64})`/)?.[1]
  const kernelSections = ['Why', 'Capabilities', 'Constraints', 'Non-goals', 'Success signal', 'Assumptions', 'Open Questions']
  return {
    spec_companions_exact:
      exact(specFrontmatter?.companions || [], expectedSpecCompanions) &&
      expectedSpecCompanions.every((path) => isRegularFile(resolve(here, path))),
    architecture_companions_exact: exact(architectureFrontmatter?.companions || [], expectedArchitectureCompanions),
    frozen_source_hashes:
      sourceTable.valid &&
      exact(sourceTable.rows.map(({ name }) => name), sourceNames) &&
      Object.entries(sourceActual).every(([name, hash]) => sourceTable.values[name] === hash),
    architecture_evidence_hashes:
      evidenceTable.valid &&
      exact(evidenceTable.rows.map(({ name }) => name), evidenceNames) &&
      Object.entries(evidenceActual).every(([name, hash]) => evidenceTable.values[name] === hash),
    architecture_review_binds_current_spine: reviewedSpineDigest === digest('architecture'),
    functional_requirements: exact(fr, numberRange('FR-', 1, 100, 3)),
    nonfunctional_requirements: exact(nfr, numberRange('NFR-', 1, 40, 3)),
    architecture_decisions: exact(ad, numberRange('AD-', 1, 32)),
    stage_gates: exact(stageRows, expectedStages) && expectedStages.every((stage) => text.prd.includes(stage)),
    measures_and_contract_ids:
      ['SM-00', 'SM-01', 'SM-01R', 'SM-02', 'SM-08', 'SM-10', 'SM-17', 'SM-C01', 'SM-C08'].every((id) => text.prd.includes(id)),
    assumption_and_question_history:
      ['A-01', 'A-02', 'A-03', 'A-04', 'A-05', 'OQ-01', 'OQ-02', 'OQ-03', 'OQ-04', 'OQ-05', 'OQ-06', 'OQ-07'].every(
        (id) => text.prd.includes(id) && text.index.includes(id),
      ),
    exclusions:
      ['实盘下单', 'ETF', '用户、组织、RBAC', '社交', '商用数据', '移动端验收'].every((term) => text.spec.includes(term)),
    ux_contract:
      ['Brand & Style', 'Colors', 'Typography', 'Components'].every((section) => text.design.includes(section)) &&
      ['Information Architecture', 'State Patterns', 'Risk Gate', 'Accessibility Floor', 'UJ-3'].every((section) => text.experience.includes(section)),
    kernel_shape: kernelSections.every((section) => text.spec.includes(`## ${section}`)),
    preservation_ledger: text.index.includes('## Preservation ledger') && text.index.includes('未丢弃任何 FR、NFR、Gate'),
    engineering_quality_handoff:
      text.index.includes('## S0-V engineering-quality and epics handoff') &&
      ['AR-AD-32', 'AR-STACK-01', 'TypeScript 6.0.3', 'workspace-check.mjs', 'dependency-build-check.mjs', 'generated-check.mjs', 'IMPLEMENTATION DEFERRED'].every((term) =>
        text.index.includes(term),
      ),
  }
}

const preservation = () => assertAll('Preservation', evaluatePreservation())

const reviewerGate = () => {
  const coherenceChecks = evaluateCoherence()
  const preservationChecks = evaluatePreservation()
  const architectureVerdict = reviewVerdictToken(text.architectureReview)
  const toolVersionVerdict = reviewVerdictToken(text.toolVersionReview)
  const typescriptVerdict = reviewVerdictToken(text.typescriptReview)
  assertAll('Reviewer Gate', {
    coherence_prerequisite: Object.values(coherenceChecks).every(Boolean),
    preservation_prerequisite: Object.values(preservationChecks).every(Boolean),
    architecture_consistency_final:
      architectureVerdict === '**PASS（架构基线）/ IMPLEMENTATION DEFERRED（Story 1.1）。**' &&
      text.architectureReview.includes('AD-1–AD-31 编号、规则和 capability ownership 未改写') &&
      text.architectureReview.includes('AD-32 只约束 S0-V 项目骨架') &&
      text.architectureReview.includes(`更新后 spine SHA-256：\`${digest('architecture')}\``),
    tool_versions_final:
      toolVersionVerdict === '**PASS.**' &&
      ['TypeScript', '6.0.3', 'Node.js 24.20.0', 'Rust `1.98.0`', '实际仓库尚无应用骨架'].every((term) =>
        text.toolVersionReview.includes(term),
      ),
    typescript_6_final:
      typescriptVerdict === '**PASS（架构基线）/ IMPLEMENTATION EVIDENCE DEFERRED（完整沙箱链）**' &&
      text.typescriptReview.includes('所有历史文档中“TypeScript 7.0.2 已验证”') &&
      text.typescriptReview.includes('不得用于 Story 1.1 或后续 Gate'),
    downstream_scope_preserved:
      text.downstreamChecklist.includes('不改变 CAP-1–CAP-11、产品范围、S0-V→S5 顺序') &&
      text.downstreamChecklist.includes('本次架构更新没有修改 `SPEC.md`、`contract-index.md`、`validate-spec.mjs`、`epics.md` 或 `sprint-status.yaml`') &&
      text.downstreamChecklist.includes('执行顺序不可交换：`bmad-spec` → `bmad-create-epics-and-stories` → `bmad-sprint-planning` → 首次 `bmad-build`'),
    spec_projection_current:
      text.spec.includes('AD-1–AD-32') &&
      text.spec.includes('TypeScript 6.0.3') &&
      text.index.includes('旧 TypeScript 7.0.2/“TS7-compatible”证据已 superseded') &&
      text.index.includes('**IMPLEMENTATION DEFERRED**'),
    capability_and_gate_scope_unchanged:
      exact(capabilityBlocks.map(({ id }) => id), expectedCapabilities) &&
      ordered(text.spec, expectedStages) &&
      text.spec.includes('不提前授权 S1–S5 能力'),
    epics_unchanged:
      digest('epics') === 'f6089c6174aca2a7e977f3b348c78f0182bc2decca6bb0b8679c61c2f4ba6d97',
    sprint_status_unchanged:
      digest('sprintStatus') === 'e9c7b2f96dd57726c36da8cf522c44ea5d9c60e53bb56badd8ab6270a46776da',
    downstream_handoff_absorbed:
      ['AR-AD-32', 'AR-STACK-01', 'Story 1.1 仍是唯一当前可执行 Story', '16 个直接 pnpm member', 'runtime、type-only、build/codegen、test/dev', 'HUSKY=0', 'Story 2.9/5.2'].every((term) =>
        text.index.includes(term),
      ),
  })
}

if (round === 'coherence') coherence()
else if (round === 'preservation') preservation()
else if (round === 'reviewer-gate') reviewerGate()
