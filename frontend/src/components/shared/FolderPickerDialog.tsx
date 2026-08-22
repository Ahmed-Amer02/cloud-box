import { useState } from 'react';
import { ChevronLeft, Folder as FolderIcon } from 'lucide-react';
import { useRootFolders, useFolder } from '@/features/folders/hooks';
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

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (folderId: string | null) => void;
  isPending?: boolean;
}

function FolderPickerDialog({ open, onOpenChange, onSelect, isPending }: Props) {
  const [stack, setStack] = useState<{ id: string; name: string }[]>([]);
  const current = stack[stack.length - 1];
  const isRoot = !current;


  const rootQuery = useRootFolders(undefined, { enabled: open && isRoot });
  const nestedQuery = useFolder(current?.id ?? '', undefined, { enabled: open && !isRoot });
  const { data, isLoading } = isRoot ? rootQuery : nestedQuery;

  const folders = data?.folders.data ?? [];

  const handleOpenChange = (next: boolean) => {
    onOpenChange(next);
    if (!next) setStack([]);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Move to…</DialogTitle>
          <DialogDescription>
            {isRoot ? 'Files' : stack.map((s) => s.name).join(' / ')}
          </DialogDescription>
        </DialogHeader>

        <div className="flex max-h-64 flex-col gap-1 overflow-y-auto">
          {!isRoot && (
            <button
              type="button"
              onClick={() => setStack((s) => s.slice(0, -1))}
              className="flex items-center gap-2 rounded-control px-2 py-1.5 text-sm text-ink-muted hover:bg-bg"
            >
              <ChevronLeft className="h-4 w-4" /> Up
            </button>
          )}
          {isLoading && <p className="px-2 py-1.5 text-sm text-ink-muted">Loading…</p>}
          {!isLoading && folders.length === 0 && (
            <p className="px-2 py-1.5 text-sm text-ink-muted">No subfolders here.</p>
          )}
          {folders.map((folder) => (
            <button
              key={folder.id}
              type="button"
              onClick={() => setStack((s) => [...s, { id: folder.id, name: folder.name }])}
              className="flex items-center gap-2 rounded-control px-2 py-1.5 text-left text-sm text-ink hover:bg-bg"
            >
              <FolderIcon className="h-4 w-4 text-accent" />
              {folder.name}
            </button>
          ))}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="ghost">
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="primary"
            disabled={isPending}
            onClick={() => onSelect(current?.id ?? null)}
          >
            {isPending ? 'Moving…' : 'Move here'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default FolderPickerDialog;
