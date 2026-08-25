import { DOCUMENT_STATUSES, type DocumentStatus } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileCheck, FileX, Clock, AlertTriangle, Eye } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useDocumentStore } from '@/stores/documents/useDocumentStore';
import { useEffect, useState } from 'react';
import { Input } from '../ui/input';
import { documentService } from '@/lib/services/document.service';
import { useAuth } from '@/stores/useAuth';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useDocumentTypeStore } from '@/stores/documents/useDocumentTypeStore';

interface PlayerDocumentsProps {
  userId: number;
  isLoading: boolean;
  onSuccess?: () => void;
  onValidChange?: (isValid: boolean) => void; // Nouvelle prop

}


export function PlayerDocuments({ userId, isLoading, onSuccess, onValidChange }: PlayerDocumentsProps) {
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [uploadingDocType, setUploadingDocType] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File | null>>({});
  const { documents, updateDocumentStatus, fetchDocuments } = useDocumentStore();
  const { docTypes } = useDocumentTypeStore();
  const { user } = useAuth();


  const uploadedDocs = documents.filter((doc) =>
    docTypes.some((dt) => dt.name === doc.type)
  );  

  const missingDocs = docTypes.filter(
    (rd) => !uploadedDocs.some((ud) => ud.type === rd.name)
  );

  console.log(`uploaded Docs: ${JSON.stringify(docTypes)}`);
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
      await fetchDocuments({userId: userId});
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
    formData.append(docType, file);
    try {
      await documentService.uploadDocuments(formData);
      toast.success('Document envoyé avec succès');
      setSelectedFiles((prev) => ({ ...prev, [docType]: null }));
      await fetchDocuments({userId: userId});
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erreur lors de l'envoi du fichier");
    } finally {
      setUploadingDocType(null);
    }
  };

  const handleView = async (id: number) => {
      const data = await documentService.getSignedUrl(id);
      console.log(`data: ${data.signedUrl}`);
      window.open(data.signedUrl, '_blank')?.focus();
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
        {docTypes.map((doc) => {
          const uploadedDoc = uploadedDocs.find((d) => d.type === doc.name);
          
          const isUploaded = !!uploadedDoc;
          const isPending = uploadedDoc?.documentStatus === DOCUMENT_STATUSES.PENDING;
          const isExpired = uploadedDoc?.documentStatus === DOCUMENT_STATUSES.EXPIRED;
          const isRejected = uploadedDoc?.documentStatus === DOCUMENT_STATUSES.REJECTED;
          const isValid = uploadedDoc?.documentStatus === DOCUMENT_STATUSES.VALID;
          const selectedFile = selectedFiles[doc.name];

          const getCardBorderClass = () => {
            if (!isUploaded) return '';
            if (isValid) return 'border-green-200';
            if (isRejected) return 'border-red-200';
            if (isExpired) return 'border-orange-200';
            return '';
          };

          return (
            <Card key={doc.name} className={getCardBorderClass()}>
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
                    {doc.name}
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
                      onChange={(e) => handleFileSelect(doc.name, e.target.files?.[0] || null)}
                    />
                    <Button
                      variant="outline"
                      onClick={() => selectedFile && handleUpload(doc.name, selectedFile)}
                      disabled={!selectedFile || uploadingDocType === doc.name}
                    >
                      {uploadingDocType === doc.name ? 'Envoi en cours...' : 'Envoyer'}
                    </Button>
                  </div>
                )}
                {isUploaded && uploadedDoc && (
                  <Button variant="ghost" size="sm" onClick={() => handleView(uploadedDoc.id!)}>
                    <Eye className="h-4 w-4 mr-1" /> Voir
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}