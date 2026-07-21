// src/pages/Login.tsx (ou Home.tsx)
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, LogIn, KeyRound, ArrowRight, Clock, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

type Option = 'inscription' | 'login' | 'forgot';

const OPTIONS = [
  {
    id: 'inscription' as Option,
    icon: UserPlus,
    title: 'Inscription Joueur',
    description: 'Créez votre compte et inscrivez-vous aux activités du club.',
    link: '/inscription/joueur',
    label: "S'inscrire",
  },
  {
    id: 'login' as Option,
    icon: LogIn,
    title: 'Connexion',
    description: 'Accédez à votre espace personnel.',
    link: '/login',
    label: 'Se connecter',
  },
  {
    id: 'forgot' as Option,
    icon: KeyRound,
    title: 'Mot de passe oublié',
    description: 'Réinitialisez votre mot de passe en un clic.',
    link: '/forgot-password',
    label: 'Réinitialiser',
  },
];

export default function Home() {
  const [selectedOption, setSelectedOption] = useState<Option>('inscription');
  //const activeOption = OPTIONS.find(o => o.id === selectedOption)!;

  return (
    <div className="min-h-screen flex overflow-hidden">

      {/* ====== COLONNE DROITE – Options (desktop) ====== */}
      <div className="hidden md:flex w-[420px] lg:w-[480px] bg-primary flex-col justify-center p-10 text-white shadow-2xl">
        <div className="max-w-sm mx-auto space-y-10">
          {/* Logo / Titre */}
          <div>
            <div className="inline-flex bg-white/20 p-3 rounded-full shadow-md mb-4">
              <Clock className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Olympic Basket-ball Center</h1>
            <p className="text-white/70 text-sm mt-1">Plateforme de gestion</p>
          </div>

          {/* Liste des options */}
          <div className="space-y-3">
            {OPTIONS.map((option) => {
              const Icon = option.icon;
              const isActive = selectedOption === option.id;

              return (
                <button
                  key={option.id}
                  onClick={() => setSelectedOption(option.id)}
                  className={cn(
                    'w-full text-left flex items-start gap-4 p-4 rounded-xl transition-all duration-300',
                    isActive
                      ? 'bg-white/25 shadow-lg ring-2 ring-white/30'
                      : 'hover:bg-white/10'
                  )}
                >
                  <div className={cn(
                    'p-2 rounded-full flex-shrink-0 transition-colors',
                    isActive ? 'bg-white/20' : 'bg-white/5'
                  )}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{option.title}</p>
                    <p className="text-sm text-white/70">{option.description}</p>
                    {isActive && (
                      <p className="text-xs text-white/50 mt-1 flex items-center gap-1">
                        <span>Cliquez sur le formulaire à gauche</span>
                        <ArrowRight className="h-3 w-3" />
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ====== COLONNE GAUCHE – Formulaire ====== */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-12 bg-gradient-to-br from-background via-background to-primary/5">
        <div className="w-full max-w-md">
          {/* Logo & Titre (mobile) */}
          <div className="md:hidden text-center mb-6">
            <div className="inline-flex bg-gradient-to-r from-primary to-primary/70 p-3 rounded-full shadow-md mb-3">
              <Clock className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Olympic Basket-ball Center
            </h1>
            <p className="text-muted-foreground text-sm mt-1">Plateforme de gestion</p>
          </div>

          {/* ====== SÉLECTEUR MOBILE (tabs) ====== */}
          <div className="md:hidden flex bg-gray-100/80 backdrop-blur-sm rounded-xl p-1 mb-6 border border-gray-200/50">
            {OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isActive = selectedOption === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setSelectedOption(opt.id)}
                  className={cn(
                    'flex-1 flex flex-col items-center gap-0.5 py-2 px-1 rounded-lg text-xs font-medium transition-all duration-200',
                    isActive
                      ? 'bg-white shadow-sm text-primary ring-1 ring-primary/10'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="mt-0.5 text-[10px] leading-tight text-center">
                    {opt.id === 'inscription' ? 'Inscription' : opt.id === 'login' ? 'Connexion' : 'Réinitialiser'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Contenu du formulaire dynamique */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
            <div className="space-y-5">
              {selectedOption === 'inscription' && (
                <>
                  <div>
                    <h2 className="text-xl font-bold">Inscription Joueur</h2>
                    <p className="text-muted-foreground text-sm">Créez votre compte et rejoignez le club.</p>
                  </div>
                  <Link
                    to="/inscription/joueur"
                    className="w-full inline-flex justify-center items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg shadow-primary/25"
                  >
                    S’inscrire
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </>
              )}

              {selectedOption === 'login' && (
                <>
                  <div>
                    <h2 className="text-xl font-bold">Connexion</h2>
                    <p className="text-muted-foreground text-sm">Accédez à votre espace personnel.</p>
                  </div>
                  <Link
                    to="/login"
                    className="w-full inline-flex justify-center items-center gap-2 bg-secondary hover:bg-secondary/90 text-primary font-semibold py-3 px-6 rounded-xl transition-all shadow-lg shadow-secondary/25"
                  >
                    Se connecter
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </>
              )}

              {selectedOption === 'forgot' && (
                <>
                  <div>
                    <h2 className="text-xl font-bold">Mot de passe oublié</h2>
                    <p className="text-muted-foreground text-sm">Réinitialisez votre mot de passe.</p>
                  </div>
                  <Link
                    to="/forgot-password"
                    className="w-full inline-flex justify-center items-center gap-2 bg-muted hover:bg-muted/80 text-foreground font-semibold py-3 px-6 rounded-xl transition-all"
                  >
                    Réinitialiser
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Petit lien pour changer d'option (si besoin) */}
          <div className="mt-4 text-center text-xs text-muted-foreground md:hidden">
            <span className="inline-flex items-center gap-1">
              <ChevronDown className="h-3 w-3" />
              Utilisez les onglets ci-dessus pour changer
            </span>
          </div>
        </div>
      </div>

      
    </div>
  );
}