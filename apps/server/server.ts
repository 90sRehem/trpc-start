import express from "express";
import { appRouter } from "./trpc"
import cors from "cors";
import { createExpressMiddleware } from "@trpc/server/adapters/express"
import { generateOpenApiDocument, createOpenApiExpressMiddleware } from 'trpc-openapi';
import swaggerUi from 'swagger-ui-express';

const openApiDocument = generateOpenApiDocument(appRouter, {
    title: 'tRPC OpenAPI',
    version: '1.0.0',
    baseUrl: 'http://localhost:8080',
});

const app = express();
const port = 8080;

app.use(cors())
app.use("/api", createExpressMiddleware({
    router: appRouter,
}))

app.use("/api/docs", createOpenApiExpressMiddleware({
    router: appRouter,
}))

app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.get("/", (req, res) => {
    res.send("Hello from server");
});

app.listen(port, () => {
    console.log(`server listening at http://localhost:${port}`);
});

// Export only the type of a router!
// This prevents us from importing server code on the client.
export type AppRouter = typeof appRouter;