import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { GameService, OrderService } from './services.js';

const gameService = new GameService();
const orderService = new OrderService();

export const CreateGameSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  rarity: z.enum(['Common', 'Rare', 'UltraRare']),
  consoleName: z.string().min(1),
  stock: z.number().int().nonnegative(),
  condition: z.string().min(1),
  developer: z.string().min(1),
  releaseYear: z.number().int().positive(),
  screenshots: z.array(z.string()).optional(),
});

export const CreateOrderSchema = z.object({
  items: z
    .array(
      z.object({
        gameId: z.string().min(1),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1),
});

/**
 * Controller for game-related HTTP requests.
 */
export class GameController {
  /**
   * Retrieves all games matching search and console criteria.
   * @param req - Express Request object.
   * @param res - Express Response object.
   * @param next - Express Next function.
   * @returns Resolves when response is sent.
   */
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const search = req.query.q ? String(req.query.q) : undefined;
      const consoleFilter = req.query.console
        ? String(req.query.console)
        : undefined;
      const games = await gameService.getAll(search, consoleFilter);
      res.json(games);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Retrieves a single game detail by id.
   * @param req - Express Request object.
   * @param res - Express Response object.
   * @param next - Express Next function.
   * @returns Resolves when response is sent.
   */
  async getById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const game = await gameService.getById(req.params.id);
      if (!game) {
        res.status(404).json({ error: true, message: 'Game not found' });
        return;
      }
      res.json(game);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Creates a new game entry in the catalog (Admin feature).
   * @param req - Express Request.
   * @param res - Express Response.
   * @param next - Express Next.
   * @returns Resolves when response is sent.
   */
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsedData = CreateGameSchema.parse(req.body);
      const newGame = await gameService.create(parsedData);
      res.status(201).json(newGame);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Deletes a game entry (Admin feature).
   * @param req - Express Request.
   * @param res - Express Response.
   * @param next - Express Next.
   * @returns Resolves when response is sent.
   */
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await gameService.delete(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

/**
 * Controller for order-related HTTP requests.
 */
export class OrderController {
  /**
   * Places a simulated order.
   * @param req - Express Request.
   * @param res - Express Response.
   * @param next - Express Next.
   * @returns Resolves when response is sent.
   */
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsedData = CreateOrderSchema.parse(req.body);
      const order = await orderService.create(parsedData.items);
      res.status(201).json(order);
    } catch (err) {
      next(err);
    }
  }
}
