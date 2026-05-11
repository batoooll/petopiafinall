import http from "http";
import { Server } from "socket.io";
import app from "./app";
import { initChatSocketServer } from "./modules/chat/chat.socket";

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

initChatSocketServer(io);

const port = Number(process.env.PORT) || 3000;

server.listen(port);
