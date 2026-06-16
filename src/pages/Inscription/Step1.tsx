// apps/web/src/components/inscription/Step1.tsx
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
}