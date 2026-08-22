import { apiClient } from '@/lib/apiClient';
import type { FileRecord, UploadInitResponse } from '@/types/api';


export const initUpload = async (payload: {
  fileName: string;
  folderId?: string | null;
}): Promise<UploadInitResponse> => {
  const res = await apiClient.post('/uploads/init', payload);
  return { uploadId: res.data.uploadId, expiresAt: res.data.expiresAt };
};


export const streamUpload = async (
  uploadId: string,
  file: File,
  onProgress?: (percent: number) => void,
): Promise<FileRecord> => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await apiClient.post(`/uploads/${uploadId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (event) => {
      if (onProgress && event.total) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    },
  });

  return res.data.file;
};
