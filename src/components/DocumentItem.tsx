import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Eye,
  Pencil,
  Trash2,
  File,
  CheckCircle2,
  AlertCircle,
  Clock,
  Upload,
  FileText,
  User,
  Calendar,
  X,
  Loader2,
  Check,
  XCircle,
} from 'lucide-react';
import { type DocumentStatus, type Document, type DocumentType } from '@/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useRef, useState, useEffect } from 'react';
import { Input } from './ui/input';
import { Progress } from './ui/progress';

// ========== MAPPING ICÔNES PAR TYPE ==========
const DOCUMENT_ICONS: Record<string, React.ReactNode> = {
  'Certificat Medical': <File className="h-5 w-5" />,
  'Extrait de Naissance': <FileText className="h-5 w-5" />,
  "Photo": <User className="h-5 w-5" />,
  'Autorisation Parentale': <FileText className="h-5 w-5" />,
  'Attestation Scolaire': <FileText className="h-5 w-5" />,
  "Piece Identite": <User className="h-5 w-5" />,
  Autre: <File className="h-5 w-5" />,
};

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

// ========== PROPS ==========
interface DocumentItemProps {
  document?: Document | null;
  docType: DocumentType;

  onView?: (doc: Document) => void;
  onEdit?: (doc: Document) => void;
  onDelete?: (doc: Document) => void;
  onDownload?: (doc: Document) => void;
  onValidate?: (doc: Document) => Promise<void>;
  onReject?: (doc: Document) => Promise<void>;

  // ─── UPLOAD ───
  onUpload?: (file: File, documentType: DocumentType) => Promise<void> | void;
  onFileChange?: (file: File, documentType: DocumentType) => Promise<void> | void;
  accept?: string;
  maxSize?: number; // en Mo
  uploading?: boolean;
  uploadProgress?: number;

  // ─── AFFICHAGE ───
  showActions?: boolean;
  showValidationActions?: boolean;
  showStatus?: boolean;
  showUploadDate?: boolean;
  showObligatory?: boolean;
  showUploadButton?: boolean;
  showPreview?: boolean; // 👈 Nouveau : afficher l'aperçu
  mode?: 'view' | 'upload' | 'mixed';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'card' | 'compact';
}

