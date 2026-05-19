// src/lib/trpc-client.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { trpc } from './trpc';
import { useAuth } from '../hooks/useAuth';

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const { access_token } = useAuth();
  const queryClient = new QueryClient();
  const trpcClient = trpc.createClient({
    links: [
      httpBatchLink({
        url: '/trpc',
        headers() {
          return access_token ? { Authorization: `Bearer ${access_token}` } : {};
        },
      }),
    ],
  });

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}