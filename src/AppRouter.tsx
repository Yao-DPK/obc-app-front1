// router.tsx
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { PublicLayout } from './components/layout/PublicLayout';
import { Layout } from './components/layout/Layout';
import Login from './pages/Login';
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
import { useAuth } from './stores/useAuth';
import {
  childInfoLoader,
  childDocumentsLoader,
  childPaymentsLoader,
} from './loaders';
import type { ReactNode } from 'react';
import { UserValidationPage } from './pages/super_admin/RegistrationValidationPage';
import { ErrorBoundary } from './components/ErrorBoundary';
import Home from './pages/Home';
import CustomLoader from './components/CustomLoader';
import ConfirmGuardian from './pages/ConfirmGuardian/ConfirmGuardian';
import PaymentEventsManagement from './pages/super_admin/PaymentEventsManagement';
import DocumentTypesManagement from './pages/super_admin/DocumentTypesManagement';
import ProfilePage from './pages/Profile';
import { PaymentComponent } from './pages/payment';
import PlayerDocumentsPage from './pages/player/PlayerDocuments';
import PlayerPaymentsPage from './pages/player/PlayerPayments';
import EventManagement from './pages/super_admin/EventManagement';
import PupilOverview from './pages/parent/PupilOverview';
/* import { Test } from './pages/Test'; */

// ========== PROTECTED ROUTE WRAPPER ==========
const ProtectedRoute = ({ children, allowedRoles }: { children: ReactNode; allowedRoles?: string[] }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Chargement...</div>;
  }

  if (!user) {
    return <Navigate to="/home" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// ========== PUBLIC ROUTE WRAPPER (avec Outlet) ==========
const PublicRoute = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <CustomLoader />;
  if (user) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
};

export const router = createBrowserRouter([
  // ========== ROUTES PUBLIQUES ==========
  {
    element: <PublicRoute />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          { index: true, element: <Navigate to="/dashboard" replace /> },
          { path: 'home', element: <Home /> },
          { path: 'login', element: <Login /> },
          { path: 'inscription/joueur', element: <InscriptionJoueur /> },
          { path: 'unauthorized', element: <Unauthorized /> },
          { path: 'forgot-password', element: <ForgotPassword /> },
          /* { path: 'test', element: <Test /> }, */
          { path: 'reset-password', element: <ResetPassword /> },
          { path: '/confirm-guardian', element: <ConfirmGuardian />,},
        ],
      },
    ],
  },

  // ========== ROUTES PRIVÉES ==========
  {
    path: '/',
    element: <Layout />,
    children: [
      // Dashboard (tous rôles)
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute allowedRoles={['player', 'parent', 'admin', 'super_admin']}>
            <Dashboard />
          </ProtectedRoute>
        ),
        
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute allowedRoles={['player', 'parent', 'admin', 'super_admin']}>
            <ProfilePage />
          </ProtectedRoute>
        ),
        
      },

      {
        path: 'payments/:id',
        element: (
          <ProtectedRoute allowedRoles={['player', 'parent', 'admin', 'super_admin']}>
            <PaymentComponent />
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
          { path: 'payment_events', element: <PaymentEventsManagement /> },
          { path: 'document-types', element: <DocumentTypesManagement />},
          { path: 'events', element: <EventManagement />},
          {
            path: 'registrations/validate/:userId',
            element: (
                <UserValidationPage mode="validation" />
            ),
          },
          {
            path: 'registrations/view/:userId',
            element: (
                <UserValidationPage mode="view" />
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
        children: [{ path: 'registrations', element: <AdminRegistrations /> }],
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
            path: 'pupils/:id',
            element: <PupilOverview />,
            errorElement: <ErrorBoundary />,
          },
          {
            path: 'pupils/:id/infos',
            element: <ChildInfoPage />,
            loader: childInfoLoader,
            errorElement: <ErrorBoundary />,
          },
          {
            path: 'pupils/:id/documents',
            element: <ChildDocumentsPage />,
            loader: childDocumentsLoader,
            errorElement: <ErrorBoundary />,
          },
          {
            path: 'pupils/:id/payments',
            element: <ChildPaymentsPage />,
            loader: childPaymentsLoader,
            errorElement: <ErrorBoundary />,
          },
        ],
      },

      // Player (avec loaders)
      {
        path: 'player',
        element: (
          <ProtectedRoute allowedRoles={['player']}>
            <Outlet />
          </ProtectedRoute>
        ),
        children: [
          {
            path: 'documents',
            element: <PlayerDocumentsPage />,
            errorElement: <ErrorBoundary />,
          },
          {
            path: 'payments',
            element: <PlayerPaymentsPage />,
            errorElement: <ErrorBoundary />,
          },
        ],
      },

      // Fallback
      {
        path: '*',
        element: <Navigate to="/dashboard" replace />,
      },
    ],
  },
]);