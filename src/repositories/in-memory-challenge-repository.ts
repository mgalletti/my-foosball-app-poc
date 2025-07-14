import { Challenge, ChallengeStatus } from '../models/challenges.js';
import { BaseAdapter } from './adapters/base-adapter.js';
import { Coordinates, Place } from '../models/places.js';
import { ChallengeTime } from '../models/challenges.js';
import { Expertise, Player } from '../models/players.js';
import { NotFoundError } from '../utils/exceptions.js';
import { ChallengeRepository } from './repository-interfaces.js';
import { InMemoryAdapter } from './adapters/in-memory-adapter.js';

export class InMemoryChallengeRepository implements ChallengeRepository {
  private challengeRepo: BaseAdapter<Challenge>;
  private placesRepo: BaseAdapter<Place>;
  private playersRepo: BaseAdapter<Player>;

  constructor() {
    this.challengeRepo = new InMemoryAdapter<Challenge>('Challenge');
    this.placesRepo = new InMemoryAdapter<Place>('Place');
    this.playersRepo = new InMemoryAdapter<Player>('Player');
    this.challengeRepo.initialize();
  }

  async createChallenge(
    name: string,
    placeId: string,
    date: Date,
    time: ChallengeTime,
    ownerId: string,
    status: ChallengeStatus = ChallengeStatus.ACTIVE,
    playersId?: string[],
  ): Promise<Challenge> {
    const place = await this.placesRepo.findById(placeId);
    if (!place) throw new NotFoundError('Place', placeId);
    const owner = await this.playersRepo.findById(ownerId);
    if (!owner) throw new NotFoundError('Player', ownerId);

    const players = playersId
      ? await Promise.all(
          playersId.map(async (id: string) => {
            const player = await this.playersRepo.findById(id);
            if (!player) {
              throw new NotFoundError('Player', id);
            }
            return player;
          }),
        )
      : undefined;

    const id = await this.challengeRepo.create({
      name: name,
      place: place,
      date: date,
      time: time,
      status: status,
      owner: owner,
      players: players,
    });
    const challenge = await this.challengeRepo.findById(id);
    if (!challenge) throw new NotFoundError('Challenge', id);

    return challenge;
  }

  async getAllChallenges(): Promise<Challenge[]> {
    return this.challengeRepo.findAll();
  }

  async createPlace(name: string, coordinates: Coordinates): Promise<Place> {
    const id = await this.placesRepo.create({
      name: name,
      coordinates: coordinates,
    });
    const place = await this.placesRepo.findById(id);
    if (!place) throw new NotFoundError('Place', id);

    return place;
  }

  async getAllPlaces(): Promise<Place[]> {
    return this.placesRepo.findAll();
  }

  async createPlayer(name: string, expertise: Expertise, points: number = 0): Promise<Player> {
    const id = await this.playersRepo.create({
      name: name,
      expertise: expertise,
      points: points,
    });
    const player = await this.playersRepo.findById(id);
    if (!player) throw new NotFoundError('Player', id);

    return player;
  }

  async getAllPlayers(): Promise<Player[]> {
    return this.playersRepo.findAll();
  }
}
