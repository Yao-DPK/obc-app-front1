// src/pages/admin/DocumentTypesManagement.tsx
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, FileText } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import type { DocumentType } from '@/types';
import { useDocumentTypeStore } from '@/stores/documents/useDocumentTypeStore';
import { DocumentTypeModal } from './DocumentTypeModal';

export default function DocumentTypesManagement() {
  const { docTypes, fetchDocTypes, isLoading, deleteDocType, toggleActive } = useDocumentTypeStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDocType, setEditingDocType] = useState<DocumentType | null>(null);

  useEffect(() => {
    fetchDocTypes({includeInactive: true});
  }, []);

  const handleEdit = (docType: DocumentType) => {
    setEditingDocType(docType);
    setModalOpen(true);
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le type "${name}" ?`)) return;
    try {
      await deleteDocType(id);
      toast.success('Type de document supprimé');
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleToggleActive = async (id: number) => {
    try {
      await toggleActive(id);
      toast.success('Statut modifié');
    } catch (error) {
      toast.error('Erreur lors du changement de statut');
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingDocType(null);
  };

  const handleModalSuccess = () => {
    fetchDocTypes({includeInactive: true});
    handleModalClose();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 mb-20">
      <PageHeader
        title="Types de documents"
        description="Gestion des types de documents acceptés par le système"
      >
        <Button
          onClick={() => setModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouveau type
        </Button>
      </PageHeader>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            Types ({docTypes.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : docTypes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Aucun type de document</p>
              <p className="text-sm text-muted-foreground">Cliquez sur "Nouveau type" pour en créer un.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead className="hidden md:table-cell">Description</TableHead>
                    <TableHead className="hidden lg:table-cell">Catégories</TableHead>
                    <TableHead className="text-center">Obligatoire</TableHead>
                    <TableHead className="text-center">Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {docTypes.map((docType) => (
                    <TableRow key={docType.id}>
                      <TableCell className="font-medium">{docType.name}</TableCell>
                      <TableCell className="hidden md:table-cell max-w-[200px] truncate">
                        {docType.description || '—'}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {docType.applicableCategories?.map((cat) => (
                            <Badge key={cat} variant="outline" className="text-[10px]">
                              {cat}
                            </Badge>
                          )) || '—'}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {docType.isObligatory ? (
                          <Badge className="bg-blue-100 text-blue-700 border-blue-200">✅ Oui</Badge>
                        ) : (
                          <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200">
                            ❌ Non
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center">
                          <Switch
                            checked={docType.isActive}
                            onCheckedChange={() => handleToggleActive(docType.id)}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                            onClick={() => handleEdit(docType)}
                            title="Modifier"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={() => handleDelete(docType.id, docType.name)}
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <DocumentTypeModal
        open={modalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        docType={editingDocType}
      />
    </motion.div>
  );
}