// apps/web/src/pages/InscriptionJoueur.tsx
import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea'; // si shadcn fournit Textarea
import axios from 'axios';

// Schéma de la première étape
const joueurInfoSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  gender: z.enum(['M', 'F']),
  phone: z.string().optional(),
  address: z.string().optional(),
  school: z.string().optional(),
  class: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  isSelfManaged: z.boolean().default(false),
  guardians: z
    .array(
      z.object({
        email: z.string().email(),
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        phone: z.string().optional(),
        relationship: z.enum(['Père', 'Mère', 'Tuteur']),
      })
    )
    .optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

// Schéma de l’attestation
const attestationSchema = z.object({
  signatoryType: z.enum(['self', 'guardian']),
  selectedGuardianIndex: z.number().optional(),
  signatoryFullName: z.string().min(2),
  acceptedTerms: z.boolean().refine((val) => val === true, {
    message: 'Vous devez accepter les conditions',
  }),
  signatureFile: z.instanceof(File).refine((file) => file.size > 0, {
    message: 'Le fichier de signature est requis',
  }),
});

// Union des deux schémas
const fullRegistrationSchema = z.object({
  step1: joueurInfoSchema,
  step2: attestationSchema,
});

type JoueurFormData = z.infer<typeof joueurInfoSchema>;
type AttestationData = z.infer<typeof attestationSchema>;

export default function InscriptionJoueur() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSelfManaged, setIsSelfManaged] = useState(false);
  const [signatureFile, setSignatureFile] = useState<File | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
  } = useForm<JoueurFormData & AttestationData>({
    resolver: zodResolver(step === 1 ? joueurInfoSchema : attestationSchema),
    defaultValues: {
      gender: 'M',
      isSelfManaged: false,
      guardians: [
        { email: '', firstName: '', lastName: '', phone: '', relationship: 'Mère' },
      ],
      signatoryType: 'self',
      acceptedTerms: true,
      signatureFile: undefined,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'guardians',
  });

  const mutation = trpc.inscription.preRegister.useMutation({
    onSuccess: () => {
      toast.success('Inscription soumise ! Vérifiez votre email pour la suite.');
      navigate('/login');
    },
    onError: (err) => toast.error(err.message),
  });

  const onNextStep = (data: JoueurFormData) => {
    // Stocker les données de l’étape 1 dans le state (ou via le formulaire)
    // On passe à l’étape 2
    console.log("step: ", step );
    setStep(2);
  };

  const onSubmitFinal = async (data: AttestationData) => {
    console.log("step2: ", step );
    const step1Data = getValues() as JoueurFormData;
    const payload = {
      step1: step1Data,
      step2: data,
    };
    const formData = new FormData();
    formData.append('data', JSON.stringify(payload));
    if (signatureFile) formData.append('signature', signatureFile);
    try {

      console.log("Form Data to be sent: ", formData.get('data'));
      await axios.post('/api/inscription/pre-register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Inscription soumise !');
      navigate('/login');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur');
    }
  };

  const step1Fields = (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ... tous les champs existants ... */}
        <div>
          <Label>Email</Label>
          <Input {...register('email')} />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>
        <div>
          <Label>Mot de passe</Label>
          <Input type="password" {...register('password')} />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>
        <div>
          <Label>Confirmer mot de passe</Label>
          <Input type="password" {...register('confirmPassword')} />
          {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
        </div>
        <div>
          <Label>Nom</Label>
          <Input {...register('lastName')} />
          {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
        </div>
        <div>
          <Label>Prénom(s)</Label>
          <Input {...register('firstName')} />
          {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
        </div>
        <div>
          <Label>Date de naissance</Label>
          <Input type="date" {...register('birthDate')} />
          {errors.birthDate && <p className="text-red-500 text-sm">{errors.birthDate.message}</p>}
        </div>
        <div>
          <Label>Sexe</Label>
          <select {...register('gender')} className="w-full border rounded p-2">
            <option value="M">Masculin</option>
            <option value="F">Féminin</option>
          </select>
        </div>
        <div>
          <Label>Téléphone</Label>
          <Input {...register('phone')} />
        </div>
        <div>
          <Label>Lieu de résidence</Label>
          <Input {...register('address')} />
        </div>
        <div>
          <Label>Établissement scolaire</Label>
          <Input {...register('school')} />
        </div>
        <div>
          <Label>Classe / Niveau</Label>
          <Input {...register('class')} />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="selfManaged"
          {...register('isSelfManaged')}
          onCheckedChange={(checked) => setIsSelfManaged(checked as boolean)}
        />
        <Label htmlFor="selfManaged">Je gère moi-même mes paiements (sans garant)</Label>
      </div>

      {!isSelfManaged && (
        <div className="space-y-4">
          <Label>Garants (parents ou tuteurs)</Label>
          {fields.map((field, index) => (
            <div key={field.id} className="border p-4 rounded space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Input placeholder="Email du garant" {...register(`guardians.${index}.email`)} />
                <Input placeholder="Nom" {...register(`guardians.${index}.lastName`)} />
                <Input placeholder="Prénom" {...register(`guardians.${index}.firstName`)} />
                <Input placeholder="Téléphone" {...register(`guardians.${index}.phone`)} />
                <div>
                  <Select
                    value={watch(`guardians.${index}.relationship`)}
                    onValueChange={(value: 'Père' | 'Mère' | 'Tuteur') =>
                      setValue(`guardians.${index}.relationship`, value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Relation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Père">Père</SelectItem>
                      <SelectItem value="Mère">Mère</SelectItem>
                      <SelectItem value="Tuteur">Tuteur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {index > 0 && (
                <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)}>
                  Supprimer
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              append({
                email: '',
                firstName: '',
                lastName: '',
                phone: '',
                relationship: 'Mère',
              })
            }
          >
            + Ajouter un garant
          </Button>
        </div>
      )}

      {/* Contact d'urgence (affiché seulement si isSelfManaged) */}
      {isSelfManaged && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Contact d'urgence (nom)</Label>
            <Input {...register('emergencyContactName')} />
          </div>
          <div>
            <Label>Contact d'urgence (téléphone)</Label>
            <Input {...register('emergencyContactPhone')} />
          </div>
        </div>
      )}
    </>
  );

  const step2Fields = (
    <div className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-bold text-primary">Règlement</h3>
        <p className="text-sm">
          FCFA 50.000 à l’inscription annuelle + FCFA 15.000/mois (à payer au plus tard le 05 du mois en cours). 
          Prévoir à l’inscription 3 photos d’identité ainsi qu’un extrait de naissance.
        </p>
      </div>

      <div>
        <Label>Signataire de l'attestation</Label>
        <Select
          value={watch('signatoryType')}
          onValueChange={(val: 'self' | 'guardian') => {
            setValue('signatoryType', val);
            if (val === 'self') {
              const firstName = getValues('firstName');
              const lastName = getValues('lastName');
              setValue('signatoryFullName', `${firstName} ${lastName}`);
              setValue('selectedGuardianIndex', undefined);
            } else {
              // Sélectionner le premier garant par défaut
              const guardians = getValues('guardians');
              if (guardians && guardians.length > 0) {
                const firstGuardian = guardians[0];
                setValue('signatoryFullName', `${firstGuardian.firstName} ${firstGuardian.lastName}`);
                setValue('selectedGuardianIndex', 0);
              }
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Choisir le signataire" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="self">Moi-même (le joueur)</SelectItem>
            <SelectItem value="guardian">Un parent / garant</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {watch('signatoryType') === 'guardian' && (
        <div className="mt-2">
          <Label>Choisir le garant</Label>
          <Select
            value={watch('selectedGuardianIndex')?.toString()}
            onValueChange={(val) => {
              const idx = parseInt(val);
              const guardians = getValues('guardians');
              if (guardians && guardians[idx]) {
                setValue('selectedGuardianIndex', idx);
                setValue('signatoryFullName', `${guardians[idx].firstName} ${guardians[idx].lastName}`);
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un garant" />
            </SelectTrigger>
            <SelectContent>
              {(watch('guardians') || []).map((g, idx) => (
                <SelectItem key={idx} value={idx.toString()}>
                  {g.firstName} {g.lastName} ({g.relationship})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="mt-3">
        <Label>Nom complet du signataire (tel qu’il apparaîtra sur l’attestation)</Label>
        <Input {...register('signatoryFullName')} placeholder="ex: Jean Dupont" />
        {errors.signatoryFullName && <p className="text-red-500 text-sm">{errors.signatoryFullName.message}</p>}
      </div>
      
      <div className="border p-4 rounded-lg">
        <p className="font-serif italic">
          Je soussigné(e) <strong>{watch('signatoryFullName') || '___________'}</strong>,<br />
          <span className="text-sm">
            Après avoir pris connaissance des conditions précitées et les ayant acceptées, 
            demande l’inscription de mon enfant aux séances de basket-ball initiées par Olympic Basket-ball Center (à partir de 4 ans).
          </span>
        </p>
        <p className="mt-4 text-right">
          Fait à Abidjan, le <strong>{new Date().toLocaleDateString()}</strong>
        </p>
      </div>

      <div>
        <Label>Signature manuscrite scannée (PDF ou image)</Label>
        <Input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => {
            const file = e.target.files?.[0];
            setSignatureFile(file || null);
            setValue('signatureFile', file);   // 👈 clé : injecter la valeur dans le formulaire
          }}
        />
        {errors.signatureFile && <p className="text-red-500 text-sm">{errors.signatureFile.message}</p>}
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="acceptTerms" {...register('acceptedTerms')} />
        <Label htmlFor="acceptTerms">J’accepte les conditions générales et l’attestation ci‑dessus</Label>
      </div>
      {errors.acceptedTerms && <p className="text-red-500 text-sm">{errors.acceptedTerms.message}</p>}
    </div>
  );

  return (
    <div className="container max-w-3xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-primary text-center">
            {step === 1 ? 'Inscription joueur – Étape 1/2' : 'Attestation – Étape 2/2'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(step === 1 ? onNextStep : onSubmitFinal)}
            className="space-y-6"
          >
            {step === 1 ? step1Fields : step2Fields}

            <div className="flex justify-between gap-4">
              {step === 2 && (
                <Button type="button" variant="outline" onClick={() => setStep(1)}>
                  Retour
                </Button>
              )}
              <Button
                variant="secondary"
                type="submit"
                disabled={mutation.isLoading}
                className={step === 2 ? 'flex-1' : 'w-full'}
              >
                {step === 1
                  ? 'Suivant'
                  : mutation.isLoading
                  ? 'Envoi en cours...'
                  : 'Soumettre l’inscription'}
              </Button>
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