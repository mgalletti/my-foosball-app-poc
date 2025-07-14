import { ChallengeServiceFactory } from '../services/service-factory.js';
const challengeService = ChallengeServiceFactory.getInstance();
export class ChallengeController {
    static async createChallenge(req, res) {
        try {
            const challengeBody = req.body;
            const challenge = await challengeService.createChallenge(challengeBody);
            res.status(201).json(challenge);
        }
        catch (error) {
            res.status(400).json({ error: `Invalid challenge data: ${error}` });
        }
    }
    static async getChallenges(req, res) {
        try {
            const challengesData = await challengeService.getChallenges();
            const response = {
                challenges: challengesData,
            };
            res.status(200).json(response);
        }
        catch (error) {
            res.status(400).json({ error: `Invalid challenge data: ${error}` });
        }
    }
    static async createPlace(req, res) {
        try {
            const placeBody = req.body;
            const place = await challengeService.createPlace(placeBody);
            res.status(201).json(place);
        }
        catch (error) {
            res.status(400).json({ error: `Invalid data: ${error}` });
        }
    }
    static async getPlaces(req, res) {
        try {
            const places = await challengeService.getPlaces();
            const response = {
                places: places,
            };
            res.status(200).json(response);
        }
        catch (error) {
            res.status(400).json({ error: `Invalid data: ${error}` });
        }
    }
    static async createPlayer(req, res) {
        try {
            const playerBody = req.body;
            const player = await challengeService.createPlayer(playerBody);
            res.status(201).json(player);
        }
        catch (error) {
            res.status(400).json({ error: `Invalid data: ${error}` });
        }
    }
    static async getPlayers(req, res) {
        try {
            const players = await challengeService.getPlayers();
            const response = {
                players: players,
            };
            res.status(200).json(response);
        }
        catch (error) {
            res.status(400).json({ error: `Invalid data: ${error}` });
        }
    }
}
