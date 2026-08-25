import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlayerInfoForm } from './PlayerInfoForm';
import type { User } from '@/types/user.type';

interface PlayerInfoTabProps {
  user: User;
  onValidChange: (isValid: boolean) => void;
}

export function PlayerInfoTab({ user, onValidChange }: PlayerInfoTabProps) {
  return (
    <Card className="border-0 sm:border shadow-none sm:shadow-sm">
      <CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle className="text-base sm:text-xl flex items-center gap-2">
              <span>Informations du joueur</span>
              <Badge variant="outline" className="text-[10px] sm:text-xs font-normal text-muted-foreground">
                Étape 1/3
              </Badge>
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Vérifiez les informations personnelles du joueur.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
        <PlayerInfoForm user={user} onValidChange={onValidChange} />
      </CardContent>
    </Card>
  );
}