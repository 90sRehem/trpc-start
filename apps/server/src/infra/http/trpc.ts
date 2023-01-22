import { TRPCError, initTRPC } from "@trpc/server";
import { OpenApiMeta } from "trpc-openapi";
import { Context } from "./context";

const t = initTRPC
.context<Context>()
.meta<OpenApiMeta>()
.create({
    errorFormatter: ({ error, shape }) => {
        if (error.code === 'INTERNAL_SERVER_ERROR' && process.env.NODE_ENV === 'production') {
            return { ...shape, message: 'Internal server error' };
        }
        return shape;
    },
});

export const createRouter = t.router;
export const middleware = t.middleware;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
    if (!ctx.user) {
        throw new TRPCError({
            message: undefined,
            code: 'UNAUTHORIZED',
        });
    }
    return next({ ctx: { ...ctx, user: ctx.user } });
});
