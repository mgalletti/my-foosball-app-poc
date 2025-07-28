import { CommonAttributes } from './common.js';
import { Place } from './places.js';
import { Player } from './players.js';

export enum ChallengeStatus {
  OPEN = 'OPEN',
  ACTIVE = 'ACTIVE',
  DROPPED = 'DROPPED',
  TERMINATED = 'TERMINATED',
}

export enum ChallengeTime {
  MORNING = 'MORNING',
  AFTERNOON = 'AFTERNOON',
  EVENING = 'EVENING',
  NIGHT = 'NIGHT',
}

export interface Challenge extends CommonAttributes {
  place: Place;
  status: ChallengeStatus;
  date: Date;
  time: ChallengeTime;
  owner: Player;
  players: Player[];
}
