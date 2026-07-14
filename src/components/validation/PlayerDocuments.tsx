// components/player/PlayerDocuments.tsx
import { DOCUMENT_STATUSES, type Document, type DocumentStatus } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileCheck, FileX, Clock, AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useDocumentStore } from '@/stores/documents/useDocumentStore';
import { FilePreview } from '@/components/ui/FilePreview';
import { useEffect, useState } from 'react';
import { Input } from '../ui/input';
import { documentService } from '@/lib/services/document.service';
import { useAuth } from '@/stores/useAuth';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface PlayerDocumentsProps {
  userId: number;
  documents: Document[];
  isLoading: boolean;
  onSuccess?: () => void;
  onValidChange?: (isValid: boolean) => void; // Nouvelle prop

}

type RequiredDoc = {
  type: string;
  label: string;
};

const REQUIRED_DOCS: RequiredDoc[] = [
  { type: 'Extrait de Naissance', label: 'Extrait de naissance' },
  { type: "Photo d'identite", label: "Photo d'identité" },
];

export function PlayerDocuments({ userId, documents, isLoading, onSuccess, onValidChange }: PlayerDocumentsProps) {
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [uploadingDocType, setUploadingDocType] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File | null>>({});
  const { updateDocumentStatus, fetchUserDocuments } = useDocumentStore();
  const { user } = useAuth();

  const uploadedDocs = documents.filter((doc) =>
    REQUIRED_DOCS.some((rd) => rd.type === doc.type)
  );
  const missingDocs = REQUIRED_DOCS.filter(
    (rd) => !uploadedDocs.some((ud) => ud.type === rd.type)
  );
  const allUploaded = missingDocs.length === 0;
  const allValidated = allUploaded && uploadedDocs.every((doc) => doc.documentStatus === DOCUMENT_STATUSES.VALID);
  const isSectionValid = allValidated;

  useEffect(() => {
    onValidChange?.(isSectionValid);
  }, [isSectionValid, onValidChange]);

  const handleStatusChange = async (documentId: number, newStatus: DocumentStatus) => {
    setUpdatingId(documentId);
    try {
      await updateDocumentStatus(documentId, newStatus, user?.id);
      switch(newStatus){
        case DOCUMENT_STATUSES.VALID:
          toast.success(`Statut mis à jour : ${newStatus}`);
           break;
        case DOCUMENT_STATUSES.REJECTED:
          toast.error(`Statut mis à jour : ${newStatus}`);
           break;
        case DOCUMENT_STATUSES.EXPIRED:
          toast.warning(`Statut mis à jour : ${newStatus}`);
           break;
        default:
          toast.info(`Statut mis à jour : ${newStatus}`);
      }
      await fetchUserDocuments(userId);
      onSuccess?.();
    } catch (err) {
      toast.error("Erreur lors de la mise à jour du statut");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleFileSelect = (docType: string, file: File | null) => {
    setSelectedFiles((prev) => ({ ...prev, [docType]: file }));
  };

  const handleUpload = async (docType: string, file: File) => {
    setUploadingDocType(docType);
    const formData = new FormData();
    formData.append('data', JSON.stringify({ userId, docType }));
    formData.append('file', file);
    try {
      await documentService.uploadDocuments(formData);
      toast.success('Document envoyé avec succès');
      setSelectedFiles((prev) => ({ ...prev, [docType]: null }));
      await fetchUserDocuments(userId);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erreur lors de l'envoi du fichier");
    } finally {
      setUploadingDocType(null);
    }
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
        {REQUIRED_DOCS.map((doc) => {
          const uploadedDoc = uploadedDocs.find((d) => d.type === doc.type);
          const isUploaded = !!uploadedDoc;
          const isPending = uploadedDoc?.documentStatus === DOCUMENT_STATUSES.PENDING;
          const isExpired = uploadedDoc?.documentStatus === DOCUMENT_STATUSES.EXPIRED;
          const isRejected = uploadedDoc?.documentStatus === DOCUMENT_STATUSES.REJECTED;
          const isValid = uploadedDoc?.documentStatus === DOCUMENT_STATUSES.VALID;
          const selectedFile = selectedFiles[doc.type];

          const getCardBorderClass = () => {
            if (!isUploaded) return '';
            if (isValid) return 'border-green-200';
            if (isRejected) return 'border-red-200';
            if (isExpired) return 'border-orange-200';
            return '';
          };

          return (
            <Card key={doc.type} className={getCardBorderClass()}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {isUploaded ? (
                      isValid ? (
                        <FileCheck className="text-green-500" />
                      ) : isRejected ? (
                        <FileX className="text-red-500" />
                      ) : isExpired ? (
                        <AlertTriangle className="text-orange-500" />
                      ) : isPending ? (
                        <Clock className="text-yellow-500" />
                      ) : (
                        <FileCheck className="text-gray-400" />
                      )
                    ) : (
                      <FileX className="text-red-400" />
                    )}
                    {doc.label}
                  </CardTitle>
                  {isUploaded && (
                    <div className="flex items-center gap-2">
                      <Select
                        value={uploadedDoc.documentStatus || DOCUMENT_STATUSES.PENDING}
                        onValueChange={(newStatus: DocumentStatus) => handleStatusChange(uploadedDoc.id, newStatus)}
                        disabled={updatingId === uploadedDoc.id}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Statut" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={DOCUMENT_STATUSES.VALID}>Validé</SelectItem>
                          <SelectItem value={DOCUMENT_STATUSES.REJECTED}>Rejeté</SelectItem>
                          <SelectItem value={DOCUMENT_STATUSES.EXPIRED}>Expiré</SelectItem>
                          <SelectItem value={DOCUMENT_STATUSES.PENDING}>En attente de Validation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
                <CardDescription>
                  {isUploaded
                    ? isValid
                      ? 'Document fourni et validé'
                      : isRejected
                      ? 'Document rejeté'
                      : isExpired
                      ? 'Document expiré'
                      : 'Document fourni, en attente de validation'
                    : 'Document manquant'}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center gap-2">
                {!isUploaded && (
                  <div className="flex flex-1 gap-2">
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileSelect(doc.type, e.target.files?.[0] || null)}
                    />
                    <Button
                      variant="outline"
                      onClick={() => selectedFile && handleUpload(doc.type, selectedFile)}
                      disabled={!selectedFile || uploadingDocType === doc.type}
                    >
                      {uploadingDocType === doc.type ? 'Envoi en cours...' : 'Envoyer'}
                    </Button>
                  </div>
                )}
                {isUploaded && uploadedDoc && (
                  <FilePreview
                    url={uploadedDoc.publicUrl!}
                    fileName={`${doc.label} - ${uploadedDoc.fileId}`}
                  />
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}