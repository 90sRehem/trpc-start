import { z } from "zod";
import { createRouter, publicProcedure } from "../trpc";

export const helloRouter = createRouter({
    hello: publicProcedure
        .meta({
            openapi: {
                method: 'GET',
                path: '/hello',
                tags: ['hello'],
                summary: 'Hello world',
            },
        })
        .input(z.object({ name: z.string().optional() }))
        .output(z.object({ message: z.string() }))
        .query(({ input }) => {
            return { message: `Hello ${input?.name ?? 'world'}` };
        }),
});