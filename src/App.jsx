import { createBrowserRouter, Navigate } from 'react-router';
import { AuthProvider } from './context/AuthContext';
import PublicPage from './pages/PublicPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import ProtectedRoute from './components/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AuthProvider>
        <PublicPage />
      </AuthProvider>
    ),
  },
  {
    path: '/login',
    element: (
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    ),
  },
  {
    path: '/admin',
    element: (
      <AuthProvider>
        <ProtectedRoute>
          <AdminPage />
        </ProtectedRoute>
      </AuthProvider>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
