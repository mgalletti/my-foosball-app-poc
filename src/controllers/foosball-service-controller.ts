import { Request, Response } from 'express';
import { FoosballServiceFactory } from '../services/service-factory.js';
import { PlaceDataObject } from '../schemas/place-schema.js';
import { PlayerDataObject } from '../schemas/player-schema.js';
import { ChallengeDataSchema } from '../schemas/challenge-schema.js';

const foosballService = FoosballServiceFactory.getInstance();

export class FoosballServiceController {
  static async createChallenge(req: Request, res: Response) {
    try {
      const challengeBody: ChallengeDataSchema = req.body;

      const challenge = await foosballService.createChallenge(challengeBody);
      res.status(201).json(challenge);
    } catch (error) {
      res.status(400).json({ error: `Invalid challenge data: ${error}` });
    }
  }

  static async getChallenges(req: Request, res: Response) {
    try {
      const challengesData = await foosballService.getChallenges();
      const response = {
        challenges: challengesData,
      };

      res.status(200).json(response);
    } catch (error) {
      res.status(400).json({ error: `Invalid challenge data: ${error}` });
    }
  }

  static async getChallengeById(req: Request, res: Response) {
    try {
      const challengeId: string = req.params.id;
      const challengeData = await foosballService.getChallengeById(challengeId);

      if (!challengeData) return res.status(404).json({ error: 'Challenge not found' });

      const response = { ...challengeData };

      res.status(200).json(response);
    } catch (error) {
      res.status(400).json({ error: `Invalid challenge data: ${error}` });
    }
  }

  static async updateChallenge(req: Request, res: Response) {
    try {
      const challengeId: string = req.params.id;
      const challengeBody: ChallengeDataSchema = req.body;

      const challenge = await foosballService.updateChallenge(challengeId, challengeBody);
      res.status(200).json(challenge);
    } catch (error) {
      res.status(400).json({ error: `Invalid challenge data: ${error}` });
    }
  }

  static async deleteChallenge(req: Request, res: Response) {
    try {
      const challengeId: string = req.params.id;

      await foosballService.deleteChallenge(challengeId);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: `Invalid challenge data: ${error}` });
    }
  }

  static async createPlace(req: Request, res: Response) {
    try {
      const placeBody: PlaceDataObject = req.body;

      const place = await foosballService.createPlace(placeBody);
      res.status(201).json(place);
    } catch (error) {
      res.status(400).json({ error: `Invalid data: ${error}` });
    }
  }

  static async getPlaces(req: Request, res: Response) {
    try {
      const places = await foosballService.getPlaces();
      const response = {
        places: places,
      };

      res.status(200).json(response);
    } catch (error) {
      res.status(400).json({ error: `Invalid data: ${error}` });
    }
  }
  static async getPlaceById(req: Request, res: Response) {
    try {
      const placeId: string = req.params.id;
      const placeData = await foosballService.getPlaceById(placeId);

      if (!placeData) return res.status(404).json({ error: 'Place not found' });
      const response = { ...placeData };

      res.status(200).json(response);
    } catch (error) {
      res.status(400).json({ error: `Invalid data: ${error}` });
    }
  }

  static async createPlayer(req: Request, res: Response) {
    try {
      const playerBody: PlayerDataObject = req.body;

      const player = await foosballService.createPlayer(playerBody);
      res.status(201).json(player);
    } catch (error) {
      res.status(400).json({ error: `Invalid data: ${error}` });
    }
  }

  static async getPlayers(req: Request, res: Response) {
    try {
      const players = await foosballService.getPlayers();
      const response = {
        players: players,
      };

      res.status(200).json(response);
    } catch (error) {
      res.status(400).json({ error: `Invalid data: ${error}` });
    }
  }
  static async getPlayerById(req: Request, res: Response) {
    try {
      const playerId: string = req.params.id;
      const playerData = await foosballService.getPlayerById(playerId);

      if (!playerData) return res.status(404).json({ error: 'Player not found' });

      const response = { ...playerData };

      res.status(200).json(response);
    } catch (error) {
      res.status(400).json({ error: `Invalid data: ${error}` });
    }
  }
}
