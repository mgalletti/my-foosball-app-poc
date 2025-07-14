export class ChallengeService {
    constructor(challengeDB) {
        this.challengeDB = challengeDB;
    }
    async createChallenge(challenge) {
        return this.challengeDB.createChallenge(challenge.name, challenge.placeId, challenge.date, challenge.time, challenge.ownerId, challenge.status, challenge.playersId);
    }
    async getChallenges() {
        return this.challengeDB.getAllChallenges();
    }
    async createPlace(place) {
        return this.challengeDB.createPlace(place.name, place.coordinates);
    }
    async getPlaces() {
        return this.challengeDB.getAllPlaces();
    }
    async createPlayer(player) {
        return this.challengeDB.createPlayer(player.name, player.expertise, player.points);
    }
    async getPlayers() {
        return this.challengeDB.getAllPlayers();
    }
}
