import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';

export const validateRequest = (schema: AnyZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const validation = schema.safeParse(req.body);
    if (!validation.success) {
      const errors = validation.error.issues.map((issue) => ({
        code: issue.code,
        message: issue.message,
        attribute: issue.path.join('.'),
      }));
      res.status(400).json({ errors: errors });
    } else {
      req.body = validation.data;
      next();
    }
  };
};
