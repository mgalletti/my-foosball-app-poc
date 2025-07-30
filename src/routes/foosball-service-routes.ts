import { Router } from 'express';
import { validateRequest } from '../middlewares/request-validator.js';
import { placeDataSchema } from '../schemas/place-schema.js';
import { challengeDataSchema } from '../schemas/challenge-schema.js';
import { FoosballServiceController } from '../controllers/foosball-service-controller.js';
import { playerDataSchema } from '../schemas/player-schema.js';

const foosballServiceRouter = Router();

// challenges
foosballServiceRouter.post(
  '/challenges',
  validateRequest(challengeDataSchema),
  FoosballServiceController.createChallenge,
);
foosballServiceRouter.get('/challenges', FoosballServiceController.getChallenges);
foosballServiceRouter.get('/challenges/:id', FoosballServiceController.getChallengeById);
foosballServiceRouter.delete('/challenges/:id', FoosballServiceController.deleteChallenge);

// places
foosballServiceRouter.post('/places', validateRequest(placeDataSchema), FoosballServiceController.createPlace);
foosballServiceRouter.get('/places', FoosballServiceController.getPlaces);
foosballServiceRouter.get('/places/:id', FoosballServiceController.getPlaceById);

// players
foosballServiceRouter.post('/players', validateRequest(playerDataSchema), FoosballServiceController.createPlayer);
foosballServiceRouter.get('/players', FoosballServiceController.getPlayers);
foosballServiceRouter.get('/players/:id', FoosballServiceController.getPlayerById);

export { foosballServiceRouter };
