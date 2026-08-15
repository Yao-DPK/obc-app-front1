// src/pages/parent/ChildDocuments.tsx
import { useEffect, useState } from 'react';
import { useLoaderData, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { FileText, Plus, Loader2, Eye, Download, Trash2, Upload } from 'lucide-react';

import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDocumentStore } from '@/stores/documents/useDocumentStore';
import { useGuardianStore } from '@/stores/useGuardianStore';
import type { Document } from '@/types';

// ============================================================
// 1. INITIALISATION
// ============================================================

export default function ChildDocumentsPage() {
  const { id } = useParams<{ id: string }>();
  const playerId = Number(id);

  const { players } = useGuardianStore();
  const {
    documents,
    fetchDocuments,
    deleteDocument,
    uploadDocument,
    isLoading,
  } = useDocumentStore();

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const user = players.find((u) => u.id === playerId);
  const childName = user ? `${user.firstName} ${user.lastName}` : 'Enfant';

  // Charger les documents
  useEffect(() => {
    if (playerId) {
      fetchDocuments({ userId: playerId });
    }
  }, [playerId]);

  // ============================================================
  // 2. HANDLERS
  // ============================================================

  const handleView = (url: string) => {
    window.open(url, '_blank');
  };

  const handleDownload = async (doc: Document) => {
    try {
      const response = await fetch(doc.publicUrl!);
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = doc.type || 'document';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch {
      toast.error('Erreur lors du téléchargement');
    }
  };

  const handleDelete = async (docId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) return;
    try {
      await deleteDocument(docId);
      toast.success('Document supprimé');
      await fetchDocuments({ userId: playerId });
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile || !playerId) return;

    setIsUploading(true);
    try {
      await uploadDocument({
        userId: playerId,
        file: selectedFile,
        type: selectedFile.name,
        isObligatory: false,
      });
      toast.success('Document téléchargé avec succès');
      await fetchDocuments({ userId: playerId });
      setIsUploadModalOpen(false);
      setSelectedFile(null);
    } catch (error) {
      toast.error('Erreur lors du téléchargement');
    } finally {
      setIsUploading(false);
    }
  };

  // ============================================================
  // 3. RENDU
  // ============================================================

  if (isLoading && !documents.length) {
    return (
      <div className="space-y-6">
        <PageHeader title="Documents" description={childName} showBack />
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Chargement des documents...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 mb-20">
      <PageHeader title="Documents" description={childName} showBack>
        <Button onClick={() => setIsUploadModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Ajouter un document
        </Button>
      </PageHeader>

      <Card>
        <CardContent className="p-0">
          {documents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Aucun document</p>
              <p className="text-sm text-muted-foreground">
                Aucun document n'a encore été téléchargé pour cet enfant.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date d'upload</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">{doc.type}</TableCell>
                    <TableCell>{doc.type?.split('.').pop() || '—'}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          doc.documentStatus === 'Validé'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : doc.documentStatus === 'Rejeté'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }
                      >
                        {doc.documentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {doc.uploadedAt
                        ? new Date(doc.uploadedAt).toLocaleDateString('fr-FR')
                        : '—'}
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                        title="Voir"
                        onClick={() => handleView(doc.publicUrl!)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-green-600 hover:bg-green-50"
                        title="Télécharger"
                        onClick={() => handleDownload(doc)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:bg-red-50"
                        title="Supprimer"
                        onClick={() => handleDelete(doc.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modal d'upload */}
      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Télécharger un nouveau document</DialogTitle>
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
                Formats acceptés : PDF, JPG, PNG, DOC, DOCX
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsUploadModalOpen(false)}
              >
                Annuler
              </Button>
              <Button
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
                className="gap-2"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Envoi...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Télécharger
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}