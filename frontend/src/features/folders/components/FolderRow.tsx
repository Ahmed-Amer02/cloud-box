import { Link } from 'react-router-dom';
import { Folder as FolderIcon, MoreHorizontal } from 'lucide-react';
import type { Folder } from '@/types/api';
import { formatDate } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

interface Props {
  folder: Folder;
  onRename: (folder: Folder) => void;
  onMove: (folder: Folder) => void;
  onDelete: (folder: Folder) => void;
}

function FolderRow({ folder, onRename, onMove, onDelete }: Props) {
  return (
    <div className="group flex items-center gap-3 border-b border-border px-6 py-3 hover:bg-bg">
      <div className="h-8 w-1.5 shrink-0 rounded-full bg-accent" />
      <Link to={`/files/${folder.id}`} className="flex min-w-0 flex-1 items-center gap-3">
        <FolderIcon className="h-4 w-4 shrink-0 text-accent" />
        <span className="truncate text-sm font-medium text-ink">{folder.name}</span>
      </Link>
      <span className="shrink-0 font-mono text-xs text-ink-muted">{formatDate(folder.createdAt)}</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100"
            aria-label={`Actions for ${folder.name}`}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onRename(folder)}>Rename</DropdownMenuItem>
          <DropdownMenuItem onClick={() => onMove(folder)}>Move to…</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem destructive onClick={() => onDelete(folder)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default FolderRow;
