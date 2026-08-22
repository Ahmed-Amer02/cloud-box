import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as api from './api';
import type { SearchFilesParams } from './api';

export function useFile(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['files', id],
    queryFn: () => api.getFile(id),
    enabled: (options?.enabled ?? true) && Boolean(id),
  });
}

export function useUpdateFile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { name?: string; folderId?: string | null } }) =>
      api.updateFile(id, payload),
    onSuccess: () => {

      queryClient.invalidateQueries({ queryKey: ['folders'] });
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });
}

export function useDeleteFile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: api.deleteFile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      queryClient.invalidateQueries({ queryKey: ['files'] });

      queryClient.invalidateQueries({ queryKey: ['storage'] });
    },
  });
}


export function useDownloadFile() {
  return useMutation({
    mutationFn: api.getDownloadUrl,
  });
}

export function useAttachTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ fileId, tagId }: { fileId: string; tagId: string }) => api.attachTag(fileId, tagId),
    onSuccess: (_data, { fileId }) => {
      queryClient.invalidateQueries({ queryKey: ['files', fileId] });
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      queryClient.invalidateQueries({ queryKey: ['tags'] }); // fileCount changed
    },
  });
}

export function useDetachTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ fileId, tagId }: { fileId: string; tagId: string }) => api.detachTag(fileId, tagId),
    onSuccess: (_data, { fileId }) => {
      queryClient.invalidateQueries({ queryKey: ['files', fileId] });
      queryClient.invalidateQueries({ queryKey: ['folders'] });
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
}


export function useSearchFiles(params: SearchFilesParams, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['files', 'search', params],
    queryFn: () => api.searchFiles(params),
    enabled: options?.enabled ?? true,
  });
}
