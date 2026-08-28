import ts from 'typescript';

export const structuralSeed = '@tickdeck/component-compiler:S0-V';

export function probeTypeScriptSource(sourceText: string): readonly string[] {
  const result = ts.transpileModule(sourceText, {
    compilerOptions: { target: ts.ScriptTarget.ES2023 },
    fileName: 'probe.ts',
    reportDiagnostics: true,
  });
  return (result.diagnostics ?? []).map((diagnostic) => String(diagnostic.code));
}
