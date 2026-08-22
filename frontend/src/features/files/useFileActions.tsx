import { useState } from 'react';
import { toast } from 'sonner';
import { useUpdateFile, useDeleteFile, useDownloadFile } from './hooks';
import FileRenameDialog from './components/FileRenameDialog';
import FileDetailsDialog from './components/FileDetailsDialog';
import FolderPickerDialog from '@/components/shared/FolderPickerDialog';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import type { FileWithTags } from '@/types/api';


export function useFileActions() {
  const updateFile = useUpdateFile();
  const deleteFile = useDeleteFile();
  const downloadFile = useDownloadFile();

  const [detailsId, setDetailsId] = useState<string | null>(null);
  const [renameTarget, setRenameTarget] = useState<FileWithTags | null>(null);
  const [moveTarget, setMoveTarget] = useState<FileWithTags | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<FileWithTags | null>(null);
  const [downloadingFileId, setDownloadingFileId] = useState<string | null>(null);

  const handleMove = (targetFolderId: string | null) => {
    if (!moveTarget) return;
    updateFile.mutate(
      { id: moveTarget.id, payload: { folderId: targetFolderId } },
      {
        onSuccess: () => {
          toast.success('File moved');
          setMoveTarget(null);
        },
        onError: (error) => {
          toast.error(error instanceof Error ? error.message : 'Could not move file.');
        },
      },
    );
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteFile.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast.success('File moved to trash');
        setDeleteTarget(null);
      },
      onError: (error) => {
        toast.error(error instanceof Error ? error.message : 'Could not delete file.');
      },
    });
  };

  const handleDownload = (file: FileWithTags) => {
    setDownloadingFileId(file.id);
    downloadFile.mutate(file.id, {
      onSuccess: (data) => {
        window.open(data.url, '_blank', 'noopener');
      },
      onError: (error) => {
        toast.error(error instanceof Error ? error.message : 'Could not download file.');
      },
      onSettled: () => setDownloadingFileId(null),
    });
  };

  const dialogs = (
    <>
      <FileDetailsDialog
        fileId={detailsId}
        onOpenChange={(open) => {
          if (!open) setDetailsId(null);
        }}
      />
      <FileRenameDialog
        file={renameTarget}
        onOpenChange={(open) => {
          if (!open) setRenameTarget(null);
        }}
      />
      <FolderPickerDialog
        open={Boolean(moveTarget)}
        onOpenChange={(open) => {
          if (!open) setMoveTarget(null);
        }}
        onSelect={handleMove}
        isPending={updateFile.isPending}
      />
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title={`Delete ${deleteTarget?.name ?? 'this file'}?`}
        description="It moves to trash. You can restore it later."
        confirmLabel="Delete"
        isPending={deleteFile.isPending}
        onConfirm={handleDelete}
      />
    </>
  );

  return {
    downloadingFileId,
    onViewDetails: (f: FileWithTags) => setDetailsId(f.id),
    onDownload: handleDownload,
    onRename: (f: FileWithTags) => setRenameTarget(f),
    onMove: (f: FileWithTags) => setMoveTarget(f),
    onDelete: (f: FileWithTags) => setDeleteTarget(f),
    dialogs,
  };
}
