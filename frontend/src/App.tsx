import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/features/auth/AuthContext';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import PublicOnlyRoute from '@/components/layout/PublicOnlyRoute';
import AppShell from '@/components/layout/AppShell';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import FilesPage from '@/pages/FilesPage';
import SearchPage from '@/pages/SearchPage';
import TagsPage from '@/pages/TagsPage';
import TrashPage from '@/pages/TrashPage';
import { Toaster } from '@/components/ui/sonner';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
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
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
