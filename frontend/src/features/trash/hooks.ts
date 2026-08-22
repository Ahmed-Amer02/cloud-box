import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as api from './api';
import type { ListTrashParams } from './api';

export function useTrash(params?: ListTrashParams) {
  return useQuery({
    queryKey: ['trash', params],
    queryFn: () => api.listTrash(params),
  });
}

export function useRestoreFile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.restoreFile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trash'] });
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      queryClient.invalidateQueries({ queryKey: ['files'] });
      // Restoring clears deletedAt, so the file counts toward quota again.
      queryClient.invalidateQueries({ queryKey: ['storage'] });
    },
  });
}

export function useRestoreFolder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.restoreFolder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trash'] });
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      queryClient.invalidateQueries({ queryKey: ['files'] });

      queryClient.invalidateQueries({ queryKey: ['storage'] });
    },
  });
}

export function usePermanentDeleteFile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.permanentDeleteFile,

    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['trash'] }),
  });
}

export function usePermanentDeleteFolder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.permanentDeleteFolder,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['trash'] }),
  });
}
