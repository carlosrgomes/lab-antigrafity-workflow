import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

/**
 * Initializes the PrismaClient with the better-sqlite3 adapter.
 * @returns An instance of PrismaClient.
 */
export function createPrismaClient(): PrismaClient {
  const adapter = new PrismaBetterSqlite3({
    url: 'file:./dev.db',
  });
  return new PrismaClient({ adapter });
}

export const prisma = createPrismaClient();
export default prisma;
