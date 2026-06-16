// apps/web/src/components/inscription/Step1.tsx
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FieldError } from '@/components/ui/field';
import type { FieldArrayWithId } from 'react-hook-form';

interface Step1Props {
  isSelfManaged: boolean;
  setIsSelfManaged: (value: boolean) => void;
  fields: FieldArrayWithId[];
  append: (value: any) => void;
  remove: (index: number) => void;
  watch: any;
  setValue: any;
  errors: any;
  register: any;
}

export function Step1({
  isSelfManaged,
  setIsSelfManaged,
  fields,
  append,
  remove,
  watch,
  setValue,
  errors,
  register,
}: Step1Props) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" {...register('email')} className="h-10" />
          {errors.email && <FieldError errors={errors.email} />}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Mot de passe</Label>
          <Input id="password" type="password" {...register('password')} className="h-10" />
          {errors.password && <FieldError errors={errors.password} />}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">Confirmer</Label>
          <Input id="confirmPassword" type="password" {...register('confirmPassword')} className="h-10" />
          {errors.confirmPassword && <FieldError errors={errors.confirmPassword} />}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="lastName">Nom</Label>
          <Input id="lastName" {...register('lastName')} className="h-10" />
          {errors.lastName && <FieldError errors={errors.lastName} />}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="firstName">Prénom(s)</Label>
          <Input id="firstName" {...register('firstName')} className="h-10" />
          {errors.firstName && <FieldError errors={errors.firstName} />}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="birthDate">Date de naissance</Label>
          <Input id="birthDate" type="date" {...register('birthDate')} className="h-10" />
          {errors.birthDate && <FieldError errors={errors.birthDate} />}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="gender">Sexe</Label>
          <Select
            value={watch('gender')}
            onValueChange={(val) => setValue('gender', val)}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Choisir" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="M">Masculin</SelectItem>
              <SelectItem value="F">Féminin</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">Téléphone</Label>
          <Input id="phone" {...register('phone')} className="h-10" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="address">Lieu de résidence</Label>
          <Input id="address" {...register('address')} className="h-10" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="school">Établissement scolaire</Label>
          <Input id="school" {...register('school')} className="h-10" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="class">Classe / Niveau</Label>
          <Input id="class" {...register('class')} className="h-10" />
        </div>
      </div>

      {/* <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg">
        <Checkbox
          id="selfManaged"
          {...register('isSelfManaged')}
          onCheckedChange={(checked) => setIsSelfManaged(checked as boolean)}
        />
        <Label htmlFor="selfManaged" className="text-sm">Je gère moi‑même mes paiements (sans garant)</Label>
      </div> */}

      {!isSelfManaged && (
        <div className="space-y-4">
          <Label className="font-semibold">Garants (parents ou tuteurs)</Label>
          {fields.map((field, index) => (
            <div key={field.id} className="border border-gray-200 p-4 rounded-lg space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                  Supprimer ce garant
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            className="w-full"
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

      {isSelfManaged && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <Label htmlFor="emergencyContactName">Contact d'urgence (nom)</Label>
            <Input id="emergencyContactName" {...register('emergencyContactName')} className="h-10" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="emergencyContactPhone">Contact d'urgence (téléphone)</Label>
            <Input id="emergencyContactPhone" {...register('emergencyContactPhone')} className="h-10" />
          </div>
        </div>
      )}
    </div>
  );
}