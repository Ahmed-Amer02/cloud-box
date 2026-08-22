import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Tag as TagIcon, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import PageHeader from '@/components/shared/PageHeader';
import EmptyState from '@/components/shared/EmptyState';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useTags, useCreateTag, useDeleteTag } from '@/features/tags/hooks';
import { tagFormSchema, type TagFormValues } from '@/features/tags/schemas';
import { ApiError } from '@/lib/apiClient';
import type { TagWithCount } from '@/types/api';

function TagsPage() {
  const { data: tags, isLoading, isError, refetch } = useTags();
  const createTag = useCreateTag();
  const deleteTag = useDeleteTag();
  const [deleteTarget, setDeleteTarget] = useState<TagWithCount | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<TagFormValues>({ resolver: zodResolver(tagFormSchema) });

  const onSubmit = (values: TagFormValues) => {
    createTag.mutate(values.name, {
      onSuccess: () => {
        toast.success('Tag created');
        reset();
      },
      onError: (error) => {
        if (error instanceof ApiError && error.fieldErrors?.name) {
          setError('name', { message: 'Tag name is invalid' });
        } else {
          toast.error(error instanceof Error ? error.message : 'Something went wrong.');
        }
      },
    });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteTag.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast.success('Tag deleted');
        setDeleteTarget(null);
      },
      onError: (error) => {
        toast.error(error instanceof Error ? error.message : 'Could not delete tag.');
      },
    });
  };

  return (
    <>
      <PageHeader title={<h1 className="font-display text-lg font-medium text-ink">Tags</h1>} />

      <div className="mx-auto flex max-w-xl flex-col gap-6 p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="flex items-start gap-2">
          <div className="flex-1">
            <Input placeholder="New tag name" {...register('name')} />
            {errors.name && <p className="mt-1 text-xs text-danger">{errors.name.message}</p>}
          </div>
          <Button type="submit" variant="primary" disabled={createTag.isPending}>
            <Plus className="h-4 w-4" /> {createTag.isPending ? 'Adding…' : 'Add'}
          </Button>
        </form>

        {isLoading && (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        )}

        {isError && !isLoading && (
          <div className="flex flex-col items-center gap-3 border-l-2 border-danger bg-danger/5 p-6 text-center">
            <p className="text-sm text-ink">Couldn&apos;t load tags.</p>
            <Button variant="secondary" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        )}

        {!isLoading && !isError && tags && tags.length === 0 && (
          <EmptyState
            icon={TagIcon}
            title="No tags yet"
            description="Create a tag above, then attach it to files from their details view."
          />
        )}

        {!isLoading && !isError && tags && tags.length > 0 && (
          <div className="flex flex-col rounded-card border border-border">
            {tags.map((tag, index) => (
              <div
                key={tag.id}
                className={`flex items-center gap-3 px-4 py-3 ${index > 0 ? 'border-t border-border' : ''}`}
              >
                <TagIcon className="h-4 w-4 shrink-0 text-warn" />
                <span className="flex-1 truncate text-sm font-medium text-ink">{tag.name}</span>
                <span className="font-mono text-xs text-ink-muted">
                  {tag.fileCount} {tag.fileCount === 1 ? 'file' : 'files'}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDeleteTarget(tag)}
                  aria-label={`Delete tag ${tag.name}`}
                >
                  <Trash2 className="h-4 w-4 text-ink-muted" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title={`Delete "${deleteTarget?.name ?? ''}"?`}
        description="It will be removed from any files that use it. This can't be undone."
        confirmLabel="Delete"
        isPending={deleteTag.isPending}
        onConfirm={handleDelete}
      />
    </>
  );
}

export default TagsPage;
