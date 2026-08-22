import { apiClient } from '@/lib/apiClient';
import type {
  FileRecord,
  FileWithTags,
  DownloadUrlResponse,
  MessageResponse,
  Paginated,
  PaginationParams,
} from '@/types/api';

export const getFile = async (id: string): Promise<FileWithTags> => {
  const res = await apiClient.get(`/files/${id}`);
  return res.data.data;
};

export const getDownloadUrl = async (id: string): Promise<DownloadUrlResponse> => {
  const res = await apiClient.get(`/files/${id}/download`);
  return res.data.data;
};


export const updateFile = async (
  id: string,
  payload: { name?: string; folderId?: string | null },
): Promise<FileRecord> => {
  const res = await apiClient.patch(`/files/${id}`, payload);
  return res.data.data;
};

export const deleteFile = async (id: string): Promise<MessageResponse> => {
  const res = await apiClient.delete(`/files/${id}`);
  return res.data;
};

export const attachTag = async (fileId: string, tagId: string): Promise<FileWithTags> => {
  const res = await apiClient.post(`/files/${fileId}/tags`, { tagId });
  return res.data.data;
};

export const detachTag = async (fileId: string, tagId: string): Promise<FileWithTags> => {
  const res = await apiClient.delete(`/files/${fileId}/tags/${tagId}`);
  return res.data.data;
};

export interface SearchFilesParams extends PaginationParams {
  name?: string;
  mimeType?: string;
  tagId?: string;
}

export const searchFiles = async (params: SearchFilesParams): Promise<Paginated<FileWithTags>> => {
  const res = await apiClient.get('/files/search', { params });
  return res.data.data;
};
