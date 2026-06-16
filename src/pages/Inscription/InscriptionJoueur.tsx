// apps/web/src/pages/InscriptionJoueur.tsx
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useInscriptionForm } from '@/hooks/useInscriptionForm';
import { Step1 } from './Step1';
import { Step2 } from './Step2';
import { Step3 } from './Step3';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const steps = [
  { id: 1, label: 'Informations' },
  { id: 2, label: 'Attestation' },
  { id: 3, label: 'Documents' },
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

  const { register, watch, setValue, getValues, formState } = form;
  const { errors } = formState;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/10 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            {steps.map((s, idx) => (
              <div key={s.id} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center relative z-10">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300',
                      step === s.id
                        ? 'bg-primary text-white ring-4 ring-primary/20'
                        : step > s.id
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-500'
                    )}
                  >
                    {step > s.id ? <CheckCircle2 size={20} /> : s.id}
                  </div>
                  <span className="text-xs mt-1 font-medium text-gray-600 hidden sm:block">
                    {s.label}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={cn(
                      'flex-1 h-0.5 mx-2 transition-all duration-300',
                      step > s.id ? 'bg-green-500' : 'bg-gray-200'
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <Card className="shadow-lg border-0 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-white rounded-t-lg">
            <CardTitle className="text-center text-2xl font-heading">
              {step === 1
                ? '📝 Informations personnelles'
                : step === 2
                ? '📄 Attestation et règlement'
                : '📎 Documents requis'}
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
              {step === 3 && <Step3 updateRequiredFile={updateRequiredFile} />}

              <div className="flex justify-between gap-4 pt-4 border-t">
                {step > 1 && (
                  <Button type="button" variant="outline" onClick={onPreviousStep} className="flex-1">
                    ← Retour
                  </Button>
                )}
                {step < 3 ? (
                  <Button
                    type="button"
                    className="flex-1 bg-primary hover:bg-primary/90 text-white"
                    onClick={onNextStep}
                  >
                    Suivant →
                  </Button>
                ) : (
                  <Button
                    type="button"
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    onClick={onSubmitFinal}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Envoi en cours...' : '📨 Soumettre l’inscription'}
                  </Button>
                )}
              </div>
            </form>
            <p className="text-center text-sm mt-6">
              Déjà Inscrit ?{' '}
              <Link to="/login" className="text-secondary hover:underline font-medium">
                Connexion
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}