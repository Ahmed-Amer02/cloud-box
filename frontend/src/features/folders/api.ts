import { apiClient } from '@/lib/apiClient';
import type { Folder, FolderContents, Breadcrumb, MessageResponse, PaginationParams } from '@/types/api';

export const getRootFolders = async (params?: PaginationParams): Promise<FolderContents> => {
  const res = await apiClient.get('/folders', { params });
  return res.data.data;
};

export const getFolder = async (id: string, params?: PaginationParams): Promise<FolderContents> => {
  const res = await apiClient.get(`/folders/${id}`, { params });
  return res.data.data;
};

export const createFolder = async (payload: {
  name: string;
  parentId?: string | null;
}): Promise<Folder> => {
  const res = await apiClient.post('/folders', payload);
  return res.data.data;
};

export const updateFolder = async (
  id: string,
  payload: { name?: string; parentId?: string | null },
): Promise<Folder> => {
  const res = await apiClient.patch(`/folders/${id}`, payload);
  return res.data.data;
};

export const deleteFolder = async (id: string): Promise<MessageResponse> => {
  const res = await apiClient.delete(`/folders/${id}`);
  return res.data;
};

export const getBreadcrumbs = async (id: string): Promise<Breadcrumb[]> => {
  const res = await apiClient.get(`/folders/${id}/breadcrumbs`);
  return res.data.data;
};
