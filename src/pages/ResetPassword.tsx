// src/pages/ResetPassword.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import api from '../lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';

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
    // Optionnel : vérifier la validité du token auprès du backend
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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-primary">Lien invalide</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center mb-4">
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
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-primary">Nouveau mot de passe</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="Nouveau mot de passe"
                {...register('password')}
                disabled={isLoading}
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
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full bg-secondary text-primary hover:bg-secondary/90" disabled={isLoading}>
              {isLoading ? 'Modification en cours...' : 'Modifier le mot de passe'}
            </Button>
            <p className="text-center text-sm">
              <Link to="/login" className="text-secondary hover:underline">
                Retour à la connexion
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}