import { CommonAttributes } from './common.js';
import { Place } from './places.js';
import { Player } from './players.js';

export enum ChallengeStatus {
  OPEN = 'Open',
  ACTIVE = 'Active',
  DROPPED = 'Dropped',
  TERMINATED = 'Terminated',
}

export enum ChallengeTime {
  MORNING = 'Morning',
  AFTERNOON = 'Afternoon',
  EVENING = 'Evening',
  NIGHT = 'Night',
}

export interface Challenge extends CommonAttributes {
  place: Place;
  status: ChallengeStatus;
  date: Date;
  time: ChallengeTime;
  owner: Player;
  players: Player[];
}
