// src/pages/Login.tsx
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, LogIn, KeyRound, Clock } from 'lucide-react';

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-10">
          <div className="inline-flex bg-gradient-to-r from-primary to-primary/70 p-3 rounded-full shadow-md mb-4">
            <Clock className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Olympic Basket-ball Center
          </h1>
          <p className="text-muted-foreground mt-2">Bienvenue sur la plateforme de gestion</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Carte Joueur → Inscription */}
          <Card className="hover:shadow-xl transition-shadow duration-300 border-primary/20 hover:border-primary/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <UserPlus className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Joueur</CardTitle>
              </div>
              <CardDescription>
                Créez votre compte et inscrivez-vous aux activités du club.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                to="/inscription/joueur"
                className="w-full inline-flex justify-center items-center gap-2 bg-primary hover:bg-primary/90 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
              >
                S’inscrire
                <UserPlus className="h-4 w-4" />
              </Link>
            </CardContent>
          </Card>

          {/* Carte Admin → Connexion */}
          <Card className="hover:shadow-xl transition-shadow duration-300 border-secondary/20 hover:border-secondary/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-secondary/10 p-2 rounded-full">
                  <LogIn className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle className="text-xl">Administrateur</CardTitle>
              </div>
              <CardDescription>
                Accédez à l’espace d’administration du club.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                to="/login/admin"
                className="w-full inline-flex justify-center items-center gap-2 bg-secondary hover:bg-secondary/90 text-primary font-medium py-2.5 px-4 rounded-lg transition-colors"
              >
                Se connecter
                <LogIn className="h-4 w-4" />
              </Link>
            </CardContent>
          </Card>

          {/* Carte Mot de passe oublié */}
          <Card className="hover:shadow-xl transition-shadow duration-300 border-muted hover:border-primary/30">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-muted/50 p-2 rounded-full">
                  <KeyRound className="h-6 w-6 text-muted-foreground" />
                </div>
                <CardTitle className="text-xl">Mot de passe oublié</CardTitle>
              </div>
              <CardDescription>
                Réinitialisez votre mot de passe en un clic.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                to="/forgot-password"
                className="w-full inline-flex justify-center items-center gap-2 bg-muted hover:bg-muted/80 text-foreground font-medium py-2.5 px-4 rounded-lg transition-colors"
              >
                Réinitialiser
                <KeyRound className="h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-10">
          &copy; {new Date().getFullYear()} Olympic Basket-ball Center – Tous droits réservés
        </p>
      </div>
    </div>
  );
}