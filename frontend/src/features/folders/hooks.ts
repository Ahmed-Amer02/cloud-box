import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as api from './api';
import type { PaginationParams } from '@/types/api';

export function useRootFolders(params?: PaginationParams, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['folders', 'root', params],
    queryFn: () => api.getRootFolders(params),
    enabled: options?.enabled ?? true,
  });
}

export function useFolder(id: string, params?: PaginationParams, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['folders', id, params],
    queryFn: () => api.getFolder(id, params),
    enabled: (options?.enabled ?? true) && Boolean(id),
  });
}

export function useBreadcrumbs(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['folders', id, 'breadcrumbs'],
    queryFn: () => api.getBreadcrumbs(id),
    enabled: (options?.enabled ?? true) && Boolean(id),
  });
}

export function useCreateFolder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.createFolder,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['folders'] }),
  });
}

export function useUpdateFolder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { name?: string; parentId?: string | null } }) =>
      api.updateFolder(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['folders'] }),
  });
}

export function useDeleteFolder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteFolder,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['folders'] }),
  });
}
