// src/pages/admin/PaymentEventsManagement.tsx
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Eye, EyeOff, Calendar, DollarSign, CheckCircle, XCircle } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { usePaymentStore } from '@/stores/usePaymentStore';
import { PaymentEventModal } from './PaymentEventModal';
import type { PaymentEvent } from '@/types/payment.type';

export default function PaymentEventsManagement() {
  const { allEvents, fetchAllEvents, isLoadingEvents, updateEvent, deleteEvent } = usePaymentStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<PaymentEvent | null>(null);

  useEffect(() => {
    fetchAllEvents(true);
  }, []);

  const handleEdit = (event: PaymentEvent) => {
    setEditingEvent(event);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) return;
    try {
      await deleteEvent(id);
      toast.success('Événement supprimé avec succès');
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleToggleActive = async (event: PaymentEvent) => {
    try {
      await updateEvent(event.id, { isActive: !event.isActive });
      toast.success(`Événement ${event.isActive ? 'désactivé' : 'activé'} avec succès`);
    } catch (error) {
      toast.error('Erreur lors du changement de statut');
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingEvent(null);
  };

  const handleModalSuccess = () => {
    fetchAllEvents(true);
    handleModalClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 mb-20"
    >
      <PageHeader
        title="Types de paiements"
        description="Gestion des événements de paiement (inscriptions, mensualités, camps, etc.)"
      >
        <Button
          onClick={() => setModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvel événement
        </Button>
      </PageHeader>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Événements ({allEvents.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoadingEvents ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : allEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Aucun événement de paiement</p>
              <p className="text-sm text-muted-foreground">Cliquez sur "Nouvel événement" pour en créer un.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead className="hidden md:table-cell">Description</TableHead>
                    <TableHead className="text-right">Montant</TableHead>
                    <TableHead className="hidden lg:table-cell text-center">Paiement échelonné</TableHead>
                    <TableHead className="hidden md:table-cell">Dates</TableHead>
                    <TableHead className="text-center">Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">{event.name}</TableCell>
                      <TableCell className="hidden md:table-cell max-w-[200px] truncate">
                        {event.description || '—'}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {event.amount.toLocaleString()} FCFA
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-center">
                        {event.allowInstallments ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            ✅ Oui
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200">
                            ❌ Non
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                        {event.startDate && format(new Date(event.startDate), 'dd/MM/yyyy', { locale: fr })}
                        {event.endDate && ` → ${format(new Date(event.endDate), 'dd/MM/yyyy', { locale: fr })}`}
                      </TableCell>
                      <TableCell className="text-center">
                        {event.isActive ? (
                          <Badge className="bg-green-100 text-green-700 border-green-200">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Actif
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-100 text-gray-500 border-gray-200">
                            <XCircle className="h-3 w-3 mr-1" />
                            Inactif
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-amber-600 hover:bg-amber-50 hover:text-amber-700"
                            onClick={() => handleToggleActive(event)}
                            title={event.isActive ? 'Désactiver' : 'Activer'}
                          >
                            {event.isActive ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                            onClick={() => handleEdit(event)}
                            title="Modifier"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={() => handleDelete(event.id)}
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal */}
      <PaymentEventModal
        open={modalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        event={editingEvent}
      />
    </motion.div>
  );
}