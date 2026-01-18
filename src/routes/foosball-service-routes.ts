import { Router } from 'express';
import { validateRequest } from '../middlewares/request-validator.js';
import { placeDataSchema } from '../schemas/place-schema.js';
import { challengeDataSchema } from '../schemas/challenge-schema.js';
import { FoosballServiceController } from '../controllers/foosball-service-controller.js';
import { playerDataSchema } from '../schemas/player-schema.js';
import { asyncHandler } from '../utils/common.js';

const foosballServiceRouter = Router();
// challenges
foosballServiceRouter.post(
  '/challenges',
  validateRequest(challengeDataSchema),
  asyncHandler(FoosballServiceController.createChallenge),
);
foosballServiceRouter.get('/challenges', asyncHandler(FoosballServiceController.getChallenges));
foosballServiceRouter.get('/challenges/:id', asyncHandler(FoosballServiceController.getChallengeById));
foosballServiceRouter.delete('/challenges/:id', asyncHandler(FoosballServiceController.deleteChallenge));

// places
foosballServiceRouter.post(
  '/places',
  validateRequest(placeDataSchema),
  asyncHandler(FoosballServiceController.createPlace),
);
foosballServiceRouter.get('/places', asyncHandler(FoosballServiceController.getPlaces));
foosballServiceRouter.get('/places/:id', asyncHandler(FoosballServiceController.getPlaceById));

// players
foosballServiceRouter.post(
  '/players',
  validateRequest(playerDataSchema),
  asyncHandler(FoosballServiceController.createPlayer),
);
foosballServiceRouter.get('/players', asyncHandler(FoosballServiceController.getPlayers));
foosballServiceRouter.get('/players/:id', asyncHandler(FoosballServiceController.getPlayerById));

export { foosballServiceRouter };
