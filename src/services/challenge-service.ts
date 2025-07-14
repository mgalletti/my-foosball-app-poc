import { Challenge } from '../models/challenges.js';
import { Place } from '../models/places.js';
import { Player } from '../models/players.js';
import { ChallengeRepository } from '../repositories/repository-interfaces.js';
import { ChallengeDataObject } from '../schemas/challenge-schema.js';
import { PlaceDataObject } from '../schemas/place-schema.js';
import { PlayerDataObject } from '../schemas/player-schema.js';

export class ChallengeService {
  private challengeDB: ChallengeRepository;

  constructor(challengeDB: ChallengeRepository) {
    this.challengeDB = challengeDB;
  }

  async createChallenge(challenge: ChallengeDataObject): Promise<Challenge> {
    return this.challengeDB.createChallenge(
      challenge.name,
      challenge.placeId,
      challenge.date,
      challenge.time,
      challenge.ownerId,
      challenge.status,
      challenge.playersId,
    );
  }

  async getChallenges(): Promise<Challenge[]> {
    return this.challengeDB.getAllChallenges();
  }

  async createPlace(place: PlaceDataObject): Promise<Place> {
    return this.challengeDB.createPlace(place.name, place.coordinates);
  }

  async getPlaces(): Promise<Place[]> {
    return this.challengeDB.getAllPlaces();
  }

  async createPlayer(player: PlayerDataObject): Promise<Player> {
    return this.challengeDB.createPlayer(player.name, player.expertise, player.points);
  }

  async getPlayers(): Promise<Player[]> {
    return this.challengeDB.getAllPlayers();
  }
}
