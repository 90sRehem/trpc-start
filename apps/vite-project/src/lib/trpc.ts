// utils/trpc.ts
import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '../path/to/router.ts';

export const trpc = createTRPCReact<AppRouter>();