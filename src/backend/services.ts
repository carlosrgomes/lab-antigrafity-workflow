import { PrismaClient, Game, Order, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export interface ICreateGameInput {
  title: string;
  description: string;
  price: number;
  rarity: string;
  consoleName: string;
  stock: number;
  condition: string;
  developer: string;
  releaseYear: number;
  screenshots?: string[];
}

/**
 * Standard custom application error representing HTTP error states.
 */
export class AppError extends Error {
  /**
   * Constructor for custom application errors.
   * @param statusCode - HTTP status code.
   * @param message - Error description message.
   */
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * Service to handle Game business logic.
 */
export class GameService {
  /**
   * Fetches all games matching search query and console filter.
   * @param search - Title search query.
   * @param consoleFilter - Console category filter.
   * @returns The list of matching games.
   */
  async getAll(search?: string, consoleFilter?: string): Promise<Game[]> {
    const where: Prisma.GameWhereInput = {};
    if (search) {
      where.title = { contains: search };
    }
    if (consoleFilter) {
      where.console = consoleFilter;
    }
    return prisma.game.findMany({
      where,
      include: { screenshots: true },
    });
  }

  /**
   * Fetches a game by its identifier.
   * @param id - The game unique identifier.
   * @returns The game details or null if not found.
   */
  async getById(id: string): Promise<Game | null> {
    return prisma.game.findUnique({
      where: { id },
      include: { screenshots: true },
    });
  }

  /**
   * Creates a new game with its associated screenshots.
   * @param data - The game creation properties.
   * @returns The created game.
   */
  async create(data: ICreateGameInput): Promise<Game> {
    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const filename = data.title.replace(/[^a-zA-Z0-9]/g, '_');
      const game = await tx.game.create({
        data: {
          title: data.title,
          description: data.description,
          price: data.price,
          rarity: data.rarity,
          console: data.consoleName,
          stock: data.stock,
          imageUrl: `/images/boxarts/${filename}.png`,
          condition: data.condition,
          developer: data.developer,
          releaseYear: data.releaseYear,
        },
      });
      if (data.screenshots && data.screenshots.length > 0) {
        await tx.screenshot.createMany({
          data: data.screenshots.map((url) => ({ url, gameId: game.id })),
        });
      }
      return game;
    });
  }

  /**
   * Deletes a game by id.
   * @param id - The game unique identifier.
   * @returns Resolves when delete completes.
   */
  async delete(id: string): Promise<void> {
    await prisma.game.delete({ where: { id } });
  }
}

/**
 * Service to handle Order placement logic.
 */
export class OrderService {
  /**
   * Processes a single order item: validates stock and updates inventory.
   * @param tx - The active Prisma transaction client.
   * @param gameId - The target game ID.
   * @param quantity - Quantity ordered.
   * @returns Order item detail.
   */
  private async processOrderItem(
    tx: Prisma.TransactionClient,
    gameId: string,
    quantity: number,
  ): Promise<{ gameId: string; quantity: number; price: number }> {
    const game = await tx.game.findUnique({ where: { id: gameId } });
    if (!game) {
      throw new AppError(404, `Game with ID ${gameId} not found.`);
    }
    if (game.stock < quantity) {
      throw new AppError(400, `Insufficient stock for ${game.title}.`);
    }
    await tx.game.update({
      where: { id: gameId },
      data: { stock: game.stock - quantity },
    });
    return { gameId, quantity, price: game.price };
  }

  /**
   * Places an order and updates inventory stock.
   * @param items - Cart items.
   * @returns The created order.
   */
  async create(items: { gameId: string; quantity: number }[]): Promise<Order> {
    if (!items?.length) {
      throw new AppError(400, 'Order must contain items.');
    }
    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const orderItems = [];
      let total = 0;
      for (const item of items) {
        const row = await this.processOrderItem(tx, item.gameId, item.quantity);
        total += row.price * row.quantity;
        orderItems.push(row);
      }
      return tx.order.create({
        data: { total, status: 'COMPLETED', items: { create: orderItems } },
        include: { items: true },
      });
    });
  }
}
