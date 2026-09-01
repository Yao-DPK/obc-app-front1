// src/pages/admin/UserDocuments.tsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { RefreshCw, User, Upload, Loader2 } from 'lucide-react';

import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDocumentStore } from '@/stores/documents/useDocumentStore';
import { useDocumentTypeStore } from '@/stores/documents/useDocumentTypeStore';
import { useUserStore } from '@/stores/useUserStore';
import { DocumentStats } from '@/components/documents/DocumentStats';
import { DocumentTypeList } from '@/components/documents/DocumentTypeList';
import type { Document, DocumentType } from '@/types';
import { JustificationViewer } from '@/components/payment/JustificationViewer';
import { documentService } from '@/lib/services/document.service';

export default function UserDocuments() {
  const { userId } = useParams<{ userId: string }>();
  const userIdNum = Number(userId);

  // Stores
  const { user, fetchUserById, isLoading: userLoading } = useUserStore();
  const {
    documents,
    fetchDocuments,
    uploadDocument,
    updateDocumentStatus,
    isLoading: docsLoading,
  } = useDocumentStore();
  const {
    docTypes,
    fetchDocTypes,
    isLoading: typesLoading,
  } = useDocumentTypeStore();

  // États locaux
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerUrl, setViewerUrl] = useState('');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState<DocumentType | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Charger les données
  useEffect(() => {
    if (userIdNum) {
      fetchUserById(userIdNum);
      fetchDocuments({ userId: userIdNum });
      fetchDocTypes({includeInactive: true});
    }
  }, [userIdNum]);

  // Calculs pour les statistiques
  const userDocs = documents.filter((d) => d.userId === userIdNum);
  const provided = userDocs.length;
  const pending = userDocs.filter((d) => d.documentStatus === 'En attente de Validation').length;
  const validated = userDocs.filter((d) => d.documentStatus === 'Validé').length;
  const rejected = userDocs.filter((d) => d.documentStatus === 'Rejeté').length;
  const totalTypes = docTypes.length;

  const isLoading = userLoading || docsLoading || typesLoading;

  // Gestion de l'upload
  const handleUpload = (docType: DocumentType) => {
    setSelectedDocType(docType);
    setUploadDialogOpen(true);
    setSelectedFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleUploadSubmit = async () => {
    if (!selectedFile || !selectedDocType || !userIdNum) return;

    setIsUploading(true);
    try {
      await uploadDocument({
        userId: userIdNum,
        file: selectedFile,
        type: selectedDocType.name,
        isObligatory: selectedDocType.isObligatory,
      });
      toast.success('Document uploadé avec succès');
      await fetchDocuments({ userId: userIdNum });
      setUploadDialogOpen(false);
      setSelectedFile(null);
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de l\'upload');
    } finally {
      setIsUploading(false);
    }
  };

  // Gestion de la validation/rejet
  const handleValidate = async (document: any) => {
    setIsProcessing(true);
    try {
      await updateDocumentStatus(document.id, 'Validé');
      toast.success('Document validé');
      await fetchDocuments({ userId: userIdNum });
    } catch (error: any) {
      toast.error(error.message || 'Erreur');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (document: any) => {
    setIsProcessing(true);
    try {
      await updateDocumentStatus(document.id, 'Rejeté');
      toast.success('Document rejeté');
      await fetchDocuments({ userId: userIdNum });
    } catch (error: any) {
      toast.error(error.message || 'Erreur');
    } finally {
      setIsProcessing(false);
    }
  };

  // Voir le document
  const handleView = async (document: Document) => {
    const data = await documentService.getSignedUrl(document.id);
    setViewerUrl(data.signedUrl);
    setViewerOpen(true);
  };



  if (isLoading && !user) {
    return (
      <div className="space-y-6">
        <PageHeader title="Chargement..." description="Documents de l'utilisateur" showBack />
        <div className="grid grid-cols-1 gap-6">
          <div className="h-32 bg-gray-100 animate-pulse rounded-lg" />
          <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <PageHeader title="Utilisateur non trouvé" showBack />
        <div className="p-8 text-center text-muted-foreground">
          L'utilisateur avec l'ID {userIdNum} n'existe pas.
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 mb-20"
    >
      {/* ====== EN-TÊTE ====== */}
      <PageHeader
        title={`Documents de ${user.firstName} ${user.lastName}`}
        description={`${user.email}`}
        showBack
      >
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              fetchDocuments({ userId: userIdNum });
              fetchDocTypes({includeInactive: true});
            }}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Actualiser
          </Button>
          <Link to={`/admin/users/${userIdNum}`}>
            <Button variant="ghost" size="sm" className="gap-2">
              <User className="h-4 w-4" />
              Profil
            </Button>
          </Link>
        </div>
      </PageHeader>

      {/* ====== STATISTIQUES ====== */}
      <DocumentStats
        totalTypes={totalTypes}
        provided={provided}
        pending={pending}
        validated={validated}
        rejected={rejected}
        isLoading={isLoading}
      />

      {/* ====== LISTE DES DOCUMENTS ====== */}
      <DocumentTypeList
        documentTypes={docTypes}
        userDocuments={userDocs}
        isLoading={isLoading}
        showActions
        onUpload={handleUpload}
        onView={handleView}
        onValidate={handleValidate}
        onReject={handleReject}
        isUploading={isUploading}
        isProcessing={isProcessing}
      />

      {/* ====== MODAL D'UPLOAD ====== */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Uploader un document
              {selectedDocType && (
                <span className="block text-sm font-normal text-muted-foreground">
                  {selectedDocType.name}
                </span>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file">Fichier</Label>
              <Input
                id="file"
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              />
              <p className="text-xs text-muted-foreground">
                Formats acceptés : PDF, JPG, PNG, DOC, DOCX (max 5 Mo)
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
                Annuler
              </Button>
              <Button
                onClick={handleUploadSubmit}
                disabled={!selectedFile || isUploading}
                className="gap-2"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Upload...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Uploader
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ====== VIEWER ====== */}
      <JustificationViewer
        open={viewerOpen}
        onOpenChange={setViewerOpen}
        url={viewerUrl}
      />
    </motion.div>
  );
}