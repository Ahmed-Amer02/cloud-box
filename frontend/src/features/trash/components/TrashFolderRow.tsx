import { Folder as FolderIcon, RotateCcw, Trash2 } from 'lucide-react';
import type { Folder } from '@/types/api';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface Props {
  folder: Folder;
  isRestoring?: boolean;
  onRestore: (folder: Folder) => void;
  onPermanentDelete: (folder: Folder) => void;
}

function TrashFolderRow({ folder, isRestoring, onRestore, onPermanentDelete }: Props) {
  return (
    <div className="flex items-center gap-3 border-b border-border px-6 py-3 opacity-70">
      <div className="h-8 w-1.5 shrink-0 rounded-full bg-border" />
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <FolderIcon className="h-4 w-4 shrink-0 text-ink-muted" />
        <span className="truncate text-sm text-ink">{folder.name}</span>
      </div>
      <span className="shrink-0 font-mono text-xs text-ink-muted">{formatDate(folder.createdAt)}</span>
      <Button variant="ghost" size="sm" disabled={isRestoring} onClick={() => onRestore(folder)}>
        <RotateCcw className="h-3.5 w-3.5" /> Restore
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onPermanentDelete(folder)}
        aria-label={`Permanently delete ${folder.name}`}
      >
        <Trash2 className="h-4 w-4 text-danger" />
      </Button>
    </div>
  );
}

export default TrashFolderRow;
