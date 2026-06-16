// apps/web/src/components/inscription/Step2.tsx
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FieldError } from '@/components/ui/field';

interface Step2Props {
  register: any;
  watch: any;
  setValue: any;
  getValues: any;
  errors: any;
}

export function Step2({ register, watch, setValue, getValues, errors }: Step2Props) {
  return (
    <div className="space-y-6">
      <div className="bg-primary/5 border-l-4 border-primary p-4 rounded-r-lg">
        <h3 className="font-heading text-primary text-lg">📋 Règlement et conditions</h3>
        <p className="text-sm text-gray-700">
          FCFA 50.000 à l’inscription annuelle + FCFA 15.000/mois (à payer au plus tard le 05 du mois en cours).<br />
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
              const guardians = getValues('guardians');
              if (guardians && guardians.length > 0) {
                setValue('signatoryFullName', `${guardians[0].firstName} ${guardians[0].lastName}`);
                setValue('selectedGuardianIndex', 0);
              }
            }
          }}
        >
          <SelectTrigger className="h-10">
            <SelectValue placeholder="Choisir le signataire" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="self">Moi‑même (le joueur)</SelectItem>
            <SelectItem value="guardian">Un parent / garant</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {watch('signatoryType') === 'guardian' && (
        <div>
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
            <SelectTrigger className="h-10">
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
        </div>
      )}

      <div className="space-y-1.5">
        <Label>Nom complet du signataire (tel qu’il apparaîtra sur l’attestation)</Label>
        <Input {...register('signatoryFullName')} placeholder="ex: Jean Dupont" className="h-10" />
        {errors.signatoryFullName && <FieldError errors={errors.signatoryFullName} />}
      </div>

      <div className="border-2 border-primary/20 bg-white p-5 rounded-lg shadow-sm">
        <p className="font-serif italic text-gray-800 leading-relaxed">
          Je soussigné(e) <strong>{watch('signatoryFullName') || '___________'}</strong>,<br />
          <span className="text-sm">
            Après avoir pris connaissance des conditions précitées et les ayant acceptées, 
            demande l’inscription de mon enfant aux séances de basket-ball initiées par Olympic Basket-ball Center (à partir de 4 ans).
          </span>
        </p>
        <p className="mt-4 text-right text-sm text-gray-600">
          Fait à Abidjan, le <strong>{new Date().toLocaleDateString()}</strong>
        </p>
      </div>

      <div className="space-y-1.5">
        <Label>Signature manuscrite scannée (PDF ou image)</Label>
        <Input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          className="h-10"
          onChange={(e) => {
            const file = e.target.files?.[0];
            setValue('signatureFile', file as any);
          }}
        />
        {errors.signatureFile && <FieldError errors={errors.signatureFile} />}
      </div>

      <div className="flex items-center space-x-2 bg-green-50 p-3 rounded-lg">
        <Checkbox id="acceptTerms" {...register('acceptedTerms')} />
        <Label htmlFor="acceptTerms" className="text-sm">J’accepte les conditions générales et l’attestation ci‑dessus</Label>
      </div>
      {errors.acceptedTerms && <FieldError errors={errors.acceptedTerms} />}
    </div>
  );
}