import { Server } from "@/infra";

const port = 3333;
const server = new Server(port);
server.bootstrap();