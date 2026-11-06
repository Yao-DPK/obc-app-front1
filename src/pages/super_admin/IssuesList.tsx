// src/components/admin/jobs/IssuesList.tsx
import { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  AlertTriangle, CheckCircle2, ChevronDown, ChevronUp,
  RefreshCw, Loader2, User, FileText,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import type { MonthlyJobIssue } from '@/types';

interface Props {
  failedIssues: MonthlyJobIssue[];
  skippedIssues: MonthlyJobIssue[];
  isLoading: boolean;
  isRetrying: boolean;
  onRetry: (issueIds: number[]) => Promise<void>;
}

export function IssuesList({ failedIssues, skippedIssues, isLoading, isRetrying, onRetry }: Props) {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [showSkipped, setShowSkipped] = useState(false);

  const unresolvedFailed = failedIssues.filter((i) => !i.resolvedAt);
  const allUnresolvedSelected =
    unresolvedFailed.length > 0 && selectedIds.length === unresolvedFailed.length;

  const toggleSelectAll = () => {
    setSelectedIds(
      allUnresolvedSelected ? [] : unresolvedFailed.map((i) => i.id),
    );
  };

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleRetry = async (ids: number[]) => {
    if (ids.length === 0) return;
    await onRetry(ids);
    setSelectedIds((prev) => prev.filter((id) => !ids.includes(id)));
  };

  return (
    <div className="space-y-4">
      {/* ====== FAILED ====== */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Échecs à régénérer
            <Badge variant="secondary">{unresolvedFailed.length} non résolu(s)</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : unresolvedFailed.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <CheckCircle2 className="h-10 w-10 text-green-400 mb-2" />
              <p className="text-sm text-muted-foreground">Aucun échec à régénérer</p>
            </div>
          ) : (
            <div>
              {/* Barre d'action groupe */}
              <div className="flex flex-wrap items-center gap-2 p-3 border-b bg-gray-50/50">
                <Checkbox
                  id="select-all-failed"
                  checked={allUnresolvedSelected}
                  onCheckedChange={toggleSelectAll}
                />
                <label htmlFor="select-all-failed" className="text-sm cursor-pointer flex-1">
                  Tout sélectionner ({selectedIds.length}/{unresolvedFailed.length})
                </label>
                <Button
                  size="sm"
                  onClick={() => handleRetry(selectedIds)}
                  disabled={selectedIds.length === 0 || isRetrying}
                  className="gap-1"
                >
                  {isRetrying ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <RefreshCw className="h-3.5 w-3.5" />
                  )}
                  Régénérer la sélection ({selectedIds.length})
                </Button>
              </div>

              <div className="divide-y">
                {unresolvedFailed.map((issue) => (
                  <div key={issue.id} className="flex items-center gap-3 p-3 hover:bg-gray-50/50">
                    <Checkbox
                      checked={selectedIds.includes(issue.id)}
                      onCheckedChange={() => toggleSelect(issue.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium flex items-center gap-1">
                          <User className="h-3.5 w-3.5 text-muted-foreground" />
                          {issue.playerName ?? `Joueur #${issue.playerId}`}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          {issue.eventName ?? `Événement #${issue.eventId}`}
                        </span>
                      </div>
                      {issue.reason && (
                        <p className="text-xs text-red-600 truncate mt-0.5" title={issue.reason}>
                          {issue.reason}
                        </p>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRetry([issue.id])}
                      disabled={isRetrying}
                      className="gap-1 flex-shrink-0"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      Régénérer
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ====== SKIPPED (repliable) ====== */}
      {skippedIssues.length > 0 && (
        <Card>
          <CardHeader
            className="cursor-pointer hover:bg-gray-50/50 transition-colors"
            onClick={() => setShowSkipped(!showSkipped)}
          >
            <CardTitle className="text-base font-semibold flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-gray-400" />
                Sautées (déjà existantes)
                <Badge variant="outline">{skippedIssues.length}</Badge>
              </div>
              {showSkipped ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </CardTitle>
          </CardHeader>
          {showSkipped && (
            <CardContent className="p-0">
              <p className="text-xs text-muted-foreground px-4 py-2 bg-gray-50 border-b">
                Ces obligations existaient déjà pour la période. Aucune action requise.
              </p>
              <div className="divide-y max-h-64 overflow-y-auto">
                {skippedIssues.map((issue) => (
                  <div key={issue.id} className="flex items-center gap-3 p-3 text-sm text-muted-foreground">
                    <User className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="flex-1 truncate">
                      {issue.playerName ?? `Joueur #${issue.playerId}`}
                    </span>
                    <span className="text-xs truncate">
                      {issue.eventName ?? `Événement #${issue.eventId}`}
                    </span>
                    <span className="text-[10px] flex-shrink-0">
                      {format(new Date(issue.createdAt), 'dd/MM HH:mm', { locale: fr })}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
}