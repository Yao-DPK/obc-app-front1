import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../../lib/axios';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingState } from './components/LoadingState';
import { ErrorState } from './components/ErrorState';
import { ExpiredTokenState } from './components/ExpiredTokenState';
import { SuccessState } from './components/SuccessState';
import { RejectedState } from './components/RejectedState';
import { CreateAccountForm } from './components/CreateAccountForm';
import { LoginConfirmForm } from './components/LoginConfirmForm';
import { ConfirmAction } from './components/ConfirmAction';

// Schéma de validation pour la création de compte
const createAccountSchema = z.object({
  password: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .regex(/[A-Z]/, 'Doit contenir une majuscule')
    .regex(/[a-z]/, 'Doit contenir une minuscule')
    .regex(/[0-9]/, 'Doit contenir un chiffre')
    .regex(/[^A-Za-z0-9]/, 'Doit contenir un caractère spécial'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

type CreateAccountData = z.infer<typeof createAccountSchema>;

// Types
interface GuardianData {
  valid: boolean;
  guardianEmail: string;
  guardianName: string;
  playerName: string;
  playerId?: number;
  hasAccount: boolean;
}

type ConfirmationStatus = 
  | 'loading' 
  | 'invalid' 
  | 'expired' 
  | 'create_account' 
  | 'login' 
  | 'confirm' 
  | 'success' 
  | 'rejected';

export default function ConfirmGuardian() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  //const action = searchParams.get('action'); // 'confirm' | 'reject'
  const navigate = useNavigate();

  const [status, setStatus] = useState<ConfirmationStatus>('loading');
  const [guardianData, setGuardianData] = useState<GuardianData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateAccountData>({
    resolver: zodResolver(createAccountSchema),
  });

  // Vérification du token au chargement
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setStatus('invalid');
        setErrorMessage('Token de confirmation manquant');
        console.log(`Aucun token recu`);
        return;
      }

      try {
        console.log(`1, `);
        const response = await api.get('/api/auth/verify-guardian-token', {
          params: { token },
        });
        console.log(`2, ${JSON.stringify(response.data)}`);
        setGuardianData(response.data);
        
        // Déterminer l'étape en fonction du statut du garant
        if (response.data.hasExpired) {
          setStatus('expired');
        }  else if (response.data.hasAccount) {
          setStatus('login');
        } else {
          setStatus('create_account');
        }

        
      } catch (error: any) {
        const statusCode = error.response?.status;
        const message = error.response?.data?.message || 'Token invalide';
        console.log(`response: ${message},  ${statusCode}`)
        if (statusCode === 410 || message.includes('expiré')) {
          setStatus('expired');
        } else {
          setStatus('invalid');
        }
        setErrorMessage(message);
      }
    };

    verifyToken();
  }, [token]);

  // Création du compte (garant sans compte)
  const handleCreateAccount = async (data: CreateAccountData) => {
    if (!token) return;

    setIsSubmitting(true);
    try {
      const response = await api.post('/api/auth/confirm-guardian', {
        token,
        action: 'confirm',
        password: data.password,
      });

      if (response.data.success) {
        setStatus('success');
        toast.success('✅ Compte créé et rôle de garant confirmé !');
        
        setTimeout(() => {
          navigate(response.data.redirectTo || '/home');
        }, 3000);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de la création du compte');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Confirmation pour les garants avec compte existant
  const handleConfirm = async () => {
    if (!token) return;

    setIsSubmitting(true);
    try {
      const response = await api.post('/api/auth/confirm-guardian', {
        token,
        action: 'confirm',
      });

      if (response.data.success) {
        setStatus('success');
        toast.success('✅ Rôle de garant confirmé !');
        navigate('/home');
        setTimeout(() => {
          navigate('/home');
        }, 3000);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de la confirmation');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Refus
  const handleReject = async () => {
    if (!token) return;

    setIsSubmitting(true);
    try {
      const response = await api.post('/api/auth/confirm-guardian', {
        token,
        action: 'reject',
      });

      if (response.data.success) {
        setStatus('rejected');
        toast.info('Vous avez refusé la responsabilité de garant');
        navigate('/home');
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors du refus');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Renvoyer le lien
  const handleResendLink = async () => {
    if (!guardianData) return;

    try {
      await api.post('/api/auth/resend-guardian-confirmation', {
        email: guardianData.guardianEmail,
        playerId: guardianData.playerId,
      });
      
      toast.success('Un nouveau lien a été envoyé à votre adresse email');
      navigate('/home');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors du renvoi du lien');
    }
  };

  // 🔄 Rendu des différents états

  // 1. État de chargement
  if (status === 'loading') {
    return <LoadingState />;
  }

  // 2. Token invalide
  if (status === 'invalid') {
    return <ErrorState message={errorMessage} />;
  }

  // 3. Token expiré
  if (status === 'expired') {
    return <ExpiredTokenState onResend={handleResendLink} email={guardianData?.guardianEmail} />;
  }

  // 4. Succès
  if (status === 'success') {
    return <SuccessState guardianData={guardianData} />;
  }

  // 5. Refus
  if (status === 'rejected') {
    return <RejectedState playerName={guardianData?.playerName || ''} />;
  }

  // 6. Création de compte (garant sans compte)
  if (status === 'create_account' && guardianData) {
    return (
      <CreateAccountForm
        guardianData={guardianData}
        isSubmitting={isSubmitting}
        errors={errors}
        register={register}
        handleSubmit={handleSubmit}
        onSubmit={handleCreateAccount}
        onReject={handleReject}
      />
    );
  }

  // 7. Connexion + confirmation (garant avec compte)
  if (status === 'login' && guardianData) {
    return (
      <LoginConfirmForm
        guardianData={guardianData}
        isSubmitting={isSubmitting}
        onConfirm={handleConfirm}
        onReject={handleReject}
      />
    );
  }

  // 8. État de confirmation (fallback)
  if (status === 'confirm' && guardianData) {
    return (
      <ConfirmAction
        guardianData={guardianData}
        isSubmitting={isSubmitting}
        onConfirm={handleConfirm}
        onReject={handleReject}
      />
    );
  }

  return null;
}