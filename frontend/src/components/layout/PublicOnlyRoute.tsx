import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthContext';

function PublicOnlyRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-ink-muted">Loading…</p>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/files" replace />;
  }

  return <Outlet />;
}

export default PublicOnlyRoute;
