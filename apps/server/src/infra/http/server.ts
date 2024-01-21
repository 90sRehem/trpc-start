import express from "express";
import cors from "cors";
import swaggerUi from 'swagger-ui-express';
import { createExpressMiddleware } from "@trpc/server/adapters/express";

import { appRouter } from "./routers";
import { createOpenApiExpressMiddleware } from "trpc-openapi";
import { openApiDocument } from "./openapi";
import { createContext } from "./context";

export class Server {
    private app: express.Application;
    private port: number;

    constructor(port: number) {
        this.app = express();
        this.port = port;
    }

    public bootstrap() {
        this.setupMiddlewares();
        this.setupRoutes();
        this.app.listen(this.port, () => {
            console.log(`server listening at http://localhost:${this.port}`);
        });
    }

    private setupMiddlewares() {
        this.app.use(cors())
        this.app.disable('x-powered-by');
    }

    private setupRoutes() {
        this.app.use("/api", createExpressMiddleware({
            router: appRouter,
            createContext
        }))
        
        this.app.use("/docs/api", createOpenApiExpressMiddleware({
            router: appRouter,
            createContext
        }))
        
        this.app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));
        
        this.app.get("/", (req, res) => {
            res.send("Hello from server");
        });
    }
}