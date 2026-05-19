// src/lib/trpc.ts
import type { AppRouter } from '@obc-app/trpc/router';
import { createTRPCReact } from '@trpc/react-query';

export const trpc = createTRPCReact<AppRouter>();