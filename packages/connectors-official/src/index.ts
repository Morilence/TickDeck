import { structuralSeed as brokerSeed } from '@tickdeck/connectors-core';

const brokerSeedText = typeof brokerSeed === 'string' ? brokerSeed : 'invalid-structural-seed';

export const structuralSeed = `@tickdeck/connectors-official:S0-V:${brokerSeedText}`;
