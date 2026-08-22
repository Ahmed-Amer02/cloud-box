import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AuthProvider } from '@/features/auth/AuthContext';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import PublicOnlyRoute from '@/components/layout/PublicOnlyRoute';
import AppShell from '@/components/layout/AppShell';
import { Toaster } from '@/components/ui/sonner';


const LoginPage = lazy(() => import('@/pages/LoginPage'));
const SignupPage = lazy(() => import('@/pages/SignupPage'));
const FilesPage = lazy(() => import('@/pages/FilesPage'));
const SearchPage = lazy(() => import('@/pages/SearchPage'));
const TagsPage = lazy(() => import('@/pages/TagsPage'));
const TrashPage = lazy(() => import('@/pages/TrashPage'));


function PageFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-sm text-ink-muted">Loading…</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
       <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<AppShell />}>
              <Route path="/" element={<Navigate to="/files" replace />} />
              <Route path="/files" element={<FilesPage />} />
              <Route path="/files/:folderId" element={<FilesPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/tags" element={<TagsPage />} />
              <Route path="/trash" element={<TrashPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </Suspense>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
