import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Upload, FileText, CheckCircle, Clock } from 'lucide-react';
import axios from 'axios';

export default function Documents() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [docType, setDocType] = useState('certificat_medical');
  const [isObligatory, setIsObligatory] = useState(false);

  // Récupération des documents
  const { data: documents, refetch } = trpc.document.findByUser.useQuery(
    { userId: user!.id },
    { enabled: !!user }
  );

  const createDocument = trpc.document.create.useMutation({
    onSuccess: () => {
      refetch();
      toast.success('Document ajouté avec succès');
      setOpen(false);
      setFile(null);
      setDocType('certificat_medical');
      setIsObligatory(false);
    },
    onError: (err) => toast.error(err.message),
  });

  const handleUpload = async () => {
    if (!file) {
      toast.error('Veuillez sélectionner un fichier');
      return;
    }
    setUploading(true);
    try {
      // 1. Upload du fichier vers Google Drive via endpoint REST
      const formData = new FormData();
      formData.append('file', file);
      const uploadRes = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const { fileId, publicUrl } = uploadRes.data;

      // 2. Enregistrement des métadonnées via tRPC
      await createDocument.mutateAsync({
        userId: user!.id,
        type: docType,
        fileId,
        publicUrl,
        isObligatory,
      });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Erreur lors de l\'upload');
    } finally {
      setUploading(false);
    }
  };

  const getStatusIcon = (doc: any) => {
    return doc.validatedAt ? <CheckCircle className="text-green-500" size={16} /> : <Clock className="text-orange-500" size={16} />;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-heading text-primary">Mes documents</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-secondary text-primary hover:bg-secondary/90">
              <Upload size={16} className="mr-2" />
              Ajouter un document
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un document</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Type de document</Label>
                <Select value={docType} onValueChange={setDocType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="certificat_medical">Certificat médical</SelectItem>
                    <SelectItem value="photo_identite">Photo d'identité</SelectItem>
                    <SelectItem value="paiement_reçu">Reçu de paiement</SelectItem>
                    <SelectItem value="autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Fichier (PDF, JPEG)</Label>
                <Input type="file" accept=".pdf,.jpg,.jpeg" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              </div>
              {user?.role === 'admin' && (
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={isObligatory} onChange={(e) => setIsObligatory(e.target.checked)} />
                  <Label>Document obligatoire</Label>
                </div>
              )}
              <Button onClick={handleUpload} disabled={uploading} className="w-full bg-secondary text-primary">
                {uploading ? 'Upload en cours...' : 'Téléverser'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des documents</CardTitle>
        </CardHeader>
        <CardContent>
          {documents?.length === 0 ? (
            <p className="text-muted-foreground">Aucun document pour le moment.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date d'upload</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents?.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell>{doc.type}</TableCell>
                    <TableCell className="flex items-center gap-2">
                      {getStatusIcon(doc)}
                      <span>{doc.validatedAt ? 'Validé' : 'En attente'}</span>
                    </TableCell>
                    <TableCell>{new Date(doc.uploadedAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <a href={doc.publicUrl} target="_blank" rel="noopener noreferrer" className="text-secondary underline">
                        Voir
                      </a>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}