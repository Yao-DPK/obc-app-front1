import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../stores/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import api from '../lib/axios';
import { Loader2, LogIn } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogging, setIsLogging] = useState(false);
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLogging(true);
    try {
      const res = await api.post('/api/auth/login', { email, password });
      setAuth(res.data.user, res.data.accessToken);
      navigate('/dashboard');
    } catch (err: any) {
      if (err.status === 401) {
        toast.error('Email ou Mot de Passe Incorrect');
      } else {
        toast.error('Une erreur est survenue, veuillez réessayer.');
      }
      setIsLogging(false); // ✅ toujours réinitialiser
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <Card className="w-full max-w-md shadow-2xl border-secondary/20 rounded-2xl backdrop-blur-sm bg-white/95">
        <CardHeader className="space-y-4 pb-6">
          <div className="flex justify-center">
            <div className="bg-secondary p-3 rounded-full shadow-md">
              <LogIn className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-center text-3xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
            Connexion
          </CardTitle>
          <p className="text-center text-muted-foreground">Accédez à votre espace personnel</p>
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
                className="h-11 px-4 border-gray-200 focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
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
                className="h-11 px-4 border-gray-200 focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all"
                autoComplete="current-password"
              />
            </div>
            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary text-primary font-semibold shadow-md hover:shadow-lg transition-all duration-200"
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
            <div className="text-center mt-2">
              <Link to="/home" className="text-sm text-muted-foreground hover:text-secondary transition">
                ← Retour à l’accueil
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}