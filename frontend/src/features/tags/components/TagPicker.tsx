import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useTags, useCreateTag } from '../hooks';
import { useAttachTag, useDetachTag } from '@/features/files/hooks';
import type { Tag } from '@/types/api';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Props {
  fileId: string;
  attachedTags: Tag[];
}

function TagPicker({ fileId, attachedTags }: Props) {
  const { data: allTags } = useTags();
  const createTag = useCreateTag();
  const attachTag = useAttachTag();
  const detachTag = useDetachTag();
  const [search, setSearch] = useState('');

  const attachedIds = new Set(attachedTags.map((t) => t.id));
  const availableTags = (allTags ?? []).filter((t) => !attachedIds.has(t.id));
  const filteredTags = availableTags.filter((t) => t.name.includes(search.trim().toLowerCase()));
  const normalizedSearch = search.trim().toLowerCase();
  const alreadyAttached = attachedTags.some((t) => t.name === normalizedSearch);
  const exactMatchExists = availableTags.some((t) => t.name === normalizedSearch) || alreadyAttached;

  const handleCreateAndAttach = () => {
    const name = search.trim();
    if (!name) return;
    createTag.mutate(name, {
      onSuccess: (tag) => {
        attachTag.mutate({ fileId, tagId: tag.id });
        setSearch('');
      },
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-1.5">
        {attachedTags.map((tag) => (
          <Badge key={tag.id} className="flex items-center gap-1 pr-1">
            {tag.name}
            <button
              type="button"
              onClick={() => detachTag.mutate({ fileId, tagId: tag.id })}
              aria-label={`Remove tag ${tag.name}`}
              className="rounded-full hover:bg-warn/20"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}

        <DropdownMenu onOpenChange={(open) => !open && setSearch('')}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-6 gap-1 px-2 text-xs">
              <Plus className="h-3 w-3" /> Add tag
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <div className="p-1">
              <Input
                placeholder="Search or create…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.stopPropagation()}
                autoFocus
              />
            </div>
            <DropdownMenuSeparator />
            {filteredTags.map((tag) => (
              <DropdownMenuItem key={tag.id} onClick={() => attachTag.mutate({ fileId, tagId: tag.id })}>
                {tag.name}
              </DropdownMenuItem>
            ))}
            {search.trim() && !exactMatchExists && (
              <DropdownMenuItem onClick={handleCreateAndAttach}>
                Create &ldquo;{normalizedSearch}&rdquo;
              </DropdownMenuItem>
            )}
            {alreadyAttached && (
              <p className="px-2 py-1.5 text-xs text-ink-muted">Already added.</p>
            )}
            {filteredTags.length === 0 && !search.trim() && (
              <p className="px-2 py-1.5 text-xs text-ink-muted">No other tags yet.</p>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default TagPicker;
