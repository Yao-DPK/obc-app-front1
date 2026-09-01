// src/components/payments/PaymentStats.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, CreditCard, Clock, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface PaymentStatsProps {
  totalObligations: number;
  totalIntents: number;
  totalAmount: number;
  totalPaid: number;
  totalRemaining: number;
  pendingIntents: number;
  pendingObligations: number;
  isLoading?: boolean;
  className?: string;
}

export function PaymentStats({
  totalObligations,
  totalIntents,
  totalAmount,
  totalPaid,
  totalRemaining,
  pendingIntents,
  pendingObligations,
  isLoading = false,
  className,
}: PaymentStatsProps) {
  if (isLoading) {
    return (
      <div className={cn('grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4', className)}>
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
      label: 'Obligations',
      value: totalObligations,
      icon: CreditCard,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      label: 'Intents',
      value: totalIntents,
      icon: CreditCard,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      label: 'Montant total',
      value: `${totalAmount.toLocaleString()} FCFA`,
      icon: DollarSign,
      color: 'text-primary bg-primary/10',
    },
    {
      label: 'Payé',
      value: `${totalPaid.toLocaleString()} FCFA`,
      icon: CheckCircle,
      color: 'text-green-600 bg-green-50',
    },
    {
      label: 'Reste à payer',
      value: `${totalRemaining.toLocaleString()} FCFA`,
      icon: TrendingUp,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      label: 'Obligations en attente',
      value: pendingObligations,
      icon: Clock,
      color: 'text-orange-600 bg-orange-50',
    },
    {
      label: 'Intentions en attente',
      value: pendingIntents,
      icon: Clock,
      color: 'text-orange-600 bg-orange-50',
    },
  ];

  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4', className)}>
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