// src/components/admin/jobs/JobHistoryTable.tsx
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Clock, CheckCircle2, XCircle, Loader2, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import type { MonthlyJobExecution } from '@/types';

interface Props {
  history: MonthlyJobExecution[];
  isLoading: boolean;
}

const STATUS_CONFIG = {
  success: { label: 'Succès', icon: CheckCircle2, className: 'bg-green-50 text-green-700 border-green-200' },
  failed: { label: 'Échec', icon: XCircle, className: 'bg-red-50 text-red-700 border-red-200' },
  running: { label: 'En cours', icon: Loader2, className: 'bg-blue-50 text-blue-700 border-blue-200' },
} as const;

export function JobHistoryTable({ history, isLoading }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Historique des exécutions
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-4 space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Clock className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">Aucune exécution enregistrée</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mois cible</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-center">Évts / Joueurs</TableHead>
                <TableHead className="text-center">Créées</TableHead>
                <TableHead className="text-center">Sautées</TableHead>
                <TableHead className="text-center">Échouées</TableHead>
                <TableHead>Exécuté le</TableHead>
                <TableHead>Par</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((exec) => {
                const status = exec.status as keyof typeof STATUS_CONFIG;
                const cfg = STATUS_CONFIG[status];
                const Icon = cfg.icon;
                return (
                  <TableRow key={exec.id}>
                    <TableCell className="font-medium">{exec.targetMonth}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn('flex items-center gap-1 w-fit', cfg.className)}>
                        <Icon className={cn('h-3 w-3', exec.status === 'running' && 'animate-spin')} />
                        {cfg.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center text-sm text-muted-foreground">
                      {exec.eventsCount} / {exec.playersCount}
                    </TableCell>
                    <TableCell className="text-center font-medium text-green-700">{exec.createdCount}</TableCell>
                    <TableCell className="text-center">{exec.skippedCount}</TableCell>
                    <TableCell className="text-center">
                      <span className={exec.failedCount > 0 ? 'text-red-600 font-medium' : ''}>
                        {exec.failedCount}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(exec.executedAt), 'dd/MM/yyyy HH:mm', { locale: fr })}
                    </TableCell>
                    <TableCell className="text-sm">
                      {exec.executedBy ? (
                        <span className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5 text-muted-foreground" />
                          Admin #{exec.executedBy}
                        </span>
                      ) : (
                        <span className="text-muted-foreground italic">Automatique</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}