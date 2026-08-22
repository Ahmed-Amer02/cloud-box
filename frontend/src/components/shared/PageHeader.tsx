import type { ReactNode } from 'react';

function PageHeader({ title, children }: { title: ReactNode; children?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-surface px-4 py-3 sm:px-6 sm:py-4">
      <div className="min-w-0">{title}</div>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}

export default PageHeader;
