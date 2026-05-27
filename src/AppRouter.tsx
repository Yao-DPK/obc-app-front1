import { Navigate, Outlet, Route, Routes, useNavigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { PublicLayout } from "./components/layout/PublicLayout";
import Login from "./pages/Login";
import { Layout } from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import SuperAdminDashboard from "./pages/super_admin/SuperAdminDashboard";
import ManageAdmins from "./pages/super_admin/ManageAdmins";
import Unauthorized from "./pages/Unauthorized";
import InscriptionJoueur from "./pages/InscriptionJoueur";
import { useEffect } from "react";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/unauthorized" replace />;
  return <Outlet />;
}



export function AppRouter() {
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => navigate('/login');
    window.addEventListener('auth:logout', handler);
    return () => window.removeEventListener('auth:logout', handler);
  }, []);
  

  return (
    <Routes>
      {/* Routes publiques */}
      <Route element={<PublicLayout />}>
        {/* <Route path="/" element={<Navigate to="/dashboard" replace />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<InscriptionJoueur />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* Routes privées */}
      <Route element={<Layout />}>
        {/* Tous les rôles connectés */}
        <Route element={<ProtectedRoute allowedRoles={['player', 'parent', 'admin', 'super_admin']} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Ajouter /documents, /payments, /profile plus tard */}
        </Route>

        {/* Super Admin uniquement */}
        <Route element={<ProtectedRoute allowedRoles={['super_admin']} />}>
          <Route path="/super-admin/stats" element={<SuperAdminDashboard />} />
          <Route path="/super-admin/admins" element={<ManageAdmins />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}