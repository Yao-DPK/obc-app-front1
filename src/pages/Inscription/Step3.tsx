// apps/web/src/components/inscription/Step3.tsx
import { Upload, AlertCircle } from 'lucide-react';
import type { DocumentType } from '@/types';
import { DocumentItem } from '@/components/DocumentItem';
import { PhotoDocumentItem } from '@/components/PhotoDocumentItem';

interface Step3Props {
  requiredDocTypes: DocumentType[];
  updateRequiredFile: (fileType: DocumentType, file: File | null) => void;
}

export function Step3({ requiredDocTypes, updateRequiredFile }: Step3Props) {
  const handleFileSelect = (fileType: DocumentType, file: File | null) => {
    updateRequiredFile(fileType, file);
  };

  // On sépare les photos des autres documents
  const photoDocs = requiredDocTypes.filter((doc) => doc.isPhoto);
  const otherDocs = requiredDocTypes.filter((doc) => !doc.isPhoto);

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-blue-50 to-white border border-blue-200 rounded-lg p-6 text-center">
        <Upload className="mx-auto h-12 w-12 text-primary mb-3" />
        <h3 className="text-lg font-semibold text-primary">Documents obligatoires</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Téléversez les documents ci-dessous pour finaliser votre inscription.
        </p>
      </div>

      {/* Photos */}
      {photoDocs.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-primary mb-3">📸 Photos</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {photoDocs.map((doc) => (
              <PhotoDocumentItem
                key={doc.id}
                docType={doc}
                onFileChange={(file) => handleFileSelect(doc, file)}
                showObligatory={doc.isObligatory}
                showStatus={false}
                showActions={false} // En mode inscription, pas de suppression
              />
            ))}
          </div>
        </div>
      )}

      {/* Autres documents */}
      {otherDocs.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-primary mb-3">📄 Documents</h4>
          <div className="space-y-4">
            {otherDocs.map((doc) => (
              <DocumentItem
                key={doc.id}
                docType={doc}
                onFileChange={(file) => handleFileSelect(doc, file)}
                showObligatory={doc.isObligatory}
                showStatus={false}
                showActions={false}
                showUploadButton={true}
                mode="upload"
              />
            ))}
          </div>
        </div>
      )}

      {/* Informations supplémentaires */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-amber-700">Documents acceptés</p>
          <p className="text-xs text-amber-600">
            Formats : PDF, JPG, JPEG, PNG. Taille maximale : 5 Mo par fichier.
          </p>
        </div>
      </div>
    </div>
  );
}