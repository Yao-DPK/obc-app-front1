// src/components/common/UserLoader.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { User } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import api from '@/lib/axios';

interface UserLoaderProps {
  userIdParam?: string; // nom du paramètre dans l'URL (ex: "userId")
  children: (user: User) => React.ReactNode;
}

export function UserLoader({ userIdParam = 'userId', children }: UserLoaderProps) {
  const params = useParams();
  const userId = params[userIdParam];
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setError("Aucun identifiant d'utilisateur fourni");
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      setLoading(true);
      try {
        // Remplacer par votre vraie API
        console.log("Accessiing user api");
        const { data } = await api.get(`/api/users/${userId}`);
        setUser(data);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || "Erreur lors du chargement de l'utilisateur");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="space-y-4">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error || "Utilisateur introuvable"}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return <>{children(user)}</>;
}