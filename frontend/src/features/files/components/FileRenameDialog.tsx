import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { fileRenameSchema, type FileRenameValues } from '../schemas';
import { useUpdateFile } from '../hooks';
import type { FileWithTags } from '@/types/api';
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
  file: FileWithTags | null;
  onOpenChange: (open: boolean) => void;
}

function FileRenameDialog({ file, onOpenChange }: Props) {
  const updateFile = useUpdateFile();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<FileRenameValues>({ resolver: zodResolver(fileRenameSchema) });

  useEffect(() => {
    if (file) reset({ name: file.name });
  }, [file, reset]);

  const onSubmit = (values: FileRenameValues) => {
    if (!file) return;
    updateFile.mutate(
      { id: file.id, payload: { name: values.name } },
      {
        onSuccess: () => {
          toast.success('File renamed');
          onOpenChange(false);
        },
        onError: (error) => {
          if (error instanceof ApiError && error.fieldErrors?.name) {
            setError('name', { message: 'File name is invalid' });
          } else {
            toast.error(error instanceof Error ? error.message : 'Something went wrong.');
          }
        },
      },
    );
  };

  return (
    <Dialog open={Boolean(file)} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename file</DialogTitle>
          <DialogDescription>Choose a new name for this file.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="file-name">Name</Label>
            <Input id="file-name" autoFocus {...register('name')} />
            {errors.name && <p className="text-xs text-danger">{errors.name.message}</p>}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" variant="primary" disabled={updateFile.isPending}>
              {updateFile.isPending ? 'Saving…' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default FileRenameDialog;
