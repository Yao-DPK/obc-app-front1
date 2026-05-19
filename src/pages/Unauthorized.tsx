import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Unauthorized() {
  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold text-red-600">Accès non autorisé</h1>
      <p>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
      <Link to="/dashboard">
        <Button className="mt-4">Retour au tableau de bord</Button>
      </Link>
    </div>
  );
}