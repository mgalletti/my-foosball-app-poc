import { Challenge, ChallengeStatus, ChallengeTime } from '../models/challenges.js';
import { Coordinates, Place } from '../models/places.js';
import { Expertise, Player } from '../models/players.js';

export interface ChallengeRepository {
  createChallenge(
    name: string,
    placeId: string,
    date: Date,
    time: ChallengeTime,
    ownerId: string,
    status?: ChallengeStatus,
    playersId?: string[],
  ): Promise<Challenge>;

  getAllChallenges(): Promise<Challenge[]>;

  createPlace(name: string, coordinates: Coordinates): Promise<Place>;

  getAllPlaces(): Promise<Place[]>;

  createPlayer(name: string, expertise: Expertise, points: number): Promise<Player>;

  getAllPlayers(): Promise<Player[]>;
}
