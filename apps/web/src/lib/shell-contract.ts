export const forbiddenFutureNavigation = [
  'screening',
  'agent',
  'sandbox',
  'chart',
  'alerts',
  'portfolio',
  'extensions',
] as const;

export function hasOnlyS0VNavigation(labels: readonly string[]): boolean {
  return labels.length === 1 && labels[0] === 'runtime-health';
}
