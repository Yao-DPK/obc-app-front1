// src/pages/admin/AdminUserDetail.tsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useUserStore } from '@/stores/useUserStore';
import { UserDetailForm } from '@/components/UserDetailForm';
import { type UpdateProfileSchema } from '@/types';

export default function AdminUserDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const userId = Number(id);

  const { fetchUserById, updateUser, isLoading } = useUserStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userWithDetails, setUserWithDetails] = useState<any>(null);

  useEffect(() => {
    if (userId) {
      fetchUserById(userId).then((data) => {
        if (data) setUserWithDetails(data);
      });
    }
  }, [userId]);

  const handleSubmit = async (data: UpdateProfileSchema) => {
    setIsSubmitting(true);
    try {
      const payload = Object.fromEntries(
        Object.entries(data).filter(([_, v]) => v !== undefined && v !== null && v !== '')
      );
      await updateUser(userId, payload);
      toast.success('Utilisateur mis à jour avec succès');
      const updated = await fetchUserById(userId);
      if (updated) setUserWithDetails(updated);
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la mise à jour');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading && !userWithDetails) {
    return (
      <div className="space-y-6">
        <PageHeader title="Chargement..." description="Utilisateur" showBack />
        <Card>
          <CardContent className="py-12 space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!userWithDetails) {
    return (
      <div className="space-y-6">
        <PageHeader title="Utilisateur non trouvé" showBack />
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
            <p>L'utilisateur avec l'ID {userId} n'existe pas.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 mb-20">
      <PageHeader
        title={`${userWithDetails.firstName} ${userWithDetails.lastName}`}
        description={`${userWithDetails.email}`}
        showBack
      >
        <Button variant="outline" onClick={() => navigate(-1)} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Button>
      </PageHeader>

      <UserDetailForm
        user={userWithDetails}
        isLoading={isLoading}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        onCancel={() => navigate(-1)}
      />
    </div>
  );
}