import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useEventStore } from '@/stores/useEventStore';
import type { Event } from '@/types';

const schema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  description: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  // ✅ On enlève .optional() car on a une valeur par défaut
  isActive: z.boolean(),
  documentTypeIds: z.array(z.number()),
  paymentEventIds: z.array(z.number()),
});

type FormData = z.infer<typeof schema>;

interface EventModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  event?: Event | null;
}

export function EventModal({ open, onClose, onSuccess, event }: EventModalProps) {
  const { createEvent, updateEvent, documentTypes, paymentEvents, isLoading } = useEventStore();
  const [selectedDocs, setSelectedDocs] = useState<number[]>([]);
  const [selectedPayments, setSelectedPayments] = useState<number[]>([]);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
  resolver: zodResolver(schema),
  defaultValues: {
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    isActive: true,
    documentTypeIds: [],
    paymentEventIds: [],
  },
});

  useEffect(() => {
    if (event) {
      reset({
        name: event.name,
        description: event.description || '',
        startDate: event.startDate ? event.startDate.split('T')[0] : '',
        endDate: event.endDate ? event.endDate.split('T')[0] : '',
        isActive: event.isActive,
        documentTypeIds: event.documentTypeIds || [],
        paymentEventIds: event.paymentEventIds || [],
      });
      setSelectedDocs(event.documentTypeIds || []);
      setSelectedPayments(event.paymentEventIds || []);
    } else {
      reset({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        isActive: true,
        documentTypeIds: [],
        paymentEventIds: [],
      });
      setSelectedDocs([]);
      setSelectedPayments([]);
    }
  }, [event, reset]);

  const toggleDoc = (id: number) => {
    setSelectedDocs((prev) => {
      const updated = prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id];
      setValue('documentTypeIds', updated);
      return updated;
    });
  };

  const togglePayment = (id: number) => {
    setSelectedPayments((prev) => {
      const updated = prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id];
      setValue('paymentEventIds', updated);
      return updated;
    });
  };

  const onSubmit = async (data: FormData) => {
  // data contient maintenant tous les champs requis
  try {
    if (event) {
      await updateEvent(event.id, data);
    } else {
      await createEvent(data);
    }
    onSuccess();
  } catch (error: any) {
    toast.error(error.message);
  }
};

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{event ? 'Modifier' : 'Créer'} un événement</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Informations générales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Nom *</Label>
              <Input id="name" {...register('name')} placeholder="Inscription 2025-2026" />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="isActive" className="flex items-center gap-2">
                <Checkbox id="isActive" {...register('isActive')} />
                Actif
              </Label>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register('description')} placeholder="Description de l'événement..." />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="startDate">Date de début</Label>
              <Input id="startDate" type="date" {...register('startDate')} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="endDate">Date de fin</Label>
              <Input id="endDate" type="date" {...register('endDate')} />
            </div>
          </div>

          {/* Documents associés */}
          <div className="space-y-2">
            <Label>Documents requis</Label>
            <div className="flex flex-wrap gap-2 p-3 border rounded-lg bg-gray-50 min-h-[60px]">
              {documentTypes.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucun type de document disponible</p>
              ) : (
                documentTypes.map((doc) => (
                  <Badge
                    key={doc.id}
                    variant="outline"
                    className={`cursor-pointer px-3 py-1.5 text-sm ${
                      selectedDocs.includes(doc.id)
                        ? 'bg-primary text-white border-primary hover:bg-primary/90'
                        : 'bg-white hover:bg-gray-50'
                    }`}
                    onClick={() => toggleDoc(doc.id)}
                  >
                    {doc.name}
                  </Badge>
                ))
              )}
            </div>
            <p className="text-xs text-muted-foreground">Cliquez sur un badge pour l'ajouter/retirer</p>
          </div>

          {/* Paiements associés */}
          <div className="space-y-2">
            <Label>Paiements associés</Label>
            <div className="flex flex-wrap gap-2 p-3 border rounded-lg bg-gray-50 min-h-[60px]">
              {paymentEvents.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucun événement de paiement disponible</p>
              ) : (
                paymentEvents.map((pe) => (
                  <Badge
                    key={pe.id}
                    variant="outline"
                    className={`cursor-pointer px-3 py-1.5 text-sm ${
                      selectedPayments.includes(pe.id)
                        ? 'bg-primary text-white border-primary hover:bg-primary/90'
                        : 'bg-white hover:bg-gray-50'
                    }`}
                    onClick={() => togglePayment(pe.id)}
                  >
                    {pe.name} ({pe.amount.toLocaleString()} FCFA)
                  </Badge>
                ))
              )}
            </div>
            <p className="text-xs text-muted-foreground">Cliquez sur un badge pour l'ajouter/retirer</p>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting || isLoading}>
              {isSubmitting ? 'Enregistrement...' : event ? 'Mettre à jour' : 'Créer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}