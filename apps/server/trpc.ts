import { initTRPC } from '@trpc/server';
import { OpenApiMeta } from 'trpc-openapi';
import { z } from 'zod';

// You can use any variable name you like.
// We use t to keep things simple.
const t = initTRPC.meta<OpenApiMeta>().create();

export const router = t.router;
export const middleware = t.middleware;
export const publicProcedure = t.procedure;
export const appRouter = router({
  greeting: publicProcedure.query(() => 'hello tRPC v10!'),
  hello: publicProcedure
  .meta({
    openapi: {
      method: 'GET',
      path: '/hello',
      tags: ['teste'],
      summary: 'Hello world',
    },
  })
  .input(
    z.object({
      name: z.string().optional(),
    }).optional(),
  )
  .output(
    z.object({
      message: z.string(),
    }),
  )
  .query(({ input }) => {
    return { message: `Hello ${input?.name ?? 'world'}` };
  }),
})

