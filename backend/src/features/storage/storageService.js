import { getCurrentStorageUsage } from '../../lib/storageUsage.js';
import { STORAGE_QUOTA_BYTES } from '../uploads/uploadsConfig.js';

export const getStorageUsage = async (userId) => {
  const usedBytes = await getCurrentStorageUsage(userId);
  const remainingBytes = Math.max(STORAGE_QUOTA_BYTES - usedBytes, 0);
  const percentageUsed = STORAGE_QUOTA_BYTES > 0 ? (usedBytes / STORAGE_QUOTA_BYTES) * 100 : 0;

  return {
    usedBytes,
    quotaBytes: STORAGE_QUOTA_BYTES,
    remainingBytes,
    percentageUsed: Math.round(percentageUsed * 100) / 100, // 2 decimal places
  };
};
