import { prisma } from './db.js';

const INITIAL_GAMES = [
  {
    title: 'Super Mario World',
    description:
      'The classic SNES platformer featuring Mario, Luigi, and Yoshi.',
    price: 49.99,
    rarity: 'Common',
    console: 'SNES',
    stock: 15,
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400',
    screenshots: JSON.stringify([
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600',
      'https://images.unsplash.com/photo-1531525645387-7f14be1bdbbd?w=600',
    ]),
  },
  {
    title: 'The Legend of Zelda: Ocarina of Time',
    description: 'The legendary N64 adventure game in the kingdom of Hyrule.',
    price: 89.99,
    rarity: 'Rare',
    console: 'N64',
    stock: 5,
    imageUrl:
      'https://images.unsplash.com/photo-1500996911926-67523f4f4f94?w=400',
    screenshots: JSON.stringify([
      'https://images.unsplash.com/photo-1612287230202-1bf1d85d1bdf?w=600',
    ]),
  },
  {
    title: 'Sonic the Hedgehog 2',
    description: 'Sega Genesis platformer featuring Sonic and Tails.',
    price: 39.99,
    rarity: 'Common',
    console: 'MegaDrive',
    stock: 20,
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400',
    screenshots: JSON.stringify([
      'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=600',
    ]),
  },
  {
    title: 'Castlevania: Symphony of the Night',
    description:
      'Highly acclaimed action RPG platformer for the original PlayStation.',
    price: 149.99,
    rarity: 'UltraRare',
    console: 'PS1',
    stock: 2,
    imageUrl:
      'https://images.unsplash.com/photo-1580234810907-b40315b76418?w=400',
    screenshots: JSON.stringify([
      'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=600',
    ]),
  },
  {
    title: 'Pokémon Red Version',
    description: 'The classic Game Boy RPG that started a global phenomenon.',
    price: 120.0,
    rarity: 'Rare',
    console: 'GameBoy',
    stock: 4,
    imageUrl:
      'https://images.unsplash.com/photo-1605899435973-ca2d1a8861cf?w=400',
    screenshots: JSON.stringify([
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600',
    ]),
  },
];

/**
 * Seeds the SQLite database with initial retro games catalog.
 */
export async function seed(): Promise<void> {
  const gamesCount = await prisma.game.count();
  if (gamesCount > 0) {
    return;
  }

  for (const game of INITIAL_GAMES) {
    await prisma.game.create({ data: game });
  }
}

seed()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('Database successfully seeded.');
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error('Error seeding database:', err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
