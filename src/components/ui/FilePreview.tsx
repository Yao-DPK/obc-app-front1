// src/components/admin/FilePreview.tsx
import { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from 'src/components/ui/dialog';
import { Button } from 'src/components/ui/button';
import { Eye } from 'lucide-react';

interface FilePreviewProps {
  url: string;
  mimeType?: string;
  fileName?: string;
}

// Devine le type MIME à partir de l'extension du fichier
function guessMimeType(url: string): string {
  const ext = url.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'webp':
      return 'image/webp';
    case 'pdf':
      return 'application/pdf';
    default:
      return 'application/octet-stream';
  }
}

export function FilePreview({ url, mimeType, fileName }: FilePreviewProps) {
  const [open, setOpen] = useState(false);
  const effectiveMimeType = mimeType || guessMimeType(url);
  const isImage = effectiveMimeType.startsWith('image/');
  const isPdf = effectiveMimeType === 'application/pdf';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Eye className="h-4 w-4 mr-1" /> Voir
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">{fileName || 'Aperçu du fichier'}</h3>
        </div>
        <div className="border rounded-md overflow-hidden bg-gray-50 p-2 min-h-[400px] flex items-center justify-center">
          {isImage && <img src={url} alt="Aperçu" className="max-h-[60vh] max-w-full object-contain" />}
          {isPdf && <iframe src={url} className="w-full h-[60vh]" title="Aperçu PDF" />}
          {!isImage && !isPdf && (
            <div className="text-muted-foreground">
              Aperçu non disponible (fichier de type {effectiveMimeType})
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}