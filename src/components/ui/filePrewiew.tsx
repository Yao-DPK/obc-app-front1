import { Dialog, DialogContent, DialogTrigger } from './dialog';
import { Button } from './button';
import { Eye } from 'lucide-react';

export function FilePreview({ url, fileName }: { url: string; fileName?: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <div className="aspect-video bg-gray-100 rounded flex items-center justify-center">
          {url.match(/\.(jpg|jpeg|png|gif)$/i) ? (
            <img src={url} alt="Aperçu" className="max-h-full max-w-full object-contain" />
          ) : (
            <iframe src={url} className="w-full h-[500px]" title={fileName} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}