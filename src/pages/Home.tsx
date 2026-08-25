// apps/web/src/pages/Home.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, LogIn, KeyRound, ArrowRight, ChevronDown, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';


type Option = 'inscription' | 'login' | 'forgot';

const OPTIONS = [
  {
    id: 'inscription' as Option,
    icon: UserPlus,
    title: 'Inscription Joueur',
    description: 'Créez votre compte et inscrivez-vous aux activités du club.',
    link: '/register',
    label: "S'inscrire",
    color: 'primary',
  },
  {
    id: 'login' as Option,
    icon: LogIn,
    title: 'Connexion',
    description: 'Accédez à votre espace personnel.',
    link: '/login',
    label: 'Se connecter',
    color: 'secondary',
  },
  {
    id: 'forgot' as Option,
    icon: KeyRound,
    title: 'Mot de passe oublié',
    description: 'Réinitialisez votre mot de passe en un clic.',
    link: '/forgot-password',
    label: 'Réinitialiser',
    color: 'muted',
  },
];

export default function Home() {
  const [selectedOption, setSelectedOption] = useState<Option>('inscription');

  const activeOption = OPTIONS.find(o => o.id === selectedOption)!;

  return (
    <div className="relative min-h-screen flex overflow-hidden">
      {/* ====== ÉLÉMENTS DÉCORATIFS ====== */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-secondary/10 rounded-full blur-3xl" />
      </div>

      {/* ====== COLONNE DROITE – OPTIONS (DESKTOP) ====== */}
      <div className="hidden md:flex w-[45%] lg:w-[48%] bg-gradient-to-br from-primary via-primary/90 to-primary/80 flex-col justify-center p-12 text-white shadow-2xl relative overflow-hidden ">
        {/* Décoration */}
        <div className="absolute top-[-20%] right-[-20%] w-[400px] h-[400px] bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-secondary/20 rounded-full blur-3xl" />

        <div className="max-w-lg mx-auto space-y-10 relative z-10">
          {/* Branding */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">OBC</h1>
                <p className="text-white/70 text-sm">Olympic Basket-ball Center</p>
              </div>
            </div>
            <p className="text-white/60 text-sm max-w-sm">
              Gérez vos inscriptions, documents et paiements en toute simplicité.
            </p>
          </div>

          {/* Options */}
          <div className="space-y-3">
            <p className="text-white/40 text-xs uppercase tracking-wider font-semibold">
              Choisissez une option
            </p>
            {OPTIONS.map((option) => {
              const Icon = option.icon;
              const isActive = selectedOption === option.id;

              return (
                <button
                  key={option.id}
                  onClick={() => setSelectedOption(option.id)}
                  className={cn(
                    'w-full text-left flex items-center gap-4 p-4 rounded-xl transition-all duration-300 group',
                    isActive
                      ? 'bg-white/25 shadow-lg ring-2 ring-white/30 backdrop-blur-sm'
                      : 'hover:bg-white/10'
                  )}
                >
                  <div className={cn(
                    'p-2.5 rounded-xl flex-shrink-0 transition-colors duration-300',
                    isActive ? 'bg-white/20' : 'bg-white/5 group-hover:bg-white/10'
                  )}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-white">{option.title}</p>
                    <p className="text-sm text-white/70">{option.description}</p>
                    {isActive && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-white/50 mt-0.5 flex items-center gap-1"
                      >
                        <Sparkles className="h-3 w-3" />
                        Option active
                      </motion.p>
                    )}
                  </div>
                  {isActive && (
                    <div className="w-2 h-2 rounded-full bg-white/60 flex-shrink-0 animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <p className="text-white/30 text-xs text-center pt-4 border-t border-white/10">
            © 2025 Olympic Basket-ball Center – Tous droits réservés
          </p>
        </div>
      </div>

      {/* ====== COLONNE GAUCHE – FORMULAIRE ====== */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 md:p-12 lg:p-16 relative z-10">
        <div className="w-full max-w-md">
          {/* Logo & Titre (mobile) */}
          <div className="md:hidden text-center mb-8">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Olympic Basket-ball Center
            </h1>
            <p className="text-muted-foreground text-sm mt-1">Plateforme de gestion</p>
          </div>

          {/* ====== SÉLECTEUR MOBILE ====== */}
          <div className="md:hidden flex bg-gray-100/80 backdrop-blur-sm rounded-xl p-1 mb-6 border border-gray-200/50">
            {OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isActive = selectedOption === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setSelectedOption(opt.id)}
                  className={cn(
                    'flex-1 flex flex-col items-center gap-0.5 py-2.5 px-1 rounded-lg text-xs font-medium transition-all duration-200',
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

          {/* ====== CARTE DU FORMULAIRE ====== */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/50 relative overflow-hidden">
            {/* Décoration interne */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary/10 rounded-full blur-2xl" />

            <div className="relative z-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedOption}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="space-y-5">
                    {/* En-tête du formulaire */}
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        'p-3 rounded-xl flex-shrink-0',
                        selectedOption === 'inscription' && 'bg-primary/10 text-primary',
                        selectedOption === 'login' && 'bg-secondary/10 text-secondary',
                        selectedOption === 'forgot' && 'bg-gray-100 text-gray-600'
                      )}>
                        {activeOption.icon && <activeOption.icon className="h-6 w-6" />}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">{activeOption.title}</h2>
                        <p className="text-muted-foreground text-sm">{activeOption.description}</p>
                      </div>
                    </div>

                    {/* Bouton d'action */}
                    <Link to={activeOption.link}>
                      <Button
                        className={cn(
                          'w-full h-12 text-base font-semibold gap-2 transition-all duration-200 group',
                          selectedOption === 'inscription' && 'bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25',
                          selectedOption === 'login' && 'bg-secondary hover:bg-secondary/90 text-primary shadow-lg shadow-secondary/25',
                          selectedOption === 'forgot' && 'bg-gray-800 hover:bg-gray-900 text-white shadow-lg shadow-gray-800/25'
                        )}
                      >
                        {activeOption.label}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>

                    {/* Information supplémentaire */}
                    {selectedOption === 'inscription' && (
                      <p className="text-xs text-center text-muted-foreground">
                        ⚡ Inscription rapide en 3 étapes
                      </p>
                    )}
                    {selectedOption === 'login' && (
                      <p className="text-xs text-center text-muted-foreground">
                        🔐 Accès sécurisé à votre espace personnel
                      </p>
                    )}
                    {selectedOption === 'forgot' && (
                      <p className="text-xs text-center text-muted-foreground">
                        📧 Un lien de réinitialisation vous sera envoyé par email
                      </p>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Indicateur mobile */}
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