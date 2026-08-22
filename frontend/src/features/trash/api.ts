import { apiClient } from '@/lib/apiClient';
import type { TrashListing, MessageResponse, FileRecord, PaginationParams } from '@/types/api';

export interface ListTrashParams extends PaginationParams {
  type?: 'file' | 'folder';
}

export const listTrash = async (params?: ListTrashParams): Promise<TrashListing> => {
  const res = await apiClient.get('/trash', { params });
  return res.data.data;
};


export const restoreFile = async (id: string): Promise<FileRecord> => {
  const res = await apiClient.post(`/trash/files/${id}/restore`);
  return res.data.data;
};

export const restoreFolder = async (id: string): Promise<MessageResponse> => {
  const res = await apiClient.post(`/trash/folders/${id}/restore`);
  return res.data;
};

export const permanentDeleteFile = async (id: string): Promise<MessageResponse> => {
  const res = await apiClient.delete(`/trash/files/${id}`);
  return res.data;
};

export const permanentDeleteFolder = async (id: string): Promise<MessageResponse> => {
  const res = await apiClient.delete(`/trash/folders/${id}`);
  return res.data;
};
