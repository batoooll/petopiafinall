import type { JwtPayload } from "../common/utils/jwt";

declare module "socket.io" {
  interface SocketData {
    user: JwtPayload;
  }
}
