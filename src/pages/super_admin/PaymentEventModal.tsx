// src/components/admin/PaymentEventModal.tsx
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { usePaymentStore } from '@/stores/usePaymentStore';
import type { PaymentEvent } from '@/types/payment.type';

// ─── Schéma : les dates sont des chaînes (YYYY-MM-DD) ───
const schema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  description: z.string().optional(),
  amount: z.number().positive('Le montant doit être positif'),
  allowInstallments: z.boolean().default(false).optional(),
  startDate: z.string().optional(), // ⬅️ CHAÎNE
  endDate: z.string().optional(),   // ⬅️ CHAÎNE
});

type FormData = z.infer<typeof schema>;

interface PaymentEventModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  event?: PaymentEvent | null;
}

export function PaymentEventModal({ open, onClose, onSuccess, event }: PaymentEventModalProps) {
  const { createEvent, updateEvent, isLoadingEvents } = usePaymentStore();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      amount: 0,
      allowInstallments: false,
      startDate: '',
      endDate: '',
    },
  });

  const allowInstallments = watch('allowInstallments');

  useEffect(() => {
    if (event) {
      reset({
        name: event.name,
        description: event.description || '',
        amount: event.amount,
        allowInstallments: event.allowInstallments,
        startDate: event.startDate ? event.startDate.split('T')[0] : '', // ⬅️ Format YYYY-MM-DD
        endDate: event.endDate ? event.endDate.split('T')[0] : '',
      });
    } else {
      reset({
        name: '',
        description: '',
        amount: 0,
        allowInstallments: false,
        startDate: '',
        endDate: '',
      });
    }
  }, [event, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      // Transformer les dates en objets Date (ou les garder en chaîne selon le backend)
      const payload = {
        ...data,
        startDate: data.startDate ? data.startDate : undefined,
        endDate: data.endDate ? data.endDate : undefined,
      };

      if (event) {
        await updateEvent(event.id, payload);
        toast.success('Événement mis à jour');
      } else {
        await createEvent(payload);
        toast.success('Événement créé');
      }
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de l\'enregistrement');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{event ? 'Modifier' : 'Créer'} un événement de paiement</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Nom *</Label>
            <Input id="name" {...register('name')} placeholder="Inscription annuelle" />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register('description')} placeholder="Frais d'inscription pour la saison..." />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="amount">Montant (FCFA) *</Label>
            <Input
              id="amount"
              type="number"
              {...register('amount', { valueAsNumber: true })}
              placeholder="50000"
            />
            {errors.amount && <p className="text-xs text-red-500">{errors.amount.message}</p>}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="allowInstallments"
              checked={allowInstallments}
              onCheckedChange={(checked) => setValue('allowInstallments', !!checked)}
            />
            <Label htmlFor="allowInstallments" className="cursor-pointer">
              Paiement échelonné possible
            </Label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="startDate">Date de début</Label>
              <Input id="startDate" type="date" {...register('startDate')} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="endDate">Date de fin</Label>
              <Input id="endDate" type="date" {...register('endDate')} />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting || isLoadingEvents}>
              {isSubmitting ? 'Enregistrement...' : event ? 'Mettre à jour' : 'Créer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}