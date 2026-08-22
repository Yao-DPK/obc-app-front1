// src/pages/dashboard/PlayerDashboard.tsx
import { useAuth } from '@/stores/useAuth';
import { PlayerOverview } from './PlayerOverview';

export default function PlayerDashboard() {
  const {user} = useAuth();
  return <PlayerOverview userId={user?.id} isPlayer={true} />;
}