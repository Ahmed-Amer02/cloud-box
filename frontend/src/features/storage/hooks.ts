import { useQuery } from '@tanstack/react-query';
import { getUsage } from './api';

export function useStorageUsage() {
  return useQuery({
    queryKey: ['storage', 'usage'],
    queryFn: getUsage,
  });
}
