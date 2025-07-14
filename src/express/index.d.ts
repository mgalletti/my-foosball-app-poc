import { SessionContext } from '../models/sessions.ts';

declare global {
  namespace Express {
    interface Request {
      sessionContext?: SessionContext;
    }
  }
}
