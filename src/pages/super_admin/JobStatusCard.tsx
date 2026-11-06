
// src/components/admin/jobs/JobStatusCard.tsx
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Play, Loader2, CheckCircle2, XCircle, Clock,
  Calendar, AlertTriangle, Repeat,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { MonthlyJobExecution } from '@/types';

interface Props {
  currentStatus: MonthlyJobExecution | null;
  isLoading: boolean;
  isRunning: boolean;
  onRun: () => Promise<void>;
}

const STATUS_CONFIG = {
  success: { label: 'Succès', icon: CheckCircle2, className: 'bg-green-50 text-green-700 border-green-200' },
  failed: { label: 'Échec', icon: XCircle, className: 'bg-red-50 text-red-700 border-red-200' },
  running: { label: 'En cours', icon: Loader2, className: 'bg-blue-50 text-blue-700 border-blue-200' },
} as const;

export function JobStatusCard({ currentStatus, isLoading, isRunning, onRun }: Props) {
  const now = new Date();
  const targetMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const targetLabel = format(targetMonth, 'MMMM yyyy', { locale: fr });

  const alreadySuccess = currentStatus?.status === 'success';
  const isFailed = currentStatus?.status === 'failed';
  const unresolvedFailed = currentStatus?.failedCount ?? 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Mensualités {targetLabel}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Statut */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm text-muted-foreground">Statut :</span>
              {currentStatus ? (
                <Badge
                  variant="outline"
                  className={cn('flex items-center gap-1.5', STATUS_CONFIG[currentStatus.status].className)}
                >
                  {(() => {
                    const Icon = STATUS_CONFIG[currentStatus.status].icon;
                    return <Icon className={cn('h-3.5 w-3.5', currentStatus.status === 'running' && 'animate-spin')} />;
                  })()}
                  {STATUS_CONFIG[currentStatus.status].label}
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  Pas encore généré
                </Badge>
              )}

              {currentStatus?.executedAt && (
                <span className="text-xs text-muted-foreground">
                  Dernière tentative : {format(new Date(currentStatus.executedAt), 'dd/MM/yyyy HH:mm', { locale: fr })}
                </span>
              )}
            </div>

            {/* Compteurs */}
            {currentStatus && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-600 flex items-center gap-1">
                    <Repeat className="h-3 w-3" /> Événements
                  </p>
                  <p className="text-lg font-bold text-gray-700">{currentStatus.eventsCount}</p>
                  <p className="text-[10px] text-muted-foreground">{currentStatus.playersCount} joueurs</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                  <p className="text-xs text-green-700">Créées</p>
                  <p className="text-lg font-bold text-green-700">{currentStatus.createdCount}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-600">Sautées</p>
                  <p className="text-lg font-bold text-gray-700">{currentStatus.skippedCount}</p>
                </div>
                <div className={cn('p-3 rounded-lg border', currentStatus.failedCount > 0 ? 'bg-red-50 border-red-100' : 'bg-gray-50 border-gray-100')}>
                  <p className={cn('text-xs', currentStatus.failedCount > 0 ? 'text-red-600' : 'text-gray-600')}>Échouées</p>
                  <p className={cn('text-lg font-bold', currentStatus.failedCount > 0 ? 'text-red-700' : 'text-gray-700')}>
                    {currentStatus.failedCount}
                  </p>
                </div>
              </div>
            )}

            {/* Erreur globale */}
            {isFailed && currentStatus?.error && (
              <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
                <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-700">Échec de la dernière exécution</p>
                  <p className="text-xs text-red-600 mt-0.5">{currentStatus.error}</p>
                </div>
              </div>
            )}

            {/* Message succès */}
            {alreadySuccess && unresolvedFailed === 0 && (
              <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <p className="text-sm text-green-700">
                  Les mensualités de <strong>{targetLabel}</strong> sont générées et à jour.
                </p>
              </div>
            )}

            {/* Bouton */}
            <div className="flex items-center gap-2 pt-2">
              <Button
                onClick={onRun}
                disabled={alreadySuccess || isRunning}
                className="gap-2"
              >
                {isRunning ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Génération en cours...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    {isFailed ? 'Réessayer la génération' : 'Générer maintenant'}
                  </>
                )}
              </Button>

              {alreadySuccess && (
                <span className="text-xs text-muted-foreground">
                  Action indisponible : déjà généré pour ce mois.
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}