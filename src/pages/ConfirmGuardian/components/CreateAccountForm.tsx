import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserCheck, Key, Mail, Loader2, XCircle, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface CreateAccountFormProps {
  guardianData: {
    guardianEmail: string;
    guardianName: string;
    playerName: string;
  };
  isSubmitting: boolean;
  errors: any;
  register: any;
  handleSubmit: any;
  onSubmit: (data: any) => void;
  onReject: () => void;
}

export function CreateAccountForm({
  guardianData,
  isSubmitting,
  errors,
  register,
  handleSubmit,
  onSubmit,
  onReject,
}: CreateAccountFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <Card className="w-full max-w-md shadow-2xl border-primary/20 rounded-2xl backdrop-blur-sm bg-white/95">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <div className="bg-primary/10 p-3 rounded-full shadow-md">
              <UserCheck className="h-10 w-10 text-primary" />
            </div>
          </div>
          <CardTitle className="text-center text-2xl text-primary">
            Création de compte garant
          </CardTitle>
          <div className="text-center space-y-1">
            <p className="text-sm text-muted-foreground">
              Bonjour <strong>{guardianData.guardianName}</strong>
            </p>
            <p className="text-sm text-muted-foreground">
              Vous avez été désigné comme garant pour <strong>{guardianData.playerName}</strong>
            </p>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email (non modifiable) */}
            <div>
              <Label htmlFor="email">Adresse email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  value={guardianData.guardianEmail}
                  disabled
                  className="pl-10 bg-gray-50"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Cette adresse email sera utilisée pour votre compte
              </p>
            </div>

            {/* Mot de passe */}
            <div>
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Choisissez un mot de passe sécurisé"
                  {...register('password')}
                  disabled={isSubmitting}
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
              <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                <li>• Au moins 8 caractères</li>
                <li>• Au moins une majuscule et une minuscule</li>
                <li>• Au moins un chiffre</li>
                <li>• Au moins un caractère spécial (!@#$%^&*)</li>
              </ul>
            </div>

            {/* Confirmation mot de passe */}
            <div>
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirmez votre mot de passe"
                  {...register('confirmPassword')}
                  disabled={isSubmitting}
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Informations */}
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-800">
                🔒 En créant ce compte, vous confirmerez automatiquement votre rôle de garant.
                Votre email sera vérifié et vous pourrez accéder à votre tableau de bord.
              </p>
            </div>

            {/* Boutons */}
            <div className="space-y-3">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white h-11"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Création en cours...
                  </>
                ) : (
                  <>
                    <UserCheck className="mr-2 h-4 w-4" />
                    Créer mon compte et confirmer mon rôle
                  </>
                )}
              </Button>

              <Button
                type="button"
                onClick={onReject}
                variant="destructive"
                className="w-full h-11"
                disabled={isSubmitting}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Refuser cette responsabilité
              </Button>
            </div>

            <div className="text-center">
              <Link 
                to="/" 
                className="text-sm text-muted-foreground hover:text-primary transition inline-block"
              >
                <ArrowLeft className="inline-block mr-1 h-4 w-4" />
                Retour à l'accueil
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}