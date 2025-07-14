import { PrismaClient, Prisma } from '@prisma/client';
import { ChallengeStatus } from '../models/challenges.js';
import { PlaceStatus } from '../models/places.js';
import { NotFoundError } from '../utils/exceptions.js';
import { logger } from '../utils/logger.js';
export class PrismaChallengeRepository {
    constructor() {
        this.prisma = new PrismaClient();
    }
    async createChallenge(name, placeId, date, time, ownerId, status = ChallengeStatus.ACTIVE, playersId) {
        const challengeId = `challenge_${Date.now()}`;
        logger.info('Creating challenge', { challengeId, placeId, ownerId });
        try {
            const challenge = await this.prisma.challenge.create({
                data: {
                    id: challengeId,
                    name: name,
                    type: time,
                    status: status,
                    date: date,
                    place_id: placeId,
                    player_owner_id: ownerId,
                    createdAt: new Date(),
                    lastUpdate: new Date(),
                    players: playersId
                        ? {
                            create: playersId.map((playerId) => ({
                                player_id: playerId,
                            })),
                        }
                        : undefined,
                },
                include: {
                    place: true,
                    owner: true,
                    players: { include: { player: true } },
                },
            });
            logger.info('Challenge created successfully', { challengeId });
            return this.mapToChallenge(challenge);
        }
        catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2003') {
                    // Foreign key constraint failed
                    throw new NotFoundError('Place or Player', placeId + '/' + ownerId);
                }
            }
            throw error;
        }
    }
    async getAllChallenges() {
        logger.info('Fetching all challenges');
        const challenges = await this.prisma.challenge.findMany({
            include: {
                place: true,
                owner: true,
                players: { include: { player: true } },
            },
        });
        logger.info('Challenges fetched', { count: challenges.length });
        return challenges.map(this.mapToChallenge);
    }
    async createPlace(name, coordinates) {
        const placeId = `place_${Date.now()}`;
        const place = await this.prisma.place.create({
            data: {
                id: placeId,
                name,
                lat: coordinates.lat,
                long: coordinates.long,
                status: PlaceStatus.UNVERIFIED,
            },
        });
        return {
            id: place.id,
            name: place.name,
            coordinates: { lat: place.lat, long: place.long },
            status: place.status,
        };
    }
    async getAllPlaces() {
        const places = await this.prisma.place.findMany();
        return places.map((place) => ({
            id: place.id,
            name: place.name,
            coordinates: { lat: place.lat, long: place.long },
            status: place.status,
        }));
    }
    async createPlayer(name, expertise, points = 0) {
        const playerId = `player_${Date.now()}`;
        const player = await this.prisma.player.create({
            data: {
                id: playerId,
                name,
                expertise,
                points,
            },
        });
        return {
            id: player.id,
            name: player.name,
            expertise,
            points,
        };
    }
    async getAllPlayers() {
        const players = await this.prisma.player.findMany();
        return players.map((player) => ({
            id: player.id,
            name: player.name,
            expertise: player.expertise,
            points: player.points,
        }));
    }
    mapToChallenge(prismaChallenge) {
        return {
            id: prismaChallenge.id,
            name: prismaChallenge.name,
            place: {
                id: prismaChallenge.place.id,
                name: prismaChallenge.place.name,
                coordinates: { lat: prismaChallenge.place.lat, long: prismaChallenge.place.long },
                status: prismaChallenge.place.status,
            },
            status: prismaChallenge.status,
            date: prismaChallenge.date,
            time: prismaChallenge.type,
            owner: {
                id: prismaChallenge.owner.id,
                name: prismaChallenge.owner.name,
                expertise: prismaChallenge.owner.expertise,
                points: prismaChallenge.owner.points,
            },
            players: prismaChallenge.players.map((p) => ({
                id: p.player.id,
                name: p.player.name,
                expertise: p.player.expertise,
                points: p.player.points,
            })),
        };
    }
}
