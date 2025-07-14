import { Router } from 'express';
import { validateRequest } from '../middlewares/request-validator.js';
import { placeDataSchema } from '../schemas/place-schema.js';
import { challengeDataSchema } from '../schemas/challenge-schema.js';
import { ChallengeController } from '../controllers/challenge-controller.js';
import { playerDataSchema } from '../schemas/player-schema.js';
const challengeRouter = Router();
// challenges
challengeRouter.post('/challenges', validateRequest(challengeDataSchema), ChallengeController.createChallenge);
challengeRouter.get('/challenges', ChallengeController.getChallenges);
// places
challengeRouter.post('/places', validateRequest(placeDataSchema), ChallengeController.createPlace);
challengeRouter.get('/places', ChallengeController.getPlaces);
// players
challengeRouter.post('/players', validateRequest(playerDataSchema), ChallengeController.createPlayer);
challengeRouter.get('/players', ChallengeController.getPlayers);
export { challengeRouter };
