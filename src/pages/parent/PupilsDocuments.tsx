// apps/web/src/pages/parent/ChildDocuments.tsx
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, File, Download } from 'lucide-react';
import { useParams } from 'react-router-dom';

const MOCK_DOCUMENTS = [
  { id: 1, name: 'Pièce d\'identité', type: 'PDF', status: 'validé', url: '/doc1.pdf', playerId: 1 },
  { id: 2, name: 'Certificat médical', type: 'PDF', status: 'en_attente', url: '/doc2.pdf', playerId: 1 },
  { id: 3, name: 'Photo d\'identité', type: 'JPG', status: 'validé', url: '/doc3.jpg', playerId: 2 },
];

export default function ChildDocumentsPage() {
  const { id } = useParams<{ id: string }>();
  const playerId = Number(id);
  
  // Filtrer les documents du bon enfant
  const documents = MOCK_DOCUMENTS.filter(doc => doc.playerId === playerId);
  
  // Récupérer le nom de l'enfant (mocké)
  const childName = playerId === 1 ? 'Kouadio Konan' : playerId === 2 ? 'Karine Konan' : '';

  const handleView = (url: string) => {
    window.open(url, '_blank');
  };

  const handleDownload = (url: string, name: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 mb-20">
      <PageHeader
        title="Documents"
        description={childName || 'Enfant'}
      />

      <Card>
        <CardContent className="p-0">
          {documents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <File className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Aucun document</p>
              <p className="text-sm text-muted-foreground">Aucun document n'a encore été téléchargé.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">{doc.name}</TableCell>
                    <TableCell>{doc.type}</TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        doc.status === 'validé' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {doc.status === 'validé' ? '✅ Validé' : '⏳ En attente'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8" 
                        title="Voir"
                        onClick={() => handleView(doc.url)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8" 
                        title="Télécharger"
                        onClick={() => handleDownload(doc.url, doc.name)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8" 
                        title="Modifier"
                        onClick={() => console.log('Modifier', doc.id)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
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