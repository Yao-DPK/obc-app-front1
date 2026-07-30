// apps/web/src/pages/InscriptionJoueur.tsx
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useInscriptionForm } from '@/hooks/useInscriptionForm';
import { CheckCircle2, ArrowRight, ArrowLeft, Send, User, FileText, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Step1 } from './Step1';
import { Step2 } from './Step2';
import { Step3 } from './Step3';
import { useDocumentTypeStore } from '@/stores/documents/useDocumentTypeStore';
import { useEffect } from 'react';

const steps = [
  { id: 1, label: 'Informations', icon: User },
  { id: 2, label: 'Attestation', icon: FileText },
  { id: 3, label: 'Documents', icon: Upload },
];

export default function InscriptionJoueur() {
  const {
    step,
    isSelfManaged,
    setIsSelfManaged,
    isSubmitting,
    form,
    fields,
    append,
    remove,
    onNextStep,
    onPreviousStep,
    updateRequiredFile,
    onSubmitFinal,
  } = useInscriptionForm();
  const { docTypes, fetchDocTypes } = useDocumentTypeStore();

  const { register, watch, setValue, getValues, formState } = form;
  const { errors } = formState;

  const stepTitles = {
    1: '📝 Informations personnelles',
    2: '📄 Attestation et règlement',
    3: '📎 Documents requis',
  };

  
  useEffect(() => {
    fetchDocTypes({names: ["Extrait de Naissance", "Photo"]});
    console.log(`DocTypes: ${JSON.stringify(docTypes)}`);
  }, [])


  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-secondary/5 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Logo / Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex bg-white shadow-lg rounded-2xl p-4 mb-4 border border-gray-100">
            <div className="bg-gradient-to-r from-primary to-primary/70 text-white p-3 rounded-xl">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Olympic Basket-ball Center
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Inscription des joueurs</p>
        </div>

        {/* Stepper amélioré */}
        <div className="mb-10">
          <div className="flex items-center justify-between relative max-w-2xl mx-auto">
            {steps.map((s, idx) => {
              const Icon = s.icon;
              const isActive = step === s.id;
              const isCompleted = step > s.id;

              return (
                <div key={s.id} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center relative z-10">
                    <motion.div
                      initial={false}
                      animate={{
                        scale: isActive ? 1.1 : 1,
                        backgroundColor: isCompleted ? '#22c55e' : isActive ? '#0B7A35' : '#e5e7eb',
                      }}
                      className={cn(
                        'w-12 h-12 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 shadow-md',
                        isActive && 'ring-4 ring-primary/20'
                      )}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-6 w-6 text-white" />
                      ) : (
                        <Icon className={cn('h-5 w-5', isActive ? 'text-white' : 'text-gray-500')} />
                      )}
                    </motion.div>
                    <span
                      className={cn(
                        'text-xs font-medium mt-2 transition-colors whitespace-nowrap',
                        isActive ? 'text-primary' : isCompleted ? 'text-green-600' : 'text-gray-400'
                      )}
                    >
                      {s.label}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div
                      className={cn(
                        'flex-1 h-1 mx-3 transition-all duration-500 rounded-full',
                        step > s.id ? 'bg-green-500' : 'bg-gray-200'
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="shadow-xl border-0 overflow-hidden rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-white p-6">
                <CardTitle className="text-center text-2xl font-heading flex items-center justify-center gap-3">
                  <span>{stepTitles[step as keyof typeof stepTitles]}</span>
                  <span className="bg-white/20 text-xs px-3 py-0.5 rounded-full">
                    Étape {step}/3
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 md:p-8">
                <form className="space-y-6">
                  {step === 1 && (
                    <Step1
                      isSelfManaged={isSelfManaged}
                      setIsSelfManaged={setIsSelfManaged}
                      fields={fields}
                      append={append}
                      remove={remove}
                      watch={watch}
                      setValue={setValue}
                      errors={errors}
                      register={register}
                    />
                  )}
                  {step === 2 && (
                    <Step2
                      register={register}
                      watch={watch}
                      setValue={setValue}
                      getValues={getValues}
                      errors={errors}
                    />
                  )}
                  {step === 3 && <Step3 
                  requiredDocTypes={docTypes}
                  updateRequiredFile={updateRequiredFile}
                  />}

                  {/* Navigation */}
                  <div className="flex flex-col sm:flex-row justify-between gap-3 pt-6 border-t border-gray-100">
                    <div>
                      {step > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={onPreviousStep}
                          className="w-full sm:w-auto gap-2"
                        >
                          <ArrowLeft className="h-4 w-4" />
                          Retour
                        </Button>
                      )}
                    </div>
                    <div className="flex-1 flex justify-end">
                      {step < 3 ? (
                        <Button
                          type="button"
                          className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white gap-2 px-8"
                          onClick={onNextStep}
                        >
                          Suivant
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white gap-2 px-8"
                          onClick={onSubmitFinal}
                          disabled={isSubmitting}
                        >
                          <Send className="h-4 w-4" />
                          {isSubmitting ? 'Envoi en cours...' : 'Soumettre l’inscription'}
                          {/* ToDO: Génération et sauvegarde du fichier de l'attestation après soumission de l'inscripttion */}
                        </Button>
                      )}

                    </div>
                  </div>
                </form>

                <p className="text-center text-sm text-muted-foreground mt-6">
                  Déjà inscrit ?{' '}
                  <Link to="/login" className="text-primary hover:underline font-medium">
                    Se connecter
                  </Link>
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}