import { useAuth } from '@/stores/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from 'src/components/ui/button';

export default function Unauthorized() {
  const { logout } = useAuth();
    const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleDashboard = async () => {
    navigate('/dashboard');
  };


  
  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold text-red-600">Accès non autorisé</h1>
      <p>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
      <div className='flex gap-2 justify-center'>
        <Button className="mt-4" onClick={handleDashboard}>Retour au tableau de bord</Button>
        <Button className="mt-4" onClick={handleLogout}>Déconnexion</Button>
      </div>
      
    </div>
  );
}