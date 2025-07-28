import { Request, Response } from 'express';
import { ChallengeServiceFactory } from '../services/service-factory.js';
import { PlaceDataObject } from '../schemas/place-schema.js';

const challengeService = ChallengeServiceFactory.getInstance();

export class PlaceController {
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
}
