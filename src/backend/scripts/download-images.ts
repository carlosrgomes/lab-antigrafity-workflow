import fs from 'fs';
import path from 'path';
import https from 'https';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface IMapping {
  repoSystem: string;
  libretroFilename: string;
}

interface IGameRecord {
  id: string;
  title: string;
  imageUrl: string;
}

const GAME_MAPPING: Record<string, IMapping> = {
  'Super Mario Bros. 3': {
    repoSystem: 'Nintendo_-_Nintendo_Entertainment_System',
    libretroFilename: 'Super Mario Bros. 3 (USA)',
  },
  'Super Mario World': {
    repoSystem: 'Nintendo_-_Super_Nintendo_Entertainment_System',
    libretroFilename: 'Super Mario World (USA)',
  },
  'Sonic the Hedgehog': {
    repoSystem: 'Sega_-_Mega_Drive_-_Genesis',
    libretroFilename: 'Sonic The Hedgehog (USA, Europe)',
  },
  'Castlevania - Symphony of the Night': {
    repoSystem: 'Sony_-_PlayStation',
    libretroFilename: 'Castlevania - Symphony of the Night (USA)',
  },
  'Legend of Zelda, The - Ocarina of Time': {
    repoSystem: 'Nintendo_-_Nintendo_64',
    libretroFilename: 'Legend of Zelda, The - Ocarina of Time (USA)',
  },
  'Pokemon - Red Version': {
    repoSystem: 'Nintendo_-_Game_Boy',
    libretroFilename: 'Pokemon - Red Version (USA, Europe) (SGB Enhanced)',
  },
  'Crash Bandicoot': {
    repoSystem: 'Sony_-_PlayStation',
    libretroFilename: 'Crash Bandicoot (USA)',
  },
  'Metal Gear Solid': {
    repoSystem: 'Sony_-_PlayStation',
    libretroFilename: 'Metal Gear Solid (USA) (Disc 1)',
  },
  'Resident Evil 2': {
    repoSystem: 'Sony_-_PlayStation',
    libretroFilename: 'Resident Evil 2 (USA) (Disc 1)',
  },
  'Crisis Core - Final Fantasy VII': {
    repoSystem: 'Sony_-_PlayStation_Portable',
    libretroFilename: 'Crisis Core - Final Fantasy VII (USA)',
  },
  'God of War - Chains of Olympus': {
    repoSystem: 'Sony_-_PlayStation_Portable',
    libretroFilename: 'God of War - Chains of Olympus (USA)',
  },
  'Grand Theft Auto - Chinatown Wars': {
    repoSystem: 'Sony_-_PlayStation_Portable',
    libretroFilename: 'Grand Theft Auto - Chinatown Wars (USA)',
  },
};

/**
 * Downloads a file from a remote URL to a local destination path.
 * @param url - The remote URL to fetch.
 * @param destPath - The local path where the file will be saved.
 * @returns A promise that resolves when the download completes.
 */
function download(url: string, destPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    https
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          file.close();
          fs.unlink(destPath, () => {});
          reject(new Error(`Status code ${response.statusCode} for ${url}`));
          return;
        }
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      })
      .on('error', (err) => {
        fs.unlink(destPath, () => {});
        reject(err);
      });
  });
}

interface IDownloadScreenshotOptions {
  url: string;
  destPath: string;
  gameTitle: string;
  index: number;
}

/**
 * Helper to download a single screenshot.
 * @param options - Download settings.
 * @returns Resolves when download completes.
 */
async function downloadScreenshot(
  options: IDownloadScreenshotOptions,
): Promise<void> {
  fs.mkdirSync(path.dirname(options.destPath), { recursive: true });
  try {
    await download(options.url, options.destPath);
    // eslint-disable-next-line no-console
    console.log(
      `Downloaded screenshot ${options.index} for ${options.gameTitle}`,
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    // eslint-disable-next-line no-console
    console.warn(
      `Failed screenshot ${options.index} for ${options.gameTitle}: ${msg}`,
    );
  }
}

/**
 * Downloads screenshots for a given game.
 * @param game - The game record.
 * @param mapping - The mapping configuration.
 * @param publicDir - Path to public directory.
 * @returns Resolves when screenshots are processed.
 */
async function processScreenshots(
  game: IGameRecord,
  mapping: IMapping,
  publicDir: string,
): Promise<void> {
  const screenshots = await prisma.screenshot.findMany({
    where: { gameId: game.id },
  });
  const folders = ['Named_Snaps', 'Named_Titles'];
  for (let i = 0; i < Math.min(screenshots.length, folders.length); i++) {
    const url = `https://raw.githubusercontent.com/libretro-thumbnails/${
      mapping.repoSystem
    }/master/${folders[i]}/${encodeURIComponent(mapping.libretroFilename)}.png`;
    await downloadScreenshot({
      url,
      destPath: path.join(publicDir, screenshots[i].url),
      gameTitle: game.title,
      index: i + 1,
    });
  }
}

/**
 * Processes and downloads assets for a single game database entry.
 * @param game - The game database record.
 * @returns Resolves when assets are downloaded.
 */
async function processGame(game: IGameRecord): Promise<void> {
  const mapping = GAME_MAPPING[game.title];
  if (!mapping) {
    // eslint-disable-next-line no-console
    console.log(`No asset mapping found for: ${game.title}`);
    return;
  }

  const publicDir = path.join(process.cwd(), 'public');
  const boxartPath = path.join(publicDir, game.imageUrl);

  fs.mkdirSync(path.dirname(boxartPath), { recursive: true });

  const boxartUrl = `https://raw.githubusercontent.com/libretro-thumbnails/${
    mapping.repoSystem
  }/master/Named_Boxarts/${encodeURIComponent(mapping.libretroFilename)}.png`;

  try {
    await download(boxartUrl, boxartPath);
    // eslint-disable-next-line no-console
    console.log(`Downloaded boxart for ${game.title}`);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    // eslint-disable-next-line no-console
    console.warn(`Failed boxart for ${game.title}: ${msg}`);
  }

  await processScreenshots(game, mapping, publicDir);
}

/**
 * Main routine to query database and trigger all asset downloads.
 * @returns Resolves when all downloads finish.
 */
async function main(): Promise<void> {
  const games = await prisma.game.findMany();
  for (const game of games) {
    await processGame(game);
  }
}

main()
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error('Error in asset downloader:', err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
