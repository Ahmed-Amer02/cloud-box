import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import PageHeader from '@/components/shared/PageHeader';
import EmptyState from '@/components/shared/EmptyState';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import PaginationControls from '@/components/shared/PaginationControls';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useTrash,
  useRestoreFile,
  useRestoreFolder,
  usePermanentDeleteFile,
  usePermanentDeleteFolder,
} from '@/features/trash/hooks';
import TrashFolderRow from '@/features/trash/components/TrashFolderRow';
import TrashFileRow from '@/features/trash/components/TrashFileRow';
import type { Folder, FileWithTags } from '@/types/api';

function TrashPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = useTrash({ page });

  const restoreFile = useRestoreFile();
  const restoreFolder = useRestoreFolder();
  const permanentDeleteFile = usePermanentDeleteFile();
  const permanentDeleteFolder = usePermanentDeleteFolder();

  const [restoringId, setRestoringId] = useState<string | null>(null);
  const [deleteFileTarget, setDeleteFileTarget] = useState<FileWithTags | null>(null);
  const [deleteFolderTarget, setDeleteFolderTarget] = useState<Folder | null>(null);

  const folders = data?.folders.data ?? [];
  const files = data?.files.data ?? [];
  const foldersMeta = data?.folders.meta;
  const filesMeta = data?.files.meta;
  const totalPages = Math.max(foldersMeta?.totalPages ?? 1, filesMeta?.totalPages ?? 1);
  const hasNextPage = Boolean(foldersMeta?.hasNextPage) || Boolean(filesMeta?.hasNextPage);

  const handleRestoreFile = (file: FileWithTags) => {
    setRestoringId(file.id);
    restoreFile.mutate(file.id, {
      onSuccess: () => toast.success('File restored'),
      onError: (error) => toast.error(error instanceof Error ? error.message : 'Could not restore file.'),
      onSettled: () => setRestoringId(null),
    });
  };

  const handleRestoreFolder = (folder: Folder) => {
    setRestoringId(folder.id);
    restoreFolder.mutate(folder.id, {
      onSuccess: () => toast.success('Folder restored'),
      onError: (error) => toast.error(error instanceof Error ? error.message : 'Could not restore folder.'),
      onSettled: () => setRestoringId(null),
    });
  };

  const handlePermanentDeleteFile = () => {
    if (!deleteFileTarget) return;
    permanentDeleteFile.mutate(deleteFileTarget.id, {
      onSuccess: () => {
        toast.success('File permanently deleted');
        setDeleteFileTarget(null);
      },
      onError: (error) => toast.error(error instanceof Error ? error.message : 'Could not delete file.'),
    });
  };

  const handlePermanentDeleteFolder = () => {
    if (!deleteFolderTarget) return;
    permanentDeleteFolder.mutate(deleteFolderTarget.id, {
      onSuccess: () => {
        toast.success('Folder permanently deleted');
        setDeleteFolderTarget(null);
      },
      onError: (error) => toast.error(error instanceof Error ? error.message : 'Could not delete folder.'),
    });
  };

  return (
    <>
      <PageHeader title={<h1 className="font-display text-lg font-medium text-ink">Trash</h1>} />

      {isLoading && (
        <div className="flex flex-col gap-3 p-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      )}

      {isError && !isLoading && (
        <div className="flex flex-col items-center gap-3 border-l-2 border-danger bg-danger/5 p-6 text-center">
          <p className="text-sm text-ink">Couldn&apos;t load trash.</p>
          <Button variant="secondary" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      )}

      {!isLoading && !isError && folders.length === 0 && files.length === 0 && (
        <EmptyState icon={Trash2} title="Trash is empty" />
      )}

      {!isLoading && !isError && (folders.length > 0 || files.length > 0) && (
        <div className="flex flex-col">
          {folders.map((folder) => (
            <TrashFolderRow
              key={folder.id}
              folder={folder}
              isRestoring={restoringId === folder.id}
              onRestore={handleRestoreFolder}
              onPermanentDelete={(f) => setDeleteFolderTarget(f)}
            />
          ))}
          {files.map((file) => (
            <TrashFileRow
              key={file.id}
              file={file}
              isRestoring={restoringId === file.id}
              onRestore={handleRestoreFile}
              onPermanentDelete={(f) => setDeleteFileTarget(f)}
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

      <ConfirmDialog
        open={Boolean(deleteFileTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteFileTarget(null);
        }}
        title={`Permanently delete ${deleteFileTarget?.name ?? 'this file'}?`}
        description="This can't be undone -- the file will be gone for good."
        confirmLabel="Delete forever"
        isPending={permanentDeleteFile.isPending}
        onConfirm={handlePermanentDeleteFile}
      />

      <ConfirmDialog
        open={Boolean(deleteFolderTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteFolderTarget(null);
        }}
        title={`Permanently delete ${deleteFolderTarget?.name ?? 'this folder'}?`}
        description="This can't be undone -- the folder and everything in it will be gone for good."
        confirmLabel="Delete forever"
        isPending={permanentDeleteFolder.isPending}
        onConfirm={handlePermanentDeleteFolder}
      />
    </>
  );
}

export default TrashPage;
