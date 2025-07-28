import { PrismaClient } from '@prisma/client';
import { PrismaChallengeSearchRepository, PrismaChallengeCRUDRepository } from '../../src/repositories/prisma-repository.js';
import { ChallengeStatus, ChallengeTime } from '../../src/models/challenges.js';
import { ChallengeDataObject } from '../../src/schemas/challenge-schema.js';
import { execSync } from 'child_process';
import path from 'path';
import { placeObjectSchema } from '../../src/schemas/place-schema.js';

describe('Prisma Repository Integration Tests', () => {
  let prismaClient: PrismaClient;
  let searchRepository: PrismaChallengeSearchRepository;
  let crudRepository: PrismaChallengeCRUDRepository;

  beforeAll(async () => {
    // Set up test database
    process.env.DATABASE_URL = `file:${path.join(process.cwd(), 'db/sql/foosball.db')}`;
    
    prismaClient = new PrismaClient();
    await prismaClient.$connect();
    
    // Load mock data
    execSync('sqlite3 db/sql/foosball.db < db/sql/mock_data.sql', { cwd: process.cwd() });
    
    searchRepository = new PrismaChallengeSearchRepository(prismaClient);
    crudRepository = new PrismaChallengeCRUDRepository(prismaClient);
  });

  afterAll(async () => {
    await prismaClient.$disconnect();
  });

  describe('PrismaChallengeSearchRepository', () => {
    test('should search all challenges with pagination', async () => {

      const result = await searchRepository.search({}, { pageSize: 3, maxResult: 5 });

      expect(result.results).toHaveLength(3);
      expect(result.nextToken).toBeDefined();
      expect(result.results[0]).toHaveProperty('id');
      expect(result.results[0]).toHaveProperty('name');
      expect(result.results[0]).toHaveProperty('place');
      expect(result.results[0]).toHaveProperty('owner');

    });

    test('should search challenges by status', async () => {
      const result = await searchRepository.search(
        { status: ChallengeStatus.ACTIVE },
        { pageSize: 10, maxResult: 10 }
      );

      expect(result.results.length).toBeGreaterThan(0);
      result.results.forEach(challenge => {
        expect(challenge.status).toBe(ChallengeStatus.ACTIVE);
      });
    });

    test('should use cursor pagination', async () => {
      const firstPage = await searchRepository.search({}, { pageSize: 2, maxResult: 10 });
      expect(firstPage.results).toHaveLength(2);
      expect(firstPage.nextToken).toBeDefined();

      const secondPage = await searchRepository.search(
        {},
        { pageSize: 2, maxResult: 10, nextToken: firstPage.nextToken }
      );
      expect(secondPage.results).toHaveLength(2);
      expect(secondPage.results[0].id).not.toBe(firstPage.results[1].id);
    });

    test('should return empty results for non-matching query', async () => {
      const result = await searchRepository.search(
        { status: 'NON_EXISTENT_STATUS' },
        { pageSize: 10, maxResult: 10 }
      );

      expect(result.results).toHaveLength(0);
      expect(result.nextToken).toBeUndefined();
    });
  });

  describe('PrismaChallengeCRUDRepository', () => {
    test('should get all challenges', async () => {
      const result = await crudRepository.getAll({ pageSize: 10, maxResult: 10 });

      expect(result.results.length).toBeGreaterThan(0);
      expect(result.results[0]).toHaveProperty('id');
      expect(result.results[0]).toHaveProperty('place');
      expect(result.results[0]).toHaveProperty('owner');
    });

    test('should get challenge by id', async () => {
      const result = await crudRepository.getById('challenge1');

      expect(result).toBeDefined();
      expect(result?.id).toBe('challenge1');
      expect(result?.name).toBe('Morning Match');
      expect(result?.place.name).toBe('Downtown Foosball Club');
      expect(result?.owner.name).toBe('Alice');
    });

    test('should return undefined for non-existent challenge', async () => {
      const result = await crudRepository.getById('non-existent-id');
      expect(result).toBeUndefined();
    });

    test('should create new challenge', async () => {
      const id = `test-challenge-1`;

      // clear if some have left from previous executions
      const challenge = await crudRepository.getById(id);
      if (challenge) {
        await crudRepository.delete(id);
      }

      // const id = `test-challenge-${Date.now()}`;
      const challengeData: ChallengeDataObject = {
        id: id,
        name: 'Test Challenge',
        placeId: 'place1',
        date: new Date('2024-12-25T10:00:00Z'),
        time: ChallengeTime.MORNING,
        ownerId: 'player1',
        status: ChallengeStatus.OPEN,
        playersId: ['player2'],
      };
      
      const result = await crudRepository.create(challengeData);
      
      expect(result.id).toBe(id);
      expect(result.name).toBe('Test Challenge');
      expect(result.place.id).toBe('place1');
      expect(result.owner.id).toBe('player1');
      expect(result.players).toHaveLength(1);
      expect(result.players[0].id).toBe('player2');

      // delete record just created
      await crudRepository.delete(id);
    });

    test('should update existing challenge', async () => {
      const updateData: ChallengeDataObject = {
        id: 'challenge1',
        name: 'Updated Morning Match',
        placeId: 'place2',
        date: new Date('2024-12-25T11:00:00Z'),
        time: ChallengeTime.AFTERNOON,
        ownerId: 'player1',
        status: ChallengeStatus.TERMINATED,
      };

      const result = await crudRepository.update('challenge1', updateData);

      expect(result.id).toBe('challenge1');
      expect(result.name).toBe('Updated Morning Match');
      expect(result.place.id).toBe('place2');
      expect(result.status).toBe(ChallengeStatus.TERMINATED);
    });

    test('should delete challenge', async () => {
      const id = 'test-delete-challenge'
      // First create a challenge to delete
      const challengeData: ChallengeDataObject = {
        id: id,
        name: 'Delete Me',
        placeId: 'place1',
        date: new Date('2024-12-25T10:00:00Z'),
        time: ChallengeTime.MORNING,
        ownerId: 'player1',
        status: ChallengeStatus.OPEN,
      };

      await crudRepository.create(challengeData);

      // Then delete it
      await crudRepository.delete(id);

      // Verify it's gone
      const result = await crudRepository.getById(id);
      expect(result).toBeUndefined();
    });
  });
});