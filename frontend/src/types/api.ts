

export interface Tag {
  id: string;
  name: string;
}


export interface TagWithCount extends Tag {
  fileCount: number;
}

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: string;
}


export interface FileRecord {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  folderId: string | null;
  createdAt: string;
}

export interface FileWithTags extends FileRecord {
  tags: Tag[];
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface Paginated<T> {
  data: T[];
  meta: PaginationMeta;
}


export interface FolderContents {
  id?: string;
  name: string;
  parentId?: string | null;
  folders: Paginated<Folder>;
  files: Paginated<FileWithTags>;
}

export interface Breadcrumb {
  id: string;
  name: string;
  parentId: string | null;
}

export interface DownloadUrlResponse {
  url: string;
  expiresIn: number;
}

export interface TrashListing {
  files: Paginated<FileWithTags>;
  folders: Paginated<Folder>;
}

// POST /uploads/init response -- NOT nested under `data`, see apiClient.ts
export interface UploadInitResponse {
  uploadId: string;
  expiresAt: string;
}

export interface StorageUsage {
  usedBytes: number;
  quotaBytes: number;
  remainingBytes: number;
  percentageUsed: number;
}

export interface MessageResponse {
  message: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}
