import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onPageChange: (page: number) => void;
}

function PaginationControls({ page, totalPages, hasNextPage, hasPrevPage, onPageChange }: Props) {
  return (
    <div className="flex items-center justify-between border-t border-border px-6 py-3">
      <Button variant="ghost" size="sm" disabled={!hasPrevPage} onClick={() => onPageChange(page - 1)}>
        <ChevronLeft className="h-4 w-4" /> Previous
      </Button>
      <span className="font-mono text-xs text-ink-muted">
        Page {page} of {Math.max(totalPages, 1)}
      </span>
      <Button variant="ghost" size="sm" disabled={!hasNextPage} onClick={() => onPageChange(page + 1)}>
        Next <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

export default PaginationControls;
