// src/components/admin/UserDetailForm.tsx
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save, Mail, Phone, MapPin, Calendar, Users, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AdultAvatar } from '@/components/CustomAdultAvatar';
import { updateProfileSchema, type UpdateProfileSchema } from '@/types';
import { cn } from '@/lib/utils';
import type { RegistrationStatus, User } from '@/types';
import { ROLE_LABELS } from '@/types/role.type';

interface UserDetailFormProps {
  user: User & { playerDetails?: any }; // L'utilisateur avec ses détails
  isLoading?: boolean;
  isSubmitting?: boolean;
  onSubmit: (data: UpdateProfileSchema) => Promise<void>;
  onCancel?: () => void;
  className?: string;
  readOnly?: boolean; // Mode lecture seule (pour visualisation sans modification)
}

export function UserDetailForm({
  user,
  isLoading = false,
  isSubmitting = false,
  onSubmit,
  onCancel,
  className,
  readOnly = false,
}: UserDetailFormProps) {
  const isPlayer = user?.role === 'player';

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<UpdateProfileSchema>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      address: '',
      gender: 'M',
      registrationStatus: 'pre_inscrit',
      birthDate: '',
      school: '',
      class: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
    },
  });

  // Remplir le formulaire lorsque les données sont chargées
  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        address: user.address || '',
        gender: user.gender || 'M',
        registrationStatus: user.registrationStatus || 'pre_inscrit',
        birthDate: user.playerDetails?.birthDate || '',
        school: user.playerDetails?.school || '',
        class: user.playerDetails?.class || '',
        emergencyContactName: user.playerDetails?.emergencyContactName || '',
        emergencyContactPhone: user.playerDetails?.emergencyContactPhone || '',
      });
    }
  }, [user, reset]);

  if (isLoading && !user) {
    return (
      <Card className={className}>
        <CardContent className="py-12 space-y-4">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className={className}>
        <CardContent className="py-12 text-center text-muted-foreground">
          <p>Utilisateur non trouvé.</p>
        </CardContent>
      </Card>
    );
  }

  const registrationStatuses = [
    { value: 'pre_inscrit', label: 'Pré-inscrit' },
    { value: 'inscrit', label: 'Inscrit' },
    { value: 'rejeté', label: 'Rejeté' },
    { value: 'suspendu', label: 'Suspendu' },
    { value: 'parent_invité', label: 'Parent invité' },
    { value: 'parent_inscrit', label: 'Parent inscrit' },
  ];

  


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn('space-y-6', className)}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ====== CARTE PROFIL ====== */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Profil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center text-center">
                <AdultAvatar
                  userId={user.id}
                  firstName={user.firstName || ''}
                  lastName={user.lastName || ''}
                  sexe={user.gender as 'M' | 'F' || 'M'}
                />
                <h3 className="mt-3 text-lg font-semibold">{user.firstName} {user.lastName}</h3>
                <Badge variant="outline" className="mt-1 bg-primary/10 text-primary border-primary/20">
                  {ROLE_LABELS[user.role] || user.role}
                </Badge>
              </div>

              <div className="border-t pt-4 space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{user.phone}</span>
                  </div>
                )}
                {user.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{user.address}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Membre depuis {new Date(user.createdAt).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Vérifié : {user.isVerified ? 'Oui' : 'Non'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ====== CARTE INFORMATIONS ====== */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Ligne Nom / Prénom */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input id="firstName" {...register('firstName')} disabled={readOnly} />
                  {errors.firstName && (
                    <p className="text-xs text-red-500">{errors.firstName.message}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input id="lastName" {...register('lastName')} disabled={readOnly} />
                  {errors.lastName && (
                    <p className="text-xs text-red-500">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              {/* Email (lecture seule) */}
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={user.email} disabled className="bg-muted/50" />
              </div>

              {/* Téléphone / Adresse */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input id="phone" {...register('phone')} disabled={readOnly} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="address">Adresse</Label>
                  <Input id="address" {...register('address')} disabled={readOnly} />
                </div>
              </div>

              {/* Genre / Statut inscription */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="gender">Genre</Label>
                  <Select
                    value={watch('gender')}
                    onValueChange={(val) => setValue('gender', val as 'M' | 'F')}
                    disabled={readOnly}
                  >
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Masculin</SelectItem>
                      <SelectItem value="F">Féminin</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.gender && (
                    <p className="text-xs text-red-500">{errors.gender.message}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="registrationStatus">Statut d'inscription</Label>
                  <Select
                    value={watch('registrationStatus')}
                    onValueChange={(val) => setValue('registrationStatus', val as RegistrationStatus)}
                    disabled={readOnly}
                  >
                    <SelectTrigger id="registrationStatus">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      {registrationStatuses.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.registrationStatus && (
                    <p className="text-xs text-red-500">{errors.registrationStatus.message}</p>
                  )}
                </div>
              </div>

              {/* ====== SECTION JOUEUR (conditionnelle) ====== */}
              {isPlayer && (
                <div className="pt-4 border-t">
                  <h3 className="text-sm font-semibold text-primary mb-4 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Informations joueur
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="birthDate">Date de naissance</Label>
                      <Input id="birthDate" type="date" {...register('birthDate')} disabled={readOnly} />
                      {errors.birthDate && (
                        <p className="text-xs text-red-500">{errors.birthDate.message}</p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="school">Établissement</Label>
                      <Input id="school" {...register('school')} disabled={readOnly} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="class">Classe</Label>
                      <Input id="class" {...register('class')} disabled={readOnly} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="emergencyContactName">Contact d'urgence (nom)</Label>
                      <Input id="emergencyContactName" {...register('emergencyContactName')} disabled={readOnly} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="emergencyContactPhone">Contact d'urgence (téléphone)</Label>
                      <Input id="emergencyContactPhone" {...register('emergencyContactPhone')} disabled={readOnly} />
                    </div>
                  </div>
                </div>
              )}

              {/* Boutons d'action (si non readOnly) */}
              {!readOnly && (
                <div className="flex justify-end gap-2 pt-4 border-t">
                  {onCancel && (
                    <Button type="button" variant="outline" onClick={onCancel}>
                      Annuler
                    </Button>
                  )}
                  <Button
                    type="submit"
                    disabled={isSubmitting || !isDirty}
                    className="gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Enregistrement...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Enregistrer
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </form>
    </motion.div>
  );
}