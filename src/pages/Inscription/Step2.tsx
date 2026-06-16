// apps/web/src/components/inscription/Step2.tsx
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
              {(watch('guardians') || []).map((g: any, idx: number) => (
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
            setValue('signatureFile', file as any);
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
}