export function DocumentItem({
  document = null,
  docType,
  onView,
  onFileChange,
  onEdit,
  onDelete,
  onDownload,
  onValidate,
  onReject,
  onUpload,
  accept = '.pdf,.jpg,.jpeg,.png',
  maxSize = 5,
  uploading = false,
  uploadProgress = 0,
  showActions = true,
  showValidationActions = true,
  showStatus = true,
  showUploadDate = false,
  showObligatory = false,
  showUploadButton = false,
  showPreview = true, // 👈 Activé par défaut
  mode = 'mixed',
  className,
  size = 'md',
  variant = 'card',
}: DocumentItemProps) {
  // ========== ÉTATS LOCAUX ==========
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isUploadingLocal, setIsUploadingLocal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isUploaded = !!document?.publicUrl;
  const Icon = document?.type
    ? DOCUMENT_ICONS[document.type] || DOCUMENT_ICONS['Autre']
    : DOCUMENT_ICONS['Autre'];
  const statusConfig = document?.documentStatus
    ? STATUS_CONFIG[document.documentStatus]
    : STATUS_CONFIG['En attente de Validation'];

  // ========== TAILLES ==========
  const sizeClasses = {
    sm: { text: 'text-sm', icon: 'h-4 w-4', padding: 'p-3' },
    md: { text: 'text-base', icon: 'h-5 w-5', padding: 'p-4' },
    lg: { text: 'text-lg', icon: 'h-6 w-6', padding: 'p-5' },
  };
  const s = sizeClasses[size];

  // ========== GÉNÉRER UN APERÇU ==========
  useEffect(() => {
    // Si un document est uploadé et a une URL, on crée un aperçu
    if (document?.publicUrl) {
      // Si c'est une image, on peut utiliser l'URL directement
      // Sinon, on pourrait afficher une icône
      setPreviewUrl(document.publicUrl);
    } else if (selectedFile) {
      // Pour un fichier sélectionné, on crée un objet URL (pour les images)
      if (selectedFile.type.startsWith('image/')) {
        const url = URL.createObjectURL(selectedFile);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url); // Nettoyage
      } else {
        setPreviewUrl(null);
      }
    } else {
      setPreviewUrl(null);
    }
  }, [document, selectedFile]);

  // ========== GESTIONNAIRES ==========
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

  const handleValidate = async () => {
    if (!document) return;
    setIsValidating(true);
    try {
      await onValidate?.(document);
    } finally {
      setIsValidating(false);
    }
  };

  const handleReject = async () => {
    if (!document) return;
    setIsRejecting(true);
    try {
      await onReject?.(document);
    } finally {
      setIsRejecting(false);
    }
  };

  const isPending = document?.documentStatus === 'En attente de Validation';
  const isLocked = document?.documentStatus === 'Validé' || document?.documentStatus === 'Rejeté';

  // ========== RENDU DE L'APERÇU ==========
  const renderPreview = () => {
    if (!showPreview) return null;

    if (previewUrl && (previewUrl.startsWith('blob:') || previewUrl.startsWith('http'))) {
      // Tenter d'afficher une image
      return (
        <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0 bg-gray-50">
          <img
            src={previewUrl}
            alt="Aperçu"
            className="w-full h-full object-cover"
            onError={() => {
              // Si l'image ne peut pas être chargée, on affiche une icône
              setPreviewUrl(null);
            }}
          />
        </div>
      );
    }

    // Fallback : afficher l'icône du document
    return (
      <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
        {Icon}
      </div>
    );
  };

  // ========== RENDU : ÉTAT VIDE (non uploadé) ==========
  if (!isUploaded || mode === 'upload') {
    const isUploadingState = uploading || isUploadingLocal;
    const hasFile = !!selectedFile;

    return (
      <div
        className={cn(
          'border-2 border-dashed rounded-xl transition-all duration-200',
          isUploadingState
            ? 'border-primary/50 bg-primary/5'
            : hasFile
            ? 'border-green-300 bg-green-50/50'
            : 'border-gray-300 bg-white hover:border-primary/30 hover:bg-primary/5',
          className
        )}
      >
        <div className={cn('space-y-3', s.padding)}>
          {/* ====== EN-TÊTE ====== */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'p-2 rounded-lg',
                  hasFile
                    ? 'bg-green-100 text-green-600'
                    : isUploadingState
                    ? 'bg-primary/20 text-primary'
                    : 'bg-gray-100 text-gray-400'
                )}
              >
                {isUploadingState ? <Loader2 className="h-5 w-5 animate-spin" /> : Icon}
              </div>
              <div>
                <p className={cn('font-medium', s.text)}>{docType.name || 'Document'}</p>
                {showObligatory && docType.isObligatory && (
                  <Badge variant="outline" className="text-xs text-red-500 border-red-200 bg-red-50">
                    * Obligatoire
                  </Badge>
                )}
              </div>
            </div>
            {onDelete && document && (
              <Button
                variant="ghost"
                size="icon"
                className="text-red-500 hover:bg-red-50"
                onClick={() => onDelete(document)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* ====== ZONE DE DÉPÔT ====== */}
          <div className="relative">
            {isUploadingState ? (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Téléchargement en cours...</p>
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-xs text-muted-foreground">{uploadProgress}%</p>
              </div>
            ) : hasFile ? (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-green-50/50 p-3 rounded-lg border border-green-200">
                {showPreview && previewUrl && (
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                    <img
                      src={previewUrl}
                      alt="Aperçu"
                      className="w-full h-full object-cover"
                      onError={() => setPreviewUrl(null)}
                    />
                  </div>
                )}
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <File className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm font-medium truncate">{selectedFile.name}</span>
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    ({(selectedFile.size / 1024).toFixed(1)} Ko)
                  </span>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-red-500"
                    onClick={removeSelectedFile}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  {showUploadButton && (
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={handleUpload}
                      disabled={isUploadingState}
                    >
                      <Upload className="h-4 w-4 mr-1" />
                      Télécharger
                    </Button>
                  )}
                </div>
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
                  Formats acceptés : {accept.split(',').join(' ')} – Max {maxSize} Mo
                </p>
              </>
            )}
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>
        </div>
      </div>
    );
  }

  // ========== RENDU CARTE ==========
  if (variant === 'card') {
    return (
      <div
        className={cn(
          'border-2 rounded-xl transition-all duration-200',
          isUploaded
            ? 'border-green-200 bg-green-50/50'
            : 'border-gray-200 bg-white hover:border-primary/30 hover:shadow-sm',
          className
        )}
      >
        <div className={cn('flex flex-col sm:flex-row sm:items-center justify-between gap-4', s.padding)}>
          {/* ====== GAUCHE : APERÇU + INFOS ====== */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {showPreview && (
              <div className="flex-shrink-0">
                {renderPreview()}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={cn('font-medium', s.text)}>{document.type}</span>

                {showObligatory && document.isObligatory && (
                  <Badge variant="outline" className="text-xs text-red-500 border-red-200 bg-red-50">
                    * Obligatoire
                  </Badge>
                )}

                {showStatus && (
                  <Badge variant="outline" className={cn('flex items-center gap-1', statusConfig.className)}>
                    {statusConfig.icon}
                    {statusConfig.label}
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground flex-wrap">
                {showUploadDate && document.uploadedAt && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(document.uploadedAt).toLocaleDateString('fr-FR')}
                  </span>
                )}
                {document.validatedAt && (
                  <span className="flex items-center gap-1 text-green-600">
                    <CheckCircle2 className="h-3 w-3" />
                    Validé le {new Date(document.validatedAt).toLocaleDateString('fr-FR')}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ====== DROITE : ACTIONS ====== */}
          <div className="flex items-center gap-1 flex-shrink-0 flex-wrap">
            {showActions && (
              <>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                        onClick={() => onView?.(document)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Voir</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {onDownload && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-green-600 hover:bg-green-50 hover:text-green-700"
                          onClick={() => onDownload(document)}
                        >
                          <Upload className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Télécharger</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}

                {onEdit && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-amber-600 hover:bg-amber-50 hover:text-amber-700"
                          onClick={() => onEdit(document)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Modifier</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}

                {onDelete && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-red-600 hover:bg-red-50 hover:text-red-700"
                          onClick={() => onDelete(document)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Supprimer</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </>
            )}

            {/* ====== ACTIONS DE VALIDATION ====== */}
            {showValidationActions && isPending && (
              <>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-green-600 hover:bg-green-50 hover:text-green-700"
                        onClick={handleValidate}
                        disabled={isValidating || isRejecting}
                      >
                        {isValidating ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Valider</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={handleReject}
                        disabled={isValidating || isRejecting}
                      >
                        {isRejecting ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <XCircle className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Rejeter</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </>
            )}

            {showValidationActions && isLocked && (
              <span className="text-xs text-muted-foreground italic">
                {document.documentStatus === 'Validé' ? '✅ Validé' : '❌ Rejeté'}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ========== RENDU COMPACT ==========
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0',
        className
      )}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {showPreview && previewUrl && (
          <div className="relative w-8 h-8 rounded overflow-hidden flex-shrink-0">
            <img
              src={previewUrl}
              alt="Aperçu"
              className="w-full h-full object-cover"
              onError={() => setPreviewUrl(null)}
            />
          </div>
        )}
        {!showPreview || !previewUrl ? (
          <div className="text-muted-foreground">{Icon}</div>
        ) : null}
        <span className={cn('font-medium truncate', s.text)}>{document.type}</span>

        {showObligatory && document.isObligatory && (
          <span className="text-xs text-red-500">*</span>
        )}

        {showStatus && (
          <Badge variant="outline" className={cn('text-xs', statusConfig.className)}>
            {statusConfig.label}
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-1 flex-shrink-0">
        {showActions && (
          <>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onView?.(document)}>
              <Eye className="h-4 w-4" />
            </Button>
            {onEdit && (
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(document)}>
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => onDelete(document)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </>
        )}

        {showValidationActions && isPending && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-green-600"
              onClick={handleValidate}
              disabled={isValidating || isRejecting}
            >
              {isValidating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-600"
              onClick={handleReject}
              disabled={isValidating || isRejecting}
            >
              {isRejecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}