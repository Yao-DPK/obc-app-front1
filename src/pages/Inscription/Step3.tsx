// apps/web/src/components/inscription/Step3.tsx
import { Upload,  AlertCircle } from 'lucide-react';
import type { Document, DocumentType } from '@/types';
import { useState } from 'react';
import { DocumentItem } from '@/components/DocumentItem';

interface Step3Props {
  updateRequiredFile: (fileType: DocumentType, file: File | null) => void;
}

export function Step3({ updateRequiredFile }: Step3Props) {
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, string>>({});


  const handleFileUpload = (fileType: DocumentType, file: File | null) => {
    updateRequiredFile(fileType, file);
    console.log(`uploadedFiles: ${JSON.stringify(uploadedFiles)}`)
    if (file) {
      setUploadedFiles((prev) => ({ ...prev, [fileType.name]: file.name }));
    } else {
      setUploadedFiles((prev) => {
        const copy = { ...prev };
        delete copy[fileType.name];
        return copy;
      });
    }
  };


  const documentTypes: DocumentType[] = [
    {id: 1, name: 'Extrait de naissance', description: "", isObligatory: true, applicableCategories:['Tous'], displayOrder: 0, isActive: true, createdAt: new Date().toDateString(), updatedAt: new Date().toDateString()},
    {id: 2, name: 'Photo d\'identite', description: "", isObligatory: true, applicableCategories:['Tous'], displayOrder: 0, isActive: true, createdAt: new Date().toDateString(), updatedAt: new Date().toDateString()}

  ] 

  const requiredDocs: Document[] = [
    { id: 1, type: documentTypes[0] },
    { id: 2, type: documentTypes[1]},
  ];

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

      {/* Liste des documents */}
      <div className="space-y-4">
        {requiredDocs.map((doc) => (
        <DocumentItem
          key={doc.type.name}
          document={doc} // ou récupérer depuis la liste existante
          mode="upload"
          onUpload={(file) => handleFileUpload(doc.type as DocumentType, file)}
          showObligatory
          emptyLabel={doc.type.name}
        />
      ))}
      </div>

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