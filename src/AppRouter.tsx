import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { PublicLayout } from "./components/layout/PublicLayout";
import Login from "./pages/Login";
import { Layout } from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import SuperAdminDashboard from "./pages/super_admin/SuperAdminDashboard";
import ManageAdmins from "./pages/super_admin/ManageAdmins";
import Unauthorized from "./pages/Unauthorized";

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
  return (
    <Routes>
      {/* Routes publiques */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
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