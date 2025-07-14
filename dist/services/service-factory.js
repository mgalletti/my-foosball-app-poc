import { ChallengeService } from '../services/challenge-service.js';
import { PrismaChallengeRepository } from '../repositories/prisma-challenge-repository.js';
import { InMemoryChallengeRepository } from '../repositories/in-memory-challenge-repository.js';
var ServiceDBEngines;
(function (ServiceDBEngines) {
    ServiceDBEngines["IN_MEMORY"] = "IN_MEMORY";
    ServiceDBEngines["SQL"] = "SQL";
    ServiceDBEngines["DYNAMODB"] = "DYNAMODB";
    ServiceDBEngines["MONGODB"] = "MONGODB";
})(ServiceDBEngines || (ServiceDBEngines = {}));
export class ChallengeServiceFactory {
    static getInstance() {
        const dbEngine = process.env.DB_ENGINE || ServiceDBEngines.IN_MEMORY;
        switch (dbEngine) {
            case ServiceDBEngines.IN_MEMORY:
                return new ChallengeService(new InMemoryChallengeRepository());
            case ServiceDBEngines.SQL:
                return new ChallengeService(new PrismaChallengeRepository());
            // case ServiceDBEngines.DYNAMODB:
            //     return new ChallengeService(new DynamoDBAdapter());
            // case ServiceDBEngines.MONGODB:
            //     return new ChallengeService(new MongoDBAdapter());
            default:
                throw new Error(`Unsupported DB engine: ${dbEngine}`);
        }
    }
}
