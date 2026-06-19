import { Server as SocketServer } from "socket.io";
import { createServer } from "http";
import type { Express } from "express";
export type HttpServer = ReturnType<typeof createServer>;
export declare function initSocket(httpServer: HttpServer): SocketServer;
export declare function getIO(): SocketServer;
export declare function createHttpServer(app: Express): HttpServer;
//# sourceMappingURL=socket.d.ts.map