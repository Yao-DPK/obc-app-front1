import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';

interface JustificationViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  url: string;
}

export function JustificationViewer({ open, onOpenChange, url }: JustificationViewerProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log(`url: ${url}`);
  }, [])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Visionneuse</DialogTitle>
        </DialogHeader>
        <div className="relative w-full h-[50vh] bg-gray-100 rounded-lg overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          <img
            src={url}
            alt="Justificatif"
            className="w-full h-full object-contain"
            onLoad={() => setIsLoading(false)}
            onError={() => setIsLoading(false)}
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
          <Button variant="secondary" onClick={() => window.open(url, '_blank')}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Ouvrir dans un nouvel onglet
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}