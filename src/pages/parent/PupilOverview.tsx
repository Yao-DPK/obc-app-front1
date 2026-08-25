import { useParams } from 'react-router-dom';
import { PlayerOverview } from '../player/PlayerOverview';

// ========== COMPOSANT PRINCIPAL ==========

export default function PupilOverview() {
  const { id } = useParams<{ id: string }>();
  const playerId = Number(id);  
  
  return <PlayerOverview userId={playerId} isPlayer={false} />;
}