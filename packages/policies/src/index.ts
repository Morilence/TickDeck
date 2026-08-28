export const structuralSeed = '@tickdeck/policies:S0-V';

export function isS0VStage(stage: string): stage is 'S0-V' {
  return stage === 'S0-V';
}
