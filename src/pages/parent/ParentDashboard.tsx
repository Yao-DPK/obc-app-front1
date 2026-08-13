// src/pages/dashboard/ParentDashboard.tsx
import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Users,
  FileText,
  CreditCard,
  AlertCircle,
  CheckCircle,

  ChevronRight,

  DollarSign,
  Clock,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/stores/useAuth';
import { useGuardianStore } from '@/stores/useGuardianStore';
import { useDocumentStore } from '@/stores/documents/useDocumentStore';
import { usePaymentStore } from '@/stores/usePaymentStore';
import { getAge } from '@/utils/utils';

// ========== SOUS-COMPOSANTS ==========

const StatSkeleton = () => (
  <Card>
    <CardHeader className="pb-2">
      <Skeleton className="h-4 w-24" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-8 w-16" />
    </CardContent>
  </Card>
);

const ChildCardSkeleton = () => (
  <div className="flex items-center justify-between p-4 border rounded-lg">
    <div className="flex items-center gap-3">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div>
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24 mt-1" />
      </div>
    </div>
    <Skeleton className="h-8 w-20" />
  </div>
);

// ========== COMPOSANT PRINCIPAL ==========

export default function ParentDashboard() {
  const { user } = useAuth();
  const {
    players,
    getMyPlayers,
    isLoading: playersLoading,
  } = useGuardianStore();
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

  // ========== CHARGEMENT DES DONNÉES ==========
  useEffect(() => {
    const loadData = async () => {
      await getMyPlayers();
      // Récupérer les documents et paiements pour tous les enfants
      if (players.length > 0) {
        const playerIds = players.map((p) => p.id);
        await fetchDocuments({ playerIds });
        await fetchObligations({ playerIds });
      }
    };
    loadData();
  }, [user]);

  // ========== CALCULS ==========
  const isLoading = playersLoading || docsLoading || paymentLoading;

  const childrenCount = players.length;

  // Documents manquants (documents obligatoires non validés)
  const missingDocs = useMemo(() => {
    return players.filter((player) => {
      const playerDocs = documents.filter((d) => d.userId === player.id);
      const hasMandatoryValid = playerDocs.some(
        (d) => d.isObligatory && d.documentStatus === 'Validé'
      );
      return !hasMandatoryValid;
    }).length;
  }, [players, documents]);

  // Paiements en retard (obligations en attente avec date dépassée)
  const overduePayments = useMemo(() => {
    const now = new Date();
    return obligations.filter((p) => {
      if (p.status !== 'pending' && p.status !== 'partial') return false;
      if (!p.dueDate) return false;
      return new Date(p.dueDate) < now;
    }).length;
  }, [obligations]);

  // Paiements en attente (tous les paiements non réglés)
  const pendingPayments = useMemo(() => {
    return obligations.filter((p) => p.status === 'pending' || p.status === 'partial').length;
  }, [obligations]);

  // Total des frais restants
  const totalRemaining = useMemo(() => {
    return obligations.reduce((sum, p) => sum + Number(p.remainingAmount || 0), 0);
  }, [obligations]);

  // ========== RENDU DE CHARGEMENT ==========
  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Tableau de bord" description="Chargement de vos informations..." />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatSkeleton />
          <StatSkeleton />
          <StatSkeleton />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            <ChildCardSkeleton />
            <ChildCardSkeleton />
            <ChildCardSkeleton />
          </CardContent>
        </Card>
      </div>
    );
  }

  // ========== RENDU PRINCIPAL ==========
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 mb-20"
    >
      {/* ====== EN-TÊTE ====== */}
      <PageHeader
        title={`Bonjour ${user?.firstName || ''} 👋`}
        description="Suivez les activités de vos enfants"
      />

      {/* ====== STATISTIQUES ====== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Enfants inscrits
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{childrenCount}</div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {childrenCount === 0 ? 'Aucun enfant enregistré' : 'Voir la liste ci-dessous'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Documents manquants
            </CardTitle>
            <FileText className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{missingDocs}</div>
            {missingDocs > 0 ? (
              <p className="text-xs text-orange-600 flex items-center gap-1 mt-0.5">
                <AlertCircle className="h-3 w-3" /> Documents à fournir
              </p>
            ) : (
              <p className="text-xs text-green-600 flex items-center gap-1 mt-0.5">
                <CheckCircle className="h-3 w-3" /> Tous les documents sont à jour
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Paiements en attente
            </CardTitle>
            <CreditCard className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingPayments}</div>
            {pendingPayments > 0 ? (
              <p className="text-xs text-amber-600 flex items-center gap-1 mt-0.5">
                <Clock className="h-3 w-3" /> {pendingPayments} paiement{pendingPayments > 1 ? 's' : ''} à régler
              </p>
            ) : (
              <p className="text-xs text-green-600 flex items-center gap-1 mt-0.5">
                <CheckCircle className="h-3 w-3" /> Aucun impayé
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Reste à payer
            </CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalRemaining.toLocaleString()} FCFA
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {overduePayments > 0 && (
                <span className="text-red-600">⚠️ {overduePayments} en retard</span>
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ====== ALERTES ====== */}
      {missingDocs > 0 && (
        <Card className="border-orange-200 bg-orange-50/50">
          <CardContent className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4">
            <AlertCircle className="h-5 w-5 text-orange-500 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-orange-700">
                📄 {missingDocs} document{missingDocs > 1 ? 's' : ''} obligatoire{missingDocs > 1 ? 's' : ''} manquant{missingDocs > 1 ? 's' : ''}
              </p>
              <p className="text-xs text-orange-600">
                Veuillez fournir les documents requis pour vos enfants.
              </p>
            </div>
            <Button variant="outline" size="sm" className="border-orange-300 text-orange-700 hover:bg-orange-100" asChild>
              <Link to="/parent/documents">
                Voir les documents
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {overduePayments > 0 && (
        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-700">
                ⚠️ {overduePayments} paiement{overduePayments > 1 ? 's' : ''} en retard
              </p>
              <p className="text-xs text-red-600">
                Régularisez rapidement pour éviter des frais supplémentaires.
              </p>
            </div>
            <Button variant="destructive" size="sm" asChild>
              <Link to="/parent/payments">
                Voir les paiements
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* ====== LISTE DES ENFANTS ====== */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Mes enfants
          </CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/parent/pupils">
              Voir tous
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {players.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Aucun enfant enregistré.</p>
              <p className="text-sm text-muted-foreground mt-1">
                Contactez l'administration pour associer un enfant à votre compte.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {players.map((player) => {
                const playerDocs = documents.filter((d) => d.userId === player.id);
                const hasValidMedCert = playerDocs.some(
                  (d) => d.type === 'Certificat Medical' && d.documentStatus === 'Validé'
                );
                const hasPaymentUpToDate = obligations.some(
                  (p) => p.playerId == player.id && p.status === 'paid'
                );

                // Compter les documents manquants pour cet enfant
                const missingDocCount = playerDocs.filter(
                  (d) => d.isObligatory && d.documentStatus !== 'Validé'
                ).length;

                const age = player.birthDate ? getAge(player.birthDate) : null;

                return (
                  <Link
                    key={player.id}
                    to={`/parent/pupils/${player.id}/infos`}
                    className="block"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 hover:border-primary/30 transition-all duration-200 gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm flex-shrink-0">
                          {player.firstName?.[0]}{player.lastName?.[0]}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium truncate">
                            {player.firstName} {player.lastName}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                            <span>{player.class || '—'}</span>
                            {age && <span>• {age} ans</span>}
                            {missingDocCount > 0 && (
                              <Badge variant="outline" className="text-[10px] bg-orange-50 text-orange-600 border-orange-200">
                                {missingDocCount} doc{missingDocCount > 1 ? 's' : ''} manquant{missingDocCount > 1 ? 's' : ''}
                              </Badge>
                            )}
                            {!hasPaymentUpToDate && (
                              <Badge variant="outline" className="text-[10px] bg-red-50 text-red-600 border-red-200">
                                Paiement en retard
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          {hasValidMedCert ? (
                            <CheckCircle className="h-5 w-5 text-green-500"  />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-red-500"  />
                          )}
                          {hasPaymentUpToDate ? (
                            <CheckCircle className="h-5 w-5 text-green-500"  />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-orange-500"  />
                          )}
                        </div>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </Button>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ====== LIENS RAPIDES ====== */}
      {/* <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Button variant="outline" className="h-auto py-4 flex-col gap-1" asChild>
          <Link to="/parent/pupils">
            <Users className="h-5 w-5" />
            <span className="text-xs">Mes enfants</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-auto py-4 flex-col gap-1" asChild>
          <Link to="/parent/documents">
            <FileText className="h-5 w-5" />
            <span className="text-xs">Documents</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-auto py-4 flex-col gap-1" asChild>
          <Link to="/parent/payments">
            <CreditCard className="h-5 w-5" />
            <span className="text-xs">Paiements</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-auto py-4 flex-col gap-1" asChild>
          <Link to="/profile">
            <Shield className="h-5 w-5" />
            <span className="text-xs">Profil</span>
          </Link>
        </Button>
      </div> */}

      {/* ====== STATUT GLOBAL ====== */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
        <span className="text-sm font-medium text-gray-600">État général :</span>
        <div className="flex flex-wrap gap-3">
          <span className="flex items-center gap-1.5 text-sm">
            <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
            <span className="text-muted-foreground">{childrenCount} enfants</span>
          </span>
          <span className="flex items-center gap-1.5 text-sm">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            <span className="text-muted-foreground">{missingDocs} docs manquants</span>
          </span>
          <span className="flex items-center gap-1.5 text-sm">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
            <span className="text-muted-foreground">{overduePayments} paiements en retard</span>
          </span>
        </div>
      </div>
    </motion.div>
  );
}