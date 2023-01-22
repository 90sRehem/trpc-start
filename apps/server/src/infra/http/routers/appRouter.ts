import { createRouter } from "../trpc";
import { authRouter } from "./authRouter";
import { helloRouter } from "./helloRouter";
import { postsRouter } from "./postsRouter";
import { usersRouter } from "./usersRouter";

export const appRouter = createRouter({
    auth: authRouter,
    users: usersRouter,
    posts: postsRouter,
    greeting: helloRouter,
});

export type AppRouter = typeof appRouter;