import express, { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from './db.js';

const app = express();
app.use(express.json());

// Enable CORS for development
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  next();
});

const orderSchema = z.object({
  items: z
    .array(
      z.object({
        gameId: z.string().uuid(),
        quantity: z.number().int().positive(),
      }),
    )
    .nonempty(),
});

/**
 * Builds database filter query for games catalog.
 * @param query Express query params.
 * @returns Prisma query conditions.
 */
function buildGamesWhere(query: Record<string, unknown>) {
  const where: Record<string, unknown> = {};
  if (typeof query.console === 'string') {
    where.console = query.console;
  }
  if (typeof query.rarity === 'string') {
    where.rarity = query.rarity;
  }
  if (typeof query.search === 'string') {
    where.title = { contains: query.search };
  }
  return where;
}

/**
 * Handles GET /api/games to retrieve the catalog.
 * @param req Express request.
 * @param res Express response.
 */
async function handleGetGames(req: Request, res: Response): Promise<void> {
  const where = buildGamesWhere(req.query as Record<string, unknown>);
  const games = await prisma.game.findMany({ where });
  res.json(games);
}

/**
 * Handles GET /api/games/:id to retrieve a specific game.
 * @param req Express request.
 * @param res Express response.
 */
async function handleGetGameById(req: Request, res: Response): Promise<void> {
  const game = await prisma.game.findUnique({
    where: { id: req.params.id as string },
  });
  if (!game) {
    res.status(404).json({ error: 'Game not found.' });
    return;
  }
  res.json(game);
}

/**
 * Validates stock availability for an order item.
 * @param gameId Game identifier.
 * @param quantity Requested quantity.
 * @returns The game record.
 */
async function validateStock(gameId: string, quantity: number) {
  const game = await prisma.game.findUnique({ where: { id: gameId } });
  if (!game) {
    throw new Error(`Game with ID ${gameId} not found.`);
  }
  if (game.stock < quantity) {
    throw new Error(`Insufficient stock for ${game.title}.`);
  }
  return game;
}

/**
 * Interface representing a verified order item.
 */
interface IVerifiedOrderItem {
  item: { gameId: string; quantity: number };
  game: { id: string; price: number };
}

/**
 * Saves the order and order items in a transaction, and decrements game stocks.
 * @param verifiedItems List of verified order items.
 * @param total Total cost of the order.
 * @returns The created order.
 */
async function saveOrder(verifiedItems: IVerifiedOrderItem[], total: number) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: { total, status: 'COMPLETED' },
    });
    for (const { item, game } of verifiedItems) {
      await tx.orderItem.create({
        data: {
          orderId: order.id,
          gameId: item.gameId,
          quantity: item.quantity,
          price: game.price,
        },
      });
      await tx.game.update({
        where: { id: item.gameId },
        data: { stock: { decrement: item.quantity } },
      });
    }
    return order;
  });
}

/**
 * Processes checkout order validation and transaction.
 * @param items List of requested order items.
 * @returns The created order.
 */
async function processCheckout(items: { gameId: string; quantity: number }[]) {
  const verifiedItems: IVerifiedOrderItem[] = [];
  let total = 0;

  for (const item of items) {
    const game = await validateStock(item.gameId, item.quantity);
    total += game.price * item.quantity;
    verifiedItems.push({ item, game });
  }

  return saveOrder(verifiedItems, total);
}

/**
 * Handles POST /api/orders to execute simulated checkout.
 * @param req Express request.
 * @param res Express response.
 */
async function handleCreateOrder(req: Request, res: Response): Promise<void> {
  const parsed = orderSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues });
    return;
  }

  try {
    const order = await processCheckout(parsed.data.items);
    res.status(201).json(order);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Checkout failed';
    res.status(400).json({ error: message });
  }
}

app.get('/api/games', (req, res, next) => handleGetGames(req, res).catch(next));
app.get('/api/games/:id', (req, res, next) =>
  handleGetGameById(req, res).catch(next),
);
app.post('/api/orders', (req, res, next) =>
  handleCreateOrder(req, res).catch(next),
);

export default app;
