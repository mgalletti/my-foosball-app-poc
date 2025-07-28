import { PrismaClient } from '@prisma/client';
import { SQLFoosballService } from '../src/services/sql-foosball-service.js';
import { ChallengeStatus, ChallengeTime } from '../src/models/challenges.js';
import { PlaceStatus } from '../src/models/places.js';
import { Expertise } from '../src/models/players.js';
import { ChallengeDataObject } from '../src/schemas/challenge-schema.js';
import { PlaceDataObject } from '../src/schemas/place-schema.js';
import { PlayerDataObject } from '../src/schemas/player-schema.js';

// Mock PrismaClient
const mockPrismaClient = {
  challenge: {
    findMany: jest.fn(),
    create: jest.fn(),
  },
  place: {
    findMany: jest.fn(),
    create: jest.fn(),
  },
  player: {
    findMany: jest.fn(),
    create: jest.fn(),
  },
} as unknown as PrismaClient;

const mockChallengeData = {
  id: 'challenge_1',
  name: 'Test Challenge',
  type: ChallengeTime.MORNING,
  status: ChallengeStatus.ACTIVE,
  date: new Date('2024-01-01'),
  place_id: 'place_1',
  player_owner_id: 'player_1',
  createdAt: new Date(),
  lastUpdate: new Date(),
  place: {
    id: 'place_1',
    name: 'Test Place',
    lat: 40.7128,
    long: -74.0060,
    status: PlaceStatus.ACTIVE,
  },
  owner: {
    id: 'player_1',
    name: 'Test Owner',
    expertise: Expertise.INTERMEDIATE,
    points: 100,
  },
  players: [],
};

const mockPlaceData = {
  id: 'place_1',
  name: 'Test Place',
  lat: 40.7128,
  long: -74.0060,
  status: PlaceStatus.ACTIVE,
};

const mockPlayerData = {
  id: 'player_1',
  name: 'Test Player',
  expertise: Expertise.INTERMEDIATE,
  points: 100,
};

describe('SQLFoosballService', () => {
  let service: SQLFoosballService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new SQLFoosballService(mockPrismaClient, 10);
  });

  describe('createChallenge', () => {
    test('should create challenge', async () => {
      (mockPrismaClient.challenge.create as jest.Mock).mockResolvedValue(mockChallengeData);

      const challengeData: ChallengeDataObject = {
        id: 'challenge_1',
        name: 'New Challenge',
        placeId: 'place_1',
        date: new Date('2024-01-01'),
        time: ChallengeTime.MORNING,
        ownerId: 'player_1',
        status: ChallengeStatus.ACTIVE,
      };

      const result = await service.createChallenge(challengeData);

      expect(result.id).toBe('challenge_1');
      expect(result.name).toBe('Test Challenge');
    });
  });

  describe('createPlace', () => {
    test('should create place', async () => {
      (mockPrismaClient.place.create as jest.Mock).mockResolvedValue(mockPlaceData);

      const placeData: PlaceDataObject = {
        name: 'New Place',
        coordinates: { lat: 40.7128, long: -74.0060 },
      };

      const result = await service.createPlace(placeData);

      expect(result.id).toBe('place_1');
      expect(result.name).toBe('Test Place');
    });
  });

  describe('createPlayer', () => {
    test('should create player', async () => {
      (mockPrismaClient.player.create as jest.Mock).mockResolvedValue(mockPlayerData);

      const playerData: PlayerDataObject = {
        name: 'New Player',
        expertise: Expertise.NOVICE,
        points: 0,
      };

      const result = await service.createPlayer(playerData);

      expect(result.id).toBe('player_1');
      expect(result.name).toBe('Test Player');
    });
  });

  describe('getChallenges', () => {
    test('should get challenges with default maxResult', async () => {
      (mockPrismaClient.challenge.findMany as jest.Mock).mockResolvedValue([mockChallengeData]);

      const result = await service.getChallenges();

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('challenge_1');
    });

    test('should get challenges with custom maxResult', async () => {
      (mockPrismaClient.challenge.findMany as jest.Mock).mockResolvedValue([
        mockChallengeData,
        mockChallengeData,
        mockChallengeData,
        mockChallengeData,
        mockChallengeData,
      ]);

      const result = await service.getChallenges(5);

      expect(result).toHaveLength(5);
    });
  });

  describe('getPlaces', () => {
    test('should get places', async () => {
      (mockPrismaClient.place.findMany as jest.Mock).mockResolvedValue([mockPlaceData]);

      const result = await service.getPlaces();

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('place_1');
    });
  });

  describe('getPlayers', () => {
    test('should get players', async () => {
      (mockPrismaClient.player.findMany as jest.Mock).mockResolvedValue([mockPlayerData]);

      const result = await service.getPlayers();

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('player_1');
    });
  });
});