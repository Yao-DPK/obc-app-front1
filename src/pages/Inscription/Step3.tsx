// apps/web/src/components/inscription/Step3.tsx
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';
import type { DocumentType } from '@/types';

interface Step3Props {
  updateRequiredFile: (fileType: DocumentType, file: File | null) => void;
}

export function Step3({ updateRequiredFile }: Step3Props) {
  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
        <p className="text-sm text-gray-500">Téléversez les documents obligatoires ci‑dessous</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Extrait de naissance (obligatoire) – PDF ou image</Label>
          <Input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="mt-1 h-10"
            onChange={(e) => updateRequiredFile('Extrait de Naissance', e.target.files?.[0] || null)}
          />
        </div>
        <div>
          <Label>Photo d'identité (obligatoire) – PDF ou image</Label>
          <Input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="mt-1 h-10"
            onChange={(e) => updateRequiredFile("Photo d'identite", e.target.files?.[0] || null)}
          />
        </div>
      </div>
    </div>
  );
}