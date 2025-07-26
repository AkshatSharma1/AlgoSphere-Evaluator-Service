import { Request, Response } from 'express';

export const pingCheck = (_req: Request, res: Response) => res.status(200).send({ message: 'Server is running' });
