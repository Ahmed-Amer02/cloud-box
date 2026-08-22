import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { folderFormSchema, type FolderFormValues } from '../schemas';
import { useCreateFolder, useUpdateFolder } from '../hooks';
import type { Folder } from '@/types/api';
import { ApiError } from '@/lib/apiClient';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parentId: string | null;
  folder?: Folder;
}

function FolderFormDialog({ open, onOpenChange, parentId, folder }: Props) {
  const isRename = Boolean(folder);
  const createFolder = useCreateFolder();
  const updateFolder = useUpdateFolder();
  const isPending = createFolder.isPending || updateFolder.isPending;

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<FolderFormValues>({ resolver: zodResolver(folderFormSchema) });

  useEffect(() => {
    if (open) reset({ name: folder?.name ?? '' });
  }, [open, folder, reset]);

  const onSubmit = (values: FolderFormValues) => {
    const mutation = isRename
      ? updateFolder.mutateAsync({ id: folder!.id, payload: { name: values.name } })
      : createFolder.mutateAsync({ name: values.name, parentId });

    mutation
      .then(() => {
        toast.success(isRename ? 'Folder renamed' : 'Folder created');
        onOpenChange(false);
      })
      .catch((error: unknown) => {
        if (error instanceof ApiError && error.fieldErrors?.name) {
          setError('name', { message: 'Folder name is invalid' });
        } else {
          toast.error(error instanceof Error ? error.message : 'Something went wrong.');
        }
      });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isRename ? 'Rename folder' : 'New folder'}</DialogTitle>
          <DialogDescription>
            {isRename
              ? 'Choose a new name for this folder.'
              : 'Name your folder. You can rename it later.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="folder-name">Name</Label>
            <Input id="folder-name" autoFocus {...register('name')} />
            {errors.name && <p className="text-xs text-danger">{errors.name.message}</p>}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" variant="primary" disabled={isPending}>
              {isPending ? 'Saving…' : isRename ? 'Save' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default FolderFormDialog;
