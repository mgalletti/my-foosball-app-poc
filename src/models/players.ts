import { CommonAttributes } from './common.js';

export enum Expertise {
  NOVICE = 'NOVICE',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT',
}

export interface Player extends CommonAttributes {
  expertise: Expertise;
  points: number;
}
