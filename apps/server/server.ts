import express from "express";
import { trpcExpressAdapter } from "./trpc"
import cors from "cors";

const app = express();
const port = 8080;

app.use(cors())
app.use("/api", trpcExpressAdapter)

app.get("/", (req, res) => {
    res.send("Hello from server");
});

app.listen(port, () => {
    console.log(`server listening at http://localhost:${port}`);
});
