import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import jwt from 'jsonwebtoken';

import { database } from "@/database";
import { createRouter, protectedProcedure, publicProcedure } from "../trpc";
import { jwtSecret } from "@/config";

export const authRouter = createRouter({
    register: protectedProcedure
        .meta({
            openapi: {
                method: 'POST',
                path: '/auth/register',
                tags: ['auth'],
                summary: 'Register as a new user',
            },
        })
        .input(
            z.object({
                email: z.string().email(),
                passcode: z.preprocess(
                    (arg) => (typeof arg === 'string' ? parseInt(arg) : arg),
                    z.number().min(1000).max(9999),
                ),
                name: z.string().min(3),
            }),
        )
        .output(
            z.object({
                user: z.object({
                    id: z.string().uuid(),
                    email: z.string().email(),
                    name: z.string().min(3),
                }),
            }),
        )
        .mutation(({ input }) => {
            let user = database.users.find((_user) => _user.email === input.email);

            if (user) {
                throw new TRPCError({
                    message: 'User with email already exists',
                    code: 'UNAUTHORIZED',
                });
            }

            user = {
                id: randomUUID(),
                email: input.email,
                passcode: input.passcode,
                name: input.name,
            };

            database.users.push(user);

            return { user: { id: user.id, email: user.email, name: user.name } };
        }),
    login: publicProcedure
        .meta({
            openapi: {
                method: 'POST',
                path: '/auth/login',
                tags: ['auth'],
                summary: 'Login as an existing user',
            },
        })
        .input(
            z.object({
                email: z.string().email(),
                passcode: z.preprocess(
                    (arg) => (typeof arg === 'string' ? parseInt(arg) : arg),
                    z.number().min(1000).max(9999),
                ),
            }),
        )
        .output(
            z.object({
                token: z.string(),
            }),
        )
        .mutation(({ input }) => {
            const user = database.users.find((_user) => _user.email === input.email);

            if (!user) {
                throw new TRPCError({
                    message: 'User with email not found',
                    code: 'UNAUTHORIZED',
                });
            }
            if (user.passcode !== input.passcode) {
                throw new TRPCError({
                    message: 'Passcode was incorrect',
                    code: 'UNAUTHORIZED',
                });
            }

            return {
                token: jwt.sign(user.id, jwtSecret),
            };
        }),
});