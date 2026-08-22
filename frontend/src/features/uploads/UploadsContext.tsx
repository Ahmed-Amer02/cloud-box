import { createContext, useContext, useState, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { initUpload, streamUpload } from './api';
import { MAX_UPLOAD_SIZE_BYTES } from './constants';

export interface UploadItem {
  id: string;
  fileName: string;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
}

interface UploadsContextValue {
  uploads: UploadItem[];
  addFiles: (files: File[], folderId: string | null) => void;
  dismiss: (id: string) => void;
}

const UploadsContext = createContext<UploadsContextValue | undefined>(undefined);

export function UploadsProvider({ children }: { children: ReactNode }) {
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const queryClient = useQueryClient();

  const updateItem = (id: string, patch: Partial<UploadItem>) => {
    setUploads((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const uploadOne = async (id: string, file: File, folderId: string | null) => {
    try {
      const { uploadId } = await initUpload({ fileName: file.name, folderId });
      await streamUpload(uploadId, file, (percent) => updateItem(id, { progress: percent }));
      updateItem(id, { status: 'success', progress: 100 });

      queryClient.invalidateQueries({ queryKey: ['folders'] });
      queryClient.invalidateQueries({ queryKey: ['files'] });
      queryClient.invalidateQueries({ queryKey: ['storage'] });
    } catch (error) {

      updateItem(id, {
        status: 'error',
        error: error instanceof Error ? error.message : 'Upload failed.',
      });
    }
  };

  const addFiles = (files: File[], folderId: string | null) => {
    files.forEach((file) => {
      const id = crypto.randomUUID();

      if (file.size > MAX_UPLOAD_SIZE_BYTES) {
        setUploads((prev) => [
          ...prev,
          { id, fileName: file.name, progress: 0, status: 'error', error: 'File exceeds the 100MB limit.' },
        ]);
        return;
      }

      setUploads((prev) => [...prev, { id, fileName: file.name, progress: 0, status: 'uploading' }]);
      void uploadOne(id, file, folderId);
    });
  };

  const dismiss = (id: string) => {
    setUploads((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <UploadsContext.Provider value={{ uploads, addFiles, dismiss }}>
      {children}
    </UploadsContext.Provider>
  );
}

export function useUploads() {
  const ctx = useContext(UploadsContext);
  if (!ctx) {
    throw new Error('useUploads must be used within an UploadsProvider');
  }
  return ctx;
}
