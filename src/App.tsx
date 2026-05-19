import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './AppRouter';
import { TRPCProvider } from './lib/trpc-client';
import { useAuth } from './hooks/useAuth';
import { useEffect } from 'react';


export default function App() {
  const { restoreSession, isLoading } = useAuth();

  useEffect(() => {
    restoreSession();
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Chargement...</div>;
  }
  
  return (
    <TRPCProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </TRPCProvider>
  );
}