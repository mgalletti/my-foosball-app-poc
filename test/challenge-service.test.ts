import { ChallengeService } from '../src/services/challenge-service';

describe('ChallengeService', () => {
  let service: ChallengeService;
  let mockRepo: any;

  beforeEach(() => {
    mockRepo = {
      createChallenge: jest.fn(),
      getAllChallenges: jest.fn(),
      createPlace: jest.fn(),
      getAllPlaces: jest.fn(),
      createPlayer: jest.fn(),
      getAllPlayers: jest.fn(),
    };
    service = new ChallengeService(mockRepo);
  });

  it('should create a challenge', async () => {
    mockRepo.createChallenge.mockResolvedValue({ id: '1', name: 'Test Challenge' });
    const result = await service.createChallenge({ name: 'Test Challenge' } as any);
    expect(result).toEqual({ id: '1', name: 'Test Challenge' });
    expect(mockRepo.createChallenge).toHaveBeenCalled();
  });

  it('should get challenges', async () => {
    mockRepo.getAllChallenges.mockResolvedValue([{ id: '1', name: 'Test Challenge' }]);
    const result = await service.getChallenges();
    expect(result).toEqual([{ id: '1', name: 'Test Challenge' }]);
    expect(mockRepo.getAllChallenges).toHaveBeenCalled();
  });

  it('should create a place', async () => {
    mockRepo.createPlace.mockResolvedValue({ id: '1', name: 'Test Place' });
    const result = await service.createPlace({ name: 'Test Place', coordinates: [0,0] } as any);
    expect(result).toEqual({ id: '1', name: 'Test Place' });
    expect(mockRepo.createPlace).toHaveBeenCalled();
  });

  it('should get places', async () => {
    mockRepo.getAllPlaces.mockResolvedValue([{ id: '1', name: 'Test Place' }]);
    const result = await service.getPlaces();
    expect(result).toEqual([{ id: '1', name: 'Test Place' }]);
    expect(mockRepo.getAllPlaces).toHaveBeenCalled();
  });

  it('should create a player', async () => {
    mockRepo.createPlayer.mockResolvedValue({ id: '1', name: 'Test Player' });
    const result = await service.createPlayer({ name: 'Test Player', expertise: 'pro', points: 100 } as any);
    expect(result).toEqual({ id: '1', name: 'Test Player' });
    expect(mockRepo.createPlayer).toHaveBeenCalled();
  });

  it('should get players', async () => {
    mockRepo.getAllPlayers.mockResolvedValue([{ id: '1', name: 'Test Player' }]);
    const result = await service.getPlayers();
    expect(result).toEqual([{ id: '1', name: 'Test Player' }]);
    expect(mockRepo.getAllPlayers).toHaveBeenCalled();
  });
}); 