// pages/admin/Profile.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import axios from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const profileSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
});

const passwordSchema = z.object({
  oldPassword: z.string().min(6),
  newPassword: z.string().min(6),
  confirmPassword: z.string().min(6),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

export default function AdminProfile() {
  const { user, updateUser } = useAuth();
  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: user,
  });
  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
  });

  const onProfileSubmit = async (data) => {
    try {
      const res = await axios.put('/admin/profile', data);
      updateUser(res.data);
      toast.success('Profil mis à jour');
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  };

  const onPasswordSubmit = async (data) => {
    try {
      await axios.put('/admin/change-password', data);
      toast.success('Mot de passe modifié');
      passwordForm.reset();
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader title="Mon profil" />
      <Card>
        <CardHeader><CardTitle>Informations personnelles</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
            <div><Label>Nom</Label><Input {...profileForm.register('lastName')} /></div>
            <div><Label>Prénom</Label><Input {...profileForm.register('firstName')} /></div>
            <div><Label>Email</Label><Input {...profileForm.register('email')} /></div>
            <div><Label>Téléphone</Label><Input {...profileForm.register('phone')} /></div>
            <Button type="submit">Enregistrer</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Changer le mot de passe</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
            <div><Label>Ancien mot de passe</Label><Input type="password" {...passwordForm.register('oldPassword')} /></div>
            <div><Label>Nouveau mot de passe</Label><Input type="password" {...passwordForm.register('newPassword')} /></div>
            <div><Label>Confirmer</Label><Input type="password" {...passwordForm.register('confirmPassword')} /></div>
            <Button type="submit">Modifier</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}