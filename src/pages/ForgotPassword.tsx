// src/pages/ForgotPassword.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import api from '../lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';

const forgotPasswordSchema = z.object({
  email: z.string().email('Email invalide'),
});

type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordData) => {
    setIsLoading(true);
    try {
      await api.post('/api/auth/forgot-password', { email: data.email });
      setSubmitted(true);
      toast.success('Email envoyé avec les instructions');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur lors de l\'envoi');
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-primary">Email envoyé</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center mb-4">
              Si un compte existe avec cet email, vous recevrez un lien pour réinitialiser votre mot de passe.
            </p>
            <Link to="/login" className="text-secondary hover:underline block text-center">
              Retour à la connexion
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
          <CardTitle className="text-center text-primary">Mot de passe oublié</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Votre adresse email"
                {...register('email')}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full bg-secondary text-primary hover:bg-secondary/90" disabled={isLoading}>
              {isLoading ? 'Envoi en cours...' : 'Envoyer le lien'}
            </Button>
            <p className="text-center text-sm">
              Vous vous souvenez de votre mot de passe ?{' '}
              <Link to="/login" className="text-secondary hover:underline">
                Connexion
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}