// src/pages/parent/ChildDocuments.tsx (ou PlayerDocumentsPage)
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { 
  FileText, Loader2, Eye, Trash2, 
   File,
   Pencil,
   MoreHorizontal
} from 'lucide-react';

import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { useDocumentStore } from '@/stores/documents/useDocumentStore';
import { useAuth } from '@/stores/useAuth';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { UploadDocumentModal } from './UploadModal';
import { documentService } from '@/lib/services/document.service';

// ============================================================
// 1. INITIALISATION
// ============================================================

export default function PlayerDocumentsPage() {
  const { user } = useAuth();
  const playerId = Number(user!.id);

  const {
    documents,
    fetchDocuments,
    deleteDocument,
    uploadDocument,
    isLoading,
  } = useDocumentStore();

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [docType, setDocType] = useState<string>("Photo");
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  const childName = user ? `${user.firstName} ${user.lastName}` : 'Enfant';

  // Charger les documents
  useEffect(() => {
    if (playerId) {
      fetchDocuments({ userId: playerId });
    }
  }, [playerId, fetchDocuments]);

  // ============================================================
  // 2. HANDLERS
  // ============================================================

  const handleView = async (id: number) => {
    const data = await documentService.getSignedUrl(id);
    console.log(`data: ${data.signedUrl}`);
    window.open(data.signedUrl, '_blank')?.focus();
  };

  const handleDelete = async (docId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) return;
    setIsDeleting(docId);
    try {
      await deleteDocument(docId);
      toast.success('Document supprimé');
      await fetchDocuments({ userId: playerId });
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleEdit = async (docType: string) => {
    setDocType(docType);
    setIsUploadModalOpen(true);
  };


  const handleUpload = async (userId: number, file: File, type: string) => {
    if (!file || !userId) return;

    setIsUploading(true);
    try {
      await uploadDocument({
        userId: userId,
        file: file,
        type: type,
      });
      toast.success('Document téléchargé avec succès');
      console.log(isUploading);
      await fetchDocuments({ userId: playerId });
      setIsUploadModalOpen(false);
    } catch (error) {
      toast.error('Erreur lors du téléchargement');
    } finally {
      setIsUploading(false);
    }
  };

  // ============================================================
  // 3. RENDU
  // ============================================================

  const getStatusBadge = (status: string) => {
    const config = {
      'Validé': { className: 'bg-green-50 text-green-700 border-green-200', label: 'Validé' },
      'Rejeté': { className: 'bg-red-50 text-red-700 border-red-200', label: 'Rejeté' },
      'En attente de Validation': { className: 'bg-amber-50 text-amber-700 border-amber-200', label: 'En attente' },
    };
    const c = config[status as keyof typeof config] || config['En attente de Validation'];
    return <Badge variant="outline" className={c.className}>{c.label}</Badge>;
  };

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
      {/* ====== EN-TÊTE ====== */}
      <PageHeader title="Documents" description={childName} showBack/>
        

      {/* ====== CONTENU ====== */}
      <Card>
        <CardContent className="p-0">
          {documents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Aucun document</p>
              <p className="text-sm text-muted-foreground">
                Aucun document n'a encore été téléchargé.
              </p>
            </div>
          ) : (
            <>
              {/* ====== VERSION DESKTOP : TABLEAU ====== */}
              <div className="hidden md:block overflow-x-auto">
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
                        <TableCell>{getStatusBadge(doc.documentStatus!)}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString('fr-FR') : '—'}
                        </TableCell>
                        <TableCell className="text-right space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                            title="Voir"
                            onClick={() => handleView(doc.id!)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-green-600 hover:bg-green-50"
                            title="Modifier"
                            onClick={() => handleEdit(doc.type!)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-600 hover:bg-red-50"
                            title="Supprimer"
                            onClick={() => handleDelete(doc.id)}
                            disabled={isDeleting === doc.id}
                          >
                            {isDeleting === doc.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* ====== VERSION MOBILE : CARTES ====== */}
              <div className="md:hidden divide-y divide-gray-100">
                {documents.map((doc) => (
                    <div key={doc.id} className="p-4 space-y-3 hover:bg-gray-50/50 transition-colors">
                    {/* En-tête de la carte */}
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                        <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                            <File className="h-5 w-5 text-primary" />
                        </div>
                        <div className="min-w-0">
                            <p className="font-medium truncate">{doc.type}</p>
                            <div className="flex flex-wrap items-center gap-2 mt-0.5">
                            <span className="text-xs text-muted-foreground">
                                {doc.type?.split('.').pop()?.toUpperCase() || '—'}
                            </span>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">
                                {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString('fr-FR') : '—'}
                            </span>
                            </div>
                        </div>
                        </div>
                        {getStatusBadge(doc.documentStatus!)}
                    </div>

                    {/* Actions principales + menu overflow */}
                    <div className="flex items-center gap-1 pt-1 border-t border-gray-100">
                        {/* Actions principales (visibles) */}
                        <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 gap-1.5 text-blue-600 hover:bg-blue-50 h-9"
                        onClick={() => handleView(doc.id!)}
                        >
                        <Eye className="h-4 w-4" />
                        <span className="text-xs">Voir</span>
                        </Button>

                        <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 gap-1.5 text-green-600 hover:bg-blue-50 h-9"
                        onClick={() => handleEdit(doc.type!)}
                        >
                        <Pencil className="h-4 w-4" />
                        <span className="text-xs">Modifier</span>
                        </Button>


                        {/* Menu déroulant (Plus) pour les actions secondaires */}
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                            variant="ghost"
                            size="sm"
                            className="flex-1 gap-1.5 text-gray-600 hover:bg-gray-50 h-9"
                            >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="text-xs">Plus</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">

                            {/* Action secondaire 2 : Supprimer */}
                            <DropdownMenuItem
                            onClick={() => handleDelete(doc.id)}
                            className="gap-2 cursor-pointer text-red-600 focus:text-red-600"
                            disabled={isDeleting === doc.id}
                            >
                            {isDeleting === doc.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Trash2 className="h-4 w-4" />
                            )}
                            Supprimer
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    </div>
                ))}
                </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* ====== MODAL D'UPLOAD (responsive) ====== */}
        <UploadDocumentModal
            open={isUploadModalOpen} 
            onOpenChange={setIsUploadModalOpen}
            onUpload={handleUpload}
            userId={playerId}
            docType={docType}
        />
    </div>
    
  );
}