import { PrismaClient } from '@prisma/client';
import { GameService } from '../backend/services.js';

const prisma = new PrismaClient();
const gameService = new GameService();

describe('PS2 Games Catalog Integration Tests', () => {
  let testGameId: string;

  beforeAll(async () => {
    await prisma.game.deleteMany({ where: { title: 'Test PS2 Game' } });
  });

  afterAll(async () => {
    if (testGameId) {
      await prisma.game.deleteMany({ where: { id: testGameId } });
    }
    await prisma.$disconnect();
  });

  test('should successfully create a new PS2 game', async () => {
    const game = await gameService.create({
      title: 'Test PS2 Game',
      description: 'An iconic PS2 test game.',
      price: 59.9,
      rarity: 'Common',
      consoleName: 'PS2',
      stock: 10,
      condition: 'CIB',
      developer: 'Test Studio',
      releaseYear: 2004,
      screenshots: ['/test1.png', '/test2.png'],
    });

    expect(game.id).toBeDefined();
    expect(game.console).toBe('PS2');
    testGameId = game.id;

    // Verify in db
    const dbGame = await prisma.game.findUnique({
      where: { id: game.id },
      include: { screenshots: true },
    });
    expect(dbGame?.title).toBe('Test PS2 Game');
    expect(dbGame?.screenshots.length).toBe(2);
  });

  test('should retrieve PS2 games via getAll with console filter', async () => {
    const allGames = await gameService.getAll(undefined, 'PS2');
    const ps2Game = allGames.find((g) => g.title === 'Test PS2 Game');
    expect(ps2Game).toBeDefined();
    expect(ps2Game?.console).toBe('PS2');
  });
});
