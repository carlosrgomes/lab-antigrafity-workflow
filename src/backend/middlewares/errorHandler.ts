import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../services.js';

/**
 * Centralized Express error-handling middleware.
 * @param err - The error instance.
 * @param _req - Express Request object.
 * @param res - Express Response object.
 * @param _next - Express NextFunction callback.
 */
// eslint-disable-next-line max-params
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: true, message: err.message });
    return;
  }
  if (err instanceof ZodError) {
    res.status(400).json({
      error: true,
      message: 'Validation failed',
      errors: err.errors,
    });
    return;
  }
  res.status(500).json({ error: true, message: 'Internal server error' });
}
