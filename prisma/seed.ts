import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface IGameSeed {
  title: string;
  description: string;
  price: number;
  rarity: string;
  console: string;
  stock: number;
  condition: string;
  developer: string;
  releaseYear: number;
  repoSystem: string;
  libretroFilename: string;
}

const GAMES_TO_SEED: IGameSeed[] = [
  {
    title: 'Super Mario Bros. 3',
    description:
      'The legendary NES platformer where Mario and Luigi rescue the Mushroom World.',
    price: 49.99,
    rarity: 'Common',
    console: 'NES',
    stock: 15,
    condition: 'CIB',
    developer: 'Nintendo R&D4',
    releaseYear: 1988,
    repoSystem: 'Nintendo_-_Nintendo_Entertainment_System',
    libretroFilename: 'Super Mario Bros. 3 (USA)',
  },
  {
    title: 'Super Mario World',
    description:
      'The definitive 16-bit SNES adventure featuring Yoshi and secret world exits.',
    price: 59.99,
    rarity: 'Common',
    console: 'SNES',
    stock: 20,
    condition: 'Mint',
    developer: 'Nintendo EAD',
    releaseYear: 1990,
    repoSystem: 'Nintendo_-_Super_Nintendo_Entertainment_System',
    libretroFilename: 'Super Mario World (USA)',
  },
  {
    title: 'Sonic the Hedgehog',
    description:
      "Sega's high-speed blue hedgehog debuts to save animals from Dr. Robotnik.",
    price: 39.99,
    rarity: 'Common',
    console: 'MegaDrive',
    stock: 12,
    condition: 'Good',
    developer: 'Sonic Team',
    releaseYear: 1991,
    repoSystem: 'Sega_-_Mega_Drive_-_Genesis',
    libretroFilename: 'Sonic The Hedgehog (USA, Europe)',
  },
  {
    title: 'Castlevania - Symphony of the Night',
    description:
      'The masterpiece Metroidvania combining gothic action with deep RPG mechanics.',
    price: 199.99,
    rarity: 'Rare',
    console: 'PS1',
    stock: 3,
    condition: 'Mint',
    developer: 'Konami',
    releaseYear: 1997,
    repoSystem: 'Sony_-_PlayStation',
    libretroFilename: 'Castlevania - Symphony of the Night (USA)',
  },
  {
    title: 'Legend of Zelda, The - Ocarina of Time',
    description:
      "A revolutionary 3D masterpiece detailing Link's time-traveling quest in Hyrule.",
    price: 89.99,
    rarity: 'Rare',
    console: 'N64',
    stock: 5,
    condition: 'CIB',
    developer: 'Nintendo EAD',
    releaseYear: 1998,
    repoSystem: 'Nintendo_-_Nintendo_64',
    libretroFilename: 'Legend of Zelda, The - Ocarina of Time (USA)',
  },
  {
    title: 'Pokemon - Red Version',
    description:
      'The original Game Boy classic that launched a global monster catching phenomenon.',
    price: 149.99,
    rarity: 'UltraRare',
    console: 'GameBoy',
    stock: 2,
    condition: 'CIB',
    developer: 'Game Freak',
    releaseYear: 1996,
    repoSystem: 'Nintendo_-_Game_Boy',
    libretroFilename: 'Pokemon - Red Version (USA, Europe) (SGB Enhanced)',
  },
  {
    title: 'Crash Bandicoot',
    description:
      'The classic platformer featuring Crash Bandicoot saving the world from Dr. Neo Cortex.',
    price: 39.99,
    rarity: 'Common',
    console: 'PS1',
    stock: 8,
    condition: 'CIB',
    developer: 'Naughty Dog',
    releaseYear: 1996,
    repoSystem: 'Sony_-_PlayStation',
    libretroFilename: 'Crash Bandicoot (USA)',
  },
  {
    title: 'Metal Gear Solid',
    description:
      'Tactical espionage action masterpiece directed by Hideo Kojima.',
    price: 79.99,
    rarity: 'Rare',
    console: 'PS1',
    stock: 4,
    condition: 'CIB',
    developer: 'Konami',
    releaseYear: 1998,
    repoSystem: 'Sony_-_PlayStation',
    libretroFilename: 'Metal Gear Solid (USA) (Disc 1)',
  },
  {
    title: 'Resident Evil 2',
    description:
      'The survival horror classic following Leon Kennedy and Claire Redfield in Raccoon City.',
    price: 69.99,
    rarity: 'Common',
    console: 'PS1',
    stock: 6,
    condition: 'Good',
    developer: 'Capcom',
    releaseYear: 1998,
    repoSystem: 'Sony_-_PlayStation',
    libretroFilename: 'Resident Evil 2 (USA) (Disc 1)',
  },
  {
    title: 'Crisis Core - Final Fantasy VII',
    description:
      'The emotional prequel to Final Fantasy VII starring Zack Fair.',
    price: 49.99,
    rarity: 'Common',
    console: 'PSP',
    stock: 10,
    condition: 'CIB',
    developer: 'Square Enix',
    releaseYear: 2007,
    repoSystem: 'Sony_-_PlayStation_Portable',
    libretroFilename: 'Crisis Core - Final Fantasy VII (USA)',
  },
  {
    title: 'God of War - Chains of Olympus',
    description:
      "Kratos' epic journey on the PSP, setting the standard for portable action games.",
    price: 29.99,
    rarity: 'Common',
    console: 'PSP',
    stock: 12,
    condition: 'Good',
    developer: 'Ready at Dawn',
    releaseYear: 2008,
    repoSystem: 'Sony_-_PlayStation_Portable',
    libretroFilename: 'God of War - Chains of Olympus (USA)',
  },
  {
    title: 'Grand Theft Auto - Chinatown Wars',
    description:
      'The critically acclaimed open-world action-adventure game designed specifically for portable screens.',
    price: 29.99,
    rarity: 'Common',
    console: 'PSP',
    stock: 15,
    condition: 'CIB',
    developer: 'Rockstar Leeds',
    releaseYear: 2009,
    repoSystem: 'Sony_-_PlayStation_Portable',
    libretroFilename: 'Grand Theft Auto - Chinatown Wars (USA)',
  },
];

/**
 * Seeds a single game and its related screenshots into the database.
 *
 * @param {IGameSeed} item The game seed configuration data.
 * @returns {Promise<void>} Resolves when the game and its screenshots are seeded.
 */
async function seedGame(item: IGameSeed): Promise<void> {
  const imageUrl = `/images/boxarts/${item.title.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
  const game = await prisma.game.create({
    data: {
      title: item.title,
      description: item.description,
      price: item.price,
      rarity: item.rarity,
      console: item.console,
      stock: item.stock,
      imageUrl: imageUrl,
      condition: item.condition,
      developer: item.developer,
      releaseYear: item.releaseYear,
    },
  });

  const screenshots = [
    `/images/screenshots/${game.id}_1.png`,
    `/images/screenshots/${game.id}_2.png`,
  ];

  await prisma.screenshot.createMany({
    data: screenshots.map((url) => ({
      url: url,
      gameId: game.id,
    })),
  });
}

/**
 * Main seed execution routine.
 *
 * @returns {Promise<void>} Resolves when all games have been seeded successfully.
 */
async function main(): Promise<void> {
  console.log('Starting catalog seeding...');
  await prisma.screenshot.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.game.deleteMany();

  for (const item of GAMES_TO_SEED) {
    await seedGame(item);
  }
  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
