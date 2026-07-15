// src/pages/dashboard/PlayerDashboard.tsx
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Calendar,
  FileText,
  CreditCard,
  User,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Users,
  School,
  Phone,
  Mail,
  CalendarDays,
  DollarSign,
} from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useDocumentStore } from '@/stores/documents/useDocumentStore';
import { usePaymentStore } from '@/stores/usePaymentStore';
import { cn } from '@/lib/utils';
import { useAuth } from '@/stores/useAuth';

// ========== COMPOSANTS INTERNES ==========

/* const StatSkeleton = () => (
  <div className="space-y-2">
    <Skeleton className="h-4 w-24" />
    <Skeleton className="h-8 w-16" />
  </div>
);
 */
const InfoRow = ({ label, value, icon: Icon, className }: any) => (
  <div className={cn('flex items-center gap-2 text-sm', className)}>
    {Icon && <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
    <span className="text-muted-foreground">{label} :</span>
    <span className="font-medium">{value || 'Non renseigné'}</span>
  </div>
);

// ========== COMPOSANT PRINCIPAL ==========

export default function PlayerDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const {
    documents,
    fetchDocuments,
    isLoading: docsLoading,
  } = useDocumentStore();
  const {
    obligations,
    fetchObligations,
  } = usePaymentStore();

  // ========== CHARGEMENT DES DONNÉES ==========
  useEffect(() => {
    if (user?.id) {
      fetchDocuments();
      fetchObligations();
    }
  }, [user]);

  // ========== CALCULS ==========
  const isLoading = authLoading || docsLoading;

  const pendingDocs = documents.filter(
    (d) => d.documentStatus === 'En attente de Validation'
  ).length;

  const totalDocs = documents.length;

  const pendingObligations = obligations.filter(
    (o) => o.status === 'pending' || o.status === 'partial'
  ).length;

  const overdueObligations = obligations.filter(
    (o) => o.status === 'overdue'
  ).length;

  const totalAmount = obligations.reduce((sum, o) => sum + Number(o.totalAmount), 0);
  const totalPaid = obligations.reduce((sum, o) => sum + Number(o.paidAmount || 0), 0);
  const remainingAmount = totalAmount - totalPaid;

  // Prochain entraînement (exemple - à remplacer par API)
  const nextTraining = 'Mercredi 14 juillet à 18h';

  // ========== RENDU DE CHARGEMENT ==========
  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Mon espace" description="Chargement de votre tableau de bord..." />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>
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
        description="Bienvenue sur votre espace personnel"
      />

      {/* ====== STATISTIQUES RAPIDES ====== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Prochain entraînement
            </CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-base font-semibold">{nextTraining}</div>
            <p className="text-xs text-muted-foreground mt-0.5">Salle principale</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Documents
            </CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{pendingDocs}</span>
              <span className="text-sm text-muted-foreground">/ {totalDocs} en attente</span>
            </div>
            {pendingDocs === 0 ? (
              <p className="text-xs text-green-600 flex items-center gap-1 mt-0.5">
                <CheckCircle className="h-3 w-3" /> Tous validés
              </p>
            ) : (
              <p className="text-xs text-amber-600 flex items-center gap-1 mt-0.5">
                <AlertCircle className="h-3 w-3" /> Documents à fournir
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Paiements
            </CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{pendingObligations}</span>
              <span className="text-sm text-muted-foreground">en attente</span>
            </div>
            {pendingObligations === 0 ? (
              <p className="text-xs text-green-600 flex items-center gap-1 mt-0.5">
                <CheckCircle className="h-3 w-3" /> À jour
              </p>
            ) : (
              <p className="text-xs text-red-600 flex items-center gap-1 mt-0.5">
                <AlertCircle className="h-3 w-3" /> Paiements à régulariser
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Reste à payer
            </CardTitle>
            <CreditCard className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {remainingAmount.toLocaleString()} FCFA
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Total : {totalAmount.toLocaleString()} FCFA
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ====== ALERTES ====== */}
      {overdueObligations > 0 && (
        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="flex items-center gap-3 p-4">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-700">
                ⚠️ {overdueObligations} paiement{overdueObligations > 1 ? 's' : ''} en retard
              </p>
              <p className="text-xs text-red-600">
                Veuillez régulariser votre situation dans les plus brefs délais.
              </p>
            </div>
            <Button variant="destructive" size="sm" className="ml-auto flex-shrink-0" asChild>
              <Link to="/parent/payments">Voir</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* ====== INFORMATIONS PERSONNELLES ====== */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Mes informations
            </CardTitle>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/profile">
              Modifier
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Identité */}
            <div className="space-y-2">
              <p className="text-sm font-semibold text-primary">Identité</p>
              <InfoRow label="Nom complet" value={`${user?.lastName || ''} ${user?.firstName || ''}`} />
              <InfoRow label="Email" value={user?.email} icon={Mail} />
              <InfoRow label="Téléphone" value={user?.phone} icon={Phone} />
              <InfoRow label="Sexe" value={user?.gender === 'M' ? 'Masculin' : user?.gender === 'F' ? 'Féminin' : 'Non renseigné'} />
            </div>

            {/* Scolarité & Joueur */}
            <div className="space-y-2">
              <p className="text-sm font-semibold text-primary">Scolarité</p>
              <InfoRow label="Établissement" value={user?.school} icon={School} />
              <InfoRow label="Classe" value={user?.class} icon={Users} />
              <InfoRow label="Date de naissance" value={user?.birthDate} icon={CalendarDays} />
              {user?.emergencyContactName && (
                <InfoRow
                  label="Contact d'urgence"
                  value={`${user.emergencyContactName} (${user.emergencyContactPhone || ''})`}
                  icon={Phone}
                />
              )}
            </div>
          </div>

          {/* Badge de statut */}
          <div className="mt-4 pt-4 border-t flex flex-wrap items-center gap-3">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <CheckCircle className="h-3 w-3 mr-1" />
              {user?.registrationStatus === 'inscrit' ? 'Inscrit' : 'Pré-inscrit'}
            </Badge>
            <span className="text-xs text-muted-foreground">
              Membre depuis le {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : '—'}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* ====== RÉSUMÉ DES DOCUMENTS ====== */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Documents
          </CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/documents">
              Voir tous
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Aucun document téléchargé.
            </p>
          ) : (
            <div className="space-y-2">
              {documents.slice(0, 3).map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{doc.type.name}</span>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      doc.documentStatus === 'Validé'
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : doc.documentStatus === 'Rejeté'
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }
                  >
                    {doc.documentStatus}
                  </Badge>
                </div>
              ))}
              {documents.length > 3 && (
                <p className="text-xs text-muted-foreground text-center pt-2">
                  + {documents.length - 3} autre{documents.length - 3 > 1 ? 's' : ''} document
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ====== RÉSUMÉ DES PAIEMENTS ====== */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Paiements récents
          </CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/payments">
              Voir tous
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {obligations.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Aucun paiement enregistré.
            </p>
          ) : (
            <div className="space-y-2">
              {obligations.slice(0, 3).map((ob) => (
                <div
                  key={ob.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium">{ob.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {ob.dueDate ? new Date(ob.dueDate).toLocaleDateString('fr-FR') : '—'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {Number(ob.totalAmount).toLocaleString()} FCFA
                    </p>
                    <Badge
                      variant="outline"
                      className={
                        ob.status === 'paid'
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : ob.status === 'overdue'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }
                    >
                      {ob.status === 'paid'
                        ? 'Payé'
                        : ob.status === 'overdue'
                        ? 'En retard'
                        : ob.status === 'partial'
                        ? 'Partiel'
                        : 'En attente'}
                    </Badge>
                  </div>
                </div>
              ))}
              {obligations.length > 3 && (
                <p className="text-xs text-muted-foreground text-center pt-2">
                  + {obligations.length - 3} autre{obligations.length - 3 > 1 ? 's' : ''} paiement
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ====== LIENS RAPIDES ====== */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Button variant="outline" className="h-auto py-4 flex-col gap-1" asChild>
          <Link to="/documents">
            <FileText className="h-5 w-5" />
            <span className="text-xs">Documents</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-auto py-4 flex-col gap-1" asChild>
          <Link to="/payments">
            <CreditCard className="h-5 w-5" />
            <span className="text-xs">Paiements</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-auto py-4 flex-col gap-1" asChild>
          <Link to="/profile">
            <User className="h-5 w-5" />
            <span className="text-xs">Profil</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-auto py-4 flex-col gap-1" asChild>
          <Link to="/calendar">
            <Calendar className="h-5 w-5" />
            <span className="text-xs">Calendrier</span>
          </Link>
        </Button>
      </div>
    </motion.div>
  );
}