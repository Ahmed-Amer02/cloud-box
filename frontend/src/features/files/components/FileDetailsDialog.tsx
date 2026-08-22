import { useFile } from '../hooks';
import { formatBytes, formatDate } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import TagPicker from '@/features/tags/components/TagPicker';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface Props {
  fileId: string | null;
  onOpenChange: (open: boolean) => void;
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-ink-muted">{label}</span>
      <span className="font-mono text-ink">{value}</span>
    </div>
  );
}

function FileDetailsDialog({ fileId, onOpenChange }: Props) {

  const { data: file, isLoading } = useFile(fileId ?? '', { enabled: Boolean(fileId) });

  return (
    <Dialog open={Boolean(fileId)} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>File details</DialogTitle>
          <DialogDescription>{file?.name ?? 'Loading…'}</DialogDescription>
        </DialogHeader>

        {isLoading && (
          <div className="flex flex-col gap-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        )}

        {file && (
          <div className="flex flex-col gap-3">
            <DetailRow label="Size" value={formatBytes(file.size)} />
            <DetailRow label="Type" value={file.mimeType} />
            <DetailRow label="Uploaded" value={formatDate(file.createdAt)} />
            <div className="flex flex-col gap-1.5 text-sm">
              <span className="text-ink-muted">Tags</span>
              <TagPicker fileId={file.id} attachedTags={file.tags} />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default FileDetailsDialog;
