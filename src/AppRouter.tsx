// router.tsx
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { PublicLayout } from './components/layout/PublicLayout';
import { Layout } from './components/layout/Layout';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import InscriptionJoueur from './pages/Inscription/InscriptionJoueur';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Unauthorized from './pages/Unauthorized';
import Dashboard from './pages/Dashboard';
import SuperAdminDashboard from './pages/super_admin/SuperAdminDashboard';
import ManageAdmins from './pages/super_admin/ManageAdmins';
import SuperAdminRegistrations from './pages/super_admin/SuperAdminRegistrations';
import AdminRegistrations from './pages/admin/AdminRegistrations';
import PupilsList from './pages/parent/PupilsList';
import ChildInfoPage from './pages/parent/PupilsInfo';
import ChildDocumentsPage from './pages/parent/PupilsDocuments';
import ChildPaymentsPage from './pages/parent/PupilsPayments';
import ParentProfilePage from './pages/parent/ParentProfile';

// ========== LOADERS ==========
import { childInfoLoader } from './loaders/childInfo.loader';
import { childDocumentsLoader } from './loaders/childDocuments.loader';
import { childPaymentsLoader } from './loaders/childPayments.loader';
import { profileLoader } from './loaders/profile.loader';
import { useAuth } from './hooks/useAuth';
import type { JSX } from 'react/jsx-runtime';
import { RegistrationValidationPage } from './pages/super_admin/RegistrationValidationPage';
import { UserLoader } from './components/UserLoader';

// ========== PROTECTED ROUTE WRAPPER ==========
const ProtectedRoute = ({ children, allowedRoles }: { children: JSX.Element; allowedRoles?: string[] }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Chargement...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export const router = createBrowserRouter([
  // ========== ROUTES PUBLIQUES ==========
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'login/admin', element: <AdminLogin /> },
      { path: 'inscription/joueur', element: <InscriptionJoueur /> },
      { path: 'unauthorized', element: <Unauthorized /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
      { path: 'reset-password', element: <ResetPassword /> },
    ],
  },

  // ========== ROUTES PRIVÉES ==========
  {
    path: '/',
    element: <Layout />,
    children: [
      // Tous les rôles
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute allowedRoles={['player', 'parent', 'admin', 'super_admin']}>
            <Dashboard />
          </ProtectedRoute>
        ),
      },

      // Super Admin
      {
        path: 'super-admin',
        element: (
          <ProtectedRoute allowedRoles={['super_admin']}>
            <Outlet />
          </ProtectedRoute>
        ),
        children: [
          { path: 'stats', element: <SuperAdminDashboard /> },
          { path: 'admins', element: <ManageAdmins /> },
          { path: 'registrations', element: <SuperAdminRegistrations /> },
          {
            path: 'registrations/validate/:userId',
            element: (
              <UserLoader userIdParam="userId">
                {(user) => <RegistrationValidationPage user={user} />}
              </UserLoader>
            ),
          },
        ],
      },

      // Admin
      {
        path: 'admin',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <Outlet />
          </ProtectedRoute>
        ),
        children: [
          { path: 'registrations', element: <AdminRegistrations /> },
        ],
      },

      // Parent (avec loaders)
      {
        path: 'parent',
        element: (
          <ProtectedRoute allowedRoles={['parent']}>
            <Outlet />
          </ProtectedRoute>
        ),
        children: [
          { path: 'pupils', element: <PupilsList /> },
          {
            path: 'pupils/:id/infos',
            element: <ChildInfoPage />,
            //loader: childInfoLoader,
            errorElement: <div>Erreur chargement enfant</div>,
          },
          {
            path: 'pupils/:id/documents',
            element: <ChildDocumentsPage />,
            loader: childDocumentsLoader,
          },
          {
            path: 'pupils/:id/payments',
            element: <ChildPaymentsPage />,
            loader: childPaymentsLoader,
          },
          {
            path: 'profile',
            element: <ParentProfilePage />,
            loader: profileLoader,
          },
        ],
      },

      // Fallback (route par défaut)
      {
        path: '*',
        element: <Navigate to="/dashboard" replace />,
      },
    ],
  },
]);