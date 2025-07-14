import { ChallengeStatus } from '../models/challenges.js';
import { NotFoundError } from '../utils/exceptions.js';
import { InMemoryAdapter } from './adapters/in-memory-adapter.js';
export class InMemoryChallengeRepository {
    constructor() {
        this.challengeRepo = new InMemoryAdapter('Challenge');
        this.placesRepo = new InMemoryAdapter('Place');
        this.playersRepo = new InMemoryAdapter('Player');
        this.challengeRepo.initialize();
    }
    async createChallenge(name, placeId, date, time, ownerId, status = ChallengeStatus.ACTIVE, playersId) {
        const place = await this.placesRepo.findById(placeId);
        if (!place)
            throw new NotFoundError('Place', placeId);
        const owner = await this.playersRepo.findById(ownerId);
        if (!owner)
            throw new NotFoundError('Player', ownerId);
        const players = playersId
            ? await Promise.all(playersId.map(async (id) => {
                const player = await this.playersRepo.findById(id);
                if (!player) {
                    throw new NotFoundError('Player', id);
                }
                return player;
            }))
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
        if (!challenge)
            throw new NotFoundError('Challenge', id);
        return challenge;
    }
    async getAllChallenges() {
        return this.challengeRepo.findAll();
    }
    async createPlace(name, coordinates) {
        const id = await this.placesRepo.create({
            name: name,
            coordinates: coordinates,
        });
        const place = await this.placesRepo.findById(id);
        if (!place)
            throw new NotFoundError('Place', id);
        return place;
    }
    async getAllPlaces() {
        return this.placesRepo.findAll();
    }
    async createPlayer(name, expertise, points = 0) {
        const id = await this.playersRepo.create({
            name: name,
            expertise: expertise,
            points: points,
        });
        const player = await this.playersRepo.findById(id);
        if (!player)
            throw new NotFoundError('Player', id);
        return player;
    }
    async getAllPlayers() {
        return this.playersRepo.findAll();
    }
}
