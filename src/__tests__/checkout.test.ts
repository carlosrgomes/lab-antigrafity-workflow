import { PrismaClient } from '@prisma/client';
import { OrderService, AppError } from '../backend/services.js';

const prisma = new PrismaClient();
const orderService = new OrderService();

describe('Checkout Flow Integration Tests', () => {
  let testGameId: string;

  beforeAll(async () => {
    // Ensure we have a clean test game
    const game = await prisma.game.create({
      data: {
        title: 'Test Checkout Game',
        description: 'Test Description',
        price: 10.0,
        rarity: 'Common',
        console: 'NES',
        stock: 5,
        imageUrl: '/test.png',
        condition: 'Good',
        developer: 'Test Dev',
        releaseYear: 1990,
      },
    });
    testGameId = game.id;
  });

  afterAll(async () => {
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    // Use deleteMany to avoid errors if the game is already deleted
    await prisma.game.deleteMany({ where: { id: testGameId } });
    await prisma.$disconnect();
  });

  test('should successfully place order and decrement stock', async () => {
    const order = await orderService.create([
      { gameId: testGameId, quantity: 2 },
    ]);
    expect(order.total).toBe(20.0);
    expect(order.status).toBe('COMPLETED');

    const updatedGame = await prisma.game.findUnique({
      where: { id: testGameId },
    });
    expect(updatedGame?.stock).toBe(3);
  });

  test('should fail when ordering more than available stock', async () => {
    await expect(
      orderService.create([{ gameId: testGameId, quantity: 10 }]),
    ).rejects.toThrow(AppError);
  });

  test('should fail when ordering non-existent game', async () => {
    await expect(
      orderService.create([
        { gameId: '00000000-0000-0000-0000-000000000000', quantity: 1 },
      ]),
    ).rejects.toThrow(AppError);
  });
});
