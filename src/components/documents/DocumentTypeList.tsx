// src/components/documents/DocumentTypeList.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Upload,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DocumentType, Document } from '@/types';

interface DocumentTypeListProps {
  documentTypes: DocumentType[];
  userDocuments: Document[];
  isLoading?: boolean;
  className?: string;
  showActions?: boolean;
  onUpload?: (docType: DocumentType) => void;
  onView?: (document: Document) => void;
  onValidate?: (document: Document) => Promise<void>;
  onReject?: (document: Document) => Promise<void>;
  isUploading?: boolean;
  isProcessing?: boolean;
}

const STATUS_CONFIG = {
  'Validé': {
    label: 'Validé',
    icon: CheckCircle,
    className: 'bg-green-100 text-green-700 border-green-200',
  },
  'En attente de Validation': {
    label: 'En attente',
    icon: Clock,
    className: 'bg-amber-100 text-amber-700 border-amber-200',
  },
  'Rejeté': {
    label: 'Rejeté',
    icon: XCircle,
    className: 'bg-red-100 text-red-700 border-red-200',
  },
  'Expiré': {
    label: 'Expiré',
    icon: AlertCircle,
    className: 'bg-gray-100 text-gray-600 border-gray-200',
  },
  'not_provided': {
    label: 'Non fourni',
    icon: FileText,
    className: 'bg-gray-100 text-gray-500 border-gray-200',
  },
};

export function DocumentTypeList({
  documentTypes,
  userDocuments,
  isLoading = false,
  className,
  showActions = true,
  onUpload,
  onView,
  onValidate,
  onReject,
  isUploading = false,
  isProcessing = false,
}: DocumentTypeListProps) {
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Documents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-8 w-20" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (documentTypes.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Documents</CardTitle>
        </CardHeader>
        <CardContent className="py-8 text-center text-muted-foreground">
          Aucun type de document configuré dans le système.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          Documents
          <Badge variant="secondary" className="ml-2">
            {documentTypes.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {documentTypes.map((docType) => {
          // Trouver le document de l'utilisateur pour ce type
          const userDoc = userDocuments.find((d) => d.type === docType.name);
          const isProvided = !!userDoc;
          const status = isProvided
            ? (userDoc.documentStatus as keyof typeof STATUS_CONFIG)
            : 'not_provided';
          const statusConfig = STATUS_CONFIG[status] || STATUS_CONFIG.not_provided;
          const StatusIcon = statusConfig.icon;

          return (
            <div
              key={docType.id}
              className="flex flex-wrap items-center justify-between p-4 border rounded-lg hover:bg-gray-50/50 transition-colors gap-2"
            >
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium truncate">{docType.name}</p>
                  {docType.isObligatory && (
                    <Badge variant="outline" className="text-xs text-red-500 border-red-200 bg-red-50">
                      * Obligatoire
                    </Badge>
                  )}
                  <Badge
                    variant="outline"
                    className={cn('flex items-center gap-1 text-xs', statusConfig.className)}
                  >
                    <StatusIcon className="h-3 w-3" />
                    {statusConfig.label}
                  </Badge>
                </div>
                {isProvided && userDoc.uploadedAt && (
                  <p className="text-xs text-muted-foreground">
                    Uploadé le {new Date(userDoc.uploadedAt).toLocaleDateString('fr-FR')}
                  </p>
                )}
                {isProvided && userDoc.validatedAt && (
                  <p className="text-xs text-green-600">
                    Validé le {new Date(userDoc.validatedAt).toLocaleDateString('fr-FR')}
                  </p>
                )}
              </div>

              {/* ====== ACTIONS ====== */}
              <div className="flex items-center gap-1">
                {isProvided ? (
                  <>
                    {/* Voir le document */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView?.(userDoc)}
                      className="gap-1"
                    >
                      <Eye className="h-4 w-4" />
                      Voir
                    </Button>

                    {/* Actions admin (validation/rejet) */}
                    {showActions && userDoc.documentStatus === 'En attente de Validation' && (
                      <>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white h-8 px-3 gap-1"
                          onClick={() => onValidate?.(userDoc)}
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <CheckCircle className="h-3.5 w-3.5" />
                          )}
                          Valider
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="h-8 px-3 gap-1"
                          onClick={() => onReject?.(userDoc)}
                          disabled={isProcessing}
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          Rejeter
                        </Button>
                      </>
                    )}
                  </>
                ) : (
                  // Document manquant → bouton upload
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onUpload?.(docType)}
                    disabled={isUploading}
                    className="gap-1"
                  >
                    {isUploading ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                    Uploader
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}