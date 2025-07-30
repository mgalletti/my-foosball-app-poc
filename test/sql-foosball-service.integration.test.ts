import { PrismaClient } from '@prisma/client';
import { SQLFoosballService } from '../src/services/sql-foosball-service.js';
import { ChallengeStatus, ChallengeTime } from '../src/models/challenges.js';
import { Expertise } from '../src/models/players.js';
import { ChallengeDataSchema } from '../src/schemas/challenge-schema.js';
import { PlaceDataObject } from '../src/schemas/place-schema.js';
import { PlayerDataObject } from '../src/schemas/player-schema.js';
import { execSync } from 'child_process';
import path from 'path';

// Mock buildObjectId function
const dummyId = `dummyId`
jest.mock('../src/utils/common.js', () => ({
  buildObjectId: jest.fn(() => dummyId)
}));

describe('SQLFoosballService Integration Tests', () => {
  let prismaClient: PrismaClient;
  let service: SQLFoosballService;

  beforeAll(async () => {
    process.env.DATABASE_URL = `file:${path.join(process.cwd(), 'db/sql/foosball.db')}`;
    
    prismaClient = new PrismaClient();
    await prismaClient.$connect();
    
    execSync('sqlite3 db/sql/foosball.db < db/sql/mock_data.sql', { cwd: process.cwd() });
    
    service = new SQLFoosballService(prismaClient, 10);
  });

  afterAll(async () => {
    await prismaClient.$disconnect();
  });

  describe('Challenge operations', () => {
    test('should create and retrieve challenge', async () => {
      const challengeData: ChallengeDataSchema = {
        name: 'Integration Test Challenge',
        placeId: 'place1',
        date: new Date('2024-12-25T10:00:00Z'),
        time: ChallengeTime.MORNING,
        ownerId: 'player1',
        status: ChallengeStatus.OPEN,
        playersId: ['player2'],
      };

      if (await service.getChallengeById(dummyId)) {
        service.deleteChallenge(dummyId)
      }

      const created = await service.createChallenge(challengeData);
      expect(created.id).toBe(dummyId);
      expect(created.name).toBe('Integration Test Challenge');
      expect(created.players).toHaveLength(1);

      const challenges = await service.getChallenges();
      const found = challenges.find(c => c.id === dummyId);
      expect(found).toBeDefined();
      expect(found?.name).toBe('Integration Test Challenge');
    });

    test('should get challenge by id', async () => {
      const challenge = await service.getChallengeById('challenge1');
      expect(challenge).toBeDefined();
      expect(challenge?.name).toBe('Morning Match');
    });

    test('should update challenge', async () => {
      const id = 'challenge1'
      const updateData: ChallengeDataSchema = {
        name: 'Updated Challenge',
        placeId: 'place1',
        date: new Date('2024-12-26T10:00:00Z'),
        time: ChallengeTime.AFTERNOON,
        ownerId: 'player1',
        status: ChallengeStatus.TERMINATED,
      };

      const updated = await service.updateChallenge(id, updateData);
      expect(updated.name).toBe('Updated Challenge');
      expect(updated.status).toBe(ChallengeStatus.TERMINATED);
    });

    test('should delete challenge', async () => {
      const challengeData: ChallengeDataSchema = {
        name: 'Delete Test',
        placeId: 'place1',
        date: new Date('2024-12-25T10:00:00Z'),
        time: ChallengeTime.MORNING,
        ownerId: 'player1',
        status: ChallengeStatus.OPEN,
      };

      // clear if some have left from previous executions
      const challenge = await service.getChallengeById(dummyId);
      if (challenge) {
        await service.deleteChallenge(dummyId);
      }

      await service.createChallenge(challengeData);
      await service.deleteChallenge(dummyId);
      
      const deleted = await service.getChallengeById(dummyId);
      expect(deleted).toBeUndefined();
    });

    test('should get challenges with maxResult limit', async () => {
      const challenges = await service.getChallenges(2);
      expect(challenges.length).toBeLessThanOrEqual(2);
    });
  });

  describe('Place operations', () => {
    test('should create and retrieve place', async () => {
      const placeData: PlaceDataObject = {
        name: 'Integration Test Place',
        coordinates: { lat: 41.0, long: -75.0 },
      };

      const created = await service.createPlace(placeData);
      expect(created.name).toBe('Integration Test Place');
      expect(created.coordinates.lat).toBe(41.0);
      expect(created.coordinates.long).toBe(-75.0);

      const places = await service.getPlaces();
      const found = places.find(p => p.name === 'Integration Test Place');
      expect(found).toBeDefined();
    });

    test('should get places with maxResult limit', async () => {
      const places = await service.getPlaces(2);
      expect(places.length).toBeLessThanOrEqual(2);
    });

    test('should get place by id', async () => {
      const place = await service.getPlaceById('place1');
      expect(place).toBeDefined();
      expect(place?.name).toBe('Downtown Foosball Club');
    });

    test('should update place', async () => {
      const updateData: PlaceDataObject = {
        name: 'Updated Place',
        coordinates: { lat: 42.0, long: -76.0 },
      };

      const updated = await service.updatePlace('place1', updateData);
      expect(updated.name).toBe('Updated Place');
      expect(updated.coordinates.lat).toBe(42.0);
    });

    test('should delete place', async () => {
      const testPlace: PlaceDataObject = {
        name: 'Delete Test Place',
        coordinates: { lat: 43.0, long: -77.0 },
      };

      const created = await service.createPlace(testPlace);
      await service.deletePlace(created.id);
      
      const deleted = await service.getPlaceById(created.id);
      expect(deleted).toBeUndefined();
    });

    test('should get places with maxResult greate than pageSize', async () => {
      const places = await service.getPlaces(12);
      expect(places.length).toBeLessThanOrEqual(12);
    });
  });

  describe('Player operations', () => {
    test('should create and retrieve player', async () => {
      const playerData: PlayerDataObject = {
        name: 'Integration Test Player',
        expertise: Expertise.EXPERT,
        points: 500,
      };

      const created = await service.createPlayer(playerData);
      expect(created.name).toBe('Integration Test Player');
      expect(created.expertise).toBe(Expertise.EXPERT);
      expect(created.points).toBe(500);

      const players = await service.getPlayers();
      const found = players.find(p => p.name === 'Integration Test Player');
      expect(found).toBeDefined();
    });

    test('should get player by id', async () => {
      const player = await service.getPlayerById('player1');
      expect(player).toBeDefined();
      expect(player?.name).toBe('Alice');
    });

    test('should update player', async () => {
      const updateData: PlayerDataObject = {
        name: 'Updated Player',
        expertise: Expertise.EXPERT,
        points: 1000,
      };

      const updated = await service.updatePlayer('player1', updateData);
      expect(updated.name).toBe('Updated Player');
      expect(updated.expertise).toBe(Expertise.EXPERT);
      expect(updated.points).toBe(1000);
    });

    test('should delete player', async () => {
      const testPlayer: PlayerDataObject = {
        name: 'Delete Test Player',
        expertise: Expertise.NOVICE,
        points: 0,
      };

      const created = await service.createPlayer(testPlayer);
      await service.deletePlayer(created.id);
      
      const deleted = await service.getPlayerById(created.id);
      expect(deleted).toBeUndefined();
    });

    test('should get players with maxResult limit', async () => {
      const players = await service.getPlayers(2);
      expect(players.length).toBeLessThanOrEqual(2);
    });
  });
});