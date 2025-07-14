import { Request, Response } from 'express';
import { ChallengeServiceFactory } from '../services/service-factory.js';
import { PlaceDataObject } from '../schemas/place-schema.js';
import { PlayerDataObject } from '../schemas/player-schema.js';
import { ChallengeDataObject } from '../schemas/challenge-schema.js';

const challengeService = ChallengeServiceFactory.getInstance();

export class ChallengeController {
  static async createChallenge(req: Request, res: Response) {
    try {
      const challengeBody: ChallengeDataObject = req.body;

      const challenge = await challengeService.createChallenge(challengeBody);
      res.status(201).json(challenge);
    } catch (error) {
      res.status(400).json({ error: `Invalid challenge data: ${error}` });
    }
  }

  static async getChallenges(req: Request, res: Response) {
    try {
      const challengesData = await challengeService.getChallenges();
      const response = {
        challenges: challengesData,
      };

      res.status(200).json(response);
    } catch (error) {
      res.status(400).json({ error: `Invalid challenge data: ${error}` });
    }
  }

  static async createPlace(req: Request, res: Response) {
    try {
      const placeBody: PlaceDataObject = req.body;

      const place = await challengeService.createPlace(placeBody);
      res.status(201).json(place);
    } catch (error) {
      res.status(400).json({ error: `Invalid data: ${error}` });
    }
  }

  static async getPlaces(req: Request, res: Response) {
    try {
      const places = await challengeService.getPlaces();
      const response = {
        places: places,
      };

      res.status(200).json(response);
    } catch (error) {
      res.status(400).json({ error: `Invalid data: ${error}` });
    }
  }

  static async createPlayer(req: Request, res: Response) {
    try {
      const playerBody: PlayerDataObject = req.body;

      const player = await challengeService.createPlayer(playerBody);
      res.status(201).json(player);
    } catch (error) {
      res.status(400).json({ error: `Invalid data: ${error}` });
    }
  }

  static async getPlayers(req: Request, res: Response) {
    try {
      const players = await challengeService.getPlayers();
      const response = {
        players: players,
      };

      res.status(200).json(response);
    } catch (error) {
      res.status(400).json({ error: `Invalid data: ${error}` });
    }
  }
}
