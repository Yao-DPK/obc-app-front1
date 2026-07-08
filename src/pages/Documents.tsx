import { useState, useEffect } from 'react';
import { useAuth } from '@/stores/useAuth';
import { Button } from 'src/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from 'src/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'src/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from 'src/components/ui/dialog';
import { Input } from 'src/components/ui/input';
import { Label } from 'src/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'src/components/ui/select';
import { toast } from 'sonner';
import { Upload, CheckCircle, Clock } from 'lucide-react';
import axios from 'axios';

// Types locaux (à adapter selon votre schéma)
interface Document {
  id: number;
  type: string;
  fileId: string;
  publicUrl: string;
  isObligatory: boolean;
  validatedAt: string | null;
  uploadedAt: string;
}

export default function Documents() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [docType, setDocType] = useState('certificat_medical');
  const [isObligatory, setIsObligatory] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);

  // Charger les documents à l'affichage
  const fetchDocuments = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await axios.get(`/api/documents/user/${user.id}`);
      setDocuments(res.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur lors du chargement des documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [user]);

  const handleUpload = async () => {
    if (!file) {
      toast.error('Veuillez sélectionner un fichier');
      return;
    }
    setUploading(true);
    try {
      // 1. Upload du fichier vers Google Drive via l'endpoint REST
      const formData = new FormData();
      formData.append('file', file);
      const uploadRes = await axios.post('/api/upload/file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const { fileId, publicUrl } = uploadRes.data;

      // 2. Enregistrement des métadonnées via l'endpoint REST /api/documents
      await axios.post('/api/documents', {
        userId: user!.id,
        type: docType,
        fileId,
        publicUrl,
        isObligatory,
      });

      toast.success('Document ajouté avec succès');
      setOpen(false);
      setFile(null);
      setDocType('certificat_medical');
      setIsObligatory(false);
      // Recharger la liste
      fetchDocuments();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur lors de l\'upload');
    } finally {
      setUploading(false);
    }
  };

  const getStatusIcon = (doc: Document) => {
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
                    <SelectItem value="photo_identite">Photo d'identite</SelectItem>
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
          {loading ? (
            <p className="text-muted-foreground">Chargement...</p>
          ) : documents.length === 0 ? (
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
                {documents.map((doc) => (
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