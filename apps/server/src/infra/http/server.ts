import express from "express";
import cors from "cors";
import swaggerUi from 'swagger-ui-express';
import { createExpressMiddleware } from "@trpc/server/adapters/express";

import { appRouter, createContext } from "./router";
import { createOpenApiExpressMiddleware } from "trpc-openapi";
import { openApiDocument } from "./openapi";

const app = express();
const port = 8080;

app.use(cors())

app.use("/api/trpc", createExpressMiddleware({
    router: appRouter,
    createContext,
}))

app.use("/api", createOpenApiExpressMiddleware({
    router: appRouter,
    createContext,
}))

app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.get("/", (req, res) => {
    res.send("Hello from server");
});

app.listen(port, () => {
    console.log(`server listening at http://localhost:${port}`);
});