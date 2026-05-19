import { Navigate } from "react-router-dom";
import PlayerDashboard from "./player/PlayerDashboard";
import ParentDashboard from "./parent/ParentDashboard";
import AdminDashboard from "./admin/AdminDashboard";
import { useAuth } from "../hooks/useAuth";

export default function Dashboard() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  switch (user.role) {
    case 'player':
      return <PlayerDashboard />;
    case 'parent':
      return <ParentDashboard />;
    case 'admin':
      return <AdminDashboard />;
    case 'super_admin':
      return <AdminDashboard />;
    default:
      return <Navigate to="/unauthorized" replace />;
  }
}