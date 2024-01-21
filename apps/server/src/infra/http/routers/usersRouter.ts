import { database } from "@/database";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter, publicProcedure } from "../trpc";

export const usersRouter = createRouter({
    getUsers: publicProcedure
      .meta({
        openapi: {
          method: 'GET',
          path: '/users',
          tags: ['users'],
          summary: 'Read all users',
        },
      })
      .input(z.void())
      .output(
        z.object({
          users: z.array(
            z.object({
              id: z.string().uuid(),
              email: z.string().email(),
              name: z.string(),
            }),
          ),
        }),
      )
      .query(() => {
        const users = database.users.map((user) => ({
          id: user.id,
          email: user.email,
          name: user.name,
        }));
  
        return { users };
      }),
    getUserById: publicProcedure
      .meta({
        openapi: {
          method: 'GET',
          path: '/users/{id}',
          tags: ['users'],
          summary: 'Read a user by id',
        },
      })
      .input(
        z.object({
          id: z.string().uuid(),
        }),
      )
      .output(
        z.object({
          user: z.object({
            id: z.string().uuid(),
            email: z.string().email(),
            name: z.string(),
          }),
        }),
      )
      .query(({ input }) => {
        const user = database.users.find((_user) => _user.id === input.id);
  
        if (!user) {
          throw new TRPCError({
            message: 'User not found',
            code: 'NOT_FOUND',
          });
        }
  
        return { user };
      }),
  });