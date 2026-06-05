import { PrismaClient } from '@prisma/client';

export * from '@prisma/client';
export * from './prisma.service.js';

export const prisma = new PrismaClient();
