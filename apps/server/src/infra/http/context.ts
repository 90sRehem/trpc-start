import { CreateExpressContextOptions } from "@trpc/server/adapters/express";
// import { Context } from "./trpc";
import { randomUUID } from "node:crypto"
import jwt from 'jsonwebtoken';
import * as trpc from '@trpc/server';
import { User, database } from "@/database";

const jwtSecret = "my-secret";

type IContext = {
    user: User | null;
    requestId: string;
};

export const createContext = async ({
    req,
    res,
}: // eslint-disable-next-line @typescript-eslint/require-await
    CreateExpressContextOptions): Promise<IContext> => {
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

export type Context = trpc.inferAsyncReturnType<typeof createContext>;