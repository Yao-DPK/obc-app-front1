import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  File,
  CheckCircle2,
  AlertCircle,
  Clock,
  Upload,
  X,
  Loader2,
  Eye,
  Trash2,
} from 'lucide-react';
import { type DocumentStatus, type Document, type DocumentType } from '@/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useRef, useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';

// ========== MAPPING STATUTS ==========
const STATUS_CONFIG: Record<
  DocumentStatus,
  { label: string; icon: React.ReactNode; className: string }
> = {
  'Validé': {
    label: 'Validé',
    icon: <CheckCircle2 className="h-4 w-4" />,
    className: 'bg-green-100 text-green-700 border-green-200',
  },
  'En attente de Validation': {
    label: 'En attente',
    icon: <Clock className="h-4 w-4" />,
    className: 'bg-amber-100 text-amber-700 border-amber-200',
  },
  'Rejeté': {
    label: 'Rejeté',
    icon: <AlertCircle className="h-4 w-4" />,
    className: 'bg-red-100 text-red-700 border-red-200',
  },
  'Expiré': {
    label: 'Expiré',
    icon: <Clock className="h-4 w-4" />,
    className: 'bg-gray-100 text-gray-600 border-gray-200',
  },
};

interface PhotoDocumentItemProps {
  document?: Document | null;
  docType: DocumentType;

  onView?: (doc: Document) => void;
  onDelete?: (doc: Document) => void;

  // ─── UPLOAD ───
  onUpload?: (file: File, documentType: DocumentType) => Promise<void> | void;
  onFileChange?: (file: File, documentType: DocumentType) => Promise<void> | void;
  accept?: string;
  maxSize?: number;
  uploading?: boolean;
  uploadProgress?: number;

  // ─── AFFICHAGE ───
  showStatus?: boolean;
  showObligatory?: boolean;
  showActions?: boolean;
  className?: string;
}

export function PhotoDocumentItem({
  document = null,
  docType,
  onView,
  onDelete,
  onUpload,
  onFileChange,
  accept = '.jpg,.jpeg,.png',
  maxSize = 5,
  uploading = false,
  uploadProgress = 0,
  showStatus = true,
  showObligatory = false,
  showActions = true,
  className,
}: PhotoDocumentItemProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploadingLocal, setIsUploadingLocal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isUploaded = !!document?.publicUrl;
  const statusConfig = document?.documentStatus
    ? STATUS_CONFIG[document.documentStatus]
    : STATUS_CONFIG['En attente de Validation'];

  // Générer l'aperçu
  useEffect(() => {
    if (document?.publicUrl) {
      setPreviewUrl(document.publicUrl);
    } else if (selectedFile) {
      if (selectedFile.type.startsWith('image/')) {
        const url = URL.createObjectURL(selectedFile);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
      } else {
        setPreviewUrl(null);
      }
    } else {
      setPreviewUrl(null);
    }
  }, [document, selectedFile]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (maxSize && file.size > maxSize * 1024 * 1024) {
      setError(`Le fichier dépasse ${maxSize} Mo`);
      return;
    }
    setError(null);
    setSelectedFile(file);
    await onFileChange?.(file, docType);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploadingLocal(true);
    try {
      await onUpload?.(selectedFile, docType);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      setError('Erreur lors du téléchargement');
    } finally {
      setIsUploadingLocal(false);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleView = () => {
    if (document) onView?.(document);
  };

  // ========== RENDU ==========

  // Cas : en cours de téléchargement
  const isUploadingState = uploading || isUploadingLocal;

  if (isUploadingState) {
    return (
      <div className={cn('border-2 border-primary/50 bg-primary/5 rounded-xl p-4', className)}>
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Téléchargement en cours...</p>
          <Progress value={uploadProgress} className="h-2 w-full max-w-xs" />
          <p className="text-xs text-muted-foreground">{uploadProgress}%</p>
        </div>
      </div>
    );
  }

  // Cas : document déjà uploadé
  if (isUploaded && document) {
    return (
      <div
        className={cn(
          'group relative rounded-xl overflow-hidden border-2 border-gray-200 bg-white transition-all hover:shadow-md',
          document.documentStatus === 'Validé' && 'border-green-300',
          document.documentStatus === 'Rejeté' && 'border-red-300',
          className
        )}
      >
        {/* Image / Aperçu */}
        <div className="aspect-square w-full bg-gray-50 relative overflow-hidden">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt={docType.name}
              className="w-full h-full object-cover"
              onError={() => setPreviewUrl(null)}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <File className="h-12 w-12" />
            </div>
          )}
          {/* Overlay au survol */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            {showActions && (
              <>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-9 w-9"
                        onClick={handleView}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Voir</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-9 w-9 text-red-500 hover:text-red-700"
                        onClick={() => onDelete?.(document)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Supprimer</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </>
            )}
          </div>
        </div>

        {/* Information */}
        <div className="p-2 flex items-center justify-between">
          <span className="text-sm font-medium truncate">{docType.name}</span>
          {showObligatory && docType.isObligatory && (
            <span className="text-xs text-red-500">*</span>
          )}
          {showStatus && (
            <Badge
              variant="outline"
              className={cn('text-xs flex items-center gap-1', statusConfig.className)}
            >
              {statusConfig.icon}
              {statusConfig.label}
            </Badge>
          )}
        </div>
      </div>
    );
  }

  // Cas : zone de dépôt (non uploadé)
  const hasFile = !!selectedFile;

  return (
    <div
      className={cn(
        'border-2 border-dashed rounded-xl transition-all duration-200',
        hasFile
          ? 'border-green-300 bg-green-50/50'
          : 'border-gray-300 bg-white hover:border-primary/30 hover:bg-primary/5',
        className
      )}
    >
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-medium">{docType.name}</span>
            {showObligatory && docType.isObligatory && (
              <Badge variant="outline" className="text-xs text-red-500 border-red-200 bg-red-50">
                * Obligatoire
              </Badge>
            )}
          </div>
        </div>

        <div className="relative">
          {hasFile ? (
            <div className="flex flex-col items-center gap-2">
              {previewUrl && (
                <div className="w-32 h-32 rounded-lg overflow-hidden border border-gray-200">
                  <img src={previewUrl} alt="Aperçu" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium truncate max-w-[150px]">{selectedFile.name}</span>
                <span className="text-xs text-muted-foreground">
                  ({(selectedFile.size / 1024).toFixed(1)} Ko)
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-red-500"
                  onClick={removeSelectedFile}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={handleUpload}
              >
                <Upload className="h-4 w-4 mr-1" />
                Télécharger
              </Button>
            </div>
          ) : (
            <>
              <Input
                ref={fileInputRef}
                type="file"
                accept={accept}
                className="cursor-pointer"
                onChange={handleFileSelect}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Formats : {accept.split(',').join(' ')} – Max {maxSize} Mo
              </p>
            </>
          )}
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
      </div>
    </div>
  );
}