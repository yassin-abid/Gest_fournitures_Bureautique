import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('[ERROR]', err.message, err.stack);

  // Prisma errors
  if ((err as any).code === 'P2002') {
    res.status(409).json({ error: 'Cette ressource existe déjà (contrainte d\'unicité)' });
    return;
  }
  if ((err as any).code === 'P2025') {
    res.status(404).json({ error: 'Ressource introuvable' });
    return;
  }

  const status = (err as any).status || 500;
  res.status(status).json({
    error: err.message || 'Une erreur interne est survenue',
  });
};

export class AppError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
    this.name = 'AppError';
  }
}
