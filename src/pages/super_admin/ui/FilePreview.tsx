// src/components/admin/FilePreview.tsx
import { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Eye, FileText, Image } from 'lucide-react';

interface FilePreviewProps {
  url: string;
  mimeType?: string;
  fileName?: string;
}

export function FilePreview({ url, mimeType = 'application/pdf', fileName }: FilePreviewProps) {
  const [open, setOpen] = useState(false);

  const isImage = mimeType.startsWith('image/');
  const isPdf = mimeType === 'application/pdf';

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
          {isImage && <img src={url} alt="preview" className="max-h-[60vh] object-contain" />}
          {isPdf && <iframe src={url} className="w-full h-[60vh]" title="PDF preview" />}
          {!isImage && !isPdf && <div className="text-muted-foreground">Aperçu non disponible</div>}
        </div>
      </DialogContent>
    </Dialog>
  );
}