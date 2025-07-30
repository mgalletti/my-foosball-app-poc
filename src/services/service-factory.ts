import { FoosballServiceFacade, InMemoryFoosballService } from './foosball-service.js';
import { SQLFoosballService } from './sql-foosball-service.js';

enum ServiceDBEngines {
  IN_MEMORY = 'IN_MEMORY',
  SQL = 'SQL',
  DYNAMODB = 'DYNAMODB',
  MONGODB = 'MONGODB',
}

export class FoosballServiceFactory {
  static getInstance(): FoosballServiceFacade {
    const dbEngine = process.env.DB_ENGINE || ServiceDBEngines.IN_MEMORY;

    switch (dbEngine) {
      case ServiceDBEngines.IN_MEMORY:
        return new InMemoryFoosballService();
      case ServiceDBEngines.SQL:
        return new SQLFoosballService();
      default:
        throw new Error(`Unsupported DB engine: ${dbEngine}`);
    }
  }
}
