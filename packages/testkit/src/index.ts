import { structuralSeed as contractsSeed } from '@tickdeck/contracts';
import { structuralSeed as coreSeed } from '@tickdeck/core';
import { structuralSeed as policiesSeed } from '@tickdeck/policies';

export const structuralSeed = '@tickdeck/testkit:S0-V';
export const upstreamSeeds = [contractsSeed, coreSeed, policiesSeed] as const;
