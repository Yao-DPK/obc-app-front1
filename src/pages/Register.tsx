// apps/web/src/pages/Register.tsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { toast } from 'sonner';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'parent' | 'player'>('parent');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    setIsLoading(true);
    try {
      await axios.post('/auth/register', { email, password, role });
      toast.success('Inscription réussie ! Vous pouvez vous connecter.');
      navigate('/login');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erreur lors de l\'inscription';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-primary">Inscription</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="•••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="•••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Je suis</Label>
              <Select value={role} onValueChange={(val) => setRole(val as 'parent' | 'player')}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="parent">Parent / Garant</SelectItem>
                  <SelectItem value="player">Joueur</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full bg-secondary text-primary hover:bg-secondary/90" disabled={isLoading}>
              {isLoading ? 'Inscription...' : 'S\'inscrire'}
            </Button>
            <p className="text-center text-sm">
              Déjà un compte ?{' '}
              <Link to="/login" className="text-secondary hover:underline">
                Se connecter
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}