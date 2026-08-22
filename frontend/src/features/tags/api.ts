import { apiClient } from '@/lib/apiClient';
import type { Tag, TagWithCount, MessageResponse } from '@/types/api';

export const createTag = async (name: string): Promise<Tag> => {
  const res = await apiClient.post('/tags', { name });
  return res.data.data;
};

export const getTags = async (): Promise<TagWithCount[]> => {
  const res = await apiClient.get('/tags');
  return res.data.data;
};

export const deleteTag = async (id: string): Promise<MessageResponse> => {
  const res = await apiClient.delete(`/tags/${id}`);
  return res.data;
};
