// src/pages/Login.tsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import api from '../lib/axios';
import { Loader2, Clock } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogging, setIsLogging] = useState(false);
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLogging(true);
      const res = await api.post('/api/auth/login', { email, password });
      setAuth(res.data.user, res.data.accessToken);
      navigate('/dashboard');
    } catch (err: any) {
      if (err.status == 401) {
        toast.error('Email ou Mot de Passe Incorrect');
      }
      setIsLogging(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4 h-full">
      <Card className="w-full max-w-md shadow-2xl border-primary/20 rounded-2xl backdrop-blur-sm bg-white/95">
        <CardHeader className="space-y-4 pb-6">
          <div className="flex justify-center">
            <div className="bg-gradient-to-r from-primary to-primary/70 p-3 rounded-full shadow-md">
              <Clock className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-center text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Bienvenue
          </CardTitle>
          <p className="text-center text-muted-foreground">Connectez-vous à votre compte</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="adresse@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 px-4 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 px-4 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                autoComplete="current-password"
              />
            </div>
            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200"
              disabled={isLogging}
            >
              {isLogging ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connexion...
                </>
              ) : (
                'Se connecter'
              )}
            </Button>
            <div className="space-y-2 pt-2">
              <p className="text-center text-sm text-muted-foreground">
                Pas de compte ?{' '}
                <Link to="/register" className="text-secondary hover:text-secondary/80 font-medium hover:underline transition">
                  Inscription
                </Link>
              </p>
              <p className="text-center text-sm text-muted-foreground">
                Mot de passe oublié ?{' '}
                <Link to="/forgot-password" className="text-secondary hover:text-secondary/80 font-medium hover:underline transition">
                  Réinitialiser
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}