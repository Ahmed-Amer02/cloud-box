import { File as FileIcon, MoreHorizontal } from 'lucide-react';
import type { FileWithTags } from '@/types/api';
import { formatBytes, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface Props {
  file: FileWithTags;
  isDownloading?: boolean;
  onViewDetails: (file: FileWithTags) => void;
  onDownload: (file: FileWithTags) => void;
  onRename: (file: FileWithTags) => void;
  onMove: (file: FileWithTags) => void;
  onDelete: (file: FileWithTags) => void;
}

function FileRow({ file, isDownloading, onViewDetails, onDownload, onRename, onMove, onDelete }: Props) {
  return (
    <div className="group flex items-center gap-3 border-b border-border px-6 py-3 hover:bg-bg">
      <div className="h-8 w-1.5 shrink-0 rounded-full bg-border" />
      <button
        type="button"
        onClick={() => onViewDetails(file)}
        className="flex min-w-0 flex-1 items-center gap-3 text-left"
      >
        <FileIcon className="h-4 w-4 shrink-0 text-ink-muted" />
        <span className="truncate text-sm text-ink">{file.name}</span>
        {file.tags.length > 0 && (
          <div className="hidden shrink-0 gap-1 sm:flex">
            {file.tags.slice(0, 2).map((tag) => (
              <Badge key={tag.id}>{tag.name}</Badge>
            ))}
            {file.tags.length > 2 && <Badge variant="outline">+{file.tags.length - 2}</Badge>}
          </div>
        )}
      </button>
      <span className="shrink-0 font-mono text-xs text-ink-muted">
        {formatBytes(file.size)} · {formatDate(file.createdAt)}
      </span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100"
            aria-label={`Actions for ${file.name}`}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onViewDetails(file)}>Details</DropdownMenuItem>
          <DropdownMenuItem disabled={isDownloading} onClick={() => onDownload(file)}>
            {isDownloading ? 'Preparing download…' : 'Download'}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onRename(file)}>Rename</DropdownMenuItem>
          <DropdownMenuItem onClick={() => onMove(file)}>Move to…</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem destructive onClick={() => onDelete(file)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default FileRow;
