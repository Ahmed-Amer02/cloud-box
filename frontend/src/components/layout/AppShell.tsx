import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import { UploadsProvider } from '@/features/uploads/UploadsContext';
import UploadProgressPanel from '@/features/uploads/components/UploadProgressPanel';
import { cn } from '@/lib/utils';

function AppShell() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <UploadsProvider>
      <div className="flex min-h-screen bg-bg">
        {/* Backdrop -- mobile only, closes the drawer on tap outside it */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-ink/40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Below `lg`: fixed slide-over drawer, hidden by default.
            At `lg` and up: static, always visible, no transform. */}
        <div
          className={cn(
            'fixed inset-y-0 left-0 z-40 -translate-x-full transition-transform duration-200 lg:static lg:translate-x-0',
            isSidebarOpen && 'translate-x-0',
          )}
        >
          <Sidebar onNavigate={() => setIsSidebarOpen(false)} />
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          {/* Mobile-only top bar with the menu toggle -- hidden at `lg` since
              the sidebar is always visible there already. */}
          <div className="flex items-center gap-3 border-b border-border bg-surface px-4 py-3 lg:hidden">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open menu"
              className="text-ink-muted transition-colors hover:text-ink"
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className="font-display text-base font-semibold text-ink">CloudBox</span>
          </div>

          <main className="flex flex-1 flex-col overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
      <UploadProgressPanel />
    </UploadsProvider>
  );
}

export default AppShell;
