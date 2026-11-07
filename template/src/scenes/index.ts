import type React from 'react';
import { INK, PAPER } from '../lib';
import { Caret } from './line';
import { Opening } from './ring';
import { Construct } from './construct';
import { LogoSite } from './site';
import { Letters } from './letters';
import { AllBlocks } from './blocks';
import { LogoSwap } from './looks';
import { Final } from './final';

// Every scene, by the name the SCENES list in Refreshed.tsx uses. `bg` is the colour of the scene's first frame:
// the scene before it wipes to this colour, so a removed or reordered scene still hands over without a flash.
// A new scene goes here once, with its own file.
export const ALL_SCENES = {
  line: { Scene: Caret, bg: PAPER },
  ring: { Scene: Opening, bg: PAPER },
  construct: { Scene: Construct, bg: PAPER },
  site: { Scene: LogoSite, bg: PAPER },
  letters: { Scene: Letters, bg: PAPER },
  blocks: { Scene: AllBlocks, bg: INK }, // its first product view is dark
  looks: { Scene: LogoSwap, bg: INK }, // its first look is dark
  final: { Scene: Final, bg: PAPER },
} satisfies Record<string, { Scene: React.FC; bg: string }>;
