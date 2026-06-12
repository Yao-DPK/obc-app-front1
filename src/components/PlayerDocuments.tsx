import type { Document } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileCheck, FileX } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

interface PlayerDocumentsProps {
  userId: number;
  documents: Document[];
  isLoading: boolean;
  onSuccess: () => void;
}

export function PlayerDocuments({ userId, documents, isLoading, onSuccess }: PlayerDocumentsProps) {
  const requiredDocs = [
    { type: 'Extrait de Naissance', label: 'Extrait de naissance' },
    { type: 'Certificat Médical', label: 'Certificat médical' },
    { type: 'Photo d\'identité', label: 'Photo d\'identité' },
  ];

  const uploadedTypes = documents.map(d => d.type);
  const missingDocs = requiredDocs.filter(doc => !uploadedTypes.includes(doc.type as any));
  const allUploaded = missingDocs.length === 0;

  const handleUpload = async (docType: string) => {
    // Implémenter l'upload via un input file ou une modale
    toast.info(`Upload de ${docType} à implémenter`);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {requiredDocs.map((doc) => {
          const isUploaded = uploadedTypes.includes(doc.type as any);
          return (
            <Card key={doc.type}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  {isUploaded ? <FileCheck className="text-green-500" /> : <FileX className="text-red-400" />}
                  {doc.label}
                </CardTitle>
                <CardDescription>
                  {isUploaded ? 'Document déjà fourni' : 'Document manquant'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!isUploaded && (
                  <Button variant="outline" onClick={() => handleUpload(doc.type)}>
                    <Upload className="mr-2 h-4 w-4" />
                    Téléverser
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {allUploaded && (
        <Button className="w-full" onClick={onSuccess}>
          Valider les documents
        </Button>
      )}
    </div>
  );
}