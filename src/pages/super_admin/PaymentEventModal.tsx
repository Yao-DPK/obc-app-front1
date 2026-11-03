import { useEffect } from 'react';
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
import { Loader2, Calendar, Repeat, UserPlus } from 'lucide-react';
import { usePaymentStore } from '@/stores/usePaymentStore';
import type { PaymentEvent } from '@/types';
import { MONTHS } from '@/lib/constants';


const schema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  description: z.string().optional(),
  amount: z.number().positive('Le montant doit être positif'),
  isRecurringMonthly: z.boolean(),
  isApplicableAtRegistration: z.boolean(),
  excludedMonths: z.array(z.number()),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  isActive: z.boolean(),
}).refine(
  (data) => !(data.isRecurringMonthly && data.isApplicableAtRegistration),
  {
    message: "Un événement mensuel ne peut pas être applicable à l'inscription",
    path: ['isApplicableAtRegistration'],
  },
);

type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  event?: PaymentEvent | null;
}

export function PaymentEventModal({ open, onClose, onSuccess, event }: Props) {
  const { createEvent, updateEvent, isLoading } = usePaymentStore();

  const {
    register, handleSubmit, reset, watch, setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '', description: '', amount: 0,
      isRecurringMonthly: false, isApplicableAtRegistration: false,
      excludedMonths: [], startDate: '', endDate: '', isActive: true,
    },
  });

  const isRecurring = watch('isRecurringMonthly');
  const isAtRegistration = watch('isApplicableAtRegistration');
  const excludedMonths = watch('excludedMonths') || [];

  useEffect(() => {
    if (event) {
      reset({
        name: event.name,
        description: event.description || '',
        amount: event.amount,
        isRecurringMonthly: event.isRecurringMonthly,
        isApplicableAtRegistration: event.isApplicableAtRegistration,
        excludedMonths: event.excludedMonths || [],
        startDate: event.startDate ? event.startDate.split('T')[0] : '',
        endDate: event.endDate ? event.endDate.split('T')[0] : '',
        isActive: event.isActive,
      });
    } else {
      reset({
        name: '', description: '', amount: 0,
        isRecurringMonthly: false, isApplicableAtRegistration: false,
        excludedMonths: [], startDate: '', endDate: '', isActive: true,
      });
    }
  }, [event, reset]);

  const toggleMonth = (month: number) => {
    const updated = excludedMonths.includes(month)
      ? excludedMonths.filter((m) => m !== month)
      : [...excludedMonths, month];
    setValue('excludedMonths', updated, { shouldDirty: true });
  };

  const onSubmit = async (data: FormData) => {
    const parsed_data = {...data, startDate: new Date(data.startDate!), endDate: new Date(data.endDate!)}
    try {
      if (event) {
        await updateEvent(event.id, parsed_data);
        toast.success('Événement mis à jour');
      } else {
        await createEvent(parsed_data);
        toast.success('Événement créé');
      }
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de l\'enregistrement');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{event ? 'Modifier' : 'Créer'} un événement de paiement</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Informations générales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="name">Nom *</Label>
              <Input id="name" {...register('name')} placeholder="Inscription annuelle 2026-2027" />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" {...register('description')} rows={2} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="amount">Montant (FCFA) *</Label>
              <Input
                id="amount"
                type="number"
                {...register('amount', { valueAsNumber: true })}
                placeholder="15000"
              />
              {errors.amount && <p className="text-xs text-red-500">{errors.amount.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="isActive" className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  id="isActive"
                  checked={watch('isActive')}
                  onCheckedChange={(v) => setValue('isActive', !!v)}
                />
                Actif
              </Label>
            </div>
          </div>

          {/* ====== TYPE DE PAIEMENT ====== */}
          <div className="border-t pt-4 space-y-3">
            <h3 className="text-sm font-semibold text-primary">Type de paiement</h3>

            {/* Mensualité */}
            <div className="flex items-start gap-3 p-3 rounded-lg border bg-gray-50/50">
              <Checkbox
                id="isRecurringMonthly"
                checked={isRecurring}
                onCheckedChange={(v) => {
                  setValue('isRecurringMonthly', !!v);
                  if (v) {
                    // Un événement mensuel ne peut pas être applicable à l'inscription
                    setValue('isApplicableAtRegistration', false);
                  }
                }}
                className="mt-0.5"
              />
              <div className="flex-1">
                <Label htmlFor="isRecurringMonthly" className="flex items-center gap-2 cursor-pointer font-medium">
                  <Repeat className="h-4 w-4 text-primary" />
                  Paiement mensuel
                </Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Généré automatiquement chaque mois par le job (le 2 du mois, pour le mois précédent).
                </p>
              </div>
            </div>

            {/* À l'inscription */}
            <div className={`flex items-start gap-3 p-3 rounded-lg border ${isRecurring ? 'bg-gray-100/50 opacity-50' : 'bg-gray-50/50'}`}>
              <Checkbox
                id="isApplicableAtRegistration"
                checked={isAtRegistration}
                disabled={isRecurring}
                onCheckedChange={(v) => setValue('isApplicableAtRegistration', !!v)}
                className="mt-0.5"
              />
              <div className="flex-1">
                <Label htmlFor="isApplicableAtRegistration" className="flex items-center gap-2 cursor-pointer font-medium">
                  <UserPlus className="h-4 w-4 text-primary" />
                  Applicable à l'inscription
                </Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Créé automatiquement quand un joueur s'inscrit (frais d'inscription, équipement…).
                </p>
                {errors.isApplicableAtRegistration && (
                  <p className="text-xs text-red-500 mt-1">{errors.isApplicableAtRegistration.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* ====== MOIS EXCLUS (si mensualité) ====== */}
          {isRecurring && (
            <div className="border-t pt-4 space-y-3">
              <div>
                <h3 className="text-sm font-semibold text-primary">Mois exclus</h3>
                <p className="text-xs text-muted-foreground">
                  Sélectionnez les mois où le club est fermé (aucune mensualité ne sera générée).
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {MONTHS.map((month) => {
                  const isExcluded = excludedMonths.includes(month.value);
                  return (
                    <Badge
                      key={month.value}
                      variant={isExcluded ? 'destructive' : 'outline'}
                      className={`cursor-pointer transition-all ${isExcluded ? '' : 'hover:bg-gray-100'}`}
                      onClick={() => toggleMonth(month.value)}
                    >
                      {month.short}
                    </Badge>
                  );
                })}
              </div>

              {excludedMonths.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  {excludedMonths.length} mois exclu{excludedMonths.length > 1 ? 's' : ''} :
                  {' '}
                  {excludedMonths.sort((a, b) => a - b).map((m) => MONTHS.find((x) => x.value === m)?.short).join(', ')}
                </p>
              )}
            </div>
          )}

          {/* ====== DATES ====== */}
          <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="startDate" className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                Date de début
              </Label>
              <Input id="startDate" type="date" {...register('startDate')} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="endDate" className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                Date de fin
              </Label>
              <Input id="endDate" type="date" {...register('endDate')} />
            </div>
          </div>

          {/* Boutons */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting || isLoading}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                event ? 'Mettre à jour' : 'Créer'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}