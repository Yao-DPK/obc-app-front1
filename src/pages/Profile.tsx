import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/stores/useAuth';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Loader2,
  Pencil,
} from 'lucide-react';
import { AdultAvatar } from '@/components/CustomAdultAvatar';
import { RoleBadge } from './RoleBadge';
import { ROLE_CONFIG } from './RoleBadge';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { userService } from '@/lib/services/user.service';
import { useUserStore } from '@/stores/useUserStore';

// Schéma de validation pour le formulaire
const profileSchema = z.object({
  firstName: z.string().min(1, 'Le prénom est requis'),
  lastName: z.string().min(1, 'Le nom est requis'),
  email: z.string().email('Email invalide'),
  phone: z.string().optional(),
  address: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, setAuth } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPhotoUploading, setIsPhotoUploading] = useState(false);
  const { uploadProfilePicture } = useUserStore();


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
    },
  });

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  const joinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('fr-FR')
    : 'N/A';

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    try {
      await userService.updateProfile(data);
      // Mettre à jour le store avec les nouvelles données
      setAuth({ ...user, ...data }, useAuth.getState().accessToken!);
      toast.success('Profil mis à jour avec succès !');
      setIsDialogOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Vérifier la taille et le type (optionnel)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('La photo ne doit pas dépasser 5 Mo');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Veuillez sélectionner une image');
        return;
      }

      setIsPhotoUploading(true);
      try {
        await uploadProfilePicture(file);
        toast.success('Photo de profil mise à jour');
        // Optionnel : fermer le modal ou rafraîchir les données
        // Si le store recharge le profil, la photo sera mise à jour
      } catch (error) {
        toast.error('Erreur lors du téléchargement de la photo');
      } finally {
        setIsPhotoUploading(false);
        // Réinitialiser l'input pour permettre de sélectionner le même fichier
        e.target.value = '';
      }
    };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 mb-20"
    >
      <PageHeader
        title={`${user.firstName || ''} ${user.lastName || ''}`}
        description="Votre profil et vos informations personnelles"
        showBack={true}
        
      >
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Pencil className="h-4 w-4" />
              Modifier le profil
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Modifier mes informations</DialogTitle>
            </DialogHeader>

          {/* ====== SECTION PHOTO ====== */}
            <div className="flex items-center gap-4 mb-4">
              <div className="relative h-20 w-20 rounded-full overflow-hidden border-2 border-primary/20 flex-shrink-0">
                {user?.photoUrl ? (
                  <img
                    src={user.photoUrl}
                    alt="Photo de profil"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-2xl font-semibold text-gray-500">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <Label
                  htmlFor="photo-upload"
                  className="cursor-pointer bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition inline-block"
                >
                  Changer la photo
                </Label>
                <Input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={isPhotoUploading}
                />
                {isPhotoUploading && (
                  <Loader2 className="h-4 w-4 animate-spin ml-2 inline-block" />
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Formats acceptés : JPG, PNG, GIF. Max 5 Mo.
                </p>
              </div>
            </div>            

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="firstName">Prénom *</Label>
                  <Input id="firstName" {...register('firstName')} />
                  {errors.firstName && (
                    <p className="text-xs text-red-500">{errors.firstName.message}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="lastName">Nom *</Label>
                  <Input id="lastName" {...register('lastName')} />
                  {errors.lastName && (
                    <p className="text-xs text-red-500">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" {...register('email')} />
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="phone">Téléphone</Label>
                <Input id="phone" type="tel" {...register('phone')} />
                {errors.phone && (
                  <p className="text-xs text-red-500">{errors.phone.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="address">Adresse</Label>
                <Input id="address" {...register('address')} />
                {errors.address && (
                  <p className="text-xs text-red-500">{errors.address.message}</p>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    'Enregistrer'
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ====== CARTE PROFIL ====== */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-green-600" />
              Informations personnelles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <AdultAvatar
                userId={user.id!}
                firstName={user.firstName || ''}
                lastName={user.lastName || ''}
                sexe={user.gender as 'M' | 'F'}
              />
              <div>
                <h2 className="text-xl font-bold">
                  {user.firstName} {user.lastName}
                </h2>
                <RoleBadge role={user.role} size="md" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Prénom</p>
                <p className="font-medium">{user.firstName || '—'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Nom</p>
                <p className="font-medium">{user.lastName || '—'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" />
                  Email
                </p>
                <p className="font-medium">{user.email || '—'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" />
                  Téléphone
                </p>
                <p className="font-medium">{user.phone || '—'}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  Adresse
                </p>
                <p className="font-medium">{user.address || 'Non renseignée'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ====== CARTE COMPTE ====== */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              Compte
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Rôle</p>
              <p className="font-medium capitalize">
                {ROLE_CONFIG[user.role as keyof typeof ROLE_CONFIG]?.label || user.role}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                Membre depuis
              </p>
              <p className="font-medium">{joinedDate}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Statut</p>
              <Badge className="bg-green-100 text-green-700 border-green-200">
                ✅ Actif
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}