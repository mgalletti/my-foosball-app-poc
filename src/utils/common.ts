import { Request, Response } from 'express';

export const randomChoice = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const buildObjectId = (prefix: string): string => `${prefix}${Date.now()}`;

export const asyncHandler =
  (fn: (req: Request, res: Response) => Promise<any>) =>
  async (req: Request, res: Response): Promise<void> => {
    await fn(req, res);
  };
