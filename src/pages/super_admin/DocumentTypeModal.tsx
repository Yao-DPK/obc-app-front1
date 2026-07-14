
// src/components/admin/DocumentTypeModal.tsx
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
import type { DocumentType } from '@/types';
import { useDocumentTypeStore } from '@/stores/documents/useDocumentTypeStore';

const schema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  description: z.string().optional(),
  isObligatory: z.boolean().default(false).optional(),
  applicableCategories: z.array(z.string()).default([]).optional(),
  displayOrder: z.number().default(0).optional(),
  isActive: z.boolean().default(true).optional(),
});

type FormData = z.infer<typeof schema>;

interface DocumentTypeModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  docType?: DocumentType | null;
}

const CATEGORIES = ['Mini-basket', 'Benjamins', 'Minimes', 'Cadets', 'Juniors', 'Seniors', 'Tous'];

export function DocumentTypeModal({ open, onClose, onSuccess, docType }: DocumentTypeModalProps) {
  const { createDocType, updateDocType, isLoading } = useDocumentTypeStore();

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
      isObligatory: false,
      applicableCategories: [],
      displayOrder: 0,
      isActive: true,
    },
  });

  const selectedCategories = watch('applicableCategories') || [];

  useEffect(() => {
    if (docType) {
      reset({
        name: docType.name,
        description: docType.description || '',
        isObligatory: docType.isObligatory,
        applicableCategories: docType.applicableCategories || [],
        displayOrder: docType.displayOrder || 0,
        isActive: docType.isActive,
      });
    } else {
      reset({
        name: '',
        description: '',
        isObligatory: false,
        applicableCategories: [],
        displayOrder: 0,
        isActive: true,
      });
    }
  }, [docType, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      if (docType) {
        await updateDocType(docType.id, data);
        toast.success('Type de document mis à jour');
      } else {
        await createDocType(data);
        toast.success('Type de document créé');
      }
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de l\'enregistrement');
    }
  };

  const toggleCategory = (cat: string) => {
    const current = selectedCategories;
    if (current.includes(cat)) {
      setValue('applicableCategories', current.filter((c) => c !== cat));
    } else {
      setValue('applicableCategories', [...current, cat]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{docType ? 'Modifier' : 'Créer'} un type de document</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Nom *</Label>
            <Input id="name" {...register('name')} placeholder="Certificat médical" />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register('description')} placeholder="Document médical obligatoire" />
          </div>

          <div className="space-y-1.5">
            <Label>Catégories concernées</Label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <Button
                  key={cat}
                  type="button"
                  variant={selectedCategories.includes(cat) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleCategory(cat)}
                  className="text-xs"
                >
                  {cat}
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">Sélectionnez les catégories concernées par ce type de document.</p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="displayOrder">Ordre d'affichage</Label>
            <Input
              id="displayOrder"
              type="number"
              {...register('displayOrder', { valueAsNumber: true })}
              placeholder="0"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isObligatory"
              checked={watch('isObligatory')}
              onCheckedChange={(checked) => setValue('isObligatory', !!checked)}
            />
            <Label htmlFor="isObligatory" className="cursor-pointer">
              Document obligatoire
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isActive"
              checked={watch('isActive')}
              onCheckedChange={(checked) => setValue('isActive', !!checked)}
            />
            <Label htmlFor="isActive" className="cursor-pointer">
              Actif
            </Label>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting || isLoading}>
              {isSubmitting ? 'Enregistrement...' : docType ? 'Mettre à jour' : 'Créer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}