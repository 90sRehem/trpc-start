import { initTRPC } from '@trpc/server';
import { OpenApiMeta } from 'trpc-openapi';

const trpc = initTRPC.meta<OpenApiMeta>().create();

export const createRouter = trpc.router;
export const middleware = trpc.middleware;
export const publicProcedure = trpc.procedure;

