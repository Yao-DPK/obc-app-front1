// src/components/admin/FilePreview.tsx
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

interface FilePreviewProps {
  url: string;
  fileName?: string;
}

export function FilePreview({ url }: FilePreviewProps) {
  const handleOpen = () => {
    window.open(url, '_blank');
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleOpen}>
      <Eye className="h-4 w-4 mr-1" /> Voir
    </Button>
  );
}