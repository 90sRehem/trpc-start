import { User, database } from '@/database';
import { TRPCError, initTRPC } from '@trpc/server';
import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { OpenApiMeta } from 'trpc-openapi';
import { randomUUID } from "node:crypto"
import jwt from 'jsonwebtoken';

export type Context = {
    user: User | null;
    requestId: string;
};

const jwtSecret = 'secret';

const trpc = initTRPC.context<Context>().meta<OpenApiMeta>().create();

export const createRouter = trpc.router;
export const middleware = trpc.middleware;
export const publicProcedure = trpc.procedure;

export const createContext = async ({
    req,
    res,
}: // eslint-disable-next-line @typescript-eslint/require-await
    CreateExpressContextOptions): Promise<Context> => {
    const requestId = randomUUID();
    res.setHeader('x-request-id', requestId);

    let user: User | null = null;

    try {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];
            const userId = jwt.verify(token, jwtSecret) as string;
            if (userId) {
                user = database.users.find((_user) => _user.id === userId) ?? null;
            }
        }
    } catch (cause) {
        console.error(cause);
    }

    return { user, requestId };
};

export const protectedProcedure = trpc.procedure.use(({ ctx, next }) => {
    if (!ctx.user) {
        throw new TRPCError({
            message: 'User not found',
            code: 'UNAUTHORIZED',
        });
    }
    return next({ ctx: { ...ctx, user: ctx.user } });
});
