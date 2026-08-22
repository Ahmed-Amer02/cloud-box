import { useStorageUsage } from '@/features/storage/hooks';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { formatBytes } from '@/lib/utils';

function StorageUsageBar() {
  const { data, isLoading, isError } = useStorageUsage();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-2 w-full" />
        <Skeleton className="h-3 w-24" />
      </div>
    );
  }

  if (isError || !data) {
    return null;
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Progress value={data.percentageUsed} />
      <p className="font-mono text-xs text-ink-muted">
        {formatBytes(data.usedBytes)} of {formatBytes(data.quotaBytes)} used
      </p>
    </div>
  );
}

export default StorageUsageBar;
