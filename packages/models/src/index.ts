import { structuralSeed as brokerSeed } from '@tickdeck/connectors-core';

const brokerSeedText = typeof brokerSeed === 'string' ? brokerSeed : 'invalid-structural-seed';

export const structuralSeed = `@tickdeck/models:S0-V:${brokerSeedText}`;
