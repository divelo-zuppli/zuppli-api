import { Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import parameterSeed from './parameter.seed';

const prisma = new PrismaClient();

(async () => {
  Logger.log('seeding parameters...', 'seeds');
  await parameterSeed(prisma);
})()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
    Logger.log('[DONE]', 'seeds');
  });
