import prisma from '../config/prisma.js';

export const getCurrentStorageUsage = async (userId) => {
  const result = await prisma.file.aggregate({
    where: { userId, deletedAt: null },
    _sum: { size: true },
  });

  return result._sum.size ?? 0;
};
