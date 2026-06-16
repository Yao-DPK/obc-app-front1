// apps/web/src/components/inscription/Step3.tsx
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { DocumentType } from '@/types';

interface Step3Props {
  updateRequiredFile: (fileType: DocumentType, file: File | null) => void;
}

export function Step3({ updateRequiredFile }: Step3Props) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Extrait de naissance (obligatoire) - PDF ou image</Label>
        <Input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => updateRequiredFile('Extrait de Naissance', e.target.files?.[0] || null)}
        />
      </div>
      <div>
        <Label>Photo d'identité (obligatoire) - PDF ou image</Label>
        <Input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => updateRequiredFile("Photo d'identite", e.target.files?.[0] || null)}
        />
      </div>
    </div>
  );
}