import request from 'supertest';
import express from 'express';

const mockService = {
  createChallenge: jest.fn(),
  getChallenges: jest.fn(),
  createPlace: jest.fn(),
  getPlaces: jest.fn(),
  createPlayer: jest.fn(),
  getPlayers: jest.fn(),
};

jest.mock('../src/services/service-factory', () => ({
  ChallengeServiceFactory: {
    getInstance: jest.fn(() => mockService),
  },
}));

import { ChallengeController } from '../src/controllers/challenge-controller';

const app = express();
app.use(express.json());
app.post('/challenges', ChallengeController.createChallenge);
app.get('/challenges', ChallengeController.getChallenges);
app.post('/places', ChallengeController.createPlace);
app.get('/places', ChallengeController.getPlaces);
app.post('/players', ChallengeController.createPlayer);
app.get('/players', ChallengeController.getPlayers);

describe('ChallengeController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();

  });

  it('should create a challenge', async () => {
    mockService.createChallenge.mockResolvedValue({ id: '1', name: 'Test Challenge' });
    const res = await request(app)
      .post('/challenges')
      .send({ name: 'Test Challenge' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id', '1');
    expect(mockService.createChallenge).toHaveBeenCalled();
  });

  it('should get challenges', async () => {
    mockService.getChallenges.mockResolvedValue([{ id: '1', name: 'Test Challenge' }]);
    const res = await request(app).get('/challenges');
    expect(res.status).toBe(200);
    expect(res.body.challenges).toBeInstanceOf(Array);
    expect(mockService.getChallenges).toHaveBeenCalled();
  });

  it('should create a place', async () => {
    mockService.createPlace.mockResolvedValue({ id: '1', name: 'Test Place' });
    const res = await request(app)
      .post('/places')
      .send({ name: 'Test Place' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id', '1');
    expect(mockService.createPlace).toHaveBeenCalled();
  });

  it('should get places', async () => {
    mockService.getPlaces.mockResolvedValue([{ id: '1', name: 'Test Place' }]);
    const res = await request(app).get('/places');
    expect(res.status).toBe(200);
    expect(res.body.places).toBeInstanceOf(Array);
    expect(mockService.getPlaces).toHaveBeenCalled();
  });

  it('should create a player', async () => {
    mockService.createPlayer.mockResolvedValue({ id: '1', name: 'Test Player' });
    const res = await request(app)
      .post('/players')
      .send({ name: 'Test Player' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id', '1');
    expect(mockService.createPlayer).toHaveBeenCalled();
  });

  it('should get players', async () => {
    mockService.getPlayers.mockResolvedValue([{ id: '1', name: 'Test Player' }]);
    const res = await request(app).get('/players');
    expect(res.status).toBe(200);
    expect(res.body.players).toBeInstanceOf(Array);
    expect(mockService.getPlayers).toHaveBeenCalled();
  });
}); 