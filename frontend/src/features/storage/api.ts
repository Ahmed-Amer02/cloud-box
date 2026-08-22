import { apiClient } from '@/lib/apiClient';
import type { StorageUsage } from '@/types/api';

export const getUsage = async (): Promise<StorageUsage> => {
  const res = await apiClient.get('/storage/usage');
  return res.data.data;
};
