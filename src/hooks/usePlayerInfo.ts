// src/hooks/usePlayer.ts
import { useEffect, useState } from 'react';
import { useAuth } from '@/stores/useAuth';
import { useDocumentStore } from '@/stores/documents/useDocumentStore';
import { usePaymentStore } from '@/stores/usePaymentStore';
import { useUserStore } from '@/stores/useUserStore';
import { userService } from '@/lib/services/user.service';

interface UsePlayerInfoProps {
  userId?: number; // optionnel : si non fourni, utilise l'utilisateur connecté
}

export function usePlayerInfo({ userId }: UsePlayerInfoProps = {}) {
  const { user: authUser } = useAuth();
  const {
    user,
    fetchUserById,
    isLoading: userLoading,
  } = useUserStore();

  const {
    documents,
    fetchDocuments,
    isLoading: docsLoading,
  } = useDocumentStore();

  const {
    obligations,
    fetchObligations,
    isLoading: paymentLoading,
  } = usePaymentStore();

  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(null);
  const [isPhotoLoading, setIsPhotoLoading] = useState(false);

  // Déterminer l'ID du joueur à charger
  const targetUserId = userId ?? authUser?.id;

  // Chargement des données (utilisateur, documents, paiements)
  useEffect(() => {
    if (targetUserId) {
      fetchUserById(targetUserId);
      fetchDocuments({ userId: targetUserId });
      fetchObligations({ playerIds: [targetUserId] });
    }
  }, [targetUserId]);

  // Récupération de la photo de profil signée
  useEffect(() => {
    const fetchPhoto = async () => {
      if (!targetUserId) {
        setProfilePhotoUrl(null);
        return;
      }
      setIsPhotoLoading(true);
      try {
        const { signedUrl } = await userService.fetchUserPicture(targetUserId);
        setProfilePhotoUrl(signedUrl);
      } catch {
        setProfilePhotoUrl(null);
      } finally {
        setIsPhotoLoading(false);
      }
    };
    fetchPhoto();
  }, [targetUserId]);

  // Calculs des métriques
  const isLoading = userLoading || docsLoading || paymentLoading;

  const pendingDocs = documents.filter(
    (d) => d.documentStatus === 'En attente de Validation'
  ).length;

  const totalDocs = documents.length;

  const pendingObligations = obligations.filter(
    (o) => o.status === 'pending' || o.status === 'partial' || o.status === 'overdue'
  ).length;

  const overdueObligations = obligations.filter(
    (o) => o.status === 'overdue'
  ).length;

  const totalAmount = obligations.reduce((sum, o) => sum + Number(o.totalAmount), 0);
  const totalPaid = obligations.reduce((sum, o) => sum + Number(o.paidAmount || 0), 0);
  const remainingAmount = totalAmount - totalPaid;

  return {
    user: user ?? authUser, // fallback si le store n'a pas encore chargé
    isLoading,
    isPhotoLoading,
    setIsPhotoLoading,
    profilePhotoUrl,
    setProfilePhotoUrl,
    pendingDocs,
    totalDocs,
    pendingObligations,
    overdueObligations,
    totalAmount,
    totalPaid,
    remainingAmount,
    documents,
    obligations,
  };
}