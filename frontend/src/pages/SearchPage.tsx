import { useEffect, useState } from 'react';
import { Search as SearchIcon, ChevronDown, X } from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';
import EmptyState from '@/components/shared/EmptyState';
import PaginationControls from '@/components/shared/PaginationControls';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { useSearchFiles } from '@/features/files/hooks';
import { useFileActions } from '@/features/files/useFileActions';
import { useTags } from '@/features/tags/hooks';
import FileRow from '@/features/files/components/FileRow';
import { useDebouncedValue } from '@/lib/useDebouncedValue';
import { cn } from '@/lib/utils';


const MIME_FILTERS = [
  { label: 'Images', value: 'image' },
  { label: 'PDFs', value: 'pdf' },
  { label: 'Videos', value: 'video' },
  { label: 'Audio', value: 'audio' },
  { label: 'Archives', value: 'zip' },
];

function SearchPage() {
  const [name, setName] = useState('');
  const [mimeType, setMimeType] = useState<string | null>(null);
  const [tagId, setTagId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const debouncedName = useDebouncedValue(name, 400);
  const { data: tags } = useTags();
  const selectedTag = tags?.find((t) => t.id === tagId);
  const fileActions = useFileActions();

  const hasFilter = Boolean(debouncedName.trim()) || Boolean(mimeType) || Boolean(tagId);

  useEffect(() => setPage(1), [debouncedName, mimeType, tagId]);

  const { data, isLoading, isError, refetch } = useSearchFiles(
    {
      name: debouncedName.trim() || undefined,
      mimeType: mimeType || undefined,
      tagId: tagId || undefined,
      page,
    },
    { enabled: hasFilter },
  );

  const results = data?.data ?? [];
  const meta = data?.meta;

  return (
    <>
      <PageHeader title={<h1 className="font-display text-lg font-medium text-ink">Search</h1>} />

      <div className="flex flex-col gap-4 border-b border-border p-6">
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Search files by name…"
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {MIME_FILTERS.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => setMimeType((prev) => (prev === filter.value ? null : filter.value))}
              className={cn(
                'rounded-full px-3 py-1 text-xs font-medium transition-colors',
                mimeType === filter.value
                  ? 'bg-accent-soft text-accent'
                  : 'border border-border text-ink-muted hover:bg-bg',
              )}
            >
              {filter.label}
            </button>
          ))}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="sm" className="gap-1">
                {selectedTag ? selectedTag.name : 'Filter by tag'}
                <ChevronDown className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {(tags ?? []).length === 0 && (
                <p className="px-2 py-1.5 text-xs text-ink-muted">No tags yet.</p>
              )}
              {tags?.map((tag) => (
                <DropdownMenuItem key={tag.id} onClick={() => setTagId(tag.id)}>
                  {tag.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {selectedTag && (
            <button
              type="button"
              onClick={() => setTagId(null)}
              className="flex items-center gap-1 text-xs text-ink-muted hover:text-ink"
            >
              <X className="h-3 w-3" /> Clear tag
            </button>
          )}
        </div>
      </div>

      {!hasFilter && (
        <EmptyState
          icon={SearchIcon}
          title="Search your files"
          description="Type a name, or filter by type or tag above."
        />
      )}

      {hasFilter && isLoading && (
        <div className="flex flex-col gap-3 p-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      )}

      {hasFilter && isError && !isLoading && (
        <div className="flex flex-col items-center gap-3 border-l-2 border-danger bg-danger/5 p-6 text-center">
          <p className="text-sm text-ink">Couldn&apos;t search right now.</p>
          <Button variant="secondary" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      )}

      {hasFilter && !isLoading && !isError && results.length === 0 && (
        <EmptyState icon={SearchIcon} title="No files match your search" />
      )}

      {hasFilter && !isLoading && !isError && results.length > 0 && (
        <div className="flex flex-col">
          {results.map((file) => (
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

      {hasFilter && meta && meta.totalPages > 1 && (
        <PaginationControls
          page={page}
          totalPages={meta.totalPages}
          hasPrevPage={meta.hasPrevPage}
          hasNextPage={meta.hasNextPage}
          onPageChange={setPage}
        />
      )}

      {fileActions.dialogs}
    </>
  );
}

export default SearchPage;
