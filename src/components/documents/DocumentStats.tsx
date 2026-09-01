// src/components/documents/DocumentStats.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock, XCircle, Upload, File } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface DocumentStatsProps {
  totalTypes: number;
  provided: number;
  pending: number;
  validated: number;
  rejected: number;
  isLoading?: boolean;
  className?: string;
}

export function DocumentStats({
  totalTypes,
  provided,
  pending,
  validated,
  rejected,
  isLoading = false,
  className,
}: DocumentStatsProps) {
  if (isLoading) {
    return (
      <div className={cn('grid grid-cols-2 md:grid-cols-4 gap-4', className)}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-20" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const stats = [
    {
      label: 'Types de documents',
      value: totalTypes,
      icon: File,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      label: 'Fournis',
      value: provided,
      icon: Upload,
      color: 'text-green-600 bg-green-50',
    },
    {
      label: 'En attente',
      value: pending,
      icon: Clock,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      label: 'Validés',
      value: validated,
      icon: CheckCircle,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      label: 'Rejetés',
      value: rejected,
      icon: XCircle,
      color: 'text-red-600 bg-red-50',
    },
  ];

  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-5 gap-4', className)}>
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.label}
            </CardTitle>
            <div className={cn('p-1.5 rounded-lg', stat.color)}>
              <stat.icon className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}