import { CommonAttributes } from './common.js';

export enum Expertise {
  NOVICE = 'Novice',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced',
  EXPERT = 'Expert',
}

export interface Player extends CommonAttributes {
  expertise: Expertise;
  points: number;
}
