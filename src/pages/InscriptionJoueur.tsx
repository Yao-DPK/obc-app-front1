// apps/web/src/pages/InscriptionJoueur.tsx
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useInscriptionForm } from '@/hooks/useInscriptionForm';
import { Step1 } from './Inscription/Step1';
import { Step2 } from './Inscription/Step2';
import { Step3 } from './Inscription/Step3';

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
    <div className="container max-w-3xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-primary text-center">
            {step === 1 ? 'Inscription joueur – Étape 1/3' : step === 2 ? 'Attestation – Étape 2/3' : 'Documents – Étape 3/3'}
          </CardTitle>
        </CardHeader>
        <CardContent>
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

            <div className="flex justify-between gap-4">
              {step > 1 && (
                <Button type="button" variant="outline" onClick={onPreviousStep}>
                  Retour
                </Button>
              )}
              {step < 3 ? (
                <Button type="button" variant="secondary" onClick={onNextStep}>
                  Suivant
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onSubmitFinal}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? 'Envoi en cours...' : 'Soumettre l’inscription'}
                </Button>
              )}
            </div>
          </form>
          <p className="text-center text-sm m-6">
            Déjà Inscrit ?{' '}
            <Link to="/login" className="text-secondary hover:underline">
              Connexion
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}