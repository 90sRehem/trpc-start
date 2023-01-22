import { authRouter } from "./authRouter";
import { helloRouter } from "./hello.router";
import { postsRouter } from "./postsRouter";
import { createRouter } from "./router.config";
import { usersRouter } from "./usersRouter";

export const appRouter = createRouter({
    greeting: helloRouter,
    auth: authRouter,
    users: usersRouter,
    posts: postsRouter
})