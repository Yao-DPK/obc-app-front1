// src/components/validation/PlayerDocumentsTab.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlayerDocuments } from './PlayerDocuments';

interface PlayerDocumentsTabProps {
  userId: number;
  isLoading: boolean;
  onSuccess: () => void;
  onValidChange: (isValid: boolean) => void;
}

export function PlayerDocumentsTab({
  userId,
  isLoading,
  onSuccess,
  onValidChange,
}: PlayerDocumentsTabProps) {
  return (
    <Card className="border-0 sm:border shadow-none sm:shadow-sm">
      <CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle className="text-base sm:text-xl flex items-center gap-2">
              <span>Documents</span>
              <Badge variant="outline" className="text-[10px] sm:text-xs font-normal text-muted-foreground">
                Étape 2/3
              </Badge>
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Téléversez les documents requis.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
        <PlayerDocuments
          userId={userId}
          isLoading={isLoading}
          onSuccess={onSuccess}
          onValidChange={onValidChange}
        />
      </CardContent>
    </Card>
  );
}