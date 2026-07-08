// apps/web/src/components/inscription/Step2.tsx
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FieldError } from '@/components/ui/field';
import { FileSignature, Users, PenLine, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface Step2Props {
  register: any;
  watch: any;
  setValue: any;
  getValues: any;
  errors: any;
}

export function Step2({ register, watch, setValue, getValues, errors }: Step2Props) {
  const signatoryFullName = watch('signatoryFullName') || '___________';

  return (
    <div className="space-y-8">
      {/* En-tête avec rappel des tarifs */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-l-4 border-primary rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="bg-primary/20 p-2 rounded-lg">
            <FileSignature className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-heading text-primary text-lg">📋 Règlement et conditions</h3>
            <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-gray-700">
              <div className="bg-white/60 p-2 rounded-lg">
                <span className="text-muted-foreground">Inscription annuelle</span>
                <p className="font-bold text-primary">50 000 FCFA</p>
              </div>
              <div className="bg-white/60 p-2 rounded-lg">
                <span className="text-muted-foreground">Mensualité</span>
                <p className="font-bold text-primary">15 000 FCFA</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              ⚠️ À payer au plus tard le 05 du mois en cours.<br />
              Prévoir : 3 photos d'identité + extrait de naissance.
            </p>
          </div>
        </div>
      </div>

      {/* Signataire */}
      <div>
        <Label className="flex items-center gap-2 font-semibold">
          <Users className="h-4 w-4" />
          Signataire de l'attestation
        </Label>
        <Select
          value={watch('signatoryType')}
          onValueChange={(val: 'guardian' | 'self') => {
            setValue('signatoryType', val);
            if (val === 'self') {
              const firstName = getValues('firstName');
              const lastName = getValues('lastName');
              setValue('signatoryFullName', `${firstName} ${lastName}`.trim() || '');
              setValue('selectedGuardianIndex', undefined);
            } else {
              const guardians = getValues('guardians');
              if (guardians && guardians.length > 0) {
                setValue('signatoryFullName', `${guardians[0].firstName} ${guardians[0].lastName}`.trim() || '');
                setValue('selectedGuardianIndex', 0);
              }
            }
          }}
        >
          <SelectTrigger className="h-11 mt-1">
            <SelectValue placeholder="Choisir le signataire" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="guardian">👨‍👩‍👦 Un parent / garant</SelectItem>
           {/*  <SelectItem value="self">👤 Moi‑même (le joueur)</SelectItem> */}
          </SelectContent>
        </Select>
      </div>

      {/* Sélection du garant */}
      {watch('signatoryType') === 'guardian' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 border border-gray-200 rounded-lg p-4"
        >
          <Label>Choisir le garant</Label>
          <Select
            value={watch('selectedGuardianIndex')?.toString()}
            onValueChange={(val) => {
              const idx = parseInt(val);
              const guardians = getValues('guardians');
              if (guardians && guardians[idx]) {
                setValue('selectedGuardianIndex', idx);
                setValue('signatoryFullName', `${guardians[idx].firstName} ${guardians[idx].lastName}`.trim() || '');
              }
            }}
          >
            <SelectTrigger className="h-11 mt-1">
              <SelectValue placeholder="Sélectionner un garant" />
            </SelectTrigger>
            <SelectContent>
              {(watch('guardians') || []).map((g: any, idx: number) => (
                <SelectItem key={idx} value={idx.toString()}>
                  {g.firstName} {g.lastName} ({g.relationship})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>
      )}

      {/* Nom complet du signataire */}
      <div className="space-y-1.5">
        <Label className="flex items-center gap-2">
          <PenLine className="h-4 w-4" />
          Nom complet du signataire
        </Label>
        <p className="text-xs text-muted-foreground">Tel qu'il apparaîtra sur l'attestation</p>
        <Input
          {...register('signatoryFullName')}
          placeholder="Jean Dupont"
          className="h-11 font-semibold text-primary bg-primary/5 border-primary/20"
        />
        {errors.signatoryFullName && <FieldError errors={errors.signatoryFullName} />}
      </div>

      {/* Attestation */}
      <div className="border-2 border-primary/20 bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="relative">
          <div className="absolute -top-3 left-6 bg-white px-2 text-xs font-semibold text-primary uppercase tracking-wider">
            Attestation
          </div>
          <div className="pt-4">
            <p className="font-serif italic text-gray-800 leading-relaxed text-sm">
              Je soussigné(e) <strong className="text-primary">{signatoryFullName}</strong>,<br />
              <span className="text-sm text-gray-600">
                Après avoir pris connaissance des conditions précitées et les ayant acceptées,
                demande l'inscription de mon enfant aux séances de basket-ball initiées par
                <strong> Olympic Basket-ball Center</strong>.
              </span>
            </p>
            <div className="mt-4 flex justify-between text-sm text-gray-500 border-t border-gray-100 pt-4">
              <span>Fait à <strong>Abidjan</strong></span>
              <span>Le <strong>{new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Upload signature */}
      <div className="space-y-1.5">
        <Label className="flex items-center gap-2">
          <FileSignature className="h-4 w-4" />
          Signature manuscrite scannée (PDF ou image)
        </Label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors hover:bg-primary/5 cursor-pointer">
          <Input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="cursor-pointer"
            onChange={(e) => {
              const file = e.target.files?.[0];
              setValue('signatureFile', file as any);
            }}
          />
          <p className="text-xs text-muted-foreground mt-2">Format accepté : PDF, JPG, PNG (max 5 Mo)</p>
        </div>
        {errors.signatureFile && <FieldError errors={errors.signatureFile} />}
      </div>

      {/* Checkbox */}
      <div className="flex items-start space-x-3 bg-green-50/50 p-4 rounded-lg border border-green-200">
        <Checkbox id="acceptTerms" {...register('acceptedTerms')} className="mt-0.5" />
        <Label htmlFor="acceptTerms" className="text-sm text-gray-700 cursor-pointer leading-relaxed">
          J'accepte les conditions générales et l'attestation ci‑dessus.
          <span className="block text-xs text-green-600 mt-0.5">✅ Ceci engage votre responsabilité légale.</span>
        </Label>
      </div>
      {errors.acceptedTerms && <FieldError errors={errors.acceptedTerms} />}
    </div>
  );
}