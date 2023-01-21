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
        summary: 'Say hello',
        description: 'Say hello to the world',
        method: 'GET',
        path: '/api/hello',
      },
    })
    .input(
      z
        .object({
          text: z.string().optional(),
        })
        .optional(),
    )
    .output(
      z.string()
    )
    .query(({ input }) => {
      return `Hello ${input?.text ?? 'world'}!`;
    })
})

