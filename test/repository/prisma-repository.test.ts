import { PrismaClient } from '@prisma/client';
import { PrismaChallengeSearchRepository, PrismaChallengeCRUDRepository } from '../../src/repositories/prisma-repository.js';
import { ChallengeStatus, ChallengeTime } from '../../src/models/challenges.js';
import { PlaceStatus } from '../../src/models/places.js';
import { Expertise } from '../../src/models/players.js';
import { ChallengeDataSchema } from '../../src/schemas/challenge-schema.js';

// Mock Prisma Client
const mockPrismaClient = {
  challenge: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  challengePlayerAssociation: {
    deleteMany: jest.fn(),
  },
  $transaction: jest.fn(),
} as unknown as PrismaClient;

const mockChallengeData = {
  id: 'challenge_1',
  name: 'Test Challenge',
  time: ChallengeTime.MORNING,
  status: ChallengeStatus.ACTIVE,
  date: new Date('2024-01-01'),
  // createdAt: new Date('2024-01-01'),
  // lastUpdate: new Date('2024-01-01'),
  place: {
    id: 'place_1',
    name: 'Test Place',
    coordinates: {
      lat: 40.7128,
      long: -74.0060,
    },
    status: PlaceStatus.ACTIVE,
  },
  owner: {
    id: 'player_1',
    name: 'Test Owner',
    expertise: Expertise.INTERMEDIATE,
    points: 100,
  },
  players: [
    {
      player: {
        id: 'player_2',
        name: 'Test Player',
        expertise: Expertise.INTERMEDIATE,
        points: 200,
      },
    },
  ],
};

describe('PrismaChallengeSearchRepository', () => {
  let searchRepository: PrismaChallengeSearchRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    searchRepository = new PrismaChallengeSearchRepository(mockPrismaClient);
  });

  test('should search challenges with cursor pagination', async () => {
    (mockPrismaClient.challenge.findMany as jest.Mock).mockResolvedValue([mockChallengeData, ]);

    const result = await searchRepository.search(
      { status: ChallengeStatus.ACTIVE },
      { pageSize: 10, maxResult: 10 }
    );

    expect(mockPrismaClient.challenge.findMany).toHaveBeenCalledWith({
      take: 10,
      where: { status: ChallengeStatus.ACTIVE },
      orderBy: { id: 'asc' },
      include: {
        place: true,
        owner: true,
        players: { include: { player: true } },
      },
    });

    expect(result.results).toHaveLength(1);
    expect(result.results[0].id).toBe('challenge_1');
    expect(result.nextToken).toBe(undefined);
  });

  test('should search with cursor token', async () => {
    (mockPrismaClient.challenge.findMany as jest.Mock).mockResolvedValue([mockChallengeData]);

    await searchRepository.search(
      {},
      { pageSize: 5, maxResult: 5, nextToken: 'cursor_123' }
    );

    expect(mockPrismaClient.challenge.findMany).toHaveBeenCalledWith({
      take: 5,
      cursor: { id: 'cursor_123' },
      skip: 1,
      where: {},
      orderBy: { id: 'asc' },
      include: {
        place: true,
        owner: true,
        players: { include: { player: true } },
      },
    });
  });

  test('should return empty results when pageSize is 0', async () => {
    const result = await searchRepository.search({}, { pageSize: 0, maxResult: 10 });

    expect(result.results).toHaveLength(0);
    expect(result.nextToken).toBeUndefined();
    expect(mockPrismaClient.challenge.findMany).not.toHaveBeenCalled();
  });
});

describe('PrismaChallengeCRUDRepository', () => {
  let crudRepository: PrismaChallengeCRUDRepository;
  let searchRepository: PrismaChallengeSearchRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    searchRepository = new PrismaChallengeSearchRepository(mockPrismaClient);
    crudRepository = new PrismaChallengeCRUDRepository(mockPrismaClient);
  });

  test('should get all challenges using inner findMany function', async () => {
    (mockPrismaClient.challenge.findMany as jest.Mock).mockResolvedValue([mockChallengeData, ]);


    jest.spyOn(searchRepository, 'search').mockResolvedValue({
      results: [mockChallengeData as any],
      nextToken: 'token_123',
    });

    const result = await crudRepository.getAll({ pageSize: 10, maxResult: 10 });

    expect(mockPrismaClient.challenge.findMany).toHaveBeenCalledWith({
      take: 10,
      where: { },
      orderBy: { id: 'asc' },
      include: {
        place: true,
        owner: true,
        players: { include: { player: true } },
      },
    });
  });

  test('should create challenge', async () => {
    (mockPrismaClient.challenge.create as jest.Mock).mockResolvedValue(mockChallengeData);
    

    const challengeData: ChallengeDataSchema = {
      name: 'New Challenge',
      placeId: 'place_1',
      date: new Date('2024-01-01'),
      time: ChallengeTime.AFTERNOON,
      ownerId: 'player_1',
      status: ChallengeStatus.ACTIVE,
      playersId: ['player_2'],
    };
    
    const result = await crudRepository.create(challengeData);
    
    expect(result.id).toBe('challenge_1');
    expect(result.name).toBe('Test Challenge');
  });

  test('should update challenge', async () => {
    (mockPrismaClient.challenge.update as jest.Mock).mockResolvedValue(mockChallengeData);

    const updateData: ChallengeDataSchema = {
      name: 'Updated Challenge',
      placeId: 'place_1',
      date: new Date('2024-01-02'),
      time: ChallengeTime.EVENING,
      ownerId: 'player_1',
      status: ChallengeStatus.TERMINATED,
    };

    const result = await crudRepository.update('challenge_1', updateData);

    expect(result.id).toBe('challenge_1');
  });

  test('should delete challenge', async () => {

    await crudRepository.delete('challenge_1');

    expect(mockPrismaClient.challenge.delete).toHaveBeenCalledWith({
      where: { id: 'challenge_1' },
    });
  });
});