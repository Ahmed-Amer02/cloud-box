import { File as FileIcon, RotateCcw, Trash2 } from 'lucide-react';
import type { FileWithTags } from '@/types/api';
import { formatBytes, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface Props {
  file: FileWithTags;
  isRestoring?: boolean;
  onRestore: (file: FileWithTags) => void;
  onPermanentDelete: (file: FileWithTags) => void;
}

function TrashFileRow({ file, isRestoring, onRestore, onPermanentDelete }: Props) {
  return (
    <div className="flex items-center gap-3 border-b border-border px-6 py-3 opacity-70">
      <div className="h-8 w-1.5 shrink-0 rounded-full bg-border" />
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <FileIcon className="h-4 w-4 shrink-0 text-ink-muted" />
        <span className="truncate text-sm text-ink">{file.name}</span>
      </div>
      <span className="shrink-0 font-mono text-xs text-ink-muted">
        {formatBytes(file.size)} · {formatDate(file.createdAt)}
      </span>
      <Button variant="ghost" size="sm" disabled={isRestoring} onClick={() => onRestore(file)}>
        <RotateCcw className="h-3.5 w-3.5" /> Restore
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onPermanentDelete(file)}
        aria-label={`Permanently delete ${file.name}`}
      >
        <Trash2 className="h-4 w-4 text-danger" />
      </Button>
    </div>
  );
}

export default TrashFileRow;
