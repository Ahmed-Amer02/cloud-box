import { CheckCircle2, XCircle, X, UploadCloud } from 'lucide-react';
import { useUploads } from '../UploadsContext';
import { Progress } from '@/components/ui/progress';

function UploadProgressPanel() {
  const { uploads, dismiss } = useUploads();

  if (uploads.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 z-40 flex w-80 flex-col gap-2">
      {uploads.map((item) => (
        <div key={item.id} className="rounded-card border border-border bg-surface p-3 shadow-md">
          <div className="mb-1.5 flex items-center gap-2">
            {item.status === 'uploading' && <UploadCloud className="h-4 w-4 shrink-0 text-accent" />}
            {item.status === 'success' && <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />}
            {item.status === 'error' && <XCircle className="h-4 w-4 shrink-0 text-danger" />}
            <span className="min-w-0 flex-1 truncate text-sm text-ink">{item.fileName}</span>
            {item.status !== 'uploading' && (
              <button
                type="button"
                onClick={() => dismiss(item.id)}
                aria-label={`Dismiss ${item.fileName}`}
                className="shrink-0 text-ink-muted transition-colors hover:text-ink"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          {item.status === 'uploading' && <Progress value={item.progress} />}
          {item.status === 'error' && <p className="text-xs text-danger">{item.error}</p>}
        </div>
      ))}
    </div>
  );
}

export default UploadProgressPanel;
