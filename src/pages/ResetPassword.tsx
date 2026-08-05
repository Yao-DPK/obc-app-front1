import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import api from '../lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

// 1. Schéma de validation plus strict
const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Au moins 8 caractères')
      .regex(/[A-Z]/, 'Doit contenir une majuscule')
      .regex(/[a-z]/, 'Doit contenir une minuscule')
      .regex(/[0-9]/, 'Doit contenir un chiffre')
      .regex(/[^A-Za-z0-9]/, 'Doit contenir un caractère spécial'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

type ResetPasswordData = z.infer<typeof resetPasswordSchema>;

// 2. Interface pour le statut du token
interface TokenStatus {
  isValid: boolean;
  email?: string;
  message?: string;
  isLoading: boolean;
}

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  // 3. États de validation du token
  const [tokenStatus, setTokenStatus] = useState<TokenStatus>({
    isValid: false,
    isLoading: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  // 4. Vérification proactive du token au chargement de la page
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setTokenStatus({
          isValid: false,
          isLoading: false,
          message: 'Token de réinitialisation manquant',
        });
        return;
      }

      try {
        // 5. Appel API pour vérifier la validité du token
        const response = await api.get('/api/auth/verify-reset-token', {
          params: { token },
        });

        setTokenStatus({
          isValid: true,
          email: response.data.email,
          isLoading: false,
          message: response.data.message,
        });
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || 'Le token est invalide ou a expiré';
        
        setTokenStatus({
          isValid: false,
          isLoading: false,
          message: errorMessage,
        });

        // 6. Log pour audit (optionnel)
        console.warn('Token invalide:', errorMessage);
      }
    };

    verifyToken();
  }, [token]);

  const onSubmit = async (data: ResetPasswordData) => {
    // 7. Vérification supplémentaire avant soumission
    if (!tokenStatus.isValid) {
      toast.error('Token invalide, veuillez demander un nouveau lien');
      return;
    }

    setIsSubmitting(true);
    try {
      // 8. Requête avec validation backend
      const response = await api.post('/api/auth/reset-password', {
        token,
        newPassword: data.password,
        // Ajout d'un timestamp pour éviter les attaques par rejeu
      });

      console.log('response.data: ', response);
      toast.success('Mot de passe modifié avec succès !');

      // 9. Redirection après délai pour meilleure UX
      setTimeout(() => {
        navigate('/login', {
          state: { message: 'Votre mot de passe a été réinitialisé avec succès' },
        });
      }, 2000);

    } catch (error: any) {
      // 10. Gestion d'erreur granulaire
      if (error.response?.status === 410) {
        toast.error('Le token a expiré. Veuillez demander un nouveau lien.', {
          action: {
            label: 'Nouveau lien',
            onClick: () => navigate('/forgot-password'),
          },
        });
      } else if (error.response?.status === 404) {
        toast.error('Utilisateur non trouvé. Veuillez réessayer.');
      } else {
        toast.error(
          error.response?.data?.message || 'Erreur lors de la réinitialisation'
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // 11. Gestion des états de chargement
  if (tokenStatus.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
        <Card className="w-full max-w-md shadow-2xl rounded-2xl backdrop-blur-sm bg-white/95">
          <CardHeader>
            <div className="flex justify-center">
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
            </div>
            <CardTitle className="text-center text-xl text-muted-foreground">
              Vérification du lien...
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div className="bg-primary h-full rounded-full animate-pulse w-1/2" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 12. Gestion des tokens invalides
  if (!tokenStatus.isValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
        <Card className="w-full max-w-md shadow-2xl border-destructive/20 rounded-2xl backdrop-blur-sm bg-white/95">
          <CardHeader>
            <div className="flex justify-center">
              <div className="bg-destructive/10 p-3 rounded-full shadow-md">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
            </div>
            <CardTitle className="text-center text-2xl text-destructive">
              Lien invalide
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-destructive/5 p-4 rounded-lg border border-destructive/20">
              <p className="text-center text-muted-foreground">
                {tokenStatus.message || 'Le lien de réinitialisation est invalide ou a expiré.'}
              </p>
            </div>
            <div className="space-y-3">
              <Button
                onClick={() => navigate('/forgot-password')}
                className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
              >
                Demander un nouveau lien
              </Button>
              <Button
                onClick={() => navigate('/login')}
                variant="outline"
                className="w-full"
              >
                Retour à la connexion
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 13. Affichage du formulaire avec les informations utilisateur
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <Card className="w-full max-w-md shadow-2xl border-primary/20 rounded-2xl backdrop-blur-sm bg-white/95">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <div className="bg-primary/10 p-3 rounded-full shadow-md">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-center text-2xl text-primary">
            Nouveau mot de passe
          </CardTitle>
          <div className="text-center">
            <p className="text-muted-foreground text-sm">
              Compte associé :{' '}
              <span className="font-medium text-primary">
                {tokenStatus.email || 'Utilisateur'}
              </span>
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <Input
                type="password"
                placeholder="Nouveau mot de passe (8+ caractères, 1 maj, 1 min, 1 chiffre, 1 spécial)"
                {...register('password')}
                disabled={isSubmitting}
                className="h-11 px-4 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                aria-label="Nouveau mot de passe"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <Input
                type="password"
                placeholder="Confirmer le mot de passe"
                {...register('confirmPassword')}
                disabled={isSubmitting}
                className="h-11 px-4 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                aria-label="Confirmer le mot de passe"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white font-semibold shadow-md hover:shadow-lg transition-all"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Modification en cours...
                </>
              ) : (
                'Modifier le mot de passe'
              )}
            </Button>

            <div className="text-center">
              <Link 
                to="/login" 
                className="text-sm text-muted-foreground hover:text-secondary transition"
              >
                ← Retour à l’accueil
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}