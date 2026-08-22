import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FolderPlus, Inbox, Upload } from 'lucide-react';
import { toast } from 'sonner';
import PageHeader from '@/components/shared/PageHeader';
import Breadcrumbs from '@/components/shared/Breadcrumbs';
import EmptyState from '@/components/shared/EmptyState';
import PaginationControls from '@/components/shared/PaginationControls';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import FolderPickerDialog from '@/components/shared/FolderPickerDialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useRootFolders,
  useFolder,
  useBreadcrumbs,
  useUpdateFolder,
  useDeleteFolder,
} from '@/features/folders/hooks';
import { useFileActions } from '@/features/files/useFileActions';
import { useUploads } from '@/features/uploads/UploadsContext';
import FolderRow from '@/features/folders/components/FolderRow';
import FolderFormDialog from '@/features/folders/components/FolderFormDialog';
import FileRow from '@/features/files/components/FileRow';
import type { Folder } from '@/types/api';

function FilesPage() {
  const { folderId } = useParams<{ folderId?: string }>();
  const isRoot = !folderId;
  const [page, setPage] = useState(1);

  useEffect(() => setPage(1), [folderId]);

  const rootQuery = useRootFolders({ page }, { enabled: isRoot });
  const nestedQuery = useFolder(folderId ?? '', { page }, { enabled: !isRoot });
  const { data, isLoading, isError, refetch } = isRoot ? rootQuery : nestedQuery;

  const breadcrumbsQuery = useBreadcrumbs(folderId ?? '', { enabled: !isRoot });

  const updateFolder = useUpdateFolder();
  const deleteFolder = useDeleteFolder();
  const fileActions = useFileActions();

  const [formDialog, setFormDialog] = useState<{ open: boolean; folder?: Folder }>({ open: false });
  const [moveTarget, setMoveTarget] = useState<Folder | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Folder | null>(null);

  const { addFiles } = useUploads();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const folders = data?.folders.data ?? [];
  const files = data?.files.data ?? [];
  const foldersMeta = data?.folders.meta;
  const filesMeta = data?.files.meta;

  const totalPages = Math.max(foldersMeta?.totalPages ?? 1, filesMeta?.totalPages ?? 1);
  const hasNextPage = Boolean(foldersMeta?.hasNextPage) || Boolean(filesMeta?.hasNextPage);

  const breadcrumbItems = [
    { id: 'root', name: 'Files', href: '/files' },
    ...(breadcrumbsQuery.data?.map((b) => ({ id: b.id, name: b.name, href: `/files/${b.id}` })) ?? []),
  ];

  const handleMove = (targetFolderId: string | null) => {
    if (!moveTarget) return;
    updateFolder.mutate(
      { id: moveTarget.id, payload: { parentId: targetFolderId } },
      {
        onSuccess: () => {
          toast.success('Folder moved');
          setMoveTarget(null);
        },
        onError: (error) => {
          toast.error(error instanceof Error ? error.message : 'Could not move folder.');
        },
      },
    );
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteFolder.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast.success('Folder moved to trash');
        setDeleteTarget(null);
      },
      onError: (error) => {
        toast.error(error instanceof Error ? error.message : 'Could not delete folder.');
      },
    });
  };

  return (
    <>
      <PageHeader
        title={isRoot ? <span className="font-mono text-sm text-ink-muted">Files</span> : <Breadcrumbs items={breadcrumbItems} />}
      >
        <Button variant="secondary" onClick={() => setFormDialog({ open: true })}>
          <FolderPlus className="h-4 w-4" /> New folder
        </Button>
        <Button variant="primary" onClick={() => fileInputRef.current?.click()}>
          <Upload className="h-4 w-4" /> Upload
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              addFiles(Array.from(e.target.files), folderId ?? null);
              e.target.value = '';
            }
          }}
        />
      </PageHeader>

      <div
        className="relative flex flex-1 flex-col"
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files.length > 0) {
            addFiles(Array.from(e.dataTransfer.files), folderId ?? null);
          }
        }}
      >
        {isDragging && (
          <div className="pointer-events-none absolute inset-2 z-10 flex items-center justify-center rounded-card border-2 border-dashed border-accent bg-accent-soft/70">
            <p className="font-display text-sm font-medium text-accent">Drop to upload</p>
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col gap-3 p-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        )}

        {isError && !isLoading && (
          <div className="flex flex-col items-center gap-3 border-l-2 border-danger bg-danger/5 p-6 text-center">
            <p className="text-sm text-ink">Couldn&apos;t load this folder.</p>
            <Button variant="secondary" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        )}

        {!isLoading && !isError && folders.length === 0 && files.length === 0 && (
          <EmptyState
            icon={Inbox}
            title="This folder is empty"
            description="Create a folder to get organized, or upload files here."
            action={
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => setFormDialog({ open: true })}>
                  <FolderPlus className="h-4 w-4" /> New folder
                </Button>
                <Button variant="primary" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="h-4 w-4" /> Upload
                </Button>
              </div>
            }
          />
        )}

        {!isLoading && !isError && (folders.length > 0 || files.length > 0) && (
          <div className="flex flex-col">
            {folders.map((folder) => (
              <FolderRow
                key={folder.id}
                folder={folder}
                onRename={(f) => setFormDialog({ open: true, folder: f })}
                onMove={(f) => setMoveTarget(f)}
                onDelete={(f) => setDeleteTarget(f)}
              />
            ))}
            {files.map((file) => (
              <FileRow
                key={file.id}
                file={file}
                isDownloading={fileActions.downloadingFileId === file.id}
                onViewDetails={fileActions.onViewDetails}
                onDownload={fileActions.onDownload}
                onRename={fileActions.onRename}
                onMove={fileActions.onMove}
                onDelete={fileActions.onDelete}
              />
            ))}
          </div>
        )}

        {!isLoading && !isError && totalPages > 1 && (
          <PaginationControls
            page={page}
            totalPages={totalPages}
            hasPrevPage={page > 1}
            hasNextPage={hasNextPage}
            onPageChange={setPage}
          />
        )}
      </div>

      <FolderFormDialog
        open={formDialog.open}
        onOpenChange={(open) => setFormDialog({ open })}
        parentId={folderId ?? null}
        folder={formDialog.folder}
      />

      <FolderPickerDialog
        open={Boolean(moveTarget)}
        onOpenChange={(open) => {
          if (!open) setMoveTarget(null);
        }}
        onSelect={handleMove}
        isPending={updateFolder.isPending}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title={`Delete ${deleteTarget?.name ?? 'this folder'}?`}
        description="It moves to trash along with everything inside it. You can restore it later."
        confirmLabel="Delete"
        isPending={deleteFolder.isPending}
        onConfirm={handleDelete}
      />

      {fileActions.dialogs}
    </>
  );
}

export default FilesPage;
