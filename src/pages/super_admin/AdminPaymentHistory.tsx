import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  Eye,
  CheckCircle,
  XCircle,
  Calendar,
  DollarSign,
  Clock,
  AlertCircle,
  CreditCard,
  FileText,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePaymentIntentStore } from '@/stores/usePaymentIntentStore';
import { usePaymentStore } from '@/stores/usePaymentStore';
import { JustificationViewer } from '@/components/payment/JustificationViewer';

const STATUS_CONFIG = {
  pending: {
    label: 'En attente',
    icon: Clock,
    className: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  paid: {
    label: 'Validé',
    icon: CheckCircle,
    className: 'bg-green-50 text-green-700 border-green-200',
  },
  failed: {
    label: 'Rejeté',
    icon: XCircle,
    className: 'bg-red-50 text-red-700 border-red-200',
  },
  expired: {
    label: 'Expiré',
    icon: AlertCircle,
    className: 'bg-gray-50 text-gray-700 border-gray-200',
  },
};

export default function AdminPaymentHistory() {
  const [searchParams] = useSearchParams();
  const obligationId = searchParams.get('obligationId');

  const {
    intents,
    isLoading: intentsLoading,
    fetchByObligation,
    verifyIntent,
  } = usePaymentIntentStore();

  const {
    obligations,
    fetchObligations,
    isLoading: obligationsLoading,
  } = usePaymentStore();

  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerUrl, setViewerUrl] = useState('');
  const [activeTab, setActiveTab] = useState('intents');

  // Charger les obligations (pour le premier onglet)
  useEffect(() => {
    fetchObligations();
  }, []);

  // Charger les intentions si un obligationId est présent
  useEffect(() => {
    if (obligationId) {
      fetchByObligation(Number(obligationId));
      setActiveTab('intents');
    }
  }, [obligationId]);

  const handleVerify = async (intentId: number, status: 'paid' | 'failed') => {
    try {
      await verifyIntent(intentId, status);
      toast.success(status === 'paid' ? 'Paiement validé' : 'Paiement rejeté');
      // Recharger la liste
      if (obligationId) {
        await fetchByObligation(Number(obligationId));
      }
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleTabSwith = async (tab: string) => {
    setActiveTab(tab);
  };


  const openViewer = (url: string) => {
    setViewerUrl(url);
    setViewerOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending;
    return (
      <Badge variant="outline" className={cn('flex items-center gap-1.5', config.className)}>
        <config.icon className="h-3.5 w-3.5" />
        {config.label}
      </Badge>
    );
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // ========== CHARGEMENT ==========

  if (intentsLoading && !intents.length) {
    return (
      <div className="space-y-6">
        <PageHeader title="Historique des paiements" description="Gestion des paiements" />
        <Card>
          <CardContent className="py-12 space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // ========== RENDU ==========

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 mb-20"
    >
      <PageHeader
        title="Historique des paiements"
        description="Consultez et gérez les paiements des joueurs"
        showBack
      />

      <Tabs
        defaultValue={activeTab}
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full flex-col"
      >
        <TabsList className="grid w-full grid-cols-2 bg-gray-100/80 p-1 rounded-xl">
          <TabsTrigger
            value="intents"
            className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-primary rounded-lg transition-all duration-300 flex items-center gap-2 py-2.5"
          >
            <CreditCard className="h-4 w-4" />
            Intentions de paiement
            {obligationId && (
              <Badge variant="secondary" className="ml-1 text-xs">
                Filtré
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="obligations"
            className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-primary rounded-lg transition-all duration-300 flex items-center gap-2 py-2.5"
          >
            <FileText className="h-4 w-4" />
            Obligations
          </TabsTrigger>
        </TabsList>

        {/* ====== ONGLET INTENTIONS ====== */}
        <TabsContent value="intents" className="mt-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Intentions
                  {obligationId && (
                    <span className="text-sm font-normal text-muted-foreground">
                      (obligation #{obligationId})
                    </span>
                  )}
                </CardTitle>
                {obligationId && (
                    <Button variant="ghost" size="sm" onClick={() => handleTabSwith('obligations')}>
                      Voir toutes les obligations
                    </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {intents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Aucune intention trouvée</p>
                  <p className="text-sm text-muted-foreground">
                    {obligationId
                      ? 'Aucun paiement n\'a encore été soumis pour cette obligation.'
                      : 'Sélectionnez une obligation pour voir les intentions.'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-muted-foreground">
                      <tr>
                        <th className="text-left py-3 px-4 font-medium">Date</th>
                        <th className="text-left py-3 px-4 font-medium">Montant</th>
                        <th className="text-left py-3 px-4 font-medium">Méthode</th>
                        <th className="text-left py-3 px-4 font-medium">Statut</th>
                        <th className="text-left py-3 px-4 font-medium">Justificatif</th>
                        <th className="text-right py-3 px-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {intents.map((intent) => {
                        const metadata = intent.transactionMetadata as any;
                        const isPending = intent.status === 'pending';

                        return (
                          <tr key={intent.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="py-3 px-4 whitespace-nowrap">
                              {formatDate(intent.createdAt!)}
                            </td>
                            <td className="py-3 px-4 font-medium">
                              {Number(intent.amount).toLocaleString()} FCFA
                            </td>
                            <td className="py-3 px-4 capitalize">{intent.method}</td>
                            <td className="py-3 px-4">{getStatusBadge(intent.status)}</td>
                            <td className="py-3 px-4">
                              {metadata?.signedJustificationUrl ? (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openViewer(metadata.signedJustificationUrl)}
                                  className="gap-1"
                                >
                                  <Eye className="h-4 w-4" />
                                  Voir
                                </Button>
                              ) : (
                                <span className="text-muted-foreground text-xs">—</span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-right">
                              {isPending ? (
                                <div className="flex items-center justify-end gap-1">
                                  <Button
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700 text-white h-8 px-3 gap-1"
                                    onClick={() => handleVerify(intent.id!, 'paid')}
                                  >
                                    <CheckCircle className="h-3.5 w-3.5" />
                                    Valider
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    className="h-8 px-3 gap-1"
                                    onClick={() => handleVerify(intent.id!, 'failed')}
                                  >
                                    <XCircle className="h-3.5 w-3.5" />
                                    Rejeter
                                  </Button>
                                </div>
                              ) : (
                                <span className="text-xs text-muted-foreground">
                                  {intent.status === 'paid' ? '✅ Traité' : '❌ Rejeté'}
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ====== ONGLET OBLIGATIONS ====== */}
        <TabsContent value="obligations" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Obligations
              </CardTitle>
            </CardHeader>
            <CardContent>
              {obligationsLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : obligations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Aucune obligation</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {obligations.slice(0, 20).map((ob) => (
                    <Link
                      key={ob.id}
                      to={`/admin/payment-history?obligationId=${ob.id}`}
                      className="block"
                    >
                      <div className="flex flex-wrap items-center justify-between p-4 border rounded-lg hover:bg-gray-50 hover:border-primary/30 transition-all gap-2">
                        <div>
                          <p className="font-medium">{ob.description || 'Obligation'}</p>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-3.5 w-3.5" />
                              {Number(ob.totalAmount).toLocaleString()} FCFA
                            </span>
                            {ob.dueDate && (
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                {new Date(ob.dueDate).toLocaleDateString('fr-FR')}
                              </span>
                            )}
                            {ob.status === 'paid' ? (
                              <Badge className="bg-green-100 text-green-700 border-green-200">
                                Payé
                              </Badge>
                            ) : ob.status === 'partial' ? (
                              <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                                Partiel
                              </Badge>
                            ) : ob.status === 'overdue' ? (
                              <Badge className="bg-red-100 text-red-700 border-red-200">
                                En retard
                              </Badge>
                            ) : (
                              <Badge variant="outline">En attente</Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            Payé : {Number(ob.paidAmount || 0).toLocaleString()} FCFA
                          </span>
                          <Button variant="ghost" size="sm" className="gap-1">
                            <Eye className="h-4 w-4" />
                            Voir paiements
                          </Button>
                        </div>
                      </div>
                    </Link>
                  ))}
                  {obligations.length > 20 && (
                    <p className="text-sm text-muted-foreground text-center pt-2">
                      + {obligations.length - 20} autres obligations
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Viewer */}
      <JustificationViewer
        open={viewerOpen}
        onOpenChange={setViewerOpen}
        url={viewerUrl}
      />
    </motion.div>
  );
}