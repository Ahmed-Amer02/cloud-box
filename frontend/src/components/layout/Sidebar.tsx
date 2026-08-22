import { NavLink } from 'react-router-dom';
import { FolderOpen, Search, Tag, Trash2, LogOut } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import StorageUsageBar from '@/components/shared/StorageUsageBar';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/files', label: 'Files', icon: FolderOpen },
  { to: '/search', label: 'Search', icon: Search },
  { to: '/tags', label: 'Tags', icon: Tag },
  { to: '/trash', label: 'Trash', icon: Trash2 },
];

interface Props {
  onNavigate?: () => void;
}

function Sidebar({ onNavigate }: Props) {
  const { user, signOut } = useAuth();

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col border-r border-border bg-surface">
      <div className="px-4 py-5">
        <span className="font-display text-lg font-semibold text-ink">CloudBox</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-2">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2 rounded-control px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-accent-soft text-accent'
                  : 'text-ink-muted hover:bg-bg hover:text-ink',
              )
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="flex flex-col gap-3 border-t border-border p-4">
        <StorageUsageBar />
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-xs text-ink-muted">{user?.email}</span>
          <button
            type="button"
            onClick={() => signOut()}
            className="shrink-0 text-ink-muted transition-colors hover:text-ink"
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
