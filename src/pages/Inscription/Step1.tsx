// apps/web/src/components/inscription/Step1.tsx
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FieldError } from '@/components/ui/field';
import { User, Mail, Lock, Calendar, Phone, MapPin, School, Users, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
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
    <div className="space-y-8">
      {/* Section : Identité */}
      <div>
        <h3 className="text-sm font-semibold text-primary uppercase tracking-wider flex items-center gap-2 mb-4">
          <User className="h-4 w-4" />
          Identité du joueur
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="lastName">Nom *</Label>
            <Input id="lastName" {...register('lastName')} className="h-10" placeholder="Konan" />
            {errors.lastName && <FieldError errors={errors.lastName} />}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="firstName">Prénom(s) *</Label>
            <Input id="firstName" {...register('firstName')} className="h-10" placeholder="Kouadio" />
            {errors.firstName && <FieldError errors={errors.firstName} />}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="birthDate">Date de naissance *</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="birthDate" type="date" {...register('birthDate')} className="h-10 pl-9" />
            </div>
            {errors.birthDate && <FieldError errors={errors.birthDate} />}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="gender">Sexe *</Label>
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
            {errors.gender && <FieldError errors={errors.gender} />}
          </div>
        </div>
      </div>

      {/* Section : Coordonnées */}
      <div className="pt-4 border-t border-gray-100">
        <h3 className="text-sm font-semibold text-primary uppercase tracking-wider flex items-center gap-2 mb-4">
          <Mail className="h-4 w-4" />
          Coordonnées
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="email" {...register('email')} className="h-10 pl-9" placeholder="email@exemple.com" />
            </div>
            {errors.email && <FieldError errors={errors.email} />}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">Téléphone *</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="phone" {...register('phone')} className="h-10 pl-9" placeholder="07 57 99 05 48" />
            </div>
            {errors.phone && <FieldError errors={errors.phone} />}
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="address">Adresse</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="address" {...register('address')} className="h-10 pl-9" placeholder="Riviera Palmeraie, Cité SIPIM" />
            </div>
          </div>
        </div>
      </div>

      {/* Section : Scolarité */}
      <div className="pt-4 border-t border-gray-100">
        <h3 className="text-sm font-semibold text-primary uppercase tracking-wider flex items-center gap-2 mb-4">
          <School className="h-4 w-4" />
          Scolarité
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="school">Établissement scolaire</Label>
            <Input id="school" {...register('school')} className="h-10" placeholder="Lycée Classique d'Abidjan" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="class">Classe / Niveau</Label>
            <Input id="class" {...register('class')} className="h-10" placeholder="6e, 4e, etc." />
          </div>
        </div>
      </div>

      {/* Section : Garants */}
      <div className="pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-primary uppercase tracking-wider flex items-center gap-2">
            <Users className="h-4 w-4" />
            Garants
          </h3>
          {/* <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsSelfManaged(!isSelfManaged)}
            className={cn(
              'transition-colors',
              isSelfManaged ? 'border-primary text-primary hover:bg-primary/10' : ''
            )}
          >
            {isSelfManaged ? '🔓 Je suis autonome' : '🔒 Je suis mineur'}
          </Button> */}
        </div>

        {isSelfManaged ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-green-700">Mode joueur autonome</p>
              <p className="text-xs text-green-600">Vous êtes majeur ou autonome. Les champs de contact d'urgence sont facultatifs.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="bg-gray-50 border border-gray-200 p-4 rounded-lg space-y-3 hover:border-primary/30 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Garant {index + 1}</span>
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 px-2"
                      onClick={() => remove(index)}
                    >
                      ✕ Supprimer
                    </Button>
                  )}
                </div>
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
                        <SelectItem value="Père">👨 Père</SelectItem>
                        <SelectItem value="Mère">👩 Mère</SelectItem>
                        <SelectItem value="Tuteur">⚖️ Tuteur</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              className="w-full border-dashed hover:border-primary hover:bg-primary/5 transition-colors"
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
      </div>

      {/* Contact d'urgence (toujours présent) */}
      {/* <div className="pt-4 border-t border-gray-100">
        <h3 className="text-sm font-semibold text-primary uppercase tracking-wider flex items-center gap-2 mb-4">
          <AlertCircle className="h-4 w-4" />
          Contact d'urgence
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="emergencyContactName">Nom du contact</Label>
            <Input id="emergencyContactName" {...register('emergencyContactName')} className="h-10" placeholder="Personne à contacter" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="emergencyContactPhone">Téléphone d'urgence</Label>
            <Input id="emergencyContactPhone" {...register('emergencyContactPhone')} className="h-10" placeholder="07 57 99 05 48" />
          </div>
        </div>
      </div> */}

      {/* Sécurité */}
      {/* <div className="pt-4 border-t border-gray-100">
        <h3 className="text-sm font-semibold text-primary uppercase tracking-wider flex items-center gap-2 mb-4">
          <Lock className="h-4 w-4" />
          Sécurité
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="password">Mot de passe *</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="password" type="password" {...register('password')} className="h-10 pl-9" />
            </div>
            {errors.password && <FieldError errors={errors.password} />}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword">Confirmer le mot de passe *</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="confirmPassword" type="password" {...register('confirmPassword')} className="h-10 pl-9" />
            </div>
            {errors.confirmPassword && <FieldError errors={errors.confirmPassword} />}
          </div>
        </div>
      </div> */}
    </div>
  );
}