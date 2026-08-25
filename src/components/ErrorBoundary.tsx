import { useRouteError } from 'react-router-dom';

export function ErrorBoundary() {
  const error = useRouteError() as { status?: number; statusText?: string; message?: string };

  console.log(`error: ${error.message}`);

  return (
    <div className="flex flex-col items-center justify-center h-64">
      <h2 className="text-xl font-bold text-red-600">Une erreur est survenue</h2>
      <p className="text-muted-foreground">{error.statusText || error.message || 'Erreur inconnue'}</p>
    </div>
  );
}