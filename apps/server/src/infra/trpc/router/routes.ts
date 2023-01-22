import { authRouter } from "./authRouter";
import { helloRouter } from "./hello.router";
import { createRouter } from "./router.config";

export const appRouter = createRouter({
    greeting: helloRouter,
    auth: authRouter,
})