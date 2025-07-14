import { Request, Response, NextFunction } from 'express';
import { randomChoice } from '../utils/common.js';

export const dummySessionRequestHandler = () => {
  const usernames = ['alice', 'bob', 'charlie', 'diana', 'eve', 'frank'];

  return (req: Request, res: Response, next: NextFunction) => {
    const randomUsername = randomChoice(usernames);

    req.sessionContext = {
      user: {
        username: `${randomUsername}_user`,
        email: `${randomUsername}@example.com`,
      },
    };

    next();
  };
};
