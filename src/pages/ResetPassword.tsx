// src/pages/ResetPassword.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import api from '../lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { KeyRound, CheckCircle2 } from 'lucide-react';

const resetPasswordSchema = z.object({
  password: z.string().min(6, 'Au moins 6 caractères'),
  confirmPassword: z.string().min(6, 'Au moins 6 caractères'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

type ResetPasswordData = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [validToken, setValidToken] = useState<boolean | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordData>();

  useEffect(() => {
    if (!token) {
      setValidToken(false);
      return;
    }
    setValidToken(true);
  }, [token]);

  const onSubmit = async (data: ResetPasswordData) => {
    if (!token) {
      toast.error('Token manquant');
      return;
    }
    setIsLoading(true);
    try {
      await api.post('/api/auth/reset-password', {
        token,
        newPassword: data.password,
      });
      toast.success('Mot de passe modifié avec succès');
      navigate('/login');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur lors de la réinitialisation');
    } finally {
      setIsLoading(false);
    }
  };

  if (validToken === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
        <Card className="w-full max-w-md shadow-2xl border-destructive/20 rounded-2xl backdrop-blur-sm bg-white/95">
          <CardHeader>
            <div className="flex justify-center">
              <div className="bg-destructive/10 p-3 rounded-full shadow-md">
                <KeyRound className="h-8 w-8 text-destructive" />
              </div>
            </div>
            <CardTitle className="text-center text-2xl text-destructive">Lien invalide</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-muted-foreground">
              Le lien de réinitialisation est manquant ou invalide.
            </p>
            <Link to="/forgot-password" className="text-secondary hover:underline block text-center">
              Demander un nouveau lien
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <Card className="w-full max-w-md shadow-2xl border-primary/20 rounded-2xl backdrop-blur-sm bg-white/95">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <div className="bg-primary/10 p-3 rounded-full shadow-md">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-center text-2xl text-primary">Nouveau mot de passe</CardTitle>
          <p className="text-center text-muted-foreground">Choisissez un mot de passe sécurisé</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <Input
                type="password"
                placeholder="Nouveau mot de passe"
                {...register('password')}
                disabled={isLoading}
                className="h-11 px-4 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>
            <div>
              <Input
                type="password"
                placeholder="Confirmer le mot de passe"
                {...register('confirmPassword')}
                disabled={isLoading}
                className="h-11 px-4 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white font-semibold shadow-md hover:shadow-lg transition-all"
              disabled={isLoading}
            >
              {isLoading ? 'Modification en cours...' : 'Modifier le mot de passe'}
            </Button>
            <div className="text-center">
              <Link to="/login" className="text-sm text-muted-foreground hover:text-secondary transition">
                ← Retour à l’accueil
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}