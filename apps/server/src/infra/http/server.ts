import express from "express";
import cors from "cors";
import swaggerUi from 'swagger-ui-express';
import { createExpressMiddleware } from "@trpc/server/adapters/express";

import { appRouter, openApiDocument } from "../trpc";
import { createOpenApiExpressMiddleware } from "trpc-openapi";

